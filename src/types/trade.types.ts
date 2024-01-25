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
