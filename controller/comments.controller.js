const {
  selectCommentsByArticle,
  addCommentByArticle,
  removeArticleComments,
} = require("../models/comments.model");
const { checkCommentExists } = require("../utils/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
  let { article_id } = req.params;

  addCommentByArticle(req.body, article_id)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleCommentById = (req, res, next) => {
  let { comment_id } = req.params;

  checkCommentExists(comment_id)
    .then(() => {
      return removeArticleComments(comment_id);
    })
    .then((comments) => {
      res.status(204).send(comments);
    })

    .catch((err) => {
      next(err);
    });
};
