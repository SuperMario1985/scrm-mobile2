<template>
	<view class="box">
		<view v-show="!sendVisible">
			<view class="list" v-if="isReady">
				<view style="font-size: 0.747rem  /* 14/18.75 */;text-align: left;padding: 0.533rem  /* 10/18.75 */ 1.067rem  /* 20/18.75 */ 0"
				      v-if="isSend != 0 && !chatId">
					今日，该客户还可继续领取红包
					<text style="color: red;">{{externalHnum}}</text>
					次/
					<text
							style="color: red;">{{externalHmoney}}
					</text>
					元；您最多向该客户发放红包
					<text
							style="color: red;">{{userHnum}}
					</text>
					次/
					<text
							style="color: red;">{{userHmoney}}
					</text>
					元
				</view>
				<view style="font-size: 0.747rem  /* 14/18.75 */;text-align: left;padding: 0.533rem  /* 10/18.75 */ 1.067rem  /* 20/18.75 */ 0"
				      v-if="is_owner === 0">
					<text style="color: red;">只有群主才能发送群红包</text>
				</view>
				<view style="font-size: 0.747rem  /* 14/18.75 */;text-align: left;padding: 0.533rem  /* 10/18.75 */ 1.067rem  /* 20/18.75 */ 0;color: red;"
				      v-if="isSend == 0">
					{{sendMsg}}
				</view>
				<view class="list-title-p">
					<view class="list-title">
						红包记录
						<text v-if="count > 0">（{{count}}条）</text>
					</view>
					<button :style="isSend == 1 && is_owner !== 0 ? {backgroundColor: '#F25442'} : ''" type="primary"
					        class="send-btn" @click="openSend"
					        :disabled="isSend == 0 || is_owner === 0 ? true:false">
						发送红包
					</button>
				</view>
				<view>
					<view class="list-content" v-for="item in list" v-if="list.length > 0"
					      @click="detail(item.id, item.type)">
						<view class="list-content-col">
							<text class="list-content-title">领取时间</text>
							<text class="list-content-text" v-if="item.send_time != ''">{{item.send_time}}</text>
							<text class="list-content-text" v-else>暂无</text>
						</view>
						<view class="list-content-col">
							<text class="list-content-title">红包类型</text>
							<text class="list-content-text">
								{{item.type_name}}
							</text>
						</view>
						<view class="list-content-col" v-if="item.act_name">
							<text class="list-content-title">活动名称</text>
							<text class="list-content-text">
								{{item.act_name}}
							</text>
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
						<view v-if="!chatId" class="list-content-col">
							<text class="list-content-title">给客户留言</text>
							<text class="list-content-text" v-if="item.message != ''">{{item.message}}</text>
							<text class="list-content-text" v-else>暂无</text>
						</view>
						<view v-if="chatId" class="list-content-col">
							<text class="list-content-title">祝福语</text>
							<text class="list-content-text" v-if="item.message != ''">{{item.message}}</text>
							<text class="list-content-text" v-else>恭喜发财，大吉大利</text>
						</view>
						<view class="list-content-col">
							<text class="list-content-title">员工备注</text>
							<text class="list-content-text" v-if="item.remark != ''">{{item.remark}}</text>
							<text class="list-content-text" v-else>暂无</text>
						</view>
						<view class="list-content-col" v-if="!chatId">
							<text class="list-content-title">商户订单号</text>
							<text class="list-content-text" v-if="item.order_id != ''">{{item.order_id}}</text>
							<text class="list-content-text" v-else>暂无</text>
						</view>
						<view class="list-content-col" v-if="!chatId">
							<text class="list-content-title">微信付款单号</text>
							<text class="list-content-text" v-if="item.transaction_id != ''">{{item.transaction_id}}
							</text>
							<text class="list-content-text" v-else>暂无</text>
						</view>
					</view>
					<img src="../../static/redPacket/empty.png" alt="" v-if="list.length == 0" class="list-empty">
				</view>
				<view class="custom-tabs-loading" v-if="list.length > 0">{{loadingText}}</view>

				<Footer v-show="is_show_copyright == 1" v-if="list.length == 0"
				        style="position: absolute;bottom: 0;left: 0;right: 0;z-index: 9999999;"></Footer>
				<Footer v-show="is_show_copyright == 1" v-else></Footer>
			</view>
		</view>

		<!--发送红包页面组件-->
		<view v-if="sendVisible" class="send-pop">
			<uni-nav-bar left-icon="back" title="员工发红包" :shadow="false" background-color="#FFFFFF"
			             @clickLeft="back"></uni-nav-bar>
			<view style="padding: 0.64rem 0.8rem 2.453rem 0.8rem;background: #F1F1F1;">
				<view class="send-taggle" v-if="redType == 2 && chatId">
					当前为拼手气红包，
					<text style="color: #C49545;" @click="changeRedType(1)">改为普通红包</text>
				</view>
				<view class="send-taggle" v-if="redType == 1 && chatId">
					当前为普通红包，
					<text style="color: #C49545;" @click="changeRedType(2)">改为拼手气红包</text>
				</view>
				<view class="send-scroll" style="margin-top: 0.693rem  /* 13/18.75 */;">
					<view class="send-total">
						<view v-if="redType == 2" style="width: 4.8rem  /* 90/18.75 */;display: inline-block;">
							<text class="send-total-icon">拼</text>
							总金额
						</view>
						<view v-if="redType == 1" style="width: 4.8rem  /* 90/18.75 */;display: inline-block;">
							单个红包
						</view>
						<view style="float: right; text-align: right; width: calc(100% - 4.8rem);">
							<input type="digit" placeholder="0.00"
							       style="width: calc(100% - 4.8rem - 1em); display: inline-block;vertical-align: middle;text-align: right;margin-right: 0.48rem  /* 9/18.75 */;"
							       v-model="moneyData" @input="inputChange" @blur="inputBlur" @focus="inputFocus"/>元
						</view>
					</view>
					<!--					<view class="send-scroll-title" v-if="moneyList.length > 0">-->
					<!--						选择系统红包-->
					<!--					</view>-->
					<view class="preview-box" v-if="moneyList.length > 0" :style="height">
						<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						        :duration="duration">
							<swiper-item v-for="item in moneyList">
								<view class="swiper-item">
									<view class="checkbox" v-for="money in item" @click="chooseMoney(money)"
									      :class="{ active:moneyData == money.money}">
										￥{{money.money}}
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="send-total" v-if="chatId" style="margin-top: 0.693rem  /* 13/18.75 */;">
					红包个数
					<view style="float: right;">
						<input type="text" placeholder="填写个数" @input="changeSendNum"
						       style="display: inline-block;vertical-align: middle;text-align: right;margin-right: 0.48rem  /* 9/18.75 */;"
						       v-model="sendNum"/>个
					</view>
				</view>
				<view class="send-group-num" v-if="chatId">
					本群共{{chatInfoNum}}人
				</view>
				<view class="send-total" style="margin-top: 0.693rem  /* 13/18.75 */;">
					祝福语
					<view style="float: right;">
						<input placeholder="恭喜发财，大吉大利"
						       style="display: inline-block;vertical-align: middle;text-align: right;"
						       v-model="message"/>
					</view>
				</view>
				<view class="send-total" style="margin-top: 0.693rem  /* 13/18.75 */;">
					<text style="color: #F25442;">*</text>
					员工备注
					<view style="float: right;">
						<input placeholder="请输入备注，30字以内" maxlength="30"
						       style="display: inline-block;vertical-align: middle;text-align: right;"
						       v-model="remark"/>
					</view>
				</view>
				<view class="send-money" v-if="!chatId">
					<text style="font-size: 0.8rem  /* 15/18.75 */;">￥</text>
					<text v-if="moneyData != ''">{{moneyData}}</text>
					<text v-if="moneyData == ''">0.00</text>
				</view>
				<view class="send-money" v-if="chatId">
					<text style="font-size: 0.8rem  /* 15/18.75 */;">￥</text>
					<template v-if="redType == 2">
						<text v-if="moneyData != ''">{{moneyData}}</text>
						<text v-if="moneyData == ''">0.00</text>
					</template>
					<template v-if="redType == 1">
						<text v-if="sendNum == '' || moneyData == ''">0.00</text>
						<text v-if="sendNum != '' && moneyData != ''">{{sendNum * moneyData * 100 / 100}}</text>
					</template>
				</view>
				<view class="send-money-btn" @click="send">
					立即发放
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name             : "list",
		inject           : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden', 'getContext'],
		components       : {Footer},
		data () {
			return {
				is_owner          : 1,
				chatId            : '',
				url               : '',
				ticketData        : {},
				agentData         : {},
				list              : [],
				commonUrl         : this.$store.state.commonUrl,
				isReady           : false,
				//轮播
				indicatorDots     : true,
				autoplay          : false,
				interval          : 2000,
				duration          : 500,
				count             : 0,//红包记录总数
				page              : 1,//红包记录页码
				isSend            : 1,//是否可发送红包，1可以，0不行
				sendMsg           : '',//发送状态描述
				userHmoney        : '',//员工可发送金额
				userHnum          : '',//员工可发送次数
				externalHmoney    : '',//客户可接受金额
				externalHnum      : '',//客户可接受次数
				sendVisible       : false,//发红包页面的显示与隐藏
				redType           : 1,//红包类型，1普通，2拼手气
				moneyList         : [],//发送红包弹窗内的金额挡位
				loadingText       : '加载中...',
				moneyData         : '',//红包金额
				remark            : '',//红包备注
				message           : '',//红包留言
				sendNum           : '',//红包个数
				chatInfoNum       : 0,
				height            : {
					height: ''
				},//loading组件的高度
				textareaFocusFlag : false,//是否聚焦的是客户留言
				textareaFocusFlag2: false,//是否聚焦的是员工备注
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad           : function () {
			uni.setNavigationBarTitle({
				title: '红包记录'
			});

			this.isReady = false
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.limit)
			})


			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('externalId', 'wmiWVTDwAAF9Q74m4EJwZ7TTfxbQh9JA')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('is_show_copyright', 1)
			// this.getInfoData()
		},
		onPullDownRefresh: function () {
			this.page = 1
			this.getData();
		},
		onReachBottom    : function () {
			if (this.list.length < this.count) {
				this.page += 1
				this.getData(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		methods          : {
			textareaFocus () {
				this.textareaFocusFlag = true
			},
			textareaBlur () {
				this.textareaFocusFlag = false
			},
			textareaFocus2 () {
				this.textareaFocusFlag2 = true
			},
			textareaBlur2 () {
				this.textareaFocusFlag2 = false
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
							title   : res.errMsg,
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
			getInfoData () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.getData()
			},
			async getData (page = 1) {
				// wriWVTDwAArYax2RdwsusdD3IQ13ejdA 汪博文的群id
				this.chatId = localStorage.getItem('chatId') || ""
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-send-money/custom-money-order", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : localStorage.getItem('user_id'),
					external_userid: localStorage.getItem('externalId') || localStorage.getItem('external_id'),
					chat_id        : this.chatId,
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
					this.isReady = true
					uni.hideLoading()
					this.count = res.data.count
					this.page = page
					if (this.page == 1) {
						this.is_owner = res.data.is_owner
						this.list = res.data.moneyList
						this.isSend = res.data.can_send
						this.sendMsg = res.data.send_msg
						this.userHmoney = res.data.user_hmoney
						this.userHnum = res.data.user_hnum
						this.externalHmoney = res.data.external_hmoney
						this.externalHnum = res.data.external_hnum
						// localStorage.setItem('token', res.data.access_token)
					} else {
						this.list = this.list.concat(res.data.moneyList)
					}

					if (this.list.length < 15) {
						this.loadingText = '已加载全部'
					}
					uni.stopPullDownRefresh();
				}
			},
			async getSendData () {
				// wriWVTDwAArYax2RdwsusdD3IQ13ejdA 汪博文的群id
				// this.chatId = localStorage.getItem('chatId') || ""
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-send-money/send-money-info", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : localStorage.getItem('user_id'),
					external_userid: localStorage.getItem('externalId') || localStorage.getItem('external_id'),
					chat_id        : this.chatId,
				});
				if (res.error != 0) {
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					let arr = []
					this.moneyList = []
					this.chatInfoNum = res.data.chatInfoNum
					for (var i = 0; i < res.data.moneyList.length; i++) {
						arr.push(res.data.moneyList[i]);
						if (i % 6 == 5 || i == res.data.moneyList.length - 1) {
							this.moneyList.push(arr);
							arr = [];
						}
					}

					if (this.moneyList.length > 1) {
						this.indicatorDots = true
					} else {
						this.indicatorDots = false
					}
					if (this.moneyList.length > 0) {
						if (0 < this.moneyList[0].length && this.moneyList[0].length <= 2) {
							this.height.height = '3.2rem  /* 60/18.75 */'
						} else if (2 < this.moneyList[0].length && this.moneyList[0].length <= 4) {
							this.height.height = '5.333rem  /* 100/18.75 */'
						} else if (4 < this.moneyList[0].length && this.moneyList[0].length <= 6) {
							this.height.height = '8rem  /* 150/18.75 */'
						}
					}
					this.isSend = res.data.can_send
					this.sendMsg = res.data.send_msg
					this.userHmoney = res.data.user_hmoney
					this.userHnum = res.data.user_hnum
					this.externalHmoney = res.data.external_hmoney
					this.externalHnum = res.data.external_hnum
					uni.hideLoading()
					this.sendVisible = true


					uni.onWindowResize(() => {
						let info = uni.getSystemInfoSync()
						let H1 = info.windowHeight / 18.75
						let H2 = 0
						let H3 = 1.28

						if (this.textareaFocusFlag) {
							H2 = this.$refs.messageTextarea.$el.offsetTop / 18.75

						}
						if (this.textareaFocusFlag2) {
							H2 = this.$refs.remarkTextarea.$el.offsetTop / 18.75
						}

						if (H2 + H3 + 0.5 > H1) {
							this.$refs.uniTip.$el.style['margin-bottom'] = '1rem';
						}
					})
				}
			},
			//打开关闭发送红包弹窗
			openSend () {
				this.getSendData()
			},
			detail (id, type) {
				if (this.chatId) {
					uni.navigateTo({
						url: '/pages/redPacket/detail?id=' + id + '&type=' + type + '&agent_id=' + this.getParameter('agent_id')
					});
				}
			},
			//选择系统红包
			chooseMoney (money) {
				this.moneyData = money.money
			},
			//确定发送
			send () {
				if (this.chatId) {
					this.sendGroup()
				} else {
					this.sendUser()
				}
			},
			async sendGroup () {
				if (this.moneyData == '') {
					uni.hideLoading()
					uni.showToast({
						title   : '请填写金额',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.moneyData < 0.3) {
					uni.hideLoading()
					uni.showToast({
						title   : '付款金额不能小于0.30元',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.moneyData > 20000.00) {
					uni.hideLoading()
					uni.showToast({
						title   : '付款金额不能大于20000.00元',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (!this.sendNum) {
					uni.hideLoading()
					uni.showToast({
						title   : '请填写红包数量',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.redType == 2) {
					if (this.moneyData / this.sendNum < 0.3) {
						uni.hideLoading()
						uni.showToast({
							title   : '单个红包不能低于0.3元',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false;
					}
				}
				if (this.remark == '') {
					uni.hideLoading()
					uni.showToast({
						title   : '请填写备注',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				const {data: res} = await this.axios.post("wap-send-money/send-chat-manual-money", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : localStorage.getItem('user_id'),
					external_userid: localStorage.getItem('externalId') || localStorage.getItem('external_id'),
					chat_id        : this.chatId,
					type           : this.redType,
					money          : this.redType == 2 ? this.moneyData : this.moneyData * this.sendNum,
					num            : this.sendNum,
					remark         : this.remark,
					message        : this.message,
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
					uni.hideLoading()
					let msg = ''
					msg = {"msgtype": "news", "news": res.data.news}
					this.sendVisible = false
					let assist = res.data.assist
					that.$store.state.wx.invoke('sendChatMessage', msg, function (res) {
						if (res.err_msg == 'sendChatMessage:ok') {
							that.sendVisible = false
							that.moneyData = ''
							that.remark = ''
							that.message = ''
							that.getData()
						} else {
							that.cancelSend(assist)
						}
					})
				}
			},
			async cancelSend (assist) {
				const {data: res} = await this.axios.post("wap-send-money/send-money-cancel", {
					assist: assist
				});
				if (res.error != 0) {
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				}
			},
			async sendUser () {
				if (this.moneyData == '') {
					uni.hideLoading()
					uni.showToast({
						title   : '请填写金额',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.remark == '') {
					uni.hideLoading()
					uni.showToast({
						title   : '请填写备注',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.moneyData < 0.3) {
					uni.hideLoading()
					uni.showToast({
						title   : '付款金额不能小于0.30元',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.moneyData > 20000.00) {
					uni.hideLoading()
					uni.showToast({
						title   : '付款金额不能大于20000.00元',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				uni.showLoading({
					title   : '发送中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-send-money/send-manual-money", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : localStorage.getItem('user_id'),
					external_userid: localStorage.getItem('externalId') || localStorage.getItem('external_id'),
					money          : this.moneyData,
					remark         : this.remark,
					message        : this.message,
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
					uni.hideLoading()
					let msg = ''
					msg = {"msgtype": "news", "news": res.data.news}
					this.sendVisible = false
					let assist = res.data.assist
					that.$store.state.wx.invoke('sendChatMessage', msg, function (res) {
						if (res.err_msg == 'sendChatMessage:ok') {
							that.sendVisible = false
							that.moneyData = ''
							that.remark = ''
							that.message = ''
							that.getData()
						} else {
							that.cancelSend(assist)
						}
					})
				}
			},
			changeSendNum (e) {
				this.$nextTick(() => {
					if (parseInt(this.sendNum)) {
						this.sendNum = parseInt(this.sendNum)
					} else {
						this.sendNum = this.sendNum.toString().substring(0, this.sendNum.toString().length - 1)
					}
					this.$forceUpdate()
				})
			},
			//输入框更换规则
			inputChange (e) {
				this.$nextTick(() => {
					this.moneyData = e.target.value.replace(/^(\d+)(\.)?([\d]{0,2})(.*)$/g, '$1$2$3')
					this.moneyData = this.moneyData.replace(/^0([^\.]*)$/g, '0')
					this.$forceUpdate()
				})
			},
			inputBlur () {
				if (this.moneyData.length > 0) {
					let redMoney = this.moneyData.split('.')
					let intStr = redMoney[0]
					let floatStr = (typeof redMoney[1] != "undefined" && redMoney[1] != '') ? redMoney[1] : '00'
					floatStr = floatStr.length == 2 ? floatStr : floatStr + '0'

					this.moneyData = intStr + '.' + floatStr
				}
			},
			inputFocus () {
				if (this.moneyData.length > 0) {
					let redMoney = this.moneyData.split('.')
					let intStr = redMoney[0]
					let floatStr = (typeof redMoney[1] != "undefined" && redMoney[1] == '00') ? '' : redMoney[1]

					if (floatStr[1] == 0) {
						floatStr = floatStr[0]
					}

					this.moneyData = floatStr == '' ? intStr : intStr + '.' + floatStr
				}
			},
			//返回
			back () {
				this.sendVisible = false
				this.moneyData = ''
				this.remark = ''
				this.message = ''
				this.sendNum = ''
				this.moneyList = []
				this.redType = 1
			},
			//改变红包类型
			changeRedType (type) {
				this.redType = type
			},
		},
	}
</script>

<style scoped>
	.box {
		background: #F6F6F6;
	}

	/* 提示窗口 */
	/deep/ .uni-popup__wrapper-box {
		/*width: 100%;*/
		/*height: 100%;*/
	}

	.uni-tip {
		/* #ifndef APP-NVUE */
		/*display: flex;*/
		/*flex-direction: column;*/
		/* #endif */
		width: 15.04rem /* 282/18.75 */;
		background-color: #FFF;
		border-radius: 4px;
		left: 50%;
		/*margin-left: -7.52rem;*/
		/*position: fixed;*/
		/*top: 15%;*/
		box-sizing: border-box;
		font-size: 0.747rem /* 14/18.75 */;
	}

	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 0.853rem /* 16/18.75 */;
		color: #333;
		padding: 0.533rem 0.8rem /* 15/18.75 */;
		border-bottom: 1px solid #CCCCCC;
	}

	.uni-tip-content {
		font-size: 0.747rem /* 14/18.75 */;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 0.8rem /* 15/18.75 */;
		border-top: 1px solid #CCC;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 0.747rem /* 14/18.75 */;
		color: #3B4144;
		cursor: pointer;
		padding: 0.533rem 0;
	}

	.uni-input {
		height: 1.28rem /* 24/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		text-align: left;
		border: 1px solid #CCC;
		border-radius: 0.213rem /* 4/18.75 */;
		padding: 0 0.427rem /* 8/18.75 */;
		width: 7.68rem /* 144/18.75 */;
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	.uni-textarea {
		border: 1px solid #CCC;
		border-radius: 0.213rem /* 4/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		text-align: left;
		padding: 0 0.427rem /* 8/18.75 */;
		box-sizing: border-box;
		width: calc(100% - 4.053rem /* 76/18.75 */);
		display: inline-block;
		vertical-align: middle;
	}

	uni-textarea {
		height: 1.28rem /* 24/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
		width: auto;
	}

	/deep/ .uni-textarea-placeholder {
		font-size: 0.747rem /* 14/18.75 */;
	}

	/deep/ .uni-tip-button {
		font-size: 0.853rem /* 16/18.75 */;
	}

	.send {
		background: #FFF;
		padding: 1.067rem /* 20/18.75 */;
		overflow: hidden;
		border-bottom: 1px solid #F5F5F5;
	}

	.send-btn {
		/*width: 4.533rem !* 85/18.75 *!;*/
		height: 1.707rem /* 32/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		line-height: 1.707rem /* 32/18.75 */;
		float: right;
		cursor: pointer;
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
		border-left: 4px solid #F25442;
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

	.uni-tip-msg {
		text-align: left;
		padding: 0 15px;
		display: block;
	}

	.checkbox {
		border: 0.053rem /* 1/18.75 */ solid #CCC;
		line-height: 1.6rem /* 30/18.75 */;
		padding: 0 0.267rem /* 5/18.75 */;
		border-radius: 0.267rem /* 5/18.75 */;
		width: 47%;
		margin-bottom: 0.533rem /* 10/18.75 */;
		text-align: center;
		box-sizing: border-box;
	}

	.checkbox:nth-child(n) {
		float: left;
	}

	.checkbox:nth-child(2n) {
		margin-right: 0;
		float: right;
	}

	.checkbox:nth-child(5), .checkbox:nth-child(6) {
		margin-bottom: 0;
	}

	.preview-box {
		padding: 0 0.853rem /* 16/18.75 */;
	}

	.swiper {
		width: 100%;
		height: 100%;
	}

	.swiper-item {
		height: 100%;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	.active {
		background: #F25442;
		color: #FFF;
	}

	/deep/ .uni-textarea-textarea {
		font-size: 14px;
	}

	.send-btn[disabled] {
		background: #EBEDF0;
		color: #969799;
	}

	.send-btn[disabled]:after {
		border-color: #EBEDF0;
	}

	.list-empty {
		width: 36%;
		position: absolute;
		left: 32%;
		margin-top: calc(50% - 2.843rem /* 53.3/18.75 */);
	}

	.send-pop {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #F1F1F1;
		text-align: left;
	}

	/deep/ .uni-navbar--border {
		border-bottom-color: transparent;
	}

	.send-total {
		padding: 0.853rem /* 16/18.75 */ 0.693rem /* 13/18.75 */;
		background: #FFF;
		color: #070F20;
		font-size: 0.8rem /* 15/18.75 */;
		border-radius: 0.267rem /* 5/18.75 */;
	}

	.send-total-icon {
		background: #C4974C;
		border-radius: 0.107rem /* 2/18.75 */;
		color: #FFF;
		font-size: 0.587rem /* 11/18.75 */;
		padding: 0.107rem /* 2/18.75 */;
		margin-right: 0.48rem /* 9/18.75 */;
	}

	/deep/ .uni-input-placeholder {
		color: #B4B4B7;
	}

	.send-taggle {
		color: #6F6F6F;
		font-size: 0.64rem /* 12/18.75 */;
		margin-top: 0.693rem /* 13/18.75 */;
		text-align: right;
	}

	.send-scroll {
		background: #FFFFFF;
		border-radius: 0.267rem /* 5/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
		color: #070F20;
	}

	.send-scroll-title {
		font-size: 0.8rem /* 15/18.75 */;
		padding: 0.853rem /* 16/18.75 */;
	}

	.send-group-num {
		font-size: 0.64rem /* 12/18.75 */;
		color: #6F6F6F;
		padding-left: 0.8rem /* 15/18.75 */;
		margin-top: 0.693rem /* 13/18.75 */;
	}

	.send-money {
		font-size: 2.133rem /* 40/18.75 */;
		color: #333;
		margin: 1.067rem /* 20/18.75 */ 0;
		text-align: center;
	}

	.send-money-btn {
		position: fixed;
		width: calc(100% - 1.6rem);
		bottom: 0.8rem;
		background: #F25442;
		border-radius: 0.267rem /* 5/18.75 */;
		color: #FFF;
		font-size: 0.8rem /* 15/18.75 */;
		line-height: 2.453rem /* 46/18.75 */;
		text-align: center;
	}
</style>