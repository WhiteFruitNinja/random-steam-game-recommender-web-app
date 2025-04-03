import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const HistoryService = {
    getAllHistories: async () => {
        const response = await axios.get(`${API_URL}/gethistories`);
        return response.data;
    },

    getHistoryById: async (id) => {
        const response = await axios.get(`${API_URL}/gethistory/${id}`);
        return response.data;
    },

    getHistoriesByUser: async (id) => {
        const response = await axios.get(`${API_URL}/gethistories/${id}`);
        return response.data;
    },

    createHistory: async (steamAppId, userId) => {
        try {
            const response = await axios.post(`${API_URL}/createhistory`, {
                steamAppId, // key-value pairs in an object
                userId
            });
            return response.data; // Handle the response as needed
        } catch (error) {
            console.error("Error creating history:", error);
            throw error; // Forward the error for handling upstream if needed
        }
    }
};

export default HistoryService;