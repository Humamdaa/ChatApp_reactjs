import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState("");

  // Set token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken); // Update state with token from localStorage
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>
        <a href="/" className={styles.navBrandText}>
          ChatApp
        </a>
      </div>

      {/* Menu button only shows on small screens */}
      <button className={styles.menuButton} onClick={toggleMenu}>
        {menuOpen ? "Close" : "Menu"}
      </button>

      {/* Navigation links */}
      {!token && (
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
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
