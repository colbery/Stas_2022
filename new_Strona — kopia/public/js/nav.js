const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleWhiteIcon = document.getElementById("theme-toggle-white-icon");
const heartW = document.getElementById("heartW");
const heartD = document.getElementById("heartD");
const smileW = document.getElementById("smileW");
const smileD = document.getElementById("smileD");
const likeW = document.getElementById("likeW");
const likeD = document.getElementById("likeD");

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const logo = document.getElementById("logo");

//tabs nasluchiwanie
tabs.forEach((tab) => tab.addEventListener("click", onTabClick));
panels.forEach((panel) => panel.addEventListener("click", closeNav));

//ham button listener
btn.addEventListener("click", navToggle);

function onTabClick(e) {
  //wylacz bordery
  tabs.forEach((tab) => {
    tab.children[0].classList.remove(
      "border-softRed",
      "border-b-4",
      "md:border-b-0"
    );
  });

  //schowaj wszystyko
  panels.forEach((panel) => {
    panel.classList.add("hidden");
  });

  //aktywujemy tab i panel ktory klikniecieee
  e.target.classList.add("border-softRed", "border-b-4");
  const classString = e.target.getAttribute("data-target");
  document
    .getElementById("panels")
    .getElementsByClassName(classString)[0]
    .classList.remove("hidden");
}

function navToggle() {
  btn.classList.toggle("open");
  menu.classList.toggle("flex");
  menu.classList.toggle("hidden");

  if (menu.classList.contains("flex")) {
    logo.setAttribute("src", "./images/logo-bookmark-footer.svg");
  } else {
    logo.setAttribute("src", "./images/logo-bookmark.svg");
  }
}

function closeNav() {
  setTimeout(() => {
    btn.classList.toggle("open");
    menu.classList.toggle("flex");
    menu.classList.toggle("hidden");
  }, 500);
}

if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleDarkIcon.classList.remove("hidden");
  heartD.classList.remove("hidden");
  smileD.classList.remove("hidden");
  likeD.classList.remove("hidden");
} else {
  themeToggleWhiteIcon.classList.remove("hidden");
  heartW.classList.remove("hidden");
  smileW.classList.remove("hidden");
  likeW.classList.remove("hidden");
}

//sluchaj klikniecia zmiany dark => white , white => dark

themeToggleBtn.addEventListener("click", toggleMode);

function toggleMode() {
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleWhiteIcon.classList.toggle("hidden");
  heartW.classList.toggle("hidden");
  smileW.classList.toggle("hidden");
  likeW.classList.toggle("hidden");
  heartD.classList.toggle("hidden");
  smileD.classList.toggle("hidden");
  likeD.classList.toggle("hidden");

  //jesli dark w local storage

  if (localStorage.getItem("color-theme")) {
    //jesli white to zmiana na dark i wrzuć do localstorage
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  } else {
    //jesli nie ma w localstorage
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
}
