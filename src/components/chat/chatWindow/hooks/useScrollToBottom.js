import { useEffect } from 'react';

/**
 * Custom hook to scroll to the bottom of the chat window
 * whenever the messages array changes.
 * @param {Array} messages - Array of message data.
 * @param {Object} messagesEndRef - Ref to the end of the message container.
 */
export const useScrollToBottom = (messages, messagesEndRef) => {
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Runs when messages change
};
