import axios from "axios"
const url = process.env.REACT_APP_BACKGO;
var token = null;
export const setToken = (newObject) => {
    token = newObject;
};
export const GoogleLoginURL = async () => {
    const res = await axios.get(
        `${url}/user/google_login`, {}
    )

    return res
}
export const Google_callback = async (code) => {
    const res = await axios.get(
        `${url}/user/google_callback?code=${code}`
    );
    return res;
};
export const Google_callback_Complete_Profile_And_Username = async (data) => {
    const res = await axios.post(
        `${url}/user/Google_callback_Complete_Profile_And_Username`,
        data
    );
    return res;
};
const exportedObject = {
    GoogleLoginURL,
    Google_callback,
    Google_callback_Complete_Profile_And_Username
}
export default exportedObject