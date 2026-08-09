// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const morgan = require('morgan')
const cors = require('cors')
const { Server } = require('socket.io')
const { createServer } = require('http')
const connectToDB = require('./config/db.js')

// Routes Import
const authRoutes = require('./routes/auth.routes')
const workspaceRoutes = require('./routes/workspace.routes')

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
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log('User Connected', socket.id)

    socket.on('message', onMessageReceived)

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id)
    })
})

// Routes
app.use('/auth',authRoutes)
app.use('/workspaces', workspaceRoutes)

async function startServer() {
    const PORT = process.env.PORT || 3000;
    await connectToDB();

    httpServer.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
}
startServer();