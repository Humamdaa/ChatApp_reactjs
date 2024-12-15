import { useEffect } from "react";

/**
 * Custom hook to scroll to the bottom of the chat window
 * whenever the messages array changes.
 * @param {Array} messages - Array of message data.
 * @param {Object} messagesEndRef - Ref to the end of the message container.
 */
export const useSocketHandler = (
  socket,
  chatId,
  userId,
  setMessageData,
  setMessages,
  setSenderIds,
  setChatUsers
) => {
  useEffect(() => {
    // Only set up socket if chatId exists
    if (!chatId) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    try {
      socket.emit("joinChat", chatId, userId);
    } catch (error) {
      console.error("Error emitting joinChat:", error);
    }

    socket.on("update_message_to_read", (updatedMessages) => {
      console.log("try update");

      // Extract _id from updatedMessages to perform the check
      const updatedMessageIds = updatedMessages.map((msg) => msg._id);

      setMessageData((prevMessages) => {
        return prevMessages.map((message) => {
          console.log("msg is ", message);

          // Check if the current message._id is in the list of updatedMessageIds
          if (updatedMessageIds.includes(message._id)) {
            console.log("Message marked as read", message.text);

            return { ...message, status: "read" }; // Update status to "read"
          }
          return message;
        });
      });
    });

    // Listen for confirmation from the server that the user joined the chat
    socket.on("userJoined", (data) => {
      const { chatId, usersInChat } = data;

      console.log("dataInJoined :", data);
      // Update the users for the specific chatId
      setChatUsers((prevChatUsers) => {
        return {
          ...prevChatUsers,
          [chatId]: usersInChat,
        };
      });
    });

    socket.on("userLeft", (data) => {
      const { chatId, usersInChat } = data;

      console.log("data left:", data);
      // Update the users for the specific chatId
      setChatUsers((prevChatUsers) => {
        return {
          ...prevChatUsers,
          [chatId]: usersInChat,
        };
      });
    });

    // Listen for new messages
    socket.on("newMessage", (message) => {
      // console.log("Received new message from socket:", message);

      // Update state when a new message is received
      setMessages((prevMessages) => [...prevMessages, message.text]);
      setSenderIds((prevSenderIds) => [...prevSenderIds, message.senderId]);
      // Keep that: when removed, the first message does not appear in real time
      setMessageData((prevMessagesData) => [...prevMessagesData, message]);
    });

    return () => {
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("newMessage");
    };
  }, [chatId, userId, socket]);
};
