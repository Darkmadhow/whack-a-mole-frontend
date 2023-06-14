import React from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import NavBar from "../components/NavBar";

export default function Login() {
  return (
    <>
      <NavBar />
      <div className="login-page">
        <form action="/" method="POST">
          <label forhtml="username">Username</label>
          <input type="text" id="username" name="username" />
          <label forhtml="password">Password</label>
          <input type="password" id="password" name="password" />
          <input type="submit" value="Login" />
          <Link to="/">Forgot your password?</Link>
        </form>
      </div>
    </>
  );
}
