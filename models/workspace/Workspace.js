const mongoose = require('mongoose')
const workspaceMembersSchema = require('./Members')
const workspaceChannels = require('./Channels')

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    imageURL: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    code: {
        type: String,
        required: true,
        unique: true
    }, // this will be used to allow other user to join workspace
    members: [workspaceMembersSchema],
    channels: [workspaceChannels]
}, { timestamps: true })

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace