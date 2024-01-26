import { select } from "@inquirer/prompts";
import chalk from "chalk";

import { UserSingleton } from "../models/UserSingleton.js";
import { checkCanReclaimCards } from "../helpers/handleTime.js";
import { getRandomCardsService } from "../services/card.services.js";
import { setTimeout } from "timers/promises";
import { applyColorToRarity } from "../helpers/applyColors.js";
import { createSpinner } from "../helpers/customSpinner.js";
import { MenuOptions } from "../types/menuOptions.types.js";

const { user } = UserSingleton.getInstance();

export const reclaimCardsMenu = async () => {
	console.clear();
	const { canReclaim, remainingMinutes } = await checkCanReclaimCards();

	const reclaimMenu = {
		message: "Which option do you want a choose? You can reclaim cards every 2 minutes",
		choices: [
			{ value: MenuOptions.RECLAIM_CARDS, name: chalk.hex("2f9e44")("Reclaim"), disabled: !canReclaim },
			{ value: MenuOptions.HOME, name: chalk.hex("e03131")("Back to home") },
		],
	};

	let timerMessage: string = "";

	if (canReclaim) {
		timerMessage = `${chalk.whiteBright("	  You can reclaim now")}`;
	} else {
		timerMessage = `  You must wait ${chalk.redBright(remainingMinutes.toFixed(3))} minutes for reclaim`;
	}

	console.log(
		`${chalk.whiteBright("=================================================================================")}`
	);
	console.log(`                               ${chalk.blueBright("Reclaim cards")}`);
	console.log(`		${timerMessage}`);
	console.log(
		`${chalk.whiteBright("=================================================================================")}`
	);
	const option = await select(reclaimMenu);

	if (option === MenuOptions.RECLAIM_CARDS) {
		// Get the random cards for the user.
		console.clear();
		const { data } = await getRandomCardsService(user.id);
		const cardsDB = data.data.getRandomCards;

		console.log(
			`${chalk.whiteBright("=================================================================================")}`
		);
		console.log(`			${chalk.greenBright("Congratulations!")}`);
		console.log("		You have received these cards:");
		console.log(
			`${chalk.whiteBright(
				"=================================================================================\n"
			)}`
		);

		// Show cards in different console lines.
		cardsDB.forEach((card) =>
			console.log(`${chalk.cyan(card.name)} - ${applyColorToRarity(card.rarity)} [${card.amount}]`)
		);

		console.log("");
		await createSpinner("Waiting while you appreciating your rewards", 6000);
		return MenuOptions.RECLAIM;
	} else {
		return option;
	}
};
