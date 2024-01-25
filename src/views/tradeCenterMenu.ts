import select from "@inquirer/select";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import { MenuOptions } from "../types/menuOptions.types.js";

const { user } = UserSingleton.getInstance();

const tradeQuest = {
	message: "What do you want to do?",
	choices: [
		{ value: MenuOptions.CREATE_ROOM, name: chalk.hex("2f9e44")("Start trade") },
		{ value: MenuOptions.JOIN_ROOM, name: chalk.hex("1971c2")("Join into trade") },
		{ value: MenuOptions.HELP_TRADE_ROOM, name: chalk.hex("1971c2")("Get information about trades") },
		{ value: MenuOptions.HOME, name: chalk.hex("e03131")("Exit to home") },
	],
};

export const tradeCenterMenu = async () => {
	console.clear();
	console.log(
		`${chalk.whiteBright("=================================================================================")}`
	);
	console.log(chalk.whiteBright(`        			Welcome to Trade center ${user.username}`));
	console.log(
		`${chalk.whiteBright("=================================================================================\n")}`
	);

	let option = await select(tradeQuest);
	return option;
};
