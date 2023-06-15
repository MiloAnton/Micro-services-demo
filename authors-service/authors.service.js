const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(bodyParser.json());

// Création de la base de données et de la table authors
let db = new sqlite3.Database("./authors.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the authors database.");

  db.run(
    `CREATE TABLE IF NOT EXISTS authors(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Authors table created.");

      // Insertion de quelques auteurs pour tester
      const authors = [
        { name: "F. Scott Fitzgerald" },
        { name: "John Steinbeck" },
        { name: "J. D. Salinger" },
        { name: "Jane Austen" },
        { name: "Mark Twain" },
      ];

      const stmt = db.prepare("INSERT INTO authors(name) VALUES(?)");
      for (const author of authors) {
        stmt.run(author.name, function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`Author added with ID: ${this.lastID}`);
          }
        });
      }
      stmt.finalize();
    }
  );
});

app.get("/", (req, res) => {
  res.json({ message: "This is the authors service. Service is running." });
});

app.get("/authors", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM authors LIMIT ? OFFSET ?",
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

app.get("/authors/:id", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 1;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM authors WHERE id = ? LIMIT ? OFFSET ?",
    [req.params.id, limit, offset],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else if (!row) {
        res.status(404).send("Author not found");
      } else {
        res.json(row);
      }
    }
  );
});

app.post("/authors", (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO authors(name) VALUES(?)", [name], function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: this.lastID, name });
    }
  });
});

app.put("/authors/:id", (req, res) => {
  const { name } = req.body;
  db.run(
    "UPDATE authors SET name = ? WHERE id = ?",
    [name, req.params.id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("Author not found");
      } else {
        res.json({ id: req.params.id, name });
      }
    }
  );
});

app.delete("/authors/:id", (req, res) => {
  db.run("DELETE FROM authors WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).send(err);
    } else if (this.changes === 0) {
      res.status(404).send("Author not found");
    } else {
      res.json({ message: "Author deleted" });
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Authors service listening on port ${PORT}`);
});

module.exports = app;
