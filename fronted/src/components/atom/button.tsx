import * as React from "react";
import { Button } from "@heroui/react";
import { pointcolor } from "../../primitives";

type MyButtonProps = {
  color?: "primary" | "success" | "warning" | "default";
  variant?: "default" | "point" | "dark";
  label: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function MyButton({
  color = "primary",
  variant = "default",
  label,
  type = "button",
  onClick, // ✅ 추가: props에서 받기
}: MyButtonProps) {
  const className =
    variant === "point"
      ? `${pointcolor} text-white font-bold w-full`
      : variant === "dark"
        ? "bg-black text-white font-bold w-full"
        : "";

  return (
    <Button
      type={type}
      color={variant === "default" ? color : "default"}
      className={className}
      onPress={onClick} // ✅ 추가: HeroUI는 onPress 사용
    >
      {label}
    </Button>
  );
}
