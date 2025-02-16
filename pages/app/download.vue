<script setup lang="ts">
useHead({
	title: 'Download - Resume by Nii Aryeh',
})

definePageMeta({
	middleware: [async () => {
		const url = useState('url')
		if (!url.value) return navigateTo('/')
	}]
})
</script>

<template lang="pug">
section#download(class='h-screen bg-zinc-200 flex flex-col items-center justify-center overflow-hidden')
	div(class="flex flex-col space-y-6")
		p(class="text-4xl font-light tracking-tight text-brand-black") Your #[span(class="text-brand-accent") re]sume has been sent to your email.
		button(class="text-white bg-brand-accent hover:bg-brand-hover p-2 tracking-tight uppercase text-xs font-medium w-fit mx-auto" @click="$router.go(-1)") Edit resume
</template>