import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../userContext";

export default function NavBar() {
  const { isAuthenticated, setToken, user, setUser } = useContext(UserContext);

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  }

  return isAuthenticated ? (
    <div className="navbar">
      <span>{user?.username}</span>
      <a href="/" onClick={logout}>
        Logout
      </a>
    </div>
  ) : (
    <div className="navbar">
      <NavLink to="/login">Login</NavLink>
    </div>
  );
}
