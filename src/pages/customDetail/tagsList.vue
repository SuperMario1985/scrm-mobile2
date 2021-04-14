<template>
	<view class="custom-tags">
		<uni-nav-bar left-icon="back" title="当前拥有的标签" @clickLeft="goBack" background-color="#01B065" color="#fff" :fixed="true"></uni-nav-bar>
		<view class="custom-tags-list">
			<uni-tag :text="item.tagname" type="primary" :circle="true" class="custom-tags-list-tag"
			         v-for="item in tagList"></uni-tag>
		</view>
		<Footer v-if="is_show_copyright == 1"></Footer>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : "tagsList",
		inject    : ['getParameter'],
		components: {Footer},
		data () {
			return {
				tagList          : [],
				agentId          : '',
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad () {
			uni.setNavigationBarTitle({
				title: '标签列表'
			});
			this.tagList = JSON.parse(decodeURIComponent(this.getParameter('tagList')))
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
		},
		methods   : {
			goBack () {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.custom-tags {
		background: #FFF;
		box-sizing: border-box;
	}

	.custom-tags-title {
		height: 0.853rem;
		line-height: 0.853rem;
		font-size: 0.8rem /* 15/18.75 */;
	}

	.custom-tags-list {
		padding: 0.533rem  /* 10/18.75 */;
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