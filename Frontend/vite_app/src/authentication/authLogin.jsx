import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate,Link} from "react-router-dom";
import { loginUser } from "./authSlice.jsx";
import "./Login.css"; // Import CSS file

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {  username, password };

    try {
      const response = await fetch("https://homy-cnqt.onrender.com/api/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      console.log(response); 
      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        dispatch(loginUser(data));
        navigate("/profile");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button><Link to="/register" className="nav-link">register</Link></button>
      </form>
    </div>
  );
};

export default Login;
