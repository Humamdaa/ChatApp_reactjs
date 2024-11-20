export const setupLocalStorageCleanup = () => {
  // Function to clear localStorage
  const clearLocalStorage = () => {
    console.log("Clearing localStorage before the browser closes...");
    localStorage.clear(); // Clears all items in localStorage
  };

  // Add event listener to clear localStorage when the window is about to unload
  window.addEventListener("beforeunload", clearLocalStorage);

  // Cleanup event listener when the component unmounts
  return () => {
    window.removeEventListener("beforeunload", clearLocalStorage);
  };
};
