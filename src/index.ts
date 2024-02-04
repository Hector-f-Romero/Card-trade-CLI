import { UserSingleton } from "./models/UserSingleton.js";
import { MenuOptions } from "./types/menuOptions.types.js";
import { onlineTradeMenuList } from "./views/confirmTrade.js";
import { createTradeRoomMenu } from "./views/createTradeRoom.js";
import { homeMenu } from "./views/home.js";
import { indexMenu } from "./views/index.js";
import { inventoryMenu } from "./views/inventory.js";
import { joinTradeRoomMenu } from "./views/joinRoom.js";
import { loginMenu } from "./views/login.js";
import { reclaimCardsMenu } from "./views/reclaim.js";
import { registerMenu } from "./views/register.js";
import { tradeCenterMenu } from "./views/tradeCenterMenu.js";

const { user } = UserSingleton.getInstance();

// Use a main function to hanlde menu and interfaces
const main = async () => {
	console.clear();

	let option = MenuOptions.INDEX;
	option = await indexMenu();

	do {
		// Show the cli interface while the user doesn't choose 'exit'
		switch (option) {
			case MenuOptions.INDEX:
				option = await indexMenu();
				break;
			// Choose a login option
			case MenuOptions.LOGIN:
				option = await loginMenu();
				break;
			case MenuOptions.REGISTER:
				option = await registerMenu();
				break;
			case MenuOptions.HOME:
				option = await homeMenu();
				break;
			case MenuOptions.INVENTORY:
				option = await inventoryMenu();
				break;
			case MenuOptions.RECLAIM_CARDS:
				option = await reclaimCardsMenu();
				break;
			case MenuOptions.TRADE:
				option = await tradeCenterMenu();
				break;
			case MenuOptions.CREATE_ROOM:
				option = await createTradeRoomMenu();
				break;
			case MenuOptions.JOIN_ROOM:
				option = await joinTradeRoomMenu();
				break;
			case MenuOptions.EXIT:
				break;
			case MenuOptions.TEST_ONLINE_TRADE_MENU:
				option = await onlineTradeMenuList({
					room_id: "aaaa",
					users: [
						{ user_id: user.id, username: user.username },
						{ user_id: "test2", username: "TEST2" },
					],
				});
				break;
		}
		// await pausa();
	} while (option !== MenuOptions.EXIT);
	console.log("Thanks for all. Hope to see you later");
	process.exit();
};

main();
