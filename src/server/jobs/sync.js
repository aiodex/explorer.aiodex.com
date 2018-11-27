// Invoke 'strict' JavaScript mode
'use strict';

var _ = require('mix-dash'),
    moment = require('moment'),
    SmartRPC = require('smart-rpc'),
    Hash = require('mix-hash'),
    log4js = require('../logger'),
    conf = require('../config'),
    Tx = require('../model/tx'),
    Block = require('../model/block'),
    Masternode = require('../model/masternode'),
    Transaction = require('../model/transaction'),
    Coin = require('../model/coin'),
    Address = require('../model/address');

var Console = log4js.getLogger();
var Log = log4js.getLogger('sync');


module.exports = class Sync {
    constructor(o) {

        var option = this.option = conf.coins[o.id];

        if (!option) {

            throw new Error('This coin has not been configured yet.');
        }

        if (option.disabled) return;

        this.id = o.id;
        this.data = o.data;
        this.rpc = o.rpc ? o.rpc : SmartRPC.create(Object.assign(option, { listen: 0 }));


        (async () => {

            switch (o.act) {
                case 'sync':
                    await this.sync();
                    break;

                case 'tx':
                    await this.delay(o.delay || this.option.delay);
                    await this.parseTx(o.data);
                    break;

                case 'block':
                    await this.block(o.data);
                    break;

                case 'balance':
                    await this.balance(o.data);
                    break;

                case 'winner':
                    if (option.masternode)
                        await this.winners();
                    break;

                case 'mn':
                    if (option.masternode)
                        await this.masternode('full');
                    break;

            }

            if (_.isFunction(o.callback)) {
                o.callback.apply();
            }

        })();
    }


    stats = async () => {

        // console.log(this.rpc);

        var height = await this.rpc.getBlockCount();
        var diff = await this.rpc.getDifficulty();
        //var peers = await this.rpc.getConnectionCount();
        var hashrate = await this.rpc.getNetworkHashps();

        var coinbase = await Address.findById(this.id);
        this.data = await Coin.findByIdAndUpdate(this.id, { h: height, diff: diff, pow: hashrate, sup: coinbase ? coinbase.sent : 0 }, { new: true, upsert: true, setDefaultsOnInsert: true });

    };


    sync = async () => {
        try {
            await this.stats();
            var height = this.data.h;
            // Console.warn('sync', this.id, height);

            if (this.data.idx < height) {
                for (let x = this.data.idx; x <= height; x++) {

                    var hash = await this.rpc.getBlockHash(x);
                    var block = await this.rpc.getBlock(hash);
                    //console.log('%s %s', x, JSON.stringify(block.result, null, '\t'));
                    await this.block(block);
                    await Coin.updateOne({ _id: this.id }, { idx: x });

                }
            }


        } catch (error) {
            await Coin.updateOne({ _id: this.id }, { at: moment().add(5, 'minutes').unix() });
            Log.error('sync', this.id, this.data, error);
            Console.error('sync', this.id, error);
            

        } finally {
            await Coin.updateOne({ _id: this.id }, { stt: 0 });
        }


    };



    block = async (b) => {


        for (let y = 0; y < b.tx.length; y++) {
            try {
                const tx = b.tx[y];
                var t = await this.rpc.getRawTransaction(tx, 1);
                await this.parseTx(t, b.height);
                if (y % 50 == 0) {
                    Console.info(this.id, b.height, b.tx.length, y, t.txid);
                    await this.delay(this.option.delay);
                }
            } catch (error) {
                Log.error('tx', this.id, t, error);
            }

        }

        return await Block.findByIdAndUpdate(b.hash, {
            cid: this.id,
            tt: b.time,
            idx: b.height,
            sz: b.size,
            bits: b.bits,
            n: b.nonce,
            diff: b.difficulty,
            prv: b.previousblockhash,
            nxt: b.nextblockhash,
            __v: b.version

        }, { new: true, upsert: true, setDefaultsOnInsert: true });



    };

    parseTx = async (tx, height) => {
        var r = await this.parseInOut(tx.vin, tx.vout);

        await this.transaction(r.vin, tx, 0);
        await this.transaction(r.vout, tx, 1);

        return await Tx.findByIdAndUpdate(tx.txid, {
            cid: this.id,
            tt: tx.time,
            bid: tx.blockhash,
            idx: height,
            sz: tx.size,
            val: r.total,
            in: r.vin,
            out: r.vout

        }, { new: true, upsert: true, setDefaultsOnInsert: true });


    };

    parseInOut = async (vin, vout) => {

        var $ = this;
        var _vins = [], _vouts = [], _total = 0;


        for (let x = 0; x < vin.length; x++) {
            const i = vin[x];

            if (i.coinbase) {
                var _val = _.sumBy(vout, 'value');
                _vins.push({ _id: $.id, val: _val });
            } else {

                var tx = await $.rpc.getRawTransaction(i.txid, 1);
                if (tx) {
                    // console.log("vin:", JSON.stringify(tx.vout, null, '\t'));                  

                    tx.vout.forEach(function (t) {
                        if (t.n == i.vout && t.scriptPubKey.addresses) {
                            _vins.push({ _id: t.scriptPubKey.addresses[0], val: t.value });
                        }
                    });
                }

                await $.delay($.option.delay);
            }

        };

        // vout

        if (vout && vout.length > 0) {

            for (let i = 0; i < vout.length; i++) {
                var o = vout[i];
                if (o.scriptPubKey && o.value > 0) {
                    var t = o.scriptPubKey.type;
                    if (t != 'nonstandard' && t != 'nulldata' && t != 'zerocoinmint' && o.scriptPubKey.addresses) {
                        _vouts.push({ _id: o.scriptPubKey.addresses[0], val: o.value });
                    }
                }

            }
            // vout.forEach(i => {
            //     if (i.scriptPubKey.type != 'nonstandard' && i.scriptPubKey.type != 'nulldata') {
            //         _vouts.push({ _id: i.scriptPubKey.addresses[0], val: i.value });
            //     }
            // });

            // PoS
            if (vout[0].type == 'data' || (vout[0].scriptPubKey && vout[0].scriptPubKey.type == 'nonstandard')) {
                if (_vins.length > 0 && _vouts.length > 0) {
                    if (_vins[0]._id == _vouts[0]._id) {

                        _vouts[0].val = _vouts[0].val - _vins[0].val;
                        _vins.shift();
                    }
                }
            }


        }

        _vins = _(_vins).groupBy('_id').map((tx, _id) => ({ _id: _id, val: parseFloat(_.sumBy(tx, 'val')) })).value();

        _vouts = _(_vouts).groupBy('_id').map((tx, _id) => ({ _id: _id, val: parseFloat(_.sumBy(tx, 'val')) })).value();



        _total = _.sumBy(_vouts, 'val').toFixed(8);

        // pos
        if (_vins.length == 0) {
            _vins.push({ _id: $.id, val: _total, tp: 'pos' });
        }

        return Promise.resolve({ vin: _vins, vout: _vouts, total: _total });


    };


    // balance = async (tx) => {

    //     var _ids = _.uniq(_.map(tx, '_id'));

    //     var _match = { wid: { $in: _ids } };

    //     var results = await Transaction.aggregate([
    //         { $match: _match },
    //         {
    //             $group: {
    //                 _id: '$wid',
    //                 sent: { $sum: { $cond: [{ $eq: ["$tp", 0] }, '$val', 0] } },
    //                 receive: { $sum: { $cond: [{ $eq: ["$tp", 1] }, '$val', 0] } }
    //             }
    //         }]).allowDiskUse(true).exec();

    //     for (let i = 0; i < results.length; i++) {
    //         const a = results[i];
    //         await Address.findByIdAndUpdate(a._id, { cid: this.id, bl: a.receive - a.sent, sent: a.sent, rec: a.receive }, { new: true, upsert: true, setDefaultsOnInsert: true });

    //     }

    // };

    balance = async (id) => {

        var results = await Transaction.aggregate([
            { $match: { wid: id } },
            {
                $group: {
                    _id: '$wid',
                    sent: { $sum: { $cond: [{ $eq: ["$tp", 0] }, '$val', 0] } },
                    receive: { $sum: { $cond: [{ $eq: ["$tp", 1] }, '$val', 0] } }
                }
            }]).allowDiskUse(true).exec();

        for (let i = 0; i < results.length; i++) {
            const a = results[i];
            //Console.info('balance', a._id, a.receive - a.sent, a.sent, a.receive);
            await Address.findByIdAndUpdate(a._id, { bl: a.receive - a.sent, sent: a.sent, rec: a.receive, at: moment().add(99, 'years').unix() });

        }

    };

    transaction = async (arr, tx, type) => {


        for (let i = 0; i < arr.length; i++) {
            var a = arr[i];
            var id = Hash.genId(tx.txid, a._id, type);
            await Transaction.findByIdAndUpdate(id, {
                cid: this.id,
                wid: a._id,
                val: a.val,
                tp: type,
                tx: tx.txid,
                tt: tx.time
            }, { new: true, upsert: true, setDefaultsOnInsert: true });

            // var bl = type == 0 ? Math.abs(a.val) : a.val;
            // var sent = type == 0 ? a.val : 0;
            // var receive = type == 0 ? 0 : a.val;
            // await Address.updateOne({ _id: a._id }, { cid: this.id, at: tx.time, $inc: { bl: bl, rec: receive, sent: sent } }, { new: true, upsert: true, setDefaultsOnInsert: true });

            await Address.findByIdAndUpdate(a._id, { cid: this.id, at: tx.time }, { new: true, upsert: true, setDefaultsOnInsert: true });

        }
    };

    masternode = async (act) => {

        var mn = await this.rpc.masternode('count');

        Coin.updateOne({ _id: this.id }, { mn: mn }, () => { });

        // var mn_en = await Masternode.countDocuments({ stt: { $in: ['ENABLED', 'WATCHDOG_EXPIRED'] } });

        var res = await this.rpc.masternodeList(act);

        _.forOwn(res, async (value, key) => {
            var _obj = {};

            if (act == 'rank') {
                _obj = { rnk: parseInt(value) };
            } else {
                // NEW_START_REQUIRED,70208,Ga1cMQ8ZKZGU3RqXa3brxch76HX54ncZgq,1526979030,0,0,0,125.95.17.142:6889

                var params = value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').split(' ');
                _obj = { cid: this.id, stt: params[0], pro: params[1], wid: params[2], ls: params[3], at: params[4], lp: params[5], lb: params[6], ip: params[7] };

            }
            await Masternode.findByIdAndUpdate(key, _obj, { new: true, upsert: true, setDefaultsOnInsert: true });

        });



    };

    winners = async () => {
        var res = await this.rpc.masternode('winners');

        _.forOwn(res, function (value, key) {
            if (value.toLowerCase() != 'unknown') {
                var wid = value.split(',')[0].split(':')[0];
                var idx = parseInt(key);
                Masternode.updateOne({ wid: wid }, { idx: idx }, () => {
                    // console.log('winner', idx, wid);
                });
            }

        });

    };

    delay = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}