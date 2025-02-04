import axios from 'axios';

const API_URL = 'http://localhost:8080/api/steam';

const SteamService = {
    getSteamApp: async () => {
        try {
            const response = await axios.get(`${API_URL}/randomApp`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Steam app:', error);
            return null;
        }
    },
};

export default SteamService;