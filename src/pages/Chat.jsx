import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { jwtDecode } from "jwt-decode";
const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decodedToken = jwtDecode(token);

        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
          console.log("expi");
          // Token is expired, clear it from localStorage and redirect to login
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          // Token is still valid
          setValidToken(token);
        }
      } catch (error) {
        console.error("Invalid token format", error);
        console.log(error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(()=>{
    
  },selectedUserId)
  // Function to set the selected chat user
  const handleSelectChat = (userId) => {
    console.log("idGeted:", userId);
    setSelectedUserId(userId);
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <ChatList onSelectChat={handleSelectChat} />
        {selectedUserId && <ChatWindow userId={selectedUserId} />}
      </div>
    </div>
  );
};

export default Chat;
