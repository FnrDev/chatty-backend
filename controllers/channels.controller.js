const mongoose = require("mongoose")
const Channel = require("../models/workspace/Channels")

async function getAllChannels(req, res) {

   try {
     const getAllChannels = await Channel.find({
       workspace: req.params.workspaceId,
       deletedAt: null
     })
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
            owner: req.user._id
        })

        return res.status(200).json(create)
    } catch(err) {
        return res.status(500).json({message: err})
    }
}

async function getChannelByID(req, res) {

   const {id} = req.params;
   try {
     const getChannel = await Channel.findOne({
       _id: id,
       workspace: req.params.workspaceId,
       deletedAt: null
     })

     if (!getChannel) {
       return res.status(404).json({ message: "Channel not found" })
     }

     return res.status(200).json(getChannel)
   } catch (err) {
    return res.status(500).json({message: "Server side error"})
   }
}

async function updateChannel(req, res) {
   const { id, workspaceId } = req.params

   if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(workspaceId)) {
     return res.status(404).json({ message: "Channel not found" })
   }

   const updates = {}
   if (req.body.name !== undefined) updates.name = req.body.name
   if (req.body.description !== undefined) updates.description = req.body.description

   try {
     const updated = await Channel.findOneAndUpdate(
       { _id: id, workspace: workspaceId, deletedAt: null },
       { $set: updates },
       { new: true, runValidators: true }
     )

     if (!updated) {
       return res.status(404).json({ message: "Channel not found" })
     }

     return res.status(200).json(updated)
   } catch (err) {
     if (err.name === "ValidationError") {
       return res.status(400).json({ message: err.message })
     }
     return res.status(500).json({ message: "Server side error" })
   }
}

async function deleteChannel(req, res) {
   const { id, workspaceId } = req.params

   if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(workspaceId)) {
     return res.status(404).json({ message: "Channel not found" })
   }

   try {
     const deleted = await Channel.findOneAndUpdate(
       { _id: id, workspace: workspaceId, deletedAt: null },
       { $set: { deletedAt: new Date() } },
       { new: true }
     )

     if (!deleted) {
       return res.status(404).json({ message: "Channel not found" })
     }

     return res.status(200).json({ _id: deleted._id })
   } catch (err) {
     return res.status(500).json({ message: "Server side error" })
   }
}

module.exports = {
  getAllChannels,
  createChannel,
  getChannelByID,
  updateChannel,
  deleteChannel
}
