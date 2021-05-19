const { Client, logger } = require('camunda-external-task-client-js')
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.TELEGRAM_TOKEN
const my_chat_id = process.env.MY_CHAT_ID
const bot = new TelegramBot(token, { polling: true })

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = {
  baseUrl: 'http://localhost:8080/engine-rest',
  use: logger,
  asyncResponseTimeout: 10000,
}

const client = new Client(config)

const opts = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Please start heating!',
          callback_data: 'heat',
        },
        {
          text: `No, I'm good.`,
          callback_data: 'no_heat',
        },
      ],
    ],
  },
}

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data
  const msg = callbackQuery.message
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  }
  let text

  if (action === 'heat') {
    text = 'Started heating'
  } else if (action === 'no_heat') {
    text = 'Okay then...'
  }

  bot.editMessageText(text, opts)
})

client.subscribe('send-reminder', async function ({ task, taskService }) {
  // Put your business logic here

  // Get a process variable
  const temperature = task.variables.get('temperature')

  const reminderMessage = `Sending reminder that ${temperature} is too hot`

  console.log(reminderMessage)
  bot.sendMessage(my_chat_id, reminderMessage, opts)

  // Complete the task
  await taskService.complete(task)
})
