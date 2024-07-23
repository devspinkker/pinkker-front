import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKGO;

export async function generateTotpKey(token) {
    try {
        const response = await axios.post(`${baseURL}/generate-totp-key`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error

    }
}

export async function validateTotpCode(token, code) {
    try {
        const response = await axios.post(`${baseURL}/validate-totp-code`, { code }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error

    }
}
export async function ChangeGoogleAuthenticator(token) {
    console.log(token);
    try {
        const response = await axios.post(`${baseURL}/user/ChangeGoogleAuthenticator`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error

    }
}
export async function DeleteGoogleAuthenticator(token, code) {
    try {
        const response = await axios.post(`${baseURL}/user/DeleteGoogleAuthenticator`, { code }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return error

    }
}
