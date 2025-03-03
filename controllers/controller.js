const app = require("../app.js");
const endpoints = require("../endpoints.json");
const devData = require("../db/data/development-data/index.js");
const {
  fetchTopics,
  fetchArticleId,
  fetchArticles,
  fetchComments,
  addComment,
  updateArticle,
  removeComment,
  fetchUsers,
} = require("../models/model");

const getEndpoints = (request, response) => {
  response.status(200).send({ endpoints });
};
const getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
const getArticleId = (request, response, next) => {
  const article_id = request.params.article_id;
  fetchArticleId(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
const getArticles = (request, response, next) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};
const getComments = (request, response, next) => {
  const article_id = request.params.article_id;
  fetchComments(article_id)
    .then((comment) => {
      response.status(200).send({ comment });
    })
    .catch((err) => {
      if (err.status) {
        response.status(404).send({ 404: "Oopsie!" });
      } else {
        next(err);
      }
    });
};
const postComments = (request, response, next) => {
  const id = request.params.article_id;
  const username = request.body.username;
  const body = request.body.body;
  addComment(username, body, id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticles = (request, response, next) => {
  const id = request.params.article_id;
  const newVote = request.body.inc_votes;
  updateArticle(newVote, id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteComments = (request, response, next) => {
  const id = request.params.comment_id;
  removeComment(id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

module.exports = {
  getEndpoints,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  postComments,
  patchArticles,
  deleteComments,
  getUsers,
};
