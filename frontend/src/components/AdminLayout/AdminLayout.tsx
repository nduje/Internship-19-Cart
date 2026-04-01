import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./AdminLayout.module.css";

const AdminLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link to="/admin" className={styles.navLink}>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                </Link>

                <nav className={styles.nav}>
                    <NavLink to="/admin" className={styles.navLink}>
                        Home
                    </NavLink>
                    <NavLink to="/admin/products" className={styles.navLink}>
                        Products
                    </NavLink>
                    <NavLink to="/admin/categories" className={styles.navLink}>
                        Categories
                    </NavLink>
                    <NavLink to="/admin/orders" className={styles.navLink}>
                        Orders
                    </NavLink>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    );
};

export default AdminLayout;
