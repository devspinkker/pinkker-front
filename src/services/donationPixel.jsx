import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/pixel';

export const getStreamerDonationPixel = async (streamer, page) => {
    try {
        let response = await axios.get(`${url}/get_streamer_donation?streamer=${streamer}&page=${page}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCategories', error);
    }
}





export const createDonationPixel = async (token, streamer, amount, text) => {
    try {
        const res = await axios.post(`${url}/createDonationPixel`, {
            streamer, amount, text
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}
