import { Link } from "react-router-dom";
import Home from "../pages/Home.jsx"; // if needed
import Login from "../pages/Login.jsx"; 
import Register from "../pages/Register.jsx"; 

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;