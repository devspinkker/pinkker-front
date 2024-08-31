const axios = require('axios');

var token = null;
export const setToken = (newObject) => {
	token = newObject;
};

const baseURL = process.env.REACT_APP_BACKGO;

export async function getStreamById(streamId) {
	try {
		const response = await axios.post(`${baseURL}/stream/getStreamById`, {
			IdStream: streamId,
		});
		return response.data;
	} catch (error) {
		return error
	}
}

export async function CommercialInStream(token) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/commercialInStream`,
			{ CommercialInStream: 1 },
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
export async function AdsAddStreamSummary(token, StreamerID, AdvertisementsId) {
	try {
		const response = await axios.post(
			`${baseURL}/StreamSummary/AdsAdd`,
			{
				StreamerID,
				AdvertisementsId
			},
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

export async function getStreamSummariesByID(id) {
	try {
		const response = await axios.get(
			`${baseURL}/StreamSummary/GeStreamSummaries?id=${id}`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}
export async function GetTopVodsLast48Hours() {
	try {
		const response = await axios.get(
			`${baseURL}/StreamSummary/GetTopVodsLast48Hours`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}
export async function getStreamSummariesByTitle(title) {
	try {
		const response = await axios.get(
			`${baseURL}/StreamSummary/GetStreamSummaryByTitle?title=${title}`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}
export async function getStreamSummariesByStreamerIDLast30Days(streamerID) {
	try {
		const response = await axios.get(
			`${baseURL}/StreamSummary/GetStreamSummariesByStreamerIDLast30Days?Streamer=${streamerID}`
		);
		return response.data;
	} catch (error) {
		return error;
	}
}

// Función para obtener streams por categoría
export async function getStreamsByCategory(category, page) {
	try {
		const response = await axios.get(`${baseURL}/stream/getStreamsByCategorie`, {
			params: {
				page: page,
				Categorie: category,
			},
		});
		return response.data;
	} catch (error) {
		return (error)
	}
}

// Función para obtener streams por nombre de usuario
export async function getStreamByUserName(userName) {
	try {
		const response = await axios.get(`${baseURL}/stream/getStreamByNameUser?Streamer=${userName}`)
		return response.data
	} catch (error) {
		return error
	}
}

// Función para obtener streams de usuarios que sigo
async function getStreamsIFollow(followingIds) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/getStreamsIdsStreamer`,
			{ FollowingIds: followingIds },
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

// Función para actualizar la información de un stream
export async function updateStreamInfo(token, streamInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/update_stream_info`,
			streamInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;

	} catch (error) {
		console.log(error);
	}
}
export async function updateModChat(token, streamInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/updateModChat`,
			streamInfo,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;

	} catch (error) {
		console.log(error);
	}
}
export async function updateModChatSlowModeAxios(token, second) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/updateModChatSlowMode`,
			{ ModSlowMode: second },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;

	} catch (error) {
		console.log(error);
	}
}
// Función para obtener streams en línea
export async function GetAllsStreamsOnline(page) {
	try {
		const response = await axios.get(
			`${baseURL}/stream/GetAllsStreamsOnline`, {
			params: {
				page: page,
			},
		}
		);
		return response.data;
	} catch (error) {
		return error
	}
}
export async function GetStreamsMostViewed(page) {
	try {
		const response = await axios.get(
			`${baseURL}/stream/GetStreamsMostViewed`, {
			params: {
				page: page,
			},
		}
		);
		return response.data;
	} catch (error) {
		return error
	}
}
export async function GetAllsStreamsOnlineThatUserFollows(token) {
	try {
		const response = await axios.get(
			`${baseURL}/stream/GetAllsStreamsOnlineThatUserFollows`,
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


// Función para actualizar la fecha de inicio de un stream
async function updateStartDate(streamInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/update_start_date`,
			streamInfo,
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
async function updateOnlineStatus(updateInfo) {
	try {
		const response = await axios.post(
			`${baseURL}/stream/update_online`,
			updateInfo,
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
async function closeStream() {
	try {
		const response = await axios.post(
			`${baseURL}/stream/closeStream`,
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

// Función para obtener streams en línea
async function getStreamingsOnline() {
	try {
		const response = await axios.get(
			`${baseURL}/stream/get_streamings_online`
		);
		return response.data;
	} catch (error) {
		return error
	}
}
export async function getCategoriesWithLimit(param) {
	try {
		const response = await axios.get(`${baseURL}/categorie/GetCategories`)
		return response.data
	} catch (error) {
		return error
	}
}



export async function GetLastSixStreamSummaries(token, date) {
	try {
		const response = await axios.post(
			`${baseURL}/StreamSummary/GetLastSixStreamSummaries`,
			{ date },
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
export async function AWeekOfStreaming(token, page) {
	try {
		const response = await axios.get(
			`${baseURL}/StreamSummary/AWeekOfStreaming`,
			{
				params: {
					page: page,
				},
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		return error.response ? error.response.data : error.message;
	}
}

