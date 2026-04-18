import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import type { LoginResponse } from "../../data/types/LoginResponse";
import type { TokenPayload } from "../../data/types/TokenPayload";
import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useMutation<
        LoginResponse,
        Error,
        { email: string; password: string }
    >({
        mutationFn: async (data: { email: string; password: string }) => {
            const res = await fetch("/api/auth/login", {
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

                localStorage.setItem("userId", payload.id);

                if (payload.isAdmin) {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>
                <strong className={styles.highlight}>Login</strong> to Your
                Account
            </h2>

            {loginMutation.isError && (
                <p className={styles.error}>{loginMutation.error.message}</p>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
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
                        disabled={loginMutation.isPending}
                        text={
                            loginMutation.isPending ? "Logging in..." : "Login"
                        }
                    />
                    <Button onClick={() => navigate(-1)} />
                </div>
            </form>
        </section>
    );
};

export default Login;
