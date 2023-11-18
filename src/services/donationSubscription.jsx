import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/donation_suscription';


export const getStreamerDonationSubscription = async (streamer, page) => {
    try {
        let response = await axios.get(`${url}/get_streamer_donation?streamer=${streamer}&page=${page}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCategories', error);
    }
}

export const createDonationSubscription = async (token, streamer, amount) => {
    try {
        const res = await axios.post(`${url}/createDonationSubscriptions`, {
            streamer, amount
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}
