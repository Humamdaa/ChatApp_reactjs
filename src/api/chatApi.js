// api.js
import axios from "axios";
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";

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

export const getUsers = () => {
  // Get the token from localStorage (assuming it's stored under 'token')
  const token = localStorage.getItem("token");

  // Send the request with the token in the Authorization header
  return axios
    .get(`${BASE_URL}/all/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token as 'Bearer <token>'
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error; // Rethrow the error for further handling
    });
};

export const createChat = async (firstId, secondId) => {
  // Get the token from localStorage (assuming it's stored under 'token')
  const token = localStorage.getItem("token");

  // Send the request with the token in the Authorization header
  try {
    const response = await axios.post(
      `${BASE_URL}/chat`,
      {
        firstId,
        secondId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token as 'Bearer <token>'
        },
      }
    );
    console.log("create chat:", response.data);
    return response.data;
  } catch (error) {
    console.log("creCha:", error);
    throw error;
  }
};

export const getChats = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token as 'Bearer <token>'
      },
    });
    const mergedChats = response.data;
    // console.log("me: ", mergedChats);
    return mergedChats.chats;
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
      console.log("errorapi: ", error);
      console.error("Error fetching messages:", error);
      throw error;
    });
};

// Open a specific chat between two users
export const openChatBetweenUsers = (user1Id, user2Id) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  if (!token) {
    console.error("No token found in localStorage");
    throw new Error("No token found");
  }

  return axios
    .post(
      `${BASE_URL}/find/${user1Id}/${user2Id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      }
    )
    .then((response) => response.data._id)
    .catch((error) => {
      console.log("errwindow: ", error);
      console.error("Error opening chat:", error);
      throw error;
    });
};

// Send a new message
export const sendMessage = (chatId, senderId, text) => {
  return axios
    .post(`${BASE_URL}/new/message`, {
      chatId,
      senderId,
      text,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error sending message:", error);
      throw error;
    });
};
