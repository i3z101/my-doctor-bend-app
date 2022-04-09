const video = document.getElementById("caller-cam");
const receiverCam = document.getElementById("receiver-cam");
const answerBtn = document.getElementById("answer");
const sdpOffer = document.getElementById("sdp-offer");
const roomId = document.getElementById('roomId').value

answerBtn.style.visibility = "hidden";

const client = io('/emergency', {
  query: {
    roomId
  }
});



let localStream = null, remoteStream= null, prevOffer = null;

const pc_config = {
    "iceServers": [
      {
        urls : 'stun:stun.l.google.com:19302'
      }
    ]
  }

const peerConnection = new RTCPeerConnection(pc_config);



peerConnection.ontrack = (e) => {
    receiverCam.srcObject = e.streams[0]
}

peerConnection.oniceconnectionstatechange = (e) => {
  console.log(peerConnection.iceConnectionState);
} 

peerConnection.onicecandidate = (e) => {
    // send the candidates to the remote peer
    // see addCandidate below to be triggered on the remote peer
    if (e.candidate) {
      // console.log(JSON.stringify(e.candidate))
      sendToPeer('candidate', {
        candidate: e.candidate,
        roomId
      })
    }
}

const getMedia = async () => {
    const localMedia = await navigator.mediaDevices.getUserMedia({video: {
      aspectRatio: 1.7777777778,
      echoCancellation: true,
      noiseSuppression: true
    }
    , audio: {
      echoCancellation: true,
      noiseSuppression: true
    }});
    video.srcObject = localMedia;
    video.volume = 0;
    localMedia.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMedia);
    })
}

const sendToPeer = (messageType, payload) => {
    client.emit(messageType, {
      socketID: client.id,
      payload
    })
  }

getMedia();

client.on('join', args=> {
    console.log("Welcome " + args.socketId);
});

client.on('call-user', async (args)=> {
  if(prevOffer != null) {
    await peerConnection.remoteDescription(new RTCSessionDescription(args.offer))
  }
  if(args.roomId == roomId) {
    answerBtn.style.visibility = "visible"
    await peerConnection.setRemoteDescription(new RTCSessionDescription(args.offer));
  }
  prevOffer = args.offer
})



client.on('candidate', async(args)=> {
  await peerConnection.addIceCandidate(new RTCIceCandidate(args.candidate))
  // if(args.candidate) {
  // }
})


answerBtn.onclick = async () => {
    await answerCall();
}

const answerCall = async () => {
    // await getMedia();
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    console.log(answer);
    sendToPeer('answer', {
      answer: answer,
      roomId
    })
    answerBtn.style.display = "none";
    receiverCam.style.display = 'block';
    video.classList.add('caller_cam_after_answer')
}



