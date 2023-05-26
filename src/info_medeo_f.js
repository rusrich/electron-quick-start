// let infoBlock = document.getElementById('info')

let lang = 'ru'
let trafficIndex = 1
let colorTraffic = 'green'
let imageObject
let infoType = 1
let cameraStatus
let startInfo

const TIMECHANGE = 20000

setTimeout(() => {
  if (lang === 'ru') {
    lang = 'kk'
  } else {
    lang = 'ru'
  }
  setLang()
  if (address) {
    place()
  } else {
    startInfo = setInterval(() => {
      if (address) {
        clearInterval(startInfo)
        place()
      }
    }, 5000)
  }
}, 3000)


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

let infoNum = 0

function place() {
  let infoBlock = document.getElementById('info')
  let infoblock = `
  <div id='place'>
    <div id='place-image'>
      <img src=${info[infoNum].localfile}>
    </div>
  </div>
  `
  infoBlock.innerHTML = infoblock
  setTimeout(() => {
    if (wTemp) {
      windDirection()
      weather()
    } else {
      setLang()
      place()
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
  let infoBlock = document.getElementById('info')
  let infoblock = `
  <div id='place'>
    <div id='main-weather' >
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
  </div>
  `
  infoBlock.innerHTML = infoblock
  updateTimer()
  mainWeather = document.getElementById('main-weather')
  colorBackground()
  // console.log(mainWeather);
  if (adNum < address.length - 1) {
    adNum += 1
  } else {
    adNum = 0
  }

  setTimeout(() => {
      setLang()
      place()
  }, TIMECHANGE)

  return;
}

let playerFlow


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
    mainWeather.className = 'hot-40'
  } else if (wTemp > 25 && wTemp <= 35) {
    mainWeather.className = 'hot-30'
  } else if (wTemp > 15 && wTemp <= 25) {
    mainWeather.className = 'hot-20'
  } else if (wTemp > 5 && wTemp <= 15) {
    mainWeather.className = 'hot-10'
  } else if (wTemp > -5 && wTemp <= 5) {
    mainWeather.className = 'mid-0'
  } else if (wTemp > -10 && wTemp <= -5) {
    mainWeather.className = 'cold-5'
  } else if (wTemp > -15 && wTemp <= -10) {
    mainWeather.className = 'cold-10'
  } else if (wTemp > -25 && wTemp <= -15) {
    mainWeather.className = 'cold-15'
  } else if (wTemp <= -25) {
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