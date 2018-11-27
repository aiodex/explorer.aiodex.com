// Invoke 'strict' JavaScript mode
'use strict';

var _ = require('mix-dash'),
    SmartRPC = require('smart-rpc'),
    CronJob = require('cron').CronJob,
    // logger = require('../logger'),
    // Queue = require('bee-queue'),
    LRU = require("lru-cache"),
    Sync = require('./sync'),
    moment = require("moment"),
    log4js = require('../logger'),
    Coin = require('../model/coin'),
    Address = require('../model/address'),
    config = require('../config');

var Console = log4js.getLogger();




module.exports = {

    queue: function (MQ) {
        var queue = MQ.queue('explr-sync');
        queue.attach();
        return queue;
    },

    scan: function (MQ) {

        var queue = this.queue(MQ);

        var cache = LRU(500);

        // MQ.on('offline', function () {
        //     // the bus is offline - redis is down...
        //     queue.close();
        //     console.log('MQ: removing all messages.');
        // });

        //catches ctrl+c event
        process.on('SIGINT', function () {
            queue.close();
            console.log('Sync: removing all messages.');
        });

        process.on('exit', function () {
            queue.close();
            console.log('Sync: removing all messages.');
        });

        Coin.updateMany({ stt: 1 }, { stt: 0, at: moment().add(10, 's').unix() }, () => { });

        new CronJob('*/10 * * * * *', function () {
            var at = moment().unix();
            Coin.find({ stt: 0, at: { $lte: at } }).sort({ at: 1 }).limit(10).exec((err, docs) => {
                //console.log(docs);
                if (docs && docs.length > 0) {
                    for (let i = 0; i < docs.length; i++) {
                        const doc = docs[i];
                        queue.push({ data: doc, id: doc._id, act: 'sync' });

                        queue.push({ id: doc._id, act: 'mn' });

                        queue.push({ id: doc._id, act: 'winner' });

                    }

                    var _ids = _.uniq(_.map(docs, '_id'));
                    Coin.updateMany({ _id: { $in: _ids } }, { at: moment().add(1, 'minute').unix(), stt: 1 }, () => { });
                }

            });



            // cal address balance
            Address.find({ at: { $lte: at } }).limit(200).exec((err, docs) => {

                if (docs && docs.length > 0) {
                    for (let i = 0; i < docs.length; i++) {
                        const doc = docs[i];
                        setTimeout(function () {
                            queue.push({ data: doc._id, id: doc.cid, act: 'balance' });
                        }, i * 8);
                        // queue.push({ data: doc._id, id: doc.cid, act: 'balance' });

                    }
                }
            });

        }, null, true);


        new CronJob('*/59 * * * * *', function () {

            Coin.updateMany({ stt: 1, at: { $lt: moment().add(-3,'minutes').unix() }, $where: 'this.idx == this.h' }, { stt: 0 }, () => { });

        }, null, true);

        // new CronJob('*/59 * * * * *', function () {
        //     queue.push({ id: 'GeekCash', act: 'winner' });
        // }, null, true);

        //Listen block & transation
        var options = _.values(config.coins).filter(c => !c.disabled);
        SmartRPC.listen(options);
        // SmartRPC.on('block', (rpc, val) => {
        //     console.log('%s new block %s %s', rpc.id, val.height, val.hash);
        //     queue.push({ id: rpc.id, data: val, act: 'block' });
        // });

        SmartRPC.on('tx', (rpc, val) => {

            var i = cache.get(rpc.id);
            var time = i ? i + 1 : 1;
            cache.set(rpc.id, time, 15 * 60);
            Console.info('%s new tx %s', rpc.id, val.txid);
            queue.push({ id: rpc.id, data: val, act: 'tx', delay: time * 400 });

        });


    },

    run: function (bus) {
        var queue = this.queue(bus);
        queue.consume();
        queue.on("message", function (msg, id) {
            new Sync(JSON.parse(msg));
        });
    }

};
