import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { UsersResponse } from "../../data/types/UsersResponse";
import Button from "../Button/Button";
import styles from "./Account.module.css";

const Account = () => {
    const navigate = useNavigate();

    const usersQuery = useQuery<UsersResponse, Error>({
        queryKey: ["users/me"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3000/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },

        retry: false,
        refetchOnWindowFocus: false,
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const user = usersQuery.data?.data;
    const deliveryAddress = user?.addresses?.find(
        (addr) => addr.type === "DELIVERY",
    );
    const card = user?.card;

    return (
        <section className={styles.container}>
            <div className={styles.info_container}>
                <div className={styles.info_box}>
                    <img
                        src="/src/assets/icons/profile.svg"
                        alt="account"
                        className={styles.image}
                    />
                    <div className={styles.info}>
                        <p className={styles.text}>
                            <strong className={styles.highlight}>Ime: </strong>
                            {user?.name}
                        </p>

                        <p className={styles.text}>
                            <strong className={styles.highlight}>
                                Adresa:{" "}
                            </strong>
                            {deliveryAddress?.street}
                        </p>
                        <p className={styles.text}>
                            <strong className={styles.highlight}>
                                Mjesto:{" "}
                            </strong>
                            {deliveryAddress?.city &&
                            deliveryAddress?.postalCode &&
                            deliveryAddress?.country
                                ? `${deliveryAddress.city}, ${deliveryAddress.postalCode}, ${deliveryAddress.country}`
                                : ""}
                        </p>
                    </div>
                </div>

                <div className={styles.info_box}>
                    <img
                        src="/src/assets/icons/card.svg"
                        alt="card"
                        className={styles.image}
                    />
                    <div className={styles.info}>
                        <p className={styles.text}>
                            <strong className={styles.highlight}>IBAN: </strong>
                            {card?.iban}
                        </p>
                        <p className={styles.text}>
                            <strong className={styles.highlight}>
                                Datum isteka:{" "}
                            </strong>
                            {card?.expiration}
                        </p>
                        <p className={styles.text}>
                            <strong className={styles.highlight}>
                                ISCT kod:{" "}
                            </strong>
                            {card?.isct}
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.buttons_container}>
                <Button
                    onClick={() => navigate("/profile/edit")}
                    text="Edit Info"
                />

                <Button onClick={handleLogout} text="Logout" />
            </div>
        </section>
    );
};

export default Account;
