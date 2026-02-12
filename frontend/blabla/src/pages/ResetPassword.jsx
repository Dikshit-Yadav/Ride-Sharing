import { useState } from "react";
import API from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";

function ResetPassword() {
  //   const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/reset-password", {
        otp,
        newPassword,
        email: localStorage.getItem("email")
      });
      alert("password reseted ");
      localStorage.removeItem("email");
      navigate("/login")
    } catch {
      alert("invalid OTP");
    }
  };

  return (
    <div className="container">

      <form onSubmit={submit}>
        <h2>Reset Password</h2>
        {/* <input  type="email" value={localStorage.getItem("email")} /> */}
        <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button>Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
