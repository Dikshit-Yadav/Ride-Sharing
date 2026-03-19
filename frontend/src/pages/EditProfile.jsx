import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../style/EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const Cuser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: Cuser?.name || "",
    email: Cuser?.email || "",
    phone: Cuser?.phone || "",
    oldPassword: "",
    newPassword: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!Cuser) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedUser = Cuser;
      const textRes = await API.put(
        `/profile/edit/${Cuser._id}`,
        formData,
        { withCredentials: true }
      );
      updatedUser = textRes.data.user;

      if (file) {
        const data = new FormData();
        data.append("profilePic", file);
        const picRes = await API.post("/profile/pic/upload", data, {
          withCredentials: true,
        });
        updatedUser = picRes.data.user;
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        <form  encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Profile Picture</label>
          <input type="file" name="profilePic" onChange={(e) => setFile(e.target.files[0])} />

          <label>Old Pass.</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            />

          <label>New Pass.</label>
          < input type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          />


          <div className="edit-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/my-profile")}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
