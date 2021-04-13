<template>
	<view style="height: 100%;">
		<view class="todoBox" v-show="isReady && !showChooseDepartment">
			<view style="overflow: hidden;background: #FFF;z-index:999;">
				<scroll-view class="fix-status-box" scroll-x="true" scroll-left="0" :scroll-into-view="toView"
				             scroll-with-animation v-if="from == 1 && show_status == 1">
					<view class="content-hd-tabs" v-for="item in statusList" :id="'view'+item.id"
					      :style="{'background':item.id == statusId ? '#5283EC' : '','color': item.id == statusId ? '#FFF' : ''}"
					      @click="changeStatusId(item.id,item.title)">{{item.title}}
					</view>
				</scroll-view>
				<view class="fix-box content_head">
					<view class="choose-tags" @click="chooseStaff" v-if="show == 0">
						<span v-if="userCount == 0">选择处理人</span>
						<span v-if="userCount > 0">{{userCount}}个处理人</span>
						<uni-icons type="arrowdown"
						           style="color: #999;margin: 0rem  /* 0/18.75 */ 0.427rem  /* 8/18.75 */ 0 0.267rem  /* 5/18.75 */;font-size: 0.853rem  /* 16/18.75 */;vertical-align: middle;"></uni-icons>
					</view>
					<ms-dropdown-menu>
						<ms-dropdown-item :hasSlot="true" :title="projectName"
						                  ref="projectDropdown" v-if="from == 0 || (from == 1 && show_project == 1)">
							<view class="dropdown-item-content">
								<uni-list>
									<uni-list-item v-for="item in projectList" :ellipsis="1" :title="item.title"
									               :showArrow="false" @click="changeProjectId(item.id,item.title)"
									               :clickable="true">
										<template v-slot:right="">
											<uni-icons type="checkmarkempty" size="22" color="#5284EC"
											           mode="widthFix"
											           v-if="projectId == item.id"></uni-icons>
										</template>
									</uni-list-item>
								</uni-list>
							</view>
						</ms-dropdown-item>
						<ms-dropdown-item :hasSlot="true" :title="statusName"
						                  ref="statusDropdown" v-if="from == 0">
							<view class="dropdown-item-content">
								<uni-list>
									<uni-list-item v-for="item in statusList" :ellipsis="1" :title="item.title"
									               :showArrow="false" @click="changeStatusId(item.id,item.title)"
									               :clickable="true">
										<template v-slot:right="">
											<uni-icons type="checkmarkempty" size="22" color="#5284EC"
											           mode="widthFix"
											           v-if="statusId == item.id"></uni-icons>
										</template>
									</uni-list-item>
								</uni-list>
							</view>
						</ms-dropdown-item>
					</ms-dropdown-menu>
				</view>
			</view>
			<view class="todo-content">
				<view class="todo-box" v-for="part in todoList">
					<view class="todo-box-head">
						<view class="todo-box-head-title">
							{{part.title}}
						</view>
						<text style="font-size: 0.8rem  /* 15/18.75 */;float: right;"
						      :style="{'color':part.status_color}">
							{{part.status_title}}
						</text>
					</view>
					<view style="overflow:hidden;margin-bottom: 0.427rem  /* 8/18.75 */;">
						<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
						       :src="part.avatar" v-if="part.avatar"></image>
						<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
						       src="../../static/useradvart.png" v-if="!part.avatar"></image>
						<view class="list-hd-content">
							<view class="list-hd-content-name">{{part.name}}
								<text v-if="part.corp_name != null"
								      style="font-size: 0.587rem;color: #FA9635;margin-left: 0.427rem  /* 8/18.75 */;">
									@{{part.corp_name}}
								</text>
								<text v-else
								      style="color: #30AB55;font-size: 0.587rem;margin-left: 0.427rem  /* 8/18.75 */;">
									@微信
								</text>
							</view>
							<view style="overflow: hidden;margin-top: 0.267rem  /* 5/18.75 */;">
								<view class="todo-box-head-tag"
								      :style="{'color':part.level_color,'border-color':part.level_color}">{{part.level}}
								</view>
								<view style="width: 7rem;display: inline-block;float: right;">
									<cmd-progress :percent="part.per" stroke-color="#5284EC"></cmd-progress>
								</view>
							</view>
						</view>
					</view>
					<view class="todo-box-body">
						<view class="todo-box-body-txt" v-if="part.status == 3"
						      style="margin-top: 1.067rem  /* 20/18.75 */;">
							<text class="todo-box-body-txt-left">项目实际完成</text>
							<text style="color: #111;">{{part.finish_time}}
								<span v-if="part.is_finish == 1">（按时完成）</span>
								<span v-if="part.is_finish == 2" style="color: red;">（超时{{part.delay_days}}天）</span>
								<span v-if="part.is_finish == 3">（提前{{part.pre_days}}天）</span>
							</text>
						</view>
						<view class="todo-box-body-txt"
						      :style="{'margin-top':part.status == 3 ? '' : '1.067rem  /* 20/18.75 */'}">
							<text class="todo-box-body-txt-left">项目处理人</text>
							<text style="color: #111;">{{part.leader}}</text>
						</view>
						<view class="todo-box-body-txt" v-if="part.status != 1">
							<text class="todo-box-body-txt-left">项目开始时间</text>
							<text style="color: #111;">{{part.start_time}}</text>
						</view>
						<view class="todo-box-body-txt" v-if="part.status != 1">
							<text class="todo-box-body-txt-left">预计截止时间</text>
							<text style="color: #111;">{{part.end_time}}</text>
						</view>
						<view class="todo-box-body-txt">
							<text style="float: left;" class="todo-box-body-txt-left">待办项目描述</text>
							<text style="word-wrap: break-word;width: calc(100% - 5.333rem  /* 100/18.75 */);float: left;color: #111;"
							      v-if="part.desc != ''">{{part.desc}}
							</text>
							<text style="word-wrap: break-word;width: calc(100% - 5.333rem  /* 100/18.75 */);float: left;color: #111;"
							      v-else>--
							</text>
						</view>
						<view style="text-align: right;">
							<button type="primary" class="todo-box-body-btn" @click="startProject(part.id)"
							        v-if="part.status == 1 && part.show_start == 1">项目开始
							</button>
							<button type="default" class="todo-box-body-btn"
							        style="background: #F6F6F6;color: #757B84;"
							        v-if="part.status != 1" @click="detailProject(part.id)">待办详情
							</button>
							<button type="primary" class="todo-box-body-btn"
							        v-if="part.status == 2 && part.show_project == 1"
							        @click="openAddProject(part.id,part.title,part.end_time,part.status_id,part.per,part.last_days,part.task_id,part.external_userid,part.sea_id)">
								项目跟进
							</button>
						</view>
					</view>
				</view>
				<view class="custom-tabs-loading" v-if="todoList.length > 0">{{loadingText}}</view>
				<img src="../../static/highSeasCustomer/empty.png" alt="" v-if="todoList.length == 0&&isLoading"
				     style="width: 35%;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);">
				<Footer style="position: absolute;bottom: 50px;left: 0;right: 0;" v-if="todoList.length == 0&&isLoading && is_show_copyright == 1"></Footer>
				<Footer v-if="todoList.length != 0&&isLoading && is_show_copyright == 1"></Footer>
			</view>
		</view>
		<!--项目跟进弹窗-->
		<uni-popup ref="addProjectVisible" type="bottom" :mask-click="false" class="add-project">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					添加项目跟进
				</text>
				<scroll-view scroll-y="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;height: 20rem  /* 375/18.75 */;overflow-y: auto;">
					<view style="line-height: 3.733rem  /* 70/18.75 */;color: #333333;font-size: 0.853rem  /* 16/18.75 */;font-weight: 700;text-align: left;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;">
						<text style="width: 0.16rem  /* 3/18.75 */;height: 0.72rem  /* 13.5/18.75 */;display: inline-block;background: #5283EC;margin-right: 0.427rem  /* 8/18.75 */;"></text>
						{{addName}}
					</view>
					<view>
						<text style="font-weight: 700;">预计结束时间：</text>
						{{finishTime}}（还有{{restDay}}天)
					</view>
					<view v-if="projectList.length > 0" style="margin-top: 0.8rem  /* 15/18.75 */;">
						<text style="color: red;">*</text>
						<text style="font-weight: 700;">项目状态：</text>
						<picker @change="bindPickerChange" :value="statusIndex" :range="statusList2"
						        range-key="title"
						        style="width: calc(100% - 4.667rem  /* 87.5/18.75 */);display: inline-block;">
							<view class="uni-input" style="font-size: 0.64rem  /* 12/18.75 */;">
								{{statusList2[statusIndex].title}}
								<uni-icons type="arrowdown" size="20"
								           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<text style="color: red;vertical-align: sub;">*</text>
						<text style="font-weight: 700;vertical-align: sub;">项目进度：</text>
						<input class="uni-input" type="number"
						       style="width: 5.333rem  /* 100/18.75 */;display: inline-block;vertical-align: middle;margin-right: 0.267rem  /* 5/18.75 */;font-size: 0.64rem  /* 12/18.75 */;"
						       v-model="process" placeholder="请输入进度"/>
						<span style="vertical-align: sub;">%</span>
						<span style="vertical-align: sub;color: #FF2438;margin-left: 0.533rem  /* 10/18.75 */;">上次进度在{{lastPer}}%</span>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<text style="color: red;">*</text>
						<text style="font-weight: 700;">进度说明：</text>
						<textarea placeholder="请输入进度说明，200字以内" maxlength="200"
						          v-model="instructions" class="add-project-textareea"/>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" @click="cancel('addProjectVisible')">取消</text>
					<text class="add-project-ok" @click="addProject">确定</text>
				</view>
			</view>
		</uni-popup>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>
	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";

	export default {
		name         : "list",
		inject       : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden','getCopyright'],
		components   : {
			msDropdownMenu,
			msDropdownItem,
			Footer,
			ChooseDepartment
		},
		data () {
			return {
				url            : '',
				ticketData     : {},
				agentData      : {},
				isLoading      : false,
				commonUrl      : this.$store.state.commonUrl,
				isReady        : true,
				todoList       : [],//数据数组
				loadingText    : '加载中...',
				count          : '',//总数
				page           : 1,//页码
				projectList    : [],//事项数组
				projectId      : '',//选择的事项
				projectName    : '选择事项',//选择的事项名称
				statusList     : [],//状态数组
				statusId       : '',//选择的状态
				statusName     : '选择状态',//选择的状态名称
				userCount      : 0,//选择的成员数
				userId         : [],//选择的成员
				show           : 0,//选择成员显示与隐藏
				//项目跟进
				statusList2    : [],//添加跟进的可选状态数组
				cid            : '',//正在操作的项目id
				addId          : '',//选中的项目状态id
				finishTime     : '',//预计结束时间
				addName        : '',//项目名
				restDay        : '',//正在操作的项目剩余天数
				lastPer        : '',//上次项目进度
				instructions   : '',//进度说明
				process        : '',//项目进度
				statusIndex    : 0,//选中的项目状态index
				task_id        : '',//添加跟进需要参数
				external_userid: '',//添加跟进需要参数
				sea_id         : '',//添加跟进需要参数
				from           : 0,//0默认，1从链接跳转来
				toView         : '',//要跳转的位置
				custom_id      : [],//从链接跳转来携带参数
				user_ids       : [],//从链接跳转来携带参数
				show_status    : 0,//从链接跳转来，1显示状态筛选，0不显示
				show_project   : 0,//从链接跳转来，1显示事项筛选，0不显示
				showChooseDepartment  : false,//选择成员组件的显示与隐藏
				selectDepartment      : [],//已选择的成员
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onTabItemTap : function (obj) {
			this.$store.commit("setHasTagsId", [])
			this.selectDepartment = []
			this.loadingText = '加载中...'
			this.projectId = ''
			this.projectName = '选择事项'
			this.statusId = ''
			this.statusName = '选择状态'
			// if (localStorage.getItem('uid') != null) {
			// 	this.getInfoData()
			// } else {
			// 	this.$store.dispatch('setWx', () => {
			// 		this.initPage(this.limit)
			// 	})
			// }
		},
		onShow () {
			setTimeout(() => {
				uni.setNavigationBarTitle({
					title: '待办项目'
				});
				this.isReady = false
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				this.custom_id = this.getParameter('custom_id') ? this.getParameter('custom_id').split(',') : []
				this.url_user_ids = this.getParameter('user_ids') ? this.getParameter('user_ids').split(',') : []

				if (this.custom_id.length > 0 && this.url_user_ids.length > 0) {
					this.from = 1
					uni.hideTabBar()
				} else {
					this.from = 0
					uni.showTabBar()
				}

				this.show_status = this.getParameter('show_status') != null ? this.getParameter('show_status') : 0
				this.show_project = this.getParameter('show_project') != null ? this.getParameter('show_project') : 0
				try {
					const value = uni.getStorageSync('projectId');
					const value2 = uni.getStorageSync('statusId');
					if (typeof value != null || typeof value2 != null) {
						if (typeof value != null && value != '') {
							this.projectId = value;
							this.projectName = uni.getStorageSync('projectName');
						}
						if (typeof value2 != null && value2 != '') {
							this.statusId = value2;
							this.statusName = uni.getStorageSync('statusName');
						}
						this.getBeforeData()
						try {
							uni.removeStorageSync('projectId');
							uni.removeStorageSync('projectName');
							uni.removeStorageSync('statusId');
							uni.removeStorageSync('statusName');
						} catch (e) {
							// error
						}
					} else {
						this.getBeforeData()
					}
				} catch (e) {
					// error
				}

				// localStorage.setItem('user_id', 'shakalaka')
				// localStorage.setItem('user_id', 'wangpan')
				// localStorage.setItem('user_id', 'LiYunLi')
				// // localStorage.setItem('user_id', 'JinHui')
				// // localStorage.setItem('user_id', 'dove_chen')
				// this.isReady = true
				// localStorage.setItem('uid', 2)
				// localStorage.setItem('corpid', 'ww93caebeee67d134b')
				// localStorage.setItem('agent_id', '25')
				// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
				// this.getInfoData()
			}, 100)
		},
		onReachBottom: function () {
			if (this.todoList.length < this.count) {
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
				if (agent_id == '') {
					agent_id = localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id')
				} else {
					localStorage.setItem('agent_id', agent_id)
					sessionStorage.setItem('agent_id', agent_id)
				}
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
			getBeforeData () {
				if (localStorage.getItem('uid') != null) {
					this.getInfoData()
				} else {
					this.$store.dispatch('setWx', () => {
						this.initPage(this.limit)
					})
				}
			},
			getInfoData () {
				this.getProjectList()
				this.getStatusList()
				this.getData()
			},
			//获取事项
			async getProjectList () {
				const {data: res} = await this.axios.post(
					"wait-project/get-project",
					{
						corp_id: localStorage.getItem('corpid')
					}
				);

				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.projectList = res.data
					let obj = {
						id   : '',
						title: '全部项目'
					}
					this.projectList.unshift(obj)
					// this.getStatusList()
				}
			},
			//选择成员
			chooseStaff () {
				if (this.$refs.projectDropdown) {
					this.$refs.projectDropdown.closePopup()
				}
				if (this.$refs.statusDropdown) {
					this.$refs.statusDropdown.closePopup()
				}
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
			//获取事项
			async getStatusList () {
				const {data: res} = await this.axios.post(
					"wait-project/common-detail",
					{
						uid: localStorage.getItem("uid")
					}
				);

				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.statusList = JSON.parse(JSON.stringify(res.data.project_status))
					let obj = {
						id   : '',
						title: '全部状态'
					}
					this.statusList.unshift(obj)
					this.statusList2 = []
					for (let j = 1; j < res.data.project_status.length; j++) {
						this.statusList2.push(JSON.parse(JSON.stringify(res.data.project_status[j])))
					}
					// this.getData()
				}
			},
			//客户列表
			async getData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				this.userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.userId.push(this.selectDepartment[i].id)
					}
				}
				this.isLoading = false
				const {data: res} = await this.axios.post("wait-project/desk-wait", {
					corp_id     : localStorage.getItem('corpid'),
					uid         : localStorage.getItem('uid'),
					userid      : localStorage.getItem('user_id'),
					custom_id   : this.custom_id,
					status_id   : this.statusId,
					project_id  : this.projectId,
					user_ids    : this.userId,
					url_user_ids: this.url_user_ids,
					from        : this.from,
					page        : page
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg + '11',
						image   : '/static/fail.png',
						duration: 2000
					});
					this.isLoading = true
				} else {
					let that = this
					that.page = page
					that.count = res.data.count
					that.userCount = res.data.user_count
					that.show = res.data.show

					if (that.page == 1) {
						that.todoList = res.data.info
					} else {
						that.todoList = that.todoList.concat(res.data.info)
					}
					if (that.todoList.length == that.count) {
						that.loadingText = '已加载全部'
					}

					that.isReady = true
					uni.hideLoading();
					this.isLoading = true

					if (that.from == 1) {
						if (that.show == 1) {
							//从链接跳转切选择成员不显示
							this.$nextTick(() => {
								that.$refs.projectDropdown.$el.style.maxWidth = '100%'
							})
						} else {
							//从链接跳转切选择成员显示
							this.$nextTick(() => {
								that.$refs.projectDropdown.$el.style.maxWidth = '100%'
								document.getElementsByClassName('choose-tags')[0].style.width = '50%'
							})
						}

						that.$nextTick(() => {
							if (that.show_status == 1) {
								document.getElementsByClassName('fix-box')[0].style.top = '2.827rem  /* 53/18.75 */'
								document.getElementsByClassName('todo-content')[0].style.marginTop = '5.493rem  /* 103/18.75 */'
							} else {
								document.getElementsByClassName('todo-content')[0].style.marginTop = '0'
							}
							document.getElementsByClassName('todo-content')[0].style.marginBottom = '0.533rem  /* 10/18.75 */'
						})
					}

				}

			},
			//切换项目
			changeProjectId (id, title) {
				this.projectId = id
				this.projectName = title
				this.$refs.projectDropdown.closePopup()
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.getData()
			},
			//切换项目状态
			changeStatusId (id, title) {
				this.statusId = id
				this.statusName = title
				if (this.from == 0) {
					this.$refs.statusDropdown.closePopup()
				} else {
					if (document.getElementById('view' + id).offsetLeft + document.getElementById('view' + id).clientWidth > document.body.clientWidth) {
						this.toView = 'view' + id
					}
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.getData()
			},
			//开始
			startProject (id) {
				let that = this
				uni.showModal({
					content: '确定开始吗？',
					success: function (res) {
						if (res.confirm) {
							that.startProject2(id)
						}
					}
				});
			},
			async startProject2 (id) {
				const {data: res} = await this.axios.post(
					"wait-project/start",
					{
						uid: localStorage.getItem('uid'),
						id : id,
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.getData()
				}
			},
			//待办详情
			detailProject (id) {
				let externalId = this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('externalId')
				let user_id = this.getParameter('user_id') != null ? this.getParameter('user_id') : localStorage.getItem('user_id')
				localStorage.setItem('externalId', externalId)

				if (this.getParameter('user_ids') && this.getParameter('user_ids') != '' && this.getParameter('custom_id') && this.getParameter('custom_id') != '') {
					try {
						uni.setStorageSync('custom_id', this.getParameter('custom_id'));
						uni.setStorageSync('user_ids', this.getParameter('user_ids'));
						uni.setStorageSync('show_status', this.getParameter('show_status'));
						uni.setStorageSync('show_project', this.getParameter('show_project'));
					} catch (e) {
						// error
					}
				}

				uni.navigateTo({
					url: "/pages/customDetail/todoDetail?id=" + id + '&external_userid=' + externalId + '&user_id=' + user_id + '&corpid=' + localStorage.getItem('corpid') + '&type=1'
				});
			},
			//项目跟进
			openAddProject (id, title, time, status_id, per, last_days, task_id, external_userid, sea_id) {
				this.cid = id
				this.addName = title
				this.finishTime = time
				this.addId = status_id
				this.restDay = last_days
				for (let i = 0; i < this.statusList2.length; i++) {
					if (this.statusList2[i].id == status_id) {
						this.statusIndex = i
						break
					}
				}
				this.lastPer = per
				this.task_id = task_id
				this.external_userid = external_userid
				this.sea_id = sea_id
				this.$refs['addProjectVisible'].open()
			},
			async addProject () {
				if (this.addId == '') {
					uni.showToast({
						title   : '请选择项目状态！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.process == '') {
					uni.showToast({
						title   : '请填写项目进度！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				let reg = /^(?:0|[1-9][0-9]?|100)$/
				if (this.process == null || this.process == '') {
					uni.showToast({
						title   : '请填写项目进度！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.process != null && this.process != '' && (this.process < 0 || this.process > 100 || !reg.test(this.process))) {
					uni.showToast({
						title   : '项目进度必须为0-100正整数！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.instructions == '') {
					uni.showToast({
						title   : '进度说明不能为空！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				const {data: res} = await this.axios.post("wait-project/add-project-status", {
					uid            : localStorage.getItem('uid'),
					id             : this.cid,
					per_desc       : this.instructions,
					status         : this.addId,
					per            : this.process,
					task_id        : this.task_id,
					external_userid: this.external_userid,
					sea_id         : this.sea_id,
				})

				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.cancel('addProjectVisible')
					this.getData()
				}
			},
			//修改项目状态
			bindPickerChange: function (e) {
				this.statusIndex = e.detail.value
				this.addId = Number(this.statusList2[this.statusIndex].id)
			},
			cancel (type) {
				this.$refs[type].close()
				this.addName = ''
				this.finishTime = ''
				this.process = ''
				this.instructions = ''
				this.lastPer = ''
				this.cid = ''
				this.restDay = ''
				this.addId = ''
			},
		},
	}
</script>

<style scoped>
	page {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #F6F6F6;
	}

	.todoBox {
		background: #F6F6F6;
		text-align: left;
		font-size: 0.8rem /* 15/18.75 */;
		height: 100%;
	}

	.fix-status-box {
		white-space: nowrap;
		padding: 0.533rem;
		background: rgb(255, 255, 255);
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 999;
	}

	.fix-box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9;
		overflow: hidden;
		height: 2.207rem /* 47/18.75 */;
		/*box-shadow: 0 0.053rem !* 1/18.75 *! 0.213rem !* 4/18.75 *! 0 rgba(0, 0, 0, 0.08);*/
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	.todo-content {
		text-align: left;
		width: 18.933rem /* 355/18.75 */;
		margin: 2.667rem /* 50/18.75 */ auto 3.2rem /* 60/18.75 */;
		overflow: auto;
	}

	.todo-box {
		background: #FFFFFF;
		border-radius: 0.267rem /* 5/18.75 */;
		padding: 0.64rem /* 12/18.75 */;
		margin: 0.64rem /* 12/18.75 */ 0;
		box-shadow: 0 0.053rem /* 1/18.75 */ 0.213rem /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);
	}

	.todo-box-head {
		overflow: hidden;
		border-bottom: 0.053rem /* 1/18.75 */ solid #F6F6F6;
		padding-bottom: 0.64rem /* 12/18.75 */;
		margin-bottom: 0.8rem /* 15/18.75 */;
	}

	.todo-box-head-tag {
		color: #FFF;
		margin: 0 0.427rem /* 8/18.75 */ 0 0;
		display: inline-block;
		max-width: 5.333rem /* 100/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid;
		border-radius: 0.213rem /* 4/18.75 */;
		padding: 0.053rem /* 1/18.75 */ 0.267rem /* 5/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
	}

	.todo-box-head-title {
		font-size: 0.8rem /* 15/18.75 */;
		color: #333;
		line-height: 1.173rem /* 22/18.75 */;
		float: left;
		width: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		font-weight: bold;
	}

	.todo-box-body {
		font-size: 0.693rem /* 13/18.75 */;
		color: #999;
	}

	.todo-box-body-txt {
		margin-bottom: 0.48rem /* 9/18.75 */;
		overflow: hidden;
	}

	.todo-box-body-btn {
		/*width: 4.053rem !* 76/18.75 *!;*/
		background: #5283EC;
		display: inline-block;
		font-size: 0.64rem /* 12/18.75 */;
		margin-left: 0.64rem /* 12/18.75 */;
	}


	/deep/ .dropdown-item__selected .selected__name {
		font-size: 0.693rem /* 13/18.75 */;
		font-weight: 500;
		color: #999;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.dropdown-item[data-v-aa4f4da6]:not(:last-child):after {
		width: 1px;
	}

	/deep/ .dropdown-item {
		max-width: 50%;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 16rem /* 300/18.75 */;
		background-color: #FFF;
		border-radius: 4px;
		/*left: 12.5%;*/
		/*position: absolute;*/
		/*top: 15%;*/
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

	.add-project /deep/ .uni-tip {
		width: 100%;
		border-radius: 5px 5px 0 0;
	}

	/deep/ .uni-input {
		margin: 0 5px 0 0;
	}

	.add-project-cancal {
		width: 6.4rem /* 120/18.75 */;
		line-height: 2.24rem /* 42/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid #EEEEEE;
		border-radius: 0.267rem /* 5/18.75 */;
		text-align: center;
		margin-right: 0.48rem /* 9/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		color: #333;
	}

	.add-project-ok {
		width: calc(100% - 6.88rem /* 129/18.75 */);
		line-height: 2.24rem /* 42/18.75 */;
		border-radius: 0.267rem /* 5/18.75 */;
		text-align: center;
		background: #5283EC;
		font-size: 0.8rem /* 15/18.75 */;
		color: #FFF;
	}

	.add-project-textareea {
		border: 0.053rem /* 1/18.75 */ solid #EEE;
		margin-top: 0.8rem /* 15/18.75 */;
		padding: 0.533rem /* 10/18.75 */;
		box-sizing: border-box;
		font-size: 0.693rem /* 13/18.75 */;
		width: 100%;
	}

	.add-project-textareea /deep/ .uni-textarea-placeholder {
		font-size: 0.693rem /* 13/18.75 */;
	}

	.list-hd-content {
		padding-left: 0.533rem /* 10/18.75 */;
		width: calc(100% - 2.4rem /* 45/18.75 */);
		float: left;
		box-sizing: border-box;
	}

	.list-hd-content-name {
		color: #333;
		font-size: 0.8rem /* 15/18.75 */;
		/*white-space: nowrap;*/
		/*text-overflow: ellipsis;*/
		overflow: hidden;
		/*word-break: break-all;*/
		display: flex;
		align-items: center;
	}

	.list-hd-content-tag {
		background: #E7EFFC;
		color: #5283EC;
		border-radius: 0.267rem /* 5/18.75 */;
		height: 0.853rem /* 16/18.75 */;
		margin-right: 0.267rem /* 5/18.75 */;
		padding: 0.16rem /* 3/18.75 */ 0.427rem /* 8/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
	}

	.todo-box-body-txt-left {
		width: 5.333rem;
		display: inline-block;
	}

	/deep/ .uni-input {
		border-color: #F6F6F6;
	}

	/deep/ .uni-input-placeholder {
		color: #CCC;
	}


	.choose-tags {
		float: left;
		width: 33.33%;
		line-height: 2.587rem /* 48.5/18.75 */;
		text-align: center;
		font-size: 0.693rem /* 13/18.75 */;
		color: #999;
		position: relative;
		font-weight: 500;
		background: #FFF;
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

	/deep/ .dropdown-item__selected .selected__icon.down {
		color: #999;
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