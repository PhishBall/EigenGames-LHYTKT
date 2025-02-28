"use strict";
const readline = require('readline');
const app = require("./configs/app.config");
const PORT = process.env.port || process.env.PORT || 4003;
const dalService = require("./src/dal.service");
const taskController = require("./src/task.controller");

dalService.init();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function promptCity() {
  rl.question('Enter the city name (or type "exit" to quit): ', async (city) => {
    if (city.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const taskDefinitionId = 1;
      const result = await taskController.executeTask(city, taskDefinitionId);
      console.log("Task executed successfully:", result);
    } catch (error) {
      console.error("Error executing task:", error);
    } finally {
      promptCity();
    }
  });
}

app.listen(PORT, () => {
  console.log("Server started on port:", PORT);
  promptCity();
});

rl.on('close', () => {
  console.log('CLI closed. Server is still running.');
});