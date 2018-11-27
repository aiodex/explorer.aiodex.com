var mongoose = require("mongoose"),
    paginate = require("mongoose-paginate");

module.exports = mongoose.model("masternode",
    new mongoose.Schema({
        _id: String,

        cid: String,
        ip: String,
        //status 
        stt: String,
        // address payee
        wid: String,
        // last seen
        ls: Number,
        // last payment
        lp: Number,

        // last block paid
        lb: Number,
        // active
        at: Number,
        // protocol
        pro: Number,
        // rank
        rnk: Number,

        // block win
        idx: Number

    }, { collection: "masternodes" }).plugin(paginate)
);
