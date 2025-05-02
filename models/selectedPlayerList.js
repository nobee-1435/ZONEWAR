const mongoose = require('mongoose');

const selectedPlayerListSchema = mongoose.Schema({
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
    player2Id: String,
    player2Name: String,
    player3Id: String,
    player3Name: String,
    player4Id: String,
    player4Name: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('selectedPlayerList', selectedPlayerListSchema);

