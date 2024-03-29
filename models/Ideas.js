const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeasSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ideas', IdeasSchema);