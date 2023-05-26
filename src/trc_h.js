const { ipcRenderer } = require("electron");
const fsold = require("fs");

let allMedias = [];
let allMediaForStart = []
let autoMediasBlock = []
let indexMedia = 0;
let medias

const placePlayer = document.querySelector("#player");
let mediaPlayer = document.createElement("video");

const collectFiles = () => {
  fsold.readdirSync(URL, { withFileTypes: true }).filter((d) => {
    if (d.isDirectory()) {
      let mediasBlock = [];
      let n = 0;
      fsold.readdirSync(URL + d.name, { withFileTypes: true }).filter((f) => {
        let split = f.name.split(".");
        let len = split.length;
        let ext = split[len - 1];
        if (ext == "mp4") {
          mediasBlock.push(DIRECTORY + d.name + '/' + f.name);
          allMediaForStart.push({ files: [DIRECTORY + d.name + '/' + f.name], num: 0 });
        }
        n++;
      });
      allMedias.push({ files: mediasBlock, num: 0 });
      
    } else {
      let split = d.name.split(".");
      let len = split.length;
      let ext = split[len - 1];
      if (ext == "mp4") {
        allMedias.push({ files: [DIRECTORY + d.name], num: 0 });
        allMediaForStart.push({ files: [DIRECTORY + d.name], num: 0 });
      }
    }
  });
  // .map((d) => console.log(d.name));
};

setTimeout(() => {collectFiles()}, 1000)


const mediaPlayerStyle = () => {
  mediaPlayer.style.position = "absolute";
  mediaPlayer.style.top = 0;
  mediaPlayer.style.left = 0;
  mediaPlayer.style.width = VIDEOWIDTH + "px";
  mediaPlayer.style.height = VIDEOHEIGHT + "px";
  mediaPlayer.style.maxWidth = FULLWIDTH + "px";
  mediaPlayer.style.maxHeight = FULLHEIGHT + "px";
  mediaPlayer.style.transition = "all 0.25s ease";
  mediaPlayer.muted = true;
  mediaPlayer.left = 0;
}

const nextPlay = () => {
  if (indexMedia < medias.length - 1) {
    if (medias[indexMedia].num < medias[indexMedia].files.length - 1) {
      medias[indexMedia].num += 1;
    } else {
      medias[indexMedia].num = 0;
    }
    indexMedia++;
  } else {
    if (medias[indexMedia].num < medias[indexMedia].files.length - 1) {
      medias[indexMedia].num += 1;
    } else {
      medias[indexMedia].num = 0;
    }
    indexMedia = 0;
  }
  num = medias[indexMedia].num;
  video = medias[indexMedia].files[num];
  if (
    fsold.existsSync(video) &&
    fsold.statSync(video).size > 0
  ) {
    mediaPlayer.pause()
    mediaPlayer.src = video;
    mediaPlayer.load()
    mediaPlayer.play();
  } else {
    nextPlay();
  }
  return;
};


const playVideo = () => {
  indexMedia = 0
  
  let num = medias[indexMedia].num;
  let video = medias[indexMedia].files[0];

  mediaPlayerStyle()

  mediaPlayer.src = video;
  placePlayer.append(mediaPlayer);
  mediaPlayer.play();

  // setInterval(() => {nextPlay(medias)}, 10000)

  mediaPlayer.addEventListener("ended", () => {
    nextPlay();
  });
  return;
};


setTimeout(() => {
  medias = allMediaForStart
  playVideo()
}, 1500)

setTimeout(() => {
  indexMedia = 0
  medias = allMedias
}, 600000)


const autoCollectFiles = () => {
  fsold.readdirSync(URL, { withFileTypes: true }).filter((d) => {
    if (d.isDirectory()) {
      let mediasBlock = [];
      let n = 0;
      fsold.readdirSync(URL + d.name, { withFileTypes: true }).filter((f) => {
        let split = f.name.split(".");
        let len = split.length;
        let ext = split[len - 1];
        if (ext == "mp4") {
          autoMediasBlock.push(DIRECTORY + d.name + '/' + f.name);
        }
        n++;
      });
      allMedias.push({ files: mediasBlock, num: 0 });
      
    } else {
      let split = d.name.split(".");
      let len = split.length;
      let ext = split[len - 1];
      if (ext == "mp4") {
        autoMediasBlock.push({ files: [DIRECTORY + d.name], num: 0 });
      }
    }
  });
  if (JSON.stringify(allMedias) !== JSON.stringify(autoMediasBlock)) {
    allMedias = autoMediasBlock
    playVideo(allMedias)
  }
};


// setInterval(() => {
//   autoCollectFiles()
// }, 10000)