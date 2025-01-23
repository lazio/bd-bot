const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config');
const { instance: openai } = require('./openai');

class TelegramService {
    constructor() {
        if (!config.telegram.botToken || !config.telegram.chatId) {
            throw new Error('Telegram configuration is incomplete');
        }
        this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    }

    async sendBirthdayGreeting(person) {
        try {
            if (!person || !person.summary) {
                throw new Error('Invalid person data');
            }

            const greeting = await openai.generateGreeting(person);
            if (!greeting) {
                throw new Error('Failed to generate greeting');
            }

            await this.bot.sendMessage(config.telegram.chatId, greeting);
        } catch (error) {
            console.error('Error sending telegram message:', error);
            throw error;
        }
    }
}

module.exports = {
    TelegramService,
    instance: new TelegramService()
}; 