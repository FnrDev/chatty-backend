const mongoose = require('mongoose')

const workspaceChannels = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true
    },
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
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// messages, bookmarks and pins live in their own collections and point back
// at the channel, these virtuals keep .populate('messages') & co. working
workspaceChannels.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'channel'
})

workspaceChannels.virtual('bookmarks', {
    ref: 'Bookmark',
    localField: '_id',
    foreignField: 'channel'
})

workspaceChannels.virtual('pins', {
    ref: 'MessagePin',
    localField: '_id',
    foreignField: 'channel'
})

const Channel = mongoose.model('Channel', workspaceChannels)

module.exports = Channel
