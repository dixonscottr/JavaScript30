const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('#full-screen');
const videoElem = player.querySelector('video');

function togglePlay() {
  if(video.paused) {
    video.play();
  }
  else {
    video.pause();
  }
}

function updateBtn() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon; 
  console.log(icon);
}

function skip() {
  const skipTime = this.dataset.skip;
  console.log(`skipping ${skipTime} seconds`);
  video.currentTime += parseFloat(skipTime);
}

function handleRangeUpdate(){
  video[this.name] = this.value;
  console.log(this.name);
  console.log(this.value);
}

function updateProgress() {
  const percentDone = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percentDone}% `
}

function scrub(event) {
  const timeClicked = (event.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = timeClicked;
  console.log(timeClicked);
}

function goFullScreen() {
  console.log('full screen?')
  if(videoElem.requestFullscreen) {
    videoElem.requestFullscreen();
  } else if(videoElem.mozRequestFullScreen) {
    videoElem.mozRequestFullScreen();
  } else if(videoElem.webkitRequestFullscreen) {
    videoElem.webkitRequestFullscreen();
  } else if(videoElem.msRequestFullscreen) {
    videoElem.msRequestFullscreen();
  }
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateBtn);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('pause', updateBtn);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(btn => btn.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
progress.addEventListener('click', scrub);
let mouseDown = false;
progress.addEventListener('mousemove', (event) => mouseDown && scrub(event) );
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);
fullScreen.addEventListener('click', goFullScreen);