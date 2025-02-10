import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    Toolbar,
    Box,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { People, BarChart } from "@mui/icons-material"; // Using People for Labour Force
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ open, toggleSidebar }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const location = useLocation();
    const textColor =
        theme.palette.mode === "dark" ? "#ffffff" : theme.palette.text.primary;

    const tooltipDisabled = !isMobile && open;
    const drawerWidth = isMobile ? 60 : open ? 200 : 60;

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                transition: "width 0.3s ease-in-out",
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    overflowX: "hidden",
                    transition: "width 0.3s ease-in-out",
                },
            }}
        >
            <Toolbar />
            <List>
                <Tooltip title="Labour Force" disableHoverListener={tooltipDisabled}>
                    <ListItem
                        button
                        component={Link}
                        to="/"
                        selected={location.pathname === "/"}
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: theme.palette.action.selected,
                            },
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                            },
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                            }}
                        >
                            <People />
                        </ListItemIcon>
                        {open && (
                            <Box
                                component="span"
                                sx={{
                                    fontSize: "1rem",
                                    color: textColor,
                                    opacity: open ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            >
                                Labour Force
                            </Box>
                        )}
                    </ListItem>
                </Tooltip>
                <Tooltip title="Population" disableHoverListener={tooltipDisabled}>
                    <ListItem
                        button
                        component={Link}
                        to="/population"
                        selected={location.pathname === "/population"}
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: theme.palette.action.selected,
                            },
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                            },
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                            }}
                        >
                            <BarChart />
                        </ListItemIcon>
                        {open && (
                            <Box
                                component="span"
                                sx={{
                                    fontSize: "1rem",
                                    color: textColor,
                                    opacity: open ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            >
                                Population
                            </Box>
                        )}
                    </ListItem>
                </Tooltip>
            </List>
        </Drawer>
    );
};

export default Sidebar;