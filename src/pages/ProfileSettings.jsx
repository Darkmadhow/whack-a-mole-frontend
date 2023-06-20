import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { UserContext } from "../userContext";
import { updateUser } from "../utils/auth";
import "../styles/profileSettings.css";

export default function ProfileSettings() {
  const { user, setUser, isAuthenticated, isLoading, setIsLoading, token } =
    useContext(UserContext);
  const [{ email, password, passwordRepeat }, setFormState] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const handleChange = (e) =>
    setFormState((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handlePasswordSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!password || !passwordRepeat)
        return alert("Please fill out all the fields");
      if (password !== passwordRepeat)
        return alert(
          "Password and repeated Password must match. Check for typos."
        );
      setIsLoading(true);
      const updatedUser = await updateUser(user._id, token, { password });
      setUser(updatedUser);
      setFormState({
        email: "",
        password: "",
        passwordRepeat: "",
      });
      setIsLoading(false);
    } catch (error) {
      alert(error.response?.data.error || error.message);
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!email) return alert("Please fill out all the fields");
      setIsLoading(true);
      const updatedUser = await updateUser(user._id, token, { email });
      setUser(updatedUser);
      setFormState({
        email: "",
        password: "",
        passwordRepeat: "",
      });
      setIsLoading(false);
    } catch (error) {
      alert(error.response?.data.error || error.message);
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return <Navigate to="/" />;
  if (isLoading) return <div className="profile-page">Saving changes...</div>;

  return (
    <div className="profile-page">
      <NavBar />
      <div className="settings-container">
        <h2>Profile Settings</h2>
        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title">{user?.email}</div>
          <div className="collapse-content">
            <form onSubmit={handleEmailSubmit}>
              <label htmlFor="email">New Email</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleChange}
              />
              <button type="submit">Save</button>
            </form>
          </div>
        </div>

        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title">Password</div>
          <div className="collapse-content">
            <form onSubmit={handlePasswordSubmit}>
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
              <label htmlFor="passwordRepeat">Repeat new Password</label>
              <input
                type="password"
                name="passwordRepeat"
                id="passwordRepeat"
                onChange={handleChange}
              />
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
