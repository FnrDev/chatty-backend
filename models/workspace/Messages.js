const mongoose = require('mongoose')


const workSpaceMessagesReaction = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reaction: {
        type: String,
    }
})

const workspaceMessages = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
        index: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    textContent: {
        type: String
    },
    mediaURL: {
        type: String
    },
    mediaMimeType: {
        type: String,
    },
    voiceDurationSeconds: {
        type: Number
    },
    mentionEveryone: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    deletedAt: {
        type: Date
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    reactions: [workSpaceMessagesReaction]
}, { timestamps: true })

const Message = mongoose.model('Message', workspaceMessages)

module.exports = Message
