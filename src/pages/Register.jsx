import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { registerUser, getUser } from "../utils/auth";
import NavBar from "../components/NavBar";
import "../styles/register.css";
import AudioPlayerContext from "../utils/audioPlayerContext";

export default function Register() {
  const {
    isAuthenticated,
    isLoading,
    setIsLoading,
    setIsAuthenticated,
    setToken,
    setUser,
  } = useContext(UserContext);
  const [{ username, email, password, passwordRepeat }, setFormState] =
    useState({
      username: "",
      email: "",
      password: "",
      passwordRepeat: "",
    });

  const audioPlayer = useContext(AudioPlayerContext);

  useEffect(() => {
    if (audioPlayer) audioPlayer.play();

    return () => {
      if (audioPlayer) audioPlayer.pause();
    };
  }, []);

  const handleChange = (e) =>
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!username || !password || !email || !passwordRepeat)
        return alert("Please fill out all the fields");
      if (password !== passwordRepeat)
        return alert(
          "Password and repeated Password must match. Check for typos."
        );
      setIsLoading(true);
      const token = await registerUser({ username, email, password });
      setToken(token);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setUser(await getUser(token));
      setIsLoading(false);
    } catch (error) {
      alert(error.response?.data.error || error.message);
      setIsLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;
  if (isLoading) return <div className="login-page">Loading...</div>;

  return (
    <>
      <div className="register-page">
        <NavBar />
        <form onSubmit={handleSubmit}>
          <label forhtml="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
          />
          <label forhtml="email">Email</label>
          <input type="text" id="email" name="email" onChange={handleChange} />
          <label forhtml="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
          />
          <label forhtml="passwordRepeat">Repeat password</label>
          <input
            type="password"
            id="passwordRepeat"
            name="passwordRepeat"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}
