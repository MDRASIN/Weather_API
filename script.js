const apiKey = "64d3bfeaf67e517b9ba3de1a9b8f4a99";

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch current weather
  fetch(currentUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        document.getElementById("weatherInfo").innerHTML = `<p>City not found!</p>`;
        return;
      }

      const weatherInfo = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp} °C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🔵 Pressure: ${data.main.pressure} hPa</p>
        <p>🌬️ Wind: ${data.wind.speed} m/s</p>
        <p>☁️ Condition: ${data.weather[0].description}</p>
      `;
      document.getElementById("weatherInfo").innerHTML = weatherInfo;
    });

  // Fetch 5-day forecast
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecast");
      forecastContainer.innerHTML = "";

      // Filter to get 1 forecast per day (around 12:00 PM)
      const filtered = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      filtered.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const temp = day.main.temp;
        const icon = day.weather[0].icon;
        const description = day.weather[0].main;

        const card = `
          <div class="forecast-card">
            <p>${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
            <p>${temp.toFixed(1)}°C</p>
            <p>${description}</p>
          </div>
        `;

        forecastContainer.innerHTML += card;
      });
    });
}
