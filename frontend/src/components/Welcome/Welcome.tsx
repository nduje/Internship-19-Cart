import { useEffect } from "react";
import styles from "./Welcome.module.css";

const Welcome = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <img
                    src="/src/assets/icons/logo.svg"
                    alt="logo"
                    className={styles.logo}
                />
                <span className={styles.text}>CART</span>
            </div>
        </div>
    );
};

export default Welcome;
