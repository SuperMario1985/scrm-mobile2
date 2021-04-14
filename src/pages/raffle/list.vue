<template>
	<view class="box">
		<uni-nav-bar left-icon="back" title="中奖纪录" @clickLeft="back" background-color="#01B065" color="#fff">
		</uni-nav-bar>
		<view v-if="flag">
			<img :style="paddingTop" class="empty" src="../../static/raffle/empty.png"
			     v-if="list.length == 0"></img>
		</view>
		<view v-if="!flag">
			<view v-if="list.length > 0" v-for="(item,index) in list" :key="index">
				<uni-card :is-shadow="true">
					<view class="time">
						<span>{{item.create_time}}</span>
						<span class="status" v-if="item.status == 0">未兑奖</span>
						<span class="status" v-if="item.status == 1">已兑奖</span>
					</view>
					<image class="img"
					       :src="commonUrl + item.logo"></image>
					<view class="content">{{item.name}}</view>
				</uni-card>
			</view>
			<view class="loading">{{loadingText}}</view>
		</view>
		<Footer v-if="is_show_copyright == 1" style="position: fixed;bottom: 0;left: 0;right: 0;"></Footer>
	</view>
</template>

<script>

	import {Toast} from "vant";
	import Footer from "../../components/footer/footer.vue";

	export default {
		name             : "list",
		inject    : ['getCopyright'],
		components  : {Footer},
		data () {
			return {
				list      : [],
				commonUrl : this.$store.state.commonUrl,
				paddingTop: {
					paddingTop: ''
				},//empty的高度
				flag      : false,
				loadingText:'加载中...',
				count:'',//总数
				page:1,
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad           : function () {
			//empty的高度
			let height = window.innerHeight
			let paddingTop = (height - 257.69) / 2
			this.paddingTop.paddingTop = parseInt(paddingTop) + 'px'
			document.title = '中奖纪录'
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
			this.page = 1
			this.getData()
		},
		onPullDownRefresh: function () {
			this.page = 1
			this.getData();
		},
		onReachBottom:function(){
			if(this.list.length < this.count){
				this.page += 1
				this.getData()
			}else {
				this.loadingText = '已加载全部'
			}
		},
		methods          : {
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null) {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
			async getData () {
				let that = this
				let id = that.getParameter('id')
				let join_id = that.getParameter('jid')
				const {data: res} = await this.axios.post("wap-award/records", {
					id      : id,
					join_id : join_id,
					page    : this.page,
					pageSize: 15
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					localStorage.setItem('uid', res.data.uid)
					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						this.getCopyright(this.refresh)
					}

					if(this.page == 1){
						this.list = res.data.info
					}else {
						this.list = this.list.concat(res.data.info)
					}
					this.count = res.data.count
					if(this.count <= 15){
						this.loadingText = '已加载全部'
					}
					if (this.list.length == 0) {
						this.flag = true
					} else {
						this.flag = false
					}

				}
			},
			//重新渲染頁面
			refresh(){
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			back(){
				this.$router.go(-1)
			}
		},
	}
</script>

<style scoped>
	.time {
		font-size: 0.8rem;
		text-align: left;
		margin-bottom: 0.5rem;
	}

	.status {
		float: right;
		color: red;
	}

	.img {
		width: 2.56rem;
		height: 2.56rem;
		background-color: #EEEEEE;
		border-radius: 0.27rem;
		float: left;
	}

	.content {
		font-size: 0.8rem;
		text-align: left;
		float: left;
		width: calc(100% - 2.56rem);
		padding: 0.6rem;
		box-sizing: border-box;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.empty {
		width: 100px;
	}

	.loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.75rem;
	}
</style>