import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DarkMode, LightMode, Menu } from "@mui/icons-material";
import { ThemeContext } from "../../context/ThemeContext";

const Header = ({ toggleSidebar }) => {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: isMobile ? 1 : 2,
                }}
            >
                {/* Sidebar toggle (only shows on mobile) */}
                <IconButton
                    color="inherit"
                    onClick={toggleSidebar}
                    size={isMobile ? "small" : "medium"}
                    edge="start"
                    sx={{ display: { xs: "block", sm: "none" } }} // Only show on mobile
                >
                    <Menu />
                </IconButton>

                {/* Title */}
                <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                        flexGrow: 1,
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Konciv Assignment
                </Typography>

                {/* Theme toggle */}
                <IconButton
                    color="inherit"
                    onClick={toggleTheme}
                    size={isMobile ? "small" : "medium"}
                    edge="end"
                >
                    {themeMode === "light" ? <DarkMode /> : <LightMode />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
