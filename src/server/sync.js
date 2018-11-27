"use strict";
var mongoose = require('mongoose'),
    BusMQ = require('busmq'),
    Job = require('./jobs'),
    config = require('./config');

mongoose.set('useFindAndModify', false);

mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true });

var MQ = BusMQ.create({ redis: config.redis });

MQ.connect();

require('./cluster')('sync',
    () => {
        MQ.on('online', function () {
            Job.scan(MQ);
        });
    }, () => {

        MQ.on('online', function () {
            Job.run(MQ);

        });

    });

// //catches ctrl+c event
// process.on('SIGINT', function () {
//     MQ.disconnect();
// });

// process.on('exit', function () {
//     MQ.disconnect();
// });

