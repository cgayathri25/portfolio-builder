import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/portfolios';

export const savePortfolio = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/save`, data);
        return response.data;
    } catch (error) {
        console.error("Error saving portfolio:", error);
        throw error;
    }
};

export const getPortfolioData = async (username) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
    }
};