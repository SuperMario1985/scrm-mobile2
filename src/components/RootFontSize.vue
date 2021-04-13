<template>
	<page-meta :root-font-size="fontSize"></page-meta>
</template>

<script>
	export default {
		name : "RootFontSize",
		props: {
			fontSize: {
				type   : String,
				default: '18.75px'
			}
		}
	}
</script>

<style scoped>

</style>