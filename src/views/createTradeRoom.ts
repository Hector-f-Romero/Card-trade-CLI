import chalk from "chalk";
import { select } from "@inquirer/prompts";

import { createTradeRoomService, deleteTradeRoomService } from "../services/roomTrade.services.js";
import { establishConnectionHost } from "../helpers/tradeLogic.js";
import { tradeMenuList } from "./confirmTrade.js";
import { MenuOptions } from "../types/menuOptions.types.js";
import { UserSingleton } from "../models/User.js";

const { user } = UserSingleton.getInstance();

export const createTradeRoomMenu = async () => {
	let tradeRoomId = "";
	let optionTradeRoom = MenuOptions.RETRY_CONNECTION;
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
			console.log(
				`${chalk.whiteBright(
					"=================================================================================\n"
				)}`
			);
			const clientTradeRoom = await establishConnectionHost(room_id, {
				user_id: user.id,
				username: user.username,
			});

			console.log(clientTradeRoom.roomInformation);
			console.log(clientTradeRoom.subscriptionToTradeRoom);

			const opt = await tradeMenuList(clientTradeRoom.roomInformation);

			optionTradeRoom = MenuOptions.NO_AVAILABLE;
			return optionTradeRoom;
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
					{ value: MenuOptions.RETRY_CONNECTION, name: chalk.hex("2f9e44")("Try again") },
					{ value: MenuOptions.TRADE, name: chalk.hex("e03131")("Back") },
				],
			});
		}
	} while (optionTradeRoom === MenuOptions.RETRY_CONNECTION);
	return optionTradeRoom;
};
