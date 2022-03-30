const video = document.getElementById("socket-cam");
const secondVideo = document.getElementById("socket-cam-patient");
const closeBtn = document.getElementById("close");
const callBtn = document.getElementById("open");
const answerBtn = document.getElementById("answer");
const sdpAnswer = document.getElementById('sdp-answer');
const client = io("https://bb06-2001-16a2-cb25-a800-f1da-b62e-7f94-42ee.ngrok.io");

const peerConnection = new RTCPeerConnection({
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302']
        }
    ]
})

let isCalling = false;


peerConnection.ontrack = (e) => {
    secondVideo.srcObject = e.streams[0]
}





const getMedia = async () => {
    const localMedia = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    video.srcObject = localMedia;

    localMedia.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMedia);
    })

   
}

client.emit('join-room');

client.on('user-joined', (args)=> {
    console.log(`User ${args.id} joined the room`); 
})


client.on('answer-made', async (args)=> {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(args.answer));
    sdpAnswer.innerHTML = JSON.stringify(args.answer);
})






// getMedia();



callBtn.onclick = async => {
    callUser();
}

const callUser = async () => {
    await getMedia();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    peerConnection.onicecandidate = (e) => {
        if(e.candidate) {
            client.emit('candidate', {
                candidate: e.candidate
            })
        }
    }
   
    
    client.emit('call-user', {
        offer
    })
}



// client.on('calling-user', async (args)=> {
    //     await peerConnection.setRemoteDescription(new RTCSessionDescription(args.offer))
    //     const answer = await peerConnection.createAnswer();
    //     await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    //     client.emit('make-answer', {
    //         answer
    //     })
    // })
    
    // client.on('answer-made', async (args)=> {
    //     await peerConnection.setRemoteDescription(new RTCSessionDescription(args.answer));
    
    //     // if(!isCalling) {
    //     //     callUser()
    //     //     isCalling = true
    //     // }
    
    // })
