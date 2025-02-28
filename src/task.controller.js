"use strict";
const { Router } = require("express");
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const validatorService = require("./validator.service");

const router = Router();

// Reusable function to validate a task by city name
async function validateTaskByCity(city) {
  console.log("Validating task for city:", city);

  try {
    const isValid = await validatorService.validateByCity(city);
    return {
      isValid,
      city,
    };
  } catch (error) {
    console.error("Error validating task:", error);
    throw error;
  }
}

// HTTP endpoint for task validation by city
router.post("/validate-by-city", async (req, res) => {
  try {
    const city = req.body.city; // City name for validation

    const result = await validateTaskByCity(city);

    return res.status(200).send(
      new CustomResponse(
        result,
        "Task validation completed"
      )
    );
  } catch (error) {
    console.error("Error validating task:", error);
    return res.status(500).send(new CustomError("Something went wrong", {}));
  }
});

module.exports = {
  router,
  validateTaskByCity, // Export the reusable function
};