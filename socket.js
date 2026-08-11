const { Server } = require('socket.io')

let io

function initializeSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin:  process.env.CLIENT_URL || 'http://localhost:5173'
        }
    })

    return io
}

function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized')
    }

    return io
}

module.exports = {
    initializeSocket,
    getIO
}
