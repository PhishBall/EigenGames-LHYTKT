require('dotenv').config();
const axios = require('axios');

async function getWeatherData(city) {
  const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
  const weatherstackApiKey = process.env.WEATHERSTACK_API_KEY;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&units=metric`);
    const weatherData = {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap',
    };

    return weatherData;
  } catch (error) {
    response = await axios.get(`http://api.weatherstack.com/current?access_key=${weatherstackApiKey}&query=${city}`);
    weatherData = {
      temperature: response.data.current.temperature,
      humidity: response.data.current.humidity,
      timestamp: new Date().toISOString(),
      source: 'Weatherstack',
    };

    return weatherData;
  }
}

module.exports = {
  getWeatherData,
};