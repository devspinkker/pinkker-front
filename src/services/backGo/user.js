const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};

const baseURL = "https://pinkker-backend-2-xw7b.fl0.io";

export async function signUp(token, userData) {
    try {
        const response = await axios.post(`${baseURL}/user/signup`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error en signUp:', error.message);
        throw error;
    }
}

export async function login(userData) {
    try {
        const response = await axios.post(`${baseURL}/user/login`, userData);
        return response.data;
    } catch (error) {
        console.error('Error en login:', error.message);
        throw error;
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
        throw error;
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
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error en getUserById:', error.message);
        throw error;
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
        throw error;
    }
}

export async function editProfile(token, profileData) {
    try {
        console.log("A");
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
        throw error;
    }
}


export async function suscribirse(token, ToUser) {
    try {
        const response = await axios.post(
            `${baseURL}/user/suscribirse`,
            { ToUser: ToUser },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en unfollow:', error.message);
        throw error;
    }
}
export async function compradePixeles(token) {
    try {
        const response = await axios.post(
            `http://localhost:3002/create-order`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error
    }
}