## Installation 🚀

1. **Clone the repository**
2. **Install dependencies**
3. **Set up service account**
   - Place your Google service account JSON file in the server directory
   - Name it appropriately (e.g., service-account.json)
   - Never commit this file to version control
3. **Configure environment variables** 

## Usage

### Web Interface
- View upcoming birthdays at `http://localhost:3000`
- Send greetings manually via "Send AI Greeting" button
- Each greeting is uniquely generated

### Automated Greetings
- Bot checks for birthdays daily at 9 AM (server timezone)
- Generates 5 greeting options
- Sends via configured Telegram chat
- Uses node-schedule for reliable cron execution

## Security
- All sensitive files stored in `server/secure/`
- Environment variables for configuration
- Rate limiting: 100 requests/15min
- CORS & Helmet protection enabled

## Troubleshooting

### Common Issues
1. **No Birthdays Showing**
   - Check calendar sharing with service account
   - Verify calendar ID in `.env`
   - Check calendar format (all-day events)

2. **Greeting Not Sent**
   - Verify Telegram bot in chat
   - Check chat ID
   - Ensure bot has send permissions

3. **AI Generation Failed**
   - Verify OpenAI API key
   - Check API quota
   - Review system prompt in `.env`

## License
MIT © Sergey Diniovskiy