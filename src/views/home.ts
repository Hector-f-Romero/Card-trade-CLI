import select from "@inquirer/select";
import chalk from "chalk";
import { UserSingleton } from "../models/UserSingleton.js";
import { MenuOptions } from "../types/menuOptions.types.js";

const { user } = UserSingleton.getInstance();

const homeQuest = {
	message: "What do you want to do?",
	choices: [
		{ value: MenuOptions.INVENTORY, name: chalk.hex("2f9e44")("Inventory") },
		{ value: MenuOptions.RECLAIM, name: chalk.hex("1971c2")("Reclaim cards") },
		{ value: MenuOptions.TRADE, name: chalk.hex("f08c00")("Trade") },
		{ value: MenuOptions.INDEX, name: chalk.hex("e03131")("Exit") },
	],
};

export const homeMenu = async () => {
	console.clear();
	console.log("_________________________________________________________\n");
	console.log(chalk.whiteBright(`        					Welcome to Home ${user.username} 🃏`));
	console.log("_________________________________________________________\n");

	const option = await select(homeQuest);
	return option;
};
