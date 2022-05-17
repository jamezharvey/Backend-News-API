const db = require("../db/connection");
const { checkArticleExists } = require("../utils/utils");

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1;`, [article_id])
    .then((comments) => {
      const exists = checkArticleExists(article_id).then((result) => {
        if (result === true && comments.rows.length === 0) {
          return Promise.reject({ msg: "no content", status: 200 });
        } else if (result === false) {
          return Promise.reject({ msg: "article not found", status: 404 });
        } else {
          return comments.rows;
        }
      });
      return exists;
    });
};

exports.addCommentByArticle = (comment, article_id) => {
  const { username, body } = comment;
  article_id = Number(article_id);

  if (typeof body != "string" || typeof username != "string") {
    return Promise.reject({ status: 400, msg: "Invalid data type" });
  } else {
    return db
      .query(
        `INSERT INTO comments
      (body, author, article_id)
    VALUES
    ($1, $2, $3)
       RETURNING *;`,
        [body, username, article_id]
      )
      .then((comments) => {
        const exists = checkArticleExists(article_id).then((result) => {
          if (result === true && comments.rows[0].length === 0) {
            Promise.reject({ status: 404, msg: "username does not exist" });
          } else if (result === false) {
            return Promise.reject({ msg: "article not found", status: 404 });
          } else {
            return comments.rows[0];
          }
        });
        return exists;
      });
  }
};
