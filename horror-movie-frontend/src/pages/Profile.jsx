import { useEffect, useState } from "react";
import * as jwt_decode from "jwt-decode";

function Profile() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const decoded = jwt_decode(token); // ✅ fixed variable name
    const userId = decoded.id; // get actual user ID from JWT

    fetch(`http://localhost:3000/users/${userId}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));

    // Future: fetch user's favorite movies from backend using token
  }, [token]);

  return (
    <div>
      <h1>Your Profile</h1>
      <p>Welcome! This page will display your account details and favorite movies.</p>

      <h2>Favorites</h2>
      <div>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;

// Future: add "Remove from Favorites" button
// Future: connect to backend route for real user ID