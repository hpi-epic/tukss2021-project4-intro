const { Client, logger } = require('camunda-external-task-client-js');
const open = require('open');

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'charge-card'
client.subscribe('calculate_amount', async function ({ task, taskService }) {

    const wine_need = task.variables.get('wine_need');
    task.variables.set('wine_amount', wine_need);

    console.log(`Will por ${wine_amount} glasses of wine`);

    // Complete the task
    await taskService.complete(task);
});