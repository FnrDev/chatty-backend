const mongoose = require('mongoose')

const messagePinSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
        index: true
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true
    },
    pinnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

// a message can only be pinned once
messagePinSchema.index({ message: 1 }, { unique: true })

const MessagePin = mongoose.model('MessagePin', messagePinSchema)

module.exports = MessagePin
