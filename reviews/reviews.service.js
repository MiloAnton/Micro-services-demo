const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(bodyParser.json());

let db = new sqlite3.Database("./reviews.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the reviews database.");

  db.run(
    `CREATE TABLE IF NOT EXISTS reviews(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Reviews table created.");

      const reviews = [
        {
          bookId: 1,
          userId: 1,
          rating: 5,
          comment: "Excellent book, highly recommended!",
        },
        {
          bookId: 2,
          userId: 2,
          rating: 4,
          comment: "Interesting read, but a bit slow in the middle.",
        },
        {
          bookId: 3,
          userId: 3,
          rating: 3,
          comment: "Not bad, but not great either.",
        },
      ];

      const stmt = db.prepare(
        "INSERT INTO reviews(bookId, userId, rating, comment) VALUES(?, ?, ?, ?)"
      );
      for (const review of reviews) {
        stmt.run(
          review.bookId,
          review.userId,
          review.rating,
          review.comment,
          function (err) {
            if (err) {
              console.error(err.message);
            } else {
              console.log(`Review added with ID: ${this.lastID}`);
            }
          }
        );
      }
      stmt.finalize();
    }
  );
});

app.get("/reviews", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM reviews LIMIT ? OFFSET ?",
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

app.get("/reviews/:id", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 1;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM reviews WHERE id = ? LIMIT ? OFFSET ?",
    [req.params.id, limit, offset],
    (err, row) => {
      if (err) {
        res.status(500).send(err);
      } else if (!row) {
        res.status(404).send("Review not found");
      } else {
        res.json(row);
      }
    }
  );
});

app.post("/reviews", (req, res) => {
  const { bookId, userId, rating, comment } = req.body;
  db.run(
    "INSERT INTO reviews(bookId, userId, rating, comment) VALUES(?, ?, ?, ?)",
    [bookId, userId, rating, comment],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res
          .status(201)
          .json({ id: this.lastID, bookId, userId, rating, comment });
      }
    }
  );
});

app.put("/reviews/:id", (req, res) => {
  const { bookId, userId, rating, comment } = req.body;
  db.run(
    "UPDATE reviews SET bookId = ?, userId = ?, rating = ?, comment = ? WHERE id = ?",
    [bookId, userId, rating, comment, req.params.id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("Review not found");
      } else {
        res.json({ id: req.params.id, bookId, userId, rating, comment });
      }
    }
  );
});

app.delete("/reviews/:id", (req, res) => {
  db.run("DELETE FROM reviews WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).send(err);
    } else if (this.changes === 0) {
      res.status(404).send("Review not found");
    } else {
      res.json({ message: "Review deleted" });
    }
  });
});

app.get("/reviews/book/:bookId", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM reviews WHERE bookId = ? LIMIT ? OFFSET ?",
    [req.params.bookId, limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else if (rows.length === 0) {
        res.status(404).send("No reviews found for this book");
      } else {
        res.json(rows);
      }
    }
  );
});

app.get("/reviews/rating/:rating", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM reviews WHERE rating = ? LIMIT ? OFFSET ?",
    [req.params.rating, limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else if (rows.length === 0) {
        res.status(404).send("No reviews found with this rating");
      } else {
        res.json(rows);
      }
    }
  );
});

app.get("/reviews/user/:userId", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;

  db.all(
    "SELECT * FROM reviews WHERE userId = ? LIMIT ? OFFSET ?",
    [req.params.userId, limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else if (rows.length === 0) {
        res.status(404).send("No reviews found for this user");
      } else {
        res.json(rows);
      }
    }
  );
});

app.get("/reviews", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const search = req.query.search || '';
  
    db.all("SELECT * FROM reviews WHERE comment LIKE ? LIMIT ? OFFSET ?", [`%${search}%`, limit, offset], (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(rows);
      }
    });
  });
  

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Reviews service listening on port ${PORT}`);
});

module.exports = app;
