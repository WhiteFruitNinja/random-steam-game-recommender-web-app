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
    }
};

export default HistoryService;