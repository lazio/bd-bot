const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const googleCalendar = require('./services/googleCalendar');
const { instance: telegram } = require('./services/telegram');
const config = require('./config/config');
const { instance: openai } = require('./services/openai');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(helmet());

app.get('/api/birthdays', async (req, res) => {
    try {
        const birthdays = await googleCalendar.getBirthdays();
        res.json(birthdays);
    } catch (error) {
        console.error('Error fetching birthdays:', error);
        res.status(500).json({ error: 'Failed to fetch birthdays' });
    }
});

app.post('/api/send-greeting', async (req, res) => {
    try {
        const { person } = req.body;
        await telegram.sendBirthdayGreeting(person);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send greeting' });
    }
});

// Test endpoint to send greetings to all upcoming birthdays
app.post('/api/test-all-greetings', async (req, res) => {
    try {
        const birthdays = await googleCalendar.getBirthdays(30); // next 30 days
        const results = [];

        for (const birthday of birthdays) {
            try {
                await telegram.sendBirthdayGreeting(birthday);
                results.push({ 
                    name: birthday.summary, 
                    status: 'success',
                    date: birthday.start.date
                });
            } catch (error) {
                results.push({ 
                    name: birthday.summary, 
                    status: 'failed',
                    date: birthday.start.date,
                    error: error.message 
                });
            }
        }

        res.json({ 
            total: birthdays.length,
            results 
        });
    } catch (error) {
        console.error('Error in test greetings:', error);
        res.status(500).json({ error: 'Failed to send test greetings' });
    }
});

// Schedule daily birthday check
const checkBirthdays = async () => {
    try {
        const birthdays = await googleCalendar.getBirthdays();
        for (const birthday of birthdays) {
            if (googleCalendar.isBirthdayToday(birthday)) {
                await telegram.sendBirthdayGreeting(birthday);
            }
        }
    } catch (error) {
        console.error('Error in birthday check:', error);
    }
};

// Run birthday check every day at 11 AM
const job = schedule.scheduleJob('0 11 * * *', () => checkBirthdays());

app.get('/api/template', (req, res) => {
    try {
        const template = telegram.getTemplate();
        res.json({ template });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get template' });
    }
});

app.post('/api/template', (req, res) => {
    try {
        const { template } = req.body;
        telegram.setTemplate(template);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update template' });
    }
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
}); 