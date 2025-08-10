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
      `Just give me names of 5 movies in the form of an array. ` +
      `Example Result: Gadar, Sholay, Dangal, MahaAvtar, AdiPurush. ` +
      `Strictly Need Result in Example Format.`;

    const results = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: gptQuery }],
    });

    const content = results.choices[0].message.content;
    if (!content) {
      return res.status(404).json({ error: "No results found" });
    }

    res.status(200).json({ movies: content });

  } catch (error) {
    console.error("Error in /api/search/v1:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("App is connected on the PORT: " + PORT);
});
