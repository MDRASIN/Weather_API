const apiKey = "64d3bfeaf67e517b9ba3de1a9b8f4a99"; // Replace with your key

const bgVideo = document.getElementById("bgVideo");
const bgSource = document.getElementById("bgSource");
const weatherInfo = document.getElementById("weatherInfo");
const forecastTitle = document.getElementById("forecastTitle");
const forecastContainer = document.getElementById("forecast");
const tempChart = document.getElementById("tempChart");

let chart; // Global Chart instance
function setBackground(condition) {
  const conditionMap = {
    Rain: "rain.mp4",
    Clear: "clear.mp4",
    Clouds: "clouds.mp4",
    Thunderstorm: "storm.mp4"
  };
  const videoFile = conditionMap[condition] || "clear.mp4";
  bgSource.src = videoFile;
  bgVideo.load();
  bgVideo.muted = false;
  bgVideo.style.display = "block";
  bgVideo.play();
}


async function getWeather() {
 
document.getElementById("cont").style.height = "auto";
  const city = document.getElementById("cityInput").value.trim();

  if (!city) return alert("Please enter a city name");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(url),
      fetch(forecastUrl)
    ]);
    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    displayWeather(weatherData);
    displayForecast(forecastData.list);
    setBackground(weatherData.weather[0].main);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function displayWeather(data) {
  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(forecastList) {
  const daily = {};
  forecastList.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  const days = Object.values(daily).slice(0, 5);

  forecastTitle.style.display = "block";
  forecastContainer.innerHTML = days.map(day => {
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: 'short' });
    return `
      <div class="forecast-card">
        <h4>${date}</h4>
        <img src="${icon}" alt="${day.weather[0].description}" />
        <p>${day.main.temp.toFixed(1)}°C</p>
        <small>${day.weather[0].main}</small>
      </div>
    `;
  }).join("");

  drawChart(days);
}

function drawChart(days) {
  const labels = days.map(day => new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: 'short' }));
  const temps = days.map(day => day.main.temp);

  if (chart) chart.destroy();
  chart = new Chart(tempChart, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        fill: true,
        borderColor: "#ffcb05",
        backgroundColor: "rgba(255,203,5,0.2)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(url),
          fetch(forecastUrl)
        ]);
        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        displayWeather(weatherData);
        displayForecast(forecastData.list);
        setBackground(weatherData.weather[0].main);
      } catch (err) {
        alert("Unable to fetch weather data.");
      }
    }, () => alert("Geolocation failed or denied."));
  } else {
    alert("Geolocation not supported by your browser.");
  }
}
