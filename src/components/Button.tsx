interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  styles?: string;
}

function Button({ children, onClick, styles = "" }: ButtonProps) {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      className={
        "mt-10 cursor-pointer rounded-md border px-5 py-2 text-center shadow-md " +
        styles
      }
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
