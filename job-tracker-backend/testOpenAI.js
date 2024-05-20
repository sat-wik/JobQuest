const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const testOpenAI = async () => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Say hello world",
      max_tokens: 5,
      temperature: 0.7,
    });
    console.log(response.data.choices[0].text.trim());
  } catch (error) {
    console.error('Error with OpenAI:', error);
  }
};

testOpenAI();
