import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create a context for the message
const MessageContext = createContext();

// The provider component
export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  // Function to show message
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  // Function to clear the message
  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  return (
    <MessageContext.Provider
      value={{ message, messageType, showMessage, clearMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};

MessageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the message context
export const useMessage = () => {
  return useContext(MessageContext);
};
