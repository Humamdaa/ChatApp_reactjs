import { useEffect } from "react";
import { getMessages } from "../../../../api/chatApi"; // Import the API function

/**
 * Custom hook to fetch messages for a given chatId
 * @param {string} chatId - The chatId for fetching the messages.
 * @param {Function} setMessages - Function to update the state with message texts.
 * @param {Function} setSenderIds - Function to update the state with senderIds.
 * @param {Function} setMessageData - Function to update the state with full message data.
 */
export const useFetchMessages = (
  chatId,
  setMessages,
  setSenderIds,
  setMessageData
) => {
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const messagesData = await getMessages(chatId);
          if (messagesData) {
            setMessageData(messagesData);
            const messageTexts = messagesData.map((message) => message.text);
            const senderIds = messagesData.map((message) => message.senderId);

            setSenderIds(senderIds);
            setMessages(messageTexts);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [chatId, setMessages, setSenderIds, setMessageData]);
};
