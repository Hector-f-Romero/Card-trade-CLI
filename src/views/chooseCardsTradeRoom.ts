import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import { input } from "@inquirer/prompts";

import { PreviewCardToTrade, TradeRoom } from "../types/trade.types.js";
import { MenuOptions } from "../types/menuOptions.types.js";
import { getInventoryUser } from "../services/user.services.js";
import { InventoryCard } from "../types/inventory.types.js";
import { SpinnerSingleton } from "../models/SpinnerSingleton.js";

const mySpinner = SpinnerSingleton.getInstance();

export const chooseCardsMenu = async (tradeRoom: TradeRoom) => {
	// Get the user inventory
	const result = await getInventoryUser(tradeRoom.users[0].user_id);
	// Obtain the cards from the response to GraphQL server
	const cardsDB: InventoryCard[] = result.data.data.getUserInventory;
	const formattedCards = cardsDB.map((card) => {
		return {
			name: `${card.name} - [${card.amount}]`,
			value: card.card_id,
		};
	});

	let selectedCards: string[] = [];
	let canContinue = false;

	do {
		selectedCards = await checkbox({
			message: "Select maximum 3 cards from your inventory",
			choices: formattedCards,
		});

		// The user only can trade 3 cards at time
		if (selectedCards.length > 3) {
			console.clear();
			mySpinner.startSpinner("Only can select maximum 3 cards to trade", 4000);
			continue;
		}

		if (selectedCards.length === 0) {
			console.clear();
			mySpinner.startSpinner("You haven't selected cards to trade", 4000);
			continue;
		}

		// If the user has selected at least 1 and maximum 3 cards, we can continue with the flow
		canContinue = true;
	} while (canContinue === false);

	console.clear();
	const cardstoShowInTable: PreviewCardToTrade[] = [];

	// Select the amount of each cards
	for (const currentSelectedCard of selectedCards) {
		// Obtain all information about the card
		const infoCard = cardsDB.find((cardDB) => cardDB.card_id === currentSelectedCard);

		// The variable infoCard must not be undefined
		if (!infoCard) {
			throw new Error("Logical server error");
		}

		// The user select the amount of cards that he wants to trade
		// TODO: validate that user input is a number and don't exceed the maximum available amount
		const amountToOffer = await input({
			message: `Type the number of quantity you are offering for ${infoCard.name} (Available amount ${infoCard.amount})`,
		});

		// Delete the id form the object (to avoid display it)
		const { card_id, ...restInfo } = infoCard;

		cardstoShowInTable.push({ ...restInfo, amount: Number(amountToOffer) });
	}
	console.clear();
	// TODO: enviar mi tabla al usuario que desea hacer el intercambio

	// TODO: recibir la propuesta de intercambio

	console.table(cardstoShowInTable);
	// ["Name", "Value", "Amount", "Rarity"]
	// console.table();

	// TODO: confirmar intercambio - Proceso lógico de DB
	const confirmTrade = await confirm({ message: "Will you accept this deal?" });

	console.log("Se culminó el intercambio");
	await mySpinner.startSpinner("Successfully trade. Back to lobby", 5000);
	return MenuOptions.TRADE;
};
