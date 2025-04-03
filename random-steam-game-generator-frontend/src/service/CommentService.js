import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const CommentService = {
    getAllComments: async () => {
        const response = await axios.get(`${API_URL}/getcomments`);
        return response.data;
    },

    getCommentById: async (id) => {
        const response = await axios.get(`${API_URL}/getcomment/${id}`);
        return response.data;
    },

    getCommentsByUser: async (id) => {
        const response = await axios.get(`${API_URL}/getcomments/${id}`);
        return response.data;
    },

    getCommentsBySteamAppId: async (steamAppId) => {
        const response = await axios.get(`${API_URL}/getcommentsbysteamappid/${steamAppId}`);
        return response.data;
    },

    createComment: async (steamAppId, message, userId) => {
        try {
            const response = await axios.post(`${API_URL}/createcomment`, {
                steamAppId, // key-value pairs in an object
                message,
                userId
            });
            return response.data; // Handle the response as needed
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error; // Forward the error for handling upstream if needed
        }
    }
};

export default CommentService;