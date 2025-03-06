import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const UserService = {
    getAllUsers: async () => {
        const response = await axios.get(`${API_URL}/getlist`);
        return response.data;
    },

    loginUser: async (username, password) => {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response;
    },

    //loginUser: async (username, password) => {
    //    try {
    //        const response = await axios.post(`${API_URL}/login`, {
    //            username: username,
    //            password: password
    //        });
//
    //        if (response.status === 200) {
    //            const message = response.data;
    //            const loggedInUsername = message.substring("Logged in as ".length);
    //            return { userId: loggedInUsername };
    //        } else {
    //            throw new Error(response.data);
    //        }
    //    } catch (error) {
    //        throw error;
    //    }
    //},

    createUser: async (username, email, password) => {
        await axios.post(`${API_URL}/register`, username, email, password);
    },

    updateUser: async (id, user) => {
        await axios.post(`${API_URL}/update/${id}`, user);
    },

    deleteUser: async (id) => {
        await axios.delete(`${API_URL}/delete/${id}`);
    },

    getUserById: async (id) => {
        const response = await axios.get(`${API_URL}/get/${id}`);
        return response.data;
    }
};

export default UserService;