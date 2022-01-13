const iconElement = document.querySelector('.weather-icon')
const tempElement = document.querySelector('.temperature-value p')
const descElement = document.querySelector('.temperature-description p')
const locationElement = document.querySelector('.location p')
const notificationElement = document.querySelector('.notification')

const weather = {}
weather.temperature = {
    unit: 'celcius'
}

const KELVIN = 273
const key = 'bc92c385159b74837d17bb2955314b74'

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} 
else {
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = '<p> Dein Browser unterstützt leider kein Geolokalisierung :('
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude

    getWeather(latitude, longitude)
}

function showError(error) {
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = `<p> ${error.message}`
}

function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}`
    let city = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${key}`

    fetch(city)
        .then(function(response){
            let town = response.json();
            return town
        })
        .then(function(town){
            weather.city = town[0].name;
        })

    fetch(api)
        .then(function(response){
            let data = response.json()
            console.log(data)
            return data
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.current.temp - KELVIN);
            weather.description = data.current.weather[0].description;
            console.log(data.current.weather[0].icon);
            weather.iconId = data.current.weather[0].icon;
        })
        .then(function(){
            displayWeather()
        })
}

function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = weather.city;
}