<template>
	<view class="custom-tags">
		<view style="font-size: 0.8rem;" @click="goBack">
			<text style="color: #01B065;margin-right: 0.533rem;float: left;">< 返回</text>
			<span style="margin-left: -2.68rem;">当前拥有的标签</span>
		</view>
		<view>
			<view class="custom-tags-list">
				<uni-tag :text="item.tagname" type="primary" :circle="true" class="custom-tags-list-tag"
				         v-for="item in tagList"></uni-tag>
			</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</view>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name: "tagsList",
		components  : {Footer},
		data() {
			return {
				tagList: [],
				agentId : '',
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad () {
			uni.setNavigationBarTitle({
				title: '标签列表'
			});
			this.tagList = JSON.parse(decodeURIComponent(this.$route.query.tagList))
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
		},
		methods: {
			goBack() {
				history.back()
			}
		}
	}
</script>

<style scoped>
	.custom-tags {
		background: #FFF;
		margin: 0.533rem 0;
		padding: 0.12rem 0.853rem 0;
		box-sizing: border-box;
	}

	.custom-tags-title {
		height: 0.853rem;
		line-height: 0.853rem;
		font-size: 0.8rem /* 15/18.75 */;
	}

	.custom-tags-list {
		margin-top: 0.96rem;
		overflow: hidden;
	}

	.custom-tags-list-tag {
		height: 1.227rem;
		line-height: 1.227rem;
		box-sizing: border-box;
		background: #E7EFFC;
		border-color: #E7EFFC;
		margin: 0 0.64rem 0.64rem 0;
		float: left;
	}
	/deep/ .uni-tag-text {
		color: #01B065;
	}
</style>