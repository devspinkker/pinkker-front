const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
    token = newObject;
};
const baseURL = "https://pinkker-backend-2-xw7b.fl0.io";


async function actionsModeratorChatStream(action, actionAgainst, timeOut, room) {
    try {
        const response = await axios.post(
            `${baseURL}/actionsChatStream`,
            {
                action,
                actionAgainst,
                timeOut,
                room,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en actionsModeratorChatStream:', error.message);
        throw error;
    }
}

async function actionsChatStream() {
    try {
        const response = await axios.get(`${baseURL}/getCommands`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error en actionsChatStream:', error.message);
        throw error;
    }
}
async function updataCommands(commands) {
    try {
        const response = await axios.post(
            `${baseURL}/updataCommands`,
            {
                CommandsUpdata: commands,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error en updataCommands:', error.message);
        throw error;
    }
}


