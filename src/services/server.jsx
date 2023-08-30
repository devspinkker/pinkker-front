import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/server';


export const updateServer = async (token, register, login, settings, chat, purchase, directMessage, notifications, upload, muro, tendency, historyUsers, withdraw, bets, donations) => {
    try {
        const res = await axios.post(`${url}/updateServer`, {
            register, login, settings, chat, purchase, directMessage, notifications, upload, muro, tendency, historyUsers, withdraw, bets, donations
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling participateBet', error);
    }
}

export const getPinkkerStatistics = async (token) => {
    try {
        let response = await axios.get(`${url}/get_statistics`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling participateBet', error);
    }
}


export const getPrices = async (token) => {
    try {
        let response = await axios.get(`${url}/get_server_prices`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getPinkkerStatistics', error);
    }
}
