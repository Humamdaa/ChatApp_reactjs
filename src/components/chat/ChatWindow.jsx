import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getMessages, openChatBetweenUsers } from "../../api/chatApi"; // Assuming this API fetches chat messages
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ userId }) => {
  const [chatId, setChatId] = useState(null); // Ensure it's initialized with null, not undefined
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchChatId = async () => {
      try {
        const chatId = await openChatBetweenUsers(userId, "null"); // Pass `null` for secondId
        console.log("chatId: ", chatId);
        setChatId(chatId); // Update the chatId state
      } catch (error) {
        console.error("Error fetching chatId:", error);
      }
    };

    if (userId) {
      fetchChatId(); // Fetch chatId when the userId changes
    }
  }, [userId]); // Only run when userId changes

  // Effect 2: Fetch messages when chatId is set
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const messagesData = await getMessages(chatId); // Fetch messages for the chatId
          console.log("msgs: ", messagesData);
          setMessages(messagesData); // Set the fetched messages
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages(); // Fetch messages whenever chatId is updated
  }, [chatId]); // Only run when chatId changes

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", message: newMessage },
      ]);
      setNewMessage(""); // Clear the input after sending
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <div key={index} className={styles.message}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className={styles.input}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  userId: PropTypes.string.isRequired, // userId is required to fetch messages
};

export default ChatWindow;
