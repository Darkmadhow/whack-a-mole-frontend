import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../userContext";
import "../styles/navbar.css";

export default function NavBar() {
  const { isAuthenticated, setToken, user, setUser, isMuted, setIsMuted } =
    useContext(UserContext);

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  }

  return isAuthenticated ? (
    <div className="navbar-global">
      <NavLink to="/">Home</NavLink>
      <div className="logout-menu">
        <span className="user-name">{user?.username}</span>
        <a href="/" onClick={logout}>
          Logout
        </a>
        <NavLink to="/profile" className="profile-link">
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
          >
            <path d="M45,14.67l-2.76,2a1,1,0,0,1-1,.11L37.65,15.3a1,1,0,0,1-.61-.76l-.66-3.77a1,1,0,0,0-1-.84H30.52a1,1,0,0,0-1,.77l-.93,3.72a1,1,0,0,1-.53.65l-3.3,1.66a1,1,0,0,1-1-.08l-3-2.13a1,1,0,0,0-1.31.12l-3.65,3.74a1,1,0,0,0-.13,1.26l1.87,2.88a1,1,0,0,1,.1.89L16.34,27a1,1,0,0,1-.68.63l-3.85,1.06a1,1,0,0,0-.74,1v4.74a1,1,0,0,0,.8,1l3.9.8a1,1,0,0,1,.72.57l1.42,3.15a1,1,0,0,1-.05.92l-2.13,3.63a1,1,0,0,0,.17,1.24L19.32,49a1,1,0,0,0,1.29.09L23.49,47a1,1,0,0,1,1-.1l3.74,1.67a1,1,0,0,1,.59.75l.66,3.79a1,1,0,0,0,1,.84h4.89a1,1,0,0,0,1-.86l.58-4a1,1,0,0,1,.58-.77l3.58-1.62a1,1,0,0,1,1,.09l3.14,2.12a1,1,0,0,0,1.3-.15L50,45.06a1,1,0,0,0,.09-1.27l-2.08-3a1,1,0,0,1-.09-1l1.48-3.43a1,1,0,0,1,.71-.59L53.77,35a1,1,0,0,0,.8-1V29.42a1,1,0,0,0-.8-1l-3.72-.78a1,1,0,0,1-.73-.62l-1.45-3.65a1,1,0,0,1,.11-.94l2.15-3.14A1,1,0,0,0,50,18l-3.71-3.25A1,1,0,0,0,45,14.67Z" />
            <circle cx="32.82" cy="31.94" r="9.94" />
          </svg>
        </NavLink>
        {isMuted ? (
          <img
            src="no-sound.png"
            alt="mute"
            className="muteBtn"
            onPointerDown={() => setIsMuted(!isMuted)}
          />
        ) : (
          <img
            src="sound.png"
            alt="unmute"
            className="muteBtn"
            onPointerDown={() => setIsMuted(!isMuted)}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="navbar-global">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
      {isMuted ? (
        <img
          src="no-sound.png"
          alt="mute"
          className="muteBtn"
          onPointerDown={() => setIsMuted(!isMuted)}
        />
      ) : (
        <img
          src="sound.png"
          alt="unmute"
          className="muteBtn"
          onPointerDown={() => setIsMuted(!isMuted)}
        />
      )}
    </div>
  );
}
