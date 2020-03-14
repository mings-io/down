import { AsyncStorage } from "react-native";

export const storageKey = 'down.v1'

export const storeData = async (data: any) => {
	try {
		await AsyncStorage.setItem(storageKey, JSON.stringify(data));
	} catch (error) {
		console.log(error)
	}
};

export const retrieveData = async () => {
	try {
		const value = await AsyncStorage.getItem(storageKey);
		if (value) {
		return JSON.parse(value)
		} else {
			return []
		}
	} catch (error) {
		console.log(error)
	}
};

export const appendData = async (item: any) => {
	const data = await retrieveData()
	data.push(item)
	await storeData(data)
}