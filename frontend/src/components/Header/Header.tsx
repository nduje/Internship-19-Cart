import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className={styles.container}>
            <div onClick={() => navigate("/")} className={styles.logoContainer}>
                <img
                    src="/src/assets/icons/logo.svg"
                    alt="cart"
                    className={styles.logoIcon}
                />
                <label className={styles.logoLabel}>CART</label>
            </div>
            <img
                src="/src/assets/icons/notification.svg"
                alt="notification"
                className={styles.notificationIcon}
            />
        </header>
    );
};

export default Header;
