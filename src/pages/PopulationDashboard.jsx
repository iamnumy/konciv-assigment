import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { fetchAndProcessPopulationData } from "../components/api/fetchData";
import { ThemeContext } from "../context/ThemeContext";
import LineChart from "../components/charts/LineChartPopulation";
import PopulationFilterPanel from "../components/filters/PopulationFilterPanel";
import GenderPopulationBarChart from "../components/charts/GenderPopulationBarChart.jsx";
import RegionTags from "../components/filters/RegionTags.jsx";
import StackedBarChart from "../components/charts/StackedBarChart.jsx";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";


const PopulationDashboard = () => {
    const { themeMode } = useContext(ThemeContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showLineChart, setShowLineChart] = useState(true);
    const [showStackedBarChart, setShowStackedBarChart] = useState(true);
    const [showGenderPopulationChart, setShowGenderPopulationChart] = useState(true);


    const [data, setData] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        region: [],
        age: [],
    });
    const [selectedFilters, setSelectedFilters] = useState({
        region: [],
        age: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dataset = await fetchAndProcessPopulationData("1078");
                setData(dataset);

                const regions = [...new Set(dataset.map((item) => item.region))];
                const ages = [...new Set(dataset.map((item) => item.age))];

                setFilterOptions({
                    region: regions,
                    age: ages,
                });
            } catch (error) {
                console.error("Error fetching population data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const totalPopulation = useMemo(() => {
        if (loading) return "Loading...";

        const populationEntries = data.filter(
            (item) =>
                item.metric === "Persons" &&
                item.value !== null &&
                !isNaN(Number(item.value))
        );

        if (populationEntries.length === 0) return "No data";

        const total = populationEntries.reduce(
            (sum, entry) => sum + Number(entry.value),
            0
        );
        return total.toLocaleString();
    }, [data, loading]);

    const malePopulation = useMemo(() => {
        if (loading) return "Loading...";

        const maleEntries = data.filter(
            (item) =>
                item.sex === "Males" &&
                item.metric === "Persons" &&
                item.value !== null
        );
        if (maleEntries.length === 0) return "No data";

        const totalMale = maleEntries.reduce((sum, entry) => sum + entry.value, 0);
        return totalMale.toLocaleString();
    }, [data, loading]);

    const femalePopulation = useMemo(() => {
        if (loading) return "Loading...";

        const femaleEntries = data.filter(
            (item) =>
                item.sex === "Females" &&
                item.metric === "Persons" &&
                item.value !== null
        );
        if (femaleEntries.length === 0) return "No data";

        const totalFemale = femaleEntries.reduce(
            (sum, entry) => sum + entry.value,
            0
        );
        return totalFemale.toLocaleString();
    }, [data, loading]);

    const filteredData = useMemo(() => {
        if (!selectedFilters.region.length) return [];
        return data.filter((item) => selectedFilters.region.includes(item.region));
    }, [data, selectedFilters]);

    const chartData = useMemo(() => {
        const ageGroups = [...new Set(filteredData.map((item) => item.age))];
        const regionData = selectedFilters.region.map((region, index) => {
            const regionData = filteredData.filter((item) => item.region === region);
            return {
                label: region,
                data: ageGroups.map((age) => {
                    const ageData = regionData.find((item) => item.age === age);
                    return ageData ? ageData.value : 0;
                }),
                borderColor: `hsl(${(index * 60) % 360}, 100%, 50%)`,
                backgroundColor: `hsla(${(index * 60) % 360}, 100%, 50%, 0.2)`,
                tension: 0.4,
                fill: true,
            };
        });

        return {
            labels: ageGroups,
            datasets: regionData,
        };
    }, [filteredData, selectedFilters]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                backgroundColor: "#1e1e1e",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Age Group",
                    color: themeMode === "dark" ? "#ffffff" : "#121212",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Population",
                    color: themeMode === "dark" ? "#ffffff" : "#121212",
                },
                beginAtZero: true,
            },
        },
    };

    const handleFilterChange = (newFilters) => {
        setSelectedFilters(newFilters);
    };

    const handleClearFilters = () => {
        setSelectedFilters({
            region: [],
            age: "",
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
            <Container
                maxWidth={isMobile ? false : "xl"}
                sx={{
                    width: "90%",
                    pb: 4,
                    backgroundColor: "background.default",
                    color: "text.primary",
                    overflowX: "hidden",
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    align="left"
                    sx={{
                        mt: 2,
                        mb: 2,
                        color: themeMode === "dark" ? "#ffffff" : "primary.main",
                        fontWeight: "bold",
                    }}
                >
                    Population 2024
                </Typography>

                <Grid container spacing={3} sx={{ mb: 2 }}>
                    {[
                        {
                            title: "Total Population",
                            value: totalPopulation,
                            color: "#1a73e8",
                            recommendation: "A growing population may require increased housing and infrastructure development.",
                        },
                        {
                            title: "Male Population",
                            value: malePopulation,
                            color: "#1a73e8",
                            recommendation: "Gender-based employment programs can ensure equal economic participation.",
                        },
                        {
                            title: "Female Population",
                            value: femalePopulation,
                            color: "#e91e63",
                            recommendation: "A rise in female population highlights the need for better childcare and workplace policies.",
                        },
                    ].map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    p: 2,
                                    backgroundColor: "background.paper",
                                    height: isMobile ? "140px" : "180px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    boxShadow: 6,
                                    borderRadius: 3,
                                    transition: "transform 0.3s ease-in-out",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <CardContent sx={{ textAlign: "center" }}>
                                    <Typography
                                        variant={isMobile ? "subtitle1" : "h6"}
                                        sx={{ fontWeight: "bold", color: themeMode === "dark" ? "#ffffff" : card.color }}
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: "text.primary" }}>
                                        {card.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                                        {card.recommendation}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                </Grid>

                <Card
                    sx={{
                        mb: 2,
                        p: 3,
                        backgroundColor: "background.paper",
                        boxShadow: 3,
                    }}
                >
                    <PopulationFilterPanel
                        regionOptions={filterOptions.region}
                        ageOptions={filterOptions.age}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                </Card>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showLineChart}
                                onChange={() => setShowLineChart(!showLineChart)}
                                color="primary"
                            />
                        }
                        label="Line Chart"
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            },
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={showStackedBarChart}
                                onChange={() => setShowStackedBarChart(!showStackedBarChart)}
                                color="primary"
                            />
                        }
                        label="Stacked Bar Chart"
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            },
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={showGenderPopulationChart}
                                onChange={() => setShowGenderPopulationChart(!showGenderPopulationChart)}
                                color="primary"
                            />
                        }
                        label="Gender Population Chart"
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            },
                        }}
                    />
                </Box>


                {/* Adjusted spacing for mobile using responsive margin bottom */}
                <Box
                    sx={{
                        height: { xs: "350px", sm: "400px" },
                        overflow: "hidden",
                        mb: { xs: 2, sm: 3 },
                    }}
                >
                    <StackedBarChart data={data} selectedFilters={selectedFilters} />
                </Box>

                <Box
                    sx={{
                        height: { xs: "350px", sm: "400px" },
                        overflow: "hidden",
                        mb: { xs: 4, sm: 3 },
                    }}
                >
                    <LineChart chartData={chartData} chartOptions={chartOptions} />
                </Box>

                <Box
                    sx={{
                        height: { xs: "350px", sm: "400px" },
                        overflow: "hidden",
                        mb: { xs: 4, sm: 3 },
                    }}
                >
                    <GenderPopulationBarChart data={data} selectedFilters={selectedFilters} />
                </Box>

                {/* Reduced top margin for RegionTags on mobile */}
                <Box sx={{ mt: { xs: 4, sm: 4 } }}>
                    <RegionTags data={data} />
                </Box>
            </Container>
    );
};

export default PopulationDashboard;
