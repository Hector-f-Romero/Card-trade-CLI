import WebSocket from "ws";
import { setTimeout } from "timers/promises";

import input from "@inquirer/input";
import chalk from "chalk";
import "dotenv/config";
import { createClient } from "graphql-ws";

import { UserSingleton } from "../models/UserSingleton.js";
import { createSpinner } from "./customSpinner.js";
import { JoinToRoomResponse } from "../types/trade.types.js";
import { tradeMenuList } from "../views/confirmTrade.js";
import { SpinnerSingleton } from "../models/SpinnerSingleton.js";

const spinning = SpinnerSingleton.getInstance();

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
					reject(false);
					// console.log(data[0].locations);
				},
				complete() {
					console.log("Complete");
				},
			}
		);

		spinning.changeMessage("SE CAMBIÓ EL MENSAJE");
		await spinning.startSpinner(20000);
		// await createSpinner("Waiting for another user 10 seconds", 10000);
		// console.log("Terminaron los 10 segundos");
		if (!userJoin) {
			client.terminate();
			console.log("Se cerró la conexión");
			reject(false);
		}
		resolve(true);
	});
};
