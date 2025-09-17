// import {React,useEffect} from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { logoutUser } from "./authSlice.jsx";
// import { useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";

// const Profile = () => {
//   const { user } = useSelector((state) => state.auth); // JWT user data from Redux
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated,  user: auth0User , logout } = useAuth0(); // Auth0 user data

//   // Function to send user data to backend
//   const sendUserDataToBackend = async (user) => {
//     try {
//       console.log("Sending user data to backend:", user); // Check if user data exists
  
//       const response = await axios.post("http://localhost:5500/api/auth/login", {
//         username: user.name,
//         email: user.email,
//         picture: user.picture,
//         sub: user.sub, // Unique Auth0 ID
//       });
  
//       console.log("User stored in backend:", response.data); // Check server response
//     } catch (error) {
//       if (error.response) {
//         console.error("Server Error:", error.response.data);
//       } else {
//         console.error("Request Failed:", error.message);
//       }
//     }
//   };



//     // Use Effect to send user data after authentication
//     useEffect(() => {
//       console.log("🔄 Checking Auth0 status...");
//       console.log("🔍 isAuthenticated:", isAuthenticated);
//       console.log("👤 user:", user);
    
//       if (isAuthenticated && user) {
//         console.log("✅ User Data Received:", user);
//         sendUserDataToBackend(user);
//       } else {
//         console.log("⚠️ User is null. Waiting for Auth0 to return data...");
//       }
//     }, [isAuthenticated, user]);



//   const handleJWTLogout = () => {
//     dispatch(logoutUser());
//     navigate("/hostel");
//   };

//   const handleAuth0Logout = () => {
//     logout({ returnTo: window.location.origin });
//   };
//   return (
//     <div className="profile-container">
//       {user ? (
//         <>
//           <h2>Welcome, {user.username}!</h2>
//           <p>Email: {user.email}</p>
//           <p>Username: {user.username}</p>
//           <p>User ID: {user.user_id}</p>
//           <button onClick={handleJWTLogout}>Logout</button>
//         </>
//       ) : isAuthenticated ? (
//         <>
//          {sendUserDataToBackend}
//           <h2>Welcome, {auth0User.name}!</h2>
//           <p>Email: {auth0User.email}</p>
//           <button onClick={handleAuth0Logout}>Logout</button>

//         </>
//       ) : (
//         <p>Please log in to view your profile.</p>
//       )}
//     </div>
//   );
// };

// export default Profile;


import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutUser } from "./authSlice.jsx"; // Ensure this action exists

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // JWT user from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user: auth0User, logout } = useAuth0(); // Auth0 user

  // Function to send user data to backend
  const sendUserDataToBackend = async (auth0User) => {
    try {
      if (!auth0User) {
        console.error("❌ No Auth0 user data available");
        return;
      }

      console.log("📤 Sending user data to backend:", auth0User);

      const response = await axios.post("https://homy-cnqt.onrender.com/api/auth/login", {
        username: auth0User.name,
        email: auth0User.email,
        picture: auth0User.picture,
        sub: auth0User.sub, // Unique Auth0 ID
      });

      console.log("✅ User stored in backend:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("❌ Server Error:", error.response.data);
      } else {
        console.error("❌ Request Failed:", error.message);
      }
    }
  };

  // Use Effect to send user data after authentication
  useEffect(() => {
    console.log("🔄 Checking Auth0 status...");
    console.log("🔍 isAuthenticated:", isAuthenticated);
    console.log("👤 Auth0 user:", auth0User);

    if (isAuthenticated && auth0User) {
      console.log("✅ User Data Received:", auth0User);
      sendUserDataToBackend(auth0User);
      navigate('/profile')
    } else {
      console.log("⚠️ User is null. Waiting for Auth0 to return data...");
    }
  }, [isAuthenticated, auth0User]);

  // JWT Logout
  const handleJWTLogout = () => {
    dispatch(logoutUser());
    navigate("/hostel");
  };

  // Auth0 Logout
  const handleAuth0Logout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className="profile-container">
      {user ? (
        <>
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
          <p>User ID: {user.user_id}</p>
          <button onClick={handleJWTLogout}>Logout</button>
        </>
      ) : isAuthenticated && auth0User ? (
        <>
          <h2>Welcome, {auth0User.name}!</h2>
          <p>Email: {auth0User.email}</p>
          <button onClick={handleAuth0Logout}>Logout</button>
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;


