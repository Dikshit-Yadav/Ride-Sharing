import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="homeContainer">
     <Navbar />

      <section className="hero">
        <h2>Go to your Destination.</h2>
        <p>Find or share rides.</p>

        {user ? (
          <div className="btn-container">
            <button
              className="create-rd"
              onClick={() => navigate("/create-ride")}
            >
              Create Ride
            </button>
            <button className="find-rd" onClick={() => navigate("/rides")}>
              Find Ride
            </button>
          </div>
        ) : (
          <button className="lgn-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </section>
    </div>
  );
}

export default HomePage;
