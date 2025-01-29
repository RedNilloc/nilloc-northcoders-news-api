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
        //console.log(response.body)
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
      console.log(response.body.topics)
     });
  });
});


