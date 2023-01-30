const express = require("express");
const paypal = require("./public/js/paypal.js");
const path = require("path");

const app = express();
let wow = "";
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/sfera", (req, res) => {
  res.render("sfera");
});

app.get(`/sfera/:orderId`, (req, res) => {
  if ((req.params.orderId.length = 17)) {
    res.render("sferadruk");
  } else {
    res.render("sfera");
  }
});

app.post("/api/orders", async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
});

app.post("/api/orders/:orderId/capture", async (req, res) => {
  const { orderId } = req.params;
  const captureData = await paypal.capturePayment(orderId);
  res.json(captureData);
});

app.listen(3000);
