import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getChats, getUser } from "../../api/chatApi";
import { FaUserCircle } from "react-icons/fa"; // Import a user icon from react-icons
import styles from "./ChatList.module.css";

const ChatList = ({ onSelectChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserAndChats = async () => {
      try {
        const userId = await getUser();

        const chats = await getChats(userId);
        console.log("chats:", chats);

        const filteredChats = chats.map((chat) => {
          const otherUserId = chat.members.find(
            (memberId) => memberId !== userId
          );
          return { ...chat, otherUserId };
        });

        setUsers(filteredChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchUserAndChats();
  }, []);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.titleChat}>Chats</h3>
      <div className={styles.userListContainer}>
        {users.map((chat) => (
          <div
            key={chat.id}
            className={styles.userItem}
            onClick={() => onSelectChat(chat.otherUserId)}
          >
            {/* Avatar */}
            <div className={styles.avatar}>
              <FaUserCircle size={30} color="#888" />
            </div>
            {/* User Name (or ID if name isn't available) */}
            <div className={styles.userDetails}>
              <span className={styles.userName}> {chat.otherUserId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Prop validation
ChatList.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;
