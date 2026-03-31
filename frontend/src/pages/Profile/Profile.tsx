import { Link, useNavigate } from "react-router-dom";
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
                        <Link to="/login" className={styles.button}>
                            Login
                        </Link>
                        <Link to="/register" className={styles.button}>
                            Register
                        </Link>
                    </>
                ) : (
                    <button onClick={handleLogout} className={styles.button}>
                        Logout
                    </button>
                )}
            </div>
            <div onClick={() => navigate(-1)} className={styles.button}>
                Go back
            </div>
        </section>
    );
};

export default Profile;
