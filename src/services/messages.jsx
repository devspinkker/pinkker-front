import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/conversations';


export const getMessages = async (token, to) => {
    try {
        let response = await axios.get(`${url}/get_messages?to=${to}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling participateBet', error);
    }
}

export const getGeneralMessages = async (token) => {
    try {
        let response = await axios.get(`${url}/get_general_messages`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling participateBet', error);
    }
}


export const sendMessage = async (token, to, message) => {
    try {
        const res = await axios.post(`${url}/send_message`, {
            to, message
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling participateBet', error);
    }
}


export const getMessagesNotViewed = async (token) => {
    try {
        let response = await axios.get(`${url}/get_messages_not_viewed`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}