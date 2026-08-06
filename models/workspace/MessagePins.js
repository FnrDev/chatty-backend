const mongoose = require('mongoose')
const workspaceMessages = require('./Messages')

const messagePinSchema = new mongoose.Schema({
    message: workspaceMessages,
    pinnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

module.exports = messagePinSchema