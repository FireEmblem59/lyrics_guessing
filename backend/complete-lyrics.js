const fetch = require("node-fetch");

const author = "Taylor Swift"; // Example author for testing

// Function to fetch random song lyrics from Spotify
async function fetchRandomSongLyrics(client_id, client_secret) {
  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  };

  try {
    // Fetch Spotify token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    const tokenData = await tokenResponse.json();
    const spotifyToken = tokenData.access_token;

    // Fetch random song details
    const searchEndpoint = `https://api.spotify.com/v1/search?q=artist:${author}&type=track&limit=50`;
    const songResponse = await fetch(searchEndpoint, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    const songData = await songResponse.json();
    const tracks = songData.tracks.items;

    // Select a random track
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const song = tracks[randomIndex];

    // Fetch lyrics for the selected track
    const lyricsEndpoint = `https://api.lyrics.ovh/v1/${encodeURIComponent(
      song.artists[0].name
    )}/${encodeURIComponent(song.name)}`;
    const lyricsResponse = await fetch(lyricsEndpoint);
    const lyricsData = await lyricsResponse.json();

    return {
      title: song.name,
      artist: song.artists[0].name,
      lyrics: lyricsData.lyrics,
    };
  } catch (error) {
    console.error("Error fetching song lyrics:", error);
    throw error;
  }
}

module.exports = fetchRandomSongLyrics;
