import { useState } from "react";
import API from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
    const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    localStorage.setItem("email", email)
    try {
      await API.post("/auth/forget-password", { email });
      navigate("/reset-password")
    } catch {
      alert("user not found");
    }
  };

  return (
    <div className="container">
      
      <form onSubmit={submit}>
        <h2>Forget Password</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button>Send OTP</button>
      </form>
    </div>
  );
}

export default ForgetPassword;
