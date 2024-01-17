import { Separator } from "@inquirer/prompts";

export type InventoryCard = {
	card_id: string;
	name: string;
	description: string;
	value: number;
	rarity: string;
	amount: number;
};

// This type allow use Separators in inquirer options into inventory.
export type CardPreviewMenu =
	| {
			name: string;
			value: string;
			disabled?: boolean;
	  }
	| Separator;
