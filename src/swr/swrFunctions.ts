"use client";

import { GetEventData } from "@/actions/eventActions";
import { getFriends } from "@/actions/friendActions";
import { getNotifications } from "@/actions/notificationAction";
import { getUserProfile } from "@/actions/profileActions";
import useSwr from "swr";

export function useProfile() {
	const { data, isLoading, error } = useSwr("/api/user/", getUserProfile);
	return { profile: data, isLoading, isError: error };
}

export function useFriends() {
	const { data, isLoading, error } = useSwr("/api/friends/", getFriends);
	return { friends: data, isLoading, isError: error };
}

export function useNotifications() {
	const { data, isLoading, error } = useSwr("/api/notifications/", getNotifications);
	return { notifications: data, isLoading, isError: error };
}

export function useEventData(id: string) {
	const { data, isLoading, error } = useSwr(id, GetEventData);
	return { eventData: data, isLoading, isError: error };
}
