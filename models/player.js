const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

const playerSchema = mongoose.Schema({
    MobileNo: Number,
    FFID: Number,
    FFNAME: String,
    password: String,
    unHasedPassword: String,
    solomatchwiningcounts: Number,
    duomatchwiningcounts: Number,
    squadmatchwiningcounts: Number,
    solomatchwiningdiamonds: Number,
    duomatchwiningdiamonds: Number,
    squadmatchwiningdiamonds: Number,
    totaldiamonds: Number,
    fcmToken: { type: String, required: false },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Player', playerSchema);