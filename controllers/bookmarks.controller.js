const mongoose = require('mongoose')

const { Bookmark, Channel, WorkspaceMember } = require('../models/workspace')
const { getIO } = require('../socket')

async function findAccessibleChannel(req) {
    if (
        !mongoose.isValidObjectId(req.params.workspaceId) ||
        !mongoose.isValidObjectId(req.params.channelId)
    ) {
        return null
    }

    const channel = await Channel.findOne({
        _id: req.params.channelId,
        workspace: req.params.workspaceId
    })

    if (!channel) return null

    const membership = await WorkspaceMember.exists({
        workspace: req.params.workspaceId,
        user: req.user._id,
        status: 'active'
    })

    return membership ? channel : null
}

function normalizeUrl(value) {
    if (typeof value !== 'string') return null

    try {
        const url = new URL(value.trim())
        if (!['http:', 'https:'].includes(url.protocol)) return null
        return url.toString()
    } catch {
        return null
    }
}

async function getChannelBookmarks(req, res) {
    try {
        const channel = await findAccessibleChannel(req)

        if (!channel) {
            return res.status(404).json({ message: 'channel not found' })
        }

        const bookmarks = await Bookmark.find({ channel: channel._id })
            .sort({ sortOrder: 1, createdAt: -1 })
            .populate('createdBy', 'username profileImage')

        return res.json(bookmarks)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Could not load bookmarks' })
    }
}

async function createChannelBookmark(req, res) {
    try {
        const channel = await findAccessibleChannel(req)

        if (!channel) {
            return res.status(404).json({ message: 'channel not found' })
        }

        const title = typeof req.body.title === 'string'
            ? req.body.title.trim()
            : ''
        const url = normalizeUrl(req.body.url)

        if (!title) {
            return res.status(400).json({ message: 'Bookmark title is required' })
        }

        if (title.length > 100) {
            return res.status(400).json({ message: 'Bookmark title must be under 100 characters' })
        }

        if (!url) {
            return res.status(400).json({ message: 'Enter a valid HTTP or HTTPS URL' })
        }

        const bookmark = await Bookmark.create({
            channel: channel._id,
            createdBy: req.user._id,
            title,
            url
        })

        await bookmark.populate('createdBy', 'username profileImage')
        getIO().emit('bookmark_created', bookmark)

        return res.status(201).json(bookmark)
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: 'Could not create bookmark' })
    }
}

async function deleteChannelBookmark(req, res) {
    try {
        const channel = await findAccessibleChannel(req)

        if (!channel) {
            return res.status(404).json({ message: 'channel not found' })
        }

        if (!mongoose.isValidObjectId(req.params.bookmarkId)) {
            return res.status(404).json({ message: 'bookmark not found' })
        }

        const bookmark = await Bookmark.findOneAndDelete({
            _id: req.params.bookmarkId,
            channel: channel._id
        })

        if (!bookmark) {
            return res.status(404).json({ message: 'bookmark not found' })
        }

        const deletedBookmark = {
            _id: bookmark._id,
            channel: bookmark.channel
        }

        getIO().emit('bookmark_deleted', deletedBookmark)

        return res.json(deletedBookmark)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Could not delete bookmark' })
    }
}

module.exports = {
    getChannelBookmarks,
    createChannelBookmark,
    deleteChannelBookmark
}
