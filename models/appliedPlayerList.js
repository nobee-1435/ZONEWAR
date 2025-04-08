const mongoose = require('mongoose');


const appliedPlayerListSchema = mongoose.Schema({
    matchFullDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'matchFullDetails'
    },
    MDmatchId: String,
    playerName : String,
    playerId: String,
    matchType: String,
    entryAmount: String,
    paymentMethod: String,
    matchStartingTime: String,
    TransactionId: Number,
    selectbtn: String,
    rejectbtn: String,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('appliedPlayerList', appliedPlayerListSchema)