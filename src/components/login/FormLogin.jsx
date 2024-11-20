import { useState } from "react";
import handleLoginForm from "../../services/login_helper/FormHandlerLog";
import Message from "../message/Message";
import styles from "./FormLogin.module.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage
    );

    console.log(st);
    if (st === 200) {
      console.log("ok");
      setMessage(msg);
      navigate("/");
    } else {
      setError(msg);
    }
  };

  const handleCloseMessage = () => {
    setMessage("");
    setError("");
  };

  return (
    <div className={styles.formContainer}>
      <h2>Login</h2>

      {message && (
        <Message
          message={message}
          type="success"
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
    </div>
  );
};

export default LoginForm;
