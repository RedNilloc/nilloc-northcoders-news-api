const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const users = require("../db/data/development-data/users.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should respond with the correct article id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400 id is not a number", () => {
    return request(app)
      .get("/api/articles/poopis")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
  test("404 article not found", () => {
    return request(app)
      .get("/api/articles/9001")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
      });
  });
});
describe("GET api/articles", () => {
  test("GET: 200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.body).toBe("undefined");
        });
      });
  });
});
describe("GET api/articles/:article_id/comments", () => {
  test("GET: 200 sends an array of comments to the client", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual([
          {
            comment_id: 11,
            body: "Ambidextrous marsupial",
            votes: 0,
            author: "icellusedkars",
            article_id: 3,
            created_at: "2020-09-19T23:10:00.000Z",
          },
          {
            comment_id: 10,
            body: "git push origin master",
            votes: 0,
            author: "icellusedkars",
            article_id: 3,
            created_at: "2020-06-20T07:24:00.000Z",
          },
        ]);
      });
  });
  test("400 id is not a number", () => {
    return request(app)
      .get("/api/articles/peepis/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
  test("404 article comments not found", () => {
    return request(app)
      .get("/api/articles/9001/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
      });
  });
  test("200 article with no associated comments returns an empty array of comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toEqual([]);
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 responds with the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "I'm a Big Chungus",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("lurker");
        expect(response.body.comment.body).toBe("I'm a Big Chungus");
      });
  });
  test("400 body does not contain the correct fields", () => {
    const emptyComment = {};

    return request(app)
      .post("/api/articles/1/comments")
      .send(emptyComment)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
  test("400 field value invalid", () => {
    const invalidComment = {
      username: 3,
      body: null,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
});
describe("CORE: PATCH /api/articles/:article_id", () => {
  test("PATCH: 200 responds with the updated aticle", () => {
    const voteUpdate = {
      inc_votes: 20,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(voteUpdate)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 20,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400 incorrect fields", () => {
    const badFields = {};

    return request(app)
      .patch("/api/articles/3")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
  test("400 field value invalid", () => {
    const invalidFields = {
      inc_votes: "I have the power of God and anime on my side",
    };

    return request(app)
      .patch("/api/articles/3")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
});
describe("CORE: DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 confirms deletion of given comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("404 attempting to delete non-existent resource", () => {
    return request(app)
      .delete("/api/comments/525600")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
      });
  });
  test("400 attempting to delete resource by invalid id", () => {
    return request(app)
      .delete("/api/comments/payyourbloodyrentyoubohemianhipsters")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
      });
  });
});
describe("GET /api/users", () => {
  test("GET: 200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
