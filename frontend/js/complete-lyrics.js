const apiUrl = "/api/fetchRandomSongLyrics";

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
let correctLines = "";

// Maximum word count for the line user needs to guess
let maxWordCount = 9;

document
  .getElementById("easy-button")
  .addEventListener("click", () => setDifficulty(5));
document
  .getElementById("medium-button")
  .addEventListener("click", () => setDifficulty(9));
document
  .getElementById("hard-button")
  .addEventListener("click", () => setDifficulty(15));

function setDifficulty(difficulty) {
  maxWordCount = difficulty;
  fetchRandomSongFromBackend(); // Fetch new lyrics with updated difficulty
}

function fetchRandomSongFromBackend() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      songLyrics = data.lyrics;
      songTitle = data.title;
      songArtist = data.artist;
      displayOneLineLyrics();
      showRestartButton();
      startTimer();
    })
    .catch((error) =>
      console.error("Error fetching song from backend:", error)
    );
}

function displayOneLineLyrics() {
  const lines = songLyrics.split("\n").filter((line) => line.trim() !== "");
  function getRandomLines() {
    let selectedLines;
    let startIndex;

    function containsSounds(line) {
      const soundsToExclude = ["oh", "uh"];
      const words = line.toLowerCase().split(/\s+/);
      for (let sound of soundsToExclude) {
        if (words.includes(sound)) {
          return true;
        }
      }
      return false;
    }

    do {
      startIndex = Math.floor(Math.random() * (lines.length - 2));
      selectedLines = lines.slice(startIndex, startIndex + 3);
    } while (
      countWords(selectedLines[1]) > maxWordCount ||
      containsSounds(selectedLines[1])
    );

    correctLines = selectedLines[1];
    selectedLines[1] = selectedLines[1].replace(/[a-zA-Z]/g, "_");
    selectedLine = selectedLines.join("\n");

    return selectedLines;
  }

  const result = getRandomLines();
  lyricsDisplay.innerHTML = result.join("<br>");
  let currentPosition = 0;
  let middleLine = result[1];

  function updateMiddleLine(char) {
    if (currentPosition < middleLine.length) {
      while (
        middleLine[currentPosition] !== "_" &&
        currentPosition < middleLine.length
      ) {
        currentPosition++;
      }

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

  function handleDelete() {
    if (currentPosition > 0) {
      let prevChar = middleLine[currentPosition - 1];
      if (/^[a-zA-Z]$/.test(prevChar)) {
        middleLine =
          middleLine.substring(0, currentPosition - 1) +
          "_" +
          middleLine.substring(currentPosition);
        result[1] = middleLine;
        lyricsDisplay.innerHTML = result.join("<br>");
        currentPosition--;
      } else if (/^[.,!?]$/.test(prevChar)) {
        currentPosition--;
        handleDelete();
      } else if (prevChar === " ") {
        currentPosition--;
        handleDelete();
      } else {
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

  document.addEventListener("keydown", (event) => {
    if (/^[a-zA-Z]$/.test(event.key)) {
      updateMiddleLine(event.key);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      handleDelete();
    } else if (event.key === "Enter") {
      checkLyrics();
    }
  });

  return result;
}

function countWords(line) {
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
  stopTimer();

  const userInput = selectedLine.toLowerCase().trim();
  const correctAnswer = correctLines.toLowerCase().trim();

  const correctLetters = [];
  let score = 0;

  for (let i = 0; i < userInput.length && i < correctAnswer.length; i++) {
    if (userInput[i] === correctAnswer[i]) {
      correctLetters.push(i);
      score++;
    }
  }

  showRestartButton();
  displaySongInfo(songTitle, songArtist, correctAnswer, userInput);
  scoreDisplay.textContent = `Score: ${score}/${correctAnswer.length}`;
}

function displaySongInfo(title, artist, correctAnswer, userInput) {
  const songInfoModal = document.getElementById("song-info-modal");
  const songTitleElement = document.getElementById("song-title");
  const songArtistElement = document.getElementById("song-artist");
  const correctAnswerElement = document.getElementById("correct-answer");

  songTitleElement.textContent = `Song: ${title}`;
  songArtistElement.textContent = `Artist: ${artist}`;

  if (userInput === correctAnswer) {
    const correctAnswerText = `Correct! It was: ${correctAnswer}`;
    correctAnswerElement.textContent = correctAnswerText;
    correctAnswerElement.style.color = "green";
  } else {
    const correctAnswerText = `But it was: ${correctAnswer}`;
    const userAnswerText = `You put: ${userInput}`;
    correctAnswerElement.textContent = `${userAnswerText}\n${correctAnswerText}`;
    correctAnswerElement.style.color = "red";
  }

  songInfoModal.classList.add("show");
}

function showRestartButton() {
  restartButton.style.display = "block";
}
