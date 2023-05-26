const { ipcRenderer } = require("electron");
// setTimeout(() => {ipcRenderer.send('reload-me')}, 5000)

const http = require("http");
const moment = require("moment");
const fs = require("fs-extra");
const fsold = require("fs");
const axios = require("axios");

// const FULLWIDTH = 896;
// const FULLHEIGHT = 640;
// let VIDEOWIDTH = 640;
// let VIDEOHEIGHT = 640;

const placePlayer = document.querySelector("#player");

const mainfolder = "C:/modernplayer";
const dirLed = `${mainfolder}/led`;
const mediafolder = `${mainfolder}/media`;
const dirInfo = `${mainfolder}/info`;
const host = "http://new.displaycontrol.ru";
const mediaJson = `${mediafolder}/media.json`;
let NAME_LED_DISPLAY;
let URL;
let DATA;
let DATAFROMJSONFILE;
let CHECKDATA;
let medias, allMedias, address, info, mainMediasList;
let fileNum = 0;
let containFileNumber = 0;
let filesForDownload = [];
let isPlaingNow = false;
let isDownloading = false;
let checkDownloadingFiles;
let rs = false;
let isPhotoReportActive = false;
let stop = false;

let photoMode = false;

indexMedia = 0;

let mediaPlayer = document.createElement("video");

const getNameOfLed = async () => {
  await fs.readdir(dirLed, (err, files) => {
    files.forEach((file) => {
      NAME_LED_DISPLAY = file.slice(0, file.length - 4);
      URL = `${host}/api/v1/led/${NAME_LED_DISPLAY}/`;
      if (rs && navigator.onLine) {
        fetchData(URL);
      } else {
        readJsonFile(mediaJson);
      }
    });
  });
};

setTimeout(() => {
  getNameOfLed();
}, 1000);

const fetchData = async (url) => {
  let response = await axios.get(url);
  DATA = response.data;
  // console.log("DATA:", DATA);
  await fs.writeFile(mediaJson, JSON.stringify(DATA), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Файл JSON успешно создан");
      readJsonFile(mediaJson);
    }
  });
};

const readJsonFile = (file) => {
  fs.readJson(mediaJson, (err, obj) => {
    if (err) {
      console.error(err);
      plaingNow = false;
    } else {
      DATAFROMJSONFILE = JSON.stringify(obj);
      // console.log(DATAFROMJSONFILE);
      allMedias = obj.blocks;
      address = obj.adresses;
      info = obj.infos;
      console.log("Данные JSON переданны в переменные");

      if (allMedias) {
        allMedias.map((v, i) => {
          // console.log(v, i);
          if (allMedias[i].videos.length == 0) {
            allMedias.splice(i, 1);
          }
        });
        // console.log("MEDIAS ", allMedias);
        containFiles(allMedias);
      } else {
        // console.log("MEDIAS NONE");
        rs = true;
      }
    }
  });
};

const containFiles = (allMedias) => {
  filesForDownload = [];
  if (allMedias) {
    let length = allMedias.length;
    for (let i = 0; i < length; i++) {
      let m = allMedias[i];
      let lenBlock = m.videos.length;
      for (let y = 0; y < lenBlock; y++) {
        let video = m.videos[y];
        let title = video.title.toLowerCase() + "-" + y;
        let len = video.file.split(".").length;
        let ext = video.file.split(".")[len - 1];
        // filesForDownload.push({
        //   file: host + video.file,
        //   name: title,
        //   format: video.format,
        //   localfile: mediafolder + "/" + title + "." + ext,
        // });
        filesForDownload.push({
          name: title,
          numMedia: 0,
          videos: [
            {
              title: video.title,
              size_video: video.size_video,
              file: video.file,
              format: video.format,
              localfile: mediafolder + "/" + title + "." + ext,
            },
          ],
        });
        m.numMedia = 0;

        allMedias[i].videos[y].localfile =
          mediafolder + "/" + title + "." + ext;
      }
    }
    console.log("Список Файлов для скачивания: ", filesForDownload);
    if (rs) {
      rs = false;
      containFileNumber = 0;
      medias = allMedias;
      setTimeout(() => {
        downloadVideo(filesForDownload[containFileNumber]);
        downLoadInfoImage();
      }, 1000);
      // console.log(filesForDownload);
    } else {
      medias = allMedias;
      setTimeout(() => {
        playVideo();
        collectImages();
      }, 1000);
    }
  } else {
    console.log("Файлы не собрались");
    setTimeout(() => {
      containFiles(allMedias);
    }, 30000);
  }
};

const downLoadInfoImage = async () => {
  let length = info.length;
  for (let i = 0; i < length; i++) {
    let len = info[i].file.split(".").length;
    let ext = info[i].file.split(".")[len - 1];
    let fileUrl = host + info[i].file;
    // console.log(fileUrl);
    let localfile = dirInfo + "/" + i + "." + ext;
    // console.log(localfile);
    if (fsold.existsSync(localfile) && fsold.statSync(localfile).size > 0) {
      console.log("Изображение уже загружено");
    } else {
      let file = await fsold.createWriteStream(localfile);
      const request = await http.get(fileUrl, (res) => {
        console.log("Изображение должно скачаться");
        res.pipe(file);
        console.log("Изображение скачивается");
        res.on("end", function () {
          console.log(`Изображение ${info[i].file} скачалось.`);
          info[i].localfile = localfile;
        });
      });
    }
  }
};

const collectImages = async () => {
  let length = info.length;
  for (let i = 0; i < length; i++) {
    let len = info[i].file.split(".").length;
    let ext = info[i].file.split(".")[len - 1];
    let fileUrl = host + info[i].file;
    let localfile = dirInfo + "/" + i + "." + ext;
    info[i].localfile = localfile;
  }
};

const downloadVideo = (video) => {
  // console.log(video.videos[0].file.split("."));
  isDownloading = true;
  fs.ensureDir(mediafolder, (err) => {
    if (err) console.log(err);
  });
  let len = video.videos[0].file.split(".").length;
  let ext = video.videos[0].file.split(".")[len - 1];
  const path = mediafolder + "/" + video.name + "." + ext;
  // const fileUrl = video.file;
  // const file = fsold.createWriteStream(path);
  // const statsFile = fsold.statSync(path);

  const httpGet = (fileUrl) => {
    let statsFile;
    if (fsold.existsSync(path)) {
      statsFile = fsold.statSync(path);
    } else {
      file = fsold.createWriteStream(path);
      statsFile = fsold.statSync(path);
    }

    http.get(fileUrl, (res) => {
      // console.log(res);
      setTimeout(() => {
        if (statsFile.size == +res.rawHeaders[7]) {
          console.log(
            `Размер файла ${statsFile.size}, номер видео ${containFileNumber}`
          );
          if (containFileNumber < filesForDownload.length - 1) {
            containFileNumber++;
            downloadVideo(filesForDownload[containFileNumber]);
            console.log(`Пропускаем файл ${video.name}. Уже загружен`);
          } else {
            isDownloading = false;
            console.log("Все файлы загружены");
            // indexMedia = 0;
            // medias = allMedias;
            // playVideo();
            ipcRenderer.send("reload-me");
          }
        } else {
          let file = fsold.createWriteStream(path);
          console.log(`Файл ${video.name} должен скачаться`);
          res.pipe(file);
          console.log(`Файл ${video.name} скачивается...`);
          res.on("end", () => {
            statsFile = fsold.statSync(path);
            console.log("Завершение скачивания");
            console.log(
              "Завершение скачивания",
              statsFile.size,
              +res.rawHeaders[7]
            );
            console.log(
              "Завершение скачивания",
              containFileNumber,
              filesForDownload.length - 1
            );
            if (statsFile.size == +res.rawHeaders[7]) {
              console.log("Завершение скачивания после первой сверки");
              if (containFileNumber < filesForDownload.length - 1) {
                console.log("Завершение скачивания после второй проверки");
                containFileNumber++;
                downloadVideo(filesForDownload[containFileNumber]);
                console.log(
                  `${containFileNumber} из ${filesForDownload.length} - `,
                  statsFile.size,
                  " : ",
                  +res.rawHeaders[7],
                  ": ДОКАЧАЛСЯ ПОЛНОСТЬЮ"
                );
                console.log(`Файл ${video.name} загружен.`);
              } else {
                isDownloading = false;
                console.log("Все файлы загружены");
                ipcRenderer.send("reload-me");
                // indexMedia = 0;
                // medias = allMedias;
                // playVideo();
              }
            } else {
              setTimeout(() => {
                console.log(
                  `Ошибка на ${containFileNumber} из ${filesForDownload.length} - `,
                  statsFile.size,
                  " : ",
                  +res.rawHeaders[7],
                  ": НЕ СКАЧАЛСЯ"
                );
                httpGet(video.file);
              }, 30000);
            }
          });
        }
      }, 1000);
    });
  };
  httpGet(video.videos[0].file);
};

const downloadSingleVideo = (video, y, truePlay) => {
  // console.log(video);
  isDownloading = true;
  console.log("Старт скачивания одного файла: ", video.name);
  console.log(video);
  video.file = host + video.file;
  video.name = video.title.toLowerCase() + "-" + y;
  let len = video.file.split(".").length;
  let ext = video.file.split(".")[len - 1];
  const path = mediafolder + "/" + video.name + "." + ext;
  // console.log(path);
  let file;
  let statsFile;

  const httpGet = (fileUrl) => {
    http.get(fileUrl, (res) => {
      // console.log(statsFile);
      file = fsold.createWriteStream(path);
      setTimeout(() => {
        console.log(`File ${video.name} must be download`);
        res.pipe(file);
        console.log(`File ${video.name} is downloading...`);
        res.on("end", () => {
          statsFile = fsold.statSync(path);
          console.log("Завершение скачивания");
          if (statsFile.size == +res.rawHeaders[7]) {
            isDownloading = false;
            console.log("Файл загружен");
            if (truePlay) {
              ipcRenderer.send("reload-me");
              // medias = allMedias;
              // playVideo();
            }
            // playVideo(allMedias);
          } else {
            setTimeout(() => {
              console.log(
                `Ошибка - `,
                statsFile.size,
                " : ",
                +res.rawHeaders[7],
                ": ФАЙЛ НЕ СКАЧАЛСЯ"
              );
              httpGet(video.file);
            }, 30000);
          }
        });
      }, 1000);
    });
  };
  httpGet(video.file);
};

const checkVideoWidth = (video) => {
  if (video.format === "full") {
    mediaPlayer.style.width = FULLWIDTH + "px";
  } else {
    mediaPlayer.style.width = VIDEOWIDTH + "px";
  }
};

const mediaPlayerStyle = () => {
  mediaPlayer.style.position = "absolute";
  mediaPlayer.style.top = 0;
  mediaPlayer.style.left = 0;
  mediaPlayer.style.height = VIDEOHEIGHT + "px";
  mediaPlayer.style.maxWidth = FULLWIDTH + "px";
  mediaPlayer.style.maxHeight = FULLHEIGHT + "px";
  mediaPlayer.style.transition = "all 0.25s ease";
  mediaPlayer.muted = true;
  mediaPlayer.left = 0;
};

const numMedia = (medias) => {
  if (medias[indexMedia].numMedia < medias[indexMedia].videos.length - 1) {
    medias[indexMedia].numMedia += 1;
  } else {
    medias[indexMedia].numMedia = 0;
  }
};

const nextPlay = () => {
  if (indexMedia < medias.length - 1) {
    numMedia(medias);
    indexMedia++;
  } else {
    numMedia(medias);
    indexMedia = 0;
  }
  num = medias[indexMedia].numMedia;
  video = medias[indexMedia].videos[num];
  checkVideoWidth(video);
  // console.log(video.size_video);
  if (
    fsold.existsSync(video.localfile) &&
    fsold.statSync(video.localfile).size > 0 &&
    fsold.statSync(video.localfile).size == Number(video.size_video)
  ) {
    // mediaPlayer.pause();
    mediaPlayer.src = video.localfile;
    // mediaPlayer.load();
    mediaPlayer.play();
  } else {
    if (navigator.onLine) {
      console.log(video);
      downloadSingleVideo(video, num);
    }
    nextPlay();
  }
  return;
};

const playVideo = () => {
  indexMedia = 0;

  let num = medias[indexMedia].numMedia;
  let video = medias[indexMedia].videos[num];

  checkVideoWidth(video);
  mediaPlayerStyle();

  if (
    fsold.existsSync(video.localfile) &&
    fsold.statSync(video.localfile).size > 0 &&
    fsold.statSync(video.localfile).size == Number(video.size_video)
  ) {
    mediaPlayer.src = video.localfile;
    placePlayer.append(mediaPlayer);
    mediaPlayer.play();
  } else {
    if (navigator.onLine) {
      console.log(video);
      downloadSingleVideo(video, num, true);
    }
    // indexMedia += 1;
    // nextPlay();
  }

  mediaPlayer.addEventListener("ended", () => {
    nextPlay();
  });
  return;
};

const swithOffRestart = () => {
  fetch(`${host}/api/v1/led/restart/${NAME_LED_DISPLAY}/`, {
    method: "GET",
  });
};

const checkUpdateContent = async () => {
  let response = await axios({
    method: "get",
    baseURL: "http://new.displaycontrol.ru",
    url: `/api/v1/led/${NAME_LED_DISPLAY}/`,
  });
  CHECKDATA = response.data;

  // console.log(response);
  if (response.status == 200) {
    rs = response.data.restart_player;
    if (rs) {
      swithOffRestart();
      fetchData(URL);
    }
  }
};

const autoCheckUpdateContent = async () => {
  let response = await axios({
    method: "get",
    baseURL: "http://new.displaycontrol.ru",
    url: `/api/v1/led/${NAME_LED_DISPLAY}/`,
  });
  CHECKDATA = response.data;

  if (response.status == 200) {
    if (JSON.stringify(CHECKDATA) !== DATAFROMJSONFILE) {
      rs = true;
      fetchData(URL);
    }
  }
};

setInterval(() => {
  if (navigator.onLine) {
    checkUpdateContent();
  }
}, 10000);

setInterval(() => {
  if (navigator.onLine) {
    autoCheckUpdateContent();
  }
}, 60000);

let n = 0;
const checkFileNum = setInterval(async () => {
  if (!isDownloading && n === indexMedia) {
    await console.log("Воспроизведение зависло");
    rs = await true;
    medias = allMedias;
    // await playVideo();
    n = indexMedia;
    if (navigator.onLine) {
      fetchData(URL);
    } else {
      ipcRenderer.send("reload-me");
    }
  } else {
    n = indexMedia;
  }
}, 30000);

// Автоматическая сверка контента

// const autoFetchData = async (url) => {
//   let response = await axios.get(url);
//   DATA = response.data;
//   // console.log(DATA);
//   await fs.writeFile(mediaJson, JSON.stringify(DATA), (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Файл JSON успешно создан");
//       autoReadJsonFile(mediaJson);
//     }
//   });
// };

// const autoReadJsonFile = (file) => {
//   fs.readJson(file, (err, obj) => {
//     if (err) {
//       console.error(err);
//       plaingNow = false;
//     } else {
//       allMedias = obj.blocks;
//       address = obj.adresses;
//       info = obj.infos;
//       console.log("Данные JSON переданны в переменные");

//       if (allMedias) {
//         console.log("MEDIAS ", allMedias);
//         autoContainFiles(allMedias);
//         autoDownLoadInfoImage();
//       } else {
//         console.log("MEDIAS NONE");
//         rs = true;
//       }
//     }
//   });
// };

// const autoContainFiles = (medias) => {
//   filesForDownload = [];
//   if (medias) {
//     let length = medias.length;
//     for (let i = 0; i < length; i++) {
//       let m = medias[i];
//       let lenBlock = m.videos.length;
//       for (let y = 0; y < lenBlock; y++) {
//         filesForDownload.push({
//           file: host + m.videos[y].file,
//           name: m.videos[y].title.toLowerCase() + "-" + y,
//         });
//         m.numMedia = 0;
//         let video = m.videos[y];
//         let title = video.title.toLowerCase() + "-" + y;
//         let len = video.file.split(".").length;
//         let ext = video.file.split(".")[len - 1];
//         medias[i].videos[y].localfile = mediafolder + "/" + title + "." + ext;
//       }
//     }
//     console.log("Список Файлов для скачивания: ", filesForDownload);
//     // playVideo(medias);
//   } else {
//     console.log("Файлы не собрались");
//     setTimeout(() => {
//       autoContainFiles(allMedias);
//     }, 30000);
//   }
// };

// const autoDownLoadInfoImage = async () => {
//   let length = info.length;
//   for (let i = 0; i < length; i++) {
//     let len = info[i].file.split(".").length;
//     let ext = info[i].file.split(".")[len - 1];
//     let localfile = dirInfo + "/" + i + "." + ext;
//     info[i].localfile = localfile;
//   }
// };

// setInterval(() => {
//   if (navigator.onLine && isDownloading == false) {
//     autoFetchData(URL);
//   }
// }, 3600000);
