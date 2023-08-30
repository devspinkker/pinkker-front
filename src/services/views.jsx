import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/views';

export const addView = async (token, videoId, type) => {
    try {
        const res = await axios.post(`${url}/addView`, {
            videoId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateStreamInfo', error);
    }
}
