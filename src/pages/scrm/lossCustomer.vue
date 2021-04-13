<template>
	<view>
		<view class="box" v-if="isReady && !showChooseDepartment">
			<view style="background: #FFF;z-index:99;position: fixed;top: 0;left: 0;right: 0;">
				<uni-nav-bar left-icon="back" @clickLeft="back" background-color="#5284ec" color="#fff">
					<uni-search-bar :radius="100" @input="search" clearButton="always" cancelButton="none"
					                style="width: 14.933rem  /* 280/18.75 */;line-height: 1.6rem  /* 30/18.75 */;"
					                placeholder="请输入客户姓名/昵称/备注/公司名称"></uni-search-bar>
				</uni-nav-bar>
				<view class="tab_picker">
					<view class="choose-tags" @click="chooseTags">
						<span v-if="tagIds.length == 0">按标签</span>
						<span v-if="tagIds.length > 0">{{tagIds.length}}个标签</span>
						<uni-icons type="arrowdown"
						           style="color: #2C3E50;margin: 0rem  /* 0/18.75 */ 0.427rem  /* 8/18.75 */ 0 0.267rem  /* 5/18.75 */;font-size: 0.853rem  /* 16/18.75 */;"></uni-icons>
					</view>
					<view class="choose-tags" @click="chooseStaff" v-if="show == 0">
						<span v-if="userCount == 0">所属成员</span>
						<span v-if="userCount > 0">{{userCount}}个成员</span>
						<uni-icons type="arrowdown"
						           style="color: #2C3E50;margin: 0rem  /* 0/18.75 */ 0.427rem  /* 8/18.75 */ 0 0.267rem  /* 5/18.75 */;font-size: 0.853rem  /* 16/18.75 */;"></uni-icons>
					</view>
				</view>
				<view style="background: #FFF;">
					<view style="display: flex;justify-content:space-around;margin: 0.8rem  /* 15/18.75 */ 0;">
						<button type="default" plain="true" class="tab-btn"
						        :class="tabBtnType == 0 ? 'active-tab-btn' : ''" @click="changeTabBtn(0)">全部客户
						</button>
						<button type="default" plain="true" class="tab-btn"
						        :class="tabBtnType == 1 ? 'active-tab-btn' : ''" @click="changeTabBtn(1)">今日流失
						</button>
						<button type="default" plain="true" class="tab-btn"
						        :class="tabBtnType == 2 ? 'active-tab-btn' : ''" @click="changeTabBtn(2)">本周流失
						</button>
						<button type="default" plain="true" class="tab-btn"
						        :class="tabBtnType == 3 ? 'active-tab-btn' : ''" @click="changeTabBtn(3)">本月流失
						</button>
					</view>
					<view style="padding: 0 0.533rem  /* 10/18.75 */ 0.853rem;">
						<text style="color: #2A3349;font-size: 0.587rem  /* 11/18.75 */;">
							共{{count}}位客户
						</text>
					</view>

				</view>
			</view>
			<view class="content-list">
				<view class="content-list-item" v-for="item in customList">
					<view class="content-list-item-text">
						<view style="overflow:hidden;">
							<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;"
							       :src="item.customerInfo.avatar" v-if="item.customerInfo.avatar"></image>
							<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;"
							       src="../../static/useradvart.png" v-if="!item.customerInfo.avatar"></image>
							<view class="list-hd-content">
								<view class="list-hd-content-name">{{item.customerInfo.name}}
									<image style="width: 0.853rem  /* 16/18.75 */;height: 0.693rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/man.png"
									       v-if="item.customerInfo.gender == '男性'"></image>
									<image style="width: 0.853rem  /* 16/18.75 */;height: 0.693rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/woman.png"
									       v-if="item.customerInfo.gender == '女性'"></image>
								</view>
								<view class="list-hd-content-name"
								      style="font-size: 0.64rem  /* 12/18.75 */;line-height: 1.28rem  /* 24/18.75 */;height: 1.28rem  /* 24/18.75 */;overflow: hidden;">
									<text v-if="item.customerInfo.per_name.length == 0 && item.customerInfo.tag_name.length == 0"
									      style="color: #00A6F9;">暂无标签
									</text>
									<text v-for="tag in item.customerInfo.per_name" class="list-hd-content-tag">{{tag}}
									</text>
									<text v-for="tag in item.customerInfo.tag_name" class="list-hd-content-tag">{{tag}}
									</text>
								</view>
							</view>
							<uni-icons type="arrowright"
							           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;line-height: 2.667rem  /* 50/18.75 */;"></uni-icons>
						</view>
						<view>
							<text style="background: #F5F6FE;border-radius: 0.533rem  /* 10/18.75 */;color: #5283EC;font-size: 0.587rem  /* 11/18.75 */;padding: 0 0.267rem  /* 5/18.75 */;line-height: 1.067rem  /* 20/18.75 */;height: 1.067rem  /* 20/18.75 */;display: inline-block;float: right;">
								{{item.member}}
							</text>
						</view>
					</view>
				</view>
				<view class="custom-tabs-loading" v-if="customList.length > 0">{{loadingText}}
				</view>
			</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</view>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";

	export default {
		name         : "list",
		inject       : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden','getCopyright'],
		components   : {
			Footer,
			ChooseDepartment
		},
		data () {
			return {
				url       : '',
				ticketData: {},
				agentData : {},

				commonUrl           : this.$store.state.commonUrl,
				isReady             : false,
				tabBtnType          : 0,//0全部客户，1今日流失，2本周流失，3本月流失
				show                : 0,//0显示选择成员，1不显示选择成员
				//客户列表
				customList          : [],//列表数据
				page                : 1,//页码
				count               : 0,//分页
				customCount         : 0,//客户数
				uniqueCount         : 0,//去重客户数
				name                : '',//搜索客户名
				loadingText         : '加载中...',
				tagIds              : [],//选择标签
				userId              : [],//选择的成员
				userCount           : 0,//选择的成员数量
				showChooseDepartment: false,//选择成员组件的显示与隐藏
				selectDepartment    : [],//已选择的成员
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad       : function () {
			uni.setNavigationBarTitle({
				title: '流失客户'
			});

			this.isReady = false
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			if (localStorage.getItem('uid')) {
				this.getInfoData()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.limit)
				})
			}

			// localStorage.setItem('user_id', 'liyunli')
			// this.isReady = true
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.getInfoData()
		},
		onReachBottom: function () {
			if (this.customList.length < this.count) {
				this.page += 1
				this.getData(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		methods      : {
			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				if (agent_id == '') {
					agent_id = localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id')
				} else {
					localStorage.setItem('agent_id', agent_id)
					sessionStorage.setItem('agent_id', agent_id)
				}
				localStorage.setItem('agent_id', agent_id)
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

					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						that.getCopyright(that.refresh)
					}

					localStorage.setItem('corpid', that.corpid)
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
			//重新渲染頁面
			refresh(){
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			getInfoData () {
				this.getData()
			},
			//客户列表
			async getData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				let tag_ids = localStorage.getItem('hasTagsId') ? localStorage.getItem('hasTagsId').split(',') : []
				this.tagIds = []
				if (tag_ids.length > 0) {
					for (let i = 0; i < tag_ids.length; i++) {
						this.tagIds[i] = Number(tag_ids[i])
					}
				}

				this.userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.userId.push(this.selectDepartment[i].id)
					}
				}

				const {data: res} = await this.axios.post("work-external-contact-follow-user/list", {
					suite_id: 1,
					corp_id : localStorage.getItem('corpid'),
					user_id : localStorage.getItem('user_id'),
					tag_ids : this.tagIds,
					user_ids: this.userId,
					name    : this.name,
					type    : this.tabBtnType,
					page    : page
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
					this.page = page
					this.count = res.data.count
					this.userCount = res.data.user_count
					this.show = res.data.show
					if (this.page == 1) {
						this.customList = res.data.info
					} else {
						this.customList = this.customList.concat(res.data.info)
					}
					if (this.customList.length < 15) {
						this.loadingText = '已加载全部'
					}
					uni.hideLoading();
				}
			},
			//搜索确认
			search (e) {
				this.name = e.value
				this.getData()
			},
			//选择标签
			chooseTags () {
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/chooseTags?agent_id=' + agent_id
				});
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
					this.getData()
				}
			},
			//时间筛选
			changeTabBtn (type) {
				this.tabBtnType = type
				this.getData()
			},
			//返回上一级
			back () {
				this.selectDepartment = []
				history.back()
			},
		},
	}
</script>

<style scoped>
	.box {
		background: #F2F3F5;
		text-align: left;
		font-size: 0.8rem /* 15/18.75 */;
		height: calc(100% - 50px);
		overflow: hidden;
	}

	/deep/ .uni-searchbar__box {
		height: 1.6rem /* 30/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
	}

	.tab_picker {
		border-bottom: 1px solid rgba(236, 238, 244, 1);
		overflow-x: auto;
	}

	/deep/ .dropdown-item__selected .selected__name {
		font-size: 0.693rem /* 13/18.75 */;
		font-weight: 500;
		color: rgba(42, 51, 73, 1);
	}

	/deep/ .dropdown-item__selected {
		padding: 0.8rem /* 15/18.75 */ 0.533rem /* 10/18.75 */;
	}

	/deep/ .dropdown-item__selected .selected__icon {
		margin-left: 0.267rem /* 5/18.75 */;
	}

	.tab-btn {
		height: 1.067rem /* 20/18.75 */;
		border-color: #E0E0E0 !important;
		color: #666 !important;
		font-size: 0.587rem /* 11/18.75 */;
		line-height: 1.067rem /* 20/18.75 */;
		display: inline-block;
		width: 4.267rem /* 80/18.75 */;
		padding: 0 0.427rem /* 8/18.75 */ !important;
	}

	.active-tab-btn {
		border-color: #5284EC !important;
		color: #5284EC !important;
	}

	.choose-tags {
		float: left;
		line-height: 2.453rem /* 46/18.75 */;
		text-align: center;
		padding: 0 0 0 0.533rem /* 10/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
		color: #2A3349;
		position: relative;
		width: 47%;
	}

	.choose-tags:last-child:after {
		display: none;
	}

	.choose-tags:after {
		content: ' ';
		position: absolute;
		width: 1px;
		top: 0.96rem /* 18/18.75 */;
		bottom: 0.96rem /* 18/18.75 */;
		right: 0;
		background: #C8C7CC;
	}

	.uni-list-cell {
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		flex-direction: row;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding: 0.267rem /* 5/18.75 */ 0;
		border-top: 1px solid hsla(0, 0%, 0%, 0.1);
		border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
	}

	.uni-list-cell-left {
		white-space: nowrap;
		font-size: 0.747rem /* 14/18.75 */;
		padding: 0 0.8rem /* 15/18.75 */ 0 0;
	}

	.uni-list-cell-db {
		flex: 1;
	}

	.content-list {
		margin-top: 9.493rem /* 178/18.75 */;
		overflow-y: auto;
		z-index: -1;
		background: #FFF;
	}

	.content-list-item {
		margin: 0 0 0.533rem /* 10/18.75 */;
	}

	.content-list-item-title {
		background: #F2F3F5;
		padding: 0.267rem /* 5/18.75 */ 0.533rem /* 10/18.75 */;
		color: #999;
		font-size: 0.587rem /* 11/18.75 */;
	}

	.content-list-item-text {
		overflow: hidden;
		padding: 0.267rem /* 5/18.75 */ 0.533rem /* 10/18.75 */;
		border-bottom: 1px solid #F2F3F5;
	}

	.content-list-item .content-list-item-text:last-child {
		border-bottom: 0;
	}

	.list-hd-content {
		padding: 0.267rem /* 5/18.75 */ 0.533rem /* 10/18.75 */;
		width: calc(100% - 3.253rem /* 61/18.75 */);
		float: left;
		box-sizing: border-box;
	}

	.list-hd-content-name {
		color: #333;
		font-weight: 700;
		font-size: 0.693rem /* 13/18.75 */;
		/*white-space: nowrap;*/
		/*text-overflow: ellipsis;*/
		/*overflow: hidden;*/
		/*word-break: break-all;*/
	}

	.list-hd-content-tag {
		background: #00A6F9;
		border-radius: 0.427rem /* 8/18.75 */;
		color: #FFF;
		height: 0.853rem /* 16/18.75 */;
		margin-right: 0.267rem /* 5/18.75 */;
		padding: 0 0.267rem /* 5/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
	}

	.more-choose-blue {
		background: #5284EC;
		color: #FFF;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	/deep/ .uni-input-placeholder, /deep/ .uni-searchbar__text-placeholder {
		font-size: 0.587rem /* 11/18.75 */;
	}

	/deep/ .uni-navbar__header /deep/ .uni-navbar__header-btns:last-child {
		display: none;
	}

	/deep/ .uni-searchbar {
		background-color: #5284EC;
	}

</style>