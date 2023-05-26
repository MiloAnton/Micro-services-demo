const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(bodyParser.json());

// Création de la base de données et de la table categories
let db = new sqlite3.Database("./categories.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the categories database.");

  db.run(
    `CREATE TABLE IF NOT EXISTS categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Categories table created.");

      // Insertion de quelques catégories pour tester
      const categories = [
        { name: "Fiction" },
        { name: "Non-fiction" },
        { name: "Biography" },
        { name: "Poetry" },
        { name: "Drama" },
        { name: "Action" },
        { name: "Adventure" },
      ];

      const stmt = db.prepare("INSERT INTO categories(name) VALUES(?)");
      for (const category of categories) {
        stmt.run(category.name, function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`Category added with ID: ${this.lastID}`);
          }
        });
      }
      stmt.finalize();
    }
  );
});

app.get("/categories", (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

app.get("/categories/:id", (req, res) => {
  db.get(
    "SELECT * FROM categories WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else if (!row) {
        res.status(404).send("Category not found");
      } else {
        res.json(row);
      }
    }
  );
});

app.post("/categories", (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO categories(name) VALUES(?)", [name], function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ id: this.lastID, name });
    }
  });
});

app.put("/categories/:id", (req, res) => {
  const { name } = req.body;
  db.run(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, req.params.id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("Category not found");
      } else {
        res.json({ id: req.params.id, name });
      }
    }
  );
});

app.delete("/categories/:id", (req, res) => {
  db.run(
    "DELETE FROM categories WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("Category not found");
      } else {
        res.json({ message: "Category deleted" });
      }
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Categories service listening on port ${PORT}`);
});

module.exports = app;