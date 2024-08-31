const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO;



export async function getEarningsDay(token, fecha) {
    try {
        const response = await axios.get(
            `${baseURL}/streamers/earnings/day?day=${fecha}`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function getEarningsWeek(token,fecha) {
    try {
        const response = await axios.get(
            `${baseURL}/streamers/earnings/week?week=${fecha}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function getEarningsMonth(token, fecha) {
    try {
        const response = await axios.get(
            `${baseURL}/streamers/earnings/month?month=${fecha}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function GetDailyEarningsForMonth(token, fecha) {
    try {
        const response = await axios.get(
            `${baseURL}/streamers/earnings/GetDailyEarningsForMonth?month=${fecha}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function getEarningsYear(fecha) {
    try {
        const response = await axios.get(
            `${baseURL}/streamers/earnings/year?year=${fecha}`
        );
        return response.data;
    } catch (error) {
        return error;
    }
}
export async function getEarningsRangeDates(dateStart, dateEnd) {
    try {
        const response = await axios.get(
            `${baseURL}/streamers/60d5ecb92e2b6e6a3b9c631c/earnings/range?startDate=${dateStart}&endDate=${dateEnd} `
        );
        return response.data;
    } catch (error) {
        return error;
    }
}