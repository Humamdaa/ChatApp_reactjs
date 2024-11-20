// import ChatWindow from "../components/chat/ChatWindow"; // Import the ChatWindow component
import ChatList from "../components/chat/ChatList";
const Chat = () => {
  // Example chatId and otherUserId, you can replace this with dynamic values as needed
  // const chatId = "123";
  // const otherUserId = "456";

  return (
    <div>
      <ChatList />
      {/* <ChatWindow /> */}
    </div>
  );
};

export default Chat;
