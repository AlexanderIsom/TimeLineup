import { FriendStatusAndProfile } from "@/actions/friendActions";
import { NotificationQuery } from "@/actions/notificationAction";
import { create } from "zustand";

interface NotificationsState {
	totalNotificaionCount: number;
	notifications: NotificationQuery;
	friendRequests: FriendStatusAndProfile;
	setInitialState: (notifications: NotificationQuery, friendRequests: FriendStatusAndProfile) => void;
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
			}
		})
	},
}));