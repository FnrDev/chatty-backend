const mongoose = require('mongoose')
const workspaceMessages = require('./Messages')
const bookmarksSchema = require('./Bookmarks')
const messagePinSchema = require('./MessagePins')

const workspaceChannels = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    description: {
        type: String,
        maxLength: 2500
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    messages: [workspaceMessages],
    bookmarks: [bookmarksSchema],
    pins: [messagePinSchema]
}, { timestamps: true })

module.exports = workspaceChannels // this will be embeddings schema in Workspace model