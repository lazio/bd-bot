require('dotenv').config();
const path = require('path');

module.exports = {
    google: {
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        serviceAccountPath: process.env.GOOGLE_SERVICE_ACCOUNT_PATH
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID,
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18',
        systemPrompt: process.env.OPENAI_SYSTEM_PROMPT,
        userPrompt: process.env.OPENAI_USER_PROMPT || 'Make 5 birthday greetings with different wishes for ${name}',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
    },
    port: process.env.PORT || 3001
}; 