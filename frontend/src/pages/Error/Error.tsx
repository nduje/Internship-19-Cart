import { useNavigate } from "react-router-dom";
import styles from "./Error.module.css";

const Error = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.container}>
            <div onClick={() => navigate("/")} className={styles.close_button}>
                <img
                    src="/src/assets/icons/close.svg"
                    alt="close"
                    className={styles.close_icon}
                />
            </div>
            <div className={styles.message_container}>
                <div className={styles.warning_container}>
                    <img
                        src="/src/assets/icons/warning.svg"
                        alt="warning"
                        className={styles.warning_icon}
                    />
                </div>
                <p className={styles.message}>An error occurred</p>
            </div>
        </section>
    );
};

export default Error;
