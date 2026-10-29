import styles from './Button.module.css';
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'back' | 'position';
  type?: 'button' | 'submit';
}

function Button({ children, onClick, variant, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
