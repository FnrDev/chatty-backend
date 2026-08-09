// requiring this file registers every workspace model with mongoose, which is
// what makes populating the refs/virtuals between them work
const Workspace = require('./Workspace')
const WorkspaceMember = require('./Members')
const Channel = require('./Channels')
const Message = require('./Messages')
const Bookmark = require('./Bookmarks')
const MessagePin = require('./MessagePins')

module.exports = {
    Workspace,
    WorkspaceMember,
    Channel,
    Message,
    Bookmark,
    MessagePin
}
