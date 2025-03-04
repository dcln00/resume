export function lineBlock(text: string) {
	return text.replace(/^["']?(.*?)["']?$/, '$1').replace(/([.])\s+/g, "$1\n\n")
}

export function removeQuotes(text: string) {
	return text.replace(/^["']?(.*?)["']?$/, '$1')
}