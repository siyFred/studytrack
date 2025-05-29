import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};
const Button = ({ children, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-manrope ${className}`}
    >
      {children}
    </button>
  );
}
export default Button;