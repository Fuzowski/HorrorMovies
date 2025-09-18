// routes/users.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// ---- REGISTER ----
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- LOGIN ----
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- GET FAVORITES ----
router.get("/me/favorites", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1",
      [req.user.id]
    );
    res.json({ favorites: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- ADD FAVORITE ----
router.post("/me/favorites", auth, async (req, res) => {
  const { movie_id, title, poster_path, release_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO favorites (user_id, movie_id, title, poster_path, release_date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [req.user.id, movie_id, title, poster_path, release_date]
    );
    res.status(201).json({ favorite: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- REMOVE FAVORITE ----
router.delete("/me/favorites/:movieId", auth, async (req, res) => {
  const { movieId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2 RETURNING *",
      [req.user.id, movieId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Favorite not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
