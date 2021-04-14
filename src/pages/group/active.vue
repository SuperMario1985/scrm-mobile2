<template>
	<view class="member_container">
		<uni-nav-bar left-icon="back" style="position: fixed; z-index: 9;" title="群活跃排行榜" @clickLeft="back"
		             background-color="#01B065"
		             color="#fff"></uni-nav-bar>
		<!--	 客户客户群切换		-->
		<view class="select-list">
			<!--  选择	-->
			<view class="header" style="background: #FFF">
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
					<view class="time-btn" :class="dateIndex==4 ? 'ChangeColor' : ''"
					      @click="onShowDatePicker('range2')">
						<text v-if="dateIndex == 4 && range2.length == 2">
							{{range2[0]}}~{{range2[1]}}
						</text>
						<text v-else>
							自定义时间
						</text>
						<uni-icons :style="dateIndex == 4 ? {color: '#01B065'} : {color: '#999'}" type="arrowdown"></uni-icons>
					</view>
					<view class="sort-icon">
						<image style="width: 0.693rem  /* 13/18.75 */;height: 0.693rem  /* 13/18.75 */;vertical-align: middle;"
						       src="../../static/scrm/sort.png" @click="showSortPicker"></image>
					</view>
				</view>
				<view style="font-size: 0.693rem  /* 13/18.75 */;text-align: left;padding: 0 0.533rem;color: #FF562D;">
					*活跃指标：每个群成员在社群里发言的总次数
				</view>
			</view>
		</view>
		<view class="group-member">
			<view class="list" @click="goCustomDetail(item.external_userid)" v-for="(item, index) in groupMemberList">
				<view class="user-info">
					<view class="top">TOP{{item.top}}</view>
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
							      style="color: #30AB55;font-size: 0.587rem;line-height: 1.067rem  /* 20/18.75 */; margin-left: 0.267rem  /* 5/18.75 */;">
								@微信
							</text>
							<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
							       src="../../static/scrm/man.png"
							       v-if="item.gender == 1"></image>
							<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
							       src="../../static/scrm/woman.png"
							       v-if="item.gender == 2"></image>
						</view>
						<view>
							<view v-if="item.from_type == 1" class="orange">企业成员</view>
							<view v-if="item.from_type == 2" class="pink">外部联系人</view>
							<view v-if="item.from_type == 3" class="blue">群主</view>
						</view>
					</view>
					<uni-icons type="arrowright" v-if="item.external_userid != ''"
					           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;line-height: 2.4rem  /* 45/18.75 */;"></uni-icons>
				</view>
				<view style="text-align: left; padding-right: 0.533rem  /* 10/18.75 */; margin-left: 4rem  /* 75/18.75 */;margin-top: 0.373rem  /* 7/18.75 */;">
					<view class="join-time">上次活跃：{{item.msgtime}}</view>
					<view class="message-num" style="">
						<uni-icons style="color: #999; font-size: 0.693rem  /* 13/18.75 */;" type="chat"></uni-icons>
						累计{{item.num}}条
					</view>
				</view>
			</view>
			<view v-if="groupMemberList.length != 0" class="loading-text">{{loadingText}}</view>
		</view>
		<img class="empty-img" v-if="groupMemberList.length == 0" src="../../static/scrm/empty.png" alt="" />
		<mx-date-picker :showTips="true" format="yyyy-mm-dd" :show="showPicker" :type="dtype"
		                :value="value"
		                :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true"
		                @confirm="onSelected" @cancel="onSelected"/>
		<uni-popup ref="sortPop" type="center">
			<!--				<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -9.2rem;"-->
			<!--				           color="#bfbabd" @click="closeSortPop"></uni-icons>-->
			<view style="width: 16rem  /* 300/18.75 */;background: #FFF;margin: auto;height: 5.333rem  /* 100/18.75 */;">
				<view style="text-align: left;font-size: 0.747rem  /* 14/18.75 */; border-bottom: 0.053rem  /* 1/18.75 */ solid #CCC;line-height: 2.667rem  /* 50/18.75 */;line-height: 2.667rem  /* 50/18.75 */;padding: 0 0.533rem  /* 10/18.75 */;"
				      @click="changeFrom(1)">
					活跃度高到低
					<uni-icons type="checkmarkempty" size="22" color="#01B065" style="float: right;"
					           v-if="sort == 1"></uni-icons>
				</view>
				<view style="text-align: left; font-size: 0.747rem  /* 14/18.75 */; line-height: 2.667rem  /* 50/18.75 */;line-height: 2.667rem  /* 50/18.75 */;padding: 0 0.533rem  /* 10/18.75 */;"
				      @click="changeFrom(2)">
					活跃度低到高
					<uni-icons type="checkmarkempty" size="22" color="#01B065" style="float: right;"
					           v-if="sort == 2"></uni-icons>
				</view>
			</view>
		</uni-popup>
		<Footer v-show="$store.state.is_show_copyright == 1" style="position: fixed;bottom: 0;left: 0;right: 0;"></Footer>
	</view>

</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import Footer from "../../components/footer/footer.vue";

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
		name         : "active",
		inject       : ['initPage', 'getParameter'],
		data () {
			return {
				outInt         : '', // 成员输入框的延时
				//切换参数
				dateIndex      : 0,
				timeName       : '近七天',//选择时间
				s_date         : fun_date(6),
				e_date         : fun_date(),
				sort           : 1,
				name           : '',
				//	日期计算
				range2         : [],
				dtype          : 'range2',
				value          : '',
				showPicker     : false,
				// 	year             : gety(12), // 12月前
				yesterday      : fun_date(1), // 一天前日期
				months         : fun_date(29), // 29天前日期
				nowDay         : now_date(), // 当前日期
				weekDay        : fun_date(6), // 6天前日期
				groupMemberList: [],
				isReady        : false,
				total          : 0,
				page           : 1,
				loadingText    : '加载中...',
				hideFlag       : false,
			}
		},
		onLoad () {
			this.hideFlag = false
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			this.$store.dispatch('setWx', () => {
				this.initPage(this.initPageNew)
			})

			// localStorage.setItem('uid', 2)
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('user_id', 'LiYunLi')
			// this.$store.state.chatId = 'wriWVTDwAAl45j8dh8rEco5KA2AoWzLw'
			// this.status = 1
			// this.initPageNew()
		},
		onShow() {
			if(this.hideFlag) {
				this.hideFlag = false
				this.getDataInfo()
			}
		},
		onHide() {
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
			initPageNew () {
				this.dateIndex = 1
				this.timeName = '今日'
				this.today()
				this.getDataInfo()
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
						this.timeName = this.s_date + '-' + this.e_date
					}
					this.dateIndex = 4
					this.getDataInfo()
				}
			},

			// 获取成员详情
			async getDataInfo (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post('wap-user-desktop/chat-info-audit', {
					chat_id   : this.getParameter('chat_id') ? this.getParameter('chat_id') : this.$store.state.chatId,
					now_userid: localStorage.getItem('user_id'),
					corp_id   : localStorage.getItem('corpid'),
					stime     : this.s_date ? (this.s_date + ' 00:00') : '',
					etime     : this.e_date ? (this.e_date + ' 23:59') : '',
					sort      : this.sort,
					name      : this.name,
					page      : page,
					page_size : 15,
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
				if(external_userid) {
					uni.navigateTo({
						url: '/pages/customDetail/index?external_userid=' + external_userid + '&source=group' + '&agent_id=' + (this.getParameter('agent_id') ? this.getParameter('agent_id') : this.getParameter('agentId'))
					});
				}
			},
			//排序
			showSortPicker () {
				this.$refs['sortPop'].open()
			},
			changeFrom (sort) {
				this.sort = sort
				this.$refs['sortPop'].close()
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.getDataInfo(1)
			}
		},
		components   : {
			msDropdownMenu,
			msDropdownItem,
			MxDatePicker,
			Footer
		}
	}
</script>

<style scoped lang="less">
	.member_container {
		background: #F1F3F5;
		overflow-y: auto;
	}
	.select-list {
		position: fixed;
		top: 2.347rem;
		box-sizing: border-box;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 0;
		background: #FFF;
		height: 7.352rem;
	}
	.header {
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
	}

	.ChangeColor {
		border: 1px solid #01B065 !important;
		background-color: #FFFFFF;
		/*background: #01B065;*/
		color: #01B065;
	}

	/deep/ .uni-app--showtabbar uni-page-wrapper:after {
		background: #F1F3F5 !important;
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

	.select-time {
		display: flex;
		width:calc(100% - 0.533rem  /* 10/18.75 */);
		margin: 0.6rem 0;
		padding: 0 0.533rem  /* 10/18.75 */;
	}

	.select-name {
		display: inline-block;
		line-height: 1.6rem;
		align-items: center;
		font-size: 0.747rem;
		color: #999;
		width: 100%;
		padding: 0.534rem 0;
		background-color: #01B065;
	}

	.username {
		width: calc(100% - 2.733rem);
		margin-right: 1.1rem /* 15/18.75 */;
		display: inline-block;
		height: 1.6rem;
		line-height: 1.6rem;
		text-align: left;
		border: 1px solid #F1F3F5 !important;
		border-radius: 0.8rem;
		margin-left: 0.533rem /* 10/18.75 */;
		padding: 0 0.8rem;
		vertical-align: middle;
		background-color: #FFF;
	}
	.group-member {
		color: #333333;
		margin-top: 9.755rem;
		background-color: #FFFFFF;
	}
	.list {
		padding: 0.533rem /* 10/18.75 */ 0;
		border-bottom: 1px solid #F1F3F5;
	}
	.user-info {
		min-height: 2.133rem /* 40/18.75 */;
		text-align: left;
		padding: 0.267rem /* 5/18.75 */ 0.533rem /* 10/18.75 */;
	}

	.join_scene {
		width: 60%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		font-size: 0.693rem /* 13/18.75 */;
	}

	.message-num {
		width: 35%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		text-align: right;
		font-size: 0.693rem /* 13/18.75 */;
	}

	.message-icon {
		vertical-align: middle;
		text-align: right;
		width: 0.853rem /* 16/18.75 */;
		height: 0.853rem /* 16/18.75 */;
	}

	.join-time {
		width: 65%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		text-align: left;
		font-size: 0.693rem /* 13/18.75 */;
	}
	.top {
		float: left;
		width: 3.467rem /* 65/18.75 */;
		font-size: 0.853rem /* 16/18.75 */;
		display: inline-block;
		height: 2.667rem /* 50/18.75 */;
		vertical-align: top;
		line-height: 2.667rem /* 50/18.75 */;
	}
	.list-hd-content {
		padding: 0 0.533rem /* 10/18.75 */;
		width: calc(100% - 6.753rem /* 61/18.75 */);
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
	.avatar {
		width: 2.667rem /* 50/18.75 */;
		height: 2.667rem /* 50/18.75 */;
	}

	.user-name {
		font-size: 0.747rem /* 14/18.75 */;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	.user-sex {
		width: 0.853rem /* 16/18.75 */;
		height: 0.693rem /* 13/18.75 */;
		margin-left: 0.267rem /* 5/18.75 */;
	}

	.group-num {
		margin-left: 0.267rem /* 5/18.75 */;
		display: inline-block;
		font-size: 0.693rem /* 13/18.75 */;
		border-radius: 0.213rem /* 4/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid rgba(0, 0, 0, 0.5);
		padding: 0 0.267rem /* 5/18.75 */;
	}

	.gt {
		float: right;
		height: 2.667rem /* 50/18.75 */;
		line-height: 2.667rem /* 50/18.75 */;
		font-size: 1.067rem /* 20/18.75 */;
	}
	.loading-text {
		padding: 0.533rem /* 10/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
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
		color: #01B065;
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
</style>