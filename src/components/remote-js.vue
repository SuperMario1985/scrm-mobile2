<template>
	<rem-js :src="js"></rem-js>
</template>
<script>
	export default {
		name      : "remote-js",
		props     : {
			js: {
				type   : String,
				default: "https://res.wx.qq.com/open/js/jweixin-1.2.0.js"
			}
		},
		components: {
			'rem-js': {
				render (createElement) {
					return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
				},
				props: {
					src: {
						type    : String,
						required: true
					},
				},
			},
		},
	}
</script>
