var mongoose = require('mongoose'),
    paginate = require("mongoose-paginate");

module.exports = mongoose.model('transaction', new mongoose.Schema({

    _id: String,

    cid: String,
    // Address
    tx: String,
    // wallet address 
    wid: String,
    // amount 
    val: Number,
    // in | out
    tp: Number,
    // timestamp
    tt: Number

}, { collection: 'transactions' }).plugin(paginate));