import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/stream';

export const getStream = async (token) => {
    try {
        let response = await axios.get(`${url}/stream`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getStream', error);
    }
}

export const getStreamerStream = async (streamer) => {
    try {
        let response = await axios.get(`${url}/get_stream/${streamer}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getStreamerStream', error);
    }
}

export const getStreamsRecommended = async () => {
    try {
        let response = await axios.get(`${url}/get_streams_recommended`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getStreamsRecommended', error);
    }
}

export const getStreamsOnline = async (limit) => {
    try {
        let response = await axios.get(`${url}/get_streams_online?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getStreamerStream', error);
    }
}

export const getStreamsByCategorie = async (categorie) => {
    try {
        let response = await axios.get(`${url}/get_streams_by_categorie?categorie=${categorie}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getStreamerStream', error);
    }
}

export const updateStreamInfo = async (token, title, notification, category, tag, idiom) => {
    try {
        const res = await axios.post(`${url}/update_stream_info`, {
            title, notification, category, tag, idiom
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling updateStreamInfo', error);
    }
}

export const addStreamLike = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/add_like?name=${streamer}`, {
            
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling addStreamLike', error);
    }
}


export const getViewersStream = async (streamer) => {
    try {
        let response = await axios.get(`${process.env.REACT_APP_DEV_CHAT_URL}/api/user/get_users_in_room?room=${streamer}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getViewersStream', error);
    }
}

export const getStreamUserActivity = async (token) => {
    try {
        let response = await axios.get(`${url}/get_stream_user_activity`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getStream', error);
    }
}