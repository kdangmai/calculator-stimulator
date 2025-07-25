import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "db-1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123123",
  database: process.env.DB_NAME || "calculator",
}).promise(); // Bật chế độ promise để dùng async/await

// Hàm tự gọi để kiểm tra kết nối và bảng khi khởi động
(async () => {
  try {
    await db.query('SELECT 1'); // Thử một câu lệnh đơn giản để kiểm tra kết nối
    await db.query(`
      CREATE TABLE IF NOT EXISTS history (
          id INT AUTO_INCREMENT PRIMARY KEY,
          expression VARCHAR(255),
          result VARCHAR(255)
      )
    `);
    console.log("✅ Kết nối tới cơ sở dữ liệu và bảng 'history' đã sẵn sàng.");
  } catch (err) {
    console.error("!!! LỖI NGHIÊM TRỌNG: Không thể kết nối hoặc khởi tạo cơ sở dữ liệu:", err.stack);
    process.exit(1);
  }
})();

// API lưu lịch sử phép tính
app.post("/history", async (req, res) => {
  const { expression, result } = req.body;
  try {
    await db.query(
      "INSERT INTO history (expression, result) VALUES (?, ?)",
      [expression, result]
    );
    res.send("Saved!");
  } catch (err) {
    console.error("Lỗi khi lưu lịch sử:", err);
    res.status(500).send("DB Error");
  }
});

// API lấy lịch sử phép tính
app.get("/history", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM history ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử:", err);
    res.status(500).send("DB Error");
  }
});

app.listen(4000, '0.0.0.0', () => console.log('Server running on port 4000'));
