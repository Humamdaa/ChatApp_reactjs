import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getMessages } from "../../api/chatApi"; // Assuming this API fetches chat messages
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await getMessages(userId); // Fetch chat messages for the user
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (userId) {
      fetchMessages(); // Fetch messages when a user is selected
    }
  }, [userId]); // Fetch messages when the userId changes

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", message: newMessage },
      ]);
      setNewMessage(""); // Clear input after sending
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

// Prop validation
ChatWindow.propTypes = {
  userId: PropTypes.string.isRequired, // userId should be passed as a prop
};

export default ChatWindow;
