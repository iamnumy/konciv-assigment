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
    Legend,
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

const StackedBarChart = ({ data, selectedFilters }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const chartData = useMemo(() => {
        const ageGroups = [...new Set(data.map(item => item.age))];

        const maleDatasets = selectedFilters.region.map((region, index) => ({
            label: `${region} - Males`,
            data: ageGroups.map(age => {
                const record = data.find(
                    item => item.region === region && item.age === age && item.sex === "Males"
                );
                return record ? record.value : 0;
            }),
            backgroundColor: `hsla(${(index * 60) % 360}, 100%, 50%, 0.6)`,
            stack: region,
        }));

        const femaleDatasets = selectedFilters.region.map((region, index) => ({
            label: `${region} - Females`,
            data: ageGroups.map(age => {
                const record = data.find(
                    item => item.region === region && item.age === age && item.sex === "Females"
                );
                return record ? record.value : 0;
            }),
            backgroundColor: `hsla(${((index * 60 + 30) % 360)}, 100%, 50%, 0.6)`,
            stack: region,  // Same stack as the corresponding male dataset
        }));

        return {
            labels: ageGroups,
            datasets: [...maleDatasets, ...femaleDatasets],
        };
    }, [data, selectedFilters]);

    const options = useMemo(() => ({
        maintainAspectRatio: false, // Allow the chart to fill its container's height
        responsive: true,
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: "Age Group",
                    font: {
                        size: isMobile ? 10 : 12,
                    },
                },
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0,
                    maxTicksLimit: isMobile ? 6 : undefined,
                    font: {
                        size: isMobile ? 8 : 10,
                    },
                },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Population",
                    font: {
                        size: isMobile ? 10 : 12,
                    },
                },
                ticks: {
                    font: {
                        size: isMobile ? 8 : 10,
                    },
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: isMobile ? 8 : 10,
                    },
                },
            },
            tooltip: {
                backgroundColor: '#1e1e1e',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                titleFont: {
                    size: isMobile ? 10 : 12,
                },
                bodyFont: {
                    size: isMobile ? 8 : 10,
                },
            },
        },
    }), [isMobile]);

    return <Bar data={chartData} options={options} />;
};

export default StackedBarChart;
