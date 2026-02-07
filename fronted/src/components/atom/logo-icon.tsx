import * as React from "react";
import { pointcolor, softGray } from "../../primitives";

type MyIconProps = {
  label: string;
  variant?: "default" | "point" | "dark";
};

export default function MyIcon({ label, variant = "default" }: MyIconProps) {
  const className =
    variant === "point"
      ? `${pointcolor} text-white text-3xl`
      : variant === "dark"
        ? `${softGray} text-white text-3xl`
        : "bg-default-200 text-default-800 text-2xl";

  return (
    <div
      className={`flex justify-center items-center rounded-xl w-12 h-12 pb-1 shadow-xl ${className}`}
    >
      {label}
    </div>
  );
}
