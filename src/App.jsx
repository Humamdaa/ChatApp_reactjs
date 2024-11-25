import { Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import Chat from "./pages/Chat";
import NavBar from "./components/navbar/NavBar";
import SignUp from "./pages/Register";
import Login from "./pages/Login";
// import { setupLocalStorageCleanup } from "./services/clearLocalStorage";

function App() {
  // useEffect(() => {
  //   const cleanup = setupLocalStorageCleanup();

  //   // Clean up the event listener on component unmount
  //   return cleanup;
  // }, []);
  return (
    <>
      <NavBar />
      {/* <Container className="text-secondary"> */}
      <Routes>
        {<Route path="/" element={<Chat />} />}
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
      {/* </Container> */}
    </>
  );
}

export default App;
