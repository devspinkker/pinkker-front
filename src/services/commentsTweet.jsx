import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/comments_tweet';

export const getAllCommentsInVideo = async (tweet) => {
    try {
        let response = await axios.get(`${url}/get_comments?tweet=${tweet}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllCommentsInVideo', error);
    }
}

export const addComment = async (token, comment, tweetId, type) => {
    try {
        const res = await axios.post(`${url}/add_comment`, {
            comment, tweetId, type
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