import { useState } from "react";
import handleLoginForm from "../../services/login_helper/FormHandlerLog";
import Message from "../message/Message";
import { useMessage } from "../../context/MessageContext";
import styles from "./FormLogin.module.css";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { message, messageType, showMessage, clearMessage } = useMessage();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }

    const [st, msg] = await handleLoginForm(
      email,
      password,
      setError,
      setError
    );

    console.log(st);
    if (st === 200) {
      console.log("ok");
      showMessage(msg, "success");
      navigate("/");
    } else {
      setError(msg);
    }
  };

  const handleCloseMessage = () => {
    clearMessage();
    setError("");
  };

  return (
    <div className={styles.formContainer}>
      <h2>Login</h2>
      {/* Show global messages */}
      {message && (
        <Message
          message={message}
          type={messageType}
          onClose={handleCloseMessage}
        />
      )}
      {error && (
        <Message message={error} type="error" onClose={handleCloseMessage} />
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.submitButton} type="submit">
          Login
        </button>
      </form>
      <div className={styles.writing}>Don't have an account?</div>
      <Link to="/register" className={styles.loginLink}>
        {" "}
        Register here
      </Link>
    </div>
  );
};

export default LoginForm;
