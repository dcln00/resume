<script setup lang="ts">
const url = useState('url')
const screenshot = useState('screenshot')
const email = useState('email')

useHead({
	title: 'Download - Resume by Nii Aryeh',
})

definePageMeta({
	middleware: [async () => {
		const url = useState('url')
		if (!url.value) return navigateTo('/')
	}]
})

// const handleDownload = async () => {
// 	const res = await $fetch('/api/mail', {
// 		method: 'post',
// 		body: {
// 			to: email.value,
// 			subject: 'Here is your Resume/CV',
// 			file: url.value,
// 		},
// 	})

// 	if(!res) {
// 		throw createError({
// 			statusCode: 500,
// 			statusMessage: 'Error sending mail',
// 		})
// 	}
// }
</script>

<template lang="pug">
section#download(class='h-screen bg-zinc-200 flex items-center justify-center gap-12 overflow-hidden')
	div(class="flex flex-col space-y-3")
		a(v-if="url" :href="url" download="Resume")
			button(class="text-white bg-brand-accent hover:bg-brand-hover p-2 tracking-tight uppercase text-xs font-medium") Download resume
		button(class="text-white bg-brand-accent hover:bg-brand-hover p-2 tracking-tight uppercase text-xs font-medium" @click="$router.go(-1)") Edit resume
	.photo(class="pointer-events-none relative")
		NuxtImg(:src="screenshot" width="500")
</template>