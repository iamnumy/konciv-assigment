import React, { useMemo } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GenderPopulationBarChart = ({ data, selectedFilters }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const chartData = useMemo(() => {
        const ageGroups = [...new Set(data.map((item) => item.age))]; // Get unique age groups
        const filteredData = selectedFilters.region.length
            ? data.filter((item) => selectedFilters.region.includes(item.region))
            : data;

        const malePopulationData = ageGroups.map((age) =>
            filteredData
                .filter((item) => item.sex === 'Males' && item.age === age)
                .reduce((sum, item) => sum + (item.value || 0), 0)
        );

        const femalePopulationData = ageGroups.map((age) =>
            filteredData
                .filter((item) => item.sex === 'Females' && item.age === age)
                .reduce((sum, item) => sum + (item.value || 0), 0)
        );

        return {
            labels: ageGroups,
            datasets: [
                {
                    label: 'Male Population',
                    data: malePopulationData,
                    backgroundColor: '#1a73e8',
                },
                {
                    label: 'Female Population',
                    data: femalePopulationData,
                    backgroundColor: '#e91e63',
                },
            ],
        };
    }, [data, selectedFilters]);

    const options = useMemo(() => ({
        maintainAspectRatio: false, // Allow chart to fill the container's height
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Age Group',
                    font: { size: isMobile ? 10 : 12 },
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0,
                    font: { size: isMobile ? 8 : 10 },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Population',
                    font: { size: isMobile ? 10 : 12 },
                },
                beginAtZero: true,
                ticks: {
                    font: { size: isMobile ? 8 : 10 },
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: isMobile ? 8 : 10 },
                },
            },
            tooltip: {
                backgroundColor: '#1e1e1e',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                titleFont: { size: isMobile ? 10 : 12 },
                bodyFont: { size: isMobile ? 8 : 10 },
            },
        },
    }), [isMobile]);

    return <Bar data={chartData} options={options} />;
};

export default GenderPopulationBarChart;
