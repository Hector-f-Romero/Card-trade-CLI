import select from "@inquirer/select";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import {
	createTradeRoomService,
	deleteTradeRoomService,
	joinTradeRoomService,
} from "../services/roomTrade.services.js";
import { establishConnectionHost } from "../helpers/tradeLogic.js";
import { joinTradeRoomMenu } from "./joinRoom.js";

const { user } = UserSingleton.getInstance();

const tradeQuest = {
	message: "What do you want to do?",
	choices: [
		{ value: "createRoom", name: chalk.hex("2f9e44")("Start trade") },
		{ value: "joinRoom", name: chalk.hex("1971c2")("Join into trade") },
		{ value: "infoTrade", name: chalk.hex("1971c2")("Get information about trades") },
		{ value: "home", name: chalk.hex("e03131")("Exit to home") },
	],
};

export const tradeMenu = async () => {
	// console.clear();
	console.log(
		`${chalk.whiteBright("=================================================================================")}`
	);
	console.log(chalk.whiteBright(`        			Welcome to Trade center ${user.username}`));
	console.log(
		`${chalk.whiteBright("=================================================================================\n")}`
	);

	let option = await select(tradeQuest);

	// 1. Iniciar una sala donde los usuarios puedan conectarse
	let optionTradeRoom = "";
	// 1.1 Darle un menú de opciones para que el usuario pueda unirse a una sala, crear sala o devolverse al menú principal
	if (option === "createRoom") {
		let tradeRoomId = "";
		do {
			try {
				// Create trade room in server
				const res = await createTradeRoomService({ user_id: user.id, username: user.username });
				const { room_id, users } = res.data.data.createTradeRoom;
				tradeRoomId = room_id;
				// console.clear();
				console.log(
					`${chalk.whiteBright(
						"================================================================================="
					)}`
				);
				console.log(chalk.whiteBright(`Trade room id: ${room_id}`));
				// console.log(chalk.whiteBright(`Host: ${users[0].username}`));
				console.log(
					`${chalk.whiteBright(
						"=================================================================================\n"
					)}`
				);
				const userJoin = await establishConnectionHost(room_id, { user_id: user.id, username: user.username });

				console.log(userJoin);
				console.log("No hubo errores, se conectó un usuario");
				optionTradeRoom = "nice";
			} catch (error) {
				console.log("Estoy en el catch");
				console.log(error);
				console.log(tradeRoomId);
				// Delete existing room
				const result = await deleteTradeRoomService(tradeRoomId);
				console.log(result.data.errors);

				optionTradeRoom = await select({
					message: "What do you want to do?",
					choices: [
						{ value: "retry", name: chalk.hex("2f9e44")("Try again") },
						{ value: "trade", name: chalk.hex("e03131")("Back") },
					],
				});
			}
		} while (optionTradeRoom === "retry");
	}

	if (option === "joinRoom") {
		option = await joinTradeRoomMenu();
		console.log(optionTradeRoom);
	}
	return option;
};
