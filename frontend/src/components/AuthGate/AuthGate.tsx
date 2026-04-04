import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./AuthGate.module.css";

const AuthGate = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>
                Manage Your{" "}
                <strong className={styles.highlight}>Account</strong>
            </h2>
            <p className={styles.description}>
                Access your account. If you already have an account, log in. If
                not, register to get started.
            </p>
            <div className={styles.buttons_container}>
                <Button onClick={() => navigate("/login")} text="Login" />
                <Button onClick={() => navigate("/register")} text="Register" />
            </div>
            <Button onClick={() => navigate(-1)} />
        </section>
    );
};

export default AuthGate;
