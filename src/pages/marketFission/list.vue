<template>
	<view class="fission-list" style="background-color: #D92C31;padding-bottom: 20px;"
	      :style="{minHeight: (height+ 'px')}" v-show="!isLoading">
		<view style="padding-top: 1rem">
			<image v-if="fission.avatar" style="width: 4rem; height: 4rem;border-radius: 50%;" :src="fission.avatar"/>
			<image v-if="!fission.avatar" style="width: 4rem; height: 4rem;border-radius: 50%;" src="/static/useradvart.png"/>
			<view style="color: white;font-size: 0.7rem;">当前{{fission.help_num}}人气 | {{fission.level_msg}}</view>
		</view>
		<view style="background-color: white;margin: 0.7rem 0.7rem 0 0.7rem;border-radius: 0.3rem;overflow: hidden;">
			<view style="padding: 1.07rem 1.07rem 0;">
				<button class="friend" :class="type == 1 ? 'white': 'red'" @click="friend">我的好友</button>
				<button class="ranking" :class="type == 0 ? 'white': 'red'" @click="ranking">人气排行Top100</button>
			</view>
			<view style="margin-top: 0.5rem;">
				<view style="text-align: left;margin-bottom: 0.2rem;height: 3.4rem;line-height: 3.4rem;padding: 0 1.07rem;"
				      v-if="type == 1" class="borderB">
					<image class="rank-icon" v-if="fission.ranking == 1" src="/static/fissionList/No1.png"/>
					<image class="rank-icon" v-if="fission.ranking == 2" src="/static/fissionList/No2.png"/>
					<image class="rank-icon" v-if="fission.ranking == 3" src="/static/fissionList/No3.png"/>
					<text class="ranking123"
					      v-if="fission.ranking != 0 && fission.ranking != 1 && fission.ranking != 2 && fission.ranking != 3">
						{{fission.ranking}}
					</text>
					<image v-if="fission.avatar" :class="fans_id == 0 || fission.ranking == 0 ? 'noavater' : ''" class="advatar" :src="fission.avatar"/>
					<image v-if="!fission.avatar" :class="fans_id == 0 || fission.ranking == 0 ? 'noavater' : ''" class="advatar" src="/static/useradvart.png"/>
					<text class="nickname">我</text>
					<text class="help-num">已有<span style="color: red;">{{fission.help_num || 0}}</span>人气</text>
				</view>
				<view style="overflow-y: auto;" :style="maxHeight" class="helpRanking" v-if="type == 0">
					<view style="text-align: left;height: 3.4rem;line-height: 3.4rem;padding: 0 1.07rem;"
					      v-for="(item,index) in list" :key="index" class="borderB">
						<text class="ranking123">{{index + 1}}</text>
						<image v-if="item.avatar" class="advatar" :src="item.avatar"/>
						<image v-if="!item.avatar" class="advatar" src="/static/useradvart.png"/>
						<text class="nickname">{{item.name_convert}}</text>
						<text class="help-num" v-if="type == 0">{{item.create_time}}</text>
						<text class="help-num" v-if="type == 1">已有<span
								style="color: red;">{{item.activity_num || 0}}</span>人气
						</text>
					</view>
					<view v-if="list.length == 0">
						<img src="../../static/fissionList/empty.png" alt="" style="width: 44%;margin: 2rem 0;">
					</view>
				</view>
				<view style="overflow-y: auto;" :style="maxHeight" class="helpRanking" v-if="type == 1">
					<view style="text-align: left;height: 3.4rem;line-height: 3.4rem;padding: 0 1.07rem;"
					      v-for="(item,index) in list" :key="index" class="borderB">
						<image class="rank-icon" v-if="index == 0" src="/static/fissionList/No1.png"/>
						<image class="rank-icon" v-if="index == 1" src="/static/fissionList/No2.png"/>
						<image class="rank-icon" v-if="index == 2" src="/static/fissionList/No3.png"/>
						<text class="ranking123" v-if="index != 0 && index != 1 && index != 2">{{index + 1}}</text>
						<image v-if="item.avatar" class="advatar" :src="item.avatar"/>
						<image v-if="!item.avatar" class="advatar" src="/static/useradvart.png"/>
						<text class="nickname">{{item.name_convert}}</text>
						<text class="help-num" v-if="type == 0">{{item.create_time}}</text>
						<text class="help-num" v-if="type == 1">已有<span
								style="color: red;">{{item.activity_num || 0}}</span>人气
						</text>
					</view>
				</view>
			</view>
		</view>
		<Footer v-if="is_show_copyright == 1" style="position: fixed;bottom: 0;left: 0;right: 0;"></Footer>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import Footer from "../../components/footer/footer.vue";

	export default {
		name   : "list",
		components  : {Footer},
		data () {
			return {
				activity_id: '',
				fans_id    : '',
				type       : '0',
				fission    : {
					avatar  : "",
					name    : "",
					help_num: "",
					rest_num: "",
					ranking : "",
				},
				list       : [],
				page       : 1,
				height     : '',
				maxPage    : 0,
				maxHeight  : {
					maxHeight: ''
				},//滚动的最大高度
				isLoading  : true,
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		// onReachBottom () {
		// 	this.getData(this.page)
		// },
		methods: {
			friend () {
				if (this.type == 0) {
					return false
				}
				this.type = 0
				this.page = 1
				this.list = []
				this.getData(1)
			},
			ranking () {
				if (this.type == 1) {
					return false
				}
				this.type = 1
				this.page = 1
				this.list = []
				this.getData(1)
			},
			async getData (page = 1) {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				this.isLoading = true
				let that = this
				const {data: res} = await this.axios.post("chat-message/activity-lists", {
					activity_id: this.activity_id,
					fans_id    : this.fans_id,
					type       : this.type,
					page       : page,
					pageSize    : 20
				});
				if (res.error != 0) {
					Toast.clear();
					this.isLoading = false
					Toast.fail(res.error_msg);
				} else {
					if(!this.getParameter("title")) {
						document.title = res.data.title
					}
					that.page = page
					that.maxPage = Math.ceil(res.data.count/20) > 5 ? 5 : Math.ceil(res.data.count/20)
					if(this.type == 1) {
						that.list = this.list.concat(res.data.lists)
					} else {
						that.list = this.list.concat(res.data.detailLists)
					}

					that.fission = {
						avatar  : res.data.avatar,
						name    : "",
						help_num: res.data.now,
						ranking : res.data.location,
						level_msg: res.data.level_msg
					}
					if (page == 1) {
						let msgModalBody = document.getElementsByClassName('helpRanking')[0]
						msgModalBody.onscroll = function () {
							//变量scrollTop是滚动条滚动时，距离顶部的距离
							let scrollTop = msgModalBody.scrollTop;
							//变量windowHeight是可视区的高度
							let windowHeight = msgModalBody.clientHeight || document.body.clientHeight;
							//变量scrollHeight是滚动条的总高度
							let scrollHeight = msgModalBody.scrollHeight || document.body.scrollHeight;
							//滚动条到底部的条件
							if (scrollTop + windowHeight > scrollHeight - 30) {

								if (that.maxPage > that.page) {
									if (that.type == 1) {
										if (that.page != 5) {
											that.getData(that.page + 1)
										}
									} else {
										that.getData(that.page + 1)
									}

								}
							}
						}
					}
					Toast.clear();
					this.isLoading = false
				}
			},
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null) {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
		},
		onLoad () {
			if(this.getParameter("title")) {
				document.title = decodeURIComponent(this.getParameter("title"))
			}

			//动态计算最大高度
			let rem = document.getElementsByTagName('html')[0].style.fontSize.replace('px', '')
			let maxHeight = (window.innerHeight / Number(rem)) - 14.82
			this.maxHeight.maxHeight = parseInt(maxHeight) + 'rem'

			let that = this
			uni.getSystemInfo({
				success: function (res) { // res - 各种参数
					that.height = res.windowHeight - 20 // 屏幕的宽度
				}
			});
			this.activity_id = this.getParameter('activity_id')
			this.fans_id = this.getParameter('fans_id')
			if(this.fans_id == 0) {
				this.type = 1
			}
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
			this.getData()
		}
	}
</script>

<style scoped>
	.white, .red {
		display: inline-block;
		width: 50%;
		border: 1px solid red;
		height: 1.8rem;
		line-height: 1.8rem;
		font-size: 0.8rem;
	}

	.white {
		background-color: white;
		color: black;
	}

	.red {
		background-color: red;
		color: white;
	}

	/*.friend, .ranking {*/
	/*	border: 0px;*/
	/*}*/
	.friend {
		border-radius: 0.9rem 0 0 0.9rem;
	}

	.ranking {
		border-radius: 0 0.9rem 0.9rem 0;
	}
	.ranking1 {
		width: 100% !important;
		border-radius: 0;
		border: 0 !important;
	}
	.friend:after, .ranking:after {
		border: 0px;
	}

	.advatar {
		height: 1.87rem;
		width: 1.87rem;
		margin: 0.765rem 0.267rem  /* 5/18.75 */;
		border-radius: 50%;
	}

	.help-num {
		float: right;
		font-size: 0.7rem;
	}

	.borderB {
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	.ranking123 {
		font-size: 0.9rem;
		margin-left: 0.3rem;
		margin-right: 0.4rem;
		float: left;
	}

	.rank-icon {
		width: 1.18rem;
		height: 1.36rem;
		vertical-align: top;
		margin-top: 0.99rem;
	}

	.nickname {
		vertical-align: top;
		display: inline-block;
		width: 30%;
		font-size: 0.8rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.noavater{
		margin-left: 1.44rem  /* 27/18.75 */;
	}
</style>