import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const FavoriteService = {
    getAllFavorites: async () => {
        const response = await axios.get(`${API_URL}/getfavorites`);
        return response.data;
    },

    getFavoriteById: async (id) => {
        const response = await axios.get(`${API_URL}/getfavorite/${id}`);
        return response.data;
    },

    getFavoritesByUser: async (id) => {
        const response = await axios.get(`${API_URL}/getfavorites/${id}`);
        return response.data;
    },

    getFavoritesBySteamAppId: async (steamAppId) => {
        const response = await axios.get(`${API_URL}/getfavoritesbysteamappid/${steamAppId}`);
        return response.data;
    },

    createFavorite: async (steamAppId, userId) => {
        try {
            const response = await axios.post(`${API_URL}/createfavorite`, {
                steamAppId, // key-value pairs in an object
                userId
            });
            return response.data; // Handle the response as needed
        } catch (error) {
            console.error("Error creating favorite:", error);
            throw error; // Forward the error for handling upstream if needed
        }
    },

    deleteFavorite: async (id) => {
        await axios.delete(`${API_URL}/deletefavorite/${id}`);
    },
};

export default FavoriteService;