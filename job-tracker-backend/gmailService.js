const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN_PATH = path.join(__dirname, 'token.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Load or refresh tokens
const getToken = () => {
  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oauth2Client.setCredentials(JSON.parse(token));
  } catch (error) {
    console.error('Error loading token:', error);
  }
};

getToken();

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

module.exports = gmail;
