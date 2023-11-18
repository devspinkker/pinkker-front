import axios from 'axios';

const url = process.env.REACT_APP_DEV_API_URL + '/logros';

export const getLogros = async (token) => {
    try {
        let response = await axios.get(`${url}/get_logros`, {
            headers: {Authorization: token}
        });
        return response.data;
    } catch (error) {
        console.log('Error while calling getLogros', error);
    }
}
