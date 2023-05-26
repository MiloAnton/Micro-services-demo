const request = require("supertest");
const expect = require("chai").expect;
const app = require("./books.service.js");

describe("Books service", () => {
  describe("GET /books", () => {
    it("should return an array of books", async () => {
      const res = await request(app).get("/books");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });

  describe("GET /books/:id", () => {
    it("should return a single book", async () => {
      const res = await request(app).get("/books/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
    });

    it("should return 404 for non-existent book", async () => {
      const res = await request(app).get("/books/9999");
      expect(res.status).to.equal(404);
    });
  });

  describe("POST /books", () => {
    it("should create a new book and return it", async () => {
      const newBook = {
        title: "New Book",
        authorId: 1,
        categoryId: 1,
      };
      const res = await request(app).post("/books").send(newBook);
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an("object");
      expect(res.body.title).to.equal(newBook.title);
    });
  });

  describe("PUT /books/:id", () => {
    it("should update a book and return it", async () => {
      const updatedBook = {
        title: "Updated Book",
        authorId: 1,
        categoryId: 1,
      };
      const res = await request(app).put("/books/1").send(updatedBook);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.title).to.equal(updatedBook.title);
    });

    it("should return 404 for non-existent book", async () => {
      const updatedBook = {
        title: "Updated Book",
        authorId: 1,
        categoryId: 1,
      };
      const res = await request(app).put("/books/9999").send(updatedBook);
      expect(res.status).to.equal(404);
    });
  });

  describe("DELETE /books/:id", () => {
    it("should delete a book and return a success message", async () => {
      const res = await request(app).delete("/books/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("object");
      expect(res.body.message).to.equal("Book deleted");
    });

    it("should return 404 for non-existent book", async () => {
      const res = await request(app).delete("/books/9999");
      expect(res.status).to.equal(404);
    });
  });

  describe("GET /books/author/:authorId", () => {
    it("should return an array of books for a specific author", async () => {
      const res = await request(app).get("/books/author/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 404 for non-existent author", async () => {
      const res = await request(app).get("/books/author/9999");
      expect(res.status).to.equal(404);
    });
  });

  describe("GET /books/category/:categoryId", () => {
    it("should return an array of books for a specific category", async () => {
      const res = await request(app).get("/books/category/1");
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should return 404 for non-existent category", async () => {
      const res = await request(app).get("/books/category/9999");
      expect(res.status).to.equal(404);
    });
  });
});
