const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO

export async function signupNotConfirmed(userData) {
    try {
        const response = await axios.post(`${baseURL}/user/signupNotConfirmed`, userData);
        return response.data;
    } catch (error) {
        return error
    }
}

export async function SaveUserCodeConfirm(code) {
    try {
        const response = await axios.post(`${baseURL}/user/SaveUserCodeConfirm`, { code });
        return response.data;
    } catch (error) {
        return error
    }
}
export async function login(userData) {
    try {
        const response = await axios.post(`${baseURL}/user/login`, userData);
        return response.data;
    } catch (error) {
        return error
    }
}
export async function Get_Recover_lost_password(mail) {
    try {
        const response = await axios.post(`${baseURL}/user/Get_Recover_lost_password`, { mail });
        return response.data;
    } catch (error) {
        return error
    }
}
export async function follow(token, userId) {
    try {
        const response = await axios.post(
            `${baseURL}/user/follow`,
            { IdUser: userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en follow:', error.message);
        return error
    }
}

export async function getUserByIdTheToken(token) {
    try {
        const response = await axios.get(`${baseURL}/user/getUserById`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error en getUserById:', error.message);
        return {
            error
        }
    }
}
export async function getUserByNameUser(nameUser) {
    try {
        const response = await axios.get(`${baseURL}/user/getUserByNameUser?nameUser=${nameUser}`);
        return response.data;
    } catch (error) {
        console.error('Error en getUserById:', error.message);
        return error
    }
}

export async function unfollow(token, userId) {
    try {
        const response = await axios.post(
            `${baseURL}/user/Unfollow`,
            { IdUser: userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en unfollow:', error.message);
        return error
    }
}

export async function editProfile(token, profileData) {
    try {
        const response = await axios.post(
            `${baseURL}/user/EditProfile`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        return {
            error: "error"
        }
    }
}

export async function editAvatar(token, avatarData) {
    try {
        const response = await axios.post(
            `${baseURL}/user/EditAvatar`,
            avatarData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en editAvatar:', error.message);
        return error
    }
}



export async function compradePixeles(id, amount) {
    try {
        const response = await axios.post(
            `http://localhost:3006/create-order`,
            {
                idUser: id,
                amount: amount
            },
        );
        return response.data;
    } catch (error) {
        return error;
    }
}