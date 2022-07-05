let videoCont = document.querySelector(".video-cont");
let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector('.capture-btn-cont');

let recordFlag = false;
let recorder;
let chunks = [];

const constraints = { audio: false, video: true };
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  recorder = new MediaRecorder(stream);
  video.srcObject = stream;

  recorder.addEventListener("start", (e) => {
    chunks = [];
  });

  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(chunks, { type: "video/mp4" });
    const videoURL = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = videoURL;
    a.download = "stream.mp4";
    a.click();
  });
  recorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
});

recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) {
    return;
  }

  recordFlag = !recordFlag;
  if (recordFlag) {
    recorder.start();
    console.log("record");
  } else {
    recorder.stop();
  }
});


captureBtnCont.addEventListener('click', (e)=>{
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2D', )

})