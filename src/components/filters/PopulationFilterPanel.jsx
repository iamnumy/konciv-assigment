import React from "react";
import { Autocomplete, TextField, Box, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

const PopulationFilterPanel = ({ regionOptions, ageOptions, selectedFilters, onFilterChange, onClearFilters }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Autocomplete multiple value={selectedFilters.region} onChange={(event, newValue) => onFilterChange({ ...selectedFilters, region: newValue })} options={regionOptions} renderInput={(params) => <TextField {...params} label="Select Regions" variant="outlined" />} fullWidth />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button variant="outlined" onClick={onClearFilters}>Clear Filters</Button>
            </Box>
        </Box>
    );
};

export default PopulationFilterPanel;
