import axios from "axios"
const url = "https://pinkker-backend-2-xw7b.fl0.io";
var token = null;
export const setToken = (newObject) => {
    token = newObject;
};
export const Create_Clip = async (videoBytes, start, end, totalKey, clipTitle, config) => {
    const response = await axios.post(
        "http://localhost:8080/create-clips",
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
    const response = await axios.get(`https://pinkker-backend-2-xw7b.fl0.io/GetClipId?clipId=${videoUrlParam}`)

    return response
}
export const GetClipsNameUser = async (nameUserCeator, page) => {
    const response = await axios.get(`https://pinkker-backend-2-xw7b.fl0.io/GetClipsNameUser?page=${page}&NameUser=${nameUserCeator}`)

    return response
}