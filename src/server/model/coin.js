var mongoose = require('mongoose'),
    paginate = require("mongoose-paginate");
module.exports = mongoose.model('coin', new mongoose.Schema({
    // coin name
    _id: String,
    // 
    pow: Number,

    diff: Number,
    // current price
    pr: Number,
    // supply
    sup: Number,
    // masternodes
    mn: { type: Number, default: 0 },
    // last index
    idx: { type: Number, default: 1 },
    // current block height
    h: { type: Number, default: 1 },

    stt: { type: Number, default: 0 },
    // order by
    ord: Number,

    // pow unit
    pu: String,

    // Label
    lb: {},

    img: String,
    // name
    nm: String,
    // last time 
    at: { type: Number, default: Date.now },
    crt: { type: Number, default: Date.now }


}, { collection: 'coins' }).plugin(paginate));