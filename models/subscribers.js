const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    subscribers: {
        discord: [String],
        slack: [String],
        telegram: [String],
        email: [String]
    }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
