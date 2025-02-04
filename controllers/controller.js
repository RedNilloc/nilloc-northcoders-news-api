const app = require("../app.js");
const endpoints = require("../endpoints.json")
const devData = require("../db/data/development-data/index.js");
const {
    fetchTopics, fetchArticleId, fetchArticles, fetchComments
} = require("../models/model")


const getEndpoints = (request, response) => {
    response.status(200).send({ endpoints });  

};
const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {    
        response.status(200).send ({ topics });
    });
};
const getArticleId = (request, response, next) => {
    const article_id = request.params.article_id;
fetchArticleId(article_id)
.then((article) => {
        response.status(200).send ({ article });
    })
    .catch((err) => {
        next(err);
    });
};
const getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send ({articles});
    });
}
const getComments = (request, response, next) => {
    const article_id = request.params.article_id;
     fetchComments(article_id) 
     .then((comment) => {
        response.status(200).send ({ comment });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { getEndpoints, getTopics, getArticleId, getArticles, getComments }