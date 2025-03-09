import axios from 'axios';

const API_URL = 'http://localhost:8080/api/steam';

const SteamService = {
    getSteamApp: async () => {
        try {
            const response = await axios.get(`${API_URL}/randomapp`);
            if (!response.data) {
                throw new Error('No data returned from the API');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching Steam app:', error);
            return null;
        }
    },

    getSteamAppById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/getapp/${id}`);
            if (!response.data) {
                throw new Error('No data returned from the API');
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching Steam app:', error);
            return null;
        }
    },
};

export default SteamService;