export const checkUserInChat = (userId, chatId, chatUsers) => {
  if (chatUsers[chatId]) {
    return chatUsers[chatId].includes(userId);
  }
  return false;
};
