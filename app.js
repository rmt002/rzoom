const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const key = fs.readFileSync('encrypt/privatekey.pem')
const cert = fs.readFileSync('encrypt/certificate.pem')

const options = {
    key: key,
    cert: cert
}

const server = https.createServer(options, app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');

server.listen(3000, () => {
    console.log("SERVER --> Application is running at 3000")
})

app.set('view engine', 'ejs')

app.use(express.static('public'))

//Home page
app.get('/', (req, res) => {
    console.log("home")
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