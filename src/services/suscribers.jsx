import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/suscription';


export const handleSuscription = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/handle_suscription`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling handleSuscription', error);
    }
}


export const giftSuscriptions = async (token, usersInRoom, quantity, streamer) => {
    try {
        const res = await axios.post(`${url}/gift_suscriptions`, {
            usersInRoom, quantity, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling giftSuscriptions', error);
    }
}


export const giftSuscription = async (token, userToSub, streamer) => {
    try {
        const res = await axios.post(`${url}/gift_suscription`, {
            userToSub, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling giftSuscription', error);
    }
}


export const checkSubscriptions = async (token) => {
    try {
        const res = await axios.post(`${url}/check_subscriptions`, {
            
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling checkSubscriptions', error);
    }
}