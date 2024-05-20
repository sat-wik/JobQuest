const gmail = require('./gmailService');
const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,  // Add this to your .env file if you have an organization
  project: process.env.OPENAI_PROJECT_ID  // Add this to your .env file if needed
});

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle exponential backoff
const exponentialBackoff = async (fn, retries = 5, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1 || !isRetryableError(error)) {
        throw error;
      }
      const backoffTime = delayMs * Math.pow(2, i);
      console.log(`Retrying after ${backoffTime}ms...`);
      await delay(backoffTime);
    }
  }
};

const isRetryableError = (error) => {
  return error.code === 'insufficient_quota';
};

const getEmails = async () => {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'subject:("job application" OR "application status" OR "regarding your application" OR "application update")',
      maxResults: 5  // Limit the number of emails retrieved to 5
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
  const prompt = `
    Analyze the following email content and determine the job application status:
    Email: "${emailContent}"
    The status can be one of the following: Interviewing, Offered, Rejected, Unknown.
    Examples of relevant email phrases:
    - "As a next step, I have sent you an invitation to complete a coding exercise"
    - "We are not moving forward with your application"
    - "The team has decided to move forward with applicants they feel are a closer fit"
    Based on this analysis, provide the status.
  `;

  const makeRequest = async () => {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 50,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  };

  try {
    const status = await exponentialBackoff(makeRequest);
    console.log(`Parsed status: ${status}`);
    return status;
  } catch (error) {
    console.error('Error parsing email content:', error);
    throw error;
  }
};

const processEmails = async () => {
  try {
    const emails = await getEmails();
    const emailContents = [];
    for (const email of emails) {
      const emailContent = await getEmailContent(email.id);
      emailContents.push(emailContent);
    }

    for (const content of emailContents) {
      await delay(1000);  // Delay between each request to avoid hitting the rate limit
      const status = await parseStatusFromEmail(content);
      console.log(`Parsed status for email: ${status}`);
    }
  } catch (error) {
    console.error('Error processing emails:', error);
  }
};

module.exports = { getEmails, getEmailContent, parseStatusFromEmail, processEmails };
