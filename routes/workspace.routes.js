const router = require('express').Router()
const verifyToken = require("../middleware/verifyToken")
const workspaceController = require('../controllers/workspace.controller')


router.get('/', verifyToken, workspaceController.listWorkspace)
router.get('/:id', verifyToken, workspaceController.workspaceDetails)
router.post('/', verifyToken, workspaceController.createWorkspace)

module.exports = router