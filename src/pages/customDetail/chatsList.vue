<template>
	<view class="chat-name">
		<view style="font-size: 0.8rem;" @click="goBack">
			<text style="color: #01B065;margin-right: 0.533rem;float: left;">< 返回</text>
			<span style="margin-left: -2.68rem;">所在群</span>
		</view>
		<view>
			<view class="chat-name-list">
				<uni-tag :text="item.name" type="primary" :circle="true" class="chat-name-list-tag"
				         v-for="item in chatsList"></uni-tag>
			</view>
		</view>
		<Footer v-if="is_show_copyright == 1"></Footer>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name: "tagsList",
		inject       : ['getParameter'],
		components  : {Footer},
		data() {
			return {
				chatsList: [],
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad () {
			uni.setNavigationBarTitle({
				title: '群列表'
			});
			this.chatsList = JSON.parse(decodeURIComponent(this.getParameter('chatsList')))
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
		},
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.chat-name {
		background: #FFF;
		margin: 0.533rem 0;
		padding: 0.12rem 0.853rem 0;
		box-sizing: border-box;
	}

	.chat-name-title {
		margin-top: 0.533rem  /* 10/18.75 */;
		height: 0.853rem;
		line-height: 0.853rem;
		font-size: 0.8rem /* 15/18.75 */;
	}

	.chat-name-list {
		margin-top: 0.96rem;
		overflow: hidden;
	}

	.chat-name-list-tag {
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

	/deep/ .uni-tag-text span {
		display: inline-block;
		overflow: hidden;
		max-width: 9.6rem  /* 180/18.75 */;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>