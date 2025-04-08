const mongoose = require('mongoose');

const mainMatchContainerSchema = mongoose.Schema({
    matchFullDetails: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'matchFullDetails'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('mainMatchContainer', mainMatchContainerSchema);