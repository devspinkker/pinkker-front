import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/gallery';


export const getStreamerGallery = async (token, streamer) => {
    try {
        let response = await axios.get(`${url}/get_gallerie_streamer?streamer=${streamer}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getMessages', error);
    }
}

export const like = async (token, galleryId) => {
    try {
        const res = await axios.post(`${url}/like`, {
            galleryId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling like', error);
    }
}


export const userLikeGallery = async (token, galleryId) => {
    try {
        const res = await axios.post(`${url}/user_like`, {
            galleryId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling userLikeGallery', error);
    }
}
