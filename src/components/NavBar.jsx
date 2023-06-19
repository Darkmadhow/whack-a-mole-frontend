import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../userContext";
import "../styles/navbar.css";

export default function NavBar() {
  const { isAuthenticated, setToken, user, setUser } = useContext(UserContext);

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  }

  return isAuthenticated ? (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <div className="logout-menu">
        <span>{user?.username}</span>
        <a href="/" onClick={logout}>
          Logout
        </a>
      </div>
    </div>
  ) : (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </div>
  );
}
