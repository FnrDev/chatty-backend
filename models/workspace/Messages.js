const mongoose = require('mongoose')
const workspaceChannels = require('./Channels')

const workspaceMessages = new mongoose.Schema({
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
    replyTo: [workspaceMessages]
}, { timestamps: true })

module.exports = workspaceMessages