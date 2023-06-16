import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { loginUser, getUser } from "../utils/auth";
import NavBar from "../components/NavBar";
import "../styles/login.css";

export default function Login() {
  const {
    isAuthenticated,
    isLoading,
    setIsLoading,
    setIsAuthenticated,
    setToken,
    setUser,
  } = useContext(UserContext);
  const [{ username, password }, setFormState] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!username || !password)
        return alert("Please fill out all the fields");
      setIsLoading(true);
      const token = await loginUser({ username, password });
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
      <NavBar />
      <div className="login-page">
        <form onSubmit={handleSubmit}>
          <label forhtml="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
          />
          <label forhtml="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
          />
          <input type="submit" value="Login" />
          <Link to="/">Forgot your password?</Link>
        </form>
      </div>
    </>
  );
}
