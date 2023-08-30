import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/comments_clip';

export const getAllCommentsInVideo = async (clip) => {
    try {
        let response = await axios.get(`${url}/get_comments?clip=${clip}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCommentsInVideo', error);
    }
}

export const getAllCommentsInVideoWithAuth = async (token, clip) => {
    try {
        let response = await axios.get(`${url}/get_comments_with_auth?clip=${clip}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCommentsInVideo', error);
    }
}


export const addComment = async (token, comment, clipId, type) => {
    try {
        const res = await axios.post(`${url}/add_comment`, {
            comment, clipId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling addComment', error);
    }
}

export const addCommentToComment = async (token, comment, commentId) => {
    try {
        const res = await axios.post(`${url}/add_reply`, {
            comment, commentId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling addCommentToComment', error);
    }
}

export const likeComment = async (token, commentId) => {
    try {
        const res = await axios.post(`${url}/likeComment`, {
            commentId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling likeClip', error);
    }
}