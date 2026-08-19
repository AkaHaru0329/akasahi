require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// サーバー一覧取得
app.get('/api/servers', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM servers ORDER BY id ASC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('一覧取得エラー:', error);
    res.status(500).json({
      error: 'サーバー一覧の取得に失敗しました'
    });
  }
});

// サーバー追加
app.post('/api/servers', async (req, res) => {
  try {
    const {
      name,
      status,
      cpu_usage,
      memory_usage
    } = req.body;

    const result = await pool.query(
      `INSERT INTO servers
        (name, status, cpu_usage, memory_usage)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name,
        status,
        cpu_usage,
        memory_usage
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('追加エラー:', error);
    res.status(500).json({
      error: 'サーバーの追加に失敗しました'
    });
  }
});

// サーバー更新
app.put('/api/servers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      cpu_usage,
      memory_usage
    } = req.body;

    const result = await pool.query(
      `UPDATE servers
       SET status = $1,
           cpu_usage = $2,
           memory_usage = $3
       WHERE id = $4
       RETURNING *`,
      [
        status,
        cpu_usage,
        memory_usage,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'サーバーが見つかりません'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('更新エラー:', error);
    res.status(500).json({
      error: 'サーバーの更新に失敗しました'
    });
  }
});

app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});