<script setup lang="ts">
defineProps(['input'])

const res = ref(null)

defineExpose({
	res
})
</script>

<template lang="pug">
.resume(ref="res" :class="['relative w-[8.5in] min-h-[11in] bg-white origin-top-left mx-auto py-[.7in] px-[.5in] flex flex-col !font-custom', {'pb-[1in]': input.footer.show}]")
	//- .trigger(ref="trigger" class="absolute bottom-[1in] left-0 w-full h-[1px]")
	header(class=" mb-8 !font-custom")
		h1(class="text-center text-xl uppercase font-black tracking-tight") {{ input.profile.name }}
		.sub(class="text-center *:text-[8.5pt] space-x-1")
			span(v-if="input.profile.phone" class="after:content-['|'] last:after:content-[''] after:ps-1") {{ input.profile.phone }}
			span(v-if="input.profile.email" class="after:content-['|'] last:after:content-[''] after:ps-1") {{ input.profile.email }}
			span(v-if="input.profile.social" class="after:content-['|'] last:after:content-['']") {{ input.profile.social }}
	.resume-body(class="space-y-4 !font-custom")
		section#summary(v-if="input.summary.show")
			h2.resume-title {{ input.summary.title.name }}
			.details(v-if="input.summary.data")
				div(v-html="input.summary.data" class="text-[10pt] pb-4")
		section#education(v-if="input.education.show")
			h2.resume-title {{ input.education.title.name }}
			.details(v-for="(ed, idx) in input.education.data" :key="idx" class="flex pb-4 *:text-[10pt]")
				div
					.institution(class="font-semibold tracking-tight") {{ ed.institution }}
					.programme {{ ed.programme }}
				div(class="ms-auto")
					.date {{ ed.date }}
		section#experience(v-if="input.experience.show")
			h2.resume-title {{ input.experience.title.name }}
			.details(v-for="(ex, idx) in input.experience.data" :key="idx" class="flex pb-4 *:text-[10pt]")
				div
					.position(class="font-semibold tracking-tight") {{ ex.position }}
					.company {{ ex.company }} // {{ ex.location }}
					.summary(class="text-[9pt] w-3/4 ps-2 mt-2 *:has-[li]:list-disc" v-html="ex.description")
				div(class="flex-shrink-0 ms-auto")
					.date {{ ex.date }}
		section#skills(v-if="input.skills.show")
			h2.resume-title {{ input.skills.title.name }}
			.details(v-for="(skill, idx) in input.skills.data" :key="idx" class="flex pb-4 *:text-[10pt]")
				div
					.name(class="font-semibold tracking-tight") {{ skill.name }}
					.summary(v-html="skill.summary")
		section#projects(v-if="input.projects.show")
			h2.resume-title {{ input.projects.title.name }}
			.details(v-for="(project, idx) in input.projects.data" :key="idx" class="flex pb-4 *:text-[10pt]")
				div
					.name(class="font-semibold tracking-tight") {{ project.name }} #[span(v-if="project.portfolio") //] #[span(class="font-normal") {{ project.portfolio }}]
					.summary(class="*:has-[li]:list-disc *:has-[li]:ps-2" v-html="project.summary")
				div(class="flex-shrink-0 ms-auto")
					.date {{ project.date }}
		section#ref(v-if="input.references.show")
			h2.resume-title {{ input.references.title.name }}
			div(class="flex -m-4")
				.details(v-for="(ref, idx) in input.references.data" :key="idx" class="p-4 *:text-[10pt]")
					.ref(v-html="ref.reference" class="*:has-[li]:list-disc *:has-[li]:ps-2")

	footer(v-if="input.footer.show" class="*:text-[10pt] absolute bottom-[.5in] !font-custom")
		.footer-title(class="font-semibold tracking-tight") {{ input.footer.data.name }}
		.footer-text {{ input.footer.data.summary }}
</template>