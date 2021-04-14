<template>
	<view class="box">
		<view class="list" v-if="isReady">
			<uni-nav-bar left-icon="back" :title="'领取记录（' + count+ '条）'" :shadow="false" background-color="#FFFFFF"
			             @clickLeft="back"></uni-nav-bar>
			<view>
				<view class="list-content" v-for="item in list" v-if="list.length > 0" @click="detail(item.id)">
					<view class="list-content-col">
						<text class="list-content-title">领取时间</text>
						<text class="list-content-text" v-if="item.send_time != ''">{{item.send_time}}</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">领取人</text>
						<text class="list-content-text" v-if="item.external_name != ''">{{item.external_name}}</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">发送人</text>
						<text class="list-content-text" v-if="item.user_name != ''">{{item.user_name}}</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">红包金额</text>
						<text class="list-content-text">
							<text style="color: #F25442;">{{item.money}}</text>
							元
						</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">员工备注</text>
						<text class="list-content-text" v-if="item.remark != ''">{{item.remark}}</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">给客户留言</text>
						<text class="list-content-text" v-if="item.message != ''">{{item.message}}</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">商户订单号</text>
						<text class="list-content-text" v-if="item.order_id != ''">{{item.order_id}}</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
					<view class="list-content-col">
						<text class="list-content-title">微信付款单号</text>
						<text class="list-content-text" v-if="item.transaction_id != ''">{{item.transaction_id}}
						</text>
						<text class="list-content-text" v-else>暂无</text>
					</view>
				</view>
				<img src="../../static/redPacket/empty.png" alt="" v-if="list.length == 0" class="list-empty">
			</view>
			<view class="custom-tabs-loading" v-if="list.length > 0">{{loadingText}}</view>
			<Footer v-if="is_show_copyright == 1" style="position: fixed;left: 0;right: 0;bottom: 0;"></Footer>
		</view>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name: "detail",
		inject: ['initPage', 'getParameter'],
		components  : {Footer},
		data() {
			return {
				url               : '',
				ticketData        : {},
				agentData         : {},
				list              : [],
				commonUrl         : this.$store.state.commonUrl,
				isReady           : false,
				count             : 0,//红包记录总数
				page              : 1,//红包记录页码
				loadingText       : '',
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				let agent_id = this.getParameter('agentId') !== null ? this.getParameter('agentId') : (this.getParameter('agent_id') !== null ? this.getParameter('agent_id') : '')
				localStorage.setItem('agent_id', agent_id)
				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					let that = this
					that.uid = res.data.uid
					that.corpid = res.data.corpid
					localStorage.setItem('uid', that.uid)
					that.$store.dispatch('setCorpId', that.corpid)
					that.ticketData = res.data.ticketData
					that.agentData = res.data.agentData


					that.$store.state.wx.config({
						beta     : true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
						debug    : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId    : that.ticketData.corpid, // 必填，企业微信的corpID
						timestamp: that.ticketData.timestamp, // 必填，生成签名的时间戳
						nonceStr : that.ticketData.nonceStr, // 必填，生成签名的随机串
						signature: that.ticketData.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
						jsApiList: that.ticketData.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					})

					that.$store.state.wx.error(function (res) {
						uni.hideLoading()
						uni.showToast({
							title   : res.errorMsg,
							image   : '/static/fail.png',
							duration: 2000
						});
					})

					that.$store.state.wx.ready(function () {
						let agentConfig
						agentConfig = setInterval(() => {
							if (typeof that.$store.state.wx.agentConfig === 'function') {
								clearInterval(agentConfig);
								that.$store.state.wx.agentConfig({
									corpid   : that.agentData.corpid,
									agentid  : that.agentData.agentid,
									timestamp: that.agentData.timestamp,
									nonceStr : that.agentData.nonceStr,
									signature: that.agentData.signature,
									jsApiList: that.agentData.jsApiList,
									success  : function () {
										// 回调
										that.getContext((entry = '') => {
											if (entry == '') {
												uni.hideLoading()
												uni.showToast({
													title   : '版本过低请升级',
													image   : '/static/fail.png',
													duration: 2000
												});
											}
											if (entry == 'group_chat_tools') {
												that.getExternalId(that.getChatId(that.getInfoData))
											} else {
												that.getExternalId(that.getInfoData)
											}
										}, () => {
											uni.hideLoading()
											uni.showToast({
												title   : '版本过低请升级',
												image   : '/static/fail.png',
												duration: 2000
											});
										})
									},
									fail     : function (res) {
										if (res.errMsg.indexOf('function not exist') > -1) {
											uni.hideLoading()
											uni.showToast({
												title   : '版本过低请升级',
												image   : '/static/fail.png',
												duration: 2000
											});
										} else if (res.errMsg == 'agentConfig:not match any reliable domain.') {
											uni.hideLoading()
											uni.showToast({
												title   : '可信域名未填写或未验证',
												image   : '/static/fail.png',
												duration: 2000
											});
										} else {
											uni.hideLoading()
											uni.showToast({
												title   : res.errMsg,
												image   : '/static/fail.png',
												duration: 2000
											});
										}
									}
								})
							}
						}, 300)
					})

				}
			},
			async getInfoData(page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-send-money/chat-money-order", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					chat_send_id   : this.getParameter('id'),
					type   : this.getParameter('type'),
					page           : page,
					page_size      : 15,
				});
				if (res.error != 0) {
					uni.hideLoading()
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.isReady = true
					uni.hideLoading()
					this.count = res.data.count
					this.page = page
					this.chatInfoNum = this.chatInfoNum
					if (this.page == 1) {
						this.list = res.data.moneyList
					} else {
						this.list = this.list.concat(res.data.moneyList)
					}
					if (this.list.length < 15) {
						this.loadingText = '已加载全部'
					}
					uni.stopPullDownRefresh();
				}
			}
		},
		onLoad           : function () {
			uni.setNavigationBarTitle({
				title: '红包记录'
			});
			//
			this.isReady = false
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});

			this.is_show_copyright = localStorage.getItem('is_show_copyright')

			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.getInfoData)
			})


			// this.isReady = true
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('externalId', 'wmiWVTDwAAF9Q74m4EJwZ7TTfxbQh9JA')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.getInfoData()
		},
		onPullDownRefresh: function () {
			this.page = 1
			this.getInfoData();
		},
		onReachBottom    : function () {
			if (this.list.length < this.count) {
				this.page += 1
				this.getInfoData(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
	}
</script>

<style scoped>
	.box {
		background: #F6F6F6;
	}
	.list-empty {
		width: 36%;
		position: absolute;
		left: 32%;
		margin-top: calc(50% - 2.843rem /* 53.3/18.75 */);
	}
	.list {
		font-size: 0.747rem /* 14/18.75 */;
		background: #FFF;
		text-align: left;
	}

	.list-title-p {
		border-bottom: 1px solid #F5F5F5;
		overflow: hidden;
		padding: 0.533rem /* 10/18.75 */ 1.067rem /* 20/18.75 */;
	}

	.list-title {
		border-left: 4px solid #01B065;
		padding-left: 0.267rem /* 5/18.75 */;
		margin-top: 0.347rem /* 6.5/18.75 */;
		display: inline-block;
	}
	.list-content {
		line-height: 0.747rem;
		padding: 0.8rem 1.067rem;
		text-align: left;
		border-bottom: 1px solid #F5F5F5;
	}

	.list-content-col {
		padding-bottom: 0.8rem;
	}

	.list-content-title {
		color: #ADAEB6;
		font-size: 0.693rem;
		display: inline-block;
		vertical-align: top;
		width: 4.373rem /* 82/18.75 */;
		margin-right: 0.533rem /* 10/18.75 */;
	}

	.list-content-text {
		color: #666666;
		font-size: 0.693rem;
		display: inline-block;
		width: calc(100% - 4.907rem /* 92/18.75 */);
		word-break: break-all;
		line-height: 0.853rem /* 16/18.75 */;
	}
	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

</style>