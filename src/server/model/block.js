var mongoose = require('mongoose'),
    paginate = require("mongoose-paginate");

module.exports = mongoose.model('block', new mongoose.Schema({

    _id: String,   
    // Coin Id
    cid: String, 
    // block height
    idx: Number,
    // difficulty
    diff: Number,
    // bits
    bits: String,
     // nonce
    n: Number,
    // size 
    sz: Number,
    // previousblockhash
    prv: String,
    // nextblockhash
    nxt: String,

    tt: Number

}, { collection: 'blocks' }).plugin(paginate));