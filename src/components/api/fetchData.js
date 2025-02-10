import { fetchDataset } from "./apiClient";

/**
 * Converts JSON-Stat format to a structured array of objects (for Employment data)
 * @param {Object} rawData - The dataset from SSB API
 * @returns {Array} - Processed dataset
 */
const transformEmploymentData = (rawData) => {
    if (!rawData || !rawData.dataset) {
        console.error("Invalid dataset structure:", rawData);
        return [];
    }

    const { dimension, value } = rawData.dataset;

    const getLabels = (dimKey) => {
        return dimension[dimKey]?.category?.label
            ? Object.values(dimension[dimKey].category.label)
            : [];
    };

    const sexLabels = getLabels("Kjonn"); // Sex
    const ageLabels = getLabels("Alder"); // Age
    const adjustmentLabels = getLabels("Justering"); // Type of Adjustment
    const timeLabels = getLabels("Tid"); // Month (e.g., "2006M01")
    const contentsLabels = getLabels("ContentsCode"); // Metrics

    if (!value || value.length === 0) {
        console.warn("Dataset contains no values.");
        return [];
    }

    const formattedData = [];
    let index = 0;

    for (let i = 0; i < sexLabels.length; i++) {
        for (let j = 0; j < ageLabels.length; j++) {
            for (let k = 0; k < adjustmentLabels.length; k++) {
                for (let l = 0; l < timeLabels.length; l++) {
                    for (let m = 0; m < contentsLabels.length; m++) {
                        formattedData.push({
                            sex: sexLabels[i],
                            age: ageLabels[j],
                            adjustment: adjustmentLabels[k],
                            time: timeLabels[l],
                            metric: contentsLabels[m],
                            value: value[index] ?? null,
                        });
                        index++;
                    }
                }
            }
        }
    }

    return formattedData;
};

/**
 * Converts JSON-Stat format to a structured array of objects (for Population data)
 * @param {Object} rawData - The dataset from SSB API
 * @returns {Array} - Processed dataset
 */
const transformPopulationData = (rawData) => {
    if (!rawData || !rawData.dataset) {
        console.error("Invalid dataset structure:", rawData);
        return [];
    }

    const { dimension, value } = rawData.dataset;

    // Helper function to extract category labels
    const getLabels = (dimKey) => {
        return dimension[dimKey]?.category?.label
            ? Object.values(dimension[dimKey].category.label)
            : [];
    };

    // Extract all necessary labels from the dataset
    const regionLabels = getLabels("Region"); // Region
    const sexLabels = getLabels("Kjonn"); // Sex
    const ageLabels = getLabels("Alder"); // Age
    const yearLabels = getLabels("Tid"); // Year
    const contentsLabels = getLabels("ContentsCode"); // Contents (e.g., "Persons")

    // If no values are found in the dataset, log a warning
    if (!value || value.length === 0) {
        console.warn("Dataset contains no values.");
        return [];
    }

    const formattedData = [];
    let index = 0;

    // Iterate over all possible combinations of Region, Sex, Age, Year, and Contents
    for (let i = 0; i < regionLabels.length; i++) {
        for (let j = 0; j < sexLabels.length; j++) {
            for (let k = 0; k < ageLabels.length; k++) {
                for (let l = 0; l < yearLabels.length; l++) {
                    for (let m = 0; m < contentsLabels.length; m++) {
                        // Populate the formattedData array with the corresponding values
                        formattedData.push({
                            region: regionLabels[i],
                            sex: sexLabels[j],
                            age: ageLabels[k],
                            year: yearLabels[l],
                            metric: contentsLabels[m],
                            value: value[index] ?? null, // Use null if the value is not available
                        });
                        index++;
                    }
                }
            }
        }
    }

    return formattedData;
};


/**
 * Fetch and transform Employment dataset from SSB API
 * @param {string} datasetId - Dataset ID for Employment data
 * @returns {Promise<Array>} - Processed dataset
 */
export const fetchAndProcessEmploymentData = async (datasetId) => {
    try {
        const rawData = await fetchDataset(datasetId);
        return transformEmploymentData(rawData);
    } catch (error) {
        console.error(`Error processing Employment dataset ${datasetId}:`, error);
        return [];
    }
};

/**
 * Fetch and transform Population dataset from SSB API
 * @param {string} datasetId - Dataset ID for Population data
 * @returns {Promise<Array>} - Processed dataset
 */
export const fetchAndProcessPopulationData = async (datasetId) => {
    try {
        const rawData = await fetchDataset(datasetId);
        return transformPopulationData(rawData);
    } catch (error) {
        console.error(`Error processing Population dataset ${datasetId}:`, error);
        return [];
    }
};
