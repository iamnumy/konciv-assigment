import React, { useState } from "react";
import {
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Box,
    Typography,
    Button,
    FormHelperText, useMediaQuery
} from "@mui/material";
import theme from "../../styles/theme.js";

/**
 * Filter Panel Component
 * @param {Object} props
 * @param {Array} props.filters - Filter options extracted from dataset
 * @param {Function} props.onFilterChange - Callback to update filters
 */
const FilterPanel = ({ filters, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        sex: "",
        age: "",
        adjustment: "",
        startYear: "",
        endYear: "",
        metric: "",
    });

    const [errors, setErrors] = useState({
        startYear: "",
        endYear: "",
    });

    const [isValid, setIsValid] = useState(true); // This flag controls if the filter can be applied
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFilters = { ...selectedFilters, [name]: value };
        setSelectedFilters(updatedFilters);

        if (name === "startYear" || name === "endYear") {
            validateYears(updatedFilters.startYear, updatedFilters.endYear);
        }
    };

    const handleClearFilters = () => {
        const resetFilters = {
            sex: "",
            age: "",
            adjustment: "",
            startYear: "",
            endYear: "",
            metric: "",
        };
        setSelectedFilters(resetFilters);
        setErrors({
            startYear: "",
            endYear: "",
        });
        setIsValid(true); // Reset validity to true
        onFilterChange(resetFilters);
    };

    const validateYears = (startYear, endYear) => {
        let errorsObj = { startYear: "", endYear: "" };

        if (startYear && endYear && parseInt(startYear) > parseInt(endYear)) {
            errorsObj.startYear = "Start year cannot be greater than End year";
            errorsObj.endYear = "End year cannot be less than Start year";
            setIsValid(false); // Invalid, cannot apply the filter
        } else {
            setIsValid(true); // Valid, can apply the filter
        }

        setErrors(errorsObj);
    };

    const applyFilters = () => {
        if (isValid) {
            onFilterChange(selectedFilters); // Apply the filter only if valid
        }
    };

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            gap={3}
            justifyContent="center"
            sx={{ mt: 2 }}
        >
            {/* Sex Filter */}
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                <InputLabel shrink={selectedFilters.sex !== ""}>Gender</InputLabel>
                <Select
                    name="sex"
                    value={selectedFilters.sex}
                    onChange={handleChange}
                    label="Gender"
                >
                    <MenuItem value="">All</MenuItem>
                    {filters.sex
                        .filter(option => option !== "Both sexes")
                        .map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>


            {/* Age Filter */}
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                <InputLabel shrink={selectedFilters.age !== ""}>Age</InputLabel>
                <Select
                    name="age"
                    value={selectedFilters.age}
                    onChange={handleChange}
                    label="Age"
                >
                    <MenuItem value="">All</MenuItem>
                    {filters.age.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{ width: { xs: "100%", sm: "auto" } }}
            >
                <FormControl sx={{ minWidth: { xs: "100%", sm: 150 } }} error={!!errors.startYear}>
                    <InputLabel shrink={selectedFilters.startYear !== ""}>Start Year</InputLabel>
                    <Select
                        name="startYear"
                        value={selectedFilters.startYear}
                        onChange={handleChange}
                        label="Start Year"
                    >
                        <MenuItem value="">Select</MenuItem>
                        {filters.year.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                    {errors.startYear && <FormHelperText>{errors.startYear}</FormHelperText>}
                </FormControl>

                <Typography
                    variant="h6"
                    sx={{
                        alignSelf: "center",
                        display: { xs: "none", sm: "block" }
                    }}
                >
                    to
                </Typography>

                <FormControl sx={{ minWidth: { xs: "100%", sm: 150 } }} error={!!errors.endYear}>
                    <InputLabel shrink={selectedFilters.endYear !== ""}>End Year</InputLabel>
                    <Select
                        name="endYear"
                        value={selectedFilters.endYear}
                        onChange={handleChange}
                        label="End Year"
                    >
                        <MenuItem value="">Select</MenuItem>
                        {filters.year.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                    {errors.endYear && <FormHelperText>{errors.endYear}</FormHelperText>}
                </FormControl>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                    gap: 2
                }}
            >
                <Button
                    variant="outlined"
                    onClick={applyFilters}
                    disabled={!isValid}
                    fullWidth={isMobile}
                >
                    Apply Filters
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    fullWidth={isMobile}
                >
                    Clear Filters
                </Button>
            </Box>
        </Box>
    );
};

export default FilterPanel;
