<template>
	<view class="customDetail" v-show="isReady">
		<uni-nav-bar left-icon="back" title="待办详情" @clickLeft="goBack"
			style="position: fixed;top: 0;z-index: 999;" background-color="rgba(82, 132, 236, 1)"
			color="#fff" v-if="this.getParameter('external_userid') != null"></uni-nav-bar>
		<view class="detail-header">
			<view class="header-item">
				<view>消费次数</view>
				<view class="item-date">{{headerData.consumption_count}}次</view>
			</view>
			<view class="header-item">
				<view>总消费额</view>
				<view class="item-date">￥{{headerData.amount}}</view>
			</view>
			<view class="header-item">
				<view>最近消费</view>
				<view class="item-date">{{headerData.last_consumption_time}}</view>
			</view>
		</view>
		<view class="detail-list" v-if="logList.length>0">
			<view class="item" v-for="(item,index) in logList" :key="index">
				<view class="item-l" :class="{'ycolor':item.title=='评级','gcolor':item.title=='导购'}">
					<block v-if="item.title=='评级'"><uni-icons type="star-filled" size="10" color="#fff"></uni-icons></block>
					<block v-else-if="item.title=='导购'"><uni-icons type="locked-filled" size="10" color="#fff"></uni-icons></block>
					<block v-else>￥</block>
				</view>
				<view class="item-r">
					<view class="item-title">
						<text>{{item.title}}</text>
						<text class="item-tip" :class="{'ocolor':item.type=='淘宝'}" v-if="item.type">{{item.type}}</text>
					</view>
					<view class="item-content">{{item.add_time}} {{item.description}}</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="status" :showLoadMore="showLoadMore" :color="'#333'" v-if="logList.length>0"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';//上拉加载更多
	export default{
		name: "detailList",
		inject: ['initPage', 'getParameter'],
		components:{
			uniLoadMore,
		},
		data(){
			return {
				isReady: true,
				headerData: {},//头部信息
				page: 1,
				next_page: false,//是否有分页
				status:'noMore',//查看更多
				showLoadMore:false,//是否显示查看更多
				logList: [],//日志列表
				externalId: '',//添加跟进需要参数
				customer_id: '',//顾客id
			}
		},
		onLoad() {
			this.$store.dispatch('setWx', () => {
				this.initPage(this.init)
			})
			
			// localStorage.setItem('token', 'TWFpblVzZXItOGIxNGYwNWFmZDczNDk0ODU4ZjFkOTUwZjVmYjQwN2I=')
			// localStorage.setItem('corpid', 'ww800e25f6140d281c')
			// localStorage.setItem('externalId', 'wmpx8REgAAaYOViVpZZpKbFHS1EcLfWA')
			// this.init()
		},
		methods:{
			goBack () {
				uni.navigateBack()
			},
			init(){
				this.externalId=this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('externalId')
				this.headerFun()
			},
			async headerFun () {//头部信息
				const {data: res} = await this.axios.post("shop-customer/mobile-msg", {
					corp_user_id: this.getParameter('user_id') != null ? this.getParameter('user_id') : localStorage.getItem('user_id'),
					corp_id: localStorage.getItem('corpid'),
					external_userid: this.externalId,
					now_userid: localStorage.getItem('user_id')
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.headerData = res.data
					this.customer_id = res.data.customer_id
					this.customLog(1,res.data.customer_id)
				}
			},
			async customLog (page = 1,customer_id) {//日志列表
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("shop-customer/customer-log", {
					corp_id    : localStorage.getItem('corpid'),
					customer_id: this.customer_id?this.customer_id:customer_id,
					page       : page,
					page_size  : 10,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.count = res.data.count
					this.page = page
					this.isReady = true
					if (page == 1) {
						this.logList = res.data.result
					} else {
						this.logList = this.logList.concat(res.data.result)
					}
					this.showLoadMore = true;
					this.next_page = res.data.next_page
				}
			},
		},
		onReachBottom() {
			let that = this
			if(that.next_page===false){
				that.status='noMore';
			}else{
				that.customLog(++that.page,that.customer_id);
				that.status='more';
			}
		},
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}
	.customDetail{
		padding: 20rpx;
		background-color: #F6F6F6;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.detail-header{
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-around;
			padding: 30rpx 0;
			border-radius: 10rpx;
			.header-item{
				font-size: 22rpx;
				color: #999999;
				.item-date{
					font-size: 32rpx;
					color: #333333;
					font-weight: 600;
					margin-top: 12rpx;
				}
			}
		}
		.detail-list{
			background-color: #FFFFFF;
			padding: 30rpx;
			border-radius: 10rpx;
			.item{
				padding-bottom: 70rpx;
				border-left: 2px solid #CCCCCC;
				box-sizing: border-box;
				padding-left: 30rpx;
				position: relative;
				&:last-child{
					padding-bottom: 30rpx;
					border-left: none;
				}
				.item-l{
					position: absolute;
					left: -16rpx;
					top: 0;
					z-index: 10;
					background-color: #4C65FA;
					border-radius: 50%;
					color: #FFFFFF;
					width: 32rpx;
					height: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20rpx;
					&.ycolor{
						background-color: #e2ca2a;
					}
					&.gcolor{
						background-color: #1FB7D3;
					}
				}
				.item-r{
					text-align: left;
					.item-title{
						font-size: 28rpx;
						color: #333333;
						.item-tip{
							font-size: 22rpx;
							color: #FFFFFF;
							background-color: #1FC31F;
							border-radius: 14rpx 14rpx 14rpx 0;
							margin-left: 10rpx;
							padding: 2rpx 8rpx;
							&.ocolor{
								background-color: #F95731;
							}
						}
					}
					.item-content{
						font-size: 26rpx;
						color: #555555;
						margin-top: 20rpx;
					}
				}
			}	
		}
	}
</style>
