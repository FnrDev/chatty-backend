const router = require('express').Router({ mergeParams: true })
const verifyToken = require("../middleware/verifyToken")
const channelsController = require("../controllers/channels.controller")
const messageController = require('../controllers/messages.controller')

router.get('/', verifyToken, channelsController.getAllChannels)
router.get('/:id', verifyToken, channelsController.getChannelByID)
router.post('/', verifyToken, channelsController.createChannel)

router.get('/:channelId/messages', verifyToken, messageController.getChannelMessages)
router.post('/:channelId/messages', verifyToken, messageController.createChannelMessage)
router.patch('/:channelId/messages/:messageId', verifyToken, messageController.editChannelMessage)

module.exports = router