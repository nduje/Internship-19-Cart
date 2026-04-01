import type { PropsWithChildren } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import styles from "./Layout.module.css";

interface LayoutProps extends PropsWithChildren {
    showHeader?: boolean;
    showFooter?: boolean;
}

const Layout = ({
    showHeader = false,
    children,
    showFooter = true,
}: LayoutProps) => {
    return (
        <div className={styles.container}>
            {showHeader && <Header />}
            <main className={styles.main}>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};

export default Layout;
