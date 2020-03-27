import { system } from "@theme-ui/presets";
import chroma from "chroma-js";
import { Theme } from "theme-ui";

export default {
  ...system,
  fonts: {
    fantasy: "pristina",
  },
  colors: {
    text: "#333",
    background: "white",
    primary: "#045aff",
    primary__hover: chroma("#045aff")
      .darken()
      .hex(),
    secondary: "#a6ffcb",
    accent: "#12d8fa",
    muted: "#7f90f6",
    border: "#b0b0b0",
    white: "#fdfdfd",
    black: "#0d0d0d",
    grey: {
      400: "#a2a2a2",
      500: "grey",
    },
    error: "red",
  },
  borderWidths: [1, 2, 4, 8],
  borderStyles: ["solid"],
  borderColor: "black",
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  styles: {
    ...system.styles,
    a: {
      color: "text",
      textDecoration: "underline",
      transition: "all 250ms ease-in-out",
      cursor: "pointer",

      "&:hover": {
        bg: "primary",
        color: "white",
      },
    },
  },
  buttons: {
    primary: {
      color: "white",
      bg: "primary",
      cursor: "pointer",
      transition: "background-color 100ms ease-in-out",
      "&:hover": {
        bg: "primary__hover",
      },
      m: 1,
    },
    disabled: {
      color: "white",
      bg: "muted",
      cursor: "not-allowed",
    },
    icon: {
      cursor: "pointer",
      transition: "color 100ms ease-in-out",
      "&:hover": {
        color: "border",
      },
      "&:active": {
        transform: "translateY(1px)",
      },
    },
    hanabi: {
      color: "white",
      bg: "#00897B",
      cursor: "pointer",
      transition: "background-color 100ms ease-in-out",
      "&:hover": {
        bg: "#00695C",
      },
      m: 1,
      fontSize: "12px",
    },
  },
  forms: {
    input: {
      padding: 2,
      boxSizing: "border-box",
    },
    textarea: {
      padding: 2,
      boxSizing: "border-box",
      "&:after": {
        content: "' '",
        height: 1,
      },
    },
  },
  alerts: {
    error: {
      bg: "darkred",
    },
  },
} as Theme;
