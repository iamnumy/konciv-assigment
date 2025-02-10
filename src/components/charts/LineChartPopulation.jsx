import React, { useRef, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Button, Box, useTheme, useMediaQuery } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const LineChartPopulation = ({ chartData, chartOptions }) => {
    const chartRef = useRef(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const containerHeight = isMobile ? "500px" : "400px";

    const transformedChartData = useMemo(() => {
        if (!chartData || !chartData.labels) return chartData;
        return {
            ...chartData,
            labels: chartData.labels.map((label) =>
                label.replace(" years", "").trim()
            ),
        };
    }, [chartData]);

    const responsiveOptions = useMemo(() => ({
        maintainAspectRatio: false,
        responsive: true,
        ...chartOptions,
        plugins: {
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
            legend: {
                position: "top",
                labels: {
                    font: { size: isMobile ? 8 : 10 },
                },
                ...chartOptions.plugins?.legend,
            },
            tooltip: {
                backgroundColor: "#1e1e1e",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
                titleFont: { size: isMobile ? 10 : 12 },
                bodyFont: { size: isMobile ? 8 : 10 },
                ...chartOptions.plugins?.tooltip,
            },
        },
        scales: {
            x: {
                display: true,
                stacked: chartOptions.scales?.x?.stacked || false,
                title: {
                    display: true,
                    text: "Age Group",
                    font: { size: isMobile ? 10 : 12 },
                    color: theme.palette.text.primary,
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    font: { size: isMobile ? 8 : 10 },
                    color: theme.palette.text.primary,
                },
                grid: {
                    color:
                        theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                },
            },
            y: {
                display: true,
                stacked: chartOptions.scales?.y?.stacked || false,
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Population",
                    font: { size: isMobile ? 10 : 12 },
                    color: theme.palette.text.primary,
                },
                ticks: {
                    font: { size: isMobile ? 8 : 10 },
                    color: theme.palette.text.primary,
                },
                grid: {
                    color:
                        theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                },
            },
        },
    }), [chartOptions, isMobile, theme]);

    const resetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
            setIsZoomed(false);
        }
    };

    return (
        <Box sx={{ position: "relative", height: containerHeight, width: "100%" }}>
            <Line data={transformedChartData} options={responsiveOptions} ref={chartRef} />
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
        </Box>
    );
};

export default LineChartPopulation;
