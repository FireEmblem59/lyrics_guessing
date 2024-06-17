const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetchRandomSongLyrics = require("./complete-lyrics");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/random-song", async (req, res) => {
  try {
    const songData = await fetchRandomSongLyrics(
      process.env.CLIENT_ID_SPOTIFY,
      process.env.SECRET_CLIENT_ID_SPOTIFY
    );
    res.json(songData);
  } catch (error) {
    console.error("Error fetching song from backend:", error);
    res.status(500).send("Error fetching song");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
