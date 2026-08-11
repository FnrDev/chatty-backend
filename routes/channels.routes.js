const router = require('express').Router({ mergeParams: true })
const verifyToken = require("../middleware/verifyToken")
const channelsController = require("../controllers/channels.controller")
const messageController = require('../controllers/messages.controller')
const bookmarkController = require('../controllers/bookmarks.controller')

router.get('/', verifyToken, channelsController.getAllChannels)
router.get('/:id', verifyToken, channelsController.getChannelByID)
router.post('/', verifyToken, channelsController.createChannel)

router.get('/:channelId/messages', verifyToken, messageController.getChannelMessages)
router.post('/:channelId/messages', verifyToken, messageController.createChannelMessage)
router.patch('/:channelId/messages/:messageId', verifyToken, messageController.editChannelMessage)
router.delete('/:channelId/messages/:messageId', verifyToken, messageController.deleteChannelMessage)

router.get('/:channelId/pins', verifyToken, messageController.listMessagePin)
router.post('/:channelId/messages/:messageId/pin', verifyToken, messageController.createMessagePin)
router.delete('/:channelId/messages/:messageId/pin', verifyToken, messageController.deleteMessagePin)

router.get('/:channelId/bookmarks', verifyToken, bookmarkController.getChannelBookmarks)
router.post('/:channelId/bookmarks', verifyToken, bookmarkController.createChannelBookmark)
router.delete('/:channelId/bookmarks/:bookmarkId', verifyToken, bookmarkController.deleteChannelBookmark)

module.exports = router
