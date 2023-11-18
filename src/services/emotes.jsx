import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/emotes';

export const getAllEmotes = async (token) => {
    try {
        let response = await axios.get(`${url}/get_emotes`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllEmotes', error);
    }
}

export const getMyEmotes = async (token) => {
    try {
        let response = await axios.get(`${url}/get_my_emotes`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getMyEmotes', error);
    }
}



export const deleteEmote = async (token, emoteName) => {
    try {
        const res = await axios.post(`${url}/delete_emote?emoteName=${emoteName}`, {
            
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling deleteEmote', error);
    }
}
