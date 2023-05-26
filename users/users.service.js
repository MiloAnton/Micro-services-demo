const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(bodyParser.json());

// Création de la base de données et de la table users
let db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the users database.");

  db.run(
    `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Users table created.");
      // Insertion de quelques utilisateurs pour tester
      const users = [
        { name: "User 1", email: "user1@example.com" },
        { name: "User 2", email: "user2@example.com" },
        { name: "User 3", email: "user3@example.com" },
      ];

      const stmt = db.prepare("INSERT INTO users(name, email) VALUES(?, ?)");
      for (const user of users) {
        stmt.run(user.name, user.email, function (err) {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`User added with ID: ${this.lastID}`);
          }
        });
      }
      stmt.finalize();
    }
  );
});

app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

app.get("/users/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).send(err);
    } else if (!row) {
      res.status(404).send("User not found");
    } else {
      res.json(row);
    }
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  db.run(
    "INSERT INTO users(name, email) VALUES(?, ?)",
    [name, email],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({ id: this.lastID, name, email });
      }
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name, email, req.params.id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("User not found");
      } else {
        res.json({ id: req.params.id, name, email });
      }
    }
  );
});

app.delete("/users/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).send(err);
    } else if (this.changes === 0) {
      res.status(404).send("User not found");
    } else {
      res.json({ message: "User deleted" });
    }
  });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Users service listening on port ${PORT}`);
});
