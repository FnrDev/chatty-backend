const { Message } = require("../models/workspace")
const { getIO } = require('../socket')

async function getChannelMessages(req, res) {
    try {
        const messages = await Message.find({ channel: req.params.channelId }).populate('author')
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
                author: req.user._id
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

module.exports = {
    getChannelMessages,
    createChannelMessage,
    editChannelMessage
}
