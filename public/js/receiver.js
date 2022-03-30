const video = document.getElementById("socket-cam");
const secondVideo = document.getElementById("socket-cam-patient");
const answerBtn = document.getElementById("answer");
const sdpOffer = document.getElementById("sdp-offer");
const client = io("http://localhost:5000");

const peerConnection = new RTCPeerConnection({
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302']
        }
    ]
})

let isCalling = false;


peerConnection.ontrack = (e) => {
    console.log("Hello");
    secondVideo.srcObject = e.streams[0]
}


const getMedia = async () => {
    const localMedia = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = localMedia;
    localMedia.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMedia);
    })

}

// getMedia();

client.emit('join-room');

client.on('user-joined', (args)=> {
    console.log(`User ${args.id} joined the room`); 
})


client.on('calling-user', async (args)=> {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(args.offer));
    sdpOffer.innerHTML = JSON.stringify(args.offer)
})


client.on('ic-candidate', async(args)=> {
    await peerConnection.addIceCandidate(new RTCIceCandidate(args.candidate))
})


answerBtn.onclick = async => {
    answerCall();
}

const answerCall = async () => {
    await getMedia();
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    client.emit('make-answer', {
        answer
    })
}



// client.on('calling-user', async (args)=> {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(args.offer))
//     const answer = await peerConnection.createAnswer();
//     await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

//     // peerConnection.onicecandidate = e => {
//     //     if(e.candidate) {
//     //         client.emit('candidate', {
//     //             candidate: e.candidate
//     //         })
//     //     }
//     // }

//     sdp.innerHTML = JSON.stringify(args.offer)
//     client.emit('make-answer', {
//         answer
//     })
// })

// client.on('ice-candidate', async (args)=> {
//     await peerConnection.addIceCandidate(new RTCIceCandidate(args.candidate));
// })

// client.on('answer-made', async (args)=> {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(args.answer));

//     // if(!isCalling) {
//     //     callUser()
//     //     isCalling = true
//     // }

// })
