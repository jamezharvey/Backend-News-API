const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const { checkArticleExists } = require("../utils/utils");

afterAll(() => db.end());
beforeEach(() => seed(testData));

// util testing
describe("checkArticleExists", () => {
  test("returns false when there is no article", () => {
    const article_id = 500;
    const exists = checkArticleExists(article_id).then((result) => {
      expect(result).toBe(false);
    });
  });
  test("returns true when there is an article", () => {
    const article_id = 5;
    const exists = checkArticleExists(article_id).then((result) => {
      expect(result).toBe(true);
    });
  });
});

// topic api endpoint tests
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

// article api endpoint tests

describe("GET /api/articles", () => {
  test("200: responds with requested article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("404: bad request", () => {
    return request(app)
      .get("/api/articlez") // spelled wrong, bad request
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/articles/:id", () => {
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
          comment_count: expect.any(Number),
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns all comments related to article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("204: this article has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toEqual("no content");
      });
  });
  test("404: this article is not found", () => {
    return request(app)
      .get("/api/articles/4000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article and votecount", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({
        inc_votes: 5,
      })
      .expect(200)
      .then((res) => {
        const expected = {
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 5,
        };
        expect(res.body).toEqual(expected);
      });
  });
  test("400: non int id responds with bad request", () => {
    return request(app)
      .patch("/api/articles/badId")
      .send({ inc_votes: 5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with article not found when given wrong article id", () => {
    return request(app)
      .patch("/api/articles/10000")
      .send({
        inc_votes: 5,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("400: body missing completely", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("body missing / wrong key");
      });
  });
  test("400: incorrect key", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({
        votes: 5,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("body missing / wrong key");
      });
  });
  test("400: incorrect data type", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({
        inc_votes: "arnold",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("votes should be a number");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: returns added comment", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        username: "butter_bridge",
        body: "I am a bee, this pleases me",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400: non int id responds with bad request", () => {
    return request(app)
      .post("/api/articles/badId/comments")
      .send({
        username: "butter_bridge",
        body: "I am a bee, this pleases me",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete the comment with matching comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: comment_id invalid", () => {
    return request(app)
      .delete("/api/comments/five")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
  test("404: comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "No comments for specified comment id, check comment id exists"
        );
      });
  });
});

// user api endpoint tests
describe("GET /api/users", () => {
  test("200: returns correct userdata", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users).toBeInstanceOf(Array);
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: bad request", () => {
    return request(app)
      .get("/api/usors") // spelled wrong, bad request
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("404: bad request", () => {
    return request(app)
      .get("/api/usors") // spelled wrong, bad request
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("404: bad request", () => {
    return request(app)
      .get("/api/usors") // spelled wrong, bad request
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
