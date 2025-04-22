const mongoose = require('mongoose');

const topupDataSchema = mongoose.Schema({
    playerFFID: Number,
    redeemdiamondValue: Number,
    TopupOrNot: String,
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('TopupData', topupDataSchema);