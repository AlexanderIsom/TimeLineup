import { FriendStatusAndProfile } from "@/actions/friendActions";
import { NotificationQuery } from "@/actions/notificationAction";
import { create } from "zustand";

interface NotificationsState {
	totalNotificaionCount: number;
	notifications: NotificationQuery;
	friendRequests: FriendStatusAndProfile;
	setInitialState: (notifications: NotificationQuery, friendRequests: FriendStatusAndProfile) => void;
	removeNotification: (id: string) => void;
	removeFriendRequest: (id: string) => void;
}

export const useNotificationStore = create<NotificationsState>()((set, get) => ({
	totalNotificaionCount: 0,
	notifications: [],
	friendRequests: [],
	setInitialState: (notifications: NotificationQuery, friendRequests: FriendStatusAndProfile) => {
		set((state) => {
			const totalCount = (friendRequests?.length ?? 0) + (notifications?.length ?? 0);
			return {
				notifications: notifications,
				totalNotificaionCount: totalCount,
				friendRequests: friendRequests,
			};
		});
	},
	removeNotification: (id: string) => {
		set((state) => {
			if (state.notifications === undefined) return state;
			const notifications = state.notifications.filter(({ id: notificationId }) => notificationId !== id);
			const totalCount = (state.friendRequests?.length ?? 0) + (notifications?.length ?? 0);
			return {
				...state,
				notifications: notifications,
				totalNotificaionCount: totalCount,
			};
		});
	},
	removeFriendRequest: (id: string) => {
		set((state) => {
			if (state.friendRequests === undefined) return state;
			const friendRequests = state.friendRequests.filter(({ id: requestId }) => requestId !== id);
			const totalCount = (friendRequests?.length ?? 0) + (state.notifications?.length ?? 0);
			return {
				...state,
				friendRequests: friendRequests,
				totalNotificaionCount: totalCount,
			};
		});
	},
}));
