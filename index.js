const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const sendEmail = require ('./services/email')
require('dotenv').config()
const db = require('./models/db')
const Subscriber = require('./models/subscribers')

app.use(cors())
app.use(bodyParser.json())

const addDiscordChannelToDB = async (channel) => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    subscriber.subscribers.discord.push(channel);
    await subscriber.save();
}

const removeDiscordChannelFromDB = async (channel) => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    subscriber.subscribers.discord = subscriber.subscribers.discord.filter( c => c !== channel);
    await subscriber.save();
}

const listDiscordChannelsFromDB = async () => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    return subscriber.subscribers.discord;
}

const addTelegramChannelToDB = async (channel) => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    subscriber.subscribers.telegram.push(channel);
    await subscriber.save();
}

const removeTelegramChannelFromDB = async (channel) => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    subscriber.subscribers.telegram = subscriber.subscribers.telegram.filter( c => c !== channel);
    await subscriber.save();
}

const listTelegramChannelsFromDB = async () => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    return subscriber.subscribers.telegram;
}

const addSlackChannelToDB = async (channel) => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    subscriber.subscribers.slack.push(channel);
    await subscriber.save();
}

const removeSlackChannelFromDB = async (channel) => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    subscriber.subscribers.slack = subscriber.subscribers.slack.filter( c => c !== channel);
    await subscriber.save();
}

const listSlackChannelsFromDB = async () => {
    let subscriber = await Subscriber.findOne();
    if (!subscriber) {  // If there's no document, initialize one
        subscriber = new Subscriber({ subscribers: { discord: [], slack: [], telegram: [], email: [] } });
    }
    return subscriber.subscribers.slack;
}

app.post('/webhook', (req, res) => {
    //Code to store the notification media in Spheron DB and 
})

app.post('/sendNotification', async (req, res) => {
    const { message, config } = req.body;
    if (!config) {
        res.status(400).send('No config provided.');
        return;
    }
    if (!message) {
        res.status(400).send('No message provided.');
        return;
    }
    if (config.discord) await sendDiscordMessage(message);
    if (config.telegram) await sendTelegramMessage(message);
    if (config.slack) await sendSlackMessage(message);
    if (config.email) await sendEmailNotif('Notification Subject', message);
    res.send('Notifications sent.');
});

const sendDiscordMessage = async (message) => {
    console.log(`sending message: ${message}`)
    const discordUrls = await listDiscordChannelsFromDB();
    discordUrls.forEach( async (url) => {
        await axios.post(url, { content: message });
    });
}

//Write a function that sends a message to a Discord Channel via the Discord Webhook API
app.post('/discord/add', (req, res) => {
    const { channel } = req.body;
    addDiscordChannelToDB(channel)
        .then(() => res.send('Channel added.'))
        .catch(error => res.status(500).send(error.message));
});

app.post('/discord/remove', (req, res) => {
    const { channel } = req.body;
    removeDiscordChannelFromDB(channel)
        .then(() => res.send('Channel removed.'))
        .catch(error => res.status(500).send(error.message));
});

app.get('/discord/list', (req, res) => {
    listDiscordChannelsFromDB()
        .then(channels => res.send(channels))
        .catch(error => res.status(500).send(error.message));
});

const sendTelegramMessage = async (message) => {
    const telegramUrl = await `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`
    const channels = await listTelegramChannelsFromDB()
    channels.forEach( chatId => {
    axios.post(telegramUrl, {
        chat_id: chatId,
        text: message
        })
    })
}

app.post('/telegram/add', (req, res) => {
    const { channel } = req.body;
    addTelegramChannelToDB(channel)
        .then(() => res.send('Channel added.'))
        .catch(error => res.status(500).send(error.message));
});

app.post('/telegram/remove', (req, res) => {
    const { channel } = req.body;
    removeTelegramChannelFromDB(channel)
        .then(() => res.send('Channel removed.'))
        .catch(error => res.status(500).send(error.message));
});

app.get('/telegram/list', (req, res) => {
    listTelegramChannelsFromDB()
        .then(channels => res.send(channels))
        .catch(error => res.status(500).send(error.message));
});

const sendSlackMessage = async (message) => {
    const channels = await listSlackChannelsFromDB()
    channels.forEach( async url => {
        await axios.post(url, { text: message });
    })
}

app.post('/slack/add', (req, res) => {
    const { channel } = req.body;
    addSlackChannelToDB(channel)
        .then(() => res.send('Channel added.'))
        .catch(error => res.status(500).send(error.message));
});

app.post('/slack/remove', (req, res) => {
    const { channel } = req.body;
    removeSlackChannelFromDB(channel)
        .then(() => res.send('Channel removed.'))
        .catch(error => res.status(500).send(error.message));
});

app.get('/slack/list', (req, res) => {
    listSlackChannelsFromDB()
        .then(channels => res.send(channels))
        .catch(error => res.status(500).send(error.message));
});

const sendEmailNotif = async (subject, message, emails) => {
    emails.forEach( async email => {
        await sendEmail(subject, message, email)
    })
}

app.listen(3000, () => {
    console.log('listening on port 3000!')
})