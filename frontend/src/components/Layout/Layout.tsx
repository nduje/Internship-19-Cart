import type { PropsWithChildren } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

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
        <>
            {showHeader && <Header />}
            <main>{children}</main>
            {showFooter && <Footer />}
        </>
    );
};

export default Layout;
