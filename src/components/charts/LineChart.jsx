import React, { useContext, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { ThemeContext } from "../../context/ThemeContext"; // ThemeContext import
import { Button, Box, Typography, useTheme, useMediaQuery } from "@mui/material"; // Material UI for buttons and hooks

// Register necessary ChartJS components and the zoom plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin // Register the zoom plugin
);

const LineChart = ({ data, selectedFilters, onClearFilters }) => {
    const { themeMode } = useContext(ThemeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const chartRef = useRef(null); // Ref for the chart instance
    const [isZoomed, setIsZoomed] = useState(false); // State to track zoom

    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    // Apply filters dynamically
    const filteredData = data
        .filter((item) =>
            item.metric === "Total employment (1000 persons)" &&
            (!selectedFilters.sex || item.sex === selectedFilters.sex) &&
            (!selectedFilters.age || item.age === selectedFilters.age) &&
            (!selectedFilters.adjustment || item.adjustment === selectedFilters.adjustment) &&
            item.value !== null &&
            (!selectedFilters.startYear || parseInt(item.time.substring(0, 4)) >= parseInt(selectedFilters.startYear)) &&
            (!selectedFilters.endYear || parseInt(item.time.substring(0, 4)) <= parseInt(selectedFilters.endYear))
        );

    // Sort data by time
    const sortedData = filteredData
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((item) => ({
            time: item.time.substring(0, 4), // Extract only the year
            value: item.value / 1000, // Convert to millions
        }));

    const labels = [...new Set(sortedData.map((item) => item.time))];

    // Chart Data
    const chartData = {
        labels,
        datasets: [
            {
                label: "Employment (millions)",
                data: labels.map((year) => {
                    const entry = sortedData.find((item) => item.time === year);
                    return entry ? entry.value : null;
                }),
                borderColor: themeMode === "dark" ? "#7367F0" : "#007AFF", // Dynamic color based on theme
                backgroundColor: themeMode === "dark" ? "rgba(115, 103, 240, 0.2)" : "rgba(0,122,255,0.2)",
                tension: 0.4, // Smooth line
                spanGaps: true,
            },
        ],
    };

    const textColor = themeMode === "dark" ? "#ffffff" : "#121212";
    const gridColor = themeMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    // Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top", // Adjusted legend position to top
                labels: {
                    color: textColor,
                    font: { size: 16, weight: "bold" },
                },
            },
            tooltip: {
                backgroundColor: "#1e1e1e",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true, // Enable zoom with mouse wheel
                    },
                    pinch: {
                        enabled: true, // Enable zoom with pinch gestures
                    },
                    mode: "xy", // Allow zooming on both axes
                    onZoom: () => setIsZoomed(true), // Set zoomed state to true
                    onPan: () => setIsZoomed(true), // Set zoomed state to true on pan
                },
                pan: {
                    enabled: true, // Enable panning
                    mode: "xy", // Allow panning on both axes
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: { size: 14 },
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
                grid: {
                    color: gridColor,
                },
            },
            y: {
                ticks: {
                    color: textColor,
                    font: { size: 14 },
                    callback: function (value) {
                        return value.toFixed(1) + "M";
                    },
                },
                grid: {
                    color: gridColor,
                },
            },
        },
    };

    // Reset Zoom Function
    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom(); // Reset zoom and pan
            setIsZoomed(false); // Reset zoomed state to false
        }
    };

    return (
        <div
            style={{
                position: "relative",
                height: isMobile ? "300px" : "400px", // Slightly shorter on mobile
                width: "100%",
                overflowX: "hidden", // Prevent any horizontal overflow
            }}
        >
            <Line ref={chartRef} data={chartData} options={options} />

            {/* Show the reset zoom button only when the chart is zoomed in */}
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
                        opacity: 0.6,
                        "&:hover": { opacity: 1 },
                    }}
                >
                    Reset Zoom
                </Button>
            )}
        </div>
    );
};

export default LineChart;
