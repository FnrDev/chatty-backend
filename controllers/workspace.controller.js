const Workspace = require('../models/workspace/Workspace')

const random6Char = () => Math.random().toString(36).substring(2, 8);

async function listWorkspace(req, res) {
    try {
        const workspaces = await Workspace.find({
            $or: [
                { owner: req.user._id },
                { "members.user": req.user._id }
            ]
        })

        return res.json(workspaces)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function createWorkspace(req, res) {
    try {
        const {
            name,
            imageURL
        } = req.body

        const created = await Workspace.create({
            name,
            imageURL,
            owner: req.user._id,
            code: random6Char().toUpperCase()
        })

        return res.json(created)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

async function workspaceDetails(req, res) {
    try {
        const workspace = await Workspace.findById(req.params.id).populate('members').populate('channels')
        return res.json(workspace)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "internal server error" })
    }
}

module.exports = {
    listWorkspace,
    createWorkspace,
    workspaceDetails
}