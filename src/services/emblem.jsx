import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/emblem';

export const getEmblemFromName = async (name) => {
    try {
        let response = await axios.get(`${url}/get_emblem_from_name?name=${name}`, {
            
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getAllEmotes', error);
    }
}

export const getMyEmblem = async (token) => {
    try {
        let response = await axios.get(`${url}/get_my_emblems`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getMyEmblem', error);
    }
}

export const deleteEmblem = async (token, emoteName) => {
    try {
        const res = await axios.post(`${url}/delete_emblem?emoteName=${emoteName}`, {
            
        }, {
            headers: {Authorization: token}
        })
        return res
    } catch (error) {
        console.log('Error while calling deleteEmote', error);
    }
}
