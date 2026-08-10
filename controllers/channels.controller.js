const { Workspace } = require("../models/workspace")
const Channel = require("../models/workspace/Channels")

async function getAllChannels(req, res) {

   try {
     const getAllChannels = await Channel.find({ workspace: req.params.workspaceId })
     return res.status(200).json(getAllChannels)
   } catch (err) {
    return res.status(500).json({message: "Server side error"})
   }
}

async function createChannel(req, res) {
    console.log(req.params)
    try {
        const create = await Channel.create({
            workspace: req.params.workspaceId,
            name: req.body.name, 
            description: req.body.description, 
            owner: req.user.id
        })

        return res.status(200).json(create)
    } catch(err) {
        return res.status(500).json({message: err})
    }
}

async function getChannelByID(req, res) {

   const {id} = req.params;
   try {
     const getChannel = await Channel.findById(id)
     return res.status(200).json(getChannel)
   } catch (err) {
    return res.status(500).json({message: "Server side error"})
   }
}

module.exports = { getAllChannels, createChannel, getChannelByID }