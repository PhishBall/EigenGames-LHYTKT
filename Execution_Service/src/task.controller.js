"use strict";
const { Router } = require("express");
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const oracleService = require("./oracle.service");
const dalService = require("./dal.service");

const router = Router();

// Reusable function to execute a task
async function executeTask(city, taskDefinitionId, fakeTemperature, fakeHumidity) {
  console.log("Executing task");

  const weatherData = await oracleService.getWeatherData(city);

  if (fakeTemperature) {
    weatherData.temperature = fakeTemperature;
  }
  if (fakeHumidity) {
    weatherData.humidity = fakeHumidity;
  }

  const cid = await dalService.publishJSONToIpfs(weatherData);
  const data = "weather-data";
  await dalService.sendTask(cid, data, taskDefinitionId);

  return {
    proofOfTask: cid,
    data: data,
    taskDefinitionId: taskDefinitionId,
  };
}

// HTTP endpoint for task execution
router.post("/execute", async (req, res) => {
  try {
    const taskDefinitionId = Number(req.body.taskDefinitionId) || 0;
    const city = req.body.city;
    const fakeTemperature = req.body.fakeTemperature;
    const fakeHumidity = req.body.fakeHumidity;

    const result = await executeTask(city, taskDefinitionId, fakeTemperature, fakeHumidity);

    return res.status(200).send(
      new CustomResponse(
        result,
        "Task executed successfully"
      )
    );
  } catch (error) {
    console.error("Error executing task:", error);
    return res.status(500).send(new CustomError("Something went wrong", {}));
  }
});

module.exports = {
  router,
  executeTask, // Export the reusable function
};