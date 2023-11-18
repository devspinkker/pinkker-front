import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/user';

export const getAllFollowers = async (token) => {
    try {
        let response = await axios.get(`${url}/followers`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}

export const getUser = async (streamer) => {
    try {
        let response = await axios.get(`${url}/get_user/${streamer}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}

export const getStreamerFollowers = async (streamer) => {
    try {
        let response = await axios.get(`${url}/streamer_followers/${streamer}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getStreamerFollowers', error);
    }
}

export const follow = async (token, following) => {
    try {
        const res = await axios.post(`${url}/follow`, {
            following
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}

export const unfollow = async (token, following) => {
    try {
        const res = await axios.post(`${url}/unfollow`, {
            following
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling unfollow', error);
    }
}

export const userFollowUser = async (token, following) => {
    try {
        const res = await axios.post(`${url}/user_follow_user`, {
            following
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling userFollowUser', error);
    }
}


export const getUserFollowers = async (token, streamer) => {
    try {
        let response = await axios.get(`${url}/get_user_followers/${streamer}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getUserFollowers', error);
    }
}