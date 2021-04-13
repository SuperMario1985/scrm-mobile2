<template>
	<view class="member_container" v-if="isReady">
		<uni-nav-bar left-icon="back" style="position: fixed; z-index: 9;" :title="title" @clickLeft="back"
		             background-color="#5284ec"
		             color="#fff"></uni-nav-bar>
		<view class="select-list content_head">
			<!--  选择	-->
			<view class="select-name">
				<input class="username" placeholder="搜索群成员" v-model="name" @input="chooseStaff"/>
				<uni-icons type="clear"
				           style="position: relative; z-index: 99; vertical-align: middle; font-size: 0.96rem  /* 18/18.75 */;color: #999;margin-left: -2.933rem; line-height: 1.493rem  /* 28/18.75 */; margin-top: 0.107rem  /* 2/18.75 */;"
				           v-if="name != ''" @click="chooseStaff('')"></uni-icons>
			</view>
			<view class="select-time">
				<view class="time-btn time-btn1" :class="dateIndex==1 ? 'ChangeColor' : ''"
				      @click="changeDateIndex(1,'今日')">今日
				</view>
				<view class="time-btn" :class="dateIndex==2 ? 'ChangeColor' : ''"
				      @click="changeDateIndex(2,'近七天')">近7天
				</view>
				<view class="time-btn" :class="dateIndex==3 ? 'ChangeColor' : ''"
				      @click="changeDateIndex(3,'近三十天')">近30天
				</view>
				<view class="time-btn time-btn2" :class="dateIndex==4 ? 'ChangeColor' : ''">
					<text @click="onShowDatePicker('range2')" v-if="dateIndex == 4 && range2.length == 2">
						{{range2[0]}}~{{range2[1]}}
					</text>
					<text @click="onShowDatePicker('range2')" v-else>
						自定义时间
					</text>
					<uni-icons @click="onShowDatePicker('range2')" v-if="dateIndex != 4 || range2.length != 2"
					           :style="dateIndex == 4 ? {color: '#1890FF'} : {color: '#999'}"
					           type="arrowdown"></uni-icons>
					<uni-icons style="margin-left: 0.267rem  /* 5/18.75 */;" v-if="dateIndex == 4 && range2.length == 2"
					           :style="dateIndex == 4 ? {color: '#1890FF'} : {color: '#999'}"
					           type="clear" @click="clearTime"></uni-icons>
				</view>
			</view>
			<view style="font-size: 0.693rem  /* 13/18.75 */;text-align: left;padding: 0 0.533rem; color: #FF562D;">
				*群成员是自己的客户才能点击，进入到客户详情页，否则无法进入。
			</view>
		</view>
		<view class="group-member">
			<view class="list" @click="goCustomDetail(item.external_userid)" v-for="item in groupMemberList">
				<view class="user-info">
					<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
					       :src="item.avatar" v-if="item.avatar"></image>
					<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
					       src="../../static/useradvart.png" v-if="!item.avatar"></image>
					<view class="list-hd-content">
						<view class="list-hd-content-name">{{item.name}}
							<text v-if="item.corp_name != null && item.corp_name != ''"
							      style="font-size: 0.587rem;color: #FA9635;line-height: 1.067rem  /* 20/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;">
								@{{item.corp_name}}
							</text>
							<text v-if="item.corp_name == null"
							      style="color: #30AB55;font-size: 0.587rem;line-height: 1.067rem  /* 20/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;">
								@微信
							</text>
							<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
							       src="../../static/scrm/man.png"
							       v-if="item.gender == 1"></image>
							<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
							       src="../../static/scrm/woman.png"
							       v-if="item.gender == 2"></image>
							<view style="display: inline-block;background-color: #58E182;border-radius: 8px;width: 25%;height: 20px;line-height:20px;text-align: center"
							      v-if="item.dialout_phone&&item.dialout_exten"
							      @click.stop="contact(item)">
								<span style="font-size: 14px;color:#FFF">联系TA</span>
							</view>
						</view>
						<view class="list-hd-content-name"
						      style="font-size: 0.693rem  /* 13/18.75 */; line-height: 1.28rem  /* 24/18.75 */;overflow: hidden;">
							<view :class="item.user_type == 0 ? 'blue' : (item.user_type == 1 ? 'orange' : (item.user_type == 2 ? 'pink' : 'green'))">
								{{item.type_name}}
							</view>
							<view class="group-num">其他所在群数{{item.chat_name.length}}个</view>
							<text v-if="isAudit == 1" class="message-num" style="float: right;">累计{{item.audit_num}}条
							</text>
							<uni-icons v-if="isAudit == 1"
							           style="float: right; color: #999;font-size: 0.693rem  /* 13/18.75 */;"
							           type="chat"></uni-icons>
						</view>
					</view>
					<uni-icons type="arrowright" v-if="item.external_userid != ''"
					           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;line-height: 2.4rem  /* 45/18.75 */;"></uni-icons>
				</view>
				<view style="text-align: left; padding: 0 0.533rem  /* 10/18.75 */;margin-top: 0.373rem  /* 7/18.75 */;">
					<view v-if="status == 0">
						<view class="join_scene">退群时间</view>
						<view class="join-time">{{item.leave_time}}</view>
					</view>
					<view>
						<view class="join_scene">{{item.join_scene}}</view>
						<view class="join-time">{{item.join_time}}</view>
					</view>
				</view>
			</view>
			<view v-if="groupMemberList.length != 0" class="loading-text">{{loadingText}}</view>
			<img class="empty-img" v-if="groupMemberList.length == 0" src="../../static/scrm/empty.png" alt=""/>
		</view>
		<mx-date-picker :showTips="true" format="yyyy-mm-dd" :show="showPicker" :type="dtype"
		                :value="value"
		                :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true"
		                @confirm="onSelected" @cancel="onSelected"/>
		<Footer v-if="is_show_copyright == 1"></Footer>

		<uni-popup ref="showPhone" type="center" :maskClick="false">
			<phoneCall v-if="showCall" :customerData="selectedCustomer" :callBack="replyCall"/>
		</uni-popup>
	</view>

</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import UniIcons from "../../components/uni-icons/uni-icons";
	import Footer from "../../components/footer/footer.vue";
	import FastWhaleCall from '@/components/fastwhalecall'
	import phoneCall from "@/components/call/phoneCall.vue";
	import Tag from "../../components/Tag";
	import SopPop from "../../components/sop/SopPop";

	/**
	 * 获取本周、本季度、本月、上月的开始日期、结束日期
	 */
	function now_date () {
		let now = new Date();
		let y = now.getFullYear();
		let m = now.getMonth() + 1
		let d = now.getDate();
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
		let time1 = y + "-" + m + "-" + d;
		return time1
	}

	function fun_date (day) {
		let date = new Date();
		date.setDate(date.getDate() - day);
		let m = (date.getMonth() + 1)
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate()
		d = d < 10 ? ('0' + d) : d;
		let time = date.getFullYear() + "-" + m + "-" + d;
		return time
	}

	export default {
		name         : "detail",
		inject       : ['initPage', 'getParameter','getPermissionButton'],
		data () {
			return {
				selectedCustomer : {},
				showCall         : false,
				actionId         : '',
				title            : '',
				isReady          : false,
				outInt           : '', // 成员输入框的延时
				status           : -1,
				//切换参数
				dateIndex        : 0,
				timeName         : '近七天',//选择时间
				s_date           : fun_date(6),
				e_date           : fun_date(),
				name             : '',
				//	日期计算
				range2           : [],
				dtype            : 'range2',
				value            : '',
				showPicker       : false,
				// 	year             : gety(12), // 12月前
				yesterday        : fun_date(1), // 一天前日期
				months           : fun_date(29), // 29天前日期
				nowDay           : now_date(), // 当前日期
				weekDay          : fun_date(6), // 6天前日期
				isAudit          : 0,
				groupMemberList  : [],
				total            : 0,
				page             : 1,
				loadingText      : '加载中...',
				showEdit         : true,//根据权限判断显不显示打标签
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad () {
			this.type = this.getParameter('type')
			this.status = this.getParameter('status')
			this.title = '群成员'
			if (this.type == 1) {
				this.title = '入群成员'
			} else if (this.type == 2) {
				this.title = '退群成员'
			}
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});

			let that = this
			this.$store.dispatch('setWx', () => {
				that.initPage(that.limit)
			})

			// this.status = 1
			// let str = ['client-add-tag', 'client-remove-tag', 'client-addFollow']
			// localStorage.setItem('permissionButton', str)
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'U3ViVXNlci0yYTBkM2ZkYWVmY2EzMTlhZjYxMzYxNmZiYjc2NTlmYg=')
			// this.initPageNew()
		},
		onShow () {
			if (this.hideFlag) {
				this.hideFlag = false
				this.getDataInfo()
			}
		},
		onHide () {
			this.hideFlag = true
		},
		onReachBottom: function () {
			if (this.groupMemberList.length < this.total) {
				this.getDataInfo(this.page + 1)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		methods      : {
			contact (item, type) {
				console.log(item)
				let that = this
				this.selectedCustomer.customerInfo = {}
				this.selectedCustomer.customerInfo.avatar = item.avatar
				this.selectedCustomer.customerInfo.name = item.name
				this.selectedCustomer.type = 0
				this.selectedCustomer.key = item.external_id

				let text1 = '是否拨打电话？拨打后，请先接听来电电话，接听后，才可自动对客户呼叫。'
				let text = '是否拨打电话'
				let msg = localStorage.getItem('userPlatform') == 'ios' ? text1 : text
				uni.showModal({
					title  : '提示',
					content: msg,
					success: function (res) {
						if(res.confirm){
							that.$refs.showPhone.open()
							that.showCall = true
						}
					}
				});
			},
			replyCall (data) {
				if (!data.showCall) {
					this.$refs.showPhone.close()
					this.showCall = false
				}
			},

			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				let agent_id = sessionStorage.getItem('agent_id') || localStorage.getItem('agent_id') || this.getParameter('agentId') || this.getParameter('agent_id') || ''

				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
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
					localStorage.setItem('corpid', that.corpid)
					that.ticketData = res.data.ticketData
					that.agentData = res.data.agentData

					if ((localStorage.getItem('corpid') || that.getParameter('corpid')) && localStorage.getItem('user_id')) {
						//获取权限
						that.getPermissionButton()
					}


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
						uni.showToast({
							title   : res.errMsg,
							image   : '/static/fail.png',
							duration: 2000
						});
					})

					that.$store.state.wx.ready(function () {
						that.$store.state.wx.hideOptionMenu();
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
										that.initPageNew()
									},
									fail     : function (res) {
										if (res.errMsg.indexOf('function not exist') > -1) {
											uni.showToast({
												title   : '版本过低请升级',
												image   : '/static/fail.png',
												duration: 2000
											});
										} else if (res.errMsg == 'agentConfig:not match any reliable domain.') {
											uni.showToast({
												title   : '可信域名未填写或未验证',
												image   : '/static/fail.png',
												duration: 2000
											});
										} else {
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
			initPageNew () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.permissionButton = JSON.parse(JSON.stringify(localStorage.getItem('permissionButton'))).split(',')
				if (this.permissionButton.indexOf('groupList-add-tag') > -1 && this.permissionButton.indexOf('groupList-remove-tag') > -1) {
					this.showEdit = true
				} else {
					this.showEdit = false
				}

				if (this.type == 1 || this.type == 2) {
					this.dateIndex = 1
					this.timeName = '今日'
					this.today()
					this.getDataInfo()
				} else {
					this.dateIndex = 4
					this.timeName = '自定义时间'
					this.range2 = []
					this.s_date = ''
					this.e_date = ''
					this.getDataInfo()
				}
			},
			//返回
			back () {
				history.back()
			},
			//选择成员
			chooseStaff (e) {
				if (e) {
					clearTimeout(this.outInt)
					this.name = e.detail.value
					let that = this
					this.outInt = setTimeout(that.getDataInfo, 300)
				} else {
					this.name = ''
					this.getDataInfo()
				}

			},
			changeDateIndex (index, timeName) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					this.range2 = []
					if (index == 1) {
						this.today()
					} else if (index == 2) {
						this.lastWD()
					} else if (index == 3) {
						this.lastMD()
					}
					if (index != 4) {
						this.timeName = timeName
						this.getDataInfo()
					}
				}
			},
			//		定义时间
			//		近七天
			lastWD () {
				this.s_date = this.weekDay
				this.e_date = this.nowDay
			},
			// //今日
			today () {
				this.s_date = this.nowDay
				this.e_date = this.nowDay
			},
			//昨日
			ysd () {
				this.s_date = this.yesterday
				this.e_date = this.yesterday
			},
			//		近三十天
			lastMD () {
				this.s_date = this.months
				this.e_date = this.nowDay
			},

			onShowDatePicker (type) {//显示
				this.timeName = '自定义时间'
				this.dtype = type;
				this.showPicker = true;
				this.value = this[type]
			},
			onSelected (e) {//选择
				this.showPicker = false;
				if (e) {
					this[this.dtype] = e.value;
					if (this.range2.length > 0) {
						this.s_date = this.range2[0]
						this.e_date = this.range2[1]
					} else {
						this.s_date = ''
						this.e_date = ''
					}
					this.dateIndex = 4
					this.getDataInfo()
				}
			},
			clearTime () {
				this.s_date = ''
				this.e_date = ''
				this.range2 = []
				this.getDataInfo()
			},

			// 获取成员详情
			async getDataInfo (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post('work-chat/chat-info-list', {
					chatid    : this.getParameter('chat_id') ? this.getParameter('chat_id') : this.$store.state.chatId,
					now_userid: localStorage.getItem('user_id'),
					corp_id   : localStorage.getItem('corpid'),
					stime     : this.s_date ? (this.s_date + ' 00:00') : '',
					etime     : this.e_date ? (this.e_date + ' 23:59') : '',
					name      : this.name,
					page      : page,
					page_size : 15,
					status    : this.status,
				})
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					if (page == 1) {
						this.groupMemberList = res.data.list
						this.loadingText = '加载中...'
					} else {
						this.groupMemberList = this.groupMemberList.concat(res.data.list)
					}
					this.isAudit = res.data.isAudit
					this.total = parseInt(res.data.count)
					this.page = page
					if (this.groupMemberList.length == this.total) {
						this.loadingText = '已加载全部'
					}
					uni.hideLoading();
					this.isReady = true
				}
			},
			goCustomDetail (external_userid) {
				if (external_userid) {
					uni.navigateTo({
						url: '/pages/customDetail/index?external_userid=' + external_userid + '&source=group' + '&agent_id=' + (this.getParameter('agent_id') ? this.getParameter('agent_id') : this.getParameter('agentId'))
					});
				}
			}
		},
		components   : {
			UniIcons,
			msDropdownMenu,
			msDropdownItem,
			MxDatePicker,
			Footer,
			phoneCall
		}
	}
</script>

<style scoped lang="less">
	.member_container {
		background: #F1F3F5;
		overflow-y: auto;

		/deep/ .dropdown-item__selected[data-v-aa4f4da6] {
			padding: 0;
		}

		/deep/ .iconfont {
			font-size: 0.693rem
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.693rem !important;
		}


		/deep/ .dropdown-item:not(:last-child):after {
			width: 0;
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem !important;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
			max-width: 3.733rem;
		}

		/deep/ uni-toast .uni-sample-toast {
			z-index: 99999999999999999 !important;
		}

		/deep/ uni-page-wrapper {
			background: #F1F3F5 !important;
		}

		.username {
			height: 1.6rem;
			line-height: 1.6rem;
			text-align: left;
			border: 0.053rem /* 1/18.75 */ solid #F1F3F5 !important;
			padding: 0rem /* 0/18.75 */ 0.267rem /* 5/18.75 */;
			border-radius: 0.16rem /* 3/18.75 */;
		}
	}

	.group-member {
		color: #333333;
		margin-top: 10.488rem;
		background-color: #FFFFFF;

		.list {
			padding: 0.533rem /* 10/18.75 */ 0;
			border-bottom: 1px solid #F1F3F5;

			.user-info {
				min-height: 2.133rem /* 40/18.75 */;
				text-align: left;
				padding: 0.267rem /* 5/18.75 */ 0.533rem /* 10/18.75 */;

				.list-hd-content {
					padding: 0 0.533rem /* 10/18.75 */;
					width: calc(100% - 3.253rem /* 61/18.75 */);
					float: left;
					box-sizing: border-box;
				}

				.list-hd-content-name {
					color: #333;
					font-weight: 700;
					font-size: 0.8rem /* 15/18.75 */;
					overflow: hidden;
					vertical-align: top;
					margin-bottom: 0.107rem /* 2/18.75 */;
				}

				.message-icon {
					vertical-align: middle;
					width: 0.853rem /* 16/18.75 */;
					height: 0.853rem /* 16/18.75 */;
				}

				.message-num {
					color: #999;
					font-weight: 500;
					font-size: 0.693rem /* 13/18.75 */;
					margin-left: 0.267rem /* 5/18.75 */;
				}

				.gt {
					float: right;
					height: 2.667rem /* 50/18.75 */;
					line-height: 2.667rem /* 50/18.75 */;
					font-size: 1.067rem /* 20/18.75 */;
				}
			}

			.group-num {
				line-height: normal;
				margin-left: 0.267rem /* 5/18.75 */;
				display: inline-block;
				border-radius: 0.213rem /* 4/18.75 */;
				border: 0.053rem /* 1/18.75 */ solid #999;
				color: #999;
				border-radius: 4px;
				padding: 0.053rem /* 1/18.75 */ 0.373rem /* 7/18.75 */;
				font-size: 0.587rem /* 11/18.75 */;
			}

			.join_scene {
				width: 60%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: inline-block;
				font-size: 0.693rem /* 13/18.75 */;
			}

			.join-time {
				width: 40%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: inline-block;
				text-align: right;
				font-size: 0.693rem /* 13/18.75 */;
			}
		}

		.loading-text {
			padding: 0.533rem /* 10/18.75 */;
			font-size: 0.747rem /* 14/18.75 */;
		}
	}

	.empty-img {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 38%;
		/*width: 8.533rem !* 160/18.75 *!;*/
		/*height: 6.4rem !* 120/18.75 *!;*/
		transform: translate(-50%, -50%);
	}

	.corp-name {
		font-size: 0.64rem /* 12/18.75 */;
		color: #FA9635;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	.wx-name {
		font-size: 0.64rem /* 12/18.75 */;
		color: #30AB55;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	.pink, .green, .orange, .blue {
		display: inline-block;
		border-radius: 4px;
		padding: 0 0.373rem /* 7/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		line-height: normal;
	}

	.pink {
		border: 1px solid #FFADD2;
		color: #EB2F96;
		background: #FFF0F6;
	}

	.green {
		border: 1px solid #B7EB8F;
		color: #52C41A;
		background: #F6FFED;
	}

	.orange {
		border: 1px solid #FFD591;
		color: #FA8C16;
		background: #FFF7E6;
	}

	.blue {
		border: 1px solid #91D5FF;
		color: #1890FF;
		background: #E6F7FF;
	}

	/deep/ .uni-input-input {
		font-size: 0.693rem /* 13/18.75 */;
	}

	/deep/ .uni-input-placeholder {
		font-size: 0.693rem /* 13/18.75 */;
		color: #999999;
	}

	/deep/ .uni-navbar__header {
		height: 2.347rem /* 44/18.75 */;
		line-height: 2.347rem /* 44/18.75 */;
	}

	.member_container {
		background: #F1F3F5;
		overflow-y: auto;

		.select-list {
			position: fixed;
			top: 2.347rem;
			box-sizing: border-box;
			left: 0;
			right: 0;
			z-index: 100;
			padding: 0;
			background: #FFF;
			height: 8.075rem;
			z-index: 99;
			text-align: left;
		}

		/deep/ .dropdown-item__selected[data-v-aa4f4da6] {
			padding: 0;
		}

		/deep/ .iconfont {
			font-size: 0.693rem
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.693rem !important;
		}

		.sort-icon {
			line-height: 1.6rem;
			height: 1.6rem;
			flex-grow: 1;
			justify-content: center;
			display: flex;
			align-items: center;
			font-weight: bold;
		}

		.time-btn {
			flex-grow: 1;
			justify-content: center;
			display: flex;
			line-height: normal;
			align-items: center;
			height: 1.281rem;
			font-size: 0.747rem /* 14/18.75 */;
			border: 1px solid #F1F3F5;
			border-left: 0;
			background-color: #FFFFFF;
			color: #999;
			padding: 0.267rem 0 0.267rem 0;
		}

		.time-btn1 {
			border-left: 1px solid #F1F3F5 !important;
			border-bottom-left-radius: 5px;
			border-top-left-radius: 5px;
		}

		.time-btn2 {
			border-bottom-right-radius: 5px;
			border-top-right-radius: 5px;
		}

		.ChangeColor {
			border: 1px solid #1890FF !important;
			background-color: #FFFFFF;
			color: #1890FF;
		}


		/deep/ .dropdown-item:not(:last-child):after {
			width: 0;
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem !important;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
			max-width: 3.733rem;
		}

		/deep/ uni-toast .uni-sample-toast {
			z-index: 99999999999999999 !important;
		}

		/deep/ uni-page-wrapper {
			background: #F1F3F5 !important;
		}

		.header {
			text-align: left;
		}

		.select-time {
			display: flex;
			margin: 0.6rem 0 0.6rem;
			padding: 0 0.533rem /* 10/18.75 */;
		}

		.select-name {
			display: inline-block;
			line-height: 1.6rem;
			align-items: center;
			font-size: 0.747rem;
			color: #999;
			width: 100%;
			padding: 0.534rem 0;
			background-color: #1890FF;
		}

		.username {
			width: calc(100% - 2.733rem);
			margin-right: 1.1rem /* 15/18.75 */;
			display: inline-block;
			line-height: normal;
			text-align: left;
			border: 1px solid #F1F3F5 !important;
			border-radius: 0.8rem;
			margin-left: 0.533rem /* 10/18.75 */;
			padding: 0 0.8rem;
			vertical-align: middle;
			background-color: #FFF;
		}
	}

	.input-box {
		width: 81%;
		height: 1.6rem /* 30/18.75 */;
		float: left;
		box-sizing: border-box;
		border: 0.053rem /* 1/18.75 */ solid #FFF;
		margin: 0 2% 0.8rem /* 15/18.75 */;
		background: #FFF;
		border-radius: 0.96rem /* 18/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		color: #999;
		padding: 0 0.533rem /* 10/18.75 */ !important;
		display: flex;
		/*align-items: center;*/
		/*justify-content: center;*/
	}

	.search-input {
		font-size: 1.493rem /* 28/18.75 */;
		width: calc(200% - 4rem /* 75/18.75 */);
		flex-shrink: 0;
		display: inline-block;
		line-height: 2.987rem /* 56/18.75 */ !important;
		transform: scale(0.5);
		transform-origin: left top;
		/*margin-top: 0.053rem  !* 1/18.75 *!;*/
		height: 2.987rem /* 56/18.75 */;
		margin-top: 0.053rem /* 1/18.75 */;
	}

</style>
