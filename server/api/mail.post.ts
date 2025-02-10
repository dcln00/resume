import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const config = useRuntimeConfig(event)

	const transporter = nodemailer.createTransport({
		host: config.mailHost,
		port: 587,
		auth: {
			user: config.mailUser,
			pass: config.mailPass,
		},
		tls: {
			rejectUnauthorized: false,
		},
	})

	await transporter.sendMail({
		from: config.mailUser,
		to: body.to,
		subject: body.subject,
		attachments: [
			{
				filename: "resume.pdf",
				path: body.file
			},
		]
	})

	return { message: 'Email sent' }
})