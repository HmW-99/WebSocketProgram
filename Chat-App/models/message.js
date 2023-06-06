const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('Message', messageSchema);