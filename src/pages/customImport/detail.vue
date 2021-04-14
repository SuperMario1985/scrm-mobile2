<template>
	<view class="box">
		<view class="list" v-if="isReady">
			<div class="msg-text">
				<p style="margin-bottom: 0.267rem  /* 5/18.75 */;">
					系统给你分配了客户，快去复制电话号码在企业微信里添加客户吧。添加路径：
				</p>
				<p>
					*APP客户端--消息列表--点击右上角“+”--点击“加微信”--将复制成功的手机号复制在搜索框，点击确认搜索--客户收到员工的加入邀请--客户添加后，即状态变更为“添加成功”。
				</p>
			</div>
			<view class="list-title-p">
				<view class="list-title">
					共{{count}}个客户
				</view>
				<!--选择状态-->
				<picker @change="bindPickerChange" :value="statusIndex" :range="statusList" style="float: right;">
					<view class="choose-btn">{{statusList[statusIndex]}}
						<uni-icons type="arrowdown"
						           style="color: #666;vertical-align: middle;margin-left: 0.16rem  /* 3/18.75 */;"></uni-icons>
					</view>
				</picker>
			</view>
			<view>
				<t-table border="1" border-color="#eaeaea" :is-check="false"
				         style="margin: 1.067rem  /* 20/18.75 */ 1.067rem  /* 20/18.75 */ 0;width: calc(100% - 2.133rem  /* 40/18.75 */);">
					<t-tr font-size="12" color="#333" align="left">
						<t-th align="center">客户电话</t-th>
						<t-th align="center">添加状态</t-th>
						<t-th align="center">操作</t-th>
					</t-tr>
					<t-tr font-size="12" color="#666" align="right" v-for="item in list"
					      :key="item.detail_id">
						<t-td align="center">{{item.phone}}</t-td>
						<t-td align="center">
							<span v-if="item.is_add == 0">未添加</span>
							<span v-if="item.is_add == 1">已成功添加</span>
						</t-td>
						<t-td align="center">
							<view
							        style="height: 1.387rem  /* 26/18.75 */;line-height: 1.387rem  /* 26/18.75 */;font-size:0.64rem  /* 12/18.75 */;color: #01B065;width: 100%;"
							        v-clipboard:copy="item.phone"
							        v-clipboard:success="(type) => copyPhone('success')"
							        v-clipboard:error="(type) => copyPhone('error')"
							>复制
							</view>
						</t-td>
					</t-tr>
				</t-table>
				<drag-button
					:isDock="true"
					:existTabBar="true"
					@btnClick="toAddCustom" :content="addCustomImg" v-if="userPlatform != 'other'" />
				<img src="../../static/redPacket/empty.png" alt="" v-if="list.length == 0" class="list-empty">
			</view>
			<view class="custom-tabs-loading" v-if="list.length > 0">{{loadingText}}</view>
		</view>
		<Footer v-if="isReady && is_show_copyright == 1"></Footer>
	</view>
</template>

<script>
	import {Toast} from "vant";
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import Footer from "../../components/footer/footer.vue";

	export default {
		name             : "list",
		inject           : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden','getCopyright'],
		components       : {tTable, tTh, tTr, tTd,Footer},
		data () {
			return {
				url       : '',
				ticketData: {},
				agentData : {},
				userid    : '',

				commonUrl  : this.$store.state.commonUrl,
				isReady    : false,
				list       : [],
				loadingText: '加载中...',
				statusList : ['添加状态', '未添加', '已成功添加'],//状态选择项
				statusIndex: 0,//选择的状态项的序号
				count      : 0,//总数
				page       : 1,//页码
				addCustomImg      : '../../static/scrm/addCustom1.png',//新建悬浮按钮
				userPlatform:localStorage.getItem('userPlatform'),//客户端平台，pc端other，安卓手机android，苹果手机ios
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad           : function () {
			uni.setNavigationBarTitle({
				title: '查看客户详情'
			});

			this.isReady = false
			Toast.loading({
				message    : '加载中...',
				forbidClick: true,
				loadingType: 'spinner',
			});
			this.userid = this.getParameter('userid')
			this.$store.dispatch('setWx', () => {
				this.initPage(this.limit)
			})

			// this.userid = 'LiYunLi'
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.getData()
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
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null) {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
			//添加客戶
			toAddCustom () {
				this.$store.state.wx.invoke('navigateToAddCustomer',
					{},
					function (res) {
						if(res.err_code != 0){
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
				let agent_id = this.getParameter('agentId') !== null ? this.getParameter('agentId') : (this.getParameter('agent_id') !== null ? this.getParameter('agent_id') : '')
				localStorage.setItem('agent_id', agent_id)
				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
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
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : res.errMsg
						})
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
										that.getInfoData()
									},
									fail     : function (res) {
										if (res.errMsg.indexOf('function not exist') > -1) {
											Toast.fail({
												forbidClick: true,
												duration   : 0,
												message    : '版本过低请升级'
											})
										} else if (res.errMsg == 'agentConfig:not match any reliable domain.') {
											Toast.fail({
												forbidClick: true,
												duration   : 0,
												message    : '可信域名未填写或未验证'
											})
										} else {
											Toast.fail({
												forbidClick: true,
												duration   : 0,
												message    : res.errMsg
											})
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
				this.userPlatform = localStorage.getItem('userPlatform')
				this.getData()
			},
			async getData (page = 1) {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("work-import-customer/import-user-customer", {
					corp_id  : localStorage.getItem('corpid'),
					userid   : this.userid,
					status   : this.statusIndex,
					page     : page,
					page_size: 15,
				});
				if (res.error != 0) {
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					this.isReady = true
					Toast.clear();
					this.count = res.data.count
					this.page = page
					if (this.page == 1) {
						this.list = res.data.list
					} else {
						this.list = this.list.concat(res.data.list)
					}
					if (this.list.length < 15) {
						this.loadingText = '已加载全部'
					}
					uni.stopPullDownRefresh();
				}
			},
			//选择状态
			bindPickerChange (e) {
				this.statusIndex = e.target.value
				this.getData()
			},
			//复制手机号
			copyPhone (type) {
				if (type==='success') {
					Toast.success('复制成功')
				} else {
					Toast.fail('复制失败')
				}
			}
		},
	}
</script>

<style scoped>
	.msg-text {
		padding: 0.533rem /* 10/18.75 */;
		background-color: #FFEDD7;
		border-radius: 0.16rem /* 3/18.75 */;
		text-align: left;
		font-family: PingFang-SC-Medium;
		font-size: 0.64rem /* 12/18.75 */;
		font-weight: normal;
		font-stretch: normal;
		line-height: 0.907rem /* 17/18.75 */;
		letter-spacing: 0px;
		color: #FFA332;
		margin: 0.533rem /* 10/18.75 */ 1.067rem /* 20/18.75 */;
	}

	.box {
		background: #F6F6F6;
	}

	.choose-btn {
		font-size: 0.747rem /* 14/18.75 */;
		line-height: 1.707rem /* 32/18.75 */;
		float: right;
		cursor: pointer;
		padding: 0 0.747rem /* 14/18.75 */;
		color: #666;
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
		border-left: 4px solid #01B065;
		padding-left: 0.267rem /* 5/18.75 */;
		margin-top: 0.347rem /* 6.5/18.75 */;
		display: inline-block;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	.list-empty {
		width: 36%;
		position: absolute;
		left: 32%;
		margin-top: calc(50% - 2.843rem /* 53.3/18.75 */);
	}

	/deep/ .t-tr {
		height: 40px;
	}
</style>