import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MainLayout from "./components/layout/MainLayout";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import {ThemeContextProvider} from "./context/ThemeContext.jsx";
import PopulationDashboard from "./pages/PopulationDashboard.jsx";

const theme = createTheme({
    palette: {
        primary: { main: "#7367F0" },
        secondary: { main: "#EA5455" },
    },
    typography: { fontFamily: "Montserrat, sans-serif" },
});

function App() {
    return (
        <ThemeContextProvider>
            <Router>
                <MainLayout>
                    <Sidebar />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                    <Routes>
                        <Route path="/population" element={<PopulationDashboard />} />
                    </Routes>
                </MainLayout>
            </Router>
        </ThemeContextProvider>
    );
}

export default App;
