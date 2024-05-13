const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors"); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 3000;
// Use the cors middleware to allow requests from frontend server
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  })
);

// Create or open the SQLite database
const db = new sqlite3.Database(path.join(__dirname, "voting.db"));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Route to submit a vote
app.post("/vote", (req, res) => {
  const { option } = req.body;
  if (option === "vegetarian" || option === "non-vegetarian") {
    db.run("INSERT INTO votes (option) VALUES (?)", [option], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ message: "Vote submitted successfully" });
      }
    });
  } else {
    res.status(400).json({ error: "Invalid option" });
  }
});

// Route to get current results
app.get("/results", (req, res) => {
  db.all(
    "SELECT COUNT(*) AS totalResponses, " +
      'SUM(CASE WHEN option="vegetarian" THEN 1 ELSE 0 END) AS option1Responses, ' +
      'SUM(CASE WHEN option="non-vegetarian" THEN 1 ELSE 0 END) AS option2Responses ' +
      "FROM votes",
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json(rows[0]);
      }
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
