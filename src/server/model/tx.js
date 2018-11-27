var mongoose = require('mongoose'),
    paginate = require("mongoose-paginate");

module.exports = mongoose.model('tx', new mongoose.Schema({
    // tx hash
    _id: String,
    
    // coin id
    cid: String,

    // block hash
    bid: String,

    // block index
    idx: Number,

    // timestamp 
    tt: Number,

    // total value   
    val: Number,
    // size
    sz: Number,
    out: [{ _id: String, val: Number }],
    in: [{ _id: String, val: Number, tp: String }]

}, { collection: 'tx' }).plugin(paginate));