const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You're a smart and efficient chatbot. Reply based on what the user is asking:

- If the user asks for a summary, give a clear and concise summary.
- If the user asks for a list (e.g., top places, steps, tools), reply in bullet points, one point per line.
- If the user asks a direct question, give a direct, no-fluff answer.
- Do not restate the question.
- Do not add unnecessary explanations or extra wording.
- Keep your answers human, clean, and to the point.

User: ${message}
Bot:
                `.trim(),
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
    res.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to connect to Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
