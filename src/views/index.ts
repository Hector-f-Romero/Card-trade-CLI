import select from "@inquirer/select";
import chalk from "chalk";
import { MenuOptions } from "../types/menuOptions.types.js";

const indexQuest = {
	message: "Choose and option",
	choices: [
		{
			value: MenuOptions.LOGIN,
			name: chalk.greenBright("1. Login"),
		},
		{
			value: MenuOptions.REGISTER,
			name: chalk.cyanBright("2. Register"),
		},
		{
			value: MenuOptions.EXIT,
			name: chalk.hex("e03131")("0. Exit"),
		},
	],
};
export const indexMenu = async () => {
	console.clear();
	console.log("_________________________________________________________\n");
	console.log(chalk.whiteBright("           Welcome to Trade Card GraphQL 👽"));
	console.log("_________________________________________________________\n");

	const option = await select(indexQuest);
	return option;
};
