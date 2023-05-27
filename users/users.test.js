const supertest = require("supertest");
const chai = require("chai");
const app = require("./users.service.js");
const expect = chai.expect;

describe("Users API", () => {
  describe("GET /users", () => {
    it("should get all users", (done) => {
      supertest(app)
        .get("/users")
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an("array");
          done(err);
        });
    });
  });

  describe("GET /users/:id", () => {
    it("should get a single user", (done) => {
      supertest(app)
        .get("/users/1")
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an("object");
          done(err);
        });
    });
  });

  describe("POST /users", () => {
    it("should create a new user", (done) => {
      const newUser = { name: "User 4", email: "user4@example.com" };
      supertest(app)
        .post("/users")
        .send(newUser)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.include(newUser);
          done(err);
        });
    });
  });

  describe("PUT /users/:id", () => {
    it("should update an existing user", (done) => {
      const updatedUser = {
        name: "User 4 updated",
        email: "user4updated@example.com",
      };
      supertest(app)
        .put("/users/1")
        .send(updatedUser)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.include(updatedUser);
          done(err);
        });
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete an existing user", (done) => {
      supertest(app)
        .delete("/users/1")
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property("message", "User deleted");
          done(err);
        });
    });
  });
});
