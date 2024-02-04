export type JoinToRoomResponse = {
	joinToRoom: TradeRoom;
};

export type TradeRoom = {
	room_id: string;
	users: UserRoom[];
};

export type UserRoom = {
	user_id: string;
	username: string;
};

export type PreviewCardToTrade = {
	name: string;
	value: number;
	rarity: string;
	amount: number;
};
