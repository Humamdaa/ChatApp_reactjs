import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getChats, getUsers } from "../../../api/chatApi";
import { FaUserCircle } from "react-icons/fa";
// import { useMessage } from "../../../context/MessageContext";

import styles from "./ChatList.module.css";

const ChatList = ({
  userId,
  onSelectChat,
  onSelectUser,
  refreshChat,
  onlineUsers,
}) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const merged = await getChats(userId);
        if (userId && merged) {
          // console.log("userId in list : ", userId);
          const members = merged.map((chat) => chat.members).flat();
          setChats(members);
        }
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [refreshChat, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const AllUsers = await getUsers();
        if (AllUsers && Array.isArray(AllUsers.users)) {
          setUsers(AllUsers.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [navigate]);


  return (
    <div className={styles.chatList}>
      <div className={styles.userListContainer}>
        <h3 className={styles.titleChat}>Chats</h3>
        {chats &&
          chats.map((chat, userIds) => (
            <div
              key={userIds}
              className={styles.userItem}
              onClick={() => onSelectChat(userId, chat.id, chat.name)}
            >
              <div className={styles.avatar}>
                <FaUserCircle size={30} color="#555" />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{chat.name}</span>
              </div>
              <div
                className={`${styles.statusIndicator} ${
                  onlineUsers.has(chat.id) ? styles.online : ""
                }`}
              />
            </div>
          ))}
        <hr />
        <h3 className={styles.titleChat}>Users</h3>
        {users.map((user, index) => (
          <div
            key={index}
            className={styles.userItem}
            onClick={() => onSelectUser(user._id)}
          >
            <div className={styles.avatar}>
              <FaUserCircle size={30} color="#999" />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
            </div>
            <div
              className={`${styles.statusIndicator} ${
                onlineUsers.has(user._id) ? styles.online : ""
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

ChatList.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  refreshChat: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  onlineUsers: PropTypes.instanceOf(Set).isRequired,
};

export default ChatList;
