<script>
	import MD5 from 'js-md5'
	import {Toast} from "vant";
	import VConsole from "vconsole"
	import store from "./store";
	import axios from "axios";

	const isDebug = false;
	// 本地开发调试注入vConsole
	if (isDebug) {
		const vConsole = new VConsole()
	}

	export default {
		provide () {
			return {
				wx                 : this.getWx,
				wxWork             : this.getWxWork,
				setUrl             : this.setUrl,
				goWx               : this.goWx,
				getParameter       : this.getParameter,
				getInfo            : this.getInfo,
				getData            : this.getData,
				initPage           : this.initPage,
				getExternalId      : this.getExternalId,
				getChatId          : this.getChatId,
				getContext         : this.getContext,
				forbidden          : this.forbidden,
				getCopyright       : this.getCopyright,
				getPermissionButton: this.getPermissionButton
			}
		},
		data () {
			return {
				wx      : false,
				wxWork  : false,
				hrefUrl : '',    // 页面地址
				userData: null,    // 当前访问页面的用户
			}
		},
		methods : {
			initSessionId () {
				let sessionId = this.global.session_id;
				if (!sessionId) {
					let userAgent = navigator.userAgent.toLowerCase();
					let sessionId = MD5(userAgent + new Date().valueOf());
					this.global.setSessionId(sessionId);
				}
			},
			getWx () {
				return this.wx
			},
			getWxWork () {
				return this.wxWork
			},
			setUrl () {
				let href = window.location.href
				// let href = window.location.href.replace('localhost:8081', 'tm-scrm.wemero.cn')
				let from = this.getParameter('from')
				let isappinstalled = this.getParameter('isappinstalled')
				href = href.replace('&from=' + from, '')
				href = href.replace('?from=' + from + "&", '?')
				href = href.replace('?from=' + from, '?')
				href = href.replace('&isappinstalled=' + isappinstalled, '')
				href = href.replace('?isappinstalled=' + isappinstalled + "&", '?')
				href = href.replace('?isappinstalled=' + isappinstalled, '?')
				return href
			},
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null && r.length > 2 && r[2] != '') {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
			// 跳转微信
			goWx (appid = null) {
				this.$cookies.remove(this.$store.state.authKey)
				let CORPID = appid !== null ? appid : (this.getParameter('suite_id') !== null ? this.getParameter('suite_id') : this.getParameter('corpid'))
				let code = this.getParameter('code')
				let state = this.getParameter('state')
				this.hrefUrl = this.setUrl()
				this.hrefUrl = this.hrefUrl.replace('&code=' + code, '')
				this.hrefUrl = this.hrefUrl.replace('?code=' + code + "&", '?')
				this.hrefUrl = this.hrefUrl.replace('?code=' + code, '?')
				this.hrefUrl = this.hrefUrl.replace('&state=' + state, '')
				this.hrefUrl = this.hrefUrl.replace('?state=' + state + "&", '?')
				this.hrefUrl = this.hrefUrl.replace('?state=' + state, '?')
				let REDIRECT_URI = encodeURIComponent(this.hrefUrl)

				if ((localStorage.getItem('corpid') || this.getParameter('corpid')) && localStorage.getItem('user_id')) {
					//获取权限
					this.getPermissionButton()
				}

				if (localStorage.getItem('uid')) {
					//获取底部技术支持
					this.getCopyright()
				}

				window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + CORPID + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'

				setTimeout(() => {
					window.location.reload()
				}, 500)
			},
			async getInfo (callback = null, callback1 = null) {
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				const {data: res} = await this.axios.post('oauth/get-info', {
					agent_id: agent_id
				})

				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					// localStorage.setItem('corpid', res.data.appid)
					if (typeof callback == "function") {
						localStorage.setItem('agent_id', agent_id)
						localStorage.setItem('corpid', res.data.appid)
						callback(res.data.appid, callback1)
					}
				}
			},
			async getData (corpId = '', callback = null) {
				const {data: res} = await this.axios.post("oauth/get-user-info", {
					deviceCode: this.$cookies.get(this.$store.state.authKey),
					corpId    : corpId,
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg)
					if (typeof callback === "function") {
						callback()
					}
				} else {
					if (res.data == null) {
						this.goWx()
					} else if (new Date().getTime() / 1000 > (res.data.firstTime + 15 * 24 * 60 * 60)) {
						this.goWx()
					} else {
						var ua= window.navigator.userAgent.toLowerCase();
						let is_wx = false
						if( (ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork') ){
							//企业微信客户端
							is_wx = false
						}else if( ua.match(/micromessenger/i) == 'micromessenger' ){
							//微信客户端
							is_wx = true
						}

						if(res.data.wap_auth == 0 && !is_wx){
							//超过子账户数量的限制
							uni.navigateTo({
								url: "/pages/systemOccupancy/index"
							});
						}else {
							localStorage.setItem('uid', res.data.info.hasOwnProperty('uid') ? res.data.info.uid : '')
							localStorage.setItem('sub_id', res.data.info.hasOwnProperty('sub_id') ? res.data.info.sub_id : '')
							localStorage.setItem('user_type', res.data.info.hasOwnProperty('type') ? res.data.info.type : 1)
							localStorage.setItem('openid', res.data.hasOwnProperty('openid') ? (res.data.openid ? res.data.openid : (res.data.external_contact.hasOwnProperty('openid') ? res.data.external_contact.openid : '')) : '')
							localStorage.setItem('user_id', res.data.user.hasOwnProperty('userid') ? res.data.user.userid : '')
							localStorage.setItem('external_id', res.data.external_contact.hasOwnProperty('external_userid') ? res.data.external_contact.external_userid : '')
							localStorage.setItem('external_int_id', res.data.external_contact.hasOwnProperty('id') ? res.data.external_contact.id : '')
							localStorage.setItem('nickname', res.data.external_contact.hasOwnProperty('name') ? res.data.external_contact.name : '')
							localStorage.setItem('token', res.data.info.hasOwnProperty('access_token') ? res.data.info.access_token : '')
							let websocketInterval
							websocketInterval = setInterval(() => {
								if (this.ws.websocket.readyState == 1) {
									clearInterval(websocketInterval)
									this.ws.websocketSend(
										JSON.stringify({
											channel: "bind",
											info   : {
												session_id: this.global.session_id,
												uid       : localStorage.getItem("uid") != null ? localStorage.getItem("uid") : '',
												subId     : (localStorage.getItem('user_type') == 2 && localStorage.getItem("sub_id") != null) ? localStorage.getItem("sub_id") : '',
												openid    : localStorage.getItem("openid") != null ? localStorage.getItem("openid") : '',
												bindType  : 3,
											}
										})
									)
								}
							}, 300)

							this.userData = res.data

							if (localStorage.getItem('uid')) {
								this.getCopyright()
							}

							if ((localStorage.getItem('corpid') || this.getParameter('corpid')) && localStorage.getItem('user_id')) {
								Promise.all([
									//获取权限
									this.getPermissionButton()
								]).then(res => {
									if (typeof callback === "function") {
										callback()
									}
								}).catch(e => {
									uni.hideLoading();
								})
							} else {
								if (typeof callback === "function") {
									callback()
								}
							}
						}

					}
				}
			},
			async getUserInfoByCode (corpId = '', callback = null) {
				let agentId = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				let code = this.getParameter('code')

				const {data: res} = await this.axios.post("oauth/get-user-info-by-code", {
					agent_id: agentId,
					code    : code,
					corp_id : corpId
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg)

					if (typeof callback === "function") {
						callback()
					}
				} else {
					var ua= window.navigator.userAgent.toLowerCase();
					let is_wx = false
					if( (ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork') ){
						//企业微信客户端
						is_wx = false
					}else if( ua.match(/micromessenger/i) == 'micromessenger' ){
						//微信客户端
						is_wx = true
					}

					if(res.data.wap_auth == 0 && !is_wx){
						//超过子账户数量的限制
						uni.navigateTo({
							url: "/pages/systemOccupancy/index"
						});
					}else {
						if (res.data.is_use == 1) {
							if (this.getParameter('appid') == null) {
								this.getInfo(this.goWx)
							} else {
								this.goWx()
							}
						} else {
							this.$cookies.set(this.$store.state.authKey, res.data.deviceCode, '15d', '/')
							localStorage.setItem('uid', res.data.info.hasOwnProperty('uid') ? res.data.info.uid : '')
							localStorage.setItem('sub_id', res.data.info.hasOwnProperty('sub_id') ? res.data.info.sub_id : '')
							localStorage.setItem('user_type', res.data.info.hasOwnProperty('type') ? res.data.info.type : 1)
							localStorage.setItem('openid', res.data.hasOwnProperty('openid') ? res.data.openid : '')

							localStorage.setItem('user_id', res.data.user.hasOwnProperty('userid') ? res.data.user.userid : '')
							localStorage.setItem('external_id', res.data.external_contact.hasOwnProperty('external_userid') ? res.data.external_contact.external_userid : '')
							localStorage.setItem('external_int_id', res.data.external_contact.hasOwnProperty('id') ? res.data.external_contact.id : '')
							localStorage.setItem('token', res.data.info.hasOwnProperty('access_token') ? res.data.info.access_token : '')

							let websocketInterval
							websocketInterval = setInterval(() => {
								if (this.ws.websocket.readyState == 1) {
									clearInterval(websocketInterval)
									this.ws.websocketSend(
										JSON.stringify({
											channel: "bind",
											info   : {
												session_id: this.global.session_id,
												uid       : localStorage.getItem("uid") != null ? localStorage.getItem("uid") : '',
												subId     : (localStorage.getItem('user_type') == 2 && localStorage.getItem("sub_id") != null) ? localStorage.getItem("sub_id") : '',
												openid    : localStorage.getItem("openid") != null ? localStorage.getItem("openid") : '',
												bindType  : 3,
											}
										})
									)
								}
							}, 300)

							this.userData = res.data

							if (localStorage.getItem('uid')) {
								this.getCopyright()
							}

							if ((localStorage.getItem('corpid') || this.getParameter('corpid')) && localStorage.getItem('user_id')) {
								Promise.all([
									//获取权限
									this.getPermissionButton()
								]).then(res => {
									if (typeof callback === "function") {
										callback()
									}
								}).catch(e => {
									uni.hideLoading();
								})
							} else {
								if (typeof callback === "function") {
									callback()
								}
							}

						}
					}
				}
			},
			async getRightUrl (shortUrl, type = 1) {
				const {data: res} = await this.axios.post("mission/short-url", {
					short_url: shortUrl,
					type     : type
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					if (res.data.url) {
						window.location.href = res.data.url
					} else {
						window.location.href = this.$store.state.h5Url
					}

				}
			},
			initPage (callback = null) {
				if (this.$cookies.get(this.$store.state.authKey)) {
					if (this.getParameter('corpid') == null) {
						this.getInfo(this.getData, callback)
					} else {
						this.getData(this.getParameter('corpid'), callback)
					}
				} else if (this.getParameter('code')) {
					if (this.getParameter('corpid') == null) {
						this.getInfo(this.getUserInfoByCode, callback)
					} else {
						this.getUserInfoByCode(this.getParameter('corpid'), callback)
					}
				} else {
					if (this.getParameter('corpid') == null) {
						this.getInfo(this.goWx)
					} else {
						this.goWx()
					}
				}
			},
			getExternalId (success = null, failed = null) { // 获取当前外部联系人userid
				let _this = this
				_this.$store.state.wx.invoke('getCurExternalContact', {}, function (res) {
					if (res.err_msg == 'getCurExternalContact:ok') {
						_this.$store.commit("setExternalId", res.userId)
						if (typeof success == "function") {
							success()
						}
					} else {
						if (typeof failed == "function") {
							failed()
						}

					}
				})
			},
			getChatId (success = null, failed = null) { // 获取当前客户群的群ID
				let _this = this
				_this.$store.state.wx.invoke('getCurExternalChat', {}, function (res) {
					if (res.err_msg == 'getCurExternalChat:ok') {
						_this.$store.commit("setChatId", res.chatId)

						if (typeof success == "function") {
							success()
						}
					} else {
						_this.$store.commit("setChatId", '')

						if (typeof failed == "function") {
							failed()
						}

					}
				})
			},
			getContext (success = null, failed = null) { // 获取进入H5页面的入口环境
				let _this = this
				_this.$store.state.wx.invoke('getContext', {}, function (res) {
					if (res.err_msg == "getContext:ok") {
						/**
						 * contact_profile	从联系人详情进入
						 * single_chat_tools	从单聊会话的工具栏进入
						 * group_chat_tools	从群聊会话的工具栏进入
						 * normal	除以上场景之外进入，例如工作台，聊天会话等
						 */
						if (typeof success == "function") {
							success(res.entry)
						}
					} else {
						if (typeof failed == "function") {
							failed()
						}
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : res.err_msg
						})
					}
				});
			},
			forbidden (type = 0) {
				switch (type) {
					case 0:
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : '禁止访问'
						})

						break;
					case 1:
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : '只可在群组打开'
						})

						break;
					case 2:
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : '不可在群组打开'
						})

						break;

				}
			},
			//获取权限按钮列表
			async getPermissionButton () {
				const {data: res} = await axios.post(
					"wap-auth-user/get-wap-auth",
					{
						corp_id: localStorage.getItem('corpid') || this.getParameter('corpid'),
						user_id: localStorage.getItem('user_id')
					}
				);
				if (res.error == 0) {
					localStorage.setItem('permissionButton', res.data)
				} else {
					uni.showToast({
						title   : '获取权限按钮列表失败！',
						image   : '/static/fail.png',
						duration: 2000
					});
				}
			},
			//获取底部技术支持
			async getCopyright (callback = null) {
				const {data: res} = await this.axios.post(
					"copyright/get-copyright",
					{
						uid: localStorage.getItem('uid')
					}
				);
				if (res.error == 0) {
					this.$store.commit("setShowCopyright", res.data.is_show)
					this.$store.commit("setCopyrightUrl", res.data.url)
					if (typeof callback === "function") {
						callback()
					}
				} else {
					uni.showToast({
						title   : '获取底部技术支持失败！',
						image   : '/static/fail.png',
						duration: 2000
					});
				}
			},
		},
		destroyed () {
			//页面销毁时关闭长连接
			this.ws.websocketClose()
		}
		,
		onLaunch: function () {
			this.global.clearLocalStorage()
			let locationPath = this.$route.path
			let arr = locationPath.split('/')
			let type = this.$route.query.type
			if (arr.length > 2 && arr[1] == 'I') {
				if (type != null && type == 2) {
					//群打卡短链接
					this.getRightUrl(arr[2], type)
				} else {
					//新裂变短链接
					this.getRightUrl(arr[2])
				}
			} else {
				if (/^\/(\d+)$/g.test(locationPath)) {
					let agentId = locationPath.substr(1)
					uni.redirectTo({
						url: "/pages/slider/index?agentId=" + agentId
					})
				} else if (locationPath === '/preview') {
					let previewId = this.$route.query.num !== undefined ? this.$route.query.num : ''
					let attachId = this.$route.query.attach_id !== undefined ? this.$route.query.attach_id : ''
					let articleId = this.$route.query.article_id !== undefined ? this.$route.query.article_id : ''
					let agentId = this.$route.query.agent_id !== undefined ? this.$route.query.agent_id : ''
					let historyUrl = this.$route.query.history_url !== undefined ? this.$route.query.history_url : ''
					let chatId = this.$route.query.chat_id !== undefined ? this.$route.query.chat_id : ''
					let attachCode = this.$route.query.attach_code !== undefined ? this.$route.query.attach_code : ''
					uni.redirectTo({
						url: "/pages/preview/index?num=" + previewId + "&attach_id=" + attachId + "&article_id=" + articleId + "&agent_id=" + agentId + '&history_url=' + historyUrl + '&chat_id=' + chatId + '&attach_code=' + attachCode
					})
				} else if (locationPath === '/pages/fission/index') {
					let corp_id = this.$route.query.corp_id !== undefined ? this.$route.query.corp_id : ''
					let corpId = this.$route.query.corpid !== undefined ? this.$route.query.corpid : ''
					let agentId = this.$route.query.agent_id !== undefined ? this.$route.query.agent_id : ''
					let assist = this.$route.query.assist !== undefined ? this.$route.query.assist : ''

					window.location.href = this.$store.state.h5Url + "/h5/pages/fission/ibk?corp_id=" + corp_id + "&corpid=" + corpId + "&agent_id=" + agentId + "&assist=" + assist

				}

				this.initSessionId();
				//页面刚进入时开启长连接
				this.ws.initWebSocket();
				this.wx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') === -1

				this.wxWork = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') !== -1
				// alert('onLounch')
			}
		},
		onShow  : function () {
			// console.log('App Show')
		},
		onHide  : function () {
			// console.log('App Hide')
		}

	}
</script>

<style lang="less">
	@import "static/css/index.less";
	@import "static/css/tailwind.css";
	@import "static/css/scrmIconfont.css";

	uni-app {
		font-family: -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2C3E50;
	}

	.van-tabbar {
		border-top: 1px solid #000;
	}

	.main {
		margin: 40px 0 50px;
		overflow: hidden;
	}

	/*.van-nav-bar__title,.van-nav-bar .van-icon,.van-nav-bar__text {*/
	/*  color: #fff;*/
	/*}*/
	.v-enter {
		transform: translateX(100%)
	}

	.v-enter-active {
		transition: transform 0.3s
	}

	.v-enter-to {
		transform: translateX(0)
	}

	.v-leave {
		opacity: 1;
	}

	.v-leave-active {
		transition: opacity 0.1s
	}

	.v-leave-to {
		opacity: 0.2;
	}

	/deep/ uni-page-refresh {
		z-index: 9999;
	}

	/deep/ .uni-picker-container {
		z-index: 999999999;
	}

	/deep/ .van-toast {
		z-index: 9999999 !important;
	}

	/deep/ uni-page-refresh {
		height: auto;
	}

	uni-tabbar .uni-tabbar__icon {
		max-height: 20px;
		max-width: 24px;
	}

	/deep/ uni-tabbar .uni-tabbar-border {
		background-color: #F7F7F7 !important;
	}

	/deep/ uni-toast {
		z-index: 9999999;
	}

	/deep/ .uni-mask {
		background: rgba(0, 0, 0, .85);
	}
</style>
