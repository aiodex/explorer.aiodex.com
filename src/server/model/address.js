var mongoose = require('mongoose'),
    paginate = require("mongoose-paginate");

module.exports = mongoose.model('address', new mongoose.Schema({
    // Address
    _id: String,
    // Coin Id
    cid: String,
    // balance
    bl: { type: Number, default: 0 },
    // sent 
    sent: { type: Number, default: 0 },
    //received
    rec: { type: Number, default: 0 },

    at: Number

}, { collection: 'addresses' }).plugin(paginate));