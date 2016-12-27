const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let redFilterOn = false;
let rgbSplitFilterOn = false;
let blurFilterOn = false;

function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(localMediaStream => {
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play()
  }).catch(error => {
    console.error(`Error!`, error);
  })
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    if(redFilterOn) {
      pixels = redEffect(pixels);
    }
    if(rgbSplitFilterOn) {
      pixels = rgbSplit(pixels);
    }
    if(blurFilterOn) {
      ctx.globalAlpha = 0.1;
    }
    // pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // sound
  snap.currentTime = 0;
  snap.play();
  // take data out of canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'hello');
  link.innerHTML = `<img src='${data}' alt='hello' />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i] = pixels.data[i] + 100 // red
    pixels.data[i+1] = pixels.data[i + 1] - 50 // green
    pixels.data[i+2] = pixels.data[i + 2] * 0.4 // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i] // red
    pixels.data[i + 100] = pixels.data[i + 1] // green
    pixels.data[i - 150] = pixels.data[i + 2] // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};
  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  for(i=0; i< pixels.data.length; i+=4) {
    red = pixels.data[i];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
  }
}
function toggleRedFilter() {
  redFilterOn = !redFilterOn;
  console.log(redFilterOn);
  getVideo();
}
function toggleRGBSplitFilter() {
  rgbSplitFilterOn = !rgbSplitFilterOn;
  console.log(rgbSplitFilterOn);
  getVideo();
}

function toggleBlurFilter() {
  blurFilterOn = !blurFilterOn
  console.log(blurFilterOn);
  getVideo();
}

getVideo();

video.addEventListener('canplay', paintToCanvas);