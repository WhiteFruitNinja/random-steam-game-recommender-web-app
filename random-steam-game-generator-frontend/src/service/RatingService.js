import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const RatingService = {
    getAllRatings: async () => {
        const response = await axios.get(`${API_URL}/getratings`);
        return response.data;
    },

    getRatingById: async (id) => {
        const response = await axios.get(`${API_URL}/getrating/${id}`);
        return response.data;
    },

    getRatingsByUser: async (id) => {
        const response = await axios.get(`${API_URL}/getratings/${id}`);
        return response.data;
    },

    getRatingsBySteamAppId: async (steamAppId) => {
        const response = await axios.get(`${API_URL}/getratingsbysteamappid/${steamAppId}`);
        return response.data;
    },

    createRating: async (steamAppId, ratingValue, userId) => {
        try {
            const response = await axios.post(`${API_URL}/createrating`, {
                steamAppId,
                ratingValue,
                userId
            });
            return response.data; // Handle the response as needed
        } catch (error) {
            console.error("Error creating rating:", error);
            throw error; // Forward the error for handling upstream if needed
        }
    },

    updateRating: async (id, steamAppId, ratingValue, userId) => {
        try {
            const response = await axios.post(`${API_URL}/updaterating/${id}`, {
                id,
                steamAppId,
                ratingValue,
                userId
            });
            return response.data; // Handle the response as needed
        } catch (error) {
            console.error("Error creating rating:", error);
            throw error; // Forward the error for handling upstream if needed
        }
    },

    deleteRating: async (id) => {
        await axios.delete(`${API_URL}/deleterating/${id}`);
    },
};

export default RatingService;