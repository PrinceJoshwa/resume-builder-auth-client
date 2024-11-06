import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = async (response) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/google", {
        token: response.credential,
      });
      setIsAuthenticated(true);
      setUserData(data.user);
    } catch (error) {
      console.error("Authentication failed:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsAuthenticated(false);
      }, 3000); // Show message for 3 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isAuthenticated]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="App">
        <h2>Google Authentication</h2>

        {isAuthenticated ? (
          <div>
            <p>Authentication Successful!</p>
            <p>Welcome, {userData?.name}!</p>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.error("Login failed")}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
