const mongoose = require('mongoose')

const bookmarksSchema = new mongoose.Schema({
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Bookmark = mongoose.model('Bookmark', bookmarksSchema)

module.exports = Bookmark
