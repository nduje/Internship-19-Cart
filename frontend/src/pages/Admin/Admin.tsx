import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Admin.module.css";

const Admin = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <div className={styles.buttons_container}>
                <Link to="/admin/products" className={styles.navLink}>
                    Manage Products
                </Link>
                <Link to="/admin/categories" className={styles.navLink}>
                    Manage Categories
                </Link>
                <Link to="/admin/orders" className={styles.navLink}>
                    Manage Orders
                </Link>
                <Button onClick={() => handleSignOut()} text="Sign out" />
            </div>
        </section>
    );
};

export default Admin;
