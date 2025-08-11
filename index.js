const express = require('express');
const OpenAI = require('openai');
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());

const API_KEY = process.env.API_KEY;
const client = new OpenAI({
  apiKey: API_KEY
});

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Test route
app.get("/", async (req, res) => {
  res.status(200).json("Routes are working fine");
});

// POST route for movie search
app.post("/api/search/v1", async (req, res) => {
  try {
    const { searchText } = req.body;
    if (!searchText || searchText.trim() === "") {
      return res.status(400).json({ error: "searchText is required" });
    }

    const gptQuery =
      `Act as a Movie Recommendation system and suggest some movies for the query "${searchText}". ` +
      `Respond ONLY with a valid JSON array of strings. Example: ["Gadar", "Sholay", "Dangal", "MahaAvtar", "AdiPurush"]. ` +
      `Do not include any explanation or extra text.`;

    const results = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: gptQuery }],
    });

    const content = results.choices[0].message.content;

  let moviesArray;
try {
  moviesArray = JSON.parse(content); // Convert string → array
} catch (err) {
  console.error("Invalid JSON from GPT:", content);
  return res.status(500).json({ error: "Invalid GPT response format" });
}

res.status(200).json({ movies: moviesArray });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log("App is connected on the PORT: " + PORT);
});
