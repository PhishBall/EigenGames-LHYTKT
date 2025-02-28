"use strict";
const readline = require('readline');
const app = require("./configs/app.config");
const PORT = process.env.port || process.env.PORT || 4002; // Use port 4002 for Validation Service
const dalService = require("./src/dal.service");
const taskController = require("./src/task.controller");

// Initialize services
dalService.init();

// Create readline interface for CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt the user for the city name for validation
function promptCity() {
  rl.question('Enter the city name to validate (or type "exit" to quit): ', async (city) => {
    if (city.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      // Validate the task for the given city
      const result = await taskController.validateTaskByCity(city);
      console.log("Task validation result:", result);
    } catch (error) {
      console.error("Error validating task:", error);
    } finally {
      // Prompt the user again
      promptCity();
    }
  });
}

// Start the server
app.listen(PORT, () => {
  console.log("Validation Service started on port:", PORT);
  // Start the CLI after the server is running
  promptCity();
});

// Handle CLI close event
rl.on('close', () => {
  console.log('CLI closed. Validation Service is still running.');
});