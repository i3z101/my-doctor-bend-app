const video = document.getElementById("caller-cam");
const secondVideo = document.getElementById("receiver-cam");
const closeBtn = document.getElementById("close");
const callBtn = document.getElementById("open");
const pushToken = document.getElementById('pushToken').value
const roomId = document.getElementById('roomId').value
const callBtnElement = document.querySelector('.call_btn');

const client = io('/appointments', {
    query: {
        roomId
    }
});

 

const pc_config = {
    "iceServers": [
      {
        urls : 'stun:stun.l.google.com:19302'
      }
    ]
  }

const peerConnection = new RTCPeerConnection(pc_config);

let isCalling = false;



peerConnection.ontrack = ({streams: [stream]}) => {
    secondVideo.srcObject = stream
}

peerConnection.onicecandidate = (e) => {
    // send the candidates to the remote peer
    // see addCandidate below to be triggered on the remote peer
    if (e.candidate) {
      sendToPeer('candidate', {
          candidate: e.candidate,
          roomId
      })
    }
}

peerConnection.oniceconnectionstatechange = (e) => {
    console.log(peerConnection.iceConnectionState);
} 


const sendToPeer = (messageType, payload) => {
    client.emit(messageType, {
      socketID: client.id,
      payload
    })
}

client.on('join', args=> { 
    console.log("Welcome " + args.socketId);
});



client.on('answer-made', async (args)=> {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(args.answer));
    // clearInterval(callInterval);
    secondVideo.style.display = 'block';
    video.classList.add('caller_cam_after_answer')
    callBtn.style.display = "none";
})

client.on('candidate', async(args)=> {
    // console.log(args);
    // if(args.candidate) {
    // }
    await peerConnection.addIceCandidate(new RTCIceCandidate(args.candidate))
})


const callUser = async (onlyOne) => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    sendToPeer('offer', {
        offer,
        pushToken,
        roomId,
        onlyOne
    })
    callBtnElement.innerHTML = "Calling..."
}

setTimeout(()=> {
    callBtn.style.visibility = "visible"
}, 2000)

// const callInterval = setInterval(()=> {
//     callUser();
// }, 7000)


const getMedia = async () => {
    const localMedia = await navigator.mediaDevices.getUserMedia({video: {
        aspectRatio: 1.7777777778,
        echoCancellation: true,
        noiseSuppression: true
    }, audio: {
        echoCancellation: true,
        noiseSuppression: true
    }});
    video.srcObject = localMedia;
    video.volume = 0
    localMedia.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMedia);
    })

   
}

getMedia()

callBtnElement.onclick = async () => {
    await callUser(true);
}







