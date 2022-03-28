const express = require("express");
const { getTopics } = require("./controller/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
