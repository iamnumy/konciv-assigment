import React, { useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const SIDEBAR_WIDTH_OPEN = 0;
    const SIDEBAR_WIDTH_CLOSED = 0;
    const HEADER_HEIGHT = 50;

    return (
        <Box sx={{ overflowX: "hidden" }}>
            <Header
                toggleSidebar={toggleSidebar}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100
                }}
            />

            <Box sx={{ display: "flex", pt: `${HEADER_HEIGHT}px` }}>
                <Sidebar
                    open={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: "grid",
                        width: "100%",
                        p: 2,
                        transition: "margin 0.3s ease-in-out",
                        marginLeft: isMobile
                            ? `${SIDEBAR_WIDTH_CLOSED}px`
                            : sidebarOpen
                                ? `${SIDEBAR_WIDTH_OPEN}px`
                                : `${SIDEBAR_WIDTH_CLOSED}px`,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
