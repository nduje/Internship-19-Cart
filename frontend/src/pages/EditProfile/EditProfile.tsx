import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import type { User } from "../../data/types/User";
import type { UsersResponse } from "../../data/types/UsersResponse";
import styles from "./EditProfile.module.css";

interface LocationState {
    fromRegister?: boolean;
}

const EditProfile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const location = useLocation();
    const state = location.state as LocationState;
    const fromRegister = state?.fromRegister;

    const [form, setForm] = useState<User>({
        addresses: [
            {
                type: "DELIVERY",
                street: "",
                city: "",
                postalCode: "",
                country: "",
            },
            {
                type: "BILLING",
                street: "",
                city: "",
                postalCode: "",
                country: "",
            },
        ],
        card: { iban: "", expiration: "", isct: "" },
    });

    const [loading, setLoading] = useState(false);

    const userQuery = useQuery<UsersResponse, Error>({
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

    useEffect(() => {
        if (!userQuery.data?.data) return;
        const user = userQuery.data.data;

        setForm({
            addresses: [
                {
                    id:
                        user.addresses?.find((a) => a.type === "DELIVERY")
                            ?.id || 0,
                    type: "DELIVERY",
                    street:
                        user.addresses?.find((a) => a.type === "DELIVERY")
                            ?.street || "",
                    city:
                        user.addresses?.find((a) => a.type === "DELIVERY")
                            ?.city || "",
                    postalCode:
                        user.addresses?.find((a) => a.type === "DELIVERY")
                            ?.postalCode || "",
                    country:
                        user.addresses?.find((a) => a.type === "DELIVERY")
                            ?.country || "",
                },
                {
                    id:
                        user.addresses?.find((a) => a.type === "BILLING")?.id ||
                        0,
                    type: "BILLING",
                    street:
                        user.addresses?.find((a) => a.type === "BILLING")
                            ?.street || "",
                    city:
                        user.addresses?.find((a) => a.type === "BILLING")
                            ?.city || "",
                    postalCode:
                        user.addresses?.find((a) => a.type === "BILLING")
                            ?.postalCode || "",
                    country:
                        user.addresses?.find((a) => a.type === "BILLING")
                            ?.country || "",
                },
            ],
            card: {
                iban: user.card?.iban || "",
                expiration: user.card?.expiration || "",
                isct: user.card?.isct || "",
            },
        });
    }, [userQuery.data]);

    const handleAddressChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "DELIVERY" | "BILLING",
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            addresses: prev.addresses.map((addr) =>
                addr.type === type ? { ...addr, [name]: value } : addr,
            ),
        }));
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, card: { ...prev.card, [name]: value } }));
    };

    const updateUserMutation = useMutation<UsersResponse, Error, User>({
        mutationFn: async (updatedUser) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users/me"] });
            navigate("/profile");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.card.expiration)) {
            alert("Expiration date must be in MM/YY format.");
            return;
        }

        if (!/^\d{1,3}$/.test(form.card.isct)) {
            alert("ISCT must be a maximum of 3 digits.");
            return;
        }

        const payload = {
            addresses: form.addresses,
            card: form.card,
        };

        setLoading(true);
        updateUserMutation.mutate(payload, {
            onSettled: () => setLoading(false),
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Profile</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section_container}>
                    <h2 className={styles.section_subtitle}>
                        Delivery Address
                    </h2>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Street</label>
                        <input
                            name="street"
                            placeholder="Street"
                            value={
                                form.addresses.find(
                                    (a) => a.type === "DELIVERY",
                                )?.street || ""
                            }
                            onChange={(e) => handleAddressChange(e, "DELIVERY")}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>City</label>
                        <input
                            name="city"
                            placeholder="City"
                            value={
                                form.addresses.find(
                                    (a) => a.type === "DELIVERY",
                                )?.city || ""
                            }
                            onChange={(e) => handleAddressChange(e, "DELIVERY")}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Postal Code</label>
                        <input
                            name="postalCode"
                            placeholder="Postal Code"
                            value={
                                form.addresses.find(
                                    (a) => a.type === "DELIVERY",
                                )?.postalCode || ""
                            }
                            onChange={(e) => handleAddressChange(e, "DELIVERY")}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Country</label>
                        <input
                            name="country"
                            placeholder="Country"
                            value={
                                form.addresses.find(
                                    (a) => a.type === "DELIVERY",
                                )?.country || ""
                            }
                            onChange={(e) => handleAddressChange(e, "DELIVERY")}
                            required
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.section_container}>
                    <h2 className={styles.section_subtitle}>Billing Address</h2>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Street</label>
                        <input
                            name="street"
                            placeholder="Street"
                            value={
                                form.addresses.find((a) => a.type === "BILLING")
                                    ?.street || ""
                            }
                            onChange={(e) => handleAddressChange(e, "BILLING")}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>City</label>
                        <input
                            name="city"
                            placeholder="City"
                            value={
                                form.addresses.find((a) => a.type === "BILLING")
                                    ?.city || ""
                            }
                            onChange={(e) => handleAddressChange(e, "BILLING")}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Postal Code</label>
                        <input
                            name="postalCode"
                            placeholder="Postal Code"
                            value={
                                form.addresses.find((a) => a.type === "BILLING")
                                    ?.postalCode || ""
                            }
                            onChange={(e) => handleAddressChange(e, "BILLING")}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Country</label>
                        <input
                            name="country"
                            placeholder="Country"
                            value={
                                form.addresses.find((a) => a.type === "BILLING")
                                    ?.country || ""
                            }
                            onChange={(e) => handleAddressChange(e, "BILLING")}
                            required
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.section_container}>
                    <h2 className={styles.section_subtitle}>Card</h2>
                    <div className={styles.input_container}>
                        <label className={styles.label}>IBAN</label>
                        <input
                            name="iban"
                            placeholder="IBAN"
                            value={form.card.iban}
                            onChange={handleCardChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>Expiration Date</label>
                        <input
                            name="expiration"
                            placeholder="MM/YY"
                            value={form.card.expiration}
                            onChange={handleCardChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.input_container}>
                        <label className={styles.label}>ISCT</label>
                        <input
                            name="isct"
                            placeholder="XXX"
                            value={form.card.isct}
                            onChange={handleCardChange}
                            required
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.buttons_container}>
                    <Button
                        type="submit"
                        disabled={loading}
                        text={loading ? "Saving..." : "Save"}
                    />
                    {!fromRegister && (
                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            text="Cancel"
                        />
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
