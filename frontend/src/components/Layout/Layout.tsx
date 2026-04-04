import { useState, type PropsWithChildren } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Welcome from "../Welcome/Welcome";
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
    const [showWelcome, setShowWelcome] = useState(true);

    if (showWelcome) {
        return (
            <Welcome
                onFinish={() => {
                    setShowWelcome(false);
                }}
            />
        );
    }

    return (
        <div className={styles.container}>
            {showHeader && <Header />}
            <main className={styles.main}>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};

export default Layout;
