import { heroui } from "@heroui/theme";

export default heroui({
  defaultTheme: "light",
  themes: {
    light: {
      colors: {
        background: {
          DEFAULT: "#ffffff",
          foreground: "#111111",
          50: "#ffffff",
          100: "#f8fafc",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0f172a",
        },
        foreground: {
          DEFAULT: "#111111",
          foreground: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1f2937",
          900: "#0f172a",
        },
        primary: {
          DEFAULT: "#FF3D81",
          foreground: "#ffffff",

          50: "#FFF0F6",
          100: "#FFE3EE",
          200: "#FFC7DD",
          300: "#FF9FC2",
          400: "#FF6A9E",
          500: "#FF3D81", // 기준 색
          600: "#E63673",
          700: "#C92F63",
          800: "#A82652",
          900: "#8A1F45",
        },

        // 필요하면 secondary/success/warning/danger/default 등 추가
      },
    },
  },
});
