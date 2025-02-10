import React, { createContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const ThemeContext = createContext();

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#7367F0" },
        secondary: { main: "#EA5455" },
        background: { default: "#f5f5f5", paper: "#ffffff" },
        text: { primary: "#121212" },
    },
    typography: {
        fontFamily: "Montserrat, sans-serif",
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#7367F0" },
        secondary: { main: "#EA5455" },
        background: { default: "#121212", paper: "#1e1e1e" },
        text: { primary: "#ffffff", secondary: "#b0b0b0" }, // White text
    },
    typography: {
        fontFamily: "Montserrat, sans-serif",
        allVariants: { color: "#ffffff" }, // Ensures all text is white
    },
});


export const ThemeContextProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const theme = themeMode === "light" ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
