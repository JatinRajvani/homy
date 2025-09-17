import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register =()=>{
  const [username,setusername]=useState("");
  const[password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const navigate=useNavigate();
  
  const handleRegister=async(e)=>{

    e.preventDefault();

    const userData ={username,password,email};

    try{
        const response=await fetch('https://homy-cnqt.onrender.com/api/register',{
        method:"Post",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(userData),

        });
        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! You can now log in.");
            navigate("/login"); // Redirect to login page
          } else {
            alert(data.message || "Registration failed.");
          } 
    } catch (error) {
        console.error("Registration error:", error);
        alert("Error registering user.");
      }
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
         <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
export default Register;