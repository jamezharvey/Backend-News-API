const db = require("../db/connection");

exports.selectArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "article not found", status: 404 });
      } else {
        return result.rows[0];
      }
    });
};