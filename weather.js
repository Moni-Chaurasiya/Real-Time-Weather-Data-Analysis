/*
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
*/
// weather-analysis.js
// Enhanced Weather Data Analysis for Big Data Mini Project
// This program fetches weather data from OpenWeatherMap API, stores it, and provides detailed visualizations

// 1. Import required modules
const axios = require("axios"); // For making HTTP requests to the API
const fs = require("fs"); // File system module for reading/writing files
const path = require("path"); // For handling file paths

// 2. Configuration
const API_KEY = "902d9070a4608f74b4d239a70b4cbaef" // Your OpenWeatherMap API key
const DATA_FILE = "weather_data.json"; // File to store historical weather data
const HISTORY_FILE = "weather_history.csv"; // CSV file for data analysis

// 3. List of Indian cities to analyze
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

// 4. Color codes for terminal (ANSI escape codes)
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

// Helper function to colorize text
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// 5. Function to create a simple header
function displayHeader() {
  // Clear the console for a clean display
  console.clear();
  
  // Create a simple text header
  console.log(colorize("=" .repeat(80), "yellow"));
  console.log(colorize("                    WEATHER DATA ANALYSIS SYSTEM", "cyan"));
  console.log(colorize("           Big Data Analysis Mini Project - Real-time Weather Data", "green"));
  console.log(colorize("=" .repeat(80), "yellow"));
  console.log();
}

// 6. Function to fetch weather data for a single city
async function getWeatherData(city) {
  // Construct the API URL (encodeURIComponent handles special characters in city names)
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  
  try {
    // Make API request
    console.log(colorize(`📡 Fetching data for ${city}...`, "gray"));
    const response = await axios.get(URL);
    const data = response.data;
    
    // Extract and return relevant weather information
    return {
      city: data.name, // City name
      country: data.sys.country, // Country code
      temperature: data.main.temp, // Current temperature in Celsius
      feels_like: data.main.feels_like, // Feels like temperature
      temp_min: data.main.temp_min, // Minimum temperature
      temp_max: data.main.temp_max, // Maximum temperature
      humidity: data.main.humidity, // Humidity percentage
      pressure: data.main.pressure, // Atmospheric pressure in hPa
      wind_speed: data.wind.speed, // Wind speed in m/s
      wind_direction: data.wind.deg, // Wind direction in degrees
      visibility: data.visibility / 1000, // Visibility in kilometers
      clouds: data.clouds.all, // Cloudiness percentage
      weather: data.weather[0].main, // Main weather condition
      description: data.weather[0].description, // Weather description
      timestamp: new Date().toISOString(), // Current timestamp for data tracking
      unix_time: data.dt, // Unix timestamp from API
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(), // Sunrise time
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString() // Sunset time
    };
  } catch (error) {
    // Handle errors gracefully
    console.error(colorize(`❌ Error fetching data for ${city}: ${error.message}`, "red"));
    return null;
  }
}

// 7. Function to save data to JSON file (for big data analysis)
function saveToFile(data) {
  try {
    // Create a data object with timestamp
    const dataToSave = {
      timestamp: new Date().toISOString(),
      data: data
    };
    
    // Write data to JSON file
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2));
    console.log(colorize(`✅ Data saved to ${DATA_FILE}`, "green"));
  } catch (error) {
    console.error(colorize(`❌ Error saving data: ${error.message}`, "red"));
  }
}

// 8. Function to append data to CSV for historical analysis
function appendToCSV(weatherData) {
  try {
    // Check if CSV file exists, if not create with headers
    if (!fs.existsSync(HISTORY_FILE)) {
      // Create CSV headers
      const headers = "Timestamp,City,Temperature,Humidity,Pressure,Wind Speed,Weather,Description\n";
      fs.writeFileSync(HISTORY_FILE, headers);
    }
    
    // Append each city's data as a new row
    weatherData.forEach(data => {
      const row = `${data.timestamp},${data.city},${data.temperature},${data.humidity},${data.pressure},${data.wind_speed},${data.weather},"${data.description}"\n`;
      fs.appendFileSync(HISTORY_FILE, row);
    });
    
    console.log(colorize(`✅ Data appended to ${HISTORY_FILE}`, "green"));
  } catch (error) {
    console.error(colorize(`❌ Error appending to CSV: ${error.message}`, "red"));
  }
}

// 9. Function to display data in a formatted table
function displayTable(weatherData) {
  console.log("\n" + colorize("📊 CURRENT WEATHER DATA", "yellow"));
  console.log(colorize("=" .repeat(120), "gray"));
  
  // Print table header
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
  console.log(colorize("-" .repeat(120), "gray"));
  
  // Print each row of data
  weatherData.forEach(data => {
    // Color code temperature
    let tempColor;
    if (data.temperature > 35) tempColor = "red"; // Hot
    else if (data.temperature > 25) tempColor = "yellow"; // Warm
    else if (data.temperature > 15) tempColor = "green"; // Pleasant
    else tempColor = "blue"; // Cool
    
    // Color code humidity
    let humidityColor = data.humidity > 70 ? "blue" : "green";
    
    // Format and print the row
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
  
  console.log(colorize("=" .repeat(120), "gray"));
}

// 10. Function to create a horizontal bar chart for temperatures
function createTemperatureChart(weatherData) {
  console.log("\n" + colorize("🌡️  TEMPERATURE CHART", "yellow"));
  console.log(colorize("=" .repeat(80), "gray"));
  
  // Sort cities by temperature for better visualization
  const sortedData = [...weatherData].sort((a, b) => b.temperature - a.temperature);
  
  // Find max temperature for scaling
  const maxTemp = Math.max(...sortedData.map(d => d.temperature));
  
  // Create bar chart
  sortedData.forEach(data => {
    // Calculate bar length (scale to 50 characters max)
    const barLength = Math.round((data.temperature / maxTemp) * 50);
    
    // Choose color based on temperature
    let barColor;
    if (data.temperature > 35) barColor = "red"; // Hot
    else if (data.temperature > 25) barColor = "yellow"; // Warm
    else if (data.temperature > 15) barColor = "green"; // Pleasant
    else barColor = "blue"; // Cool
    
    // Create the bar using block characters
    const bar = colorize("█".repeat(barLength), barColor);
    
    // Format city name to fixed width
    const cityName = data.city.padEnd(15);
    
    // Display the bar
    console.log(
      colorize(cityName, "cyan") + " " + 
      bar + " " + 
      colorize(data.temperature.toFixed(1) + "°C", "white")
    );
  });
  
  console.log(colorize("=" .repeat(80), "gray"));
}

// 11. Function to create humidity visualization
function createHumidityChart(weatherData) {
  console.log("\n" + colorize("💧 HUMIDITY LEVELS", "yellow"));
  console.log(colorize("=" .repeat(80), "gray"));
  
  // Sort by humidity
  const sortedData = [...weatherData].sort((a, b) => b.humidity - a.humidity);
  
  sortedData.forEach(data => {
    // Calculate bar length for humidity (scale to 40 characters for 100%)
    const barLength = Math.round((data.humidity / 100) * 40);
    
    // Choose color based on humidity level
    let barColor;
    if (data.humidity > 80) barColor = "blue"; // Very humid
    else if (data.humidity > 60) barColor = "cyan"; // Humid
    else if (data.humidity > 40) barColor = "green"; // Comfortable
    else barColor = "yellow"; // Dry
    
    // Create the bar
    const bar = colorize("▓".repeat(barLength), barColor);
    
    // Format city name
    const cityName = data.city.padEnd(15);
    
    // Display the bar
    console.log(
      colorize(cityName, "cyan") + " " + 
      bar + " " + 
      colorize(data.humidity + "%", "white")
    );
  });
  
  console.log(colorize("=" .repeat(80), "gray"));
}

// 12. Function to create wind speed visualization
function createWindSpeedChart(weatherData) {
  console.log("\n" + colorize("💨 WIND SPEED CHART", "yellow"));
  console.log(colorize("=" .repeat(80), "gray"));
  
  // Sort by wind speed
  const sortedData = [...weatherData].sort((a, b) => b.wind_speed - a.wind_speed);
  
  // Find max wind speed for scaling
  const maxWind = Math.max(...sortedData.map(d => d.wind_speed));
  
  sortedData.forEach(data => {
    // Calculate bar length (scale to 40 characters max)
    const barLength = Math.round((data.wind_speed / maxWind) * 40);
    
    // Choose color based on wind speed
    let barColor;
    if (data.wind_speed > 10) barColor = "red"; // Strong wind
    else if (data.wind_speed > 5) barColor = "yellow"; // Moderate wind
    else barColor = "green"; // Light wind
    
    // Create the bar
    const bar = colorize("▬".repeat(barLength), barColor);
    
    // Format city name
    const cityName = data.city.padEnd(15);
    
    // Display the bar
    console.log(
      colorize(cityName, "cyan") + " " + 
      bar + " " + 
      colorize(data.wind_speed.toFixed(1) + " m/s", "white")
    );
  });
  
  console.log(colorize("=" .repeat(80), "gray"));
}

// 13. Function to display weather statistics
function displayStatistics(weatherData) {
  console.log("\n" + colorize("📈 STATISTICAL ANALYSIS", "yellow"));
  console.log(colorize("=" .repeat(80), "gray"));
  
  // Calculate statistics
  const temperatures = weatherData.map(d => d.temperature);
  const humidities = weatherData.map(d => d.humidity);
  const pressures = weatherData.map(d => d.pressure);
  const windSpeeds = weatherData.map(d => d.wind_speed);
  
  // Temperature statistics
  const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
  const maxTemp = Math.max(...temperatures);
  const minTemp = Math.min(...temperatures);
  const tempRange = maxTemp - minTemp;
  
  // Calculate standard deviation for temperature
  const tempVariance = temperatures.reduce((sum, temp) => sum + Math.pow(temp - avgTemp, 2), 0) / temperatures.length;
  const tempStdDev = Math.sqrt(tempVariance);
  
  // Humidity statistics
  const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
  const maxHumidity = Math.max(...humidities);
  const minHumidity = Math.min(...humidities);
  
  // Pressure statistics
  const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
  const maxPressure = Math.max(...pressures);
  const minPressure = Math.min(...pressures);
  
  // Wind statistics
  const avgWindSpeed = windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length;
  const maxWindSpeed = Math.max(...windSpeeds);
  
  // Find extreme cities
  const hottestCity = weatherData.find(d => d.temperature === maxTemp);
  const coldestCity = weatherData.find(d => d.temperature === minTemp);
  const mostHumidCity = weatherData.find(d => d.humidity === maxHumidity);
  const driestCity = weatherData.find(d => d.humidity === minHumidity);
  const windiestCity = weatherData.find(d => d.wind_speed === maxWindSpeed);
  
  // Display statistics in a formatted way
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
  
  console.log(colorize("=" .repeat(80), "gray"));
}

// 14. Function to display weather conditions summary
function displayWeatherSummary(weatherData) {
  console.log("\n" + colorize("☁️  WEATHER CONDITIONS SUMMARY", "yellow"));
  console.log(colorize("=" .repeat(80), "gray"));
  
  // Count weather conditions
  const weatherCounts = {};
  weatherData.forEach(data => {
    weatherCounts[data.weather] = (weatherCounts[data.weather] || 0) + 1;
  });
  
  // Display weather conditions with emoji
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
  
  console.log(colorize("=" .repeat(80), "gray"));
}

// 15. Function to display a simple ASCII visualization of all data
function displayASCIIVisualization(weatherData) {
  console.log("\n" + colorize("🗺️  CITY WEATHER MAP (Temperature Overview)", "yellow"));
  console.log(colorize("=" .repeat(80), "gray"));
  
  // Sort by temperature
  const sortedData = [...weatherData].sort((a, b) => b.temperature - a.temperature);
  
  sortedData.forEach((data, index) => {
    // Create temperature indicator
    let tempIndicator = "";
    const tempValue = Math.round(data.temperature);
    
    // Create a simple scale from 0-40°C
    for (let i = 0; i <= 40; i += 5) {
      if (i === tempValue || (i < tempValue && i + 5 > tempValue)) {
        tempIndicator += "🔥";
      } else if (i < tempValue) {
        tempIndicator += "▓";
      } else {
        tempIndicator += "░";
      }
    }
    
    // Display the visualization
    console.log(
      `${(index + 1).toString().padStart(2)}. ${data.city.padEnd(12)} |${tempIndicator}| ${colorize(tempValue + "°C", "yellow")} ${data.weather}`
    );
  });
  
  console.log("\n" + colorize("Scale: [░░░░░░░░░] 0°C to 40°C", "gray"));
  console.log(colorize("=" .repeat(80), "gray"));
}

// 16. Main function to orchestrate the entire program
async function main() {
  try {
    // Display header
    displayHeader();
    
    // Initialize array to store all weather data
    let weatherData = [];
    
    // Show loading message
    console.log(colorize("\n🔄 Fetching weather data from OpenWeatherMap API...\n", "cyan"));
    
    // Fetch weather data for each city
    for (let i = 0; i < cities.length; i++) {
      // Show progress bar
      const progress = ((i + 1) / cities.length * 100).toFixed(0);
      const barLength = Math.round((i + 1) / cities.length * 30);
      const progressBar = "█".repeat(barLength) + "░".repeat(30 - barLength);
      
      process.stdout.write(
        `\r${colorize("Progress:", "yellow")} [${colorize(progressBar, "green")}] ${progress}% (${i + 1}/${cities.length})`
      );
      
      // Fetch data for current city
      const data = await getWeatherData(cities[i]);
      
      // Add to array if data was successfully fetched
      if (data) {
        weatherData.push(data);
      }
      
      // Small delay to avoid API rate limiting (200ms between requests)
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Clear progress line and add spacing
    console.log("\n");
    
    // Check if we have any data
    if (weatherData.length === 0) {
      console.log(colorize("⚠️  No weather data could be fetched. Please check your API key and internet connection.", "red"));
      return;
    }
    
    // Save data to files for big data analysis
    console.log(colorize("\n💾 Saving data for analysis...", "cyan"));
    saveToFile(weatherData);
    appendToCSV(weatherData);
    
    // Display all visualizations
    displayTable(weatherData); // Show detailed table
    createTemperatureChart(weatherData); // Temperature bar chart
    createHumidityChart(weatherData); // Humidity bar chart
    createWindSpeedChart(weatherData); // Wind speed chart
    displayWeatherSummary(weatherData); // Weather conditions summary
    displayStatistics(weatherData); // Statistical analysis
    displayASCIIVisualization(weatherData); // ASCII temperature map
    
    // Display footer with summary information
    console.log("\n" + colorize("=" .repeat(80), "gray"));
    console.log(colorize("✨ ANALYSIS COMPLETE!", "green"));
    console.log(colorize("-" .repeat(80), "gray"));
    
    // Display quick summary
    console.log(colorize("📊 Quick Summary:", "cyan"));
    console.log(`  • Total Cities Analyzed: ${colorize(weatherData.length.toString(), "yellow")}`);
    console.log(`  • Data Collection Time: ${colorize(new Date().toLocaleString(), "white")}`);
    console.log(`  • Data Files Created: ${colorize(DATA_FILE, "green")} and ${colorize(HISTORY_FILE, "green")}`);
    
    // Provide helpful tips
    console.log(colorize("\n💡 Tips for Big Data Analysis:", "cyan"));
    console.log("  • Run this program hourly to build historical data");
    console.log("  • Use the CSV file for Excel/Python analysis");
    console.log("  • JSON file contains detailed data for processing");
    console.log("  • Check weather_history.csv for trend analysis");
    
    console.log(colorize("=" .repeat(80), "gray"));
    
  } catch (error) {
    // Handle any unexpected errors
    console.error(colorize(`\n❌ Fatal Error: ${error.message}`, "red"));
    console.error(colorize("Stack trace:", "gray"));
    console.error(error.stack);
    process.exit(1);
  }
}

// 17. Run the main function
main();