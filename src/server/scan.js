
var SmartRPC = require('smart-rpc'),
    Sync = require('./jobs/sync'),
    mongoose = require('mongoose'),
    config = require('./config');


console.log('node scan GEEK 1000 2000');
console.log('node scan GEEK tx 4f2c67e32ec3241274e1e8ca003808890c3017200ebdb9963fce55be19c7dc00');
console.log('node scan GEEK block 0000000000f1445de4eb38674166dd95bebe97fdcb1a67afe0d307e6ed6fb4a1');

var id = process.argv[2].toUpperCase().trim();
var act = process.argv[3].toLowerCase().trim();

var o = config.coins[id];

if (!o) {
    console.log('This coin has not been configured yet.');
    process.exit(0);
}

(async () => {

    // console.log('start scan', id, from, to);

    mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true });

    try {

        var client = SmartRPC.create(o);
        switch (act) {
            case 'tx':
                var tx = process.argv[4].trim();
                var t = await client.getRawTransaction(tx, 1);
                await new Sync({ id: id, rpc: client }).parseTx(t);

                break;

            case 'block':
                var hash = process.argv[4].trim();
                var b = await client.getBlock(hash);
                var result = await new Sync({ id: id, rpc: client }).block(b);
                console.log(result);

                break;

            default:
                var from = parseInt(process.argv[3]);
                var to = parseInt(process.argv[4]);
                for (let i = from; i <= to; i++) {

                    var hash = await client.getBlockHash(i);
                    var b = await client.getBlock(hash);
                    //await new Sync({ id: id, rpc: client, act: 'block', data: b });
                    await new Sync({ id: id, rpc: client }).block(b);

                }
                break;
        }

        console.log('complete!');

    } catch (error) {
        console.log(error);
    }

})();
