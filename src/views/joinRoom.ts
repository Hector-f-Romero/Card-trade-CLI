import select from "@inquirer/select";
import chalk from "chalk";
import input from "@inquirer/input";

import { UserSingleton } from "../models/User.js";
import { joinTradeRoomService } from "../services/roomTrade.services.js";
import { createSpinner } from "../helpers/customSpinner.js";
import { MenuOptions } from "../types/menuOptions.types.js";

const { user } = UserSingleton.getInstance();

const joinTradeRoomQuest = {
	message: "What do you want to do?",
	choices: [
		{ value: "inventory", name: chalk.hex("2f9e44")("Inventory") },
		{ value: "reclaim", name: chalk.hex("1971c2")("Reclaim cards") },
		{ value: "trade", name: chalk.hex("f08c00")("Trade") },
		{ value: "index", name: chalk.hex("e03131")("Exit") },
	],
};

export const joinTradeRoomMenu = async () => {
	console.clear();
	console.log(
		`${chalk.whiteBright("=================================================================================")}`
	);
	console.log(chalk.whiteBright(`        		Prepare to enter a trade room`));
	console.log(
		`${chalk.whiteBright("=================================================================================\n")}`
	);
	const roomID = await input({ message: chalk.yellow("Enter the user room id:") });
	try {
		const res = await joinTradeRoomService(roomID, { user_id: user.id, username: user.username });

		if (res.data.errors) {
			throw new Error(res.data.errors[0].message);
		}

		console.log();
		return MenuOptions.HELP_TRADE_ROOM;
	} catch (error) {
		console.clear();
		// console.log("Estoy en error");
		await createSpinner(chalk.redBright(`ERROR: please check if the room_id exists`), 4000);

		const option = await select({
			message: "What do you want a do?",
			choices: [
				{ value: MenuOptions.JOIN_ROOM, name: "Enter another room id" },
				{ value: MenuOptions.TRADE, name: "Back to trade menu" },
			],
		});
		return option;
	}
};
