import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import decodeToken from "./decodeToken";

const useAuth = (socket, setOnlineUsers) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeToken(token);
      // console.log(decodedToken.name);
      if (decodedToken) {
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");
          setOnlineUsers(new Set());  // Clear online users
          if (socket) {
            socket.disconnect();  // Disconnect the socket
          }
          navigate("/login");
        } else {
          // Token is still valid
          // console.log("Token is still valid");
        }
      } else {
        // Handle case when the token is invalid or decoding failed
        localStorage.removeItem("token");
        setOnlineUsers(new Set());  // Clear online users
        if (socket) {
          socket.disconnect();  // Disconnect the socket
        }
        navigate("/login");
      }
    } else {
      setOnlineUsers(new Set());  // Clear online users
      if (socket) {
        socket.disconnect();  // Disconnect the socket
      }
      navigate("/login");
    }
  }, [navigate, socket, setOnlineUsers]);
};

export default useAuth;
