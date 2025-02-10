<script setup lang="ts">
import { useStorage, useElementSize } from '@vueuse/core'
const { $screenshot, $pdf } = useNuxtApp() as any

useHead({
	title: 'App - Resume by Nii Aryeh',
})

definePageMeta({
	middleware: [async () => {
		const email = useState('email')
		if (!email.value) return navigateTo('/')
	}]
})

const input = useStorage('resume-input', {
	name: 'Nii Aryeh',
	phone: '+233 20 123 4567',
	email: 'work@niiaryeh.com',
	social: 'linkedin.com/',
	education: [
		{
			institution: 'University of Ghana',
			programme: 'BSc. Business Administration',
			date: '2015 - 2019',
		},
	],
	experience: [
		{
			position: 'Software Developer',
			company: '22 Design Studios',
			date: '2020 - Current',
			location: 'Accra, Ghana',
			description: '<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Worked with a variety of clients to create and execute creative concepts as well as manage projects from start to finish.</li></ol>',
		},
	],
	skills: [
		{
			name: 'Software Development',
			summary: '<p>Languages: HTML/CSS, Javascript, Python, Typescript</p><p>Frameworks: React, TailwindCSS, Nodejs</p>',
		},
		
	],
	projects: [
		{
			name: 'Streamlab',
			portfolio: 'streamlab.niiaryeh.com',
			date: '2022',
			summary: '<p>Developed using vue fundamentals including hooks, components and conditional rendering</p><p>Movie database app built with Nuxt 3 + typescript</p>',
		},
	],
	references: [
		{
			reference: `<p><strong>Dr. John Doe</strong></p><p>Self Employed</p><p>0240123456</p>`
		}
	],
	footer: {
			name: 'Portfolio',
			summary: `niiaryeh.com`
		}
})

const show = ref(true)
const showSkills = ref(true)
const showProjects = ref(true)
const showReferences = ref(true)
const showFooter = ref(false)
const resume = ref(null)
const screenshot = useState('screenshot', () => '')
const url = useState('url', () => null)
const trigger = ref(null)
const isSaving = ref(false)
const width = ref(0)
const height = ref(0)

onNuxtReady(() => {
	const { width: w, height: h } = useElementSize(resume)
	width.value = w.value
	height.value = h.value
	console.log(width.value, height.value)
})

const capture = async () => {
	try {
		isSaving.value = true

		if (resume.value) {
			const canvas = await $screenshot(resume.value, {
				scale: 3
			})
			screenshot.value = canvas
			const pdf = new $pdf({
				orientation: "p",
				unit: "px",
				format: [width.value, height.value]
			})
			const img = pdf.getImageProperties(screenshot.value)
			const pdfw = pdf.internal.pageSize.getWidth()
			const pdfh = (img.height * pdfw) / img.width
			pdf.addImage(screenshot.value, 'PNG', 0, 0, pdfw, pdfh)
			url.value = pdf.output('bloburi')

			await navigateTo('/app/download')
		}
	} catch(e) {
		console.log(e)
	} finally {
		isSaving.value = false
	}
}

/* 
useResizeObserver(resBody, (entries) => {
	// console.log(typeof pageOne.value.textContent)
const entry = entries[0]
const { height } = entry.contentRect

if ((height + 143) > (pageOne.value.clientHeight - 192)) {
	pageTwo.value.append(rez.value)
}

if ((height + 286) > (pageOne.value.clientHeight - 192)) {
	rez.value.before(pro.value)
}
})
})
*/

const toggleShow = () => {
	show.value = !show.value
}

const handleClearInput = () => {
	input.value.name = ''
	input.value.phone = ''
	input.value.email = ''
	input.value.social = ''
	input.value.education = []
	input.value.experience = []
	input.value.skills = []
	input.value.projects = []
	input.value.references = []
	input.value.footer.name = ''
	input.value.footer.summary = ''
}

const handleAddEducation = () => {
	input.value.education.push({
		institution: '',
		programme: '',
		date: '',
	})
}

const handleRemoveEducation = (idx: number) => {
	input.value.education.splice(idx, 1)
}

const handleAddExperience = () => {
	input.value.experience.push({
		position: '',
		company: '',
		date: '',
		location: '',
		description: '',
	})
}

const handleRemoveExperience = (idx: number) => {
	input.value.experience.splice(idx, 1)
}

const handleAddSkills = () => {
	input.value.skills.push({
		name: '',
		summary: '',
	})
}

const handleRemoveSkills = (idx: number) => {
	input.value.skills.splice(idx, 1)
}

const handleAddProjects = () => {
	input.value.projects.push({
		name: '',
		portfolio: '',
		date: '',
		summary: '',
	})
}

const handleRemoveProjects = (idx: number) => {
	input.value.projects.splice(idx, 1)
}

const handleAddReferences = () => {
	input.value.references.push({
		reference: '',
	})
}

const handleRemoveReferences = (idx: number) => {
	input.value.references.splice(idx, 1)
}
</script>

<template lang="pug">
section#body-outlet
	div(class="flex flex-wrap")
		div(v-if="show" :class="['w-full lg:w-1/3 p-4 h-screen overflow-auto bg-zinc-200']")
			header(class="flex items-center space-x-4")
				button(v-if="isSaving" class="ms-auto block bg-brand-accent text-white text-xs uppercase h-8 w-[104px] hover:bg-brand-hover")
					svgo-spinner(class="mx-auto")
				button(v-else class="ms-auto block bg-brand-accent text-white text-xs uppercase p-2 hover:bg-brand-hover" @click="capture") save changes
				button(class="ms-auto block bg-red-500 text-white text-xs uppercase p-2 hover:bg-red-600" @click="handleClearInput") Clear input fields
				svgo-close(class="text-2xl text-red-500 hover:text-red-600 cursor-pointer" @click="toggleShow")
			form(novalidate class="space-y-12 *:border-b *:border-zinc-300 *:pb-8 last:border-b-0")
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Profile
					div(class="flex flex-wrap")
						.input-group
							label(for="name") Full Name
							input(type="text" id="name" name="name" required v-model="input.name" placeholder="Enter your full name")
						.input-group
							label(for="phone") Phone Number
							input(type="text" id="phone" name="phone" v-model="input.phone" placeholder="Enter your phone number")
						.input-group(class="lg:w-1/2")
							label(for="email") Email
							input(type="text" id="email" name="email" v-model="input.email" placeholder="abc@gmail.com")
						.input-group(class="lg:w-1/2")
							label(for="social") Social Media Url
							input(type="text" id="social" name="social" v-model="input.social" placeholder="linkedin.com/in/")
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Education
					div
						div(v-for="(ed, idx) in input.education" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
							.input-group
								label(:for="`institution${idx}`") Institution
								input(type="text" :id="`institution${idx}`" :name="`institution${idx}`" required v-model="ed.institution" placeholder="University of Ghana")
							.input-group(:class="[{'lg:w-1/2': input.education.length === 1}, {'lg:w-5/12': input.education.length > 1}]")
								label(:for="`programme${idx}`") Programme
								input(type="text" :id="`programme${idx}`" :name="`programme${idx}`" v-model="ed.programme" placeholder="Bsc Computer Science")
							.input-group(:class="[{'lg:w-1/2': input.education.length === 1}, {'lg:w-5/12': input.education.length > 1}]")
								label(:for="`ed-date${idx}`") Date or Date Range
								input(type="text" :id="`ed-date${idx}`" :name="`ed-date${idx}`" v-model="ed.date" placeholder="2015 - 2019")
							.delete-input(v-if="input.education.length > 1" class="max-lg:pt-4 lg:translate-x-5 lg:translate-y-10 cursor-pointer max-lg:ms-auto" @click="handleRemoveEducation(idx)")
								svgo-delete(class="text-2xl text-red-500")
					.button(class="mt-8")
						button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddEducation") Add Education
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Experience
					div
						div(v-for="(ex, idx) in input.experience" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
							.input-group
								label(:for="`position${idx}`") Position
								input(type="text" :id="`position${idx}`" :name="`position${idx}`" required v-model="ex.position" placeholder="Software Developer")
							.input-group
								label(:for="`company${idx}`") Company
								input(type="text" :id="`company${idx}`" :name="`company${idx}`" v-model="ex.company" placeholder="22 Design Studio")
							.input-group(class="lg:w-1/2")
								label(:for="`ex-date${idx}`") Date or Date Range
								input(type="text" :id="`ex-date${idx}`" :name="`ex-date${idx}`" v-model="ex.date" placeholder="2020 - current")
							.input-group(class="lg:w-1/2")
								label(:for="`location${idx}`") Location
								input(type="text" :id="`location${idx}`" :name="`location${idx}`" v-model="ex.location" placeholder="Accra, Ghana")
							.input-group
								label(:for="`description${idx}`") Summary
								Editor(v-model="ex.description" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="- Designed and implemented responsive user interfaces with Figma, ensuring a smooth and intuitive experience across desktop and mobile devices.")
									template(v-slot:toolbar)
										span(class="ql-formats")
											button(class="ql-bold")
											button(class="ql-italic")
											button(class="ql-underline")
											button(class="ql-list" value="ordered")
											button(class="ql-list" value="bullet")
							//- .button(class="p-2")
								button(type="button" class="w-full bg-brand-accent text-white text-xs uppercase p-2") Paraphrase with AI
							.delete-input(v-if="input.experience.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveExperience(idx)")
								svgo-delete(class="text-2xl text-red-500")
					.button(class="mt-8")
						button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddExperience") Add Experience
				div
					div(class="pb-6 flex items-center")
						.form-title(class="uppercase font-bold tracking-tight text-lg") Skills
						Toggle(class="ms-auto cursor-pointer" @toggle="() => showSkills = !showSkills" :trigger="showSkills")
					div(class="relative")
						Overlay(v-if="!showSkills")
						div
							div(v-for="(skill, idx) in input.skills" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
								.input-group
									label(:for="`skill-name${idx}`") Name
									input(type="text" :id="`skill-name${idx}`" :name="`skill-name${idx}`" required v-model="skill.name" placeholder="Graphic Design")
								.input-group
									label(:for="`skill-summary${idx}`") Summary
									Editor(v-model="skill.summary" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="Tools: Adobe Photoshop, Adobe Illustrator")
										template(v-slot:toolbar)
											span(class="ql-formats")
												button(class="ql-bold")
												button(class="ql-italic")
												button(class="ql-underline")
												button(class="ql-list" value="ordered")
												button(class="ql-list" value="bullet")
								.delete-input(v-if="input.skills.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveSkills(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddSkills") Add Skill
				div
					div(class="pb-6 flex items-center")
						.form-title(class="uppercase font-bold tracking-tight text-lg") Projects
						Toggle(class="ms-auto cursor-pointer" @toggle="() => showProjects = !showProjects" :trigger="showProjects")
					div(class="relative")
						Overlay(v-if="!showProjects")
						div
							div(v-for="(project, idx) in input.projects" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
								.input-group
									label(:for="`project-name${idx}`") Name
									input(type="text" :id="`project-name${idx}`" :name="`project-name${idx}`" required v-model="project.name" placeholder="Invoice App")
								.input-group(class="lg:w-1/2")
									label(:for="`portfolio${idx}`") Portfolio Url
									input(type="text" :id="`portfolio${idx}`" :name="`portfolio${idx}`" required v-model="project.portfolio" placeholder="vercel.com")
								.input-group(class="lg:w-1/2")
									label(:for="`project-date${idx}`") Date
									input(type="text" :id="`project-date${idx}`" :name="`project-date${idx}`" required v-model="project.date" placeholder="2022")
								.input-group
									label(:for="`project-summary${idx}`") Summary
									//- textarea(:id="`project-summary${idx}`" :name="`project-summary${idx}`" v-model="project.summary" rows="4")
									Editor(v-model="project.summary" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="Developed using react fundamentals including hooks, components and conditional rendering")
										template(v-slot:toolbar)
											span(class="ql-formats")
												button(class="ql-bold")
												button(class="ql-italic")
												button(class="ql-underline")
												button(class="ql-list" value="ordered")
												button(class="ql-list" value="bullet")
								.delete-input(v-if="input.projects.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveProjects(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddProjects") Add Project
				div
					div(class="pb-6 flex items-center")
						.form-title(class="uppercase font-bold tracking-tight text-lg") References
						Toggle(class="ms-auto cursor-pointer" @toggle="() => showReferences = !showReferences" :trigger="showReferences")
					div(class="relative")
						Overlay(v-if="!showReferences")
						div
							div(v-for="(ref, idx) in input.references" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
								.input-group
									label(:for="`ref-${idx}`") Reference
									Editor(v-model="ref.reference" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="Dr John Doe")
										template(v-slot:toolbar)
											span(class="ql-formats")
												button(class="ql-bold")
												button(class="ql-italic")
												button(class="ql-underline")
												button(class="ql-list" value="ordered")
												button(class="ql-list" value="bullet")
								.delete-input(v-if="input.references.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveReferences(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddReferences") Add Reference
				//- FOOTER
				div
					div(class="pb-6 flex items-center")
						.form-title(class="uppercase font-bold tracking-tight text-lg") Footer
						Toggle(class="ms-auto cursor-pointer" @toggle="() => showFooter = !showFooter" :trigger="showFooter")
					div(class="relative")
						Overlay(v-if="!showFooter")
						div
							div(class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
								.input-group
									label(for="footer-name") Name
									input(type="text" id="footer-name" name="footer-name" required v-model="input.footer.name" placeholder="Portfolio")
								.input-group
									label(for="footer") Title
									Editor(v-model="input.footer.summary" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="niiaryeh.com")
										template(v-slot:toolbar)
											span(class="ql-formats")
												button(class="ql-bold")
												button(class="ql-italic")
												button(class="ql-underline")
												button(class="ql-list" value="ordered")
												button(class="ql-list" value="bullet")
			div(class="flex items-center justify-center py-3 space-x-2")
				svgo-cloud-off(class="text-zinc-500 text-xl")
				p(class="text-center text-zinc-500 text-sm") Your data is saved offline in your browser
			button(v-if="isSaving" class="w-full bg-brand-accent text-white text-xs uppercase h-9 hover:bg-brand-hover")
				svgo-spinner(class="mx-auto")
			button(v-else class="w-full bg-brand-accent text-white text-xs uppercase h-9 hover:bg-brand-hover" @click="capture") Save Changes

		div(:class="['w-2/3 p-4 max-lg:px-0 h-screen bg-[#121212] overflow-auto relative', {'!w-full' : !show}]")
			svgo-hamburger(v-if="!show" class="absolute top-5 left-4 text-white text-xl cursor-pointer" @click="toggleShow")
			.resume(ref="resume" :class="['relative w-[8in] bg-white origin-top-left mx-auto pt-[1in] px-[.5in] flex flex-col', {'pb-[.5in]': showFooter}, {'pb-[1in]': !showFooter}]")
				//- .trigger(ref="trigger" class="absolute bottom-[1in] left-0 w-full h-[1px]")
				header(class=" mb-8")
					h1(class="text-center text-xl uppercase font-black tracking-tight") {{ input.name }}
					.sub(class="text-center *:text-[8.5pt] space-x-1")
						span(v-if="input.phone" class="after:content-['|'] last:after:content-[''] after:ps-1") {{ input.phone }}
						span(v-if="input.email" class="after:content-['|'] last:after:content-[''] after:ps-1") {{ input.email }}
						span(v-if="input.social" class="after:content-['|'] last:after:content-['']") {{ input.social }}
				.resume-body(:class="['space-y-4', {'pb-[1in]': showFooter}]")
					section#education
						h2.resume-title Education
						.details(v-for="(ed, idx) in input.education" :key="idx" class="flex pb-4 *:text-[10pt]")
							div
								.institution(class="font-semibold tracking-tight") {{ ed.institution }}
								.programme {{ ed.programme }}
							div(class="ms-auto")
								.date {{ ed.date }}
					section#experience
						h2.resume-title Experience
						.details(v-for="(ex, idx) in input.experience" :key="idx" class="flex pb-4 *:text-[10pt]")
							div
								.position(class="font-semibold tracking-tight") {{ ex.position }}
								.company {{ ex.company }} // {{ ex.location }}
								.summary(class="text-[9pt] w-3/4 ps-2 mt-2 *:has-[li]:list-disc" v-html="ex.description")
							div(class="flex-shrink-0 ms-auto")
								.date {{ ex.date }}
					section#skills(v-if="showSkills")
						h2.resume-title skills
						.details(v-for="(skill, idx) in input.skills" :key="idx" class="flex pb-4 *:text-[10pt]")
							div
								.name(class="font-semibold tracking-tight") {{ skill.name }}
								.summary(v-html="skill.summary")
					section#projects(v-if="showProjects")
						h2.resume-title Projects
						.details(v-for="(project, idx) in input.projects" :key="idx" class="flex pb-4 *:text-[10pt]")
							div
								.name(class="font-semibold tracking-tight") {{ project.name }} #[span(v-if="project.portfolio") //] #[span(class="font-normal") {{ project.portfolio }}]
								.summary(class="*:has-[li]:list-disc *:has-[li]:ps-2" v-html="project.summary")
							div(class="flex-shrink-0 ms-auto")
								.date {{ project.date }}
					section#ref(v-if="showReferences")
						h2.resume-title References
						div(class="flex -m-4")
							.details(v-for="(ref, idx) in input.references" :key="idx" class="p-4 *:text-[10pt]")
								.ref(v-html="ref.reference" class="*:has-[li]:list-disc *:has-[li]:ps-2")

				footer(v-if="showFooter" class="*:text-[10pt]")
					.footer-title(class="font-semibold tracking-tight") {{ input.footer.name }}
					.footer-text {{ input.footer.summary }}

			//- .resume(class="w-[8in] h-[11in] bg-white origin-top-left mx-auto py-[1in] px-[.5in]")
				.resume-body(ref="pageTwo" class="space-y-4")
</template>

<style>
.ql-editor ol li:before {
	content: '';
}
</style>