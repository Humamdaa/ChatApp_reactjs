import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  getMessages,
  openChatBetweenUsers,
  sendMessage,
} from "../../api/chatApi";
import { io } from "socket.io-client"; // Import socket.io-client
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ userId, name, onClose }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [senderIds, setSenderIds] = useState([]);
  const [socket, setSocket] = useState(null); // State to store socket instance
  const messageInputRef = useRef(null); // Create a ref for the input field
  const messagesEndRef = useRef(null); // Ref for the messages container to scroll to the bottom

  // Fetch the chatId when the component mounts or userId changes
  useEffect(() => {
    const fetchChatId = async () => {
      try {
        const chatId = await openChatBetweenUsers(userId, "null");
        setChatId(chatId);
      } catch (error) {
        console.error("Error fetching chatId:", error);
      }
    };

    if (userId) {
      fetchChatId();
    }
  }, [userId]);

  // Fetch messages for the chatId
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const messagesData = await getMessages(chatId);
          const messageTexts = messagesData.map((message) => message.text);
          const senderIds = messagesData.map((message) => message.senderId);

          setSenderIds(senderIds);
          setMessages(messageTexts);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [chatId]);

  // Setup socket connection and listen for new messages
  useEffect(() => {
    if (!chatId) return; // If no chatId, don't setup socket

    const newSocket = io("http://localhost:5001"); // Connect to the server
    setSocket(newSocket); // Store the socket connection

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id); // Log the socket ID on connection
    });

    // Join the chat room based on chatId
    newSocket.emit("joinChat", chatId);
    
    // Listen for new messages in the chat and update state
    newSocket.on("newMessage", (message) => {
      console.log("Received new message from socket:", message);
      setMessages((prevMessages) => [...prevMessages, message.text]);
      setSenderIds((prevSenderIds) => [...prevSenderIds, message.senderId]);
    });

    // Cleanup: Leave the chat room and close socket on unmount
    return () => {
      newSocket.emit("leaveChat", chatId); // Optionally leave the chat room
      newSocket.close(); // Cleanup socket when the component unmounts
    };
  }, [chatId]);

  // Scroll to the bottom of the messages whenever new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // This effect runs every time messages change

  // Handle sending a new message
  const handleSendMessage = async () => {
    const newMessage = messageInputRef.current.value; // Get the input value using ref
    if (newMessage.trim() === "") return; // Don't send empty messages

    const senderId = userId; // Sender is the logged-in user

    try {
      // Save the message in the database
      const response = await sendMessage(chatId, senderId, newMessage);

      // Emit the new message to the server for real-time updates
      if (socket) {
        socket.emit("newMessage", {
          chatId,
          senderId,
          text: newMessage,
        });
      }

      // Update local state to immediately display the message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setSenderIds((prevSenderIds) => [...prevSenderIds, senderId]);
    } catch (error) {
      console.error("Failed to send message", error);
    }
    
    // Clear the message input field after sending
    messageInputRef.current.value = ""; // Clear input using ref
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <span className={styles.userName}>{name}</span>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
      <div className={styles.messages}>
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const senderId = senderIds[index];

            return senderId !== userId ? (
              <div key={index} className={styles.sender_message}>
                {msg}
              </div>
            ) : (
              <div key={index} className={styles.message}>
                {msg}
              </div>
            );
          })
        ) : (
          <div>No messages</div>
        )}
        {/* This is the ref that will ensure we scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.input}>
        <input
          type="text"
          ref={messageInputRef} // Attach ref to the input
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  userId: PropTypes.string.isRequired, // The logged-in userId
  name: PropTypes.string.isRequired, // User's name to display
  onClose: PropTypes.func.isRequired, // Function to close the chat window
};

export default ChatWindow;
