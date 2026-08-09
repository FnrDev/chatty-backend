const mongoose = require('mongoose')

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
    } // this will be used to allow other user to join workspace
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// members and channels live in their own collections and point back at the
// workspace, these virtuals keep .populate('members') & co. working
workspaceSchema.virtual('members', {
    ref: 'WorkspaceMember',
    localField: '_id',
    foreignField: 'workspace'
})

workspaceSchema.virtual('channels', {
    ref: 'Channel',
    localField: '_id',
    foreignField: 'workspace'
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

module.exports = Workspace
