import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/notifications';


export const getNotifications = async (token) => {
    try {
        let response = await axios.get(`${url}/get_notifications`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}

export const getNotificationsNotViewed = async (token) => {
    try {
        let response = await axios.get(`${url}/get_notifications_not_viewed`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}

export const getNotificationsFriends = async (token, page, limit) => {
    try {
        let response = await axios.get(`${url}/get_notifications_friends?page=${page}&limit=${limit}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
        return error;
    }
}