const app = require("../app.js");
const endpoints = require("../endpoints.json")
const devData = require("../db/data/development-data/index.js");
const {
    fetchTopics,
} = require("../models/model")


const getEndpoints = (request, response) => {
    response.status(200).send({ endpoints });  

}
const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send ({ topics });
    });



}


module.exports = { getEndpoints, getTopics }