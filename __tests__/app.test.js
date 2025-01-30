const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed.js")
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(()=> {
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
    .get('/api/topics')
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
    return request (app)
    .get("/api/articles/9001")
    .expect(404)
    .then((response) => {
      expect(response.body.error).toBe("Not found")
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
