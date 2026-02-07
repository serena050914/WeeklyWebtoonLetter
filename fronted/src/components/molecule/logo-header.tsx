import * as React from "react";
import { title, subtitle } from "../../primitives";
import MyIcon from "../atom/logo-icon";

type LogoHeaderProps = {
  iconLabel?: string;
  iconVariant?: "default" | "point" | "dark";

  titleText?: string;
  subtitleText?: string;
};

export default function LogoHeader({
  iconLabel,
  iconVariant = "default",
  titleText,
  subtitleText,
}: LogoHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-2">
      <MyIcon label={iconLabel ?? ""} variant={iconVariant} />

      <h1 className={title({ size: "sm", align: "center" })}>{titleText}</h1>

      <p
        className={subtitle({ size: "sm", align: "center", color: "default" })}
      >
        {subtitleText}
      </p>
    </div>
  );
}
