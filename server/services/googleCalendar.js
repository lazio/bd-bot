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

    async getBirthdays() {
        try {
            const today = new Date();
            const thirtyDaysFromNow = new Date(today);
            thirtyDaysFromNow.setDate(today.getDate() + 30);

            console.log('Fetching events for calendar:', config.google.calendarId);
            console.log('Time range:', {
                from: today.toISOString(),
                to: thirtyDaysFromNow.toISOString()
            });
            
            const response = await this.calendar.events.list({
                calendarId: config.google.calendarId,
                timeMin: today.toISOString(),
                timeMax: thirtyDaysFromNow.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
                maxResults: 2500
            });

            const events = response.data.items || [];
            console.log('Total events found:', events.length);
            
            // Log detailed information about each event
            events.forEach(event => {
                console.log('\nEvent details:', {
                    id: event.id,
                    summary: event.summary,
                    description: event.description,
                    start: event.start,
                    end: event.end,
                    created: event.created,
                    updated: event.updated,
                    status: event.status,
                    creator: event.creator,
                    organizer: event.organizer,
                    attendees: event.attendees,
                    recurrence: event.recurrence,
                    recurringEventId: event.recurringEventId,
                    originalStartTime: event.originalStartTime,
                    transparency: event.transparency,
                    visibility: event.visibility,
                    iCalUID: event.iCalUID,
                    sequence: event.sequence,
                    eventType: event.eventType,
                    reminders: event.reminders
                });
            });

            // Sort events by date
            return events.sort((a, b) => {
                const dateA = new Date(a.start.date || a.start.dateTime);
                const dateB = new Date(b.start.date || b.start.dateTime);
                return dateA - dateB;
            });
        } catch (error) {
            console.error('Error fetching events:', error.response?.data || error);
            throw error;
        }
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