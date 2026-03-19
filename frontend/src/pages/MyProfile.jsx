import { useNavigate } from "react-router-dom";
import "../style/MyProfile.css";
import Navbar from "../components/Navbar";

function MyProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }


  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2>My Profile</h2>
            <p>Personal details</p>
          </div>


          <div className="profile-pic">
            {user.profilePic ? (
              <img
                src={`https://ride-sharing-a2gh.onrender.com/profile/pic/${user.profilePic}`}
                alt="Profile"
                className="pic"
              />
            ) : (
              <div className="pic"></div>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Name</span>
            <span className="profile-value">{user.name}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Phone</span>
            <span className="profile-value">{user.phone || "—"}</span>
          </div>

          <div className="profile-actions">
            <button className="edit-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyProfile;
