const { Workspace, WorkspaceMember } = require('../models/workspace')

const random6Char = () => Math.random().toString(36).substring(2, 8);

async function listWorkspace(req, res) {
    try {
        const memberships = await WorkspaceMember.find({ user: req.user._id }).select('workspace')

        const workspaces = await Workspace.find({
            $or: [
                { owner: req.user._id },
                { _id: { $in: memberships.map((membership) => membership.workspace) } }
            ]
        })

        return res.json(workspaces)
    } catch (error) {
        console.log(error)
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
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

        try {
            await WorkspaceMember.create({
                workspace: created._id,
                user: req.user._id,
                role: 'owner',
                status: 'active',
                joinedAt: new Date()
            })
        } catch (error) {
            // members live in their own collection now, so a failure here would
            // leave behind a workspace that nobody is a member of
            await Workspace.deleteOne({ _id: created._id })
            throw error
        }

        return res.json(created)
    } catch (error) {
        console.log(error)
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

async function workspaceDetails(req, res) {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate({ path: 'members', populate: { path: 'user' } })
            .populate('channels')

        if (!workspace) {
            return res.status(404).json({ message: "workspace not found" })
        }

        return res.json(workspace)
    } catch (error) {
        console.log(error)
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    listWorkspace,
    createWorkspace,
    workspaceDetails
}