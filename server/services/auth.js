const { google } = require('googleapis');
const config = require('../config/config');

class AuthService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );
    }

    generateAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar.readonly']
        });
    }

    async getToken(code) {
        const { tokens } = await this.oauth2Client.getToken(code);
        return tokens;
    }
}

module.exports = new AuthService(); 