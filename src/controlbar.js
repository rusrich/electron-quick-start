const clbut = document.getElementById("btclose");

const resbut = document.getElementById("btrestart");

const relbut = document.getElementById("btreload");
const photoreport = document.getElementById("photoreport");
const normalPlay = document.getElementById("normalPlay");
const setMedia = document.getElementById("setmedia");
const resApp = document.getElementById("restartapp");
const countVideo = document.getElementById("count-video");
relbut.addEventListener("click", reloadApp);
photoreport.addEventListener("click", runPhotoTranslation);
normalPlay.addEventListener("click", runNormalPlay);


const select = document.getElementById("select-media")

const restartApp = () => {
  return;
};

function reloadApp() {
  console.log("Началось скачивание контента");
  rs = true;
  plaingNow = false;
  swithOffRestart();
  fetchData(URL);
}


function runPhotoTranslation() {
  indexMedia = 0;
  console.log("Ротация для фотоотчета");
  mainMediasList = allMedias;
  medias = filesForDownload;
  // playVideo(allMedias);
  setTimeout(() => {
    indexMedia = 0;
    medias = mainMediasList;
    // playVideo(allMedias);
  }, 900000)
}

function runNormalPlay() {
  indexMedia = 0;
  console.log("Нормальная ротация");
  if (mainMediasList) {
    medias = mainMediasList;
    // playVideo(allMedias);
  }
}

const listmedias = () => {
  // let options = createElement('option')

  for (i in allMedias) {
    const option = `<option value="${i}" name="${allMedias[i].name}">${allMedias[i].name}</option>`;
    select.innerHTML += option
    // console.log(select);
  }
}

const countVideoFunctions = () => {
  if (filesForDownload) {
    const counts = filesForDownload.length
    countVideo.innerHTML = `-(${counts})`
  }
}

setTimeout(() => {
  listmedias()
  countVideoFunctions()
}, 2000)

// select.addEventListener('change', (e) => {
//   console.log(e.target.value);
// })

setMedia.addEventListener('click', () => {
  console.log(select.value);
  if (select.value == 0) {
    indexMedia = medias.length
  } else {
    indexMedia = select.value - 1
  }
  // mediaPlayer.removeEventListener('ended', () => {console.log('Новое воспроизведение');})
})

resApp.addEventListener('click', () => {
  ipcRenderer.send('reload-me')
})