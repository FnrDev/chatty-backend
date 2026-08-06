const mongoose = require('mongoose')

const bookmarksSchema = new mongoose.Schema({
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

module.exports = bookmarksSchema