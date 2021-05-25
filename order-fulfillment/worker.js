const { Client, logger } = require('camunda-external-task-client-js');
const open = require('open');

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'order-fulfillment'
client.subscribe('order-fulfillment', async function({ task, taskService }) {
  // Put your business logic here

  // Get a process variable
  const amount = task.variables.get('amount');
  const EU = task.variables.get('EU');

  console.log(`Shipping the order with an amount of ${amount}€`);

  open('https://docs.camunda.org/get-started/quick-start/success');

  // Complete the task
  await taskService.complete(task);
});