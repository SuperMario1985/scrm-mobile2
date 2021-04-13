<template>
	<view class="phone_container" v-if="selectedCustomer.customerInfo&&showCall">
		<view class="content">
			<view>
				<image class="user_avater"
				       :src="selectedCustomer.customerInfo.avatar?selectedCustomer.customerInfo.avatar:'../../../static/useradvart.png'"></image>
			</view>
			<view style="font-size: 15px;font-weight: 600">{{ selectedCustomer.customerInfo.name }}</view>
			<view>
				{{ currentText }}
				{{ current }}
			</view>

			<view style="color:red">通话时关闭当前页面可能会导致通话中断</view>

			<img src="../../static/assets/hangup.png" style="cursor:pointer;width: 40px;" @click="hangup"/>

		</view>
		<view class="banner-bg"
		      :style="{backgroundImage: 'url(' + (selectedCustomer.customerInfo.avatar ? selectedCustomer.customerInfo.avatar : bg) + ')'}"></view>
	</view>
</template>

<script>
	import FastWhaleCall from '@/components/fastwhalecall'
	import config from '@/components/fastwhalecall/config'
	import $ from '../../static/h5/js/jq/jquery.js'

	import bg from "../../static/assets/callbg.jpg"


	const API_HOST = config.api.host

	export default {
		data () {
			return {
				isRemind        : false,
				selectedCustomer: {},
				contactType     : 0,
				fastwhalecall   : null,
				actionId        : '',
				current         : '',
				currentText     : '呼叫中',
				hour            : 0,
				minutes         : 0,
				seconds         : 0,
				time            : "",
				showCall        : false,
				config          : {},
				phone           : '',
				remindTime      : '',
				bg              : bg
			}
		},
		props: {
			customerData: {
				type   : Object,
				default: {}
			},
			callBack    : {
				type   : Function,
				default: null
			},
		},
		onShow () {
		},
		mounted () {
			this.selectedCustomer = this.customerData
			this.callVertify()
		},

		methods: {
			async callVertify () {
				const {data: res} = await this.axios.post("dialout/dialout-data", {
					follow_id: this.selectedCustomer.key,
					corp_id  : localStorage.getItem('corpid'),
					type     : this.selectedCustomer.type
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
					this.showCall = false
					this.callBack({
						showCall: false,
					})
				} else {
					let that = this
					let platform = localStorage.getItem('userPlatform')
					this.phone = res.data.dialout_phone

					if (platform == 'android' || !platform) {
						let {api_key, custom_key, bindExen: exten} = res.data
						that.fastwhalecall = new FastWhaleCall('7moor', {api_key, custom_key, exten})
						let registered = false
						let timeNum = 0
						let timer = setInterval(() => {
							if (registered) {
								that.showCall = true
								that.actionId = res.data.ActionID
								that.fastwhalecall.dialout(res.data.dialout_phone, res.data.ActionID)
								that.getRemind()
								clearInterval(timer)
								return
							}
							++timeNum
							if (timeNum > 50) {
								clearInterval(timer)
							}
						}, 100)

						that.fastwhalecall.on('onMessage', message => {
							console.log(11111111111111, message)
							if (message == 'registered') {
								registered = true
							} else if (message == 'EvtConnected') {
								that.time = setInterval(() => {
									that.checkCallState()
								}, 1000)
							} else if (message == 'EvtHangup' || message == 'hangup') {
								that.showCall = false
								clearInterval(that.time);
								that.callBack({
									phone   : that.phone,
									actionId: that.actionId,
									showCall: false,
									type    : that.selectedCustomer.type
								})
							} else if (message == 'EvtDialing') {
								clearTimeout(that.remindTime)
							}
						})

						that.fastwhalecall.on('errorHandle', message => {
							// uni.showToast({
							// 	title   : message,
							// 	image   : '/static/fail.png',
							// 	duration: 2000
							// });
							// that.fastwhalecall.hangup()
						})

						that.fastwhalecall.on('networkMonitoring', message => {
							console.log('networkMonitoring', message)
						})
					} else if (platform == 'ios') {
						that.actionId = res.data.ActionID
						let registered = false
						let url = 'index.php?r=webcall/api/get-moor7-config&api_key=' + res.data.api_key + '&custom_key=' + res.data.custom_key + '&exten=' + res.data.bindExen
						let data = $.ajax({
							async   : false,
							url     : API_HOST + '/' + url,
							type    : 'get',
							dataType: 'json',
							error   : function (data) {
								alert("外呼失败")
							}
						});
						if (data.responseJSON.code == 200) {
							that.config = data.responseJSON.message
							uni.showToast({
								title   : '正在拨打，请稍后',
								image   : '/static/fail.png',
								duration: 2000
							});

							that.dialout(res.data.dialout_phone, res.data.ActionID, res.data.bindExen)
						}
					}
				}
			},

			// 判断用户是否响铃
			getRemind () {
				let that = this
				this.remindTime = setTimeout(() => {
					uni.showToast({
						title   : '该号码被连续多次呼叫，请等待一段时间再次尝试。',
						image   : '/static/fail.png',
						duration: 3000
					});
					that.showCall = false
					this.fastwhalecall.hangup()
					clearInterval(that.time);
					that.callBack({
						phone   : that.phone,
						actionId: that.actionId,
						showCall: false,
						type    : that.selectedCustomer.type
					})
				}, 15000)
			},

			async getState () {
				const {data: res} = await this.axios.post("dialout/get-call-state", {
					ActionID: this.actionId
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					clearTimeout(this.remindTime)
					if (res.data.state == 1) {
						this.currentText = '通话中'
						this.startTimer()
					} else if (res.data.state == 2) {
						this.currentText = '已结束'
						this.showCall = false
						clearInterval(this.time);
						this.callBack({actionId: this.actionId, showCall: false})
					}
				}
			},
			async checkCallState () {
				this.currentText = '通话中'
				this.startTimer()
			},
			startTimer () {
				this.seconds += 1;
				if (this.seconds >= 60) {
					this.seconds = 0;
					this.minutes = this.minutes + 1;
				}
				if (this.minutes >= 60) {
					this.minutes = 0;
					this.hour = this.hour + 1;
				}
				this.current = (this.minutes < 10 ? '0' + this.minutes : this.minutes) + ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds);
			},

			dialout (phoneNum, actionId, exten) {
				//小号 xiaohao
				var self = this;
				var sendData = {
					exten    : exten,
					called   : phoneNum,
					cdrVar   : phoneNum,
					actionId : actionId,
					extenType: 'Local'
				}

				let moorCallConfig = this.config
				/*let moorCallConfig = {
					account_id: "T00000017767",
					api_host  : "https://openapis.7moor.com",
					api_secret: "2dd9d180-7189-11eb-bf34-afa21733035a",
					password  : "#GuSWOAw5oq8003",
					proxy_url : "https://pbx-bj-tx04.7moor.com",
					user      : "8003@ahxzkj",
				}*/

				var account = moorCallConfig.account_id;//需要调整成自己账号的账户编号
				var secret = moorCallConfig.api_secret;//需要调整成自己账号的账户秘钥
				var timestamp = new Date().Format('yyyyMMddhhmmss');
				var sig_ = md5(account + secret + timestamp);
				var sig = sig_.toUpperCase();
				var authorization = Base64.encode(account + ':' + timestamp);

				$.ajax({
					async      : false,
					url        : moorCallConfig.api_host + "/v20160818/rlxh/dialout/" + account + "?sig=" + sig,
					type       : 'post',
					data       : JSON.stringify(sendData),
					dataType   : 'json',
					contentType: "application/json;charset=utf-8",
					headers    : {'Authorization': authorization},
					jsonp      : 'callback',
					success    : function (data) {
						if (data.Succeed == true) {
							console.debug("外呼[%s]成功", phoneNum);
							debugger
							self.time = setInterval(() => {
								self.getState()
							}, 1000)
							// self.callBack({actionId: actionId, showCall: false})
						} else {
							uni.showToast({
								title   : '该号码被连续多次呼叫，请等待一段时间再次尝试。',
								image   : '/static/fail.png',
								duration: 2000
							});
							self.showCall = false
							clearInterval(self.time);
							self.callBack({
								showCall: false,
							})
						}
					},
					error      : function (data) {
						alert("外呼失败")
					}
				});
			},

			hangup () {
				this.fastwhalecall.hangup()
			},
		}
	}
</script>

<style scoped lang="less">

	.phone_container {
		position: fixed;
		top: 30%;
		/* left: 15%; */
		width: 70%;
		height: 18.667rem;
		/*background-color: #B3D4FC;*/
		border-radius: 5px;
		overflow: hidden;
		padding: 10px;
		z-index: 999;
		left: 12%;
		max-width: 23.893rem;

		.user_avater {
			min-width: 2.88rem;
			height: 2.88rem;
			background-color: #FFF;
			border-radius: 50%;
			margin: 1rem 0 0 0.293rem;
			width: 14%;
		}
	}

	.content {
		text-align: center;
		position: absolute;
		z-index: 9999;
		color: #FFF;
		font-size: 15px;
		line-height: 2.667rem;
		width: 96%;
		left: 2%;
	}

	.banner-bg {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 5px;
		-webkit-transition: filter 0.3s linear;
		transition: filter 0.3s linear;
		filter: blur(13px);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		transform: scale(1.2)
	}

	.content_head {
		background: #FFF;
		z-index: 99;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		box-shadow: 0 0.053rem /* 1/18.75 */ 0.213rem /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);
	}

</style>
