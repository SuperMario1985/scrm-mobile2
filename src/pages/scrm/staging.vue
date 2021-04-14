<template>
	<view>
		<view class="box" v-if="isReady && !showChooseDepartment">
			<view class="list">
				<view class="list-hd">
					<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;border-radius: 50%;float: left;"
					       :src="avatar"></image>
					<view class="list-hd-content">
						<view class="list-hd-content-name">{{name}}</view>
						<view class="list-hd-content-name" style="color:  #B2CBFF;font-size: 0.64rem  /* 12/18.75 */;">
							{{departName}}
						</view>
					</view>
					<view class="list-hd-btn" @click="addCustom" v-if="userPlatform != 'other'">
						<uni-icons type="plus" size="12" style="color: #FFF;margin-right: 0.107rem  /* 2/18.75 */;"/>
						添加客户
					</view>
				</view>
				<view class="list-bd"></view>
			</view>
			<view class="title">
				<view class="title-head" @click="chooseStaff">
					<view style="float: left" v-if="isSelf == 1">仅自己数据</view>
					<view style="float: left" v-if="isSelf == 0">{{scopeName}}</view>
					<uni-icons type="arrowright" size="14" style="color: rgba(172,172,172,1);float: right;"
					           v-if="isSelf == 0"/>
				</view>
				<view class="title-data">
					<view class="title-data-left">
						<view class="title-data-left-title">{{allExternalNum}}</view>
						<view class="title-data-left-text">累计客户
							<uni-icons type="help-filled"
							           style="color: rgba(172,172,172,1);font-size: 0.747rem  /* 14/18.75 */;"
							           @click="showNotice(1)"/>
							<!--							<uni-icons type="arrowright" size="14"-->
							<!--							           style="color: rgba(172,172,172,1);margin-left: 1.067rem  /* 20/18.75 */;"/>-->
						</view>
					</view>
					<view class="title-data-left">
						<view class="title-data-left-title" style="margin-left: 0.8rem  /* 15/18.75 */;">
							{{allChatNum}}
						</view>
						<view class="title-data-left-text" style="margin-left: 0.8rem  /* 15/18.75 */;">累计客户群
							<uni-icons type="help-filled"
							           style="color: rgba(172,172,172,1);font-size: 0.747rem  /* 14/18.75 */;"
							           @click="showNotice(2)"/>
							<!--							<uni-icons type="arrowright" size="14"-->
							<!--							           style="color: rgba(172,172,172,1);margin-left: 1.067rem  /* 20/18.75 */"/>-->
						</view>
					</view>
				</view>
				<view class="title-data-content">
					<view class="title-data-content-card">
						<image style="width: 0.96rem  /* 18/18.75 */;height:0.96rem  /* 18/18.75 */;float: left;margin: 1.067rem  /* 20/18.75 */ 0.64rem  /* 12/18.75 */ 0 0.32rem  /* 6/18.75 */;"
						       src="../../static/scrm/1.png"></image>
						<view style="float: left;width: calc(100% - 2.453rem  /* 46/18.75 */);">
							<view class="title-data-content-card-title">{{todayExternalNum}}</view>
							<view class="title-data-content-card-text">今日新增客户</view>
						</view>
					</view>
					<view class="title-data-content-card">
						<image style="width: 0.853rem  /* 16/18.75 */;height:0.96rem  /* 18/18.75 */;float: left;margin: 1.067rem  /* 20/18.75 */ 0.747rem  /* 14/18.75 */ 0 0.32rem  /* 6/18.75 */;"
						       src="../../static/scrm/2.png"></image>
						<view style="float: left;width: calc(100% - 2.453rem  /* 46/18.75 */);">
							<view class="title-data-content-card-title">{{todayExternalDelNum}}</view>
							<view class="title-data-content-card-text">今日流失客户</view>
						</view>
					</view>
					<view class="title-data-content-card">
						<image style="width: 0.96rem  /* 18/18.75 */;height:0.96rem  /* 18/18.75 */;float: left;margin: 1.067rem  /* 20/18.75 */ 0.64rem  /* 12/18.75 */ 0 0.32rem  /* 6/18.75 */;"
						       src="../../static/scrm/3.png"></image>
						<view style="float: left;width: calc(100% - 2.453rem  /* 46/18.75 */);">
							<view class="title-data-content-card-title">{{todayExternalFollowNum}}</view>
							<view class="title-data-content-card-text">今日跟进客户</view>
						</view>
					</view>
					<view class="title-data-content-card">
						<image style="width: 1.253rem  /* 23.5/18.75 */;height:0.96rem  /* 18/18.75 */;float: left;margin: 1.067rem  /* 20/18.75 */ 0.347rem  /* 6.5/18.75 */ 0 0.32rem  /* 6/18.75 */;"
						       src="../../static/scrm/4.png"></image>
						<view style="float: left;width: calc(100% - 2.453rem  /* 46/18.75 */);">
							<view class="title-data-content-card-title">{{todayChatNum}}</view>
							<view class="title-data-content-card-text">今日新增入群数</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<view class="content-hd">
					<view class="content-hd-title">跟进简报</view>
					<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" :scroll-into-view="toView"
					             scroll-with-animation
					             style="white-space: nowrap;">
						<view class="content-hd-tabs" v-for="item in followList" :id="'view'+item.id"
						      :style="{'background':item.id == followId ? '#01B065' : '','color': item.id == followId ? '#FFF' : ''}"
						      @click="changeFollowId(item.id,item.title)">{{item.title}}
							<text v-if="item.status == 0">（已删除）</text>
						</view>
					</scroll-view>
					<view style="cursor:pointer;overflow: hidden;" @click="goToCustomList">
						<text style="font-size: 0.747rem  /* 14/18.75 */;color: #666;line-height: 3.467rem  /* 65/18.75 */;">
							当前状态人数
						</text>
						<view style="display: inline-block;margin: 0.8rem  /* 15/18.75 */ 0 1.067rem  /* 20/18.75 */ 0;float: right;">
							<text style="font-size: 1.28rem  /* 24/18.75 */;color: #343434;margin-right: 1.067rem  /* 20/18.75 */;">
								{{externalFollowNum}}
							</text>
							<uni-icons type="arrowright" size="14"
							           style="color: rgba(172,172,172,1);vertical-align: text-top;"/>
						</view>
					</view>
				</view>
				<view class="content-bd">
					<view class="title-data-content-card" v-for="item in notFollowDayData">
						<image style="width: 0.96rem  /* 18/18.75 */;height:0.96rem  /* 18/18.75 */;float: left;margin: 1.067rem  /* 20/18.75 */ 0.64rem  /* 12/18.75 */ 0 0.32rem  /* 6/18.75 */;"
						       src="../../static/scrm/5.png"></image>
						<view style="float: left;">
							<view class="title-data-content-card-title">{{item.num}}</view>
							<view class="title-data-content-card-text" v-if="item.day > 0">超过{{item.day}}天未联系</view>
							<view class="title-data-content-card-text" v-if="item.day == 0">一直未联系</view>
						</view>
					</view>
				</view>
			</view>
			<Footer v-show="is_show_copyright == 1"></Footer>
		</view>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";

	export default {
		name        : "list",
		inject      : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden','getPermissionButton'],
		components  : {
			Footer,
			ChooseDepartment
		},
		data () {
			return {
				url       : '',
				ticketData: {},
				agentData : {},

				commonUrl             : this.$store.state.commonUrl,
				isReady               : false,
				name                  : '',//名字
				avatar                : '',//头像
				departName            : '',//部门名称
				allExternalNum        : 0,//客户数
				allChatNum            : 0,//客户群数
				todayExternalNum      : 0,//今日新增客户
				todayExternalDelNum   : 0,//今日流失客户
				todayExternalFollowNum: 0,//今日跟进客户
				todayChatNum          : 0,//今日新增入群数
				isSelf                : 0,//数据可见范围，1仅自己  0其它
				followId              : '',//选择的跟进状态
				followName            : '',//选择的跟进状态名称
				toView                : '',//要跳转的位置
				followList            : [],//跟进状态数组
				externalFollowNum     : 0,//当前跟进状态客户数
				notFollowDayData      : [],//未联系客户数据
				scopeName             : '全部',
				userPlatform          : localStorage.getItem('userPlatform'),//客户端平台，pc端other，安卓手机android，苹果手机ios
				showChooseDepartment  : false,//选择成员组件的显示与隐藏
				selectDepartment      : [],//已选择的成员
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onTabItemTap: function (obj) {
			this.selectDepartment = []
			try {
				uni.removeStorageSync('name');
				uni.removeStorageSync('follow_id');
				uni.removeStorageSync('follow_name');
				uni.removeStorageSync('tab_btn_type');
				uni.removeStorageSync('rangetime');
				uni.removeStorageSync('sex');
				uni.removeStorageSync('is_fans');
				uni.removeStorageSync('chat_type');
				uni.removeStorageSync('link_time');
				uni.removeStorageSync('from');
			} catch (e) {
				// error
			}
		},
		onShow      : function () {
			uni.setNavigationBarTitle({
				title: '工作台'
			});
			this.isReady = false
			uni.hideTabBar()
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});

			let agent_id = sessionStorage.getItem('agent_id') || localStorage.getItem('agent_id') || this.getParameter('agentId') || this.getParameter('agent_id') || ''
			localStorage.setItem('agent_id', agent_id)
			sessionStorage.setItem('agent_id', agent_id)


			this.$store.dispatch('setWx', () => {
				this.initPage(this.limit)
			})

			// let str = ['client-add-tag', 'client-remove-tag', 'client-addFollow', 'client-editInfo', 'other-store', 'client-bind', 'client-assign', 'client-backHighSea', 'client-protect', 'client-import', 'highSeasCustomerList-claim', 'highSeasCustomerList-import', 'highSeasCustomerList-assign', 'highSeasCustomerList-notice']
			// localStorage.setItem('permissionButton', str)
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// // localStorage.setItem('user_id', 'YiQieSuiYuan')
			// localStorage.setItem('user_id', 'liyunli')
			// // localStorage.setItem('user_id', 'shakalaka')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.getInfoData()

		},
		methods     : {
			//添加客戶
			addCustom () {
				this.$store.state.wx.invoke('navigateToAddCustomer',
					{},
					function (res) {
						if (res.err_code != 0) {
							uni.showToast({
								title   : '请检查应用权限与客户功能权限',
								image   : '/static/fail.png',
								duration: 2000
							});
						}
					}
				);
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
										that.getInfoData()
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
			getInfoData () {
				this.userPlatform = localStorage.getItem('userPlatform')
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.getFollow()
			},
			async getData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				let userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						userId.push(this.selectDepartment[i].id)
					}
				}

				const {data: res} = await this.axios.post("wap-user-desktop/work-user-custom-statistic", {
					corp_id : localStorage.getItem('corpid'),
					user_id : localStorage.getItem('user_id'),
					user_ids: userId,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.name = res.data.name
					this.avatar = res.data.avatar
					this.departName = res.data.departName
					this.allExternalNum = res.data.allExternalNum
					this.allChatNum = res.data.allChatNum
					this.todayExternalNum = res.data.todayExternalNum
					this.todayExternalDelNum = res.data.todayExternalDelNum
					this.todayExternalFollowNum = res.data.todayExternalFollowNum
					this.todayChatNum = res.data.todayChatNum
					this.isSelf = res.data.is_self
					if (res.data.user_count == 0) {
						this.scopeName = '全部'
					} else {
						this.scopeName = '已选择' + res.data.user_count + '个成员'
					}
					this.getFollowData()
					uni.hideLoading();
					uni.showTabBar()
				}
			},
			//获取跟进状态
			async getFollow () {
				const {data: res} = await this.axios.post("custom-field/follow", {
					uid: localStorage.getItem('uid')
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.followList = res.data.follow
					this.followId = res.data.follow[0].id
					this.followName = res.data.follow[0].title
					this.toView = 'view' + this.followId
					this.getData()
				}
			},
			//获取跟进信息
			async getFollowData () {
				let userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						userId.push(this.selectDepartment[i].id)
					}
				}

				const {data: res} = await this.axios.post("wap-user-desktop/work-user-custom-follow", {
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					follow_id: this.followId,
					user_ids : userId,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.isReady = true
					uni.hideLoading();
					this.externalFollowNum = res.data.externalFollowNum
					this.notFollowDayData = res.data.notFollowDayData
					if (this.notFollowDayData.length % 2 == 1) {
						this.$nextTick(() => {
							let box = document.getElementsByClassName('title-data-content-card')
							box[box.length - 2].style.borderBottom = '1px solid #f1f4f6'
						})
					}
					uni.stopPullDownRefresh();
				}
			},
			//切换跟进状态
			changeFollowId (id, name) {
				this.followId = id
				this.followName = name
				// console.log('左侧',document.getElementById('view'+id).offsetLeft)
				// console.log('盒子宽度',document.getElementById('view'+id).clientWidth)
				// console.log('屏幕宽度',document.body.clientWidth)
				if (document.getElementById('view' + id).offsetLeft + document.getElementById('view' + id).clientWidth > document.body.clientWidth) {
					this.toView = 'view' + id
				}
				this.getFollowData()
			},
			//展示提示信息
			showNotice (type) {
				if (type == 1) {
					uni.showModal({
						content   : '实际客户数，去除客户删除员工、员工删除客户',
						showCancel: false
					});
				} else if (type == 2) {
					uni.showModal({
						content   : '实际客户群数，去除已解散的群',
						showCancel: false
					});
				}
			},
			//选择成员
			chooseStaff () {
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				uni.hideTabBar()
				this.showChooseDepartment = true
			},
			replyDepartment (arr) {
				this.showChooseDepartment = false
				uni.showTabBar()
				if (typeof arr == 'object') {
					this.selectDepartment = arr
					this.getInfoData()
				}
			},
			//跳转客户列表
			goToCustomList () {
				try {
					let tabBtnType = 0
					let rangetime = []
					let sex = -1
					let isFans = 0
					let chat_type = 0
					let linkTime = 0
					let from = 1
					uni.setStorageSync('follow_id', this.followId);
					uni.setStorageSync('follow_name', this.followName);
					uni.setStorageSync('tab_btn_type', tabBtnType);
					uni.setStorageSync('rangetime', rangetime);
					uni.setStorageSync('sex', sex);
					uni.setStorageSync('is_fans', isFans);
					uni.setStorageSync('chat_type', chat_type);
					uni.setStorageSync('link_time', linkTime);
					uni.setStorageSync('from', from);
				} catch (e) {
					// error
				}
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.switchTab({
					url: "/pages/scrm/customer?follow_id=" + this.followId + '&follow_name' + this.followName + 'agent_id=' + agent_id
				});
			}
		},
	}
</script>

<style scoped>
	.box {
		background: #F2F3F5;
		text-align: left;
		/*position: fixed;*/
		/*top: 0;*/
		/*left: 0;*/
		/*right: 0;*/
		/*bottom: 50px;*/
		/*overflow-y: auto;*/
		font-size: 0.8rem /* 15/18.75 */;
		height: calc(100% - 50px);
		overflow: hidden;
	}

	.list {
		width: 20rem /* 375/18.75 */;
		height: 7.377rem /* 138.31/18.75 */;
		overflow: hidden;
		margin: auto;
	}

	.list-hd {
		background: #01B065;
		height: 3.813rem /* 71.5/18.75 */;
		padding: 0.8rem /* 15/18.75 */ 0.8rem /* 15/18.75 */ 0;
		box-sizing: border-box;
	}

	.list-hd-content {
		height: 2.4rem /* 45/18.75 */;
		float: left;
		width: calc(100% - 7.1rem);
		margin: 0 0.267rem /* 5/18.75 */;
	}

	.list-hd-content-name {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		width: 100%;
		color: #FFF;
		font-weight: 700;
		margin-top: 0.267rem /* 5/18.75 */;
	}

	.list-hd-btn {
		width: 4rem /* 75/18.75 */;
		height: 1.28rem /* 24/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
		text-align: center;
		color: #FFF;
		border: 1px solid #B2CBFF;
		border-radius: 0.533rem /* 10/18.75 */;
		float: left;
		margin-top: 0.507rem /* 9.5/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
	}

	.list-bd {
		background: #01B065;
		height: 3.2rem /* 60/18.75 */;
		border-bottom-left-radius: 50%;
		border-bottom-right-radius: 50%;
		width: 106%;
		margin-left: -3%;
		margin-top: -1px;
	}

	.title {
		width: 18.933rem /* 355/18.75 */;
		background: rgba(255, 255, 255, 1);
		border-radius: 0.533rem /* 10/18.75 */;
		margin: -3.5632rem /* -66.81/18.75 */ auto 0;
		padding: 0.64rem /* 12/18.75 */ 0.8rem /* 15/18.75 */ 0;
		box-sizing: border-box;
	}

	.title-head {
		line-height: 1.84rem /* 34.5/18.75 */;
		border-bottom: 1px solid rgba(241, 244, 246, 1);
		overflow: hidden;
	}

	.title-data {
		border-bottom: 0.053rem /* 1/18.75 */ solid rgba(241, 244, 246, 1);
		overflow: hidden;
	}

	.title-data-left {
		width: 50%;
		float: left;
	}

	.title-data-left-title {
		color: #343434;
		font-size: 1.28rem /* 24/18.75 */;
		margin-top: 1.067rem /* 20/18.75 */;
		margin-bottom: 0.107rem /* 2/18.75 */;
	}

	.title-data-left-text {
		color: #5C5C5C;
		font-size: 0.747rem /* 14/18.75 */;
		margin-bottom: 0.533rem /* 10/18.75 */;
	}

	.title-data-content-card {
		border-right: 0.053rem /* 1/18.75 */ solid rgba(241, 244, 246, 1);
		display: inline-block;
		width: calc(50% - 0.053rem /* 1/18.75 */);
	}

	.title-data-content-card:nth-child(2n) {
		border-right: 0;
		padding-left: 0.8rem /* 15/18.75 */;
		box-sizing: border-box;
	}

	.title-data-content-card:not(:nth-last-child(-1n+2)) {
		border-bottom: 0.053rem /* 1/18.75 */ solid rgba(241, 244, 246, 1);
	}

	.title-data-content-card-title {
		font-weight: 700;
		margin: 0.533rem /* 10/18.75 */ 0 0.267rem /* 5/18.75 */ 0;
		font-size: 0.853rem /* 16/18.75 */;
	}

	.title-data-content-card-text {
		color: #656565;
		font-size: 0.64rem /* 12/18.75 */;
		margin-bottom: 0.533rem /* 10/18.75 */;
	}

	.content {
		width: 18.933rem /* 355/18.75 */;
		background: rgba(255, 255, 255, 1);
		border-radius: 0.533rem /* 10/18.75 */;
		margin: 0.533rem /* 10/18.75 */ auto 0.533rem /* 10/18.75 */;
		padding: 1.067rem /* 20/18.75 */ 0.8rem /* 15/18.75 */;
		box-sizing: border-box;
	}

	.content-hd {
		border-bottom: 1px solid rgba(241, 244, 246, 1);
	}

	.content-hd-title {
		color: #000;
		font-weight: 700;
		margin-bottom: 0.693rem /* 13/18.75 */;
	}

	.content-hd-tabs {
		display: inline-block;
		padding: 0.16rem /* 3/18.75 */ 0.427rem /* 8/18.75 */;
		height: 1.067rem /* 20/18.75 */;
		line-height: 1.067rem /* 20/18.75 */;
		text-align: center;
		font-size: 0.64rem /* 12/18.75 */;
		border: 1px solid rgba(241, 244, 246, 1);
		border-radius: 0.8rem /* 15/18.75 */;
		margin: 0 0.267rem /* 5/18.75 */ 0.267rem /* 5/18.75 */ 0;
		cursor: pointer;
	}
</style>