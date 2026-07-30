import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);

      // Save login status
      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");

    } catch (err) {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>

        <h1>R24 ADMIN</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;