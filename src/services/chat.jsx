import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/chat';

export const getChatRoom = async (username) => {
    try {
        let response = await axios.get(`${url}/get_chat?userName=${username}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllEmotes', error);
    }
}


export const addModToChat = async (token, userName, streamer) => {
    try {
        const res = await axios.post(`${url}/add_mod_to_chat`, {
            userName, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}


export const removeModToChat = async (token, userName, streamer) => {
    try {
        const res = await axios.post(`${url}/remove_mod_to_chat`, {
            userName, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}


export const addVipToChat = async (token, userName, streamer) => {
    try {
        const res = await axios.post(`${url}/add_vip_to_chat`, {
            userName, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}


export const removeVipToChat = async (token, userName, streamer) => {
    try {
        const res = await axios.post(`${url}/remove_vip_to_chat`, {
            userName, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling removeVipToChat', error);
    }
}

export const setSlow = async (token, slow, streamer) => {
    try {
        const res = await axios.post(`${url}/set_slow`, {
            slow, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling setSlow', error);
    }
}


export const addBanToChat = async (token, userName, reason, streamer) => {
    try {
        const res = await axios.post(`${url}/add_ban_to_chat`, {
            userName, reason, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling follow', error);
    }
}


export const removeBanToChat = async (token, userName, streamer) => {
    try {
        const res = await axios.post(`${url}/remove_ban_to_chat`, {
            userName, streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling removeVipToChat', error);
    }
}


export const enableUniqueChat = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/enable_unique_chat`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling enableUniqueChat', error);
    }
}

export const disableUniqueChat = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/disable_unique_chat`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling enableUniqueChat', error);
    }
}


export const enableEmotes = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/enable_emotes`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling enableEmotes', error);
    }
}

export const disableEmotes = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/disable_emotes`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling disableEmotes', error);
    }
}


export const enableSuscriber = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/enable_suscriber`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling enableSuscriber', error);
    }
}

export const disableSuscriber = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/disable_suscriber`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling disableSuscriber', error);
    }
}

export const enableFollowers = async (token, streamer, time) => {
    try {
        const res = await axios.post(`${url}/enable_followers`, {
            streamer, time
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling enableSuscriber', error);
    }
}

export const disableFollowers = async (token, streamer) => {
    try {
        const res = await axios.post(`${url}/disable_followers`, {
            streamer
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling disableSuscriber', error);
    }
}



export const sendRequestMessage = async (token, streamer, message) => {
    try {
        const res = await axios.post(`${url}/send_message`, {
            streamer, message
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling enableUniqueChat', error);
    }
}

export const getMessagesStream = async (stream) => {
    try {
        let response = await axios.get(`${url}/get_messages?stream=${stream}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllEmotes', error);
    }
}
