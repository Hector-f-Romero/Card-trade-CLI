import WebSocket from "ws";

import "dotenv/config";
import { createClient } from "graphql-ws";

import { JoinToRoomResponse } from "../types/trade.types.js";
import { SpinnerSingleton } from "../models/SpinnerSingleton.js";

const customSpinner = SpinnerSingleton.getInstance();

// export const joinTradeRoom = async (room_id: string, user: unknown) => {
// 	// console.clear();

// 	const client = createClient({
// 		url: "ws://localhost:3000/v1/graphql",
// 		webSocketImpl: WebSocket,
// 	});

// 	console.log("Cliente creado");

// 	client.subscribe(
// 		{
// 			query: querySubscriptionJoinRoom,
// 			variables: {
// 				roomId: room_id,
// 				user: user,
// 			},
// 		},
// 		{
// 			next(data) {
// 				console.log("Función Next");
// 				console.log(data);
// 			},
// 			error(data) {
// 				console.log("ERROR");
// 				console.log(data);
// 			},
// 			complete() {
// 				console.log("Complete");
// 			},
// 		}
// 	);

// 	console.log("Se acabó el método el joinTradeRoom");
// };

export const establishConnectionHost = async (room_id: string, user: { user_id: string; username: string }) => {
	return new Promise(async (resolve, reject) => {
		let userJoin: boolean = false;

		const client = createClient({
			url: process.env.WS_BACKEND_URL as string,
			webSocketImpl: WebSocket,
		});

		const querySubscriptionJoinRoom = `
		subscription Subscription($roomId: ID!) {
			joinToRoom(room_id: $roomId) {
			  room_id
			  users {
				user_id
				username
			  }
			}
		  }`;

		console.log("Se crea el cliente de web sockets");
		const subscriptionToTradeRoom = client.subscribe(
			{
				query: querySubscriptionJoinRoom,
				variables: {
					roomId: room_id,
				},
			},
			{
				next(data: { data: JoinToRoomResponse }) {
					console.log("Función Next");
					console.log(data);
					const roomInformation = data.data.joinToRoom;
					client.terminate();
					userJoin = true;
					resolve({ roomInformation, subscriptionToTradeRoom });
				},
				error(data) {
					console.log("ERROR");
					console.log(data);
					client.terminate();
					reject(false);
					// console.log(data[0].locations);
				},
				complete() {
					console.log("Complete");
				},
			}
		);

		await customSpinner.startSpinner("Waiting 8 seconds for another user", 8000);

		if (!userJoin) {
			client.terminate();
			console.log("Se cerró la conexión");
			reject(false);
		}
		resolve(true);
	});
};
