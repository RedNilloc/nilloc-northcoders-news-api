const express = require("express");
const app = express();
const {
  getEndpoints,
  getTopics,
  getArticleId,
  getArticles,
  getComments,
  postComments,
  patchArticles,
  deleteComments,
  getUsers,
} = require("./controllers/controller");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchArticles);

app.delete("/api/comments/:comment_id", deleteComments);

app.get("/api/users", getUsers);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ error: "Bad Request" });
  } else {
    next(error);
  }
});
app.use((error, request, response, next) => {
  if (error.message === "I'm sorry, Dave, I'm afraid I can't find that") {
    response.status(404).send({ error: "Not found" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error, "Welp, you messed up somehow, good luck figuring it out!");
  res.status(500).send({ error: "Internal Server Error" });
});
module.exports = app;
