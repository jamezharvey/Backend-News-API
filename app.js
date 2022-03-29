const express = require("express");
const { getTopics } = require("./controller/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

/* app.use((err, req, res, next) => {
  const badReqCodes = ["42703", "22P02"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});
*/
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
