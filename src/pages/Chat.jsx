import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../components/chat/chatList/ChatList";
import ChatWindow from "../components/chat/chatWindow/ChatWindow";
import { jwtDecode } from "jwt-decode";
import { createChat, getChats } from "../api/chatApi";

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [chatCreated, setCreateChat] = useState(null); // Store chat creation status
  // const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          // Token is still valid
          console.log("else in chat");
          // fetchChats();
        }
      } catch (error) {
        console.error("Invalid token format", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // const fetchChats = async () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const userId = jwtDecode(token).userId;
  //       const chatList = await getChats(userId); // Fetch chats from API
  //       setChats(chatList);
  //     } catch (error) {
  //       console.error("Error fetching chats:", error);
  //     }
  //   }
  // };

  // Refresh the chat list when a new chat is created
  const handleChatCreation = async (id) => {
    const created = await createChat(id, "null");
    console.log(created.message);
    if (created.message) {
      setCreateChat(created); // Store creation status
    }
  };

  const handleSelectChat = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  const handleCloseChatWindow = () => {
    setSelectedUserId(null);
    setSelectedUserName("");
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <ChatList
          onSelectUser={handleChatCreation} // Pass function to handle user selection
          onSelectChat={handleSelectChat}
          refreshChat={chatCreated} // Pass the chat creation status to trigger refresh
        />
        {selectedUserId && (
          <ChatWindow
            userId={selectedUserId}
            name={selectedUserName}
            onClose={handleCloseChatWindow}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
