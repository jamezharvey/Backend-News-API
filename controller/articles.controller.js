const {
  selectArticleId,
  updateArticleById,
  selectAllArticles,
  selectCommentsByArticle,
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleId(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};
