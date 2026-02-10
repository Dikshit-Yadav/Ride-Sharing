import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../style/Login.css";

function VehicleRegister() {
  const navigate = useNavigate();

  const [VhNumber, setVhNumber] = useState("");
  const [VhModel, setVhModel] = useState("");
  const [TotalSeats, setTotalSeats] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/vehicle/register",
        { VhNumber, VhModel, TotalSeats },
        {  withCredentials: true }
      );

      alert("Vehicle registered successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Vehicle registration failed");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container">
      <form style={{position:"absolute",
        left:"40%"
      }} onSubmit={submitHandler}>
        <h2>Register Vehicle</h2>
        <input
          type="text"
          placeholder="Vehicle Number"
          value={VhNumber}
          onChange={(e) => setVhNumber(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Vehicle Model"
          value={VhModel}
          onChange={(e) => setVhModel(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Total Seats"
          value={TotalSeats}
          onChange={(e) => setTotalSeats(e.target.value)}
          required
        />

        <button type="submit">Register Vehicle</button>
      </form>
    </div>
    </>
  );
}

export default VehicleRegister;
