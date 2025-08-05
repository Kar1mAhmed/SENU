import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-blue text-white font-alexandria  rounded-full w-[139px] h-[39px] !text-[10px] font-semibold tracking-widest hover:bg-blue/90 transition-colors duration-300 flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
