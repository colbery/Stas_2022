const nie = document.querySelector(".nie_zaplacone");
const tak = document.querySelector(".tak_zaplacone");
if (localStorage.getItem("auto")) {
  nie.classList.add("hidden");
  tak.classList.remove("hidden");
} else {
  tak.classList.add("hidden");
  nie.classList.remove("hidden");
}
