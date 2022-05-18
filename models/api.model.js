const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchAPI = () => {
  return fs.readFile("endpoints.json", "utf8").then((data) => {
    return JSON.parse(data);
  });
};
