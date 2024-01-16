import axios from "axios";
const url = process.env.REACT_APP_BACKGO;
var token = null;

export const setToken = (newObject) => {
  token = newObject;
};

export const PostCreate = async (formData) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios.post(`${url}/post/postCreate`, formData, config);
    return res.data;
  } catch (error) {
    console.error("Error in PostCreate:", error);
    throw error;
  }
};

export const PostGetFollow25h = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${url}/post/postGetFollow`, config);
    return res.data;
  } catch (error) {
    console.error("Error in PostGetFollow25h:", error);
    throw error;
  }
};

export const PostGets = async () => {
  try {
    const res = await axios.get(`${url}/post/PostGets`);
    return res.data;
  } catch (error) {
    console.error("Error in PostGets:", error);
    throw error;
  }
};

export const GetCommentPost = async (object) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${url}/post/GetCommentPost`, object, config);
  return res;

};
export const LikePost = async (object) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/posttLike`, object, config);
    return res.data;
  } catch (error) {
    console.error("Error in LikePost:", error);
    throw error;
  }
};

export const DislikePost = async (object) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/postDislike`, object, config);
    return res.data;
  } catch (error) {
    console.error("Error in DislikePost:", error);
    throw error;
  }
};

export const CommentPost = async (object) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/post/CommentPost`, object, config);
    return res.data;
  } catch (error) {
    console.error("Error in CommentPost:", error);
    throw error;
  }
};

export const getTweetFollowing = async (page, limit) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${url}/get_tweets_following?page=${page}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error("Error in getTweetFollowing:", error);
    throw error;
  }
};

export const getTweetUser = async (name, page, limit) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `${url}/get_tweets_user?name=${name}&page=${page}&limit=${limit}`,
      config
    );
    return res.data;
  } catch (error) {
    console.error("Error in getTweetUser:", error);
    throw error;
  }
};

