import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { login } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      await login(username, password);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (error.response?.status === 429) {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (error.code === "ECONNABORTED") {
        // Free-tier Render instance spins down after idling; the first request after that can take 30-50s to wake it.
        setError("Server is waking up (free-tier cold start) — please wait a moment and try again.");
      } else if (!error.response) {
        setError("Can't reach the server. Check your internet connection and try again.");
      } else {
        setError(error.response?.data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-showcase">
        <div className="login-showcase-overlay">
          <div className="login-showcase-logo">R24</div>
          <h2>Built for Riders.<br />Run by R24.</h2>
          <p>Manage bookings, products and your KTM community — all from one premium dashboard.</p>
        </div>
      </div>

      <div className="login-form-panel">
        <form className="login-box glass-card" onSubmit={handleLogin}>

          <div className="login-logo">
            <div className="login-logo-circle">R24</div>
            <h1>R24 Automotive</h1>
            <span>Your Business. One Dashboard.</span>
          </div>

          <label className="login-field">
            <User size={18} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="login-field">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? "Signing In..." : (
              <>
                <LogIn size={18} /> Login
              </>
            )}
          </button>

        </form>
      </div>

    </div>
  );
}

export default Login;
