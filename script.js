const apiKey = "64d3bfeaf67e517b9ba3de1a9b8f4a99"; // From OpenWeatherMap

function getWeather() {
  const city = document.getElementById("cityInput").value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const weatherInfo = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
        <p>Wind: ${data.wind.speed} m/s</p>
        <p>Condition: ${data.weather[0].description}</p>
      `;
      document.getElementById("weatherInfo").innerHTML = weatherInfo;
    })
    .catch(() => {
      document.getElementById("weatherInfo").innerHTML = "City not found!";
    });
}
