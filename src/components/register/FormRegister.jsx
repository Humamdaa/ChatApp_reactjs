import { useState } from "react";
import styles from "./FormRegister.module.css";
import handleRegisterForm from "../../services/register_helper/FormHandlerReg";
import Message from "../message/Message";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const [st, msg] = await handleRegisterForm(formData);
    if (st === 201) {
      console.log("here");
      navigate("/");
      setMessage(msg);
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
        <h1>Register</h1>
        <div className={styles.formField}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button className={styles.submitButton} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
