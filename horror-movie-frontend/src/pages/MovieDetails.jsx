import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as jwt_decode from "jwt-decode";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/movies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Movie Details");
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add favorites");
      return;
    }

    // Decode JWT to get user ID
    const decoded = jwt_decode(token);
    const userid = decoded.id; // get actual user ID from JWT

    try {
      const res = await fetch(`http://localhost:3000/users/${userid}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movie }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add favorite");

      alert("Movie added to favorites!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>NO MOVIE FOUND!!!!</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
      <p><strong>Release Date:</strong></p>
      <p>{movie.overview}</p>

      {/* Add to Favorites button */}
      {localStorage.getItem("token") && (
        <button onClick={handleAddFavorite}>Add to Favorites</button>
      )}

      <Link to="/">← Back to Home</Link>
    </div>
  );
}

export default MovieDetails;