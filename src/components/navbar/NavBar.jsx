import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import decodeToken from "../../services/Token/decodeToken";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  // Set token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      setName(decoded.name);
    }
  }, [navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    const storedToken = localStorage.getItem("token");
    
    // If there's no token, we can just proceed with local navigation
    if (!storedToken) {
      navigate("/login");
      return;
    }

    // Send logout request to server
    try {
      const response = await fetch("http://localhost:5001/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${storedToken}`, // Send the token as Authorization header
        },
      });

      // Check if logout was successful
      if (response.ok) {
        console.log("Logout successful");
        // Remove token from localStorage
        localStorage.removeItem("token");
        setToken(null);
        // Optionally, you can add a socket disconnect or other cleanup here
        navigate("/login");
      } else {
        console.error("Logout failed", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>
        <a href="/" className={styles.navBrandText}>
          ChatApp.
        </a>
        {token && <span className={styles.name}> Hi {name}</span>}
      </div>

      {!token ? (
        <button className={styles.menuButton} onClick={toggleMenu}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      ) : (
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <a href="/login" className={styles.navLink} onClick={handleLogout}>
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
