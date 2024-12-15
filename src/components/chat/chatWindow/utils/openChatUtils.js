import { openChatBetweenUsers } from "../../../../api/chatApi";

// Asynchronous function to fetch chatId between users
export const openChat = async (anotherUserId, setChatId) => {
  try {
    const chatId = await openChatBetweenUsers(anotherUserId, "null"); // Pass `null` instead of "null"
    setChatId(chatId);
    return chatId;
  } catch (error) {
    console.error("Error fetching chatId:", error);
    return null; // Returning null in case of an error
  }
};
