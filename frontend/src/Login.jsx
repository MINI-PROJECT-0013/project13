import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import "./styles.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const goToPrev = () => {
    navigate(-1);
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors
    try {
      console.log("Sending request:", { email, password });
      
      const response = await axios.post("http://localhost:5000/auth", {
        email,
        password,
      });

      console.log("Login Successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      const userType = response.data.userType;

      console.log("User Type:", userType);

      if (userType === "Customer") {
        navigate(`/search/${response.data.userId}`);
      } else if (userType === "Professional") {
        navigate(`/professional/profile/${response.data.userId}`);
      } else if (userType === "Admin") {
        navigate(`/admin`);
      } else {
        navigate('/'); // Default route
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form-section">
          <div className="logo">
            <span className="logo-text">HOUSEHOLD SERVICE MANAGEMENT</span>
          </div>

          <div className="user-icon">
            <div className="icon-circle"></div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="input-icon user-icon-input"></div>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon lock-icon-input"></div>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-options">
            
              <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <div className="signup-option">
             <p> Don't have an account?,<br></br><br></br> <Link to="/customer/register" className="signup-link">Sign up as Customer</Link> <br></br>
              or
              <br></br>
             <Link to="/professional/register" className="signup-link">Sign up as Professional</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section">
          <div className="nav-menu">
            <button onClick={goToPrev} className="nav-item">
              <span>
PREV
              </span>
            </button>
          
            <Link to="/" className="nav-item sign-in-btn">HOME</Link>
          </div>

          <div className="wave-animation"></div>

          <div className="welcome-content">
            <h1>Welcome Back!</h1>
            <p>login to Explore.</p>
            
          </div>
        </div>
      </div>

      <div className="mobile-menu">
        <button>
          <span className="menu-icon"></span>
        </button>
      </div>
    </div>
  );
};

export default Login;
