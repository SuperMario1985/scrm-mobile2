<template>
	<view>
<!--		<root-font-size ref="fontSize1"/>-->
		<view class="index" v-if="ready">
			<view class="redPack">
				<img :src="avatar"
				     style="width: 1.867rem  /* 35/18.75 */;height: 1.867rem  /* 35/18.75 */;margin-top: 3.36rem  /* 63/18.75 */">
				<view class="title">来自{{title}}的红包</view>
				<view class="thanking" v-if="canOpen == 1">{{thanking}}</view>
				<view class="thanking" v-if="canOpen == 0">{{msg}}</view>
				<view v-if="canOpen == 1">
					<img @click="openRed" src="../../static/redForNew/open.png" class="open-img"/>
				</view>
				<view v-if="canOpen == 0" @click="look" class="look">看看大家的手气 ></view>
			</view>
			<img class="corpLogo" :src="corpLogo"/>
		</view>
	</view>
</template>

<script>

	export default {
		name   : "index",
		data () {
			return {
				ready      : false,
				corpid     : '',
				ticketData : {},
				agentData  : {},
				canOpen    : 0, // 是否可领
				msg        : '', // 提示语
				sendId     : '', // 发送id
				corpLogo   : '', // 企业logo
				avatar     : '', // 员工头像
				title      : '管管', // 员工姓名
				thanking   : '恭喜发财，大吉大利', // 感谢语
				openLoading: false,    // 防止重复点击开启按钮
			}
		},
		inject : ['initPage', 'getExternalId', 'getParameter'],
		components  : {},
		mounted () {
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('external_id', 'wmiWVTDWAALjXswWLs1Q3eJJ18pBm2qA')
			// this.getInfoData()
			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.limit)
			})
		},
		methods: {
			//一进入页面请求该方法获取应用的权限
			async limit () {
				let that = this
				this.url = window.location.href
				let agent_id = this.getParameter("agent_id")
				localStorage.setItem('agent_id', agent_id)
				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.errMsg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					that.uid = res.data.uid
					that.corpid = res.data.corpid
					localStorage.setItem('uid', that.uid)

					that.$store.dispatch('setCorpId', that.corpid)
					that.ticketData = res.data.ticketData
					that.agentData = res.data.agentData
					this.jsApiList = ['hideOptionMenu']
					that.$store.state.wx.config({
						beta     : true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
						debug    : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId    : that.ticketData.corpid, // 必填，企业微信的corpID
						timestamp: that.ticketData.timestamp, // 必填，生成签名的时间戳
						nonceStr : that.ticketData.nonceStr, // 必填，生成签名的随机串
						signature: that.ticketData.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
						jsApiList: that.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					})
					that.$store.state.wx.error(function (res) {
						if (typeof res.errCode !== "undefined" && res.errCode == 2) {
							if (typeof res.err_Info !== "undefined" && res.err_Info == 'invalid corpid' && that.wxWork) {
								uni.showToast({
									title   : '请在微信中打开',
									image   : '/static/fail.png',
									duration: 2000
								});
								return false
							}
						} else if (typeof res.errMsg !== "undefined" && res.errMsg.indexOf("invalid corpid") != -1) {
							uni.showToast({
								title   : '请在微信中打开',
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						}
						uni.showToast({
							title   : '初始化失败，请刷新重试',
							image   : '/static/fail.png',
							duration: 2000
						});
					})

					that.$store.state.wx.ready(function () {
						that.$store.state.wx.hideOptionMenu();
						if (localStorage.getItem('user_id')) {
							that.look()
						} else {
							that.getInfoData()
						}
						// that.getInfoData()
					})

				}
			},
			async getInfoData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("redpacket-open/redpacket-index", {
					external_id: this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('external_id'),
					corp_id    : this.getParameter('corpid'),
					assist     : this.getParameter('assist'),
					agent_id   : this.getParameter('agent_id')
				});
				if (res.error != 0) {
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.setNavigationBarTitle({
						title: res.data.resData.act_name
					});
					if (res.data.resData.isOpen == 1) {
						uni.navigateTo({
							url: '/pages/redForNew/list?corp_id=' + this.getParameter('corpid') + '&send_id=' + res.data.resData.send_id + '&agent_id=' + this.getParameter('agent_id')
						});
					}
					this.sendId = res.data.resData.send_id
					this.corpLogo = res.data.resData.corp_logo
					this.avatar = res.data.resData.avatar
					this.title = res.data.resData.name
					this.thanking = res.data.resData.thanking
					this.canOpen = res.data.resData.canOpen
					this.msg = res.data.resData.msg
					uni.hideLoading()
					this.ready = true
				}
			},
			look () {
				uni.navigateTo({
					url: '/pages/redForNew/list?corp_id=' + this.getParameter('corpid') + '&assist=' + this.getParameter('assist') + '&agent_id=' + this.getParameter('agent_id') + '&send_id=' + this.sendId
				});
			},
			async openRed () {
				if (this.openLoading) {
					return false
				}
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.openLoading = true
				const {data: res} = await this.axios.post("redpacket-open/redpacket-open", {
					send_id    : this.sendId,
					external_id: this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('external_id'),
				});
				if (res.error != 0) {
					this.openLoading = false
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.openLoading = false
					uni.hideLoading()
					uni.navigateTo({
						url: '/pages/redForNew/list?corp_id=' + this.getParameter('corpid') + '&send_id=' + this.sendId + '&agent_id=' + this.getParameter('agent_id')
					});
				}
			},
			formatter (value) {
				if (value < 10) {
					return "0" + value
				}
				return value
			},
		}
	}
</script>

<style scoped>
	.index {
		position: absolute;
		width: 100%;
		height: 100%;
		background: url('../../static/redForNew/redBack.png') no-repeat;
		background-size: 100% 100%;
	}

	.redPack {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 17.867rem;
		height: 25.067rem /* 470/18.75 */;
		/*margin-top: 6.027rem !* 113/18.75 *!;*/
		background: url("../../static/redForNew/red.png") no-repeat;
		background-size: 100% 100%;
	}

	.time {
		margin-top: 2.107rem /* 39.5/18.75 */;
		height: 2.624rem /* 49.2/18.75 */;
		line-height: 2.624rem /* 49.2/18.75 */;
	}

	.time-view {
		background-color: #FFFFFF;
		border-radius: 0.053rem /* 1/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		color: #A22126;
		/*width: 1.173rem !* 22/18.75 *!;*/
		height: 1.173rem /* 22/18.75 */;
		padding: 0.107rem /* 2/18.75 */;
	}

	.question {
		font-size: 0.907rem /* 17/18.75 */;
		color: #FFFFFF;
		margin: 0 0.32rem /* 6/18.75 */;
	}

	.title {
		margin-top: 0.8rem /* 15/18.75 */;
		height: 0.853rem /* 16/18.75 */;
		font-size: 0.853rem /* 16/18.75 */;
		font-weight: 500;
		color: #FCE3AF;
	}

	.thanking {
		margin: 0 auto;
		padding: 0 1.067rem /* 20/18.75 */;
		margin-top: 1.227rem /* 23/18.75 */;
		height: 1.28rem /* 24/18.75 */;
		width: 60%;
		font-size: 0.96rem  /* 18/18.75 */;
		color: #FCE3AF;
	}

	.open-img {
		margin-top: 5.547rem /* 104/18.75 */;
		width: 5.973rem /* 112/18.75 */;
		height: 5.973rem /* 112/18.75 */;
	}

	.look {
		margin-top: 12.8rem  /* 240/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		color: #FCE3AF;
		line-height: 1.067rem /* 20/18.75 */;
	}

	.corpLogo {
		position: fixed;
		bottom: 1.067rem /* 20/18.75 */;
		left: 50%;
		transform: translateX(-50%);
		height: 2.133rem /* 40/18.75 */;
	}
</style>