const mongoose = require('mongoose')

const workspaceMembersSchema = new mongoose.Schema({
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ['owner', 'member'],
        default: 'member'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
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

// a user can only be a member of the same workspace once
workspaceMembersSchema.index({ workspace: 1, user: 1 }, { unique: true })

const WorkspaceMember = mongoose.model('WorkspaceMember', workspaceMembersSchema)

module.exports = WorkspaceMember
