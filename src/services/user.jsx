import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/user';


export const getAllUsersOnline = async (token) => {
    try {
        let response = await axios.get(`${url}/get_users_online`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}

export const getUserInfo = async (token, name) => {
    try {
        let response = await axios.get(`${url}/get_user/${name}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}

export const updateBiography = async (token, text, country, phone, website, sex, rDay, rMonth, rYear, sentimental) => {
    try {
        const res = await axios.post(`${url}/update_biography`, {
            text, country, phone, website, sex, rDay, rMonth, rYear, sentimental
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateBiography', error);
    }
}


export const updateColor = async (token, color) => {
    try {
        const res = await axios.post(`${url}/update_color`, {
            color
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateBiography', error);
    }
}


export const updateCustomAvatar = async (token) => {
    try {
        const res = await axios.post(`${url}/update_customavatar`, {
            
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateBiography', error);
    }
}


export const restoreKey = async (token) => {
    try {
        const res = await axios.post(`${url}/restore_key`, {
            
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateBiography', error);
    }
}

export const updateSubscriptionPrice = async (token, price) => {
    try {
        const res = await axios.post(`${url}/update_subscription_price`, {
            price
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateSubscriptionPrice', error);
    }
}

export const updateSocialnetwork = async (token, facebook, twitter, instagram, tiktok, twitch) => {
    try {
        const res = await axios.post(`${url}/update_socialnetwork`, {
            facebook, twitter, instagram, tiktok, twitch
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        return error.response;
    }
}