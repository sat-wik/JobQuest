const gmail = require('./gmailService');
const { spawn } = require('child_process');
require('dotenv').config();

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getEmails = async () => {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:("job application" OR "application status" OR "regarding your application" OR "application update")',
      //maxResults: 5  // Limit the number of emails retrieved to 5
    });
    console.log('Gmail API response:', res);  // Log the full response
    if (res.data && res.data.messages) {
      console.log(`Fetched emails: ${res.data.messages.length}`);
      return res.data.messages;
    } else {
      console.error('No messages found in the response');
      return [];
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

const getEmailContent = async (messageId) => {
  try {
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    });
    const message = res.data;

    // Check the sender's email address
    const headers = message.payload.headers;
    const fromHeader = headers.find(header => header.name === 'From');
    if (fromHeader && fromHeader.value.includes(process.env.MY_EMAIL_ADDRESS)) {
      console.log(`Skipping email from self: ${fromHeader.value}`);
      return null;
    }

    let emailBody = '';
    if (message.payload.parts) {
      for (const part of message.payload.parts) {
        if (part.mimeType === 'text/plain') {
          emailBody += Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }
    } else {
      emailBody = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    }
    console.log(`Fetched content for email ID: ${messageId}`);
    return emailBody;
  } catch (error) {
    console.error(`Error fetching email content for ID: ${messageId}`, error);
    throw error;
  }
};

const parseStatusFromEmail = async (emailContent) => {
  return new Promise((resolve, reject) => {
    const process = spawn('python3', ['parse_email.py', emailContent]);

    process.stdout.on('data', (data) => {
      console.log(`Parsed status: ${data}`);
      resolve(data.toString().trim());
    });

    process.stderr.on('data', (data) => {
      console.error(`Error parsing email content: ${data}`);
      reject(data.toString());
    });
  });
};

const processEmails = async () => {
  try {
    const emails = await getEmails();
    const emailContents = [];
    for (const email of emails) {
      const emailContent = await getEmailContent(email.id);
      if (emailContent) {
        emailContents.push(emailContent);
      }
    }

    for (const content of emailContents) {
      await delay(1000);  // Delay between each request to avoid hitting the rate limit
      const status = await parseStatusFromEmail(content);
      console.log(`Email Content: ${content}`);
      console.log(`Parsed Status: ${status}`);
    }
  } catch (error) {
    console.error('Error processing emails:', error);
  }
};

module.exports = { getEmails, getEmailContent, parseStatusFromEmail, processEmails };
