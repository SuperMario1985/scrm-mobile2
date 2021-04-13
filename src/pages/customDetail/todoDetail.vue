<template>
	<view class="todoDetailbox" v-show="isReady"  :class="wosScroll">
		<uni-nav-bar left-icon="back" title="待办详情" @clickLeft="goBack"
		             style="position: fixed;top: 0;z-index: 999;" background-color="rgba(82, 132, 236, 1)"
		             color="#fff"></uni-nav-bar>
		<view class="introduce">
			<view class="introduce-title">{{detailRecord.title}}</view>
			<view class="introduce-choose" style="margin-bottom: 0.533rem  /* 10/18.75 */;">
				<text class="status-tag"
				      :style="{'color':detailRecord.status_color,'border-color':detailRecord.status_color}">
					{{detailRecord.status_title}}
				</text>
				<text style="margin-left: 0.533rem  /* 10/18.75 */;" v-if="detailRecord.is_finish != 0">
					{{detailRecord.finish_time}}
					<text v-if="detailRecord.is_finish == 0">（还有{{detailRecord.last_days}}天）</text>
					<text v-if="detailRecord.is_finish == 2">（超时{{detailRecord.delay_days}}天）</text>
					<text v-if="detailRecord.is_finish == 3">（提前{{detailRecord.pre_days}}天）</text>
				</text>
			</view>
			<view class="introduce-choose">
				<text class="introduce-choose-left">项目处理人</text>
				<text class="introduce-choose-right">{{detailRecord.leader}}</text>
			</view>
			<view class="introduce-choose">
				<text class="introduce-choose-left">项目优先级</text>
				<text class="introduce-choose-right" :style="{'color':detailRecord.level_color}">
					{{detailRecord.level}}
				</text>
			</view>
			<view class="introduce-choose">
				<text class="introduce-choose-left">预计截止时间</text>
				<text class="introduce-choose-right" v-if="detailRecord.end_time != ''">{{detailRecord.end_time}}</text>
				<text class="introduce-choose-right" v-else>--</text>
			</view>
			<view class="introduce-choose">
				<text class="introduce-choose-left">项目开始时间</text>
				<text class="introduce-choose-right">{{detailRecord.start_time}}</text>
			</view>
			<view class="introduce-choose">
				<text class="introduce-choose-left">待办项目描述</text>
				<text class="introduce-choose-right" v-if="detailRecord.desc != ''"
				      style="line-height: 0.853rem  /* 16/18.75 */;">
					{{detailRecord.desc}}
				</text>
				<text class="introduce-choose-right" v-else>--</text>
			</view>
		</view>
		<view class="process">
			<view class="process-title">项目进程</view>
			<view class="process-box">
				<view class="process-empty-box">
					<image class="process-empty"
					       src="../../static/highSeasCustomer/empty.png" v-if="processList.length == 0"></image>
				</view>
				<uni-steps :options="processList" direction="column" v-if="processList.length > 0"
				           :type="3"></uni-steps>
			</view>
		</view>
		<view class="process-loading" v-if="processList.length > 0">{{loadingText}}</view>
		<Footer v-show="is_show_copyright == 1" v-if="processList.length == 0" style="position: absolute;bottom: 0;left: 0;right: 0;"></Footer>
		<Footer v-show="is_show_copyright == 1" v-else></Footer>
		<drag-button
				:isDock="true"
				:existTabBar="true"
				@btnClick="getprojectList('addVisible',detailRecord.status_id,detailRecord.per)" :content="addBtnImg"
				v-if="detailRecord.can_edit == 1 && detailRecord.is_finish == 0"/>
		<!--新增项目跟进弹窗-->
		<uni-popup ref="addVisible" type="bottom" :mask-click="false" class="add-project">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					添加项目跟进
				</text>
				<scroll-view scroll-y="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;height: 20rem  /* 375/18.75 */;overflow-y: auto;">
					<view style="line-height: 3.733rem  /* 70/18.75 */;color: #333333;font-size: 0.853rem  /* 16/18.75 */;font-weight: 700;text-align: left;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;">
						<text style="width: 0.16rem  /* 3/18.75 */;height: 0.72rem  /* 13.5/18.75 */;display: inline-block;background: #5283EC;margin-right: 0.427rem  /* 8/18.75 */;"></text>
						{{detailRecord.title}}
					</view>
					<view style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;">
						<view>
							<text style="font-weight: 700;">预计结束时间：</text>
							<text class="introduce-choose-right">{{detailRecord.end_time}}
								<text v-if="detailRecord.is_finish == 0">（还有{{detailRecord.last_days}}天）</text>
								<text v-if="detailRecord.is_finish == 2">（超时{{detailRecord.delay_days}}天）</text>
								<text v-if="detailRecord.is_finish == 3">（提前{{detailRecord.pre_days}}天）</text>
							</text>
						</view>
						<view v-if="projectList.length > 0" style="margin-top: 0.8rem  /* 15/18.75 */;">
							<text style="color: red;">*</text>
							<text style="font-weight: 700;">项目状态：</text>
							<picker @change="changeStatus" :value="projectIndex" :range="projectList"
							        range-key="title"
							        style="width: calc(100% - 4.667rem  /* 87.5/18.75 */);display: inline-block;">
								<view class="uni-input" style="font-size: 0.64rem  /* 12/18.75 */;">
									{{projectList[projectIndex].title}}
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
							       v-model="close_rate" placeholder="请输入进度"/>
							<span style="vertical-align: sub;">%</span>
							<span style="vertical-align: sub;color: #FF2438;margin-left: 0.533rem  /* 10/18.75 */;">上次进度在{{lastPer}}%</span>
						</view>
						<view style="margin-top: 0.8rem  /* 15/18.75 */;">
							<text style="color: red;">*</text>
							<text style="font-weight: 700;">进度说明：</text>
							<textarea placeholder="请输入进度说明，200字以内" maxlength="200"
							          v-model="msg" class="add-project-textareea"/>
						</view>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" @click="cancel('addVisible')">取消</text>
					<text class="add-project-ok" @click="addBtn">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Footer from "../../components/footer/footer.vue";

	export default {
		name         : "todoDetail",
		inject       : ['initPage', 'getParameter'],
		components  : {Footer},
		data () {
			return {
				wosScroll      : "wos-scroll-yes",
				isReady     : false,
				processList : [],//项目进程列表
				loadingText : '加载中...',
				page        : 1,//页码
				count       : '',//项目进程列表总数
				detailRecord: {},//详情数据
				addBtnImg   : '../../static/customDetail/addProject.png',//新建悬浮按钮
				msg         : '',//进度说明
				status      : 1,//选中的项目状态id
				close_rate  : '',//项目进度
				projectIndex: 0,//选中的项目状态index
				projectList : [],//项目状态列表
				lastPer     : 0,//上次进度
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onReachBottom: function () {
			if (this.processList.length < this.count) {
				this.page += 1
				this.getProcessList(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		onLoad () {
			uni.setNavigationBarTitle({
				title: '待办详情'
			});
			let corpId = localStorage.getItem('corpid')
			if (corpId == null) {
				corpId = this.getParameter('corpid')
			}

			if (corpId != null) {
				localStorage.setItem('corpid', corpId)
			}

			// localStorage.setItem('uid', 2)
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('user_id', 'liyunli')
			// this.init()

			if (localStorage.getItem('uid') != null) {
				this.init()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.init)
				})
			}
		},
		methods      : {
			init () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.getProcessDetail()
			},
			//获取上半部详情信息
			async getProcessDetail () {
				const {data: res} = await this.axios.post("wait-project/wait-detail", {
					uid    : localStorage.getItem('uid'),
					id     : this.getParameter('id') != null ? this.getParameter('id') : '',
					corp_id: localStorage.getItem('corpid'),
					userid : localStorage.getItem('user_id'),
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.detailRecord = res.data
					this.getProcessList()
				}
			},
			//获取项目进程列表数据
			async getProcessList (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wait-project/wait-info", {
					id             : this.getParameter('id') != null ? this.getParameter('id') : '',
					task_id        : this.detailRecord.task_id,
					external_userid: this.detailRecord.external_userid,
					sea_id         : this.detailRecord.sea_id,
					page           : page,
					page_size      : 15,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.count = res.data.count
					this.page = page
					this.isReady = true
					if (page == 1) {
						this.processList = res.data.info
					} else {
						this.processList = this.processList.concat(res.data.info)
					}
					if (this.processList.length < 15) {
						this.loadingText = '已加载全部'
					}
				}
			},
			goBack () {
				uni.navigateBack()
				// if (typeof this.getParameter('type') != 'undefined' && this.getParameter('type') == 1) {
				// 	uni.switchTab({
				// 		url: "/pages/scrm/todo"
				// 	});
				// } else {
				// 	uni.navigateBack()
				// }
			},
			//打开项目跟进弹窗
			//获取项目列表
			async getprojectList (type, id, per) {
				const {data: res} = await this.axios.post(
					"wait-project/common-detail",
					{
						uid: localStorage.getItem("uid"),
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.projectList = []
					for (let j = 1; j < res.data.project_status.length; j++) {
						this.projectList.push(res.data.project_status[j])
					}
					for (let i = 0; i < this.projectList.length; i++) {
						if (this.projectList[i].id == id) {
							this.projectIndex = i
							this.status = id
							break
						}
					}
					if (this.status == '' && this.projectList.length > 0) {
						this.projectIndex = 0
						this.status = Number(this.projectList[0].id)
					}
					this.lastPer = per != null ? per : 0
					this.wosScroll = 'wos-scroll-no'
					this.$refs[type].open()
				}
			},
			cancel (type) {
				this.wosScroll = 'wos-scroll-yes'
				this.$refs[type].close()
				this.status = ''
				this.close_rate = ''
				this.lastPer = 0
				this.msg = ''
			},
			//选择状态
			changeStatus (e) {
				this.projectIndex = e.target.value
				this.status = this.projectList[e.target.value].id
			},
			//确定新增项目跟进
			async addBtn () {
				if (this.status == '') {
					uni.showToast({
						title   : '请选择项目状态！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.close_rate == '') {
					uni.showToast({
						title   : '请填写项目进度！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				let reg = /^(?:0|[1-9][0-9]?|100)$/
				if (this.close_rate == null || this.close_rate == '') {
					uni.showToast({
						title   : '请填写项目进度！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.close_rate != null && this.close_rate != '' && (this.close_rate < 0 || this.close_rate > 100 || !reg.test(this.close_rate))) {
					uni.showToast({
						title   : '项目进度必须为0-100正整数！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.msg == '') {
					uni.showToast({
						title   : '进度说明不能为空！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				const {data: res} = await this.axios.post("wait-project/add-project-status", {
					uid            : localStorage.getItem('uid'),
					id             : this.getParameter('id') != null ? this.getParameter('id') : '',
					per_desc       : this.msg,
					status         : this.status,
					per            : this.close_rate,
					task_id        : this.detailRecord.task_id,
					external_userid: this.detailRecord.external_userid,
					sea_id         : this.detailRecord.sea_id,
				})

				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.cancel('addVisible')
					this.getProcessDetail()
					this.getProcessList()
				}
			},
		}
	}
</script>

<style scoped>
	page {
		position: absolute;
		width: 100%;
		height: 100%;
		background: #F6F6F6;
	}

	.todoDetailbox {
		background: #F6F6F6;
		text-align: left;
		font-size: 0.693rem /* 13/18.75 */;
		overflow-y: auto;
		height: 100%;
	}

	/deep/ .uni-navbar--border {
		border: 0;
	}

	.introduce {
		padding: 0.533rem /* 10/18.75 */ 0.853rem /* 16/18.75 */;
		background: #FFF;
		border-radius: 0.16rem /* 3/18.75 */;
		color: #808080;
		margin: 54px 0.533rem /* 10/18.75 */ 0;
	}

	.status-tag {
		border: 0.053rem /* 1/18.75 */ solid;
		padding: 0.16rem /* 3/18.75 */ 0.267rem /* 5/18.75 */;
		border-radius: 0.32rem /* 6/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
	}

	.introduce-title {
		color: #333;
		font-weight: 700;
		font-size: 0.907rem /* 17/18.75 */;
		margin-bottom: 0.533rem /* 10/18.75 */;
	}

	.introduce-choose {
		line-height: 1.44rem /* 27/18.75 */;
	}

	.introduce-choose-left {
		width: 6.667rem /* 125/18.75 */;
		display: inline-block;
		vertical-align: top;
		color: #999;
	}

	.introduce-choose-right {
		width: calc(100% - 6.667rem /* 125/18.75 */);
		display: inline-block;
		word-break: break-all;
		word-wrap: break-word !important;
		color: #111;
	}

	.process {
		margin-bottom: 0.533rem /* 10/18.75 */;
	}

	.process-title {
		padding: 0.64rem /* 12/18.75 */ 0.853rem /* 16/18.75 */;
		background: #F2F2F3;
		border-radius: 0.16rem /* 3/18.75 */ 0.16rem /* 3/18.75 */ 0rem /* 0/18.75 */ 0rem /* 0/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		margin: 0.533rem /* 10/18.75 */ 0.533rem /* 10/18.75 */ 0;
	}

	.process-box {
		padding: 0 0.853rem /* 16/18.75 */;
		background: #FFF;
		margin: 0 0.533rem /* 10/18.75 */;
		overflow: hidden;
	}

	.process-empty-box {
		text-align: center;
	}

	.process-empty {
		width: 6.507rem /* 122/18.75 */;
		height: 4.053rem /* 76/18.75 */;
		margin: 2.667rem auto;
	}

	.process-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
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

	.add-project /deep/ .uni-tip {
		width: 100%;
		border-radius: 5px 5px 0 0;
	}

	.uni-input {
		height: 28px;
		line-height: 28px;
		font-size: 15px;
		text-align: left;
		border: 1px solid #CCC;
		border-radius: 4px;
		padding: 0 8px;
		margin: 0 5px 0 0;
	}

	/deep/ .uni-input {
		margin: 0 5px 0 0;
		border-color: #F6F6F6;
	}

	/deep/ .uni-input-placeholder {
		color: #CCC;
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

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
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
</style>