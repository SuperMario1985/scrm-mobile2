<template>
	<view class="member_data_container">
		<root-font-size ref="fontSize1"/>
		<view class="top" v-if="!showChooseDepartment">
			<view class="header">
				<view>
					<view>
						<uni-icons  @click="goBack()" type="arrowleft"
						           style=" font-size:0.8rem;color: #FFF;margin-left: 0.373rem"></uni-icons>
						<text class="data">成员联系客户统计</text>
					</view>
				</view>
			</view>
			<view>
				<view style="display: flex;align-items: center;height: 2.533rem;color: #999;background: #FFF;z-index: 160">
					<view v-show="show==0" @click="chooseStaff"
					      style="cursor: pointer;padding: 0.2rem 0;line-height: 2.133rem;flex-grow: 1;text-align: center;font-weight: bold;font-size: 0.747rem;">
						<text v-if="userCount == 0" style="cursor: pointer">选择成员</text>
						<text v-if="userCount > 0">{{userCount}}个成员</text>
						<uni-icons type="arrowdown"
						           style="font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
					</view>
					<ms-dropdown-menu style="
						font-size: 0.747rem;
						flex-grow: 1;;
						padding: 0.2rem 0;
						height: 2.133rem;
						color: #333333; ">
						<ms-dropdown-item
								style="height: 2.133rem;line-height: 2.133rem;font-size: 0.747rem;display: flex;align-items: center; justify-content:center;font-weight: bold;color: #999;"
								:hasSlot="true" :title="timeName" ref="dropdownItemD">
							<view class="dropdown-item-content"
							      style="z-index: 99999999999;line-height: 2.133rem;text-align: center">
								<!--								<view :id="dateIndex===0 ? 'ChangeColor' : ''" @click="today(),changeDateIndex(0,'今日')">今日-->
								<!--								</view>-->
								<view :id="dateIndex===1 ? 'ChangeColor' : ''" @click="ysd(),changeDateIndex(1,'昨日')">昨日
								</view>
								<view :id="dateIndex===2 ? 'ChangeColor' : ''"
								      @click="lastWD(),changeDateIndex(2,'近七天')">近七天
								</view>
								<view :id="dateIndex===3 ? 'ChangeColor' : ''"
								      @click="lastMD(),changeDateIndex(3,'近三十天')">近三十天
								</view>
								<view :id="dateIndex===4 ? 'ChangeColor' : ''"
								      @click="onShowDatePicker('range'),changeDateIndex(4)">自定义时间
								</view>
							</view>
						</ms-dropdown-item>
					</ms-dropdown-menu>
				</view>

			</view>
		</view>
		<!--列表-->
		<scroll-view
			             style="top: 4.932rem; left: 0; right: 0; bottom: 0; position: fixed;"
			             @scrolltolower="loadMore"
			             :scroll-x="false"
			             :scroll-y="true" v-if="!showChooseDepartment">
				<view style="position: relative;">
					<view class="left" style="z-index: 50; position: absolute;top: 0;left: 0;">
						<view class="th"
						      style="position: fixed;display: flex;z-index: 10;justify-content: center">成员
						</view>
						<view style="position: relative;top: 1.6rem; margin-bottom: 1.6rem;">
							<view class="item" v-for="(item,index) in userInfo" :key="index">
								<view class="title">
									<text>{{ item.name }}</text>
								</view>
								<view class="content">{{ item.departName }}
								</view>
							</view>
						</view>
					</view>
					<view class="right" style="z-index: 30;">
						<scroll-view
								ref="scrollBox"
								class="scroll-view_H "
								:scroll-x="true"
								@scroll="scroll"
								scroll-left="6.88rem">
							<view class="scroll_left"
							      style="width:27.52rem;z-index: 30; position: fixed;
							      display: flex;left: 6.88rem;background: rgb(243, 243, 247)">
								<view style="align-items: center;display: flex;">
									<view class="thB">新增客户数</view>
									<view class="thB">发起申请数</view>
									<view class="thB">客户删除/拉黑数</view>
									<view class="thB">客户总数</view>
								</view>
							</view>

							<view ref="memberDataContent"
							      style="width:27.52rem; z-index: 0;position: relative;top: 1.6rem; margin-bottom: 1.6rem; background: #FFF">
								<view v-for="(item,index) in userInfo" :key="index"
								      style="align-items: center;display: flex;">
									<view class="thcon">{{item.new_contact_cnt_snum}}</view>
									<view class="thcon">{{item.new_apply_cnt_snum}}</view>
									<view class="thcon">{{item.negative_feedback_cnt_snum}}</view>
									<view class="thcon">{{item.custom_snum}}</view>
								</view>
							</view>
						</scroll-view>
					</view>

				</view>
				<view class="custom-tabs-loading" v-if="userInfo.length > 0">{{loadingText}}</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
			</scroll-view>
		<mx-date-picker :showTips="true" format="yyyy-mm-dd" :show="showPicker" :type="dtype"
		                :value="value"
		                :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true"
		                @confirm="onSelected" @cancel="onSelected"/>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>
	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";

	/**
	 * 获取本周、本季度、本月、上月的开始日期、结束日期
	 */
	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay(); //今天本周的第几天
	var nowDay = now.getDate(); //当前日
	var nowMonth = now.getMonth(); //当前月
	var nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	var lastMonthDate = new Date(); //上月日期
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	var lastYear = lastMonthDate.getYear();
	var lastMonth = lastMonthDate.getMonth();

	//格式化日期：yyyy-MM-dd
	function formatDate (date) {
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();

		if (mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if (myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		return (myyear + "-" + mymonth + "-" + myweekday);
	}

	//获得某月的天数
	function getMonthDays (myMonth) {
		var monthStartDate = new Date(nowYear, myMonth, 1);
		var monthEndDate = new Date(nowYear, myMonth + 1, 1);
		var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
		return days;
	}

	//获得本季度的开始月份
	function getQuarterStartMonth () {
		var quarterStartMonth = 0;
		if (nowMonth < 3) {
			quarterStartMonth = 0;
		}
		if (2 < nowMonth && nowMonth < 6) {
			quarterStartMonth = 3;
		}
		if (5 < nowMonth && nowMonth < 9) {
			quarterStartMonth = 6;
		}
		if (nowMonth > 8) {
			quarterStartMonth = 9;
		}
		return quarterStartMonth;
	}

	//获得本周的开始日期
	function getWeekStartDate () {
		if (nowDayOfWeek == 0) {
			nowDayOfWeek = 7
		}
		var weekStartDate = new Date(nowYear, nowMonth, nowDay + 1 - nowDayOfWeek);
		return formatDate(weekStartDate);
	}

	//获得本周的结束日期
	function getWeekEndDate () {
		var weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
		return formatDate(weekEndDate);
	}


	//获得本月的开始日期
	function getMonthStartDate () {
		var monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDate(monthStartDate);
	}


	//获得本月的结束日期
	function getMonthEndDate () {
		var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
		return formatDate(monthEndDate);
	}

	//获得上月开始时间
	function getLastMonthStartDate () {
		var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
		if(lastMonth == 11) {
			lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
		}
		return formatDate(lastMonthStartDate);
	}

	//获得上月结束时间
	function getLastMonthEndDate () {
		var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
		if(lastMonth == 11) {
			lastMonthEndDate = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth));
		}
		return formatDate(lastMonthEndDate);
	}


	//获取系统当前时间
	var nowdate = new Date();
	var y = nowdate.getFullYear();
	var m = nowdate.getMonth() + 1;
	var d = nowdate.getDate();
	var formatnowdate = y + '-' + m + '-' + d;
	//获取过去一周的时间
	var myDate = new Date();
	var weekDate = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000);// 计算开始时间用
	var weekDate2 = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000);// 计算结束时间用

	var day = weekDate.getDay();
	var time = weekDate.getDate() - day + (day === 0 ? -6 : 1);

	var startDate = new Date(weekDate.setDate(time));
	var beginTime = startDate.getFullYear() + '-' + ((startDate.getMonth() + 1) < 10 ? ('0' + (startDate.getMonth() + 1)) : (startDate.getMonth() + 1)) + '-' + (startDate.getDate() < 10 ? ('0' + startDate.getDate()) : startDate.getDate());
	var endDate = new Date(weekDate2.setDate(time + 6));
	var endTime = endDate.getFullYear() + '-' + ((endDate.getMonth() + 1) < 10 ? ('0' + (endDate.getMonth() + 1)) : (endDate.getMonth() + 1)) + '-' + (endDate.getDate() < 10 ? ('0' + endDate.getDate()) : endDate.getDate());


	function now_date (month) {
		var date1 = new Date()
		let m = (date1.getMonth() + 1)
		m = m < 10 ? ('0' + m) : m;
		let d = date1.getDate()
		d = d < 10 ? ('0' + d) : d;
		var time1 = date1.getFullYear() + "-" + m + "-" + d;
		// var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
		var date2 = new Date(date1);
		var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + (date2.getDate());
		return time1
	}

	function fun_date (day) {
		var date1 = new Date()
		var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
		var date2 = new Date(date1);
		date2.setDate(date1.getDate() - day);
		// date2.setDate(date1.getDate()-oneDay); // 1天前
		// date2.setDate(date1.getDate()-week); // 7天前
		let m = (date2.getMonth() + 1)
		m = m < 10 ? ('0' + m) : m;
		let d = date2.getDate()
		d = d < 10 ? ('0' + d) : d;
		var time2 = date2.getFullYear() + "-" + m + "-" + d;
		return time2
	}

	export default {
		name         : "member_data",
		inject       : ['initPage', 'getParameter'],
		data () {
			return {
				fontSize     : 0,
				timeName     : '近七天',
				show         : null,
				count        : 0,
				loadingText  : '加载中...',
				isLoading    : true,
				isReady      : false,
				userInfo     : [],
				dateIndex    : 2,
				page         : 1,
				s_date       : fun_date(7),
				e_date       : fun_date(1),
				user_ids     : [],
				userCount    : 0,//选择的成员数量
				//	日期计算
				range        : [],
				dtype        : 'range',
				value        : '',
				showPicker   : false,
				// 	year             : gety(12), // 12月前
				yesterday    : fun_date(1), // 一天前日期
				months       : fun_date(30), // 30天前日期
				nowDay       : now_date(), // 当前日期
				weekDay      : fun_date(7), // 7天前日期
				//上周日期
				last_week_s  : beginTime,
				last_week_e  : endTime,
				//本周日期
				week_s       : getWeekStartDate(),
				week_e       : now_date(),
				//上月日期
				last_month_s : getLastMonthStartDate(),
				last_month_e : getLastMonthEndDate(),
				//本月日期
				month_s      : getMonthStartDate(),
				month_e      : getMonthEndDate(),
				scrollTop    : 0,
				old          : {
					scrollTop: 0
				},
				scrollTimeout: '',
				showChooseDepartment  : false,//选择成员组件的显示与隐藏
				selectDepartment      : [],//已选择的成员
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad       : function () {
			let corpId = localStorage.getItem('corpid')
			if (corpId == null) {
				corpId = this.getParameter('corpId')
			}

			if (corpId != null) {
				localStorage.setItem('corpid', corpId)
			}

			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.getMemberData()

			this.$nextTick(() => {
				this.fontSize = document.getElementsByTagName('html')[0].style.fontSize
				this.fontSize = parseInt(this.fontSize.substring(0, this.fontSize.length - 2))
			})

			if (localStorage.getItem('uid') != null) {
				this.init()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.init)
				})
			}

		},
		onReachBottom: function () {
			if (this.userInfo.length < this.count) {
				this.page += 1
				this.getMemberData(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		methods      : {
			init () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.getMemberData()
			},
			loadMore (e) {
				if (!this.isLoading) {
					this.isLoading = true;
					if (this.userInfo.length < this.count) {
						this.page += 1
						this.getMemberData(this.page)
					} else {
						this.loadingText = '已加载全部'
					}
				}
			},
			scroll: function (e) {
				clearTimeout(this.scrollTimeout)
				this.old.scrollTop = e.detail.scrollTop
				let currentLeft = e.detail.scrollLeft
				document.getElementsByClassName('scroll_left')[0].style.left = (6.88 - currentLeft / 18.75) + 'rem'

				this.scrollTimeout = setTimeout(() => {
					let checkLeft = this.$refs.scrollBox.$el.children[0].children[0].scrollLeft
					if (checkLeft != currentLeft) {
						document.getElementsByClassName('scroll_left')[0].style.left = (6.88 - checkLeft / 18.75) + 'rem'
					}
				}, 50)
			},
			goTop : function (e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function () {
					this.scrollTop = 0
				});
				uni.showToast({
					icon : "none",
					title: "纵向滚动 scrollTop 值已被修改为 0"
				})
			},
			changeDateIndex (index, timeName) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					this.range = []
					if (index != 4) {
						this.timeName = timeName
					}
				}
				this.page = 1
				this.loadingText = '加载中...'
				// this.$refs.dropdownItemD.closePopup()
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
					this.getMemberData()
				}
			},
			goBack () {
				this.selectDepartment = []
				let userIdx = localStorage.getItem('tab2') !== null ? localStorage.getItem('tab2') : 0
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				let url = this.$store.state.h5Url + '/h5/pages/scrm/contents?tax=0&uix=' + userIdx + '&agent_id=' + agent_id
				window.location.href = url
				// uni.navigateBack()
				uni.reLaunch({
					url: '/pages/scrm/contents'
				});
			},
			async getMemberData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				this.user_ids = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.user_ids.push(this.selectDepartment[i].id)
					}
				}
				const {data: res} = await this.axios.post('wap-user-desktop/work-user-custom-num-list', {
					corp_id : localStorage.getItem('corpid'),
					user_id : localStorage.getItem('user_id'),
					user_ids: this.user_ids,
					s_date  : this.s_date,
					e_date  : this.e_date,
					page    : page,
					pageSize: 15,
				})
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
					this.isLoading = false
				} else {
					this.isReady = true
					uni.hideLoading();
					this.show = res.data.show
					this.userCount = res.data.user_count
					this.isReady = true
					this.page = page
					this.count = res.data.count
					if (this.page == 1) {
						this.userInfo = res.data.list
					} else {
						this.userInfo = this.userInfo.concat(res.data.list)
					}

					this.isLoading = false
					if (this.userInfo.length == this.count) {
						this.isLoading = true
						this.loadingText = '已加载全部'
					}

				}

			},
			//		定义时间
			//		近七天
			lastWD () {
				this.s_date = this.weekDay
				this.e_date = this.yesterday
				this.getMemberData()
				this.$refs.dropdownItemD.closePopup()
			},
			//今日
			today () {
				this.s_date = this.nowDay
				this.e_date = this.nowDay
				this.getMemberData()
				this.$refs.dropdownItemD.closePopup()
			},
			//昨日
			ysd () {
				this.s_date = this.yesterday
				this.e_date = this.yesterday
				this.getMemberData()
				this.$refs.dropdownItemD.closePopup()
			},
			//		近三十天
			lastMD () {
				this.s_date = this.months
				this.e_date = this.yesterday
				this.getMemberData()
				this.$refs.dropdownItemD.closePopup()
			},
			onShowDatePicker (type) {//显示
				this.dtype = type;
				this.showPicker = true;
				this.value = this[type]
			},
			onSelected (e) {//选择
				this.showPicker = false;
				if (e) {
					this[this.dtype] = e.value;
					if (this.range.length > 0) {
						this.s_date = this.range[0]
						this.e_date = this.range[1]
						this.timeName = this.s_date + '-' + this.e_date
						this.page = 1
						this.loadingText = '加载中...'
						this.getMemberData()
					}
					this.$refs.dropdownItemD.closePopup()
				}
			},
		},
		components   : {
			msDropdownMenu,
			msDropdownItem,
			MxDatePicker,
			Footer,
			ChooseDepartment
		}
	}
</script>

<style scoped lang="less">
	.member_data_container {
		overflow-y: auto;
		z-index: 11;
		box-sizing: border-box;

		.top {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			/*overflow-y: auto;*/
			z-index: 160;
			background: #FFF;
		}

		.header {
			height: 2.4rem;
			background: #01B065;
			text-align: left;

			.data {
				font-size: 0.8rem;
				font-weight: 500;
				color: #FFF;
				line-height: 2.4rem;
				text-align: center;
				margin-left: 0.533rem;
			}


		}

		#ChangeColor {
			color: #01B065;
		}

		/deep/ .dropdown-item__selected {
			padding: 0;
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.693rem
		}

		/deep/ .iconfont {
			font-size: 0.693rem
		}

		.left {
			width: 6.88rem;
			float: left;
			box-shadow: 0.107rem 0px 0.32rem rgba(31, 34, 41, 0.08);
			z-index: 9;
		}

		.right {
			/*width:100%;*/
			height: 100%;
			margin-left: 6.88rem /* 129/18.75 */;
			/*overflow-x: scroll;*/
			/*background: #A9BFF4;*/
		}

		.th {
			display: inline-block;
			width: 6.88rem;
			font-size: 0.64rem /* 12/18.75 */;
			color: #7A7A7A;
			line-height: 1.6rem /* 30/18.75 */;
			height: 1.6rem /* 30/18.75 */;
			background: #F3F3F7;
		}

		.thB {
			display: flex;
			width: 6.88rem;
			font-size: 0.64rem /* 12/18.75 */;
			color: #7A7A7A;
			line-height: 1.6rem /* 30/18.75 */;
			height: 1.6rem /* 30/18.75 */;
			background: #F3F3F7;
			text-align: center;
			align-items: center;
			justify-content: center;
		}

		.thcon {
			display: flex;
			width: 6.88rem;
			font-size: 0.747rem;
			height: 2.667rem /* 50/18.75 */;
			background: #FFF;
			border-bottom: 0.053rem solid rgba(243, 243, 247, 1);
			align-items: center;
			justify-content: center;
		}

		.title {
			font-size: 0.693rem /* 13/18.75 */;
			line-height: 1.3rem /* 30/18.75 */;
			padding-top: 0.213rem;
			color: rgba(51, 51, 51, 1);
			width: 5.333rem;
			overflow: hidden;
			white-space: nowrap;
			word-break: break-all;
			text-overflow: ellipsis;
			text-align: left;
		}

		.content {
			font-size: 0.587rem /* 11/18.75 */;
			font-weight: 500;
			text-align: left;
			color: rgba(153, 153, 153, 1);
			width: 5.333rem;
			overflow: hidden;
			white-space: nowrap;
			/*word-break:break-all;*/
			text-overflow: ellipsis;
			line-height: 1.067rem /* 20/18.75 */;
		}

		.item {
			height: 2.667rem /* 50/18.75 */;
			padding-left: 0.747rem;
			background: rgba(255, 255, 255, 1);
			border-bottom: 0.053rem solid rgba(243, 243, 247, 1);
			/*border-right: 0.053rem solid rgba(243, 243, 247, 1);*/
		}

		.custom-tabs-loading {
			text-align: center;
			line-height: 1.6rem;
			font-size: 0.693rem;
			color: #CCC;
		}

		/deep/ .dropdown-item:not(:last-child):after {
			width: 0;
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
			max-width: 3.733rem;
		}

		/deep/ .dropdown-item__content .list.show {
			z-index: 150;
		}

		.scroll-view_H {
			/deep/ .uni-scroll-view-content {
				display: inline-block;
			}
		}

		.scroll_left {
			transition: left 50ms;
		}
	}
</style>