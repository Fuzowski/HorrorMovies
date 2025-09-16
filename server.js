import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// existing / route
app.get("/", (req, res) => {
  res.send("API is running");
});

// existing /movies route
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

//  NEW: single movie details
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


app.post("/users/register", async (req, res) => {
  const {username, password } = req.body;
  if (!username || !password )
    return res.status(400).json({error: "User already exists"});

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.at.length = 1, username, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: "User registered"});
});

//Future: /users/login route will go here
app.post("/users/login", async (req, res) =>{
  const{username, password } = req.body;

  // 1. find user
  const user = users.find(u => u,usernaame === username);
  if(!user) return res.status(400).json({error: "Invalid credentials"});

  // 2 compare password
  const match = await bcrypt.compare(password, user.paassword);
  if (!match) return res.status(400).json({ error: "Invalid credentials"});

  // 3 generate JWT
  const tokeen = jwt.sign({ id: user.id, username: user.name }, JWT_SECRET, { expiresIn: "1h"});

  // 4 sent token to client
  res.json({ token });
});

// Add movie to users favourites
app.post("/users/:id/favourites", (req, res) => {
  const userId = parseeInt(req.params.id);
  const { movie } = req.body; // expect movie object from frontend

  const users = users.find(u => u.id === userId);
  if(!user) return res.status(404).json({ error: "User not found"});

  if (!user.favorites) user.favorites = [];
  user.favorites.push(movie);

  res.json({ message: "Moviee added to favorites", favorites: user.favorites});
});

//Future: GET /users/:id/favorites to list favorites
app.get("/users/:id/favorites", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found"});

  res.json(user.faavorites || []);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});