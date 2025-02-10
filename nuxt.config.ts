export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: false },
	css: ['quill/dist/quill.snow.css'],
	modules: [
		'@nuxtjs/google-fonts',
		'@nuxtjs/tailwindcss',
		'nuxt-svgo',
		'@nuxt/image',
		'@primevue/nuxt-module',
		'@vueuse/nuxt',
	],
	tailwindcss: {
		viewer: false,
		cssPath: ['~/assets/tailwind.css', { injectPosition: 'first' }],
	},
	googleFonts: {
		families: {
			Jost: '100..900',
		},
		preload: true,
	},
	primevue: {},
	runtimeConfig: {
		mailHost: process.env.NUXT_MAIL_HOST,
		mailUser: process.env.NUXT_MAIL_USER,
		mailPass: process.env.NUXT_MAIL_PASS,
	},
	nitro: {
		preset: 'vercel',
	},
})
