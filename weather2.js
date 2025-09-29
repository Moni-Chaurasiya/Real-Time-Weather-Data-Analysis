
// weather.js
// Beginner-friendly Weather Data Analysis using OpenWeatherMap API

// 1. Import axios for API calls
const axios = require("axios");
const Chart = require("cli-chart");


// 2. Your OpenWeatherMap API key
const API_KEY = "902d9070a4608f74b4d239a70b4cbaef";  // Replace with your API key

// 3. List of cities
const cities = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bengaluru", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow","New Delhi"];

// Simple bar chart comparing temperatures
function visualizeWeather(weatherData) {
  const chart = new Chart({
    xlabel: "Cities",
    ylabel: "Temperature °C",
    direction: "y",
    width: 80,
    height: 20,
    lmargin: 10,
    step: 2,
  });

//   weatherData.forEach((city) => {
//     chart.addBar(city.temperature, city.city);
//   });
weatherData.forEach((city) => {
  chart.addBar(city.temperature); // only pass the number
});

// const colors = ["red", "green", "yellow", "blue", "magenta", "cyan", "white"];

// weatherData.forEach((city, i) => {
//   const color = colors[i % colors.length]; // cycle through colors
//   chart.addBar(city.temperature, color);
// });

  chart.draw();
}

// 4. Function to fetch weather data for a city
async function getWeather(city) {
  // encodeURIComponent handles spaces (e.g., "New Delhi" → "New%20Delhi")
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(URL);
    const data = response.data;

    return {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
    };
  } catch (error) {
    console.error(`Error fetching data for ${city}:`, error.response?.data || error.message);
    return null;
  }
}

async function main() {
  let weatherData = [];

  for (let city of cities) {
    const data = await getWeather(city);
    if (data) weatherData.push(data);
  }

  if (weatherData.length === 0) {
    console.log("⚠️ No weather data fetched. Please check your API key or internet connection.");
    return;
  }

  console.log("🌍 Weather Data:");
  console.table(weatherData);

  // Find hottest city
  const hottest = weatherData.reduce((a, b) =>
    a.temperature > b.temperature ? a : b
  );

  // Find most humid city
  const mostHumid = weatherData.reduce((a, b) =>
    a.humidity > b.humidity ? a : b
  );

  // Average temperature
  const avgTemp =
    weatherData.reduce((sum, city) => sum + city.temperature, 0) /
    weatherData.length;

  console.log(`🔥 Hottest City: ${hottest.city} (${hottest.temperature}°C)`);
  console.log(`💧 Most Humid City: ${mostHumid.city} (${mostHumid.humidity}%)`);
  console.log(`🌡️ Average Temperature: ${avgTemp.toFixed(2)}°C`);
  visualizeWeather(weatherData);
  console.log("📊 Temperature comparison chart generated above.");
}

// 6. Run the program
main();