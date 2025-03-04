
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

console.log(process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses JSON request bodies

// Chatbot route
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    // Send request to OpenAI GPT-4
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are a fun and engaging AI assistant!" }, { role: "user", content: message }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error("OpenAI API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Oops! Something went wrong. 😞" });
  }
});

// Start server
app.listen(PORT, () => console.log(`🤖 Server running on http://localhost:${PORT}`));
