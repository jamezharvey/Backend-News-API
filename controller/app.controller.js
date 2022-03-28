const { selectTopic } = require("../models/app.model");

exports.getTopics = (req, res, next) => {
  selectTopic()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
