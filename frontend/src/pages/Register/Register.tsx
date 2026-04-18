import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import type { RegisterResponse } from "../../data/types/RegisterResponse";
import type { TokenPayload } from "../../data/types/TokenPayload";
import styles from "./Register.module.css";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const registerMutation = useMutation<
        RegisterResponse,
        Error,
        { name: string; email: string; password: string }
    >({
        mutationFn: async (data: {
            name: string;
            email: string;
            password: string;
        }) => {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            return res.json();
        },

        onSuccess: (response) => {
            const token = response.data.token;

            if (token) {
                localStorage.setItem("token", token);

                const payload = jwtDecode<TokenPayload>(token);
                if (payload.isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/profile/edit", {
                        state: { fromRegister: true },
                    });
                }
            }
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        registerMutation.mutate({ name, email, password });
    };

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>
                <strong className={styles.highlight}>Register</strong> New
                Account
            </h2>

            {registerMutation.isError && (
                <p className={styles.error}>{registerMutation.error.message}</p>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.input_container}>
                    <label className={styles.label}>Name</label>
                    <input
                        type="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.input_container}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.buttons_container}>
                    <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        text={
                            registerMutation.isPending
                                ? "Registering..."
                                : "Register"
                        }
                    />
                    <Button onClick={() => navigate(-1)} />
                </div>
            </form>
        </section>
    );
};

export default Register;
