import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import {
    Container,
    Button,
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { fetchAndProcessEmploymentData } from "../components/api/fetchData";
import FilterPanel from "../components/filters/FilterPanel";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import { ThemeContext } from "../context/ThemeContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { OpenAI } from "openai";
import TextField from "@mui/material/TextField"; // For chatbot input
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"; // Chat icon
import CloseIcon from "@mui/icons-material/Close"; // Close icon
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
require("dotenv").config();


const Dashboard = () => {
    const { themeMode } = useContext(ThemeContext);
    const [data, setData] = useState([]);
    const dashboardRef = useRef(null);
    const [filterOptions, setFilterOptions] = useState({
        sex: [],
        age: [],
        adjustment: [],
        year: [],
        metric: [],
    });
    const [selectedFilters, setSelectedFilters] = useState({
        sex: "",
        age: "",
        adjustment: "",
        startYear: "",
        endYear: "",
        metric: "",
    });
    const [loading, setLoading] = useState(true);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
    const [isExporting, setIsExporting] = useState(false);
    const [showLineChart, setShowLineChart] = useState(true);
    const [showPieChart, setShowPieChart] = useState(true);
    const [showBarChart, setShowBarChart] = useState(true);


    useEffect(() => {
        const loadData = async () => {
            const dataset = await fetchAndProcessEmploymentData("1054");
            setData(dataset);

            const uniqueValues = (key) => [...new Set(dataset.map((item) => item[key]))];
            const years = [...new Set(dataset.map((item) => item.time.substring(0, 4)))];

            setFilterOptions({
                sex: uniqueValues("sex"),
                age: uniqueValues("age"),
                adjustment: uniqueValues("adjustment"),
                year: years,
                metric: uniqueValues("metric"),
            });

            setLoading(false);
        };

        loadData();
    }, []);

    const openai = new OpenAI({
        apiKey: "Your-open-ai",
        dangerouslyAllowBrowser: true, // Allow usage in the browser (Only for testing)
    });

    const [userQuery, setUserQuery] = useState("");
    const [chatResponse, setChatResponse] = useState("");
    const [chatOpen, setChatOpen] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);


    const filteredData = useMemo(() => {
        if (loading) return [];

        return data.filter((item) => {
            return Object.keys(selectedFilters).every((key) => {
                if (!selectedFilters[key] || selectedFilters[key] === "") return true;

                if (key === "sex") {
                    if (selectedFilters.sex === "Both sexes") return true;
                    return item.sex === selectedFilters.sex;
                }

                if (key === "startYear" || key === "endYear") {
                    if (!selectedFilters.startYear || !selectedFilters.endYear) return true;
                    const year = parseInt(item.time, 10);
                    const startYear = parseInt(selectedFilters.startYear, 10);
                    const endYear = parseInt(selectedFilters.endYear, 10);
                    return year >= startYear && year <= endYear;
                }

                return item[key] === selectedFilters[key];
            });
        });
    }, [data, selectedFilters, loading]);

    const totalWorkforce = useMemo(() => {
        const workforceEntries = filteredData.filter(
            (item) =>
                item.metric === "Labour force (1000 persons)" && item.value !== null
        );
        if (workforceEntries.length === 0) return "No data";

        const latestEntry = workforceEntries.sort((a, b) =>
            b.time.localeCompare(a.time)
        )[0];
        return (latestEntry.value * 1000).toLocaleString();
    }, [filteredData]);

    const totalEmployment = useMemo(() => {
        const employmentEntries = filteredData.filter(
            (item) =>
                item.metric === "Total employment (1000 persons)" && item.value !== null
        );
        if (employmentEntries.length === 0) return "No data";

        const latestEntry = employmentEntries.sort((a, b) =>
            b.time.localeCompare(a.time)
        )[0];
        return (latestEntry.value * 1000).toLocaleString();
    }, [filteredData]);

    const unemploymentRate = useMemo(() => {
        const unemploymentEntries = filteredData.filter(
            (item) =>
                item.metric === "Unemployment rate (LFS)" && item.value !== null
        );
        if (unemploymentEntries.length === 0) return "No data";

        const latestEntry = unemploymentEntries.sort((a, b) =>
            b.time.localeCompare(a.time)
        )[0];
        return `${latestEntry.value.toFixed(1)}%`;
    }, [filteredData]);

    const barChartData = useMemo(() => {
        const { metric, ...otherFilters } = selectedFilters;
        return data.filter((item) => {
            return Object.keys(otherFilters).every((key) => {
                if (!otherFilters[key] || otherFilters[key] === "") return true;
                if (key === "startYear" || key === "endYear") {
                    if (!otherFilters.startYear || !otherFilters.endYear) return true;
                    const year = parseInt(item.time, 10);
                    const startYear = parseInt(otherFilters.startYear, 10);
                    const endYear = parseInt(otherFilters.endYear, 10);
                    return year >= startYear && year <= endYear;
                }
                return item[key] === otherFilters[key];
            });
        });
    }, [data, selectedFilters]);


    const fetchAIResponse = async () => {
        setLoadingChat(true);
        setChatResponse("");

        try {
            const response = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-large", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: userQuery }),
            });

            const result = await response.json();
            setChatResponse(result[0].generated_text || "Sorry, I couldn't process your request.");
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setChatResponse("An error occurred. Please try again.");
        } finally {
            setLoadingChat(false);
        }
    };



    const handleDownloadPdf = async () => {
        setIsExporting(true); // Hide button and filters

        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay to allow UI update

        const element = dashboardRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("dashboard.pdf");

        setIsExporting(false); // Show button and filters again
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
        <div ref={dashboardRef}>
        <Container
            maxWidth="xl"
            sx={{
                pb: isMobile ? 2 : 4,
                backgroundColor: "background.default",
                color: "text.primary",
                overflowX: "hidden",
            }}
        >
            <Typography
                variant={isMobile ? "h5" : "h4"}
                align="left"
                sx={{
                    width: "90%",
                    mt: 2,
                    mb: 2,
                    color: themeMode === "dark" ? "#ffffff" : "primary.main",
                    fontWeight: "bold",
                }}
            >
                Labour Force
            </Typography>


            {!isExporting && (
                <Box sx={{ p: 2, textAlign: "right" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadPdf}
                        sx={{
                            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // Smaller font for mobile
                            padding: { xs: "4px 8px", sm: "6px 12px", md: "8px 16px" }, // Adjust padding
                            minWidth: { xs: "100px", sm: "120px", md: "150px" }, // Set minimum width
                        }}
                    >
                        Download PDF
                    </Button>
                </Box>
            )}


            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
                {[
                    {
                        title: "Total Workforce",
                        value: totalWorkforce,
                        color: "primary.main",
                        recommendation: "Higher workforce participation may indicate economic stability.",
                    },
                    {
                        title: "Total Employment",
                        value: totalEmployment,
                        color: "primary.main",
                        recommendation: "A rising employment rate suggests economic growth and stability.",
                    },
                    {
                        title: "Unemployment Rate",
                        value: unemploymentRate,
                        color: "secondary.main",
                        recommendation:
                            unemploymentRate > "5%"
                                ? "High unemployment suggests the need for job-creation policies."
                                : "Low unemployment indicates economic stability.",
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

            {!isExporting && (
                <Card
                    sx={{
                        mb: 2,
                        p: isMobile ? 2 : 3,
                        backgroundColor: "background.paper",
                        boxShadow: 3,
                    }}
                >
                    <FilterPanel filters={filterOptions} onFilterChange={setSelectedFilters} />
                </Card>
            )}

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
                            checked={showPieChart}
                            onChange={() => setShowPieChart(!showPieChart)}
                            color="primary"
                        />
                    }
                    label="Pie Chart"
                    sx={{
                        "& .MuiTypography-root": {
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        },
                    }}
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={showBarChart}
                            onChange={() => setShowBarChart(!showBarChart)}
                            color="primary"
                        />
                    }
                    label="Bar Chart"
                    sx={{
                        "& .MuiTypography-root": {
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        },
                    }}
                />
            </Box>



            {!chatOpen && (
                <IconButton
                    onClick={() => setChatOpen(true)}
                    sx={{
                        position: "fixed",
                        bottom: { xs: 200, sm: 20 }, // Adjust for mobile
                        right: { xs: 15, sm: 20 }, // Adjust for mobile
                        zIndex: 9999,
                        backgroundColor: "primary.main",
                        color: "#fff",
                        boxShadow: 3,
                        width: { xs: 45, sm: 50 }, // Slightly increase size on mobile
                        height: { xs: 45, sm: 50 },
                        display: "flex", // Ensure visibility
                        justifyContent: "center",
                        alignItems: "center",
                        "& svg": {
                            fontSize: { xs: "1.8rem", sm: "2rem" }, // Increase icon size for mobile
                        },
                        "&:hover": { backgroundColor: "primary.dark" },
                    }}
                >
                    <ChatBubbleOutlineIcon />
                </IconButton>
            )}


            {/* Chat Box */}
            {chatOpen && (
                <Box
                    sx={{
                        position: "fixed",
                        bottom: { xs: 200, sm: 20 },
                        right: { xs: 10, sm: 20 },
                        width: { xs: "70%", sm: "300px" },
                        maxWidth: "350px",
                        backgroundColor: "background.paper",
                        boxShadow: 3,
                        p: 2,
                        borderRadius: 2,
                        zIndex: 9999,
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontSize={{ xs: "1rem", sm: "1.25rem" }}>AI Assistant</Typography>
                        <IconButton onClick={() => setChatOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <TextField
                        fullWidth
                        placeholder="Ask about trends..."
                        variant="outlined"
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && fetchAIResponse()}
                        sx={{ mt: 1, fontSize: { xs: "0.85rem", sm: "1rem" } }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={fetchAIResponse}
                        sx={{
                            mt: 1,
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                            padding: { xs: "6px 10px", sm: "8px 16px" },
                        }}
                    >
                        Ask AI
                    </Button>

                    {loadingChat ? (
                        <CircularProgress sx={{ mt: 2 }} size={24} />
                    ) : (
                        chatResponse && (
                            <Box sx={{ mt: 2, p: 1, backgroundColor: "grey.100", borderRadius: 1 }}>
                                <Typography variant="body2" fontSize={{ xs: "0.85rem", sm: "1rem" }}>
                                    {chatResponse}
                                </Typography>
                            </Box>
                        )
                    )}
                </Box>
            )}

            <Grid container spacing={3}>
                {/* Show Line Chart if toggled on */}
                {showLineChart && (
                    <Grid item xs={12} sm={12} md={6}>
                        <LineChart data={filteredData} selectedFilters={selectedFilters} />
                    </Grid>
                )}

                {/* Show Pie Chart if toggled on */}
                {showPieChart && (
                    <Grid item xs={12} sm={12} md={6}>
                        <PieChart data={filteredData} selectedFilters={selectedFilters} />
                    </Grid>
                )}

                {/* Show Bar Chart if toggled on */}
                {showBarChart && (
                    <Grid item xs={12}>
                        <BarChart data={barChartData} />
                    </Grid>
                )}
            </Grid>

        </Container>
        </div>
    );
};

export default Dashboard;
