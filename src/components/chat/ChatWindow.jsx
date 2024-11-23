import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getMessages,
  openChatBetweenUsers,
  sendMessage,
} from "../../api/chatApi";
import styles from "./ChatWindow.module.css";

const ChatWindow = ({ userId, name, onClose }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [senderIds, setSenderIds] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Don't send empty messages

    // Check if senderId exists, if not find it from chat members
    const senderId = userId; // Assuming you already have the userId

    try {
      // Call the sendMessage function to send the message
      const response = await sendMessage(chatId, senderId, newMessage);
      console.log("Message sent:", response);
      // Optionally, you could also update the state to add the new message to the chat
    } catch (error) {
      console.error("Failed to send message", error);
    }

    // Clear the message input after sending
    setNewMessage("");
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <span className={styles.userName}>{name}</span>{" "}
        {/* Display the user name */}
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>{" "}
        {/* Close button */}
      </div>
      <div className={styles.messages}>
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const senderId = senderIds[index]; // Get the senderId for this message

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
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired, // userName prop
  onClose: PropTypes.func.isRequired, // onClose function
};

export default ChatWindow;
