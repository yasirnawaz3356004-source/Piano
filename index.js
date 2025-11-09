var drumButtons = document.querySelectorAll(".drum");
let activeSounds = {};


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};


function unlockAudio() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}
document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);


async function loadSound(key, url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  soundBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
}


const soundFiles = {
  a: "sounds/sound1.mp3",
  s: "sounds/sound2.mp3",
  d: "sounds/sound3.mp3",
  f: "sounds/sound4.mp3",
  g: "sounds/sound1.mp3",
  h: "sounds/sound6.mp3",
  j: "sounds/sound7.mp3",
  k: "sounds/sound8.mp3",
  l: "sounds/sound9.mp3",
  e: "sounds/sound3.mp3",
  r: "sounds/sound6.mp3",
  t: "sounds/sound8.mp3",
  y: "sounds/sound1.mp3",
  u: "sounds/sound3.mp3",
  i: "sounds/sound4.mp3",
  o: "sounds/sound9.mp3",
  p: "sounds/sound2.mp3"
};


Promise.all(
  Object.entries(soundFiles).map(([key, url]) => loadSound(key, url))
).then(() => console.log("🎶 All sounds loaded!"));


function playWebAudioSound(key) {
  const buffer = soundBuffers[key];
  if (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    return source;
  }
  return null;
}


function stopSound(key) {
  const sound = activeSounds[key];
  if (sound && sound.stop) {
    sound.stop();
    delete activeSounds[key];
  }
}


drumButtons.forEach((btn) => {
  const key = btn.classList[0];


  btn.addEventListener("mousedown", function () {
    if (!activeSounds[key]) {
      const sound = playWebAudioSound(key);
      if (sound) {
        activeSounds[key] = sound;
      }
    }
    addPressedClass(key);
  });


  btn.addEventListener("mouseup", function () {
    stopSound(key);
    removePressedClass(key);
  });


  btn.addEventListener("mouseleave", function () {
    stopSound(key);
    removePressedClass(key);
  });
});


document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();
  if (!soundBuffers[key]) return;

  if (!activeSounds[key]) {
    const sound = playWebAudioSound(key);
    if (sound) {
      activeSounds[key] = sound;
    }
  }
  addPressedClass(key);
});


document.addEventListener("keyup", function (event) {
  const key = event.key.toLowerCase();
  stopSound(key);
  removePressedClass(key);
});


function addPressedClass(currentKey) {
  const activeButton = document.querySelector("." + currentKey);
  if (activeButton) {
    activeButton.classList.add("pressed");
  }
}

function removePressedClass(currentKey) {
  const activeButton = document.querySelector("." + currentKey);
  if (activeButton) {
    activeButton.classList.remove("pressed");
  }
}
