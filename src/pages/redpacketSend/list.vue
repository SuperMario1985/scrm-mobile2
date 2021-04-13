<template>
	<scroll-view v-if="ready" @scrolltolower="scroll" scroll-y="true" class="index">
		<img src="../../static/redForNew/head.png" class="head-img"/>
		<view class="head-title">
			<img :src="avatar" class="avatar">
			<text class="desc">{{name}}的红包</text>
			<img v-if="ruleType == 1" src="../../static/redForNew/pu.png" class="type-icon"/>
			<img v-if="ruleType == 2" src="../../static/redForNew/pin.png" class="type-icon"/>
		</view>
		<view class="thanking">{{thanking}}</view>
		<view class="momey" v-if="send_money != 0">
			<text class="amount">{{send_money}}</text>
			<text class="unit">元</text>
		</view>
		<view class="get-desc" v-if="send_money != 0">
			<text>已存入你的微信零钱</text>
		</view>
		<view class="detail">
			<text v-if="is_expired == 1">红包已过期，</text>
			已领取{{get_num}}个
			<text v-if="count > 0">，共{{get_amount}}/{{redpacket_amount}}元</text>
		</view>
		<view v-for="item in sendList" class="list">
			<img class="avatar1" v-if="item.avatar != ''" :src="item.avatar"/>
			<img class="avatar1" v-if="item.avatar == ''" src="../../static/useradvart.png"/>
			<view class="userInfo">
				<view class="username" v-if="item.name_convert != ''">{{item.name_convert}}</view>
				<view class="username" v-if="item.name_convert == ''">未知客户</view>
				<view class="time">{{item.pay_time}}</view>
			</view>
			<view class="money">{{item.money}}元</view>
		</view>
		<view style="color: #B0B0B0;padding: 0.8rem /* 15/18.75 */ 0;font-size: 0.693rem /* 13/18.75 */;"
		      v-if="count == sendList.length && count > 0">已加载全部
		</view>
		<Footer v-if="is_show_copyright == 1"></Footer>
	</scroll-view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : "index",
		inject    : ['initPage', 'getParameter', 'getCopyright'],
		components: {Footer},
		data () {
			return {
				ready            : false,
				avatar           : '', // 员工头像
				corp_logo        : '',
				name             : '', // 员工名
				redpacket_amount : '', // 红包金额
				get_amount       : '', // 领取金额
				get_num          : '', // 领取个数
				sendList         : [], // 领取列表数据
				is_expired       : 0,
				send_money       : '0',
				send_id          : '', // 发送id
				thanking         : '', // 感谢语
				ruleType         : 1,
				page             : 1,  // 列表页码
				count            : 0, // 领取记录数量
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		mounted () {
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.limit)
			})

			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('external_id', 'wmiWVTDwAADll_Xi_VRR1ZzeLrfZBzOw')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.getData()
		},
		methods   : {
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

					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						that.getCopyright(that.refresh)
					}

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
						jsApiList: ['hideOptionMenu'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					})
					that.$store.state.wx.error(function (res) {
						uni.showToast({
							title   : res.errMsg,
							image   : '/static/fail.png',
							duration: 2000
						});
					})

					that.$store.state.wx.ready(function () {
						that.$store.state.wx.hideOptionMenu();
						that.getData()
					})
				}
			},
			//重新渲染頁面
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			scroll () {
				if (this.sendList.length < this.count) {
					this.getParameter(this.page + 1)
				}
			},
			async getData (page = this.page) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("redpacket-open/send-redpacket-receive", {
					external_userid: this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('external_id'),
					user_id        : localStorage.getItem('user_id'),
					openid         : localStorage.getItem('openid'),
					corp_id        : this.getParameter('corp_id'),
					assist         : this.getParameter('assist'),
					page           : page,
					page_size      : 15,
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
						title: res.data.act_name
					});
					if (page == 1) {
						this.is_expired = res.data.is_expired
						this.avatar = res.data.avatar
						this.corp_logo = res.data.corp_logo
						this.name = res.data.name
						this.redpacket_amount = res.data.redpacket_amount
						this.get_amount = res.data.get_amount
						this.get_num = res.data.get_num
						this.sendList = res.data.sendList
						this.send_money = res.data.send_money
						this.send_id = res.data.send_id
						this.ruleType = res.data.rule_type
						this.thanking = res.data.thanking
						this.count = parseInt(res.data.count || 0)
						this.page = page
					} else {
						this.sendList = this.sendList.concat(res.data.sendList)
						this.page = page
					}
					uni.hideLoading()
					this.ready = true
				}
			}
		}
	}
</script>

<style scoped>
	page {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.index {
		position: fixed;
		height: 100%;
	}

	.head-img {
		width: 100%;
		height: 5.867rem /* 110/18.75 */;
	}

	.head-title {
		height: 1.493rem /* 28/18.75 */;
		line-height: 1.493rem /* 28/18.75 */;
		margin-top: 1.653rem /* 31/18.75 */;
	}

	.avatar {
		width: 1.493rem /* 28/18.75 */;
		height: 1.493rem /* 28/18.75 */;
	}

	.type-icon {
		margin: 0.32rem 0 0 0.64rem;
		width: 0.853rem /* 16/18.75 */;
		height: 0.853rem /* 16/18.75 */;
	}

	.desc {
		margin-left: 0.8rem /* 15/18.75 */;
		font-size: 0.853rem /* 16/18.75 */;
		font-weight: bold;
		color: #333333;
	}

	.thanking {
		padding: 0 1.067rem /* 20/18.75 */;
		margin-top: 0.907rem /* 17/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		font-weight: 500;
		color: #8B8B8B;
	}

	.momey {
		margin-top: 1.387rem /* 26/18.75 */;
	}

	.amount {
		font-size: 1.92rem /* 36/18.75 */;
		font-weight: 800;
		color: #F35D4C;
	}

	.unit {
		font-size: 0.693rem /* 13/18.75 */;
		font-weight: 500;
		color: #8B8B8B;
	}

	.get-desc {
		margin-top: 1.12rem /* 21/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		font-weight: 500;
		color: #F3C57C;
	}

	.detail {
		text-align: left;
		color: #B0B0B0;
		padding: 0 0.8rem /* 15/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
		margin-top: 1.92rem /* 36/18.75 */;
		margin-bottom: 0.693rem /* 13/18.75 */;
	}

	.list {
		/*height: 2.24rem !* 42/18.75 *!;*/
		border-top: 1px solid #F1F1F1;
		padding: 0.853rem /* 16/18.75 */ 0.8rem /* 15/18.75 */;
		text-align: left;
	}

	.avatar1 {
		width: 2.24rem /* 42/18.75 */;
		height: 2.24rem /* 42/18.75 */;
	}

	.userInfo {
		display: inline-block;
		margin-left: 0.693rem /* 13/18.75 */;
		width: calc(100% - 6.667rem /* 125/18.75 */);
	}

	.username {
		font-size: 0.853rem /* 16/18.75 */;
		color: #343434;
	}

	.time {
		margin-top: 0.48rem /* 9/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		color: #B0B0B0;
	}

	.money {
		float: right;
		font-size: 0.853rem /* 16/18.75 */;
		margin-right: 0.107rem /* 2/18.75 */;
		color: #343434;

	}
</style>