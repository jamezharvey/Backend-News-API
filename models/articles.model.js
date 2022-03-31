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

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(`SELECT votes FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "article not found", status: 404 });
      } else if (!inc_votes) {
        return Promise.reject({ msg: "body missing / wrong key", status: 400 });
      } else if (typeof inc_votes !== "number") {
        return Promise.reject({ msg: "votes should be a number", status: 400 });
      } else {
        const newVotes = result.rows[0].votes + inc_votes;
        return db
          .query(
            `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`,
            [newVotes, article_id]
          )
          .then((result) => {
            return result.rows[0];
          });
      }
    });
};
