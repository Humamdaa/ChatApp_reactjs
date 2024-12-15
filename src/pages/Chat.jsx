import { useEffect, useState } from "react";
import ChatList from "../components/chat/chatList/ChatList";
import ChatWindow from "../components/chat/chatWindow/ChatWindow";
import { createChat, getUser } from "../api/chatApi";
import useAuth from "../services/Token/useAuth";
import { io } from "socket.io-client";

const Chat = () => {
  const [selectedAnotherUserId, setSelectedAnotherUserId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [chatCreated, setCreateChat] = useState(null); // Store chat creation status
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [socket, setSocket] = useState(null); // Use socket state

  useAuth(socket, onlineUsers);

  // Check if user is online
  const checkOnlineUser = (id) => {
    if (onlineUsers.has(id)) console.log("user are online : ", onlineUsers);
    return onlineUsers.has(id);
  };

  // Refresh the chat list when a new chat is created
  const handleChatCreation = async (id) => {
    const created = await createChat(id, "null");
    if (created.message) {
      return setCreateChat(created); // Store creation status
    }
    return false;
  };

  const handleSelectChat = (userId, anotherUserId, userName) => {
    setUserId(userId);
    setSelectedAnotherUserId(anotherUserId);
    setSelectedUserName(userName);
  };

  const handleCloseChatWindow = (socket, chatId, anotherUserId) => {
    if (socket && chatId && anotherUserId) {
      socket.emit("leaveChat", chatId, anotherUserId);
      console.log(`${anotherUserId} leaving chat ${chatId} `);
    }
    setSelectedAnotherUserId(null);
    setSelectedUserName("");
  };

  // Fetch userId on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUser(); // Assuming getUser is a function that fetches the userId
      setUserId(userId); // Set userId to state
    };
    fetchUserId();
  }, []); // Empty dependency array ensures it runs once on mount

  useEffect(() => {
    if (userId && !socket) {
      // Only create a new socket connection if userId is available and socket is not yet initialized
      const newSocket = io("http://localhost:5001", {
        transports: ["websocket", "polling"], // Attempt both websocket and polling
        // timeout: 10000, // Connection timeout
      });

      // Set the socket instance to state
      setSocket(newSocket);

      // console.log("new: ", newSocket, "   ,try online wiht ", socket);
      // Emit 'online' event when the socket is connected

      // Log successful connection
      newSocket.on("connect", () => {
        // console.log("Connected to socket server with ID:", newSocket.id);

        newSocket.emit("online", userId); // Emit the online event with userId

        // Listen for 'onlineUsers' event to update the list of online users
        newSocket.on("onlineUsers", (users) => {
          // console.log("Received online users:", users);
          setOnlineUsers(new Set(users)); // Update state with the list of online users
        });
      });

      newSocket.on("leaveApp", (userId) => {
        // console.log("receive leave app from back");
        newSocket.emit("leaveApp", userId);
      }); // Emit 'leaveApp' to inform the server that the user is leaving

      // Cleanup the socket connection when component unmounts
      return () => {
        console.log("execute leaving");
        // newSocket.emit("leaveApp", userId); // Emit 'leaveApp' to inform the server that the user is leaving
        newSocket.close(); // Close the socket connection
        setSocket(null); // Reset socket state
      };
    }
  }, [userId]); // Only run this effect when `userId` changes

  return (
    <div>
      <div style={{ display: "flex" }}>
        <ChatList
          userId={userId}
          onSelectUser={handleChatCreation} // Pass function to handle user selection
          onSelectChat={handleSelectChat}
          refreshChat={chatCreated || false} // Pass the chat creation status to trigger refresh
          socket={socket} // Pass the socket instance as a prop
          onlineUsers={onlineUsers}
        />

        {selectedAnotherUserId && (
          <ChatWindow
            userId={userId}
            anotherUserId={selectedAnotherUserId}
            name={selectedUserName}
            onClose={handleCloseChatWindow}
            checkOnlineUser={checkOnlineUser}
            socket={socket} // Pass the socket instance as a prop
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
