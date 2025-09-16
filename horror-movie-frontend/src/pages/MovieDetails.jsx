import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:3000/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddFavorite = async () => {
    if (!token) {
      alert("You must be logged in to add favorites");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/me/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        }),
      });

      if (!res.ok) throw new Error("Failed to add favorite");
      alert(`${movie.title} added to favorites!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add favorite");
    }
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
      <p>Release Date: {movie.release_date}</p>
      <p>{movie.overview}</p>

      <button onClick={handleAddFavorite}>Add to Favorites</button>
    </div>
  );
}

export default MovieDetails;
