const apiKey = "64d3bfeaf67e517b9ba3de1a9b8f4a99";

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  fetchWeatherData(city);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(geoUrl)
        .then(res => res.json())
        .then(data => {
          const city = data.name;
          fetchWeatherData(city);
        })
        .catch(() => alert("Failed to get location weather"));
    }, () => {
      alert("Location access denied");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function fetchWeatherData(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      updateBackground(data.weather[0].main.toLowerCase());
    });

  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      displayForecast(data);
    });
}

function displayWeather(data) {
  const weatherDiv = document.getElementById("weatherInfo");
  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp} °C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🔵 Pressure: ${data.main.pressure} hPa</p>
        <p>🌬️ Wind: ${data.wind.speed} m/s</p>
        <p>☁️ Condition: ${data.weather[0].description}</p>
  `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const filtered = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!filtered[date] && Object.keys(filtered).length < 5) {
      filtered[date] = item;
    }
  });

  Object.values(filtered).forEach(day => {
    const date = new Date(day.dt_txt).toDateString();
    forecastDiv.innerHTML += `
      <div class="forecast-card">
        <h4>${date}</h4>
        <p>${day.weather[0].main}</p>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}

function updateBackground(condition) {
  const video = document.getElementById("bgVideo");
  const source = document.getElementById("bgSource");

  let videoFile = "clear.mp4"; // default

  if (condition.includes("rain")) {
    videoFile = "rain2.mp4";
    video.muted = false;
  } else if (condition.includes("cloud")) {
    videoFile = "cloud2.mp4";
    video.muted = true;
  } else if (condition.includes("storm") || condition.includes("thunder")) {
    videoFile = "Storm2.mp4";
    video.muted = true;
  } else {
    videoFile = "Sunny2.mp4";
    video.muted = true;
  }

  source.src = videoFile;
  video.load();
  video.hidden = false;
}