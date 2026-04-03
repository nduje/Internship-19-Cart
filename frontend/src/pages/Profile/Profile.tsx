import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Profile.module.css";

const Profile = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>
                Manage Your{" "}
                <strong className={styles.highlight}>Account</strong>
            </h2>
            <p className={styles.description}>
                {!isLoggedIn
                    ? "Access your account. If you already have an account, log in. If not, register to get started."
                    : "If you want to log in with a different account, please log out first."}
            </p>
            <div className={styles.buttons_container}>
                {!isLoggedIn ? (
                    <>
                        <Button
                            onClick={() => navigate("/login")}
                            text="Login"
                        />
                        <Button
                            onClick={() => navigate("/register")}
                            text="Register"
                        />
                    </>
                ) : (
                    <Button onClick={handleLogout} text="Logout" />
                )}
            </div>
            <Button onClick={() => navigate(-1)} />
        </section>
    );
};

export default Profile;
