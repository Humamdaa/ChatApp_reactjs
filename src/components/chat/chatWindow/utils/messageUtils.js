import { checkUserInChat } from "./checkUserInChatUtils";

export const handleSendMessage = async (
  messageInputRef,
  socket,
  userId,
  chatId,
  anotherUserId,
  checkOnlineUser,
  chatUsers
) => {
  const newMessage = messageInputRef.current.value;
  if (newMessage.trim() === "") return;

  try {
    console.log("socket: ", socket);
    console.log("anotherUserId:", anotherUserId);
    console.log("chatId:", chatId);

    if (socket && anotherUserId && chatId) {
      const checkInChatResult = checkUserInChat(
        anotherUserId,
        chatId,
        chatUsers
      );
      console.log("checkInChat result:", checkInChatResult);

      socket.emit("newMessage", {
        chatId,
        senderId: userId,
        text: newMessage,
        status: checkInChatResult
          ? "read"
          : checkOnlineUser(anotherUserId)
          ? "received"
          : "sent",
      });
    } else {
      console.error(
        "Missing required parameters: socket, anotherUserId, or chatId"
      );
    }
  } catch (error) {
    console.error("Failed to emit message", error);
  }

  messageInputRef.current.value = "";
};
