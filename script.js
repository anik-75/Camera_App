let videoCont = document.querySelector(".video-cont");
let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let timerCont = document.querySelector(".timer-cont");
let filterColor = "transparent";

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

    if (db) {
      let videoID = shortid();
      let dbTransaction = db.transaction("video", "readwrite");
      let videoStore = dbTransaction.objectStore("video");
      let videoEntry = {
        id: videoID,
        blobData: blob,
      };
      videoStore.add(videoEntry);
    }

    // let a = document.createElement("a");
    // a.href = videoURL;
    // a.download = "stream.mp4";
    // a.click();
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

  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //filter
  ctx.fillStyle = filterColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL();

  if (db) {
    let imageId = shortid();
    const imageDBTransaction = db.transaction("image", "readwrite");
    const imageObjectStore = imageDBTransaction.objectStore("image");
    let imageEntry = {
      id: imageId,
      imageUrl: dataURL,
    };
    imageObjectStore.add(imageEntry);
  }

  // let a = document.createElement("a");
  // a.href = dataURL;
  // a.download = "img";
  // a.click();
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

//filter
let filterLayer = document.querySelector(".filter-layer");
console.log(filterLayer);
let filters = document.querySelectorAll(".filter");
filters.forEach((filterEle) => {
  filterEle.addEventListener("click", (e) => {
    filterColor =
      getComputedStyle(filterEle).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = filterColor;
    console.log(filterColor);
  });
});

let library = document.querySelector(".library");
library.addEventListener("click", (e) => {
  location.assign("./gallery.html");
});
