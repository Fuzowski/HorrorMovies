import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
const TMDB_API_KEY = "db27895b0d94478f59b1a4c819ef94ae";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Horror Movie Database API is running");
});

app.get("/movies", async (req, res) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&sort_by=popularity.desc&page=1`

        );
        const data = await response.json();
        res.json(data.results);
    }   catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch movies"});
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
