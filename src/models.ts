import moment from 'moment'

export interface DownItem {
	value: string;
	dateAdded: string;
	tag?: string;
}

export const DownItemFactory = (value: string) => {
	return { value, dateAdded: new Date().toISOString()}
}

export const displayDate = (date: string) => {
	return moment(date).fromNow()
}

export interface OrganizedDownItem extends DownItem {
	tag: string
}