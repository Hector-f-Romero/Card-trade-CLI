import select from "@inquirer/select";

import chalk from "chalk";

import { TradeRoom } from "../types/trade.types.js";
import { MenuOptions } from "../types/menuOptions.types.js";
import { chooseCardsMenu } from "./chooseCardsTradeRoom.js";

export const onlineTradeMenuList = async (tradeRoom: TradeRoom) => {
	console.clear();
	console.log("______________________________________________________________________________\n");
	console.log(chalk.whiteBright(` Trade room id: ${chalk.bgGray(tradeRoom.room_id)}`));
	console.log(chalk.whiteBright(` Host: ${chalk.cyan(tradeRoom.users[0].username)}`));
	console.log(chalk.whiteBright(` Guest: ${chalk.cyan(tradeRoom.users[1].username)}`));
	console.log("______________________________________________________________________________\n");

	// Use Type Assertion to avoid problems with the type of choises attribute.
	let option = await select({
		message: "Choose an option",
		choices: [
			{
				value: MenuOptions.CHOOSE_CARDS_TRADE_ROOM,
				name: "Choose cards",
			},
			{
				value: MenuOptions.TRADE,
				name: "Exit trade room",
			},
		],
	});

	if (option === MenuOptions.CHOOSE_CARDS_TRADE_ROOM) {
		option = await chooseCardsMenu(tradeRoom);
	}

	return option;
};
