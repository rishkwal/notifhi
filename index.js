const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const sendEmail = require ('./services/email')
const sendWhatsApp = require('./services/whatsApp')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

app.post('/sendNotification', (req, res) => {
    const { message, config } = req.body;
    if (config.discord) sendDiscordMessage(message);
    if (config.telegram) sendTelegramMessage(message);
    if (config.slack) sendSlackMessage(message);
    if (config.email) sendEmailNotif('Notification Subject', message);
    if (config.whatsapp) sendWhatsAppMessage(message, 'recipientPhoneNumber');
    res.send('Notifications sent.');
});

//Write a function that sends a message to a Discord Channel via the Discord Webhook API
const sendDiscordMessage = (message) => {
    axios.post(`${process.env.DISCORD_CHANNEL_WEBHOOK_URL}`, {
        content: message
    })
}

const sendTelegramMessage = (message) => {
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    axios.post(telegramUrl, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message
    })
}


const sendSlackMessage = (message) => {
    axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: message
    })
}

const sendEmailNotif = (subject, message) => {
    sendEmail(subject, message)
}

const sendWhatsAppMessage = (message, phoneNumber) => {
    sendWhatsApp(message, phoneNumber)
}

app.listen(3000, () => {
    console.log('listening on port 3000!')
})