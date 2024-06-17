const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const client_id = process.env.CLIENT_ID_SPOTIFY;
  const client_secret = process.env.SECRET_CLIENT_ID_SPOTIFY;
  const author = "Taylor Swift"; // Example author

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
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    const tokenData = await tokenResponse.json();
    const spotifyToken = tokenData.access_token;

    const searchEndpoint = `https://api.spotify.com/v1/search?q=artist:${author}&type=track&limit=50`;
    const songResponse = await fetch(searchEndpoint, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    const songData = await songResponse.json();
    const tracks = songData.tracks.items;

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const song = tracks[randomIndex];

    const lyricsEndpoint = `https://api.lyrics.ovh/v1/${encodeURIComponent(
      song.artists[0].name
    )}/${encodeURIComponent(song.name)}`;
    const lyricsResponse = await fetch(lyricsEndpoint);
    const lyricsData = await lyricsResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: song.name,
        artist: song.artists[0].name,
        lyrics: lyricsData.lyrics,
      }),
    };
  } catch (error) {
    console.error("Error fetching song lyrics:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching song lyrics" }),
    };
  }
};
