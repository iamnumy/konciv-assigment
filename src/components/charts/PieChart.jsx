import React, { useContext, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ThemeContext } from "../../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, selectedFilters }) => {
    const { themeMode } = useContext(ThemeContext);

    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
        if (!selectedFilters || Object.keys(selectedFilters).length === 0 ||
            Object.values(selectedFilters).every(val => val === "" || val === undefined)) {
            selectedFilters = { ...selectedFilters, sex: "Both sexes" }; // Default filter for sex if none
        }
        return data.filter((item) => {
            return Object.keys(selectedFilters).every((key) => {
                if (!selectedFilters[key] || selectedFilters[key] === "") return true;

                if (key === "startYear" || key === "endYear") {
                    if (!selectedFilters.startYear || !selectedFilters.endYear) return true;
                    const year = parseInt(item.time.substring(0, 4), 10);
                    const startYear = parseInt(selectedFilters.startYear, 10);
                    const endYear = parseInt(selectedFilters.endYear, 10);
                    return year >= startYear && year <= endYear;
                }

                if (key === "sex" && selectedFilters.sex !== "") {
                    return item.sex === selectedFilters.sex; // Filter by selected sex
                }

                return item[key] === selectedFilters[key]; // For other filters
            });
        });
    }, [data, selectedFilters]);

    const availableYears = useMemo(() => {
        const years = filteredData.map((item) => parseInt(item.time.substring(0, 4), 10));
        return [...new Set(years)];
    }, [filteredData]);

    const latestYear = availableYears.length > 0 ? Math.max(...availableYears) : null;

    const latestYearData = useMemo(() => {
        if (!latestYear) return [];
        return filteredData.filter((item) => item.time.startsWith(latestYear.toString()));
    }, [filteredData, latestYear]);

    const categories = [
        "Labour force (1000 persons)",
        "Total employment (1000 persons)",
        "Unemployment (LFS) (1000 persons)",
    ];

    const categoryLabels = ["Labour force", "Employment", "Unemployment"];
    const colors = ["#7367F0", "#28C76F", "#EA5455"];

    const chartData = useMemo(() => {
        const dataset = categories.map((category) => {
            const categoryEntries = latestYearData.filter(
                (item) =>
                    item.metric === category &&
                    (selectedFilters.sex === "" || item.sex === selectedFilters.sex) && // Ensure sex filter is applied correctly
                    (selectedFilters.adjustment === "" || item.adjustment === selectedFilters.adjustment) // Ensure adjustment filter is applied correctly
            );

            const latestEntry =
                categoryEntries.length > 0
                    ? categoryEntries.sort((a, b) => b.time.localeCompare(a.time))[0].value * 1000 // Scale the value
                    : 0;

            return latestEntry;
        });

        return {
            labels: categoryLabels,
            datasets: [
                {
                    data: dataset,
                    backgroundColor: colors,
                    hoverOffset: 4,
                },
            ],
        };
    }, [latestYearData, selectedFilters]);

    const legendTextColor = themeMode === "dark" ? "#ffffff" : "#121212";
    const tooltipTextColor = themeMode === "dark" ? "#ffffff" : "#000000";
    const options = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: legendTextColor, // Use legendTextColor here
                    font: { size: 14 },
                },
            },
            tooltip: {
                titleColor: tooltipTextColor, // Use tooltipTextColor here
                bodyColor: tooltipTextColor,
            },
        },
    };

    return data.length === 0 ? <p>No data available</p> : <Pie data={chartData} options={options} />;
};

export default PieChart;
