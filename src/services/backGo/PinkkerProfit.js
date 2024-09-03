const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO;

export const GetEarningsByMonth = async (token, month, code) => {
    try {
        const response = await axios.get(`${baseURL}/PinkkerProfit/GetEarningsByMonth`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { month, code },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching earnings by month", error);
        return { message: "error", error };
    }
};

// Función para obtener los ingresos en un rango de meses
export const GetEarningsByMonthRange = async (token, startDate, endDate, code) => {
    try {
        const response = await axios.get(`${baseURL}/PinkkerProfit/GetEarningsByMonthRange`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { start_date: startDate, end_date: endDate, code },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching earnings by month range", error);
        return { message: "error", error };
    }
};