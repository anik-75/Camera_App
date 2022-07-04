let videoCont = document.querySelector(".video-cont");
let video = document.querySelector('video');

let recorder;
const constraints = { audio: false, video: true };
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  recorder = new MediaRecorder(stream);
  video.srcObject = stream;
});
