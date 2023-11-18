import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/history';



export const getStatsGlobal = async (token) => {
    try {
        let response = await axios.get(`${url}/stats_stream`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getStats', error);
    }
}

export const getStatsSpecificGlobal = async (token, type) => {
    try {
        let response = await axios.get(`${url}/stats_specific_global?type=${type}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getStatsSpecificGlobal', error);
    }
}




export const addHistoryAnnounce = async (token, announce) => {
    try {
        const res = await axios.post(`${url}/add_history_announce`, {
            announce
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling like', error);
    }
}
