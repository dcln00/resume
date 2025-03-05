export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event)
	const body = await readBody(event)

	try {
		const res: { candidates: { content: { parts: { text: string }[] } }[] } = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`, {
			method: 'POST',
			body: {
				contents: [{ parts: [{ text: `${body.prompt}` }] }],
				systemInstruction: {
					role: 'user',
					parts: [
						{text: 'Paraphrase the following text in a professional format'}
					]
				},
				generationConfig: {
					temperature: 1,
					topK: 40,
					topP: 0.95,
					maxOutputTokens: 8192,
					responseMimeType: 'application/json',
					responseSchema: {
					type: 'string',
					}
				}
			},
		})
	
		return res.candidates[0].content.parts[0].text
	} catch (e) {
		console.error(e)
		throw createError({ statusCode: 500, message: "Error with Gemini API" })
	}
})