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

            <article className={styles.items}>
                <div
                    onClick={() => navigate(`/search?category=Formal`)}
                    className={styles.item}
                >
                    <img
                        src="/src/assets/images/products/black_pants.svg"
                        alt="formal"
                        className={styles.item_image}
                    />
                    <h3 className={styles.item_name}>Suit up and explore</h3>
                </div>
                <div
                    onClick={() => navigate(`/search?category=Casual`)}
                    className={styles.item}
                >
                    <img
                        src="/src/assets/images/products/hoodie.svg"
                        alt="casual"
                        className={styles.item_image}
                    />
                    <h3 className={styles.item_name}>Chill vibes ahead</h3>
                </div>
                <div
                    onClick={() => navigate(`/search?category=Sport`)}
                    className={styles.item}
                >
                    <img
                        src="/src/assets/images/products/jersey.svg"
                        alt="sport"
                        className={styles.item_image}
                    />
                    <h3 className={styles.item_name}>Gear up, game on</h3>
                </div>
                <div
                    onClick={() => navigate(`/search?category=Streetwear`)}
                    className={styles.item}
                >
                    <img
                        src="/src/assets/images/products/tiger_mexico_66.svg"
                        alt="streetwear"
                        className={styles.item_image}
                    />
                    <h3 className={styles.item_name}>Street style unlocked</h3>
                </div>
            </article>
        </section>
    );
};

export default Home;
