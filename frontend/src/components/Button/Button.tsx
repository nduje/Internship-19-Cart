import styles from "./Button.module.css";

interface ButtonProps {
    text?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
}

const Button = ({
    text = "Go back",
    onClick,
    type = "button",
    disabled = false,
    className = "",
}: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`${styles.button} ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;
