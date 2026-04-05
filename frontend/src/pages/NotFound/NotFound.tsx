import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./NotFound.module.css";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <p className={styles.message}>
                <strong className={styles.highlight}>Page missing</strong>, but
                our <strong className={styles.highlight}>deliveries</strong> are
                right on <strong className={styles.highlight}>time</strong>!
            </p>
            <Button onClick={() => navigate("/")} />
        </div>
    );
};

export default NotFound;
