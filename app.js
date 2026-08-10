// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const cors = require('cors')
const { createServer } = require('http')
const connectToDB = require('./config/db.js')
const { initializeSocket } = require('./socket.js')

// Routes Import
const authRoutes = require('./routes/auth.routes')
const workspaceRoutes = require('./routes/workspace.routes')
const channelsRoutes = require('./routes/channels.routes.js')
const uploadRoutes = require('./routes/upload.routes.js')

// Events Import
const onMessageReceived = require('./events/onMessageReceived')


// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    })
);
app.use(express.json())
app.use(morgan('dev'))

const httpServer = createServer(app)
const io = initializeSocket(httpServer)

io.on('connection', (socket) => {
    console.log('User Connected', socket.id)

    socket.on('send_message', onMessageReceived)

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
    })
})

// Routes
app.use('/auth',authRoutes)
app.use('/workspaces', workspaceRoutes)
app.use('/workspaces/:workspaceId/channels', channelsRoutes)
app.use('/upload', uploadRoutes)

async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    httpServer.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}
startServer();
