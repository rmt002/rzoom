const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');
const { userInfo } = require('os');

server.listen(3000, () => {
    console.log("SERVER --> Application is running at 3000")
})

app.set('view engine', 'ejs')

app.use(express.static('public'))

//Home page
app.get('/', (req, res) => {
    res.render('home')
})

//Meeting room generation endpoint
app.get('/newRoom', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

//Meeting room link
app.get('/:roomId', (req, res) => {
    res.render('room', { roomId: req.params.roomId })
})

//Sockets
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})