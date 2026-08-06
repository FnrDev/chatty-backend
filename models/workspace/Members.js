const mongoose = require('mongoose')

const workspaceMembersSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['owner', 'member'],
        default: 'member'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive' // this will be changed to active after user accept the invite
    },
    joinedAt: {
        type: Date,
    },
    removedAt: {
        type: Date
    }
}, { timestamps: true })

module.exports = workspaceMembersSchema // this will be embeddings schema in Workspace model