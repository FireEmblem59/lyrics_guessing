const author = "Taylor Swift";
const checkLyricsButton = document.getElementById("check-lyrics-button");
const lyricsDisplay = document.getElementById("lyrics-display");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

let songLyrics = "";
let userGuess = "";
let selectedLine = "";
let intervalId;
let startTime;
let songTitle = "";
let songArtist = "";
let spotifyToken = "";

// Maximum word count for the line user needs to guess
let maxWordCount = 9;

const client_id = "";
const client_secret = "";

const authOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(client_id + ":" + client_secret),
  },
  body: "grant_type=client_credentials",
};

fetch("https://accounts.spotify.com/api/token", authOptions)
  .then((response) => response.json())
  .then((data) => {
    spotifyToken = data.access_token;
    fetchRandomSongFromSpotify(); // Fetch lyrics once token is obtained
  })
  .catch((error) => console.error("Error:", error));

// Event listeners for difficulty buttons
document
  .getElementById("easy-button")
  .addEventListener("click", () => setDifficulty(5));
document
  .getElementById("medium-button")
  .addEventListener("click", () => setDifficulty(9));
document
  .getElementById("hard-button")
  .addEventListener("click", () => setDifficulty(15));

// Function to set the difficulty and update maxWordCount
function setDifficulty(difficulty) {
  maxWordCount = difficulty;
  fetchRandomSongFromSpotify(); // Fetch new lyrics with updated difficulty
}

function updateCSSClasses(difficulty) {
  const lyricsDisplay = document.getElementById("lyrics-display");
  const timerDisplay = document.getElementById("timer");

  // Remove all difficulty-related classes first
  lyricsDisplay.classList.remove("easy", "medium", "hard");
  timerDisplay.classList.remove("easy", "medium", "hard");

  // Add the appropriate class based on difficulty
  if (difficulty === 5) {
    lyricsDisplay.classList.add("easy");
    timerDisplay.classList.add("easy");
  } else if (difficulty === 9) {
    lyricsDisplay.classList.add("medium");
    timerDisplay.classList.add("medium");
  } else if (difficulty === 15) {
    lyricsDisplay.classList.add("hard");
    timerDisplay.classList.add("hard");
  }
}

checkLyricsButton.addEventListener("click", checkLyrics);
restartButton.addEventListener("click", restart);

let result;
let correctLines;

function fetchRandomSongFromSpotify() {
  fetch(
    `https://api.spotify.com/v1/search?q=artist:${author}&type=track&limit=50`,
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const tracks = data.tracks.items;
      const randomIndex = Math.floor(Math.random() * tracks.length);
      const song = tracks[randomIndex];
      songTitle = song.name;
      songArtist = song.artists[0].name;
      fetchLyrics(songArtist, songTitle);
    })
    .catch((error) =>
      console.error("Error fetching song from Spotify:", error)
    );
}

function fetchLyrics(artist, title) {
  fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(
      artist
    )}/${encodeURIComponent(title)}`
  )
    .then((response) => response.json())
    .then((data) => {
      songLyrics = data.lyrics;
      result = displayOneLineLyrics();
      showRestartButton();
      startTimer();
    })
    .catch((error) => console.error("Error fetching lyrics:", error));
}

function displayOneLineLyrics() {
  // Split the text into lines
  const lines = songLyrics.split("\n").filter((line) => line.trim() !== "");

  // Function to get random lines and transform the middle one
  function getRandomLines() {
    let selectedLines;
    let startIndex;

    // Function to check if a line contains sounds to exclude
    function containsSounds(line) {
      const soundsToExclude = ["oh", "uh"]; // Add more if needed
      const words = line.toLowerCase().split(/\s+/);
      for (let sound of soundsToExclude) {
        if (words.includes(sound)) {
          return true;
        }
      }
      return false;
    }

    // Keep trying until we find a suitable line
    do {
      startIndex = Math.floor(Math.random() * (lines.length - 2));
      selectedLines = lines.slice(startIndex, startIndex + 3);
    } while (
      countWords(selectedLines[1]) > maxWordCount ||
      containsSounds(selectedLines[1])
    );

    console.log(selectedLines[1]);
    correctLines = selectedLines[1];

    // Transform the middle line
    selectedLines[1] = selectedLines[1].replace(/[a-zA-Z]/g, "_");

    selectedLine = selectedLines.join("\n");

    return selectedLines;
  }

  // Get the transformed lines
  const result = getRandomLines();

  // Display the result
  const lyricsDisplay = document.getElementById("lyrics-display");
  lyricsDisplay.innerHTML = result.join("<br>");

  // Track the current position in the middle line
  let currentPosition = 0;
  let middleLine = result[1];

  // Function to update the middle line with the user's input
  function updateMiddleLine(char) {
    // Check if current position is within bounds
    if (currentPosition < middleLine.length) {
      // Find the next underscore to replace
      while (
        middleLine[currentPosition] !== "_" &&
        currentPosition < middleLine.length
      ) {
        currentPosition++;
      }

      // Replace the underscore with the character if within bounds
      if (currentPosition < middleLine.length) {
        middleLine =
          middleLine.substring(0, currentPosition) +
          char +
          middleLine.substring(currentPosition + 1);
        result[1] = middleLine;
        lyricsDisplay.innerHTML = result.join("<br>");
        currentPosition++;
      }
    }
  }

  // Function to handle delete key press
  function handleDelete() {
    if (currentPosition > 0) {
      // Check if the previous character is a letter, space, or punctuation
      let prevChar = middleLine[currentPosition - 1];
      if (/^[a-zA-Z]$/.test(prevChar)) {
        // Replace with underscore
        middleLine =
          middleLine.substring(0, currentPosition - 1) +
          "_" +
          middleLine.substring(currentPosition);
        result[1] = middleLine;
        lyricsDisplay.innerHTML = result.join("<br>");
        currentPosition--;
      } else if (/^[.,!?]$/.test(prevChar)) {
        // Handle punctuation, skip replacing
        currentPosition--;
        handleDelete();
      } else if (prevChar === " ") {
        // Handle space, skip replacing
        currentPosition--;
        handleDelete();
      } else {
        // Handle multiple spaces or punctuation before a valid character
        let prevPrevChar = middleLine[currentPosition - 2];
        while (/^[.,!?]$/.test(prevPrevChar) || prevPrevChar === " ") {
          currentPosition--;
          if (currentPosition <= 1) break;
          prevPrevChar = middleLine[currentPosition - 2];
        }
        handleDelete();
      }
    }
  }

  // Event listener for key presses
  document.addEventListener("keydown", (event) => {
    // Only process letter keys
    if (/^[a-zA-Z]$/.test(event.key)) {
      updateMiddleLine(event.key);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      handleDelete();
    } else if (event.key === "Enter") {
      // Submit the lyrics
      checkLyrics();
    }
  });

  return result;
}

function countWords(line) {
  // Split by spaces and filter out empty strings (extra spaces)
  return line.split(" ").filter((word) => word !== "").length;
}

function startTimer() {
  startTime = Date.now();
  timerDisplay.textContent = "Time: 0s";

  clearInterval(intervalId);
  intervalId = setInterval(() => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${timeSpent}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
}

function checkLyrics() {
  // Stop the timer
  stopTimer();

  const userInput = result[1].toLowerCase().trim();
  const correctAnswer = correctLines.toLowerCase().trim();

  // Compare user input with the correct answer
  const correctLetters = [];
  let score = 0;

  // Check each character in the user input and correct answer
  for (let i = 0; i < userInput.length && i < correctAnswer.length; i++) {
    if (userInput[i] === correctAnswer[i]) {
      correctLetters.push(i); // Track correct letters' positions
      score++; // Increment score for correct letters
    }
  }

  // Show restart button after checking lyrics
  showRestartButton();

  // Display pop-up with song information and correct answer
  fetchTrackInfo(songTitle, songArtist); // Fetch track info including album image
  displaySongInfo(songTitle, songArtist, correctAnswer, userInput);

  // Calculate and display score
  const scoreDisplay = document.getElementById("score");
  scoreDisplay.textContent = `Score: ${score}/${correctAnswer.length}`;
}

function fetchTrackInfo(title, artist) {
  // Construct the Spotify track search endpoint URL
  const searchEndpoint = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(
    title
  )}%20artist:${encodeURIComponent(artist)}&type=track&limit=1`;

  // Make a GET request to fetch track details
  fetch(searchEndpoint, {
    headers: {
      Authorization: `Bearer ${spotifyToken}`, // Include your Spotify API token here
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Extract album image URL from the fetched data
      const track = data.tracks.items[0];
      if (
        track &&
        track.album &&
        track.album.images &&
        track.album.images.length > 0
      ) {
        const albumImageUrl = track.album.images[0].url;
        displayAlbumImage(albumImageUrl);
      } else {
        console.error("Unable to fetch album image from Spotify API.");
      }
    })
    .catch((error) => {
      console.error("Error fetching track info from Spotify API:", error);
    });
}

function displayAlbumImage(imageUrl) {
  // Display album image in your modal or wherever needed
  const albumImageElement = document.getElementById("album-image");
  albumImageElement.src = imageUrl;
}

function displaySongInfo(title, artist, correctAnswer, userInput) {
  // Mock implementation for demonstration
  const songInfoModal = document.getElementById("song-info-modal");
  const songTitleElement = document.getElementById("song-title");
  const songArtistElement = document.getElementById("song-artist");
  const correctAnswerElement = document.getElementById("correct-answer");

  // Display song title and artist
  songTitleElement.textContent = `Song: ${title}`;
  songArtistElement.textContent = `Artist: ${artist}`;

  if (userInput === correctAnswer) {
    // Display correct answer
    const correctAnswerText = `Correct! It was: ${correctAnswer}`;
    correctAnswerElement.textContent = `Correct Answer: ${correctAnswer}`;
    correctAnswerElement.textContent = correctAnswerText;
    correctAnswerElement.style.color = "green";
  } else {
    // Display correct answer with coloring
    const correctAnswerText = `But it was: ${correctAnswer}`;
    const userAnswerText = `You put: ${userInput}`;
    correctAnswerElement.textContent = `${userAnswerText}\n${correctAnswerText}`;
    correctAnswerElement.style.color = "red";
  }

  // Display the modal
  songInfoModal.classList.add("show");
}

// Function to hide the modal
function closeSongInfoModal() {
  const songInfoModal = document.getElementById("song-info-modal");
  songInfoModal.classList.remove("show");
}

function showRestartButton() {
  restartButton.style.display = "inline-block";
}

function restart() {
  // Reset any necessary variables or state
  clearInterval(intervalId);
  timerDisplay.textContent = "";
  lyricsDisplay.innerHTML = "";
  restartButton.style.display = "none";
  fetchRandomSongFromSpotify(); // Fetch a new set of lyrics
}
