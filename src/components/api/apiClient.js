import axios from "axios";

/**
 * Fetch dataset from SSB JSON-Stat API
 * @param {string} datasetId - Dataset ID from the API
 * @returns {Promise<Object>} - JSON response or null if an error occurs
 */
export const fetchDataset = async (datasetId) => {
    const url = `https://data.ssb.no/api/v0/dataset/${datasetId}.json?lang=en`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching dataset ${datasetId}:`, error.message);
        return null;
    }
};
