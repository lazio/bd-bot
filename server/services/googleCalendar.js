const { google } = require('googleapis');
const config = require('../config/config');

class GoogleCalendarService {
    constructor() {
        try {
            // Load the service account credentials
            const credentials = require(config.google.serviceAccountPath);
            
            // Log the service account email
            console.log('Service Account Email:', credentials.client_email);
            
            // Create JWT client
            const auth = new google.auth.JWT(
                credentials.client_email,
                null,
                credentials.private_key,
                ['https://www.googleapis.com/auth/calendar.readonly']
            );

            // Initialize the calendar API
            this.calendar = google.calendar({ version: 'v3', auth });
        } catch (error) {
            console.error('Error initializing Google Calendar service:', error);
            throw error;
        }
    }

    async getBirthdays(daysAhead = 30) {
        try {
            const now = new Date();
            const future = new Date();
            future.setDate(now.getDate() + daysAhead);

            const response = await this.calendar.events.list({
                calendarId: config.google.calendarId,
                timeMin: now.toISOString(),
                timeMax: future.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
                maxResults: 2500
            });

            return response.data.items || [];
        } catch (error) {
            console.error('Error fetching birthdays:', error);
            throw error;
        }
    }

    isBirthdayToday(birthday) {
        const today = new Date();
        const birthdayDate = new Date(birthday.start.date);
        
        return today.getDate() === birthdayDate.getDate() && 
               today.getMonth() === birthdayDate.getMonth();
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
}

module.exports = new GoogleCalendarService(); 