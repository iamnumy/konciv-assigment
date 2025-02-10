import React, { useState } from "react";
import { Box, Chip, Grid, Typography, Pagination, useTheme, useMediaQuery, TextField } from "@mui/material";

const RegionTags = ({ data }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const regionsPerRow = isMobile ? 1 : 2;
    const rowsPerPage = isMobile ? 4 : 5;
    const itemsPerPage = regionsPerRow * rowsPerPage;

    const [searchQuery, setSearchQuery] = useState(""); // 👈 Search state
    const [page, setPage] = useState(1);

    // Process region populations
    const regionPopulations = data.reduce((acc, item) => {
        if (item.metric === "Persons" && item.value !== null) {
            if (!acc[item.region]) {
                acc[item.region] = 0;
            }
            acc[item.region] += item.value;
        }
        return acc;
    }, {});

    // Sort regions by population (descending)
    const sortedRegions = Object.entries(regionPopulations).sort((a, b) => b[1] - a[1]);

    // Filter regions based on search query
    const filteredRegions = sortedRegions.filter(([region]) =>
        region.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRegions = filteredRegions.slice(startIndex, endIndex);

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
                All Regions by Population
            </Typography>

            {/* 🔍 Search Input */}
            <TextField
                size="small"
                variant="outlined"
                placeholder="Search region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                    },
                }}
            />

            {/* Regions Grid */}
            <Grid container spacing={2}>
                {currentRegions.map((regionData, index) => {
                    const [region, population] = regionData;
                    return (
                        <Grid
                            item
                            xs={isMobile ? 12 : 6}
                            key={index}
                        >
                            <Chip
                                label={`${region}: ${population.toLocaleString()}`}
                                sx={{
                                    width: "100%",
                                    textAlign: "center",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-2px) scale(1.05)",
                                        boxShadow: 3,
                                    },
                                }}
                            />
                        </Grid>
                    );
                })}
            </Grid>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <Pagination
                    count={Math.ceil(filteredRegions.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    siblingCount={0}
                    boundaryCount={1}
                />
            </Box>
        </Box>
    );
};

export default RegionTags;
