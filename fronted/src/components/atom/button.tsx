import * as React from "react";
import { Button } from "@heroui/react";
import { pointcolor } from "../../primitives";

type MyButtonProps = {
  color?: "primary" | "success" | "warning" | "default";
  variant?: "default" | "point" | "dark";
  label: string;
  type?: "button" | "submit" | "reset";
};

// React 컴포넌트는 인자를 여러개 못 받음.
// // 렌더링 단위, 변경 감지, 비교 최적화를 하기 위해서 props 객체 하나로 이전 값 다음 값을 비교해야 하기 때문

export default function MyButton({
  color = "primary",
  variant = "default",
  label,
  type = "button",
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
    >
      {label}
    </Button>
  );
}
