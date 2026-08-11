const mongoose = require('mongoose')

const { Message, MessagePin } = require("../models/workspace")
const { getIO } = require('../socket')

async function getChannelMessages(req, res) {
    try {
        const messages = await Message.find({
            channel: req.params.channelId,
            deletedAt: null
        }).populate('author')
        res.json(messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function createChannelMessage(req, res) {
    try {
        const {
            textContent,
            mediaURL,
            mediaMimeType,
            mentionEveryone,
            replyTo
        } = req.body

        const createdMessage = await Message.create({
            textContent,
            mediaURL,
            mediaMimeType,
            mentionEveryone,
            replyTo,
            channel: req.params.channelId,
            author: req.user._id
        })

        return res.json(createdMessage)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function editChannelMessage(req, res) {
    try {
        const { textContent } = req.body

        const updated = await Message.findOneAndUpdate(
            {
                _id: req.params.messageId,
                channel: req.params.channelId,
                author: req.user._id,
                deletedAt: null
            },
            {
                textContent,
                editedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        ).populate('author')

        if (!updated) {
            return res.status(404).json({ message: "message not found" })
        }

        getIO().emit('message_edited', updated)

        return res.json(updated)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function deleteChannelMessage(req, res) {
    try {
        const deleted = await Message.findOneAndUpdate(
            {
                _id: req.params.messageId,
                channel: req.params.channelId,
                author: req.user._id,
                deletedAt: null
            },
            {
                deletedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!deleted) {
            return res.status(404).json({ message: "message not found" })
        }

        const deletedMessage = {
            _id: deleted._id,
            channel: deleted.channel
        }

        getIO().emit('message_deleted', deletedMessage)

        return res.json(deletedMessage)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function createMessagePin(req, res) {
    try {
        if (
            !mongoose.isValidObjectId(req.params.channelId) ||
            !mongoose.isValidObjectId(req.params.messageId)
        ) {
            return res.status(404).json({ message: "message not found" })
        }

        const message = await Message.findOne({
            _id: req.params.messageId,
            channel: req.params.channelId,
            deletedAt: null
        })

        if (!message) {
            return res.status(404).json({ message: "message not found" })
        }

        const created = await MessagePin.create({
            message: message._id,
            channel: message.channel,
            pinnedBy: req.user._id,
        })

        await created.populate([
            {
                path: 'message',
                populate: { path: 'author', select: 'username profileImage' }
            },
            { path: 'pinnedBy', select: 'username profileImage' }
        ])

        getIO().emit('message_pin_created', created)

        return res.status(201).json(created)
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.status(409).json({ message: "message is already pinned" })
        }
        return res.status(500).json({ message: "internal server error" })
    }
}

async function listMessagePin(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.channelId)) {
            return res.json([])
        }

        const pins = await MessagePin.find({ channel: req.params.channelId })
            .sort({ createdAt: -1 })
            .populate([
                {
                    path: 'message',
                    match: { deletedAt: null },
                    populate: { path: 'author', select: 'username profileImage' }
                },
                { path: 'pinnedBy', select: 'username profileImage' }
            ])

        return res.json(pins.filter((pin) => pin.message))
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function deleteMessagePin(req, res) {
    try {
        if (
            !mongoose.isValidObjectId(req.params.channelId) ||
            !mongoose.isValidObjectId(req.params.messageId)
        ) {
            return res.status(404).json({ message: "pin not found" })
        }

        const deleted = await MessagePin.findOneAndDelete({
            channel: req.params.channelId,
            message: req.params.messageId
        })

        if (!deleted) {
            return res.status(404).json({ message: "pin not found" })
        }

        getIO().emit('message_pin_deleted', {
            _id: deleted._id,
            channel: deleted.channel,
            message: deleted.message
        })

        return res.sendStatus(204)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

module.exports = {
    getChannelMessages,
    createChannelMessage,
    editChannelMessage,
    deleteChannelMessage,
    createMessagePin,
    listMessagePin,
    deleteMessagePin
}
