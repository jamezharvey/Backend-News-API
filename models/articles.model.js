const res = require("express/lib/response");
const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleId = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "article not found", status: 404 });
      } else {
        return result.rows[0];
      }
    });
};

exports.selectCommentsByArticle = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comments.article_id = $1;`, [
      article_id,
    ])
    .then((comments) => {
      const exists = checkExists(article_id).then((result) => {
        if (result === true && comments.rows.length === 0) {
          return Promise.reject({ msg: "no comments found", status: 200 });
        } else if (result === false) {
          return Promise.reject({ msg: "article not found", status: 404 });
        } else {
          return comments.rows;
        }
      });
      return exists;
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
