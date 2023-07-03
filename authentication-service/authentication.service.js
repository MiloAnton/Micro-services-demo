const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(bodyParser.json());

// Connect to the existing users database
let db = new sqlite3.Database("./../users/users.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the users database.");
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("Received event:", event);
  res.send({ status: 'OK' });
});

app.get("/", (req, res) => {
  res.json({ message: "This is the authentication service. Service is running." });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(
    "INSERT INTO users(name, email, password) VALUES(?, ?, ?)",
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).json({ id: this.lastID, name, email });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
    if (err || !row || !(await bcrypt.compare(password, row.password))) {
      res.status(400).send("Invalid email or password");
    } else {
      const token = jwt.sign(
        { id: row.id, role: row.role },
        "your-secret-key",
        { expiresIn: "1h" }
      );
      res.json({ token });
    }
  });
});

app.post("/logout", (req, res) => {
  // In a real-world application, you would implement token blacklist here
  res.json({ message: "User logged out" });
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  db.run(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, email],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else if (this.changes === 0) {
        res.status(404).send("User not found");
      } else {
        res.json({ message: "Password reset successful" });
      }
    }
  );
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Authentication service listening on port ${PORT}`);
});

module.exports = app;
