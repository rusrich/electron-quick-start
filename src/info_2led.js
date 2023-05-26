// let infoBlock = document.getElementById('info')

let lang = 'ru'
let trafficIndex = 1
let colorTraffic = 'green'
let imageObject
let infoType = 1
let cameraStatus
let startInfo

const TIMECHANGE = 20000

// setTimeout(() => {
//   shymbulak()
// }, 17000)

setTimeout(() => {
  if (lang === 'ru') {
    lang = 'kk'
  } else {
    lang = 'ru'
  }
  setLang()
  if (address) {
    traffic()
  } else {
    startInfo = setInterval(() => {
      if (address) {
        clearInterval(startInfo)
        traffic()
      }
    }, 5000)
  }
}, 3000)

// setTimeout(() =>{
//   fetch('https://ipcam.kz:443/cam1/preview.jpg')
//     .then(response => {
//       if (response.status == 200) {
//         cameraStatus = true
//       } else {
//         cameraStatus = false
//       }
//     })
// }, 1000)

// setInterval(() => {
//   if (infoType === 1) {
//     if (lang === 'ru') {
//       lang = 'kk'
//     } else {
//       lang = 'ru'
//     }
//     setLang()
//     traffic()
//     infoType = 2
//   } else if (infoType === 2) {
//     // setLang()
//     place()
//     if (onlineStatus) {
//       fetch('https://ipcam.kz:443/cam1/preview.jpg')
//       .then(response => {
//         if (response.status == 200) {
//           cameraStatus = true
//           if (wTemp) {
//             infoType = 3
//           } else {
//             infoType = 1
//           }
//         } else {
//           cameraStatus = false
//           if (wTemp) {
//             infoType = 3
//           } else {
//             infoType = 1
//           }
//         }
//       })
//     } else {
//       infoType = 1
//     }
//     if (wTemp) {
//       infoType = 3
//     } else {
//       infoType = 1
//     }
    
//   } else if (infoType === 3) {
//     // setLang()
//     windDirection()
//     weather()
//     if (onlineStatus && cameraStatus) {
//       infoType = 4
//     } else {
//       infoType = 1
//     }
//     // infoType = 4
//   } else if (infoType === 4) {
//     shymbulak()
//     infoType = 1
//   }
// }, 20000)


const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const trafficSpeed = () => {
  if (moment().format('HH') >= 0 && moment().format('HH') <= 6) {
    trafficIndex = 1
    return getRandomInt(53, 57)
  } else if (moment().format('HH') === 7) {
    trafficIndex = 2
    return getRandomInt(45, 49)
  } else if (moment().format('HH') >= 8 && moment().format('HH') <= 10) {
    trafficIndex = 3
    return getRandomInt(39, 42)
  } else if (moment().format('HH') >= 11 && moment().format('HH') <= 13) {
    trafficIndex = 3
    return getRandomInt(38, 41)
  } else if (moment().format('HH') >= 15 && moment().format('HH') <= 17) {
    trafficIndex = 2
    return getRandomInt(40, 45)
  } else if (moment().format('HH') >= 18 && moment().format('HH') <= 20) {
    trafficIndex = 5
    return getRandomInt(30, 37)
  } else if (moment().format('HH') >= 21 && moment().format('HH') <= 23) {
    trafficIndex = 2
    return getRandomInt(45, 53)
  } else {
    trafficIndex = 1
    return getRandomInt(55, 57)
  }
}

function colorTrafficIndex() {
  if (trafficIndex == 1) {
    colorTraffic = 'green'
  } else if (trafficIndex == 2) {
    colorTraffic = 'yellowgreen'
  } else if (trafficIndex == 3) {
    colorTraffic = 'yellow'
  } else if (trafficIndex == 4) {
    colorTraffic = 'orange'
  } else if (trafficIndex == 5) {
    colorTraffic = 'red'
  }
  return;
}

let unitSpeed, speedTraf, strOne, strTwo, locale, wLocaleDes, wind, feeling

const setLang = () => {
  if (lang === 'ru') {
    unitSpeed = 'км/ч'
    speedTraf = 'Скорость потока'
    // address = ledInfo.address.split(',')[0]
    // strOne = ledInfo.streetOne.split(',')[0]
    // strTwo = ledInfo.streetTwo.split(',')[0]
    locale = 'ru'
    wLocaleDes = wDes
    wind = 'Ветер'
    feeling = 'Ощущается как'
  } else {
    unitSpeed = 'км/сағ'
    speedTraf = 'Ағын жылдамдығы'
    // address = ledInfo.address.split(',')[1]
    // strOne = ledInfo.streetOne.split(',')[1]
    // strTwo = ledInfo.streetTwo.split(',')[1]
    locale = 'kk'
    wLocaleDes = ''
    wind = 'Жел'
    feeling = 'Сияқты сезінеді'
  }
  return;
}

let adNum = 0

function traffic() {
  if (lang === 'ru') {
    lang = 'kk'
  } else {
    lang = 'ru'
  }
  let infoBlockL = document.getElementById('info-l')
  let infoBlockR = document.getElementById('info-r')
  timerInterval = 10000
  let trafSpeed = trafficSpeed()
  colorTrafficIndex()
  let infoblock = `
  <div id='traffic'>
    <div id='speed-block' class=${colorTraffic}>
      <div id='traffic-index' class=${colorTraffic}>
        <div id='traffic-index-number'>${trafficIndex}</div>
      </div>
      <div id='traffic-line'></div>
      <div id='traffic-speed-text'>${speedTraf}</div>
      <div id='traffic-speed'>${trafSpeed}</div>
      <div id='traffic-speed-km'>${unitSpeed}</div>
    </div>
    <div id='traffic-main-street-place'>${address[adNum].current_street} <img id='arrow-point' src='assets/point.png'></div>
    <div id='traffic-main-street-first'>
    ${address[adNum].street_one} <img id='arrow-${address[adNum].street_one_direction}' 
    class='${address[adNum].street_one_direction}' src='assets/arrow.png'>
    </div>
    <div id='traffic-main-street-second'>
    ${address[adNum].street_two} <img id='arrow-${address[adNum].street_two_direction}' 
    class='${address[adNum].street_two_direction}' src='assets/arrow.png'>
    </div>
  </div>
  `
  
  infoBlockL.innerHTML = infoblock
  infoBlockR.innerHTML = infoblock
  if (adNum < address.length - 1) {
    adNum += 1
  } else {
    adNum = 0
  }

  setTimeout(() => {
    place()
  }, TIMECHANGE)

  return;
}

let infoNum = 0

function place() {
  let infoBlockL = document.getElementById('info-l')
  let infoBlockR = document.getElementById('info-r')
  let infoblock = `
  <div id='place'>
    <div id='place-image'>
      <img src=${info[infoNum].localfile}>
    </div>
    <div id='place-info'>
      <div id='place-name'>${info[infoNum].name_building_kz}</div>
      <div id='place-distance-block'>
        <div id='place-arrow'><img id='arrow-place-${info[infoNum].building_direction}' src='assets/arrow.png'></div>
        <div id='place-distance'>${info[infoNum].distance} м.</div>
      </div>
    </div>
    <div id='traffic-main-street-first'>
    ${address[adNum].street_one} <img id='arrow-${address[adNum].street_one_direction}' 
    class='${address[adNum].street_one_direction}' src='assets/arrow.png'>
    </div>
    <div id='traffic-main-street-second'>
    ${address[adNum].street_two} <img id='arrow-${address[adNum].street_two_direction}' 
    class='${address[adNum].street_two_direction}' src='assets/arrow.png'>
    </div>
  </div>
  `
  infoBlockL.innerHTML = infoblock
  infoBlockR.innerHTML = infoblock
  if (infoNum < info.length - 1) {
    infoNum += 1
  } else {
    infoNum = 0
  }
  if (adNum < address.length - 1) {
    adNum += 1
  } else {
    adNum = 0
  }

  setTimeout(() => {
    if (wTemp) {
      windDirection()
      weather()
    } else {
      setLang()
      traffic()
    }
  }, TIMECHANGE)
  
  return;
}

let time

const updateTimer = () => {
  moment.locale(locale)
  time = moment().format('HH:mm')
  let timer = document.getElementById('time')
  timer.innerHTML = `${time}`
  dateDay = moment().format('DD.MM.YYYY, dddd')
  let date = document.getElementById('date')
  date.innerHTML = `${dateDay}`
  return;
}


function weather() {
  let infoBlockL = document.getElementById('info-l')
  let infoBlockR = document.getElementById('info-r')
  let infoblockl = `
  <div id='place'>
    <div id='main-weather-l' >
      <div id='time'></div>
      <div id='date'></div>
      <img id='w-icon' src='${wIcon}'>
      <div id='w-description'>${wLocaleDes}</div>
      <div id='w-temp-block'>
        <div id='w-temp'>
          <div class='w-plus'>${wPlus}</div>
          <div>${wTemp}°C</div>
        </div>

      </div>
      <div id='w-feel'>${feeling} ${wFeelTemp}°C</div>
      <div id='w-wind'>${wind}</div>
      <div id='w-wind-direction'>${wWindDirection}</div>
      <div id='w-wind-speed'>${wWindSpeed} м/с</div>
    </div>
    <div id='traffic-main-street-place'>${address[adNum].current_street} <img id='arrow-point' src='assets/point.png'></div>
    <div id='traffic-main-street-first'>
    ${address[adNum].street_one} <img id='arrow-${address[adNum].street_one_direction}' 
    class='${address[adNum].street_one_direction}' src='assets/arrow.png'>
    </div>
    <div id='traffic-main-street-second'>
    ${address[adNum].street_two} <img id='arrow-${address[adNum].street_two_direction}' 
    class='${address[adNum].street_two_direction}' src='assets/arrow.png'>
    </div>
  </div>
  `

  let infoblockr = `
  <div id='place'>
    <div id='main-weather-r' >
      <div id='time'></div>
      <div id='date'></div>
      <img id='w-icon' src='${wIcon}'>
      <div id='w-description'>${wLocaleDes}</div>
      <div id='w-temp-block'>
        <div id='w-temp'>
          <div class='w-plus'>${wPlus}</div>
          <div>${wTemp}°C</div>
        </div>

      </div>
      <div id='w-feel'>${feeling} ${wFeelTemp}°C</div>
      <div id='w-wind'>${wind}</div>
      <div id='w-wind-direction'>${wWindDirection}</div>
      <div id='w-wind-speed'>${wWindSpeed} м/с</div>
    </div>
    <div id='traffic-main-street-place'>${address[adNum].current_street} <img id='arrow-point' src='assets/point.png'></div>
    <div id='traffic-main-street-first'>
    ${address[adNum].street_one} <img id='arrow-${address[adNum].street_one_direction}' 
    class='${address[adNum].street_one_direction}' src='assets/arrow.png'>
    </div>
    <div id='traffic-main-street-second'>
    ${address[adNum].street_two} <img id='arrow-${address[adNum].street_two_direction}' 
    class='${address[adNum].street_two_direction}' src='assets/arrow.png'>
    </div>
  </div>
  `
  infoBlockL.innerHTML = infoblockl
  infoBlockR.innerHTML = infoblockr
  updateTimer()
  mainWeatherL = document.getElementById('main-weather-l')
  mainWeatherR = document.getElementById('main-weather-r')
  colorBackground()
  // console.log(mainWeather);
  if (adNum < address.length - 1) {
    adNum += 1
  } else {
    adNum = 0
  }

  try {
    cameraStatus = false
    fetch('https://ipcam.kz:443/cam1/preview.jpg')
      .then(response => {
        if (response.status == 200) {
          cameraStatus = true
        }})
  } catch {
    cameraStatus = false
  }

  setTimeout(() => {
    setLang()
    traffic()
}, TIMECHANGE)
  return;
}

let playerFlow

function shymbulak() {
  
  let infoBlockL = document.getElementById('info-l')
  let infoBlockR = document.getElementById('info-r')
  
  let shymWelcome = `Бұл уақытта шымбұлақта`
  let infoblock = `
  <div id='place'>
    <div id="shymcam">
    </div>
    <div id='main-shym' >
      <img id='shym-logo' src='assets/shym_logo.png'>
      <div id='shym-welcome'>${shymWelcome}</div>
      <div id='shym-temp-block'>
        <div id='w-temp'>
          <div id='shym-temp'>${wTemp}°C</div>
          <img id='shym-icon' src='${wIcon}'>
        </div>
      </div>
    </div>
    <div id="shymcam-2">
    </div>
  </div>
  `

  infoBlockL.innerHTML = infoblock
  infoBlockR.innerHTML = infoblock
  mainWeather = document.getElementById('main-weather')

  setTimeout(function() {
    let welcomeDiv = document.getElementById('shym-welcome')
    setTimeout(function() {
      welcomeDiv.innerHTML = `Тем временем на шымбулаке`
    }, 7000)
    setTimeout(function() {
      welcomeDiv.innerHTML = `Meanwhile on shymbulak`
    }, 14000)

    const placeholder = document.querySelector("#shymcam");
    const placeholder2 = document.querySelector("#shymcam-2");
    let url = 'https://ipcam.kz/Cam1test/video.m3u8'

    playerFlow = flowplayer(placeholder, {
      clip: {
        sources: [
          // path to the HLS m3u8
          { type: "application/x-mpegurl", src: url},
      ],
      },
      preload: "none",
      autoplay: true,
      delay: 0,
      live: true,
      hlsjs: {
        native: true,
        maxBufferLength: 5,
        backBufferLength: 0,
        maxBufferSize: 5,
        maxMaxBufferLength: 19,
      },
      bufferLength: 0,
      autoBuffering: false,
      preload: "none",
      
      poster: 'https://ipcam.kz:443/cam1/preview.jpg',
    })

    let image = document.createElement('img');
    image.src = 'https://ipcam.kz:443/cam3/preview.jpg'
    image.width = 250
    image.height = 141

    placeholder2.append(image)

    // console.log(playerFlow);

    setTimeout(function() {
      playerFlow.stop()
      playerFlow.engine.hls.stopLoad()
      playerFlow.shutdown()
      playerFlow.engine.hls.detachMedia()
      playerFlow = null
    }, 19000)
  }, 1000)

  if (adNum < address.length - 1) {
    adNum += 1
  } else {
    adNum = 0
  }
  // let videoHLS = document.getElementById('video1')
  // let videoHLS2 = document.getElementById('video2')

  // if(Hls.isSupported())
  //   {
        
  //       videoHLS.width = 250
  //       let hls = new Hls();
  //       // hls.loadSource('https://ipcam.kz:443/cam1/index.m3u8');
  //       hls.loadSource('https://ipcam.kz/Cam1test/video.m3u8');
  //       hls.attachMedia(videoHLS);
  //       hls.on(Hls.Events.MANIFEST_PARSED,function()
  //       {
  //           console.log(videoHLS);
  //           videoHLS.play();
  //       });


  //       videoHLS2.width = 250
  //       let hls2 = new Hls();
  //       // hls2.loadSource('https://ipcam.kz:443/cam2/index.m3u8');
  //       hls2.loadSource('https://ipcam.kz/Cam1test/video.m3u8');
  //       hls2.attachMedia(videoHLS2);
  //       hls2.on(Hls.Events.MANIFEST_PARSED,function()
  //       {
  //           videoHLS2.play();
  //       });
  //   }

  // let status1
  // let status2
  // setTimeout(() => {
  //   status1 = playerFlow.engine.hls.streamController.fragCurrent.stats.loaded
  // }, 1000)

  // const checkstream = setInterval(() => {
  //   status2 = playerFlow.engine.hls.streamController.fragCurrent.stats.loaded
  //   if (status1 === status2) {
  //     setLang()
  //     traffic()
  //   } else {
  //     status1 = playerFlow.engine.hls.streamController.fragCurrent.stats.loaded
  //   }
  // }, 2000)
  
  setTimeout(() => {
    // clearInterval(checkstream)
    setLang()
    traffic()
  }, TIMECHANGE)
  return
}


let wCity, wTemp, wTempMin, wTempMax, wPlus, wFeelTemp, wIcon, wDes, wMain, wWindSpeed, wWindDeg, wWindGust, wWindDirection

const API_KEY = '71230f0c1c3fa94227348c54d50db6a0'
const id_city = '1526384'
const urlW = `https://api.openweathermap.org/data/2.5/weather?id=${id_city}&appid=`

const getWeatherData = async () => {
  let response = fetch(`${urlW}${API_KEY}&units=metric&lang=ru`, {
    method: 'GET'
  })
  const result = await (await response).json()
  wCity = result.name
  wTemp = Math.floor(result.main.temp)
  wTempMin = Math.floor(result.main.temp_min - 5)
  wTempMax = Math.floor(result.main.temp_max + 7)
  if (Math.floor(result.main.temp) >= 0) {
    wPlus = '+'
  } else {
    wPlus = ''
  }
  wFeelTemp = Math.floor(result.main.feels_like)
  wIcon = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`
  wDes = result.weather[0].description
  wMain = result.weather[0].main
  wWindSpeed = result.wind.speed
  wWindDeg = result.wind.deg
  return;
}

const windDirection = () => {
  if (lang !== 'ru') {
    if (wWindDeg >= 0 && wWindDeg <= 22) {
      wWindDirection = 'Северный'
    } else if (wWindDeg > 22 && wWindDeg <= 67) {
      wWindDirection = 'Северо-Восточный'
    } else if (wWindDeg > 67 && wWindDeg <= 112) {
      wWindDirection = 'Восточный'
    } else if (wWindDeg > 112 && wWindDeg <= 155) {
      wWindDirection = 'Юго-Восточный'
    } else if (wWindDeg > 155 && wWindDeg <= 200) {
      wWindDirection = 'Южный'
    } else if (wWindDeg > 200 && wWindDeg <= 245) {
      wWindDirection = 'Юго-Западный'
    } else if (wWindDeg > 245 && wWindDeg <= 290) {
      wWindDirection = 'Западный'
    } else if (wWindDeg > 290 && wWindDeg <= 335) {
      wWindDirection = 'Северо-Западный'
    } else if (wWindDeg > 335 && wWindDeg <= 359) {
      wWindDirection = 'Северный'
    } else {
      wWindDirection = 'Безветряно'
    }
  } else {
    if (wWindDeg >= 0 && wWindDeg <= 22) {
      wWindDirection = 'Солтүстік'
    } else if (wWindDeg > 22 && wWindDeg <= 67) {
      wWindDirection = 'Солтүстік-шығыс'
    } else if (wWindDeg > 67 && wWindDeg <= 112) {
      wWindDirection = 'Шығыс'
    } else if (wWindDeg > 112 && wWindDeg <= 155) {
      wWindDirection = 'Оңтүстік-шығыс'
    } else if (wWindDeg > 155 && wWindDeg <= 200) {
      wWindDirection = 'Оңтүстік'
    } else if (wWindDeg > 200 && wWindDeg <= 245) {
      wWindDirection = 'Оңтүстік-батыс'
    } else if (wWindDeg > 245 && wWindDeg <= 290) {
      wWindDirection = 'Батыс'
    } else if (wWindDeg > 290 && wWindDeg <= 335) {
      wWindDirection = 'Солтүстік-Батыс'
    } else if (wWindDeg > 335 && wWindDeg <= 359) {
      wWindDirection = 'Солтүстік'
    } else {
      wWindDirection = 'Желсіз'
    }
  }
  return;
}

let mainWeather

const colorBackground = () => {
  if (wTemp > 35) {
    mainWeatherL.className = 'hot-40'
    mainWeatherR.className = 'hot-40'
  } else if (wTemp > 25 && wTemp <= 35) {
    mainWeatherL.className = 'hot-30'
    mainWeatherR.className = 'hot-30'
  } else if (wTemp > 15 && wTemp <= 25) {
    mainWeatherL.className = 'hot-20'
    mainWeatherR.className = 'hot-20'
  } else if (wTemp > 5 && wTemp <= 15) {
    mainWeatherL.className = 'hot-10'
    mainWeatherR.className = 'hot-10'
  } else if (wTemp > -5 && wTemp <= 5) {
    mainWeatherL.className = 'mid-0'
    mainWeatherR.className = 'mid-0'
  } else if (wTemp > -10 && wTemp <= -5) {
    mainWeatherL.className = 'cold-5'
    mainWeatherR.className = 'cold-5'
  } else if (wTemp > -15 && wTemp <= -10) {
    mainWeatherL.className = 'cold-10'
    mainWeatherR.className = 'cold-10'
  } else if (wTemp > -25 && wTemp <= -15) {
    mainWeatherL.className = 'cold-15'
    mainWeatherR.className = 'cold-15'
  } else if (wTemp <= -25) {
    mainWeather.className = 'cold-20'
    mainWeather.className = 'cold-20'
  }
  return;
}

setTimeout(() => {
  if (navigator.onLine) {
    getWeatherData()
  }
}, 35000)

setInterval(() => {
  if (navigator.onLine) {
    getWeatherData()
  }
}, 600000)

setInterval(() => {
  console.clear();
}, 1800000)