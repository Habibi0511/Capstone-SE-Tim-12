// Search
const form = document.getElementById('form');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    try {
        callApi(e.srcElement[0].value);
    } catch (error) {
        console.log(error);
    }
})

// Kiri
const city = document.getElementById('city');
const country = document.getElementById('country');
const img_condition = document.getElementById('img_condition');
const day = document.getElementById('day');
const dateTime = document.getElementById('date');
const temp = document.getElementById('temp');
const condition = document.getElementById('condition');

// Tengah
const uvIndex = document.getElementById('uvIndex');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const airQuality = document.getElementById('airQuality');
const visibility = document.getElementById('visibility');

// Kanan
const forecast = document.getElementById('forecast');

// City List
const cities = ['Jakarta','Semarang','Biak','Tangerang','Bogor','Yogyakarta','Banjarmasin'];

// US - EPA standard.
const EPA = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy',
    4: 'Unhealthy',
    5: 'Very Unhealthy',
    6: 'Hazardous',
}

const renderWeather = (data) => {
    // Kiri
    const date = new Date();
    city.textContent = data.location.name;
    country.textContent = data.location.country;
    img_condition.src = data.current.condition.icon
    day.innerHTML = `${date.toLocaleDateString('en-us', { weekday:"long" })}, <span>${date.getHours()}:${date.getMinutes()}</span>`
    dateTime.textContent = date.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})
    temp.textContent = data.current.temp_c+'°C';
    condition.textContent = data.current.condition.text;

    // Tengah
    uvIndex.textContent = data.current.uv;
    wind.textContent = data.current.wind_kph+'km/h';
    humidity.textContent = data.current.humidity+'%';
    pressure.textContent = data.current.pressure_in+' inch';
    airQuality.textContent = EPA[data.current.air_quality['us-epa-index']];
    visibility.textContent = data.current.vis_km+'Km';

    // Kanan
    forecast.querySelectorAll('div').forEach((el,i)=>{
        el.children[0].textContent = i===0 ? 'Today' : new Date(data.forecast.forecastday[i].date).toLocaleDateString('en-us', { weekday:"short" });
        el.children[1].firstChild.src = i===0 ? data.current.condition.icon : data.forecast.forecastday[i].day.condition.icon;
        el.children[2].textContent = i===0 ? data.current.temp_c+'°C' : data.forecast.forecastday[i].day.avgtemp_c+'°C';
    })
}

const callApi = async (city) => {
    const apiKey = 'f05bea70fd884a22b0b85158231906';
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`);
    const data = await res.json();
    if (data.location.country!=='Indonesia') {
        return;
    }
    renderWeather(data);
}

callApi(cities[Math.floor(Math.random()*cities.length)]);
