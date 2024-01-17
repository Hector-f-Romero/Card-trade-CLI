import axios from "axios";
import "dotenv/config";

export const createTradeRoomService = async (host: { user_id: string; username: string }) => {
	const queryCreateTradeRoom = `
    mutation Mutation($host: UserRoomInput!) {
        createTradeRoom(host: $host) {
          room_id
          users {
            user_id
            username
          }
        }
      }
    `;

	const result = await axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryCreateTradeRoom,
			variables: {
				host: host,
			},
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return result;
};

export const joinTradeRoomService = async (room_id: string, user: { user_id: string; username: string }) => {
	const queryJoinTradeRoom = `
    mutation JoinTradeRoom($roomId: String!, $user: UserRoomInput!) {
		joinTradeRoom(room_id: $roomId, user: $user)
	  }
    `;

	const result = await axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryJoinTradeRoom,
			variables: {
				roomId: room_id,
				user,
			},
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return result;
};

export const deleteTradeRoomService = async (room_id: string) => {
	const queryDeleteTradeRoom = `
	mutation Mutation($room_id: String!) {
		deleteTradeRoom(room_id: $room_id) {
		  room_id
		}
	  }
    `;

	const result = await axios.post(
		`${process.env.BACKEND_URL}/v1/graphql`,
		{
			query: queryDeleteTradeRoom,
			variables: {
				room_id,
			},
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	return result;
};
