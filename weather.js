const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = "902d9070a4608f74b4d239a70b4cbaef";
const DATA_FILE = "weather_data.json";
const HISTORY_FILE = "weather_history.csv";

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Kolkata",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "New Delhi",
  "Surat",
  "Kanpur",
  "Nagpur",
  "Indore"
];

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m"
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function displayHeader() {
  console.clear();
  console.log(colorize("=".repeat(80), "yellow"));
  console.log(colorize("                    WEATHER DATA ANALYSIS SYSTEM", "cyan"));
  console.log(colorize("           Big Data Analysis Mini Project - Real-time Weather Data", "green"));
  console.log(colorize("=".repeat(80), "yellow"));
  console.log();
}

async function getWeatherData(city) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  try {
    console.log(colorize(`📡 Fetching data for ${city}...`, "gray"));
    const response = await axios.get(URL);
    const data = response.data;
    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_direction: data.wind.deg,
      visibility: data.visibility / 1000,
      clouds: data.clouds.all,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      timestamp: new Date().toISOString(),
      unix_time: data.dt,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
    };
  } catch (error) {
    console.error(colorize(`❌ Error fetching data for ${city}: ${error.message}`, "red"));
    return null;
  }
}

// function saveToFile(data) {
//   try {
//     const dataToSave = {
//       timestamp: new Date().toISOString(),
//       data: data
//     };
//     fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
//     console.log(colorize(`✅ Data saved to ${DATA_FILE}`, "green"));
//   } catch (error) {
//     console.error(colorize(`❌ Error saving data: ${error.message}`, "red"));
//   }
// }

// function appendToCSV(weatherData) {
//   try {
//     if (!fs.existsSync(HISTORY_FILE)) {
//       const headers = "Timestamp,City,Temperature,Humidity,Pressure,Wind Speed,Weather,Description\n";
//       fs.writeFileSync(HISTORY_FILE, headers);
//     }
//     weatherData.forEach(data => {
//       const row = `${data.timestamp},${data.city},${data.temperature},${data.humidity},${data.pressure},${data.wind_speed},${data.weather},"${data.description}"\n`;
//       fs.appendFileSync(HISTORY_FILE, row);
//     });
//     console.log(colorize(`✅ Data appended to ${HISTORY_FILE}`, "green"));
//   } catch (error) {
//     console.error(colorize(`❌ Error appending to CSV: ${error.message}`, "red"));
//   }
// }

function displayTable(weatherData) {
  console.log("\n" + colorize("📊 CURRENT WEATHER DATA", "yellow"));
  console.log(colorize("=".repeat(120), "gray"));
  console.log(
    colorize("City".padEnd(15), "cyan") + " | " +
    colorize("Temp(°C)".padEnd(10), "cyan") + " | " +
    colorize("Feels Like".padEnd(12), "cyan") + " | " +
    colorize("Humidity(%)".padEnd(12), "cyan") + " | " +
    colorize("Pressure(hPa)".padEnd(14), "cyan") + " | " +
    colorize("Wind(m/s)".padEnd(10), "cyan") + " | " +
    colorize("Weather".padEnd(12), "cyan") + " | " +
    colorize("Visibility(km)", "cyan")
  );
  console.log(colorize("-".repeat(120), "gray"));
  weatherData.forEach(data => {
    let tempColor;
    if (data.temperature > 35) tempColor = "red";
    else if (data.temperature > 25) tempColor = "yellow";
    else if (data.temperature > 15) tempColor = "green";
    else tempColor = "blue";
    let humidityColor = data.humidity > 70 ? "blue" : "green";
    console.log(
      colorize(data.city.padEnd(15), "white") + " | " +
      colorize(data.temperature.toFixed(1).padEnd(10), tempColor) + " | " +
      colorize(data.feels_like.toFixed(1).padEnd(12), "gray") + " | " +
      colorize(data.humidity.toString().padEnd(12), humidityColor) + " | " +
      colorize(data.pressure.toString().padEnd(14), "magenta") + " | " +
      colorize(data.wind_speed.toFixed(1).padEnd(10), "yellow") + " | " +
      colorize(data.weather.padEnd(12), "white") + " | " +
      colorize(data.visibility.toFixed(1), "gray")
    );
  });
  console.log(colorize("=".repeat(120), "gray"));
}

function createTemperatureChart(weatherData) {
  console.log("\n" + colorize("🌡️  TEMPERATURE CHART", "yellow"));
  console.log(colorize("=".repeat(80), "gray"));
  const sortedData = [...weatherData].sort((a, b) => b.temperature - a.temperature);
  const maxTemp = Math.max(...sortedData.map(d => d.temperature));
  sortedData.forEach(data => {
    const barLength = Math.round((data.temperature / maxTemp) * 50);
    let barColor;
    if (data.temperature > 35) barColor = "red";
    else if (data.temperature > 25) barColor = "yellow";
    else if (data.temperature > 15) barColor = "green";
    else barColor = "blue";
    const bar = colorize("█".repeat(barLength), barColor);
    const cityName = data.city.padEnd(15);
    console.log(
      colorize(cityName, "cyan") + " " + 
      bar + " " + 
      colorize(data.temperature.toFixed(1) + "°C", "white")
    );
  });
  console.log(colorize("=".repeat(80), "gray"));
}

function createHumidityChart(weatherData) {
  console.log("\n" + colorize("💧 HUMIDITY LEVELS", "yellow"));
  console.log(colorize("=".repeat(80), "gray"));
  const sortedData = [...weatherData].sort((a, b) => b.humidity - a.humidity);
  sortedData.forEach(data => {
    const barLength = Math.round((data.humidity / 100) * 40);
    let barColor;
    if (data.humidity > 80) barColor = "blue";
    else if (data.humidity > 60) barColor = "cyan";
    else if (data.humidity > 40) barColor = "green";
    else barColor = "yellow";
    const bar = colorize("▓".repeat(barLength), barColor);
    const cityName = data.city.padEnd(15);
    console.log(
      colorize(cityName, "cyan") + " " + 
      bar + " " + 
      colorize(data.humidity + "%", "white")
    );
  });
  console.log(colorize("=".repeat(80), "gray"));
}

function createWindSpeedChart(weatherData) {
  console.log("\n" + colorize("💨 WIND SPEED CHART", "yellow"));
  console.log(colorize("=".repeat(80), "gray"));
  const sortedData = [...weatherData].sort((a, b) => b.wind_speed - a.wind_speed);
  const maxWind = Math.max(...sortedData.map(d => d.wind_speed));
  sortedData.forEach(data => {
    const barLength = Math.round((data.wind_speed / maxWind) * 40);
    let barColor;
    if (data.wind_speed > 10) barColor = "red";
    else if (data.wind_speed > 5) barColor = "yellow";
    else barColor = "green";
    const bar = colorize("▬".repeat(barLength), barColor);
    const cityName = data.city.padEnd(15);
    console.log(
      colorize(cityName, "cyan") + " " + 
      bar + " " + 
      colorize(data.wind_speed.toFixed(1) + " m/s", "white")
    );
  });
  console.log(colorize("=".repeat(80), "gray"));
}

function displayStatistics(weatherData) {
  console.log("\n" + colorize("📈 STATISTICAL ANALYSIS", "yellow"));
  console.log(colorize("=".repeat(80), "gray"));
  const temperatures = weatherData.map(d => d.temperature);
  const humidities = weatherData.map(d => d.humidity);
  const pressures = weatherData.map(d => d.pressure);
  const windSpeeds = weatherData.map(d => d.wind_speed);
  const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);
  const tempRange = maxTemp - minTemp;
  const tempVariance = temperatures.reduce((sum, temp) => sum + Math.pow(temp - avgTemp, 2), 0) / temperatures.length;
  const tempStdDev = Math.sqrt(tempVariance);
  const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
  const maxHumidity = Math.max(...humidities);
  const minHumidity = Math.min(...humidities);
  const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
  const maxPressure = Math.max(...pressures);
  const minPressure = Math.min(...pressures);
  const avgWindSpeed = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length;
  const maxWindSpeed = Math.max(...windSpeeds);
  const hottestCity = weatherData.find(d => d.temperature === maxTemp);
  const coldestCity = weatherData.find(d => d.temperature === minTemp);
  const mostHumidCity = weatherData.find(d => d.humidity === maxHumidity);
  const driestCity = weatherData.find(d => d.humidity === minHumidity);
  const windiestCity = weatherData.find(d => d.wind_speed === maxWindSpeed);
  console.log(colorize("\n🌡️  TEMPERATURE STATISTICS:", "green"));
  console.log("  • Average Temperature: " + colorize(avgTemp.toFixed(2) + "°C", "yellow"));
  console.log("  • Maximum Temperature: " + colorize(maxTemp.toFixed(2) + "°C", "red") + " (" + hottestCity.city + ")");
  console.log("  • Minimum Temperature: " + colorize(minTemp.toFixed(2) + "°C", "blue") + " (" + coldestCity.city + ")");
  console.log("  • Temperature Range: " + colorize(tempRange.toFixed(2) + "°C", "magenta"));
  console.log("  • Standard Deviation: " + colorize(tempStdDev.toFixed(2) + "°C", "cyan"));
  console.log(colorize("\n💧 HUMIDITY STATISTICS:", "green"));
  console.log("  • Average Humidity: " + colorize(avgHumidity.toFixed(2) + "%", "yellow"));
  console.log("  • Maximum Humidity: " + colorize(maxHumidity + "%", "blue") + " (" + mostHumidCity.city + ")");
  console.log("  • Minimum Humidity: " + colorize(minHumidity + "%", "yellow") + " (" + driestCity.city + ")");
  console.log(colorize("\n🔵 PRESSURE STATISTICS:", "green"));
  console.log("  • Average Pressure: " + colorize(avgPressure.toFixed(2) + " hPa", "cyan"));
  console.log("  • Maximum Pressure: " + colorize(maxPressure + " hPa", "cyan"));
  console.log("  • Minimum Pressure: " + colorize(minPressure + " hPa", "cyan"));
  console.log(colorize("\n💨 WIND STATISTICS:", "green"));
  console.log("  • Average Wind Speed: " + colorize(avgWindSpeed.toFixed(2) + " m/s", "gray"));
  console.log("  • Maximum Wind Speed: " + colorize(maxWindSpeed.toFixed(2) + " m/s", "red") + " (" + windiestCity.city + ")");
  console.log(colorize("=".repeat(80), "gray"));
}

function displayWeatherSummary(weatherData) {
  console.log("\n" + colorize("☁️  WEATHER CONDITIONS SUMMARY", "yellow"));
  console.log(colorize("=".repeat(80), "gray"));
  const weatherCounts = {};
  weatherData.forEach(data => {
    weatherCounts[data.weather] = (weatherCounts[data.weather] || 0) + 1;
  });
  const weatherEmojis = {
    "Clear": "☀️",
    "Clouds": "☁️",
    "Rain": "🌧️",
    "Drizzle": "🌦️",
    "Thunderstorm": "⛈️",
    "Snow": "❄️",
    "Mist": "🌫️",
    "Smoke": "💨",
    "Haze": "🌫️",
    "Dust": "🌪️",
    "Fog": "🌁"
  };
  Object.entries(weatherCounts).forEach(([weather, count]) => {
    const emoji = weatherEmojis[weather] || "🌈";
    const percentage = ((count / weatherData.length) * 100).toFixed(1);
    const barLength = Math.round(count * 5);
    const bar = colorize("█".repeat(barLength), "cyan");
    console.log(
      `${emoji}  ${weather.padEnd(15)} ${bar} ${colorize(count + " cities", "yellow")} (${percentage}%)`
    );
  });
  console.log(colorize("=".repeat(80), "gray"));
}

async function main() {
  try {
    displayHeader();
    let weatherData = [];
    console.log(colorize("\n🔄 Fetching weather data from OpenWeatherMap API...\n", "cyan"));
    for (let i = 0; i < cities.length; i++) {
      const progress = ((i + 1) / cities.length * 100).toFixed(0);
      const barLength = Math.round((i + 1) / cities.length * 30);
      const progressBar = "█".repeat(barLength) + "░".repeat(30 - barLength);
      process.stdout.write(
        `\r${colorize("Progress:", "yellow")} [${colorize(progressBar, "green")}] ${progress}% (${i + 1}/${cities.length})`
      );
      const data = await getWeatherData(cities[i]);
      if (data) {
        weatherData.push(data);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    console.log("\n");
    if (weatherData.length === 0) {
      console.log(colorize("⚠️  No weather data could be fetched. Please check your API key and internet connection.", "red"));
      return;
    }
    console.log(colorize("\n💾 Saving data for analysis...", "cyan"));
    // saveToFile(weatherData);
    // appendToCSV(weatherData);
    displayTable(weatherData);
    createTemperatureChart(weatherData);
    createHumidityChart(weatherData);
    createWindSpeedChart(weatherData);
    displayWeatherSummary(weatherData);
    displayStatistics(weatherData);
  } catch (error) {
    console.error(colorize(`\n❌ Fatal Error: ${error.message}`, "red"));
    console.error(colorize("Stack trace:", "gray"));
    console.error(error.stack);
    process.exit(1);
  }
}

main();
