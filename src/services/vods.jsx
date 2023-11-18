import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/vods';

export const getStreamerVod = async (streamer, limit, sort) => {
    try {
        let response = await axios.get(`${url}/vods_streamer?streamer=${streamer}&limit=${limit}&sort=${sort}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}
export const getVod = async (vodId) => {
    try {
        let response = await axios.get(`${url}/get_vod?vodId=${vodId}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllFollowers', error);
    }
}


export const getStreamerClips = async (streamer, limit, sort) => {
    try {
        let response = await axios.get(`${url}/clips_streamer?streamer=${streamer}&limit=${limit}&sort=${sort}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getStreamerClips', error);
    }
}

export const getVodTrending = async (limit) => {
    try {
        let response = await axios.get(`${url}/get_vod_trending?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getVodTrending', error);
    }
}

export const getClipTrending = async (limit) => {
    try {
        let response = await axios.get(`${url}/get_clip_trending?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getVodTrending', error);
    }
}



export const getClipById = async (id) => {
    try {
        let response = await axios.get(`${url}/clip_by_id?clipId=${id}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getClipById', error);
    }
}

export const getClipByIdWithToken = async (token, id) => {
    try {
        let response = await axios.get(`${url}/clip_by_id_with_token?clipId=${id}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getClipByIdWithToken', error);
    }
}

export const getClips = async (limit) => {
    try {
        let response = await axios.get(`${url}/get_clips?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getClips', error);
    }
}

export const getClipsWithAuth = async (token, limit) => {
    try {
        let response = await axios.get(`${url}/get_clips_with_auth?limit=${limit}`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getClipsWithAuth', error);
    }
}



export const createClip = async (streamer, startTime, length, clipName) => {
    try {
        const res = await axios.post(`${url}/createClip`, {
            streamer, startTime, length, clipName
        })
        return res
    } catch (error) {
        console.log('Error while calling createClip', error);
    }
}


export const createUserClip = async (token, streamer, video, startTime, endTime, clipName, duration, text) => {
    try {
        const res = await axios.post(`${url}/createUserClip`, {
            streamer, video, startTime, endTime, clipName, duration, text
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling createUserClip', error);
    }
}

export const likeClip = async (token, clipId) => {
    try {
        const res = await axios.post(`${url}/likeClip`, {
            clipId
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling likeClip', error);
    }
}

export const likeVideo = async (token, videoId, type) => {
    try {
        const res = await axios.post(`${url}/like`, {
            videoId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling likeVideo', error);
    }
}

export const dislikeVideo = async (token, videoId, type) => {
    try {
        const res = await axios.post(`${url}/dislike`, {
            videoId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling dislikeVideo', error);
    }
}

export const userLikeVideo = async (token, videoId, type) => {
    try {
        const res = await axios.post(`${url}/user_like`, {
            videoId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling userLikeVideo', error);
    }
}

export const userDislikeVideo = async (token, videoId, type) => {
    try {
        const res = await axios.post(`${url}/user_dislike`, {
            videoId, type
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling userLikeVideo', error);
    }
}


