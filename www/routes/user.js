const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("WOW");
});

module.exports = router;
