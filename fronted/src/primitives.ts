import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight font-bold", //기본적으로 정해놓은 값들

  variants: {
    //바꿀 수 있는 값들
    size: {
      sm: "text-xl lg:text-2xl", //기본적으로 3xl, 화면이 lg 이상일 때는 4xl
      md: "text-23xl lg:text-3xl",
      lg: "text-3xl lg:text-4xl",
    },

    color: {
      foreground: "text-foreground",
      gradient: "bg-clip-text text-transparent bg-gradient-to-b",
    },

    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },

  defaultVariants: {
    //바꿀 수 있는 값들에 대해서 기본적으로 들어가는 값.
    size: "md",
    color: "foreground",
    align: "center",
  },
});

export const subtitle = tv({
  base: "tracking-tight font-bold",

  variants: {
    size: {
      sm: "text-sm lg:text-base",
      md: "text-base lg:text-lg",
      lg: "text-lg lg:text-xl",
    },

    color: {
      default: "text-gray-600",
      lighter: "text-gray-400",
    },

    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },

  defaultVariants: {
    size: "md",
    color: "default",
    align: "center",
  },
});

export const pointcolor =
  "bg-gradient-to-r from-[#FF6A00] via-[#FF4F5E] to-[#FF3D81]";

export const softGray =
  "bg-[radial-gradient(circle_at_center,#9aa1ad_0%,#8b92a0_45%,#7c8493_100%)]";
