import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123123",
  database: process.env.DB_NAME || "calculator"
});

// Tạo bảng lịch sử nếu chưa có
db.query(
  `CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expression VARCHAR(255),
    result VARCHAR(255)
  )`
);

// API lưu lịch sử phép tính
app.post("/history", (req, res) => {
  const { expression, result } = req.body;
  db.query(
    "INSERT INTO history (expression, result) VALUES (?, ?)",
    [expression, result],
    (err) => {
      if (err) return res.status(500).send("DB Error");
      res.send("Saved!");
    }
  );
});

// API lấy lịch sử phép tính
app.get("/history", (req, res) => {
  db.query("SELECT * FROM history ORDER BY id DESC LIMIT 10", (err, rows) => {
    if (err) return res.status(500).send("DB Error");
    res.json(rows);
  });
});

app.listen(4000, () => console.log("Backend running on port 4000"));