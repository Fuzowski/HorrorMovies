import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");
    console.log("Sending token:", token ? `Bearer ${token}` : "No token found");

    if (!token) {
      alert("You must be logged in to add favorites");
      navigate("/login");
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

      if (res.status === 401) {
        alert("Your session has expired or token is invalid. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add favorite");
      }

      alert(`${movie.title} added to favorites!`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
      <p>Release Date: {movie.release_date}</p>
      <p>{movie.overview}</p>

      <button onClick={handleAddFavorite}>Add to Favorites</button>
    </div>
  );
}

export default MovieDetails;
