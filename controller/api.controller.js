const { fetchAPI } = require("../models/api.model");

exports.getAPI = (req, res, next) => {
  fetchAPI()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      next(err);
    });
};
