import express from "express";
import * as paypal from "./public/js/paypal.js";
import path from "path";
const __dirname = path.resolve();

const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/sfera", (req, res) => {
  res.render("sfera");
});

app.get(`/sfera/:orderId`, (req, res) => {
  res.render("sferadruk");
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
