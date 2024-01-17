import { MenuOptions } from "./types/menuOptions.types.js";
import { homeMenu } from "./views/home.js";
import { indexMenu } from "./views/index.js";
import { inventoryMenu } from "./views/inventory.js";
import { joinTradeRoomMenu } from "./views/joinRoom.js";
import { loginMenu } from "./views/login.js";
import { reclaimCardsMenu } from "./views/reclaim.js";
import { registerMenu } from "./views/register.js";
import { tradeMenu } from "./views/trade.js";

// Use a main function to hanlde menu and interfaces
const main = async () => {
	console.clear();

	let option = MenuOptions.INDEX;
	option = await indexMenu();

	do {
		// Show the cli interface while the user doesn't choose 'exit'
		switch (option) {
			case "index":
				option = await indexMenu();
				break;
			// Choose a login option
			case "login":
				// TODO: create login logic
				option = await loginMenu();
				break;
			case "register":
				option = await registerMenu();
				break;
			case "home":
				option = await homeMenu();
				break;
			case "inventory":
				option = await inventoryMenu();
				break;
			case "reclaim":
				option = await reclaimCardsMenu();
				break;
			case "trade":
				option = await tradeMenu();
				break;
			case "joinRoom":
				option = await joinTradeRoomMenu();
				break;
			case "exit":
				break;
		}
		// await pausa();
	} while (option !== "exit");
	console.log("Thanks for all. Hope to see you later");
	process.exit();
};

main();
