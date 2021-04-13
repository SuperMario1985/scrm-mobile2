<template>
	<view class="box">
		<view class="nav-bar-box">
			<uni-nav-bar
					title="消息"
					background-color="#5077B7"
					color="#FFFFFF"
					status-bar
					fixed>
			</uni-nav-bar>
		</view>
		<!--		列表-->
		<view class="user-list-box">
			<uni-list v-if="!flag">
				<view class="search-box">
					<uni-search-bar
							placeholder="搜索"
							cancelButton="none"
							@input="input">

					</uni-search-bar>
				</view>

				<view class="action-box">
					<view class="uni-flex uni-row ">
						<view class="flex-item" style="width: 4rem  /* 75/18.75 */;">
							当前选择
						</view>
						<view class="flex-item" style="-webkit-flex: 1;flex: 1;">
							<picker
									mode="multiSelector"
									@columnchange="bindMultiPickerColumnChange"
									@change="changeAccount"
									:value="multiIndex"
									:range="multiArray">
								<view class="uni-input">
									{{multiArray[1][multiIndex[1]]}}（{{multiArray[0][multiIndex[0]]}}）
								</view>
							</picker>
						</view>

					</view>
				</view>
				<view class="user-list">
					<navigator
							v-for="item in userList"
							:url="'/pages/message/msg?id=' + getMsgId(item) + '&chatFromId=' + getChatFromId() + '&nickname=' + encodeURIComponent(getNickName(item, 1)) + '&chatType=' + chatType + '&key=' + multiIndex.join(',') + '&agentId=' + agentId">
						<uni-list-item
								:thumb="typeof item.headerimg != 'undefined' ? item.headerimg : item.head_img"
								:show-arrow="false"
								:show-badge="item.last_content[0].unread > 0"
								:badge-text="item.last_content[0].unread"
								badgeType="error">
							<template slot="default">
								<div style="font-size: 0.747rem  /* 14/18.75 */;overflow: hidden;">
									<text class="nick">{{getNickName(item)}}</text>
									<text class="last_time">{{item.last_time}}</text>
								</div>
								<div v-if="item.last_content[0].type == 1" class="last-message">
									<text class="user-last-message" v-text="item.last_content[0].content"></text>
								</div>
								<div v-if="item.last_content[0].type == 2" class="last-message">
									【图片】
								</div>
								<div v-if="item.last_content[0].type == 3" class="last-message">
									【音频】
								</div>
								<div v-if="item.last_content[0].type == 4" class="last-message">
									【视频】
								</div>
								<div v-if="item.last_content[0].type == 5" class="last-message">
									【图文】
								</div>
								<div v-if="item.last_content[0].type == 6" class="last-message">
									【音乐】
								</div>
								<div v-if="item.last_content[0].type == 7" class="last-message">
									【视频】
								</div>
								<div v-if="item.last_content[0].type == 8" class="last-message">
									【位置】
								</div>
								<div v-if="item.last_content[0].type == 9" class="last-message">
									【链接】
								</div>
								<div v-if="item.last_content[0].type == 10 || (chatType == 1 && item.last_content[0].type == 3)"
								     class="last-message">
									【小程序】
								</div>
							</template>
						</uni-list-item>

					</navigator>
				</view>
			</uni-list>
		</view>
		<Footer v-show="$store.state.is_show_copyright == 1" style="position: fixed;bottom: 0;left: 0;right: 0;"></Footer>
	</view>
</template>

<script>
	import moment from 'moment';
	import Footer from "../../components/footer/footer.vue";

	export default {
		name             : "index",
		inject           : ['initPage', 'getParameter'],
		components  : {Footer},
		data () {
			return {
				agentId      : 0,
				userList     : [],
				fansList     : [],
				miniList     : [],
				commonUrl    : this.$store.state.commonUrl,
				paddingTop   : {
					paddingTop: ''
				},//empty的高度
				flag         : false,
				// loadingText:'加载中...',
				inputValue   : '',//搜索框输入的内容
				accountList  : {
					wx  : [],
					mini: []
				},//公众号和小程序列表
				wxIndex      : 0,
				miniIndex    : 0,
				wx_id        : '',//选中的公众号id
				multiArray   : [
					['公众号', '小程序'],
					[],
				],
				multiIndex   : [0, 0],
				chatType     : 0,    // 0:wx;1:mini
				searchTimeout: ''
			}
		},
		onLoad           : function () {
			//empty的高度
			let height = window.innerHeight
			let paddingTop = (height - 257.69) / 2
			this.paddingTop.paddingTop = parseInt(paddingTop) + 'px'

			if (this.getParameter('agentId') != null) {
				this.agentId = parseInt(this.getParameter('agentId'))
			}

			if (this.getParameter('chatType') != null) {
				this.chatType = parseInt(this.getParameter('chatType'))
			}

			if (this.getParameter('key') != null) {
				this.multiIndex = this.getParameter('key').split(',')
			}
			// 追加粉丝消息页面的获取消息后的回调
			this.ws.setCallback(this.websocketOnMessage)

			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.initData)
			})
			// _this.initPage(_this.$store.dispatch('setWx', () => {
			// 	_this.initData()
			// }))


			// localStorage.setItem('token', 'TWFpblVzZXItYWJkYjQ1MTE1ZDZkNWZmMmM0YWFkZDM5M2YwYjY0ZDQ=')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('sub_id', 2)
			// localStorage.setItem('user_type', 1)
			// this.initData()
		},
		onPullDownRefresh: function () {
			switch (this.chatType) {
				case 0:
					this.getWxMsgList()

					break;
				case 1:
					this.getMiniMsgList()

					break;
			}
		},
		methods          : {
			initData () {
				this.getAccountInfo()
				switch (this.chatType) {
					case 0:
						this.getWxMsgList()

						break;
					case 1:
						this.getMiniMsgList()

						break;
				}
			},
			getMsgId (item) {
				return this.chatType == 0 ? item.fans_id : item.mini_id
			},
			getChatFromId () {
				return this.chatType == 0 ? this.fansList[this.wxIndex].id : this.miniList[this.miniIndex].id
			},
			getNickName (item, type = 0) {
				let nickName = item.remark.length > 0 ? item.remark : (typeof item.nickname != "undefined" ? item.nickname : item.openid)

				if (type == 1) {
					if (this.chatType == 0) {
						nickName += "（公众号：" + this.multiArray[1][this.multiIndex[1]] + "）"
					}
					if (this.chatType == 1) {
						nickName += "（小程序：" + this.multiArray[1][this.multiIndex[1]] + "）"
					}
				}

				return nickName
			},
			bindMultiPickerColumnChange (e) {
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						switch (this.multiIndex[0]) {
							case 0:
								this.multiArray[1] = []
								this.accountList.wx.map((item) => {
									this.multiArray[1].push(item.name)
								})

								break
							case 1:
								this.multiArray[1] = []
								this.accountList.mini.map((item) => {
									this.multiArray[1].push(item.name)
								})
								break
						}
						break
				}
			},
			changeAccount () {
				switch (this.multiIndex[0]) {
					case 0:
						let needChangeWx = false
						if (this.chatType == 0 && this.wxIndex != this.multiIndex[1]) {
							this.wxIndex = this.multiIndex[1]

							needChangeWx = true
						}

						if (this.chatType == 1) {
							this.chatType = 0
							this.wxIndex = this.multiIndex[1]

							needChangeWx = true
						}

						if (needChangeWx) {
							if (this.fansList.length > 0) {
								this.userList = this.fansList[this.wxIndex].fans_list
								this.userList.map((user, index) => {
									if (this.isToday(user.last_time)) {
										user.last_time = moment.unix(user.last_time).format('HH:mm')
									} else {
										user.last_time = '昨天'
									}
								})
							} else {
								this.getWxMsgList()
							}

							this.$forceUpdate()
						}

						break
					case 1:
						let needChangeMini = false
						if (this.chatType == 1 && this.miniIndex != this.multiIndex[1]) {
							this.miniIndex = this.multiIndex[1]

							needChangeMini = true
						}

						if (this.chatType == 0) {
							this.chatType = 1
							this.miniIndex = this.multiIndex[1]

							needChangeMini = true
						}

						if (needChangeMini) {
							if (this.miniList.length > 0) {
								this.userList = this.miniList[this.miniIndex].mini_list
								this.userList.map((user, index) => {
									if (this.isToday(user.last_time)) {
										user.last_time = moment.unix(user.last_time).format('HH:mm')
									} else {
										user.last_time = '昨天'
									}
								})
							} else {
								this.getMiniMsgList()
							}

							this.$forceUpdate()
						}

						break
				}
			},
			//判断时间戳是否为今天
			isToday (signDate) {
				if (!signDate) {
					return false;
				}

				const currentDate = moment().format('YYYYMMDD');
				signDate = moment.unix(signDate).format('YYYYMMDD');

				return signDate === currentDate;
			},
			//搜索
			input (e) {
				clearTimeout(this.searchTimeout)

				this.searchTimeout = setTimeout(() => {
					switch (this.chatType) {
						case 0:
							if (e.value.length > 0) {
								this.userList = []
								this.fansList[this.wxIndex].fans_list.map((fansInfo) => {
									if (this.getNickName(fansInfo).toLowerCase().indexOf(e.value.toLowerCase()) != -1) {
										this.userList.push(fansInfo)
									}
								})
							} else {
								this.userList = this.fansList[this.wxIndex].fans_list
							}

							break;
						case 1:
							if (e.value.length > 0) {
								this.userList = []
								this.miniList[this.miniIndex].mini_list.map((miniInfo) => {
									if (this.getNickName(miniInfo).toLowerCase().indexOf(e.value.toLowerCase()) != -1) {
										this.userList.push(miniInfo)
									}
								})
							} else {
								this.userList = this.miniList[this.miniIndex].mini_list
							}

							break;
					}
				}, 500)
			},
			websocketOnMessage (data) {
				let need = false
				switch (this.chatType) {
					case 0:
						need = typeof data.type != 'undefined' && data.type == 'chat' && (!data.hasOwnProperty('msg_type') || data.msg_type == 'wx') && this.getChatFromId() == data.wx_id

						break
					case 1:
						need = typeof data.type != 'undefined' && data.type == 'chat' && (!data.hasOwnProperty('msg_type') || data.msg_type == 'mini') && this.getChatFromId() == data.wx_id

						break
				}
				if (need) {
					let hasInList = false
					let hasIndex = 0
					let userInfo = {}
					this.userList.map((user, index) => {
						if (!hasInList && ((this.chatType == 0 && user.fans_id == data.from) || (this.chatType == 1 && user.mini_id == data.from))) {
							hasInList = true
							hasIndex = index
							userInfo = user

							userInfo.last_time = data.msg_list.create_time.substr(11, 5)
							userInfo.last_content[0].content = data.msg_list.content
							userInfo.last_content[0].create_time = data.msg_list.create_time
							userInfo.last_content[0].type = data.msg_list.type
							userInfo.last_content[0].unread = (parseInt(userInfo.last_content[0].unread) + 1).toString()
						}
					})

					if (!hasInList) {
						if (this.chatType == 0) {
							data.fans_info.last_time = moment().format('HH:mm')
							userInfo = data.fans_info
						} else {
							data.mini_info.last_time = moment().format('HH:mm')
							userInfo = data.mini_info
						}

						data.msg_list.unread = "1"
						userInfo.last_content = [data.msg_list]

						this.userList.unshift(userInfo)
					} else {
						this.userList.splice(hasIndex, 1)
						this.userList.unshift(userInfo)
					}
				}
			},
			async getAccountInfo () {
				const {data: res} = await this.axios.post(
					"wx-authorize-info/get-account-list",
					{
						sub_id: localStorage.getItem('sub_id'),
					}
				);
				//   console.log(res);
				if (res.error != 0) {
					this.isLoading = false;

					uni.showToast({
						title: res.message
					});
				} else {
					this.accountList = res.data

					this.multiArray[1] = []
					switch (this.chatType) {
						case 0:
							this.multiIndex = [0, 0]

							if (this.accountList.wx.length == 0) {
								uni.showToast({
									title: "无授权的公众号"
								});
							}
							this.accountList.wx.map((item) => {
								this.multiArray[1].push(item.name)
							})

							break;
						case 1:
							this.multiIndex = [1, 0]

							if (this.accountList.mini.length == 0) {
								uni.showToast({
									title: "无授权的小程序"
								});
							}
							this.accountList.mini.map((item) => {
								this.multiArray[1].push(item.name)
							})

							break;
					}

					this.$forceUpdate()
				}
			},
			// 获取粉丝消息初始数据
			async getWxMsgList () {
				const {data: res} = await this.axios.post("fans/msg-list", {
					sub_id: localStorage.getItem('sub_id'),
				});
				if (res.error != 0) {
					uni.showToast({
						title: res.error_msg
					});
				} else {
					this.chatType = 0
					this.fansList = res.data
					this.userList = this.fansList[this.wxIndex].fans_list
					this.userList.map((user, index) => {
						if (this.isToday(user.last_time)) {
							user.last_time = moment.unix(user.last_time).format('HH:mm')
						} else {
							user.last_time = '昨天'
						}
					})
					uni.stopPullDownRefresh();
				}
			},
			// 获取粉丝消息初始数据
			async getMiniMsgList () {
				const {data: res} = await this.axios.post("mini-user/msg-list", {
					sub_id: localStorage.getItem('sub_id'),
				});
				if (res.error != 0) {
					uni.showToast({
						title: res.error_msg
					});
				} else {
					this.chatType = 1
					this.miniList = res.data
					this.userList = this.miniList[this.miniIndex].mini_list
					this.userList.map((user, index) => {
						if (this.isToday(user.last_time)) {
							user.last_time = moment.unix(user.last_time).format('HH:mm')
						} else {
							user.last_time = '昨天'
						}
					})
					uni.stopPullDownRefresh();
				}
			},
		},
	}
</script>

<style scoped>
	@import "~@/static/css/uni.css"
</style>

<style lang="less" scoped>
	.box {
		.user-list-box {
			top: 2.347rem /* 44/18.75 */;
			right: 0;
			bottom: 0;
			left: 0;
			position: fixed;
			overflow-x: hidden;
			overflow-y: auto;

			.action-box {
				font-size: 0.747rem /* 14/18.75 */;
				text-align: left;
				padding: 0.427rem /* 8/18.75 */;
				border-top: 0.053rem /* 1/18.75 */ solid #E4E3E6;
				border-bottom: 0.053rem /* 1/18.75 */ solid #E4E3E6;
			}

			.user-list {
				/deep/ .uni-list-item__container {
					&:after {
						left: 3.253rem /* 61/18.75 */;
					}

					.uni-list-item__icon {
						width: 2.453rem /* 46/18.75 */;
						height: 2.453rem /* 46/18.75 */;
						margin-right: 0.8rem /* 15/18.75 */;

						.uni-list-item__icon-img {
							border: 0.107rem /* 2/18.75 */ solid #E4E3E6;
							border-radius: 0.533rem /* 10/18.75 */;
						}
					}
				}

				.last_time {
					width: 1.92rem /* 36/18.75 */;
					float: right;
					display: block;
				}

				.nick {
					width: calc(100% - 1.92rem /* 36/18.75 */);
					float: left;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
				}

				.user-last-message {
					font-size: 0.64rem /* 12/18.75 */;
					line-height: 1.067rem /* 20/18.75 */;
					height: 1.333rem /* 25/18.75 */;
					color: grey;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
				}
			}
		}
	}

	.uni-list-cell-left {
		width: 50%;
		float: left;
	}

	.uni-list-cell-right {
		width: 50%;
		float: left;
		border-left: 0.053rem /* 1/18.75 */ solid #C8C7CC;
		box-sizing: border-box;
	}

	.uni-input {
		padding: 0 0.27rem;
	}

	.uni-input-title {
		width: calc(100% - 1.07rem);
		float: left;
		font-size: 0.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .uni-list-item__content {
		text-align: left;
	}

	/deep/ .uni-list-item__extra {
		font-size: 0.64rem;
		color: #999;
	}

	/deep/ .uni-list-item__icon-img {
		width: 2.24rem;
		height: 2.24rem;
	}

	.last-message {
		font-size: 0.64rem;
		color: #999;
	}
</style>