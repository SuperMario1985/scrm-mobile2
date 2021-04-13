<template>
	<view class="box" v-if="isReady">
		<view v-if="activeStatus == 2" class="content-msg">活动未开始，仅供预览</view>
		<view v-if="activeStatus == 0" class="content-msg">活动未发布，仅供预览</view>
		<view v-if="activeStatus == 3" class="content-msg">活动已结束，仅供预览</view>
		<view v-if="activeStatus == 4" class="content-msg">活动已删除，仅供预览</view>
		<view class="head">
			<view class="head-box">
				<img :src="avatar" alt="" class="head-box-img fl" v-if="avatar != '' && typeof avatar != 'undefined'">
				<img src="../../static/userface.png" alt="" class="head-box-img fl"
				     v-if="avatar == '' || typeof avatar == 'undefined'">
				<view class="head-box-txt fl">
					<view class="head-box-txt-title over">{{nick_name}}</view>
					<view class="head-box-txt-content over">您已
						<text v-if="choose_type == 1">连续</text>
						<text v-if="choose_type == 2">累计</text>
						签到<span style="color: #F42B0B;">{{days}}</span>天
					</view>
				</view>
				<view class="head-box-btn fl" @click="clockIn" v-if="activeStatus == 1 && send == 0">
					点击签到
				</view>
				<view class="head-box-btn2" v-if="activeStatus != 1 && send == 0">
					点击签到
				</view>
				<view class="head-box-btn2" v-if="send == 1">
					已签到
				</view>
			</view>
			<view class="head-box2">
				<li-calendar
						:insert="true"
						:showMonth="false"
						:start-date="start_time"
						:end-date="end_time"
						:selected="date"
				/>
			</view>
		</view>
		<!--		<view class="body">-->
		<!--			<view class="body-box">-->
		<!--				<view class="body-title">-->
		<!--					不想漏签？开启签到提醒-->
		<!--					<switch @change="switchChange" class="fr"/>-->
		<!--				</view>-->
		<!--				<view class="body-content">不想漏签？关注公众号【xxxxx】，开启签到提醒</view>-->
		<!--			</view>-->
		<!--		</view>-->
		<view class="list">
			<view class="list-tab">
				<view class="list-tab-li fl" :class="tabType == 1 ? 'list-tab-choose-li' : ''" @click="tabChange(1)">
					签到奖励
				</view>
				<view class="list-tab-li fl" :class="tabType == 2 ? 'list-tab-choose-li' : ''" @click="tabChange(2)">
					签到排行榜
				</view>
				<view class="list-tab-li fl" :class="tabType == 3 ? 'list-tab-choose-li' : ''" @click="tabChange(3)">
					活动说明
				</view>
			</view>
			<view class="list-content" v-if="tabType == 1">
				<view class="list-content-pinkbox" v-if="type == 2">- {{start_time}}至{{end_time}}
					<text v-if="choose_type == 1">连续</text>
					<text v-if="choose_type == 2">累计</text>
					签到奖励 -
				</view>
				<view class="list-content-pinkbox" v-if="type == 1">- 永久有效的
					<text v-if="choose_type == 1">连续</text>
					<text v-if="choose_type == 2">累计</text>
					签到奖励 -
				</view>
				<view class="list-content-box" v-for="item in task">
					<view class="list-content-box-left fl">
						<view style="font-size: 0.8rem  /* 15/18.75 */;color:#333;font-weight:bold;">
							<text v-if="choose_type == 1">连续</text>
							<text v-if="choose_type == 2">累计</text>
							签到
							<text style="margin-left: 10px;color: #FF6328;font-size: 0.693rem  /* 13/18.75 */;">
								{{item.days}}天
							</text>
						</view>
						<view style="color: #FF6328;font-size: 0.693rem  /* 13/18.75 */;margin-top: 0.533rem  /* 10/18.75 */;">
							<text style="margin-right: 10px;">赠送</text>
							<text v-if="item.type == 1">{{item.reward_name}}</text>
							<text v-if="item.type == 2">{{item.money_amount}}元红包</text>
						</view>
					</view>
					<view class="list-content-box-right border-linear fr" v-if="item.status == 0">
						还差{{item.last_days}}天
					</view>
					<view class="list-content-box-right border-linear3 fr" v-if="item.status == 1">待发放</view>
					<view class="list-content-box-right border-linear2 fr" v-if="item.status == 2">已发放</view>
				</view>
			</view>
			<view class="list-content2" v-if="tabType == 2" style="min-height: 6.347rem  /* 119/18.75 */;">
				<view class="ranking-one" v-if="my_info[0] && my_info[0].rank">
					<view class="ranking-left">
						<img src="../../static/group/clockIn/first.png" alt="" class="ranking-sort-img"
						     v-if="my_info[0].rank && my_info[0].rank == 1">
						<img src="../../static/group/clockIn/second.png" alt="" class="ranking-sort-img"
						     v-else-if="my_info[0].rank && my_info[0].rank == 2">
						<img src="../../static/group/clockIn/third.png" alt="" class="ranking-sort-img"
						     v-else-if="my_info[0].rank && my_info[0].rank == 3">
						<text class="ranking-sort" v-else-if="my_info[0].rank > 3">{{my_info[0].rank}}</text>
						<img :src="my_info[0].avatar" alt="" class="ranking-img"
						     v-if="my_info[0].avatar != '' && typeof my_info[0].avatar != 'undefined'">
						<img src="../../static/userface.png" alt="" class="ranking-img"
						     v-if="my_info[0].avatar == '' || typeof my_info[0].avatar == 'undefined'">
						<text class="ranking-title over">{{my_info[0].name}}</text>
					</view>
					<text class="ranking-right fr" v-if="my_info[0] && my_info[0].days">
						<text v-if="choose_type == 1">连续</text>
						<text v-if="choose_type == 2">累计</text>
						签到<span style="color: #FF422D;">{{my_info[0].days}}</span>天
					</text>
				</view>
				<view style="margin-top: 0.533rem  /* 10/18.75 */;padding: 0 0.8rem /* 15/18.75 */ 0 0.8rem /* 15/18.75 */;"
				      v-if="rankIngList.length > 0">
					<view class="ranking-other" v-for="item in rankIngList">
						<view class="ranking-left" v-if="item.rank">
							<img src="../../static/group/clockIn/first.png" alt="" class="ranking-sort-img"
							     v-if="item.rank && item.rank == 1">
							<img src="../../static/group/clockIn/second.png" alt="" class="ranking-sort-img"
							     v-else-if="item.rank && item.rank == 2">
							<img src="../../static/group/clockIn/third.png" alt="" class="ranking-sort-img"
							     v-else-if="item.rank && item.rank == 3">
							<text class="ranking-sort" v-else-if="item.rank && item.rank > 3">{{item.rank}}</text>
							<img :src="item.avatar" alt="" class="ranking-img"
							     v-if="item.avatar != '' && typeof item.avatar != 'undefined'">
							<img src="../../static/userface.png" alt="" class="ranking-img"
							     v-if="item.avatar == '' || typeof item.avatar == 'undefined'">
							<text class="ranking-title over">{{item.name}}</text>
						</view>
						<text class="ranking-right fr">
							<text v-if="choose_type == 1">连续</text>
							<text v-if="choose_type == 2">累计</text>
							签到<span style="color: #FF422D;">{{item.days}}</span>天
						</text>
					</view>
				</view>
				<view class="custom-tabs-loading" v-if="rankIngList.length > 0">{{loadingText}}</view>
				<img v-if="rankIngList.length == 0" src="../../static/group/clockIn/empty.png" alt=""
				     style="width: 5.333rem  /* 100/18.75 */;margin-top: 1.493rem  /* 28/18.75 */;">
			</view>
			<view class="list-content3" v-if="tabType == 3" v-html="rule">
			</view>
		</view>
		<Footer v-if="is_show_copyright == 1"></Footer>
		<drag-button
				:isDock="true"
				:existTabBar="true"
				@btnClick="toAddress" :content="addBtnImg" v-if="is_address == 1"/>
		<!--获奖弹窗-->
		<uni-popup ref="popup" type="center" :maskClick="false">
			<uni-icons type="close" size="36"
			           style="position: absolute;right: 50%;top: 24.267rem  /* 455/18.75 */;transform: translateX(50%);"
			           color="#bfbabd" @click="closePop"></uni-icons>
			<img src="../../static/group/clockIn/success.png" alt="" style="width: 90%;">
			<view style="text-shadow: 0rem  /* 0/18.75 */ 0.16rem  /* 3/18.75 */ 0.16rem  /* 3/18.75 */ rgba(199, 20, 40, 0.28);font-size: 1.28rem  /* 24/18.75 */;font-weight: 800;    position: absolute; top: 5.44rem  /* 102/18.75 */;width: 100%;color: #FFF;text-align: center;">
				<text v-if="sussessData.choose_type == 1">连续</text>
				<text v-if="sussessData.choose_type == 2">累计</text>
				打卡{{sussessData.days}}天任务
			</view>
			<view style="font-size: 0.693rem  /* 13/18.75 */; position: absolute; top: 8.533rem  /* 160/18.75 */;left: 50%;transform: translateX(-50%);color: #D75E02;width: 11.733rem  /* 220/18.75 */;">
				完成打卡时间：{{sussessData.date}}
			</view>
			<img src="../../static/group/clockIn/gift.png" alt=""
			     style="width: 5.813rem  /* 109/18.75 */; position: absolute; top: 9.867rem  /* 185/18.75 */;left: 50%;transform: translateX(-50%);"
			     v-if="sussessData.type == 1 && sussessData.reward_type == 2">
			<img :src="sussessData.qr_code" alt=""
			     style="width: 6.72rem  /* 126/18.75 */; position: absolute; top: 10.133rem  /* 190/18.75 */;left: 50%;transform: translateX(-50%);"
			     v-if="sussessData.type == 1 && sussessData.reward_type == 1 || sussessData.type == 2">
			<view style="font-size: 0.587rem  /* 11/18.75 */; position: absolute; top:14.827rem  /* 278/18.75 */;left: 50%;transform: translateX(-50%);color: #D75E02;width: 12.373rem  /* 232/18.75 */;"
			      v-if="sussessData.type == 1 && sussessData.reward_type == 2">
				<view>恭喜您完成打卡任务，获得【{{sussessData.reward_name}}】</view>
				<view style="width: 9.173rem  /* 172/18.75 */;padding: 0 1.6rem  /* 30/18.75 */;">请填写邮寄地址，我们将以最快的速度送达。
				</view>
			</view>
			<view class="success-btn" v-if="sussessData.type == 1 && sussessData.reward_type == 2" @click="toAddress">
				去填写
			</view>
			<view v-if="sussessData.type == 2" style="position: absolute;
		top: 18.827rem  /* 353/18.75 */;font-size: 0.587rem  /* 11/18.75 */;left: 50%;transform: translateX(-50%);color: #FFF;width: 70%;">
				<view>恭喜您完成打卡任务，获得【{{sussessData.money_amount}}】元红包</view>
				<view>红包奖励已发放到微信零钱里。若没有收到，请联系客服。</view>
			</view>
			<view v-if="sussessData.type == 1 && sussessData.reward_type == 1" style="position: absolute;
		top: 19.413rem /* 364/18.75 */;font-size: 0.587rem  /* 11/18.75 */;left: 50%;transform: translateX(-50%);color: #FFF;width: 70%;">
				<view>恭喜您完成打卡任务，获得【{{sussessData.reward_name}}】</view>
				<view>记得添加客服领取奖励哦~</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import liCalendar from '@/components/li-calendar/uni-calendar.vue'
	import Footer from "../../components/footer/footer.vue";

	export default {
		name         : "list",
		inject       : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden','getCopyright'],
		components   : {liCalendar,Footer},
		data () {
			return {
				url       : '',
				ticketData: {},
				agentData : {},

				commonUrl   : this.$store.state.commonUrl,
				isReady     : false,
				tabType     : 1,//tab类型
				avatar      : '',//头像
				nick_name   : '',//昵称
				days        : 0,//连续签到天数
				start_time  : null,//开始区间的时间
				end_time    : null,//结束区间的时间
				date        : [],//已打卡的日期
				task        : [],//签到奖励规则
				rule        : '',//活动说明
				choose_type : 1,//1连续打卡 2累计打卡
				type        : 2,////1永久有效，2固定区间
				rankIngList : [],//排行榜
				my_info     : {},//排行榜自己的数据
				rankIngCount: 0,//排行榜总数
				rankIngPage : 1,//排行榜页码
				loadingText : '加载中...',
				sussessData : {},//获奖弹窗参数
				isHide      : false,
				activeStatus: 1,//活动状态
				addBtnImg   : '../../static/group/address.png',//地址悬浮按钮
				is_address  : '',//是否展示地址按钮
				send        : 0,//今日是否签到，0未签到1已签到
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onReachBottom: function () {
			if (this.tabType == 2) {
				if (this.rankIngList.length < this.rankIngCount) {
					this.rankIngPage += 1
					this.getRankingList(this.rankIngPage)
				} else {
					this.loadingText = '已加载全部'
				}
			}
		},
		onShow () {
			if (this.isHide) {
				this.isHide = false
				this.getInfoData()
			}
		},
		onHide () {
			this.isHide = true
		},
		onLoad       : function () {

			this.isReady = false

			this.wx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') === -1

			this.wxWork = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') !== -1

			if (this.wx) {
				this.jsApiList = [
					'hideOptionMenu',
					'onMenuShareAppMessage',
					'onMenuShareTimeline',
					'getLocation'
				]
			}

			if (this.wxWork) {
				this.jsApiList = [
					'hideOptionMenu',
					'onMenuShareAppMessage',
					'onMenuShareWechat',
					'onMenuShareTimeline',
					'shareAppMessage',
					'shareWechatMessage',
					'shareToExternalContact',
					'getLocation'
				]
			}

			this.ws.setCallback(this.websocketOnMessage)

			this.$store.dispatch('setWx', () => {
				this.initPage(this.getInfoData)
			})

			// this.userid = 'JinHui'
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('externalId', 'wmiWVTDwAAe3XAzhrfRbJGAzciSvp8nQ')
			// // localStorage.setItem('externalId', 'wmiWVTDwAAhe2-JDk-s5aREvE8Jif7vA')
			// // localStorage.setItem('externalId', 'wmiWVTDwAA6wyvutXFeXap4H6pI5cibg')
			// localStorage.setItem('user_id', 'LiYunLi')
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('openid', '1231312')
			// this.getInfoData()
		},
		methods      : {
			//一进入页面请求该方法获取应用的权限
			async limit (is_forbid) {
				this.url = window.location.href
				let agent_id = this.getParameter('agentId') !== null ? this.getParameter('agentId') : (this.getParameter('agent_id') !== null ? this.getParameter('agent_id') : '')
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
						if (typeof res.errCode !== "undefined" && res.errCode == 2) {
							if (typeof res.err_Info !== "undefined" && res.err_Info == 'invalid corpid' && that.wxWork) {
								uni.showToast({
									title   : "请在微信中打开",
									image   : '/static/fail.png',
									duration: 2000
								});
								return false
							}
						} else if (typeof res.errMsg !== "undefined" && res.errMsg.indexOf("invalid corpid") != -1) {
							uni.showToast({
								title   : "请在微信中打开",
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						}
						uni.showToast({
							title   : "初始化失败，请刷新重试",
							image   : '/static/fail.png',
							duration: 2000
						});
					})

					that.$store.state.wx.ready(function () {
						if (is_forbid == 1 || that.wx) {
							that.$store.state.wx.hideOptionMenu();
						} else {
							let shareData = {
								title   : that.shareData.title, // 分享标题
								desc    : that.shareData.desc.length > 0 ? that.shareData.desc : that.shareData.shareUrl, // 分享描述
								link    : that.shareData.shareUrl, // 分享地址
								imgUrl  : that.shareData.pic_url, // 分享显示的缩略图地址
								success : function () {
									uni.showToast({
										title   : "分享成功",
										icon    : 'success',
										duration: 2000
									});
								},
								fail    : function () {
									uni.showToast({
										title   : "分享失败",
										image   : '/static/fail.png',
										duration: 2000
									});
								},
								complete: function () {
									// alert('调用结束')
								}
							}

							that.$store.state.wx.onMenuShareAppMessage(shareData)

							if (this.wxWork) {
								that.$store.state.wx.onMenuShareWechat(shareData)

								that.$store.state.wx.invoke(
									"shareAppMessage",
									{
										title : shareData.title,
										desc  : shareData.desc, // 分享描述
										link  : shareData.link, // 分享地址
										imgUrl: shareData.imgUrl, // 分享显示的缩略图地址
									},
									function (res) {
										if (res.err_msg == "shareAppMessage:ok") {
											uni.showToast({
												title   : "分享成功",
												icon    : 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : "分享失败",
												image   : '/static/fail.png',
												duration: 2000
											});
										}
									}
								)
								that.$store.state.wx.invoke(
									"shareWechatMessage",
									{
										title : shareData.title,
										desc  : shareData.desc, // 分享描述
										link  : shareData.link, // 分享地址
										imgUrl: shareData.imgUrl, // 分享显示的缩略图地址
									},
									function (res) {
										if (res.err_msg == "shareWechatMessage:ok") {
											uni.showToast({
												title   : "分享成功",
												icon    : 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : "分享失败",
												image   : '/static/fail.png',
												duration: 2000
											});
										}
									}
								)
								that.$store.state.wx.invoke(
									"shareToExternalContact",
									{
										title : shareData.title,
										desc  : shareData.desc, // 分享描述
										link  : shareData.link, // 分享地址
										imgUrl: shareData.imgUrl, // 分享显示的缩略图地址
									},
									function (res) {
										if (res.err_msg == "shareToExternalContact:ok") {
											uni.showToast({
												title   : "分享成功",
												icon    : 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : "分享失败",
												image   : '/static/fail.png',
												duration: 2000
											});
										}
									}
								)
							}

							that.$store.state.wx.onMenuShareTimeline(that.$delete(shareData, 'desc'))
						}
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
			async getData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-clock-activity/wap-detail", {
					corp_id        : this.getParameter('corpid'),
					userid         : localStorage.getItem('user_id'),
					external_userid: localStorage.getItem('external_id') || localStorage.getItem('externalId'),
					assist         : this.getParameter('assist') ? this.getParameter('assist') : '',
					openid         : localStorage.getItem('openid'),
				});
				if (res.error != 0) {
					this.limit(1)
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.limit()
					this.avatar = res.data.avatar
					this.nick_name = res.data.nick_name
					this.choose_type = res.data.choose_type
					this.type = res.data.type
					this.days = res.data.days
					this.start_time = res.data.start_time
					this.end_time = res.data.end_time
					this.date = res.data.date
					this.task = res.data.task
					this.rule = res.data.rule.replace(/\n/g, '<br>')
					this.activeStatus = res.data.status
					this.is_address = res.data.is_address
					this.send = res.data.send
					uni.setNavigationBarTitle({
						title: res.data.title
					});
					this.isReady = true
					uni.hideLoading();
				}
			},
			switchChange (e) {
				console.log(e.target.value, 'e')
			},
			tabChange (type) {
				this.tabType = type
				if (type == 2) {
					uni.showLoading({
						title   : '加载中...',
						duration: 2000
					});
					this.getRankingList()
				}
			},
			async getRankingList (page = 1) {
				const {data: res} = await this.axios.post("wap-clock-activity/ranking", {
					assist         : this.getParameter('assist') ? this.getParameter('assist') : '',
					external_userid: localStorage.getItem('external_id') || localStorage.getItem('externalId'),
					openid         : localStorage.getItem('openid'),
					page           : page,
					page_size      : 15
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.rankIngCount = res.data.count
					this.my_info = res.data.my_info
					this.rankIngPage = page
					if (page == 1) {
						this.rankIngList = res.data.info
					} else {
						this.rankIngList = this.rankIngList.concat(res.data.info)
					}
					if (this.rankIngList.length >= this.rankIngCount) {
						this.loadingText = '已加载全部'
					}
					uni.hideLoading();
				}
			},
			//点击签到
			async clockIn () {
				// this.sussessData = {
				// 	days       : 90,
				// 	choose_type: 1,
				// 	date       : '2020 - 11 - 20',
				// 	type       : 1,
				// 	reward_type: 1,
				// 	qr_code    : 'https://wework.qpic.cn/wwpic/918615_-fMIjoTyQSG24yS_1585552894/0',
				// 	reward_name:'发哈不菲的房间爱是不'
				// }
				// this.$refs.popup.open()
				// return false
				const {data: res} = await this.axios.post("wap-clock-activity/punch-card", {
					assist         : this.getParameter('assist') ? this.getParameter('assist') : '',
					external_userid: localStorage.getItem('external_id') || localStorage.getItem('externalId'),
					openid         : localStorage.getItem('openid'),
					corp_id        : this.getParameter('corpid'),
					userid         : localStorage.getItem('user_id')
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.isSuccess()
				}
			},
			//判断是否签到成功
			async isSuccess () {
				const {data: res} = await this.axios.post("wap-clock-activity/success", {
					corp_id        : this.getParameter('corpid'),
					userid         : localStorage.getItem('user_id'),
					assist         : this.getParameter('assist') ? this.getParameter('assist') : '',
					external_userid: localStorage.getItem('external_id') || localStorage.getItem('externalId'),
					openid         : localStorage.getItem('openid'),
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.sussessData = res.data
					if (res.data.success == 1) {
						this.$refs.popup.open()
					} else {
						uni.showToast({
							title   : '打卡成功',
							duration: 2000
						});
						setTimeout(() => {
							this.getInfoData()
							if (this.tabType == 2) {
								uni.showLoading({
									title   : '加载中...',
									duration: 2000
								});
								this.getRankingList()
							}
						}, 2000);
					}
				}
			},
			//关闭获奖束弹窗
			closePop () {
				this.$refs.popup.close()
				this.tabType = 1
				this.getInfoData()
			},
			//去填写
			toAddress () {
				uni.navigateTo({
					url: "/pages/group/address?assist=" + this.getParameter('assist')
				});
				this.$refs.popup.close()
			}
		},
	}
</script>

<style scoped>
	.box {
		background: #EDEDED;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		overflow: auto;
		min-height: 100%;
	}

	.head {
		height: 23.467rem /* 440/18.75 */;
		background: url("../../static/group/clockIn/bg.png");
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.head-box {
		width: 18.72rem /* 351/18.75 */;
		height: 4.267rem /* 80/18.75 */;
		background: #FFFFFF;
		border-radius: 0.533rem /* 10/18.75 */;
		position: absolute;
		top: 6.88rem /* 129/18.75 */;
		left: 50%;
		transform: translateX(-50%);
	}

	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.over {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.head-box-img {
		width: 2.667rem /* 50/18.75 */;
		height: 2.667rem /* 50/18.75 */;
		border-radius: 50%;
		margin: 0.8rem /* 15/18.75 */ 0.373rem /* 7/18.75 */ 0.8rem /* 15/18.75 */ 1.333rem /* 25/18.75 */;
	}

	.head-box-txt {
		width: calc(100% - 10.56rem /* 198/18.75 */);
		text-align: left;
	}

	.head-box-txt-title {
		font-size: 0.907rem /* 17/18.75 */;
		color: #333;
		font-weight: bold;
		margin: 1.067rem /* 20/18.75 */ 0 0.373rem /* 7/18.75 */;
	}

	.head-box-txt-content {
		font-size: 0.693rem /* 13/18.75 */;
		color: #969696;
	}

	.head-box-btn {
		width: 6.187rem /* 116/18.75 */;
		background: url("../../static/group/clockIn/head-box-btn.png");
		background-size: 100%;
		background-repeat: no-repeat;
		margin-top: 0.373rem /* 7/18.75 */;
		height: 3.893rem /* 73/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		font-weight: bold;
		color: #FAFFFF;
		line-height: 3.467rem /* 65/18.75 */;
	}

	.head-box-btn2 {
		width: 4.533rem /* 85/18.75 */;
		height: 2.133rem /* 40/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		line-height: 2.133rem /* 40/18.75 */;
		background: #E2E0E3;
		color: #999999;
		font-weight: bold;
		border-radius: 1.067rem /* 20/18.75 */;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 1.067rem /* 20/18.75 */;
	}

	.head-box2 {
		width: 18.72rem /* 351/18.75 */;
		height: 13.493rem /* 253/18.75 */;
		background: #FFFFFF;
		box-shadow: 0rem /* 0/18.75 */ 0.107rem /* 2/18.75 */ 0.587rem /* 11/18.75 */ 0.107rem /* 2/18.75 */ rgba(255, 99, 40, 0.13);
		border-radius: 0.533rem /* 10/18.75 */;
		position: absolute;
		top: 11.627rem /* 218/18.75 */;
		left: 50%;
		transform: translateX(-50%);
		overflow: hidden;
	}

	.body {
		overflow: hidden;
	}

	.body-box {
		height: 7.467rem /* 140/18.75 */;
		background: url("../../static/group/clockIn/body-box.png");
		background-size: 100%;
		background-repeat: no-repeat;
		margin: 1.28rem /* 24/18.75 */ -0.32rem /* -6/18.75 */ 0;
	}

	.body-title {
		font-size: 0.96rem /* 18/18.75 */;
		font-weight: bold;
		color: #333333;
		padding: 1.813rem /* 34/18.75 */ 1.28rem /* 24/18.75 */ 0.427rem /* 8/18.75 */;
		box-sizing: border-box;
		text-align: left;
	}

	.body-content {
		font-size: 0.64rem /* 12/18.75 */;
		color: #666666;
		text-align: left;
		padding: 0 1.28rem /* 24/18.75 */;
		box-sizing: border-box;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 100%;
	}

	.list {
		margin-top: 2.4rem /* 45/18.75 */;
		width: 18.72rem /* 351/18.75 */;
		background: #FFF;
		margin-left: 50%;
		transform: translateX(-50%);
		margin-bottom: 0.533rem /* 10/18.75 */;
	}

	.list-tab {
		overflow: hidden;
	}

	.list-tab-li {
		width: 33.33%;
		height: 2.827rem /* 53/18.75 */;
		background: #F5F5F5;
		border-radius: 0.213rem /* 4/18.75 */ 0.213rem /* 4/18.75 */ 0rem /* 0/18.75 */ 0rem /* 0/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		color: #333;
		font-weight: bold;
		line-height: 2.827rem /* 53/18.75 */;
	}

	.list-tab-choose-li {
		background: #FFF;
	}

	.list-content {
		padding: 0.587rem /* 11/18.75 */ 0.693rem /* 13/18.75 */;
		box-sizing: border-box;
		min-height: 6.347rem /* 119/18.75 */;
	}

	.list-content-pinkbox {
		background: #FFF7F6;
		/*border-radius: 0.107rem !* 2/18.75 *!;*/
		padding: 0.373rem /* 7/18.75 */;
		box-sizing: border-box;
		font-size: 0.693rem /* 13/18.75 */;
		color: #45586D;
	}

	.list-content-box {
		border-bottom: 0.053rem /* 1/18.75 */ solid #F0F0F0;
		padding: 0.96rem /* 18/18.75 */ 0;
		text-align: left;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	.list-content-box-left {
		width: calc(100% - 4.107rem /* 77/18.75 */);
	}

	.list-content-box-right {
		line-height: 1.6rem /* 30/18.75 */;
		color: #FF4D27;
		font-size: 0.64rem /* 12/18.75 */;
		width: 4rem /* 75/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid transparent;
		text-align: center;
		border-radius: 0.8rem /* 15/18.75 */;
		background-clip: padding-box, border-box;
		background-origin: padding-box, border-box;
		box-sizing: border-box;
	}

	.border-linear {
		background-image: linear-gradient(45deg, #FFF, #FFF), linear-gradient(45deg, #FF8303, #FF3636);
	}

	.border-linear2 {
		background-image: linear-gradient(45deg, #FFF, #FFF), linear-gradient(45deg, #CFCFCF, #CFCFCF);
		color: #CFCFCF;
	}

	.border-linear3 {
		background-image: linear-gradient(45deg, #FFF, #FFF), linear-gradient(45deg, #0DCCFF, #4760FF);
		color: #24A1FF;
	}

	.ranking-one {
		background: #FFFFFF;
		box-shadow: 0rem /* 0/18.75 */ 0.427rem /* 8/18.75 */ 0.427rem /* 8/18.75 */ 0rem /* 0/18.75 */ rgba(255, 170, 138, 0.07);
		text-align: left;
		height: 4.32rem /* 81/18.75 */;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		justify-content: space-between;
		padding: 0 0.8rem /* 15/18.75 */ 0 0.8rem /* 15/18.75 */;
	}

	.ranking-sort {
		color: #B5B5B5;
		font-size: 1.013rem /* 19/18.75 */;
		font-weight: bold;
		width: 1.12rem /* 21/18.75 */;
		text-align: center;
	}

	.ranking-img {
		width: 2.293rem /* 43/18.75 */;
		/*height: 2.293rem !* 43/18.75 *!;*/
		border-radius: 50%;
		margin: 0 0.747rem /* 14/18.75 */ 0 1.067rem /* 20/18.75 */;
	}

	.ranking-title {
		font-size: 0.747rem /* 14/18.75 */;
		color: #333;
	}

	.ranking-left {
		display: flex;
		align-items: center;
		width: calc(100% - 4.693rem /* 88/18.75 */);
	}

	.ranking-right {
		font-size: 0.747rem /* 14/18.75 */;
		font-weight: bold;
		color: #333;
	}

	.ranking-other {
		background: #FFFFFF;
		text-align: left;
		height: 4.32rem /* 81/18.75 */;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		justify-content: space-between;
		border-bottom: 0.053rem /* 1/18.75 */ solid #F0F0F0;
	}

	.ranking-sort-img {
		width: 1.12rem /* 21/18.75 */;
	}

	.list-content3 {
		padding: 0.907rem /* 17/18.75 */ 0.8rem /* 15/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		color: #999;
		text-align: left;
		min-height: 4.533rem /* 85/18.75 */;
		line-height: 1.067rem /* 20/18.75 */;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	.success-btn {
		width: 9.067rem /* 170/18.75 */;
		height: 2.667rem /* 50/18.75 */;
		background: url("../../static/group/clockIn/success-btn.png");
		background-size: 100%;
		background-repeat: no-repeat;
		position: absolute;
		top: 19.413rem /* 364/18.75 */;
		left: 50%;
		transform: translateX(-50%);
		color: #D31112;
		font-size: 0.96rem /* 18/18.75 */;
		line-height: 2.667rem /* 50/18.75 */;
	}

	.content-msg {
		/*border: 0.053rem !* 1/18.75 *! solid #FFDDA6;*/
		background: #FFF2DB;
		padding: 0.533rem /* 10/18.75 */;
		height: 1.2rem;
		font-size: 0.8rem;
		z-index: 999;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
	}

</style>