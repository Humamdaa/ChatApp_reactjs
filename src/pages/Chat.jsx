import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import { jwtDecode } from "jwt-decode";
const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
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

  useEffect(() => {}, selectedUserId);
  // Function to set the selected chat user
  const handleSelectChat = (userId, userName) => {
    // console.log("idGeted:", userId);
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  const handleCloseChatWindow = () => {
    setSelectedUserId(null); // Close chat by clearing selectedUserId
    setSelectedUserName(""); // Clear user name
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <ChatList onSelectChat={handleSelectChat} />
        {selectedUserId && (
          <ChatWindow
            userId={selectedUserId} // Pass selectedUserId
            name={selectedUserName} // Pass selectedUserName
            onClose={handleCloseChatWindow} // Pass onClose function
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
