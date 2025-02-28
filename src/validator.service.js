require('dotenv').config();
const dalService = require('./dal.service');
const oracleService = require('./oracle.service');

// Validate by city name
async function validateByCity(city) {
  try {
    // Fetch the latest weather data for the city
    const liveWeatherData = await oracleService.getWeatherData(city);

    // Fetch the task result from IPFS (assuming the task result is stored with the city name as the key)
    const taskResult = await dalService.getIPfsTaskByCity(city);

    const taskTemperature = taskResult.temperature;
    const taskHumidity = taskResult.humidity;

    const liveTemperature = liveWeatherData.temperature;
    const liveHumidity = liveWeatherData.humidity;

    const temperatureMargin = 2; 
    const humidityMargin = 5; 

    const isTemperatureValid =
      Math.abs(taskTemperature - liveTemperature) <= temperatureMargin;
    const isHumidityValid =
      Math.abs(taskHumidity - liveHumidity) <= humidityMargin;

    return isTemperatureValid && isHumidityValid;
    
  } catch (err) {
    console.error('Validation error:', err?.message);
    return false;
  }
}

module.exports = {
  validate,
  validateByCity,
};