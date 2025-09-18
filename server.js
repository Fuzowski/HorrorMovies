import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "./middleware/auth.js";

dotenv.config();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ---- TEST ROUTE ----
app.get("/", (req, res) => {
  res.send("API is running");
});

// ---- MOVIE ROUTES ----
app.get("/movies", async (req, res) => {
  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        with_genres: 27, // horror
        language: "en-US",
      },
    });
    res.json(response.data.results);
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/movies/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching movie details:", err.message);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// ---- USER AUTH ROUTES ----
app.post("/users/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword, favorites: [] };
  users.push(newUser);

  res.status(201).json({ message: "User registered" });
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// ---- FAVORITES ROUTES ----
// Add a movie to current user's favorites
app.post("/users/me/favorites", auth, (req, res) => {
  const userId = req.user.id; // from JWT
  const { movie_id, title, poster_path, release_date } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (!user.favorites) user.favorites = [];
  user.favorites.push({ movie_id, title, poster_path, release_date });

  res.json({ message: "Movie added to favorites", favorites: user.favorites });
});

// Get current user's favorites
app.get("/users/me/favorites", auth, (req, res) => {
  const userId = req.user.id;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user.favorites || []);
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
