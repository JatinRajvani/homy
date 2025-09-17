import {React,useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import "./Login.css"
const MainLogin = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  // Function to send user data to backend
  const sendUserDataToBackend = async (user) => {
    console.log("Sending user data:", user); // <-- Check if user data is present
  
    try {
      const response = await axios.post("https://homy-cnqt.onrender.com/api/auth/login", {
        username: user.name,
        email: user.email,
        picture: user.picture,
        sub: user.sub, // Unique user ID from Auth0
      });
  
      console.log("User stored:", response.data);
    } catch (error) {
      console.error("Error saving user:", error.response?.data || error.message);
    }
  };

  // Use Effect to send user data after authentication
  useEffect(() => {
    console.log("Auth0 Status Changed:", { isAuthenticated, user });
  
    if (isAuthenticated && user) {
      console.log("User Data Available:", user); // Log user data
      sendUserDataToBackend(user);
    }
  }, [isAuthenticated, user]);

  const handleSearch = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="maindiv">
        <div className="loginbyauth">
          <div className="auth-buttons">
            {/* Login / Logout Buttons */}
            {isAuthenticated ? (
              <>
                <p className="user-welcome">Welcome, {user.name}</p>
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="logout-button"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button onClick={loginWithRedirect} className="login-button">
                Log In
              </button>
            )}
          </div>
        </div>

        <div className="loginbyjwt">
          <button onClick={handleSearch} className="newbutton">
            Click Me
          </button>
        </div>
      </div>
    </>
  );
};
export default MainLogin;