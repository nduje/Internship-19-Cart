import { useNavigate } from "react-router-dom";
import styles from "./Success.module.css";

const Success = () => {
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
            <div className={styles.smile_container}>
                <img
                    src="/src/assets/icons/smile.svg"
                    alt="smile"
                    className={styles.smile_icon}
                />
            </div>
            <p className={styles.message}>Thank you for shopping with us</p>
        </section>
    );
};

export default Success;
