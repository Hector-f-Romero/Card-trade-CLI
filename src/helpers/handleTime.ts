import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { updateLastRewardDateService } from "../services/user.services.js";
import { UserSingleton } from "../models/User.js";

const { user } = UserSingleton.getInstance();

dayjs.extend(utc);

// Time expressed in miliseconds - 2 minutes (120000 miliseconds) - 3o seconds (3000)
const timeToWait = 120000;

export const checkCanReclaimCards = async () => {
	// 1. Verify if it's the first time that user reclaim cards
	if (user.lastRewardClaimedDate === null) {
		console.log("Primera vez que reclama");
		return { canReclaim: true, remainingMinutes: 0 };
	}

	// 2. Get the current Date in UTC (for avoid problems with time zones).
	const currentDateUTC = dayjs().utc();
	// 3. Calcule the difference between the current time and the last reward claimed date.
	const diff = currentDateUTC.diff(user.lastRewardClaimedDate);

	// 4. If the difference is greather than 2 minutes (120000 miliseconds), the user can reclaim again.
	if (diff > timeToWait) {
		// Update date for reclaim cards
		const { data } = await updateLastRewardDateService(user.id, currentDateUTC);
		user.lastRewardClaimedDate = convertDateToUTC(data.data.updateUser.last_reward_claimed_date);
		return { canReclaim: true, remainingMinutes: (timeToWait - diff) / 1000 / 60 };
	} else {
		return { canReclaim: false, remainingMinutes: (timeToWait - diff) / 1000 / 60 };
	}
};

export const convertDateToUTC = (date: string) => {
	return dayjs(Number(date)).utc().format();
};
