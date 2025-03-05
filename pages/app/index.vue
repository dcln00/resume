<script setup lang="ts">
import { useStorage, useElementSize } from '@vueuse/core'
const { $screenshot, $pdf } = useNuxtApp() as any
const email = useState('email')

useHead({
	title: 'App - Resume by Nii Aryeh',
})

definePageMeta({
	middleware: [async () => {
		const email = useState('email')
		const router = useRouter()
		router.onError((error) => {
			localStorage.removeItem('resume')
		})
		if (!email.value) return navigateTo('/')
	}]
})

const input = useStorage('resume', {
	profile: {
		name: 'Your name here',
		phone: '+233 20 123 4567',
		email: 'abc@email.com',
		social: 'linkedin.com/',
	},
	summary: {
		title: {
			name: 'Summary',
			show: true
		},
		show: false,
		data: '<p>Self-motivated and detail-oriented digital marketer with a passion for creating engaging content. Proficient in social media marketing and email marketing. Experienced in creating and managing marketing campaigns.</p>',
	},
	education: {
		title: {
			name: 'Education',
			show: true
		},
		show: true,
		data: [
			{
				institution: 'Name of University',
				programme: 'BSc. Name of Programme',
				date: '2015 - 2019',
			},
		]
	},
	experience: {
		title: {
			name: 'Experience',
			show: true
		},
		show: true,
		data: [
			{
				position: 'Digital Marketer',
				company: 'Reputable Company',
				date: '2020 - Current',
				location: 'Accra, Ghana',
				description: '<ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. At accusamus molestiae provident, non cumque recusandae molestias dignissimos ullam id ut.</li></ol>',
				paraphrased:''
			},
		]
	},
	skills: {
		title: {
			name: 'Skills',
			show: true
		},
		show: true,
		data: [
			{
				name: 'Social Media Marketing',
				summary: '<p>Tools: Mailchimp, Google Ads, Pinterest</p>',
			},
		]
	},
	projects: {
		title: {
			name: 'Projects',
			show: true
		},
		show: true,
		data: [
			{
				name: 'Lorem Ipsum',
				portfolio: 'abc.com',
				date: '2022',
				summary: '<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. At accusamus molestiae provident.</p>',
			},
		]
	},
	references: {
		title: {
			name: 'References',
			show: true
		},
		show: true,
		data: [
			{
				reference: `<p><strong>Dr. John Doe</strong></p><p>Self Employed</p><p>0240123456</p>`
			}
		]
	},
	footer: {
		show: false,
		data: {
			name: 'Portfolio',
			summary: `lorem.com`
		}
	}
})

const show = ref(true)
const showSettings = ref(false)
const resume = ref()
const screenshot = useState('screenshot', () => '')
const url = useState('url', () => null)
const trigger = ref(null)
const isSaving = ref(false)
const isParaphrasing = ref(false)
const isSuggesting = ref(false)
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

		if (resume.value.res) {
			const canvas = await $screenshot(resume.value.res, {
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
			pdf.addImage(screenshot.value, 'PNG', 0, 0, pdfw, pdfh, undefined, 'FAST')
			url.value = pdf.output('datauristring')
			
			const res = await $fetch('/api/mail', {
				method: 'post',
				body: {
					to: email.value,
					subject: 'Here is your Resume/CV',
					file: url.value,
				},
			})

			if(!res) {
				throw createError({
					statusCode: 500,
					statusMessage: 'Error sending mail',
				})
			}
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
	showSettings.value = false
}

const toggleSettings = () => {
	showSettings.value = !showSettings.value
	show.value = false
}

const handleClearInput = () => {
	input.value.profile.name = ''
	input.value.profile.phone = ''
	input.value.profile.email = ''
	input.value.profile.social = ''
	input.value.summary.data = ''
	input.value.education.data = []
	input.value.experience.data = []
	input.value.skills.data = []
	input.value.projects.data = []
	input.value.references.data = []
	input.value.footer.data.name = ''
	input.value.footer.data.summary = ''
}

const handleAddEducation = () => {
	input.value.education.data.push({
		institution: '',
		programme: '',
		date: '',
	})
}

const handleRemoveEducation = (idx: number) => {
	input.value.education.data.splice(idx, 1)
}

const handleAddExperience = () => {
	input.value.experience.data.push({
		position: '',
		company: '',
		date: '',
		location: '',
		description: '',
		paraphrased: ''
	})
}

const handleRemoveExperience = (idx: number) => {
	input.value.experience.data.splice(idx, 1)
}

const paraphrase = async (idx: number) => {

	try {
		isParaphrasing.value = true

		const res = await $fetch('/api/ai/paraphrase', {
			method: 'POST',
			body: { prompt: input.value.experience.data[idx].description },
		})
	
		input.value.experience.data[idx].paraphrased = res
	} catch(e) {
		console.log(e)
	} finally {
		isParaphrasing.value = false
	}
}

const aiSuggestion = async () => {
	try {
		isSuggesting.value = true

		const jobTitle = prompt('Enter Your Job Title eg. Graphic Designer')

		if (!jobTitle) return

		const res = await $fetch('/api/ai/suggestion', {
			method: 'POST',
			body: { prompt: `as a ${jobTitle}, write a 30-50 word brief summary for a cv` },
		})
	
		input.value.summary.data = removeQuotes(res)
	} catch(e) {
		console.log(e)
	} finally {
		isSuggesting.value = false
	}
}

const handleAddSkills = () => {
	input.value.skills.data.push({
		name: '',
		summary: '',
	})
}

const handleRemoveSkills = (idx: number) => {
	input.value.skills.data.splice(idx, 1)
}

const handleAddProjects = () => {
	input.value.projects.data.push({
		name: '',
		portfolio: '',
		date: '',
		summary: '',
	})
}

const handleRemoveProjects = (idx: number) => {
	input.value.projects.data.splice(idx, 1)
}

const handleAddReferences = () => {
	input.value.references.data.push({
		reference: '',
	})
}

const handleRemoveReferences = (idx: number) => {
	input.value.references.data.splice(idx, 1)
}
</script>

<template lang="pug">
section#body-outlet
	div(class="flex")
		div(v-if="show" class="w-full lg:w-1/3 p-4 h-screen overflow-auto bg-zinc-200")
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
							input(type="text" id="name" name="name" required v-model="input.profile.name" placeholder="Enter your full name")
						.input-group
							label(for="phone") Phone Number
							input(type="text" id="phone" name="phone" v-model="input.profile.phone" placeholder="Enter your phone number")
						.input-group(class="lg:w-1/2")
							label(for="email") Email
							input(type="text" id="email" name="email" v-model="input.profile.email" placeholder="abc@gmail.com")
						.input-group(class="lg:w-1/2")
							label(for="social") Social Media Url
							input(type="text" id="social" name="social" v-model="input.profile.social" placeholder="linkedin.com/in/")
				div
					div(class="pb-6 flex items-center h-[60px]")
						div(class="flex items-center space-x-2")
							.form-title(v-if="input.summary.title.show" class="uppercase font-bold tracking-tight text-lg") {{ input.summary.title.name }}
							input(v-else type="text" maxlength="25" id="title" name="title" v-model="input.summary.title.name" @keyup.enter="() => input.summary.title.show = !input.summary.title.show")
							svgo-edit(v-if="input.summary.title.show" class="text-neutral-500 cursor-pointer" @click="() => input.summary.title.show = !input.summary.title.show")
							svgo-tick(v-else class="text-neutral-500 cursor-pointer" @click="() => input.summary.title.show = !input.summary.title.show")
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.summary.show = !input.summary.show" :trigger="input.summary.show")
					div(class="relative")
						Overlay(v-if="!input.summary.show")
						div
							.input-group
								label Summary
								Editor(v-model="input.summary.data" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="Self-motivated and detail-oriented digital marketer with a passion for creating engaging content.")
									template(v-slot:toolbar)
										span(class="ql-formats")
											button(class="ql-bold")
											button(class="ql-italic")
											button(class="ql-underline")
											button(class="ql-list" value="ordered")
											button(class="ql-list" value="bullet")
							.button(class="p-2")
								button(v-if="!isSuggesting" type="button" class="w-full bg-brand-accent hover:bg-brand-hover text-white text-xs uppercase p-2" @click="aiSuggestion()") Suggestions with gemini AI
								button(v-else type="button" class="w-full bg-brand-accent hover:bg-brand-hover h-8 text-white text-xs uppercase p-2")
									svgo-spinner(class="mx-auto")
				div
					div(class="pb-6 flex items-center h-[60px]")
						div(class="flex items-center space-x-2")
							.form-title(v-if="input.education.title.show" class="uppercase font-bold tracking-tight text-lg") {{ input.education.title.name }}
							input(v-else type="text" maxlength="25" id="title" name="title" v-model="input.education.title.name" @keyup.enter="() => input.education.title.show = !input.education.title.show")
							svgo-edit(v-if="input.education.title.show" class="text-neutral-500 cursor-pointer" @click="() => input.education.title.show = !input.education.title.show")
							svgo-tick(v-else class="text-neutral-500 cursor-pointer" @click="() => input.education.title.show = !input.education.title.show")
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.education.show = !input.education.show" :trigger="input.education.show")
					div(class="relative")
						Overlay(v-if="!input.education.show")
						div
							div(v-for="(ed, idx) in input.education.data" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
								.input-group
									label(:for="`institution${idx}`") Institution
									input(type="text" :id="`institution${idx}`" :name="`institution${idx}`" required v-model="ed.institution" placeholder="University of Ghana")
								.input-group(:class="[{'lg:w-1/2': input.education.data.length === 1}, {'lg:w-5/12': input.education.data.length > 1}]")
									label(:for="`programme${idx}`") Programme
									input(type="text" :id="`programme${idx}`" :name="`programme${idx}`" v-model="ed.programme" placeholder="Bsc Computer Science")
								.input-group(:class="[{'lg:w-1/2': input.education.data.length === 1}, {'lg:w-5/12': input.education.data.length > 1}]")
									label(:for="`ed-date${idx}`") Date or Date Range
									input(type="text" :id="`ed-date${idx}`" :name="`ed-date${idx}`" v-model="ed.date" placeholder="2015 - 2019")
								.delete-input(v-if="input.education.data.length > 1" class="max-lg:pt-4 lg:translate-x-5 lg:translate-y-10 cursor-pointer max-lg:ms-auto" @click="handleRemoveEducation(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddEducation") Add Education
				div
					div(class="pb-6 flex items-center h-[60px]")
						div(class="flex items-center space-x-2")
							.form-title(v-if="input.experience.title.show" class="uppercase font-bold tracking-tight text-lg") {{ input.experience.title.name }}
							input(v-else type="text" maxlength="25" id="title" name="title" v-model="input.experience.title.name" @keyup.enter="() => input.experience.title.show = !input.experience.title.show")
							svgo-edit(v-if="input.experience.title.show" class="text-neutral-500 cursor-pointer" @click="() => input.experience.title.show = !input.experience.title.show")
							svgo-tick(v-else class="text-neutral-500 cursor-pointer" @click="() => input.experience.title.show = !input.experience.title.show")
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.experience.show = !input.experience.show" :trigger="input.experience.show")
					div(class="relative")
						Overlay(v-if="!input.experience.show")
						div
							div(v-for="(ex, idx) in input.experience.data" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
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
								.button(class="p-2")
									button(v-if="!isParaphrasing" type="button" class="w-full bg-brand-accent hover:bg-brand-hover text-white text-xs uppercase p-2" @click="paraphrase(idx)") Paraphrase with gemini AI
									button(v-else type="button" class="w-full bg-brand-accent hover:bg-brand-hover h-8 text-white text-xs uppercase p-2")
										svgo-spinner(class="mx-auto")
								.input-group(v-if="ex.paraphrased" :class="[{'animate-pulse pointer-events-none': isParaphrasing}]")
									div(class="flex")
										label(for="paraphrased-text") Paraphrased Text
										label(class="ms-auto text-red-500 cursor-pointer" @click="() => ex.paraphrased = ''") Clear
									textarea(readonly id="paraphrased-text" name="paraphrased-text" rows="6") {{ lineBlock(ex.paraphrased) }}
								.delete-input(v-if="input.experience.data.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveExperience(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddExperience") Add Experience
				div
					div(class="pb-6 flex items-center h-[60px]")
						div(class="flex items-center space-x-2")
							.form-title(v-if="input.skills.title.show" class="uppercase font-bold tracking-tight text-lg") {{ input.skills.title.name }}
							input(v-else type="text" maxlength="25" id="title" name="title" v-model="input.skills.title.name" @keyup.enter="() => input.skills.title.show = !input.skills.title.show")
							svgo-edit(v-if="input.skills.title.show" class="text-neutral-500 cursor-pointer" @click="() => input.skills.title.show = !input.skills.title.show")
							svgo-tick(v-else class="text-neutral-500 cursor-pointer" @click="() => input.skills.title.show = !input.skills.title.show")
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.skills.show = !input.skills.show" :trigger="input.skills.show")
					div(class="relative")
						Overlay(v-if="!input.skills.show")
						div
							div(v-for="(skill, idx) in input.skills.data" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
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
								.delete-input(v-if="input.skills.data.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveSkills(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddSkills") Add Skill
				div
					div(class="pb-6 flex items-center h-[60px]")
						div(class="flex items-center space-x-2")
							.form-title(v-if="input.projects.title.show" class="uppercase font-bold tracking-tight text-lg") {{ input.projects.title.name }}
							input(v-else type="text" maxlength="25" id="title" name="title" v-model="input.projects.title.name" @keyup.enter="() => input.projects.title.show = !input.projects.title.show")
							svgo-edit(v-if="input.projects.title.show" class="text-neutral-500 cursor-pointer" @click="() => input.projects.title.show = !input.projects.title.show")
							svgo-tick(v-else class="text-neutral-500 cursor-pointer" @click="() => input.projects.title.show = !input.projects.title.show")
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.projects.show = !input.projects.show" :trigger="input.projects.show")
					div(class="relative")
						Overlay(v-if="!input.projects.show")
						div
							div(v-for="(project, idx) in input.projects.data" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
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
								.delete-input(v-if="input.projects.data.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveProjects(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddProjects") Add Project
				div
					div(class="pb-6 flex items-center h-[60px]")
						div(class="flex items-center space-x-2")
							.form-title(v-if="input.references.title.show" class="uppercase font-bold tracking-tight text-lg") {{ input.references.title.name }}
							input(v-else type="text" maxlength="25" id="title" name="title" v-model="input.references.title.name" @keyup.enter="() => input.references.title.show = !input.references.title.show")
							svgo-edit(v-if="input.references.title.show" class="text-neutral-500 cursor-pointer" @click="() => input.references.title.show = !input.references.title.show")
							svgo-tick(v-else class="text-neutral-500 cursor-pointer" @click="() => input.references.title.show = !input.references.title.show")
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.references.show = !input.references.show" :trigger="input.references.show")
					div(class="relative")
						Overlay(v-if="!input.references.show")
						div
							div(v-for="(ref, idx) in input.references.data" :key="idx" class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
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
								.delete-input(v-if="input.references.data.length > 1" class="pt-4 cursor-pointer ms-auto" @click="handleRemoveReferences(idx)")
									svgo-delete(class="text-2xl text-red-500")
						.button(class="mt-8")
							button(type="button" class="border border-zinc-800 border-dashed text-xs uppercase w-full p-3 hover:bg-zinc-300 duration-200" @click="handleAddReferences") Add Reference
				//- FOOTER
				div
					div(class="pb-6 flex items-center")
						.form-title(class="uppercase font-bold tracking-tight text-lg") Footer
						Toggle(class="ms-auto cursor-pointer" @toggle="() => input.footer.show = !input.footer.show" :trigger="input.footer.show")
					div(class="relative")
						Overlay(v-if="!input.footer.show")
						div
							div(class="flex flex-wrap py-4 border-b border-zinc-300 last:border-b-0 last:pb-0 first:pt-0")
								.input-group
									label(for="footer-name") Name
									input(type="text" id="footer-name" name="footer-name" required v-model="input.footer.data.name" placeholder="Portfolio")
								.input-group
									label(for="footer") Title
									Editor(v-model="input.footer.data.summary" pt:root="bg-white"  editorStyle="height: 120px" unstyled placeholder="niiaryeh.com")
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

		div(:class="['w-2/3 p-4 max-lg:px-0 h-screen bg-[#121212] overflow-auto relative', {'!w-full' : !show && !showSettings}]")
			svgo-hamburger(v-if="!show" class="absolute top-5 left-4 text-white text-xl cursor-pointer" @click="toggleShow")
			svgo-slider(v-if="!showSettings" class="absolute top-5 right-4 text-white text-lg cursor-pointer" @click="toggleSettings")
			themes-default(:input="input" ref="resume")

		div(v-if="showSettings" class="w-full lg:w-1/3 p-4 h-screen overflow-auto bg-zinc-200")
			header(class="flex items-center justify-end space-x-4")
				svgo-close(class="text-2xl text-red-500 hover:text-red-600 cursor-pointer" @click="toggleSettings")
			.settings-sections(class="space-y-12 *:border-b *:border-zinc-300 *:pb-8 last:border-b-0")
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Templates
					div(class="text-sm tracking-tight")
						p Templates coming soon
				div
					.form-title(class="uppercase font-bold tracking-tight text-lg pb-6") Information
					div(class="text-sm tracking-tight space-y-4")
						h6(class="font-medium") Found a bug, or have an idea for a new feature?
						p If you have an idea that would help you and other users in creating your resume more easily send me an email about it.
						button(class="bg-brand-accent h-9 text-sm w-full text-white hover:bg-brand-hover" @click="navigateTo('mailto:sup@niiaryeh.com', {external: true})") Send Me an Email
</template>

<style>
.ql-editor ol li:before {
	content: '';
}
</style>