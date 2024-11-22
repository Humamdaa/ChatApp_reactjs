import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getChats, getUser } from "../../api/chatApi";
import { FaUserCircle } from "react-icons/fa";
import { useMessage } from "../../context/MessageContext";
import styles from "./ChatList.module.css";

const ChatList = ({ onSelectChat }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      showMessage("Please login to access this page.", "error");
      navigate("/login");
    } else {
      const fetchUserAndChats = async () => {
        try {
          const userId = await getUser();
          const merged = await getChats(userId);
          const members = merged.map((chat) => chat.members).flat();
          // console.log("memLis:", members);
          setUsers(members);
        } catch (error) {
          console.log("err:", error);
          console.error("Error fetching chats:", error);
        }
      };

      fetchUserAndChats();
    }
  }, [navigate, showMessage]);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.titleChat}>Chats</h3>
      <div className={styles.userListContainer}>
        {users.map((user, userIds) => (
          <div
            key={userIds}
            className={styles.userItem}
            onClick={() => onSelectChat(user.id)}
          >
            <div className={styles.avatar}>
              <FaUserCircle size={30} color="#888" />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ChatList.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatList;
