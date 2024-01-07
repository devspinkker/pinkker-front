import axios from "axios";

const url = process.env.REACT_APP_DEV_API_URL + "/bet";

export const getBetsStreamer = async (token, streamer) => {
  try {
    const res = await axios.get(`${url}/getBetsStreamer?streamer=${streamer}`, {
      headers: { Authorization: token },
    });
    return res;
  } catch (error) {}
};

export const createBet = async (
  token,
  streamer,
  title,
  resultOne,
  resultTwo,
  minParticipate
) => {
  try {
    const res = await axios.post(
      `${url}/createBet`,
      {
        streamer,
        title,
        resultOne,
        resultTwo,
        minParticipate,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const participateBet = async (token, streamer, amount, type) => {
  try {
    const res = await axios.post(
      `${url}/participateBet`,
      {
        streamer,
        amount,
        type,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const finishBet = async (token, streamer, typeWin) => {
  try {
    const res = await axios.post(
      `${url}/finishBet`,
      {
        streamer,
        typeWin,
      },
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    return error.response;
    console.log("Error while calling participateBet", error);
  }
};

export const restoreBet = async (token) => {
  try {
    const res = await axios.post(
      `${url}/restoreBet`,
      {},
      {
        headers: { Authorization: token },
      }
    );
    return res;
  } catch (error) {
    return error.response;
    console.log("Error while calling participateBet", error);
  }
};
