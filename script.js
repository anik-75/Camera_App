let videoCont = document.querySelector(".video-cont");
let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let timerCont = document.querySelector(".timer-cont");

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
    startTimer();
    console.log("record");
  } else {
    recorder.stop();
    stopTimer();
  }
});

//image Capture
captureBtnCont.addEventListener("click", (e) => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = dataURL;
  a.download = "img";
  a.click();
});

// timer
let counter = 0;
let timer = document.querySelector(".timer");
let timerId;
function startTimer() {
  timerCont.style.display = "block";
  function displayTimer() {
    counter++;
    let totalSeconds = counter;
    let hour = Number.parseInt(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;

    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    let seconds = totalSeconds;
    hour = hour < 10 ? `0${hour}` : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hour}:${minutes}:${seconds}`;
  }
  timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  counter = 0;
  timer.innerText = `00:00:00`;
  timerCont.style.display = "none";
}
