const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const locationWeatherBox = document.getElementById('location-weather-box');
const temperature = document.getElementById('temperature');
const lastUpdate = document.getElementById('last-update');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const uvIndexContent = document.getElementById('uv-index-content');
const windContent = document.getElementById('wind-content');
const humidityContent = document.getElementById('humidity-content');
const forecastContainer = document.getElementById('forecast-container');
const suggestionsList = document.getElementById('suggestions');

searchBtn.addEventListener('click', () => {
    const searchValue = searchInput.value;
    getWeatherData(searchValue);
});

searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.trim();
    if (searchValue !== '') {
        getSearchSuggestions(searchValue);
} else {
    suggestionsList.innerHTML = '';
    }
});

// Mendapatkan data cuaca berdasarkan lokasi
function getWeatherData(location) {
    const apiKey = 'a6497913cf13aa1c8c56af116b4ef52f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Mengupdate data cuaca saat ini
            locationWeatherBox.textContent = data.name + ', ' + data.sys.country;

            weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            weatherDescription.textContent = capitalizeFirstLetter(data.weather[0].description);

            // Mengupdate temperature, kecepatan angin, dan kelembapan
            temperature.textContent = data.main.temp + '°C';
            windContent.textContent = data?.wind?.speed + ' km/h' || 'N/A';
            humidityContent.textContent = data?.main?.humidity + '%' || 'N/A';
            lastUpdate.textContent = 'Last Update: ' + getCurrentTime(false);
        })
        .catch(error => {
            console.log('Terjadi kesalahan:', error);
        });
}

// Mendapatkan daftar rekomendasi untuk kotak pencarian
function getSearchSuggestions(searchValue) {
    const apiKey = 'a6497913cf13aa1c8c56af116b4ef52f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${searchValue}&type=like&sort=population&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            suggestionsList.innerHTML = '';

            data.list.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                suggestionsList.appendChild(option);
            });
        })
        .catch(error => {
            console.log('Terjadi kesalahan:', error);
        });        
    }

// Mendapatkan daftar rekomendasi teratas untuk kotak pencarian
function getTopSearchSuggestions(searchValue) {
    const apiKey = 'a6497913cf13aa1c8c56af116b4ef52f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${searchValue}&type=like&sort=population&cnt=3&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            suggestionsList.innerHTML = '';

            data.list.slice(0, 3).forEach(item => {
                const option = document.createElement('option');
                option.value = item.name;
                suggestionsList.appendChild(option);
            });
        })
        .catch(error => {
            console.log('Terjadi kesalahan:', error);
        });
}

// Mendapatkan data ramalan cuaca 3 hari ke depan
function getForecastData(location) {
    const apiKey = 'a6497913cf13aa1c8c56af116b4ef52f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Mengupdate data ramalan cuaca 3 hari
            forecastContainer.innerHTML = '';

            for (let i = 0; i < 3; i++) {
                const forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                const day = document.createElement('div');
                day.classList.add('day');
                const weatherIcon = document.createElement('div');
                const weatherDescription = document.createElement('div');
                weatherDescription.classList.add('weather-description');
                weatherIcon.classList.add('weather-icon');
                const temperature = document.createElement('div');
                temperature.classList.add('temperature');

                const forecastData = data.list[i * 8];

                const date = new Date(forecastData.dt * 1000);
                day.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
                weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png" alt="Cuaca ${i + 1}">`;
                temperature.textContent = forecastData.main.temp + '°C';
                weatherDescription.textContent = capitalizeFirstLetter(forecastData.weather[0].description);

                forecastDay.appendChild(day);
                forecastDay.appendChild(weatherIcon);
                forecastDay.appendChild(weatherDescription);
                forecastDay.appendChild(temperature);
                forecastContainer.appendChild(forecastDay);
            }
        })
        .catch(error => {
            console.log('Terjadi kesalahan:', error);
        });
}

// Mengubah huruf pertama menjadi huruf kapital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Mendapatkan waktu saat ini
function getCurrentTime(includeSeconds) {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    let time = `${hours}:${minutes}`;

    if (includeSeconds) {
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        time += `:${seconds}`;
    }

    return time;
}

// Mendapatkan data cuaca untuk lokasi Jakarta, Indonesia secara default
function getDefaultWeatherData() {
    const defaultLocation = 'Jakarta, Indonesia';
    getWeatherData(defaultLocation);
    getForecastData(defaultLocation);
}

// Mengambil data cuaca saat search box ditekan
const searchBox = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-btn');

searchButton.addEventListener('click', () => {
    const location = searchBox.value.trim();
    if (location !== '') {
        getWeatherData(location);
        getForecastData(location);
    }
});



// Mendapatkan data cuaca saat search box ditekan tombol Enter
searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const location = searchBox.value.trim();
        if (location !== '') {
            getWeatherData(location);
            getForecastData(location);
        }
    }
});

// Memanggil fungsi getDefaultWeatherData saat halaman dimuat
window.addEventListener('load', () => {
    getDefaultWeatherData();
});
