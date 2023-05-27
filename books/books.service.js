const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(bodyParser.json());

// Création de la base de données et de la table books
let db = new sqlite3.Database("./books.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the books database.");

  db.run(
    `CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    authorId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Books table created.");

      // Insertion de quelques livres pour tester
      const books = [
        { title: "The Great Gatsby", authorId: 1, categoryId: 1 },
        { title: "The Grapes of Wrath", authorId: 2, categoryId: 2 },
        { title: "The Catcher in the Rye", authorId: 3, categoryId: 3 },
        { title: "To Kill a Mockingbird", authorId: 4, categoryId: 4 },
        { title: "The Color Purple", authorId: 5, categoryId: 5 },
        { title: "Beloved", authorId: 6, categoryId: 6 },
        { title: "The Lord of the Rings", authorId: 7, categoryId: 7 },
      ];

      const stmt = db.prepare(
        "INSERT INTO books(title, authorId, categoryId) VALUES(?, ?, ?)"
      );
      for (const book of books) {
        stmt.run(book.title, book.authorId, book.categoryId, function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`Book added with ID: ${this.lastID}`);
          }
        });
      }
      stmt.finalize();
    }
  );
});

app.get("/books", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM books LIMIT ? OFFSET ?",
    [limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    }
  );
});

app.get("/books/:id", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 1;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM books WHERE id = ? LIMIT ? OFFSET ?",
    [req.params.id, limit, offset],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else if (!row) {
        res.status(404).send("Book not found");
      } else {
        res.json(row);
      }
    }
  );
});

app.post("/books", (req, res) => {
  const { title, authorId, categoryId } = req.body;
  db.run(
    "INSERT INTO books(title, authorId, categoryId) VALUES(?, ?, ?)",
    [title, authorId, categoryId],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({ id: this.lastID, title, authorId, categoryId });
      }
    }
  );
});

app.put("/books/:id", (req, res) => {
  const { title, authorId, categoryId } = req.body;
  db.run(
    "UPDATE books SET title = ?, authorId = ?, categoryId = ? WHERE id = ?",
    [title, authorId, categoryId, req.params.id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("Book not found");
      } else {
        res.json({ id: req.params.id, title, authorId, categoryId });
      }
    }
  );
});

app.delete("/books/:id", (req, res) => {
  db.run("DELETE FROM books WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).send(err);
    } else if (this.changes === 0) {
      res.status(404).send("Book not found");
    } else {
      res.json({ message: "Book deleted" });
    }
  });
});

// Récupérer tous les livres d'un auteur spécifique
app.get("/books/author/:authorId", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM books WHERE authorId = ? LIMIT ? OFFSET ?",
    [req.params.authorId, limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else if (rows.length === 0) {
        res.status(404).send("No books found for this author");
      } else {
        res.json(rows);
      }
    }
  );
});

// Récupérer tous les livres d'une catégorie spécifique
app.get("/books/category/:categoryId", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM books WHERE categoryId = ? LIMIT ? OFFSET ?",
    [req.params.categoryId, limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else if (rows.length === 0) {
        res.status(404).send("No books found in this category");
      } else {
        res.json(rows);
      }
    }
  );
});

app.get("/books", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const search = req.query.search || '';
  
    db.all("SELECT * FROM books WHERE title LIKE ? LIMIT ? OFFSET ?", [`%${search}%`, limit, offset], (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Books service listening on port ${PORT}`);
});

module.exports = app;
