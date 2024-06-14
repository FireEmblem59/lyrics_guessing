document.addEventListener("DOMContentLoaded", () => {
  const profilePic = document.getElementById("profile-pic");
  const dropdownMenu = document.getElementById("dropdown-menu");

  profilePic.addEventListener("click", (event) => {
    dropdownMenu.classList.toggle("show");
    event.stopPropagation(); // Prevents the click from propagating to the document
  });

  document.addEventListener("click", (event) => {
    if (
      !dropdownMenu.contains(event.target) &&
      !profilePic.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
    }
  });
});
