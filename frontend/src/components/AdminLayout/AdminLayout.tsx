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
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                    >
                        Products
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                    >
                        Categories
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ""}`
                        }
                    >
                        Orders
                    </NavLink>
                </nav>
            </header>
            <main className={styles.main}>{children}</main>
        </div>
    );
};

export default AdminLayout;
