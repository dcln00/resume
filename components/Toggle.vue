<script setup lang="ts">
defineProps(['trigger'])
</script>

<template lang="pug">
span(class="relative w-10" @click="$emit('toggle')")
	div(:class="['w-10 h-6 rounded-full shadow-inner ', {'!bg-brand-accent': trigger}, {'bg-gray-600': !trigger}]")
	div(:class="['absolute inset-y-0 w-4 h-4 m-1 rounded-full bg-gray-100', {'right-0': trigger}, {'left-0': !trigger}]")
</template>
