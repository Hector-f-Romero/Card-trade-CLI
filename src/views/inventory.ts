import select, { Separator } from "@inquirer/select";
import chalk from "chalk";

import { UserSingleton } from "../models/User.js";
import { getInventoryUser } from "../services/user.services.js";
import { applyColorToRarity } from "../helpers/applyColors.js";
import { MenuOptions } from "../types/menuOptions.types.js";
import { CardPreviewMenu, InventoryCard } from "../types/inventory.types.js";

const getUserCards = async () => {
	try {
		// Obtain the information of the user that has been logged in.
		const { user } = UserSingleton.getInstance();
		const result = await getInventoryUser(user.id);
		// Obtain the cards from the response to GraphQL server
		const cardsDB: InventoryCard[] = result.data.data.getUserInventory;

		// TODO: fix the type for this variable
		let cardsPreview: CardPreviewMenu[];

		// If the users don't have any cards, display the following interface.
		if (cardsDB.length === 0) {
			cardsPreview = [
				{
					name: chalk.hex("FABC2C")("You don't any have cards yet"),
					value: MenuOptions.NO_AVAILABLE,
					disabled: true,
				},
			];
			cardsPreview.push(new Separator("------------------------------------------------------"));
			cardsPreview.push({ value: MenuOptions.HOME, name: chalk.hex("e03131")("Exit") });
			cardsPreview.push(
				new Separator("------------------------------------------------------------------------------")
			);
			return cardsPreview;
		}

		cardsPreview = cardsDB.map((card) => {
			// value: card.card_id,
			return {
				value: MenuOptions.NO_AVAILABLE,
				name: `${chalk.cyan(card.name)} - ${applyColorToRarity(card.rarity)} [${card.amount}]`,
			};
		});

		// Add 'exit' option to the end of the list.
		cardsPreview.push(
			new Separator("------------------------------------------------------------------------------")
		);
		cardsPreview.push({ value: MenuOptions.HOME, name: chalk.hex("e03131")("Exit") });
		cardsPreview.push(
			new Separator("------------------------------------------------------------------------------")
		);
		// console.log(cards);
		return cardsPreview;
	} catch (error: any) {
		console.log(error.response.data);
	}
};

export const inventoryMenu = async () => {
	console.clear();
	console.log("______________________________________________________________________________\n");
	console.log(chalk.whiteBright("         		Look your cards 📂"));
	console.log("______________________________________________________________________________\n");

	// Return the types in specific format to display the user in console.
	const cards = await getUserCards();

	// Use Type Assertion to avoid problems with the type of choises attribute.
	const option = (await select({
		message: "Choose a card to get more information about this",
		choices: cards as CardPreviewMenu[],
		pageSize: 15,
	})) as MenuOptions;
	return option;
};
