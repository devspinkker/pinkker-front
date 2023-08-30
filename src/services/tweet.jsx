import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/tweet';

export const getTweetFollowing = async (token, page, limit) => {
    try {
        let response = await axios.get(`${url}/get_tweets_following?page=${page}&limit=${limit}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllEmotes', error);
    }
}



export const getTweetUser = async (name, page, limit) => {
    try {
        let response = await axios.get(`${url}/get_tweets_user?name=${name}&page=${page}&limit=${limit}`, {
           
        });
        return response.data;
    } catch (error) {
        return error.response;
        console.log('Error while calling getAllEmotes', error);
    }
}

export const createTweet = async (token, text, image, citeTweet) => {
    try {
        const res = await axios.post(`${url}/createTweet`, {
            text, image, citeTweet
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling handleSuscription', error);
    }
}

export const like = async (token, tweetId) => {
    try {
        const res = await axios.post(`${url}/like`, {
            tweetId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling like', error);
    }
}

export const retweet = async (token, tweetId) => {
    try {
        const res = await axios.post(`${url}/retweet`, {
            tweetId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling like', error);
    }
}


export const userLikeTweet = async (token, tweetId) => {
    try {
        const res = await axios.post(`${url}/user_like`, {
            tweetId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling userLikeTweet', error);
    }
}


export const getUserFollow = async (token) => {
    try {
        let response = await axios.get(`${url}/userFollow`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllEmotes', error);
    }
}
