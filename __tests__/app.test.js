const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const testData = require("../db/data/test-data/index.js");

/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        console.log(response.body)
        expect(response.body.endpoints).toEqual(endpointsJson);
      });
  });
});
