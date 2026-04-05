import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.container}>
            <input
                type="search"
                placeholder="Search for..."
                onFocus={() => navigate("/search")}
                className={styles.searchbar}
            />

            <h1 className={styles.title}>Welcome to Cart!</h1>
        </section>
    );
};

export default Home;
