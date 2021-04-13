<template>
	<div>
		<video
				:controls="false"
				object-fit="fill"
				:src="src"
				class="w-80 h-80"
				disabled="disabled"
				webkit-playsinline
				playsinline
				loop
				x5-video-player-type="h5"
		>
		</video>
	</div>
</template>

<script>
    export default {
        name: "AppVideo",
	    props: {
            src: {
                type: String,
	            default(){
                    return ''
	            }
            }
	    },
	    components: {

	    },
	    data(){
            return {

            }
	    },

    }
</script>

<style scoped>

</style>
