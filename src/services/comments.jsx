import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/comments';

export const getAllCommentsInVideo = async (video) => {
    try {
        let response = await axios.get(`${url}/get_comments?video=${video}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCategories', error);
    }
}

export const addComment = async (token, name, comment, videoId, type) => {
    try {
        const res = await axios.post(`${url}/add_comment`, {
            name, comment, videoId, type
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