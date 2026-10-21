const express = require('express');
const mysql = require('mysql2/promise');
const client = require('prom-client');

const app = express();
app.use(express.json());

// Thu thập metrics Prometheus
client.collectDefaultMetrics({ register: client.register });
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Tổng số request HTTP',
  labelNames: ['method', 'route', 'status']
});

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: res.statusCode >= 400 ? 'ERROR' : 'INFO',
      method: req.method,
      path: req.path,
      status: res.statusCode,
      latency_ms: Date.now() - start
    }));
  });
  next();
});

// Kết nối MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'student_user',
  password: process.env.DB_PASSWORD || 'Strong_Student_Pass2026!',
  database: process.env.DB_NAME || 'student_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

// CRUD Sinh viên
app.get('/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/students', async (req, res) => {
  const { student_code, full_name, class_name, score } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO students (student_code, full_name, class_name, score) VALUES (?, ?, ?, ?)',
      [student_code, full_name, class_name, score]
    );
    res.status(201).json({ id: result.insertId, message: 'Thêm sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/students/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'INFO', message: `Ứng dụng chạy trên port ${PORT}` }));
});
