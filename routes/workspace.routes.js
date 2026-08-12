const router = require('express').Router()
const verifyToken = require("../middleware/verifyToken")
const workspaceController = require('../controllers/workspace.controller')


router.get('/', verifyToken, workspaceController.listWorkspace)
router.get('/:id', verifyToken, workspaceController.workspaceDetails)
router.post('/', verifyToken, workspaceController.createWorkspace)
router.patch('/:id', verifyToken, workspaceController.updateWorkspace)
router.post('/join', verifyToken, workspaceController.joinWorkspace)

module.exports = router
