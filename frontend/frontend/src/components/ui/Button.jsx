import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// import Button from "./ui/Button";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-md",
  success:
    "bg-green-600 hover:bg-green-700 text-white shadow-md",
  outline:
    "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}) {
  return (
    <button
      className={twMerge(
        clsx(
          "px-5 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95",
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
}