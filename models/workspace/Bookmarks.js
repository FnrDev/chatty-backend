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
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100
    },
    url: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2048
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Bookmark = mongoose.model('Bookmark', bookmarksSchema)

module.exports = Bookmark
