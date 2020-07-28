const socket = io('/')
const peerClient = new Peer(undefined, {
    host: '/',
    port: 3001
});
const peers = {}

//On user connect
peerClient.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

// socket.on('user-connected', userId => {
//     console.log("User connected :", userId)
// })

//Create the user's viewfinder and start the stream
const videoFrame = document.getElementById('video-grid')
const userVideo = document.createElement('video')
userVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addStream(userVideo, stream)

    peerClient.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToIncomingUser(userId, stream)
    })
})

function addStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoFrame.append(video)
}

function connectToIncomingUser(userId, stream) {
    const call = peerClient.call(userId, stream)
    const video = document.createElement('video')
    video.setAttribute("id", userId)
    call.on('stream', userVideoStream => {
        addStream(video, userVideoStream)
    })
    call.on('close,', () => {
        video.remove()
    })
    console.log("Adding incoming peer", call)
    peers[userId] = call
}

//On user disconnect
socket.on('user-disconnected', userId => {
    console.log("User disconnected: ", userId)
    if (peers[userId]) {
        peers[userId].close()
        document.getElementById(userId).outerHTML = "";
    }
})