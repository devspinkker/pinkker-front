import axios from "axios"
const url = "https://pinkker-backend-2-xw7b.fl0.io";
var token = null;
export const setToken = (newObject) => {
    token = newObject;
};
export const Create_Clip = async (videoBytes, start, end, totalKey, clipTitle, config) => {
    const response = await axios.post(
        "http://localhost:8080/clips/create-clips",
        {
            video: videoBytes,
            start: 1,
            end: 60,
            clipTitle: clipTitle,
            totalKey: totalKey,
        },
        config
    );
    return response
}
export const GetBuffer = async (totalKey) => {

    const response = await fetch(
        `http://localhost:8002/getBuffer/${totalKey}`
    );
    return response
}
export const GetClipId = async (videoUrlParam) => {
    const response = await axios.get(`${url}/clips/GetClipId?clipId=${videoUrlParam}`)

    return response
}
export const GetClipsNameUser = async (nameUserCeator, page) => {
    const response = await axios.get(`${url}/clips/GetClipsNameUser?page=${page}&NameUser=${nameUserCeator}`)

    return response
}
export const GetClipsCategory = async (Category, page, lastClip) => {
    const response = await axios.get(`${url}/clips/GetClipsCategory?page=${page}&Category=${Category}&lastClip=${lastClip}`)

    return response
}
export const GetClipsMostViewed = async (page) => {
    const response = await axios.get(`${url}/clips/GetClipsMostViewed?page=${page}`)
    return response
}
export const DislikeClip = async (token, ClipId) => {
    try {
        const res = await axios.post(
            `${url}/clips/DisLike`,
            {
                ClipId: ClipId,

            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const likeClip = async (token, ClipId) => {
    try {

        const res = await axios.post(
            `${url}/clips/ClipLike`,
            {
                ClipId: ClipId,
            },
            {
                headers: { Authorization: token },
            }
        );
        return res;
    } catch (error) {
        return error
    }
};
export const MoreViewOfTheClip = async (ClipId) => {
    try {

        const res = await axios.post(
            `${url}/clips/MoreViewOfTheClip`,
            {
                ClipId: ClipId,
            });
        return res;
    } catch (error) {
        return error
    }
};