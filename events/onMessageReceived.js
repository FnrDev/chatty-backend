const { Message } = require("../models/workspace")
const { getIO } = require('../socket')

async function onMessageReceived(message) {
    console.log(message)
    // BIG SECURITY RISK, I KNOW!!!
    const {
        textContent,
        mediaURL,
        mediaMimeType,
        mentionEveryone,
        replyTo,
        channelId,
        workspaceId,
        author
    } = message

    const createdMessage = await Message.create({
        textContent,
        mediaMimeType,
        mediaURL,
        mentionEveryone,
        author,
        channel: channelId,
        workspace: workspaceId,
    })

    const popluateAuthor = await Message.findById(createdMessage._id).populate('author')

    getIO().emit('message_received', popluateAuthor)
}

module.exports = onMessageReceived
