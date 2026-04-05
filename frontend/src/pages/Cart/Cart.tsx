import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../data/types/CartItem";
import styles from "./Cart.module.css";

const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("cart");
        setCart(stored ? JSON.parse(stored) : []);
    }, []);

    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    const getDeliveryRange = () => {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 7);

        const format = (date: Date) =>
            `${date.getDate()}.${date.getMonth() + 1}.`;

        return `${format(today)} - ${format(future)}`;
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Cart</h1>

            <div className={styles.warning_container}>
                <img
                    src="/src/assets/icons/warning.svg"
                    alt="warning"
                    className={styles.warning_icon}
                />
                <p className={styles.warning}>Products are not reserved</p>
            </div>

            <div className={styles.delivery_container}>
                <div className={styles.delivery_info}>
                    <p className={styles.delivery}>Delivery</p>
                    <p className={styles.deliverer}>Sends CART</p>
                </div>
                <div className={styles.delivery_time}>{getDeliveryRange()}</div>
            </div>

            {cart.length === 0 && <p>Cart is empty</p>}

            <div className={styles.table_container}>
                {cart.length > 0 && (
                    <table className={styles.items_table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Size</th>
                                <th>Color</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr
                                    key={`${item.productId}-${item.size}-${item.color}`}
                                >
                                    <td>{item.name}</td>
                                    <td>{item.price.toFixed(2)}€</td>
                                    <td>{item.size}</td>
                                    <td>{item.color}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {cart.length > 0 && (
                <div className={styles.total_container}>
                    <p className={styles.total}>
                        You Pay{" "}
                        <span className={styles.disclaimer}>PDV included</span>
                    </p>{" "}
                    <p className={styles.total}>{totalPrice.toFixed(2)} €</p>
                </div>
            )}

            <button onClick={() => navigate(-1)} className={styles.button}>
                Proceed to Checkout
            </button>
        </section>
    );
};

export default Cart;
