<template>
	<view class="box" v-if="isReady"  :class="wosScroll">
		<view class="box-hd" style="background: #FFF;z-index:99;position: fixed;top: 0;left: 0;right: 0;">
			<uni-search-bar radius="30" :placeholder="placeholder" clearButton="always"
			                cancelButton="none"
			                @input="search"/>
			<view style="background: #FFF;padding: 0 0.533rem  /* 10/18.75 */ 0;">
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" v-if="follows.length > 0">
					<view plain="true" class="tab-btn" :id="'view'+0"
					      :class="tabBtnType == 0 ? 'active-tab-btn' : ''" @click="changeTabBtn(0)">全部
					</view>
					<template v-for="item in follows">
						<view plain="true" class="tab-btn" :id="'view'+item.id"
						      :class="tabBtnType == item.id ? 'active-tab-btn' : ''" @click="changeTabBtn(item.id)">
							{{item.title}}
						</view>
					</template>
				</scroll-view>
				<view style="padding-bottom: 8px;">
					<text style="color: #2A3349;font-size: 0.693rem  /* 13/18.75 */;">
						<template v-if="type == 1 && remindType == 0">
							截止目前：共有
							<text style="color: red;">{{count}}</text>
							位客户，即将达到共享客户条件
							<text
									v-if="tabBtnType != 0">（超过{{reclaim_day}}天未添加跟进情况）
							</text>
							，请尽快跟进。
						</template>
						<template v-if="type == 1 && remindType == 1">
							截止目前：共有
							<text style="color: red;">{{count}}</text>
							位客户，由于长时间沟通无果，已进入【可认领】公海池，如有其他同事认领，请您将客户共享给同事，谢谢。
						</template>
						<template v-if="type == 1 && remindType == 2">
							{{member}}，您有
							<text style="color: red;">{{count}}</text>
							位客户，长时间沟通无果，请您将客户共享给同事，谢谢。
						</template>
						<template v-if="type == 0 && remindType == 0">
							截止目前：共有
							<text style="color: red;">{{count}}</text>
							位客户，即将达到回收客户条件
							<text
									v-if="tabBtnType != 0">（超过{{reclaim_day}}天未添加跟进情况）
							</text>
							，请尽快跟进。
						</template>
						<template v-if="type == 0 && remindType == 1">
							截止目前：共有
							<text style="color: red;">{{count}}</text>
							位客户，达到回收客户条件，已重新归入至【客户公海池】，您无法再对其进行跟进。
						</template>
					</text>
				</view>
			</view>
		</view>
		<view class="content-list">
			<view v-if="customList.length > 0">
				<view class="content-list-item-title">{{member}}</view>
				<view class="content-list-item" v-for="item in customList">
					<view class="content-list-item-text">
						<view style="overflow:hidden;">
							<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
							       :src="item.avatar" v-if="item.avatar"></image>
							<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
							       src="../../static/useradvart.png" v-if="!item.avatar"></image>
							<view class="list-hd-content"
							      @click="type == 1 ? goToDetail(item.userid,item.externaluserid) : ''">
								<view class="list-hd-content-name">{{item.name}}
									<text
											v-if="item.corp_name != null" style="color: #FA9635;">@{{item.corp_name}}
									</text>
									<text v-else style="color: #30AB55;">@微信</text>
									<image style="width: 0.853rem  /* 16/18.75 */;height: 0.853rem;margin-left: 0.267rem  /* 5/18.75 */;vertical-align: bottom;"
									       src="../../static/scrm/man.png"
									       v-if="item.gender == '男'"></image>
									<image style="width: 0.853rem  /* 16/18.75 */;height: 0.853rem;margin-left: 0.267rem  /* 5/18.75 */;vertical-align: bottom;"
									       src="../../static/scrm/woman.png"
									       v-if="item.gender == '女'"></image>
								</view>
								<text style="background: #F5F6FE;border-radius: 0.533rem  /* 10/18.75 */;color: #01B065;font-size: 0.587rem  /* 11/18.75 */;padding: 0 0.64rem  /* 12/18.75 */;line-height: 1.067rem  /* 20/18.75 */;height: 1.067rem  /* 20/18.75 */;display: inline-block;float: right;display: none;"
								      v-if="(type == 1 && remindType == 0) || (type == 0 && remindType == 0)"
								      @click="open('addVisible')">
									添加跟进
								</text>
								<view style="float: right;" v-if="type == 1">
									<uni-icons type="arrowright" size="16" color="#cccccc"></uni-icons>
								</view>
								<view style="color: #01B065;font-size: 0.587rem  /* 11/18.75 */;"
								      v-if="type == 1 && remindType == 2">【{{item.user_name}}】认领
								</view>
								<view v-if="(type == 1 && remindType == 0) || (type == 0 && remindType == 0)"
								      style="color: #00A6F9;font-size: 0.587rem  /* 11/18.75 */;">
									还有{{item.reclaim_day}}天即将回收
								</view>
							</view>
						</view>
						<view>
							<text style="border: 0.053rem  /* 1/18.75 */ solid #FF684B;font-size: 0.533rem  /* 10/18.75 */;color: #FF684B;margin: 0 0.267rem  /* 5/18.75 */ 0 0;border-radius: 3px;padding: 0 5px;"
							      v-if="(type == 1 && remindType == 0) || (type == 0 && remindType == 0)">
								{{item.follow_title}}
							</text>
							<view style="font-size: 0.533rem  /* 10/18.75 */;color: #3582FB;float: right;"
							      @click="toChat(item.externaluserid)"
							      v-if="(type == 1 && remindType == 0) || (type == 1 && remindType == 2)">
								<img src="../../static/corp.png" alt="" style="width: 1.067rem  /* 20/18.75 */;">
								企微对话
							</view>
						</view>
					</view>
				</view>
				<view class="custom-tabs-loading" v-if="customList.length > 0">{{loadingText}}</view>
			</view>
			<view v-if="customList.length == 0">
				<img src="../../static/highSeasCustomer/empty.png" alt="" class="empty-img">
			</view>
		</view>
		<Footer v-if="is_show_copyright == 1 && customList.length > 0"></Footer>
		<Footer v-if="is_show_copyright == 1 && customList.length == 0" style="position:fixed;
bottom: 0;left: 0;right: 0;"></Footer>
		<!--		新增更进记录弹窗-->
		<uni-popup ref="addVisible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">添加跟进记录</text>
				<!--选择状态-->
				<picker @change="changeStatus" range-key="title" :range="follows">
					<view class="uni-input">
						<view class="choose-status" v-for="item in follows" v-if="status == item.id">
							<!--								<view >-->
							{{item.title}}
							<!--								</view>-->
						</view>
						<uni-icons type="arrowdown" size="20" style="float: right;font-size: 15px;"></uni-icons>
					</view>
				</picker>
				<!--输入框-->
				<view class="uni-textarea">
					<textarea placeholder="添加跟进记录，1000字以内" v-model="msg" maxlength="1000"/>
				</view>
				<!--图片上传-->
				<view>
					<view class="uni-hello-addfile demo" @click="chooseImage" v-if="imageSrc.length < 9">+
						附件（{{imageSrc.length}}/9）
					</view>
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
					             style="max-height: 5.333rem;margin-top: 0.533rem  /* 10/18.75 */;"
					             @scroll="scroll" v-if="imageSrc">
						<view v-for="(imgSrc,imgIndex) in imageSrc" class="img">
							<image :src="commonUrl + imgSrc" @click="preview(imgIndex)" class="img2"></image>
							<uni-icons type="close" size="20" style="position: absolute;right: 0;top: 0;"
							           color="#01B065" @click="deleteImg(imgIndex)"></uni-icons>
						</view>
					</scroll-view>
				</view>

				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('addVisible')">取消</text>
					<text class="uni-tip-button" @click="addBtn">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>

	import {Toast} from "vant";
	import Footer from "../../components/footer/footer.vue";

	export default {
		name         : "highSeasCustomerIndex",
		inject       : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden','getCopyright'],
		components   : {Footer},
		data () {
			return {
				url       : '',
				ticketData: {},
				agentData : {},
				wosScroll      : "wos-scroll-yes",
				commonUrl          : this.$store.state.commonUrl,
				isReady            : false,
				tabBtnType         : 0,//跟进状态id
				name               : '',//搜索的值
				//客户列表
				customList         : [],//列表数据
				page               : 1,//页码
				count              : 0,//分页
				loadingText        : '加载中...',
				follows            : [],//跟进状态列表
				type               : 0,//0非企微  1 企微
				remindType         : 0,//0提醒 1  公海池  2认领列表
				user_id            : '',//员工id
				member             : '',//所属成员名称
				chatExternalUserIds: '',//跳转的聊天对话人user_id
				status             : 1,//选择的状态
				msg                : '',//新增跟进内容
				imageSrc           : [],//上传图片链接数组
				marginTop          : '',//预览图片的marin-top值
				scrollTop          : 0,
				placeholder        : '请输入客户昵称',
				reclaim_day        : '',//切换跟进状态下的的天数
				marginTop2         : '',//占位图的marin-top值
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onShow       : function () {
			let title = ''
			if (this.type == 1 && this.remindType == 0) {
				title = '即将共享的企微客户'
			} else if (this.type == 1 && this.remindType == 1) {
				title = '可认领的企微客户'
			} else if (this.type == 1 && this.remindType == 2) {
				title = '成员已认领的企微客户'
			} else if (this.type == 0 && this.remindType == 0) {
				title = '即将回收的非企微客户'
			} else if (this.type == 0 && this.remindType == 1) {
				title = '已回收的非企微客户'
			}
			uni.setNavigationBarTitle({
				title: title
			});
		},
		onLoad       : function () {
			this.isReady = false
			Toast.loading({
				message    : '加载中...',
				forbidClick: true,
				loadingType: 'spinner',
			});

			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.limit)
			})

			this.user_id = this.getParameter('user_id')
			this.remindType = this.getParameter('remind_type')
			this.type = this.getParameter('type')

			// this.user_id = 96
			// this.remindType = 1
			// this.type = 1
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
				if (this.type == 1) {
					this.placeholder = '请输入客户昵称'
				} else if (this.type == 0) {
					this.placeholder = '请输入客户姓名'
				}
				this.getData()
			},
			//企微客户列表
			async getData (page = 1) {
				// Toast.loading({
				// 	message    : '加载中...',
				// 	forbidClick: true,
				// 	loadingType: 'spinner',
				// });
				let url = ''
				if (this.type == 0) {
					//非企微
					url = 'chat-message/sea-no-customer'
				} else if (this.type == 1) {
					//企微
					url = 'chat-message/sea-customer'
				}
				const {data: res} = await this.axios.post(url, {
					user_id    : this.user_id,
					remind_type: this.remindType,
					type       : this.type,
					follow_id  : this.tabBtnType,
					name       : this.name,
					page       : page
				});
				if (res.error != 0) {
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					this.isReady = true
					this.page = page
					this.count = res.data.count
					this.member = res.data.member
					this.reclaim_day = res.data.reclaim_day
					if (this.remindType == 0) {
						if (res.data.followData && res.data.followData.length > 0) {
							this.follows = res.data.followData
						}
					}
					if (this.page == 1) {
						this.customList = res.data.customerData
					} else {
						this.customList = this.customList.concat(res.data.customerData)
					}
					if (this.customList.length < 10) {
						this.loadingText = '已加载全部'
					}
					Toast.clear();
					this.$nextTick(() => {
						document.getElementsByClassName('content-list')[0].style.marginTop = document.getElementsByClassName('box-hd')[0].offsetHeight + 'px'
					})

					// if(this.customList.length == 0){
					// 	let _this = this;
					// 	uni.getSystemInfo({
					// 		success (res) {
					// 			_this.phoneHeight = res.windowHeight;
					// 			let imgHeight = ''
					// 			let hdTop = ''
					// 			_this.$nextTick(()=>{
					// 				imgHeight = document.getElementsByClassName('empty-img')[0].offsetHeight
					// 				hdTop = document.getElementsByClassName('box-hd')[0].offsetHeight
					// 				//获取占位图的marginTop
					// 				_this.marginTop2 = res.windowHeight/2 - imgHeight/2 - hdTop + 'px'
					// 				console.log(_this.phoneHeight,1111)
					// 				debugger
					// 				console.log(imgHeight,2222)
					// 				console.log(hdTop,3333)
					// 				console.log(_this.marginTop2,444)
					// 			})
					// 		}
					// 	});
					// 	_this.$forceUpdate()
					// }
				}
			},
			//搜索确认
			search (e) {
				this.name = e.value
				this.getData()
			},
			//切换按钮tab
			changeTabBtn (type) {
				this.tabBtnType = type
				this.getData()
			},
			//微信对话
			toChat (external_userid) {
				this.chatExternalUserIds = external_userid
				this.openEnterpriseChat()
			},
			//打开会话
			openEnterpriseChat () {
				let _this = this
				_this.$store.state.wx.openEnterpriseChat({
					// 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
					userIds        : '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
					externalUserIds: _this.chatExternalUserIds, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
					groupName      : '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
					success        : function (res) {
						// 回调
					},
					fail           : function (res) {
						if (res.errMsg.indexOf('function not exist') > -1) {
							uni.showToast({
								title   : '版本过低请升级',
								image   : '/static/fail.png',
								duration: 2000
							});
						}
					}
				});
			},
			//添加跟进
			open (type) {
				this.wosScroll = 'wos-scroll-no'
				this.$refs[type].open()
			},
			cancel (type) {
				this.wosScroll = 'wos-scroll-yes'
				this.$refs[type].close()
				this.status = 0
				this.msg = ''
				this.imageSrc = []
			},
			//选择状态
			changeStatus (e) {
				this.status = this.follows[e.target.value].id
			},
			//上传图片
			chooseImage: function () {
				let that = this
				uni.chooseImage({
					count     : 1,
					sizeType  : ['compressed'],
					sourceType: ['album'],
					success   : (res) => {
						if (res.tempFiles[0].size > 2 * 1024 * 1024) {
							Toast.fail('文件大小超过2M')
							return false
						}
						Toast.setDefaultOptions({duration: 200000});
						Toast.loading({
							message    : '正在上传...',
							forbidClick: true,
							loadingType: 'spinner',
						});
						var imageSrc = res.tempFilePaths[0]
						uni.uploadFile({
							url     : that.$store.state.commonUrl + '/api/sub-user/upload-image',
							filePath: imageSrc,
							fileType: 'image',
							name    : 'fileInfo',
							formData: {
								'uid': localStorage.getItem('uid'),
							},
							header  : {
								'Authorization': 'Bearer ' + localStorage.getItem('token')
							},
							success : (res) => {
								Toast.setDefaultOptions({duration: 1000});
								Toast.clear()
								if(JSON.parse(res.data).error == 0){
									uni.showToast({
										title   : '上传成功',
										icon    : 'success',
										duration: 2000
									});
									that.imageSrc.push(JSON.parse(res.data).data.local_path)
								}else {
									uni.showToast({
										title   : JSON.parse(res.data).error_msg,
										image   : '/static/fail.png',
										duration: 2000
									});
								}
							},
							fail    : (err) => {
								Toast.setDefaultOptions({duration: 1000});
								Toast.clear()
								uni.showModal({
									content   : err.errMsg,
									showCancel: false
								});
							}
						});
					},
					fail      : (err) => {
						console.log('chooseImage fail', err)
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'];
								if (!authStatus) {
									uni.showModal({
										title  : '授权失败',
										content: '需要从您的相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			//删除图片
			deleteImg (imgIndex) {
				this.imageSrc.splice(imgIndex, 1)
			},
			//新建按钮
			async addBtn () {
				if (this.msg == '' && this.imageSrc.length == 0) {
					Toast.fail('跟进内容不能为空！');
					return false
				}
				if (!this.status) {
					Toast.fail('请选择跟进状态！');
					return false
				}
				for (let i = 0; i < this.follows.length; i++) {
					if (this.follows[i].id == this.status) {
						if (this.follows[i].status == 0) {
							Toast.fail('跟进状态已被删除，请更换！');
							return false
						} else {
							break
						}
					}
				}
				Toast.loading({
					message    : '上传中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("wap-custom-detail/custom-follow-record-set", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : localStorage.getItem('user_id'),
					external_userid: localStorage.getItem('externalId'),
					follow_id      : this.status,
					record_id      : this.record_id,
					record         : this.msg,
					file           : this.imageSrc,
				});
				if (res.error != 0) {
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					this.msg = ''
					this.imageSrc = []
					this.status = 0
					this.record_id = ''
					this.wosScroll = 'wos-scroll-yes'

					this.$refs['addVisible'].close()
					this.getFollowRecord()
					this.getData()
				}
			},
			//跳转详情
			goToDetail (userid, external_userid) {
				let agent_id = this.getParameter('agent_id')
				uni.navigateTo({
					url: "/pages/customDetail/index?user_id=" + userid + "&external_userid=" + external_userid + "&agentId=" + agent_id
				});
			}
		},
	}
</script>

<style scoped>
	.box {
		background: #F2F3F5;
		text-align: left;
		font-size: 0.8rem /* 15/18.75 */;
		overflow: hidden;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		margin-bottom: 8px;
	}

	.tab-btn {
		height: 1.227rem /* 23/18.75 */;
		background: #EDEDED;
		border-radius: 0.587rem /* 11/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
		color: #666;
		line-height: 1.227rem /* 23/18.75 */;
		padding: 0 0.96rem /* 18/18.75 */;
		display: inline-block;
		margin-right: 10px;
	}

	.active-tab-btn {
		background: #01B065;
		color: #FFF !important;
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
		margin-top: 7.093rem;
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
		padding: 0.533rem /* 10/18.75 */;
		border-bottom: 1px solid #F2F3F5;
	}

	.list-hd-content {
		padding: 0 0 0.267rem 0.533rem /* 10/18.75 */;
		width: calc(100% - 2.4rem /* 45/18.75 */);
		float: left;
		box-sizing: border-box;
	}

	.list-hd-content-name {
		color: #333;
		font-weight: 700;
		font-size: 0.693rem /* 13/18.75 */;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		width: calc(100% - 0.907rem /* 17/18.75 */);
		display: inline-block;
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
		background: #01B065;
		color: #FFF;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
		height: 100%;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	/deep/ .uni-input-placeholder, /deep/ .uni-searchbar__text-placeholder {
		font-size: 0.693rem /* 13/18.75 */;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 75%;
		background-color: #FFF;
		border-radius: 4px;
		left: 12.5%;
		position: absolute;
		top: 15%;
		box-sizing: border-box;
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3B4144;
	}

	.uni-input {
		height: 28px;
		line-height: 28px;
		font-size: 15px;
		text-align: left;
		border: 1px solid #CCC;
		border-radius: 4px;
		padding: 0 8px;
		margin: 15px 0;
	}

	/deep/ .uni-tip-button {
		font-size: 16px;
	}

	.uni-textarea {
		border: 1px solid #CCC;
		border-radius: 4px;
		margin: 0.8rem 0;
		font-size: 0.8rem;
		text-align: left;
		padding: 0.427rem;
		box-sizing: border-box;
	}

	uni-textarea {
		width: auto;
	}

	/deep/ .uni-searchbar__box {
		border-color: #F2F2F2;
	}

	/deep/ .uni-searchbar__box-icon-clear .uni-icons {
		color: #CCC !important;
	}

	.empty-img {
		width: 38%;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}

</style>