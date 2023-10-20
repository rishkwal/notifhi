const axios = require('axios')

const sendWhatsApp = async (message, phoneNumber) => {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_SENDER_PHONE_NO}/messages`;
    try {
        await axios.post(url, {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'template',
            template: {
                name: 'your_template_name',
                language: {
                    code: 'en_US'
                }
            }
        }, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_API_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

exports.default = sendWhatsApp