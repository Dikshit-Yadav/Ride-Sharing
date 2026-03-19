import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div>
        <h2>Welcome to BlaBlaCar</h2>

        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Home Page</h2>
      <p>You are logged in </p>
    </div>
  );
}
