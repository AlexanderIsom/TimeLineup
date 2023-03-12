export interface timeWindow {
	startTime: Date;
	endTime: Date;
}

export interface fakeDataLayout {
	userName: string;
	userImageUrl: string;
	avaliableWindows: timeWindow[];
}

enum AvaliableUserImages {
	"https://cdn.discordapp.com/avatars/202124390819823616/2f0e8e49ce678d7e39656f5cbb75875c.png",
	"https://cdn.discordapp.com/avatars/678313274361774097/f0cf1a0fd943fa9dfa503d2107085534.webp?size=4096",
	"https://cdn.discordapp.com/avatars/271716211224608770/caecf7ae19bcf5a38965b9b81f293241.webp?size=4096",
	"https://cdn.discordapp.com/avatars/457206727218167829/716168b5dc411e336c4e00458e17df32.webp?size=4096"
}

enum AvaliableUserNames {
	"Alex", "Josh", "Felix", "Zol", "others"
}

function randomTimeDuration(from: Date, to: Date) {
	const fromTime = from.getTime();
	const toTime = to.getTime();
	return new Date(fromTime + Math.random() * (toTime - fromTime))
}

const randomEnumKey = (enumeration: any) => {
	const keys = Object.keys(enumeration).filter(
		k => !(Math.abs(Number.parseInt(k)) + 1)
	);
	const enumKey = keys[Math.floor(Math.random() * keys.length)];
	return enumKey;
};

function randomIntBetween(min: number, max: number) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export function GenerateFakeData(items = 10, maxWindows = 2) {
	const startOfDay = new Date()

	startOfDay.setHours(0, 0, 0)

	const endOfDay = new Date()
	endOfDay.setHours(23, 59, 59)
	console.log(startOfDay);
	console.log(endOfDay);
	console.log(randomTimeDuration(startOfDay, endOfDay));

	const data: fakeDataLayout[] = [];
	for (let index = 0; index < items; index++) {
		const newData = {} as fakeDataLayout;
		newData.userName = randomEnumKey(AvaliableUserNames);
		newData.userImageUrl = randomEnumKey(AvaliableUserImages);
		newData.avaliableWindows = [];
		const numberOfWindows = randomIntBetween(1, maxWindows);

		let previousEventEndTime: Date | undefined;

		for (let i = 0; i < numberOfWindows; i++) {
			const newWindow = {} as timeWindow;

			const startDate = previousEventEndTime !== undefined ? previousEventEndTime : startOfDay;
			newWindow.startTime = randomTimeDuration(startDate, endOfDay);
			newWindow.endTime = randomTimeDuration(newWindow.startTime, endOfDay);
			previousEventEndTime = newWindow.endTime;
			newData.avaliableWindows.push(newWindow);
		}
		data.push(newData);
	}
	return data;
}