import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getChats, getUser, getUsers } from "../../api/chatApi";
import { FaUserCircle } from "react-icons/fa";
import { useMessage } from "../../context/MessageContext";
import { io } from "socket.io-client";

import styles from "./ChatList.module.css";

const ChatList = ({ onSelectChat, onSelectUser, refreshChat }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [socket, setSocket] = useState(null);
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
          if (userId && merged) {
            const members = merged.map((chat) => chat.members).flat();
            setChats(members);
          }
        } catch (error) {
          console.log("Error fetching chats:", error);
        }
      };
      fetchUserAndChats();
    }
  }, [refreshChat, navigate, showMessage]);

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

  useEffect(() => {
    if (!chats) return;

    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.emit("online", localStorage.getItem("token"));

    return () => {
      newSocket.emit("leaveApp", localStorage.getItem("token"));
      newSocket.close();
    };
  }, [chats]);

  return (
    <div className={styles.chatList}>
      <div className={styles.userListContainer}>
        <h3 className={styles.titleChat}>Chats</h3>
        {chats &&
          chats.map((chat, userIds) => (
            <div
              key={userIds}
              className={styles.userItem}
              onClick={() => onSelectChat(chat.id, chat.name)}
            >
              <div className={styles.avatar}>
                <FaUserCircle size={30} color="#555" />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{chat.name}</span>
              </div>
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
};

export default ChatList;
