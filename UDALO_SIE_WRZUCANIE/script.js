//             https://localforage.github.io/localForage/
//             https://github.com/localForage/localForage
//             https://www.html5rocks.com/en/tutorials/offline/quota-research/#toc-overview
f.onchange = upload;
var img = null;
var keys = [];
var bytes = 0;
var numFiles = 0;

function getKeys() {
  log.textContent = "Getting keys...";
  localforage.keys().then(function (keys) {
    this.keys = [];
    var f = document.getElementById("f");
    var ul = document.getElementById("list");
    if (keys.length === 1) {
      f.setAttribute("disabled", "disabled");
    }
    if (keys.length > 0) {
      clear_btn.disabled = false;
    }

    for (let i = 0; i < keys.length; i++) {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(keys[i]));
      ul.appendChild(li);
      ul.onclick = (e) => play(e.target.innerHTML);
      this.keys.push(keys[i]);
    }

    log.textContent = "Done";
  });
}
getKeys();
//getFile();

function stopAll() {
  console.log("stop all");
  if (this.img) {
    clearImage();
  }
}

function play(filename) {
  stopAll();

  const ext = filename.split(".").pop().toLowerCase();
  console.log(ext);
  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
      showImage(filename);
      break;
    default:
      console.error("not a valid type");
      break;
  }
  window.scrollTo(1, 0);
}

function showImage(filename) {
  log.textContent = "loading: " + filename + "...";
  localforage.getItem(filename).then((blob) => {
    this.img = document.getElementById("img");
    this.img.style.display = "block";
    this.img.src = URL.createObjectURL(blob);

    log.textContent = "showing: " + filename + "...";
  });
}

function clearImage() {
  this.img.src = "";
  this.img.style.display = "none";
}

function upload() {
  const promises = [];
  log.textContent = "Adding to localstorage...";

  for (let i = 0; i < this.files.length; i++) {
    addBytes(this.files[0].size);
    const promise = localforage.setItem(this.files[i].name, f.files[i]);
    promises.push(promise);
  }

  Promise.all(promises).then(() => {
    log.textContent = "Added Successfully.";
    getKeys();
  });
}

function addBytes(bytes) {
  console.log("param bytes: " + bytes);
  console.log("numFiles bytes: " + this.numFiles);
  this.bytes += bytes;
  this.numFiles += 1;
  console.log("numFiles: " + this.numFiles);
  console.log("total bytes: " + this.bytes);
  stats.textContent =
    this.numFiles + " items and " + this.bytes + " total bytes";
}

function clearData() {
  console.log("clear");
  log.textContent = "Clearing data...";
  for (let i = 0; i < this.keys.length; i++) {
    localforage.removeItem(this.keys[i]).then(() => {
      log.textContent = "Done";
      clear_btn.disabled = true;
      f.removeAttribute("disabled");
      var ul = document.getElementById("list");
      while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
      this.bytes = 0;
      document.getElementById("stats").textContent = "";
    });
  }
}
