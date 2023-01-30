const nie = document.querySelector(".nie_zaplacone");
const tak = document.querySelector(".tak_zaplacone");
const canvasNet = document.getElementById("canvasnet");
const showNet = document.querySelector(".showNet");

if (localStorage.getItem("auto")) {
  nie.classList.add("hidden");
  tak.classList.remove("hidden");
} else {
  tak.classList.add("hidden");
  nie.classList.remove("hidden");
}

showNet.addEventListener("click", myShow);

function myShow() {
  canvasNet.classList.toggle("hidden");
  canvasNet.scrollIntoView();
}
