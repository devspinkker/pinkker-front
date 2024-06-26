import axios from "axios";

const url = process.env.REACT_APP_BACKGO;

export const getMessages = async (token, userID, receiver_id) => {
    try {
        const response = await axios.get(`${url}/chats/messages`, {
            params: { sender_id: userID, receiver_id: receiver_id },
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};

export const sendMessage = async (token, id, recipientId, message) => {
    try {
        console.log(id);
        console.log(recipientId);
        const response = await axios.post(`${url}/chats/send`, {
            sender_id: id,
            receiver_id: recipientId,
            content: message,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
    }
};
export const CreateChatOrGetChats = async (token, id) => {
    try {
        const response = await axios.post(`${url}/chats/CreateChatOrGetChats`, {
            other_user_id: id,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
    }
};
export const getChatsByUserID = async (token, userID) => {
    try {
        const response = await axios.get(`${url}/chats/GetChatsByUserID`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching chats:", error);
    }
};