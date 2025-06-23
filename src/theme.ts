"use client";
import { createTheme } from "@mui/material/styles";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#86937F",
    },
  },
  typography: {
    fontFamily: [poppins, '"sans-serif"'].join(","),
    fontSize: 14,
  },
});

export default theme;
