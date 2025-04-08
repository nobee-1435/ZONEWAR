const mongoose = require('mongoose');

const rejectedPlayerListSchema = mongoose.Schema({
    matchfullDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'matchFullDetails'
    },
    MDmatchId: String,
    appliedplayerMDmatchid: String,
    playerName : String,
    playerId: String,
    matchType: String,
    entryAmount: String,
    paymentMethod: String,
    matchStartingTime: String,
    TransactionId: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('rejectedPlayerList', rejectedPlayerListSchema);

