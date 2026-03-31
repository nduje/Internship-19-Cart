import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.container}>
            <nav className={styles.navContainer}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.navLink} ${styles.active}`
                            : styles.navLink
                    }
                >
                    <img
                        src="/src/assets/icons/home.svg"
                        alt="home"
                        className={styles.image}
                    ></img>
                </NavLink>
                <NavLink
                    to="/search"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.navLink} ${styles.active}`
                            : styles.navLink
                    }
                >
                    <img
                        src="/src/assets/icons/search.svg"
                        alt="search"
                        className={styles.image}
                    ></img>
                </NavLink>
                <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.navLink} ${styles.active}`
                            : styles.navLink
                    }
                >
                    <img
                        src="/src/assets/icons/favorites.svg"
                        alt="favorites"
                        className={styles.image}
                    ></img>
                </NavLink>
                <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.navLink} ${styles.active}`
                            : styles.navLink
                    }
                >
                    <img
                        src="/src/assets/icons/cart.svg"
                        alt="cart"
                        className={styles.image}
                    ></img>
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.navLink} ${styles.active}`
                            : styles.navLink
                    }
                >
                    <img
                        src="/src/assets/icons/profile.svg"
                        alt="profile"
                        className={styles.image}
                    ></img>
                </NavLink>
            </nav>
        </footer>
    );
};

export default Footer;
