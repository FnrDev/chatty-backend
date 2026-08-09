const router = require('express').Router()
const verifyToken = require("../middleware/verifyToken")
const channelsController = require("../controllers/channels.controller")

router.get('/', verifyToken, channelsController.getAllChannels)
router.get('/:id', verifyToken, channelsController.getChannelByID)
router.post('/', verifyToken, channelsController.createChannel)

module.exports = router