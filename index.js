const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/search_web", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter." });
  }

  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: query,
        api_key: process.env.SERP_API_KEY,
        engine: "google",
        num: 5,
        hl: "it"
      }
    });

    const results = (response.data.organic_results || []).map(r => ({
      title: r.title,
      snippet: r.snippet,
      link: r.link
    }));

    res.json({ query, results });
  } catch (err) {
    res.status(500).json({ error: "Search failed." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API ready on ${port}`));
