const request = require("supertest");
const expect = require("chai").expect;
const app = require("./authors.service.js"); // Assurez-vous que le chemin est correct

describe("Authors API", () => {
  it("GET /authors should return all authors", (done) => {
    request(app)
      .get("/authors")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("GET /authors/:id should return a single author", (done) => {
    request(app)
      .get("/authors/1")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("object");
        done();
      });
  });

  it("POST /authors should create a new author", (done) => {
    const newAuthor = { name: "New Author" };
    request(app)
      .post("/authors")
      .send(newAuthor)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.equal(newAuthor.name);
        done();
      });
  });

  it("PUT /authors/:id should update an existing author", (done) => {
    const updatedAuthor = { name: "Updated Author" };
    request(app)
      .put("/authors/1")
      .send(updatedAuthor)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.name).to.equal(updatedAuthor.name);
        done();
      });
  });

  it("DELETE /authors/:id should delete an author", (done) => {
    request(app)
      .delete("/authors/1")
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Author deleted");
        done();
      });
  });
});
