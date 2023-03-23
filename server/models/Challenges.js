const mongoose = require("mongoose");
const challengeSchema = new mongoose.Schema({
    author: { 
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    acceptedBy: {
        type: String,
        default: null
    },
    points: {
        type: Number,
        default: 20
    },
    challangeState: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        required: false
    }
},
{collection: 'challenges'});

const Challenge = mongoose.model('Challenge', challengeSchema);
module.exports = Challenge;