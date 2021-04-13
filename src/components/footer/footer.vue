<template>
	<view class="footer-background" v-if='copyright_url'>
		<img :src="commonUrl + copyright_url" alt="" class="footer-img">
	</view>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
	export default {
		props  : {},
		data () {
			return {
			}
		},
        computed: {
            ...mapState({
                copyright_url: state => state.copyright_url,
                commonUrl:  state => state.commonUrl,
            })
        },
		mounted () {

		},
		methods: {},
	};
</script>

<style scoped>
	.footer-background {
		padding-bottom: 0.533rem /* 10/18.75 */;
		text-align: center;
	}

	.footer-img {
		width: 40%;
		margin: 0.533rem /* 10/18.75 */ 0;
	}
</style>
