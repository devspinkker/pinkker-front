import axios from "axios";
const url = "https://pinkker-backend-2-xw7b.fl0.io";
var token = null;

export const setToken = (newObject) => {
  token = newObject;
};

// bruno
export const PostCreate = async (FormData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };
  console.log(token);
  const res = await axios.post(`${url}/post/postCreate`, FormData, config);
  return res;
};
export const PostGetFollow25h = async (FormData) => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTBlMGEzOWRhMGZlYzQ3NzQ5MzllYWQiLCJleHAiOjE3MDQwNTkwNDgsIm5hbWV1c2VyIjoiYnJ1bm8yIiwicGlua2tlclByaW1lIjpmYWxzZX0.6G4wRdyGAbvw_iSkDPIOzvSMVLdegfJaShh1uGTFfPs`,
    },
  };
  const res = await axios.get(`${url}/post/postGetFollow`, config);
  return res;
};
export const PostGets = async () => {
  const config = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTBlMGEzOWRhMGZlYzQ3NzQ5MzllYWQiLCJleHAiOjE3MDQwNTkwNDgsIm5hbWV1c2VyIjoiYnJ1bm8yIiwicGlua2tlclByaW1lIjpmYWxzZX0.6G4wRdyGAbvw_iSkDPIOzvSMVLdegfJaShh1uGTFfPs`,
    },
  };
  const res = await axios.get(`${url}/post/PostGets`, config);
  return res;
};
export const LikePost = async (object) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(token);
  console.log(object.idTweet);
  const res = await axios.post(`${url}/post/posttLike`, object, config);
  console.log(res);
  return res;
};
export const DislikePost = async (object) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${url}/post/postDislike`, object, config);
  return res;
};
export const CommentPost = async (object) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${url}/post/CommentPost`, object, config);
  return res;
};
// el otro

export const getTweetFollowing = async (token, page, limit) => {
  try {
    let response = await axios.get(
      `${url}/get_tweets_following?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error while calling getAllEmotes", error);
  }
};

export const getTweetUser = async (name, page, limit) => {
  try {
    let response = await axios.get(
      `${url}/get_tweets_user?name=${name}&page=${page}&limit=${limit}`,
      {}
    );
    return response.data;
  } catch (error) {
    return error.response;
    console.log("Error while calling getAllEmotes", error);
  }
};
export const createTweet = async (token, text, image, citeTweet) => {
  try {
    const res = await axios.post(
      `${url}/createTweet`,
      {
        text,
        image,
        citeTweet,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling handleSuscription", error);
  }
};

export const like = async (token, tweetId) => {
  try {
    const res = await axios.post(
      `${url}/like`,
      {
        tweetId,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling like", error);
  }
};

export const retweet = async (token, tweetId) => {
  try {
    const res = await axios.post(
      `${url}/retweet`,
      {
        tweetId,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling like", error);
  }
};

export const userLikeTweet = async (token, tweetId) => {
  try {
    const res = await axios.post(
      `${url}/user_like`,
      {
        tweetId,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    console.log("Error while calling userLikeTweet", error);
  }
};

export const getUserFollow = async (token) => {
  try {
    let response = await axios.get(`${url}/userFollow`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    console.log("Error while calling getAllEmotes", error);
  }
};
