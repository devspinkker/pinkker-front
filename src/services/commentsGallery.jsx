import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/comments_gallery';

export const getAllCommentsInVideo = async (gallery) => {
    try {
        let response = await axios.get(`${url}/get_comments?gallery=${gallery}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCommentsInVideo', error);
    }
}

export const addComment = async (token, name, comment, galleryId, type) => {
    try {
        const res = await axios.post(`${url}/add_comment`, {
            name, comment, galleryId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling addComment', error);
    }
}

export const addCommentToComment = async (token, name, comment, commentId) => {
    try {
        const res = await axios.post(`${url}/add_reply`, {
            name, comment, commentId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling addCommentToComment', error);
    }
}