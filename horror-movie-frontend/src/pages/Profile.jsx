import { useEffect, useState } from "react";

function Profile() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3000/users/me/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then((data) => setFavorites(data.favorites))
      .catch((err) => console.error(err));
  }, [token]);

  const handleRemove = async (movieId) => {
    try {
      const res = await fetch(`http://localhost:3000/users/me/favorites/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      setFavorites(favorites.filter((movie) => movie.movie_id !== movieId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Your Profile</h1>
      <p>Welcome! This page displays your favorite movies.</p>

      <h2>Favorites</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {favorites.length === 0 ? (
          <p>You have no favorites yet.</p>
        ) : (
          favorites.map((movie) => (
            <div key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <p>{movie.title}</p>
              <button onClick={() => handleRemove(movie.movie_id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;

