// api.js
import axios from "axios";

const BASE_URL = "http://127.0.0.1:5001";

export const getUser = () => {
  // Get the token from localStorage (assuming it's stored under 'token')
  const token = localStorage.getItem("token");

  // Send the request with the token in the Authorization header
  return axios
    .get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token as 'Bearer <token>'
      },
    })
    .then((response) => {
      return response.data.id;
    })
    .catch((error) => {
      throw error; // Rethrow the error for further handling
    });
};

export const getChats = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

// Fetch messages in a specific chat
export const getMessages = (chatId) => {
  return axios
    .get(`${BASE_URL}/msg/${chatId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching messages:", error);
      throw error;
    });
};

// Open a specific chat between two users
export const openChatBetweenUsers = (user1Id, user2Id) => {
  return axios
    .get(`${BASE_URL}/find/${user1Id}/${user2Id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error opening chat:", error);
      throw error;
    });
};

// Send a new message
export const sendMessage = (chatId, message) => {
  return axios
    .post(`${BASE_URL}/new/message`, {
      chatId,
      message,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error sending message:", error);
      throw error;
    });
};
