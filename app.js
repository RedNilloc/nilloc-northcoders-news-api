const express = require("express");
const app = express();
const { getEndpoints, getTopics, getArticleId } 
     = require("./controllers/controller")

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId)



app.use((error, request, response, next) => {
     if (error.code === "22P02"){
          response.status(400).send({error: "Bad Request"})
     } else {
          next(error);
     }
});
app.use((error, request, response, next) => {
     if (error.message === "I'm sorry, Dave, I'm afraid I can't find that article") {
     response.status(404).send({ error: "Not found"});
     } else {
          next(error);
     }
});

app.use((error, request, response, next) => {
     console.log(error, "Welp, you messed up somehow, good luck figuring it out!");
     res.status(500).send({ error: "Internal Server Error" });

});
module.exports = app;
