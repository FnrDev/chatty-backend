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

    await createdMessage.populate({
        path: 'author',
    })

    getIO().emit('message_received', createdMessage)
}

module.exports = onMessageReceived
