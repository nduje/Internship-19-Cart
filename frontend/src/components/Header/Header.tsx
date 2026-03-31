import styles from "./Header.module.css";

const Header = () => {
    return (
        <header className={styles.container}>
            <div className={styles.logoContainer}>
                <img
                    src="src/assets/icons/logo.svg"
                    alt="cart"
                    className={styles.logoIcon}
                />
                <label className={styles.logoLabel}>CART</label>
            </div>
            <img
                src="src/assets/icons/notification.svg"
                alt="notification"
                className={styles.notificationIcon}
            />
        </header>
    );
};

export default Header;
