const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: responds with all topics", () => {
    const expected = [
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
      {
        description: "what books are made of",
        slug: "paper",
      },
    ];
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics).toEqual(expected);
      });
  });
  test("404: bad request", () => {
    return request(app)
      .get("/api/topicos") // spelled wrong, bad request
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/article/:id", () => {
  test("200: responds with requested article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("400: non int id responds with bad request", () => {
    return request(app)
      .get("/api/articles/badId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with bad request", () => {
    return request(app)
      .get("/api/articles/10000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});
