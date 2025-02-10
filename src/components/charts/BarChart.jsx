import React, { useContext, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { ThemeContext } from "../../context/ThemeContext";
import zoomPlugin from "chartjs-plugin-zoom";
import { Button, Box, useTheme, useMediaQuery, Typography } from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const BarChart = ({ data }) => {
    const { themeMode } = useContext(ThemeContext); // Get current theme mode
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [isZoomed, setIsZoomed] = useState(false); // State to track zoom level
    const chartRef = useRef(null); // Ref for the chart instance

    if (!data.length) return <Typography>No data available</Typography>;

    const maleData = data
        .filter(
            (item) =>
                item.metric === "Unemployment rate (LFS)" &&
                item.value !== null &&
                item.sex === "Males"
        )
        .sort((a, b) => a.time.localeCompare(b.time));

    const femaleData = data
        .filter(
            (item) =>
                item.metric === "Unemployment rate (LFS)" &&
                item.value !== null &&
                item.sex === "Females"
        )
        .sort((a, b) => a.time.localeCompare(b.time));

    if (!maleData.length && !femaleData.length) {
        return <Typography>No data found for either males or females</Typography>;
    }

    const yearSet = new Set([
        ...maleData.map((item) => item.time.substring(0, 4)),
        ...femaleData.map((item) => item.time.substring(0, 4)),
    ]);
    const labels = Array.from(yearSet).sort((a, b) => a.localeCompare(b));
    const datasets = [];
    if (maleData.length) {
        datasets.push({
            label: "Male Unemployment Rate (%)",
            data: labels.map((year) => {
                const entry = maleData.find((item) => item.time.substring(0, 4) === year);
                return entry ? entry.value : null;
            }),
            backgroundColor: "#7367F0", // Color for male unemployment bars
            borderColor: "#7367F0", // Border color for male bars
            borderWidth: 1,
            barThickness: 15, // Adjust bar thickness
            categoryPercentage: 0.4, // Adjust category width percentage
            barPercentage: 0.9,
            offset: -10, // Offset to position male bars to the left
        });
    }
    if (femaleData.length) {
        datasets.push({
            label: "Female Unemployment Rate (%)",
            data: labels.map((year) => {
                const entry = femaleData.find((item) => item.time.substring(0, 4) === year);
                return entry ? entry.value : null;
            }),
            backgroundColor: "#EA5455", // Color for female unemployment bars
            borderColor: "#EA5455", // Border color for female bars
            borderWidth: 1,
            barThickness: 15, // Adjust bar thickness
            categoryPercentage: 0.4, // Adjust category width percentage
            barPercentage: 0.9,
            offset: 10, // Offset to position female bars to the right
        });
    }

    // Prepare the final chart data
    const chartDataFinal = {
        labels,
        datasets,
    };

    const textColor = themeMode === "dark" ? "#ffffff" : "#121212";
    const gridColor =
        themeMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allow resizing based on container size
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    font: { size: isMobile ? 12 : 16, weight: "bold" },
                },
            },
            tooltip: {
                backgroundColor: "#1e1e1e",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                cornerRadius: 6,
                padding: 12,
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: "xy",
                    onZoom: () => setIsZoomed(true),
                    onPan: () => setIsZoomed(true),
                },
                pan: {
                    enabled: true,
                    mode: "xy",
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: { size: isMobile ? 10 : 14 },
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
                grid: {
                    color: gridColor,
                },
            },
            y: {
                min: 0,
                max: 14, // Set Y-axis max value (percentage)
                ticks: {
                    color: textColor,
                    font: { size: isMobile ? 10 : 14 },
                    callback: (value) => value + "%",
                },
                grid: {
                    color: gridColor,
                },
            },
        },
    };

    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
            setIsZoomed(false);
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                height: isMobile ? "300px" : "400px",
                width: "100%",
                maxWidth: "100%",
                overflowX: "hidden",
            }}
        >
            <Bar ref={chartRef} data={chartDataFinal} options={options} />

            {/* Show the reset zoom button only when zoomed in */}
            {isZoomed && (
                <Button
                    variant="contained"
                    onClick={resetZoom}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                        borderRadius: "8px",
                        padding: "5px 15px",
                        opacity: 0.7,
                        "&:hover": { opacity: 1 },
                    }}
                >
                    Reset Zoom
                </Button>
            )}
        </Box>
    );
};

export default BarChart;
