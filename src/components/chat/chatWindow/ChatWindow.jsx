import { useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./ChatWindow.module.css";
import { useScrollToBottom } from "./hooks/useScrollToBottom";
import { useFetchMessages } from "./hooks/useFetchMessages";
import { useSocketHandler } from "./hooks/useSocketHandler";
import { handleSendMessage } from "./utils/messageUtils";
import { openChat } from "./utils/openChatUtils";

const ChatWindow = ({
  userId,
  anotherUserId,
  name,
  onClose,
  checkOnlineUser,
  socket,
}) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [senderIds, setSenderIds] = useState([]);
  const [messagesData, setMessageData] = useState([]);
  // const [socket, setSocket] = useState(null); // State to store socket instance
  const [chatUsers, setChatUsers] = useState({});
  const messageInputRef = useRef(null); // Create a ref for the input field
  const messagesEndRef = useRef(null); // Ref for the messages container to scroll to the bottom

  // Fetch the chatId when the component mounts or userId changes
  openChat(anotherUserId,setChatId);
  
  // Fetch messages for the chatId
  useFetchMessages(chatId, setMessages, setSenderIds, setMessageData);

  // Setup socket connection and listen for new messages
  useSocketHandler(
    socket,
    chatId,
    userId,
    setMessageData,
    setMessages,
    setSenderIds,
    setChatUsers
  );

  // Scroll to the bottom of the messages whenever new messages are added
  useScrollToBottom(messagesData, messagesEndRef);

  const getTickIcon = (status) => {
    if (status === "sent") {
      return "✓"; // Single tick for sent
    } else if (status === "received") {
      return "✓✓"; // Two ticks for received
    } else if (status === "read") {
      return "✓✓"; // Blue two ticks for read
    }
    return ""; // Default if no status is set
  };

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <span className={styles.userName}>{name}</span>
        <button
          className={styles.closeButton}
          onClick={() => onClose(socket, chatId, userId)}
        >
          X
        </button>
      </div>
      <div className={styles.messages}>
        {messagesData.length > 0 ? (
          messages.map((msg, index) => {
            const senderId = senderIds[index];
            const status = messagesData[index]
              ? messagesData[index].status
              : "sent";
            const tickIcon = getTickIcon(status); // Use getIcon to determine the tick icon

            return senderId !== userId ? (
              // Message from another user (left aligned)
              <div key={index} className={styles.sender_message}>
                {msg}
                {/* Optionally display the tick icon if needed */}
                {/* <span className={styles.messageStatus}>{tickIcon}</span> */}
              </div>
            ) : (
              // Message from the current user (right aligned)
              <div key={index} className={styles.message}>
                {msg}
                <span
                  className={`${styles.messageStatus} ${
                    status === "read"
                      ? styles.read
                      : status === "received"
                      ? styles.received
                      : styles.sent
                  }`}
                >
                  {tickIcon}
                </span>
              </div>
            );
          })
        ) : (
          <div>No messages</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.input}>
        <input type="text" ref={messageInputRef} placeholder="Type a message" />
        <button
          onClick={() =>
            handleSendMessage(
              messageInputRef,
              socket,
              userId,
              chatId,
              anotherUserId,
              checkOnlineUser,
              chatUsers
            )
          }
        >
          Send
        </button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  anotherUserId: PropTypes.string.isRequired, // The logged-in userId
  name: PropTypes.string.isRequired, // User's name to display
  onClose: PropTypes.func.isRequired, // Function to close the chat window
  checkOnlineUser: PropTypes.func.isRequired,
  socket: PropTypes.object,
};

export default ChatWindow;
