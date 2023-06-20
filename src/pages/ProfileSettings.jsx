import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import { UserContext } from "../userContext";
import "../styles/profileSettings.css";

export default function ProfileSettings() {
  const { user } = useContext(UserContext);

  return (
    <div className="profile-page">
      <NavBar />
      <div className="settings-container">
        <h2>Profile Settings</h2>
        <form>
          <label>{user?.email}</label>
          <button onClick={toggleEmail}>Change Email</button>
        </form>
        <form></form>
      </div>
    </div>
  );
}
