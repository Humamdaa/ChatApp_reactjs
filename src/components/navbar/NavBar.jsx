import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  
  // Set token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Remove the token from localStorage and set state to null
    localStorage.removeItem("token");
    setToken(null);
    // Optionally, navigate to login or home page
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>
        <a href="/" className={styles.navBrandText}>
          ChatApp
        </a>
      </div>

      {!token ? (
        <button className={styles.menuButton} onClick={toggleMenu}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      ) : (
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <a href="/" className={styles.navLink} onClick={handleLogout}>
            Logout
          </a>
        </div>
      )}

      {!token && menuOpen && (
        <div className={styles.navLinks}>
          <a href="/login" className={styles.navLink}>
            Login
          </a>
          <a href="/register" className={styles.navLink}>
            Register
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
