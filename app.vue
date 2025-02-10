<script setup lang="ts">
useHead({
	title: 'Resume by Nii Aryeh',
})

useSeoMeta({
	title: 'Resume by Nii Aryeh',
	ogTitle: 'Resume by Nii Aryeh',
	description: `Create and export your resume in 3 easy steps`,
	ogDescription: `Create and export your resume in 3 easy steps`,
	ogImageAlt: 'Resume by Nii Aryeh',
	ogUrl: 'https://resume.niiaryeh.com/',
	twitterTitle: 'Resume by Nii Aryeh',
	twitterDescription: 'Create and export your resume in 3 easy steps',
	twitterCard: 'summary_large_image',
	ogType: 'website',
	ogImageWidth: 1200,
	ogImageHeight: 600,
})

const show = ref(true)
</script>

<template lang="pug">
#banner(v-if="show" class="relative py-2 bg-neutral-800 text-sm text-white flex items-center justify-center px-4")
	NuxtLink(to="https://paystack.com/pay/resume-by-niiaryeh")
		div(class="flex space-x-4 group")
			p Support Resume by Nii Aryeh
			svgo-arrow(class="text-xl rotate-180 group-hover:translate-x-2 duration-150")
	svgo-close(class="absolute right-4 text-xl cursor-pointer hover:scale-90" @click="() => show = !show")
NuxtPage
</template>