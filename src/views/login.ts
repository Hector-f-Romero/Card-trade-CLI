import { setTimeout } from "timers/promises";

import input from "@inquirer/input";
import { select } from "@inquirer/prompts";
import password from "@inquirer/password";
import chalk from "chalk";
import ora from "ora";

import { UserSingleton } from "../models/UserSingleton.js";
import { loginUserService } from "../services/user.services.js";
import { convertDateToUTC } from "../helpers/handleTime.js";
import { MenuOptions } from "../types/menuOptions.types.js";

export const loginMenu = async () => {
	console.clear();

	const username = await input({ message: chalk.yellow("Enter your username:") });
	const userPassword = await password({ message: chalk.yellow("Enter your password:"), mask: true });

	// Get the user from DB
	const { data } = await loginUserService(username, userPassword);

	if (data.errors) {
		console.clear();
		const spinner = ora({
			text: chalk.yellowBright(`${data.errors[0].message}`),
			spinner: "boxBounce2",
		}).start();

		await setTimeout(2000);
		spinner.stop();

		const option = await select({
			message: "What do you want to do?",
			choices: [
				{ value: MenuOptions.LOGIN, name: chalk.yellowBright("Try again") },
				{ value: MenuOptions.INDEX, name: chalk.hex("e03131")("Back") },
			],
		});
		return option;
	}
	// Extract user info from request.
	const userData = data.data.loginUser;

	// Go to home view and save the user data.
	const { user } = UserSingleton.getInstance();
	console.log(typeof userData.last_reward_claimed_date);
	user.id = userData.user_id;
	user.username = userData.username;
	user.email = userData.email;
	// Save this date inside the Singleton with UTC format
	user.lastRewardClaimedDate = convertDateToUTC(userData.last_reward_claimed_date);
	return MenuOptions.HOME;
};
