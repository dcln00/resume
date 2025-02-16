export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event)
	const body = await readBody(event)

	try {
		const res: { choices: { message: { content: string } }[] } = await $fetch("https://api.openai.com/v1/chat/completions", {
			method: 'POST',
			headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${config.openaiApiKey}`,
			},
			body: {
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: "You are an assistant that paraphrases text." },
				{ role: "user", content: `Paraphrase this: "${body.text}"` },
			],
			temperature: 0.5,
			max_tokens: 50
			},
		})
	
		return res.choices[0].message.content
	} catch (e) {
		console.error(e)
		throw createError({ statusCode: 500, message: "Error with OpenAI API" })
	}
})