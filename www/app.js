const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");

app.use(bodyParser.urlencoded());
app.use(userRoutes);

app.use((req, res, next) => {
  res.status(404).send("<h1>Stronę nie znaleziono błąd 404</h1>");
});

app.listen(3000);
