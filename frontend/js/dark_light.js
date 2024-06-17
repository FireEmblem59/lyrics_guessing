const body = document.querySelector("body");
const btn = document.querySelector(".btn");
const icon = document.querySelector(".btn__icon");

// Function to store dark mode state in localStorage
function store(value) {
  localStorage.setItem("darkmode", value);
}

// Function to load dark mode state from localStorage
function load() {
  const darkmode = localStorage.getItem("darkmode");

  // Default to light mode if no mode is stored
  if (!darkmode || darkmode === "false") {
    store(false);
    icon.classList.add("fa-sun");
  } else {
    // Switch to dark mode if stored as true
    body.classList.add("darkmode");
    icon.classList.add("fa-moon");
  }
}

// Initial load of dark mode setting
load();

// Toggle dark mode on button click
btn.addEventListener("click", () => {
  body.classList.toggle("darkmode");
  icon.classList.add("animated");

  // Store current dark mode state
  store(body.classList.contains("darkmode"));

  // Update icon based on current mode
  if (body.classList.contains("darkmode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
  setTimeout(() => {
    icon.classList.remove("animated");
  }, 500);
});
