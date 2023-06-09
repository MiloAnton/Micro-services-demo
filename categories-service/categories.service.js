const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(bodyParser.json());

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

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Received event:", event);
  res.send({ status: 'OK' });
});

app.get("/", (req, res) => {
  res.json({ message: "This is the categories service. Service is running." });
});

app.get("/categories", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM categories LIMIT ? OFFSET ?",
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

app.get("/categories/:id", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 1;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM categories WHERE id = ? LIMIT ? OFFSET ?",
    [req.params.id, limit, offset],
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
