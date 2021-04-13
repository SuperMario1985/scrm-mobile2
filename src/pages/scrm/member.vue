<template>
	<view class="member_container">
		<!--	 客户客户群切换		-->
		<view class="content_head"
		      style="box-shadow: 0 0.053rem  /* 1/18.75 */ 0.213rem  /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);position: fixed;top:43px;box-sizing: border-box;left: 0;right: 0; z-index: 100;padding: 0.533rem  0 0; background: #FFF;"
		      v-if="!showChooseDepartment">
			<view style="display: flex; line-height: 1.4rem;justify-content: center">
				<button :class="userIndex == 0 ? 'chartColor':''" @click="changeUserIndex(0)" style="width: 4.5rem;
						height: 1.5rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-right: 0;
						margin: 0;
						border-radius: 0;
						font-size: 0.7rem;
						font-weight: 500;
						color: #333333;
						line-height:1.5rem;
						" type="default" plain="">客户
				</button>
				<button :class="userIndex == 1 ? 'chartColor':''" @click="changeUserIndex(1)" style="width: 4.5rem;
						height: 1.5rem;
						background: #FFFFFF;
						border-radius: 0;
						border: 0.053rem solid #EDEDED;
						margin: 0;
						font-size: 0.7rem;
						font-weight: 500;
						color: #333333;
						line-height:1.5rem;
						" type="default" plain="">客户群
				</button>
			</view>

			<!--	nav_tab	-->
			<view class="nav_tab"
			      style="width: 100%; background: #FFF; padding:0.907rem 0.533rem 0.16rem 0.533rem;display: flex;box-sizing: border-box;"
			      v-show="userIndex==0">
				<view class="button-sp-area">
					<view plain="true" class="tab-btn"
					      :class="index == 0 ? 'activity-btn' : ''" @click="changeIndex(0)">发起申请数
					</view>
					<view plain="true" class="tab-btn"
					      :class="index == 1 ? 'activity-btn' : ''" @click="changeIndex(1)">新增客户数
					</view>
					<view plain="true" class="tab-btn"
					      :class="index == 2 ? 'activity-btn' : ''" @click="changeIndex(2)">客户流失数
					</view>
					<view plain="true" class="tab-btn"
					      :class="index == 3 ? 'activity-btn' : ''" @click="changeIndex(3)">累计客户数
					</view>
				</view>
			</view>

			<!--  选择	-->
			<view class="header" style="background: #FFF" v-show="userIndex==0">
				<view style="display: flex;width: 100%;	height: 2.133rem;margin: 0.2rem 0">
					<view v-show="show==0" @click="chooseStaff"
					      style="flex-grow: 1;justify-content:center;display: flex;line-height: 2.133rem;
						align-items: center;font-weight: bold;font-size: 0.747rem;color: #999;">
						<view style="cursor: pointer;font-size: 0.747rem;display: inline-block;">
							<text v-if="userCount == 0" style="cursor: pointer">选择成员</text>
							<text v-if="userCount > 0">{{userCount}}个成员</text>
						</view>
						<uni-icons type="arrowdown"
						           style="font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
					</view>
					<ms-dropdown-menu style="flex-grow: 1;display: flex;
						align-items: center; height: 2.133rem;font-size: 0.747rem;color: #999;">
						<ms-dropdown-item
								style="font-size: 0.747rem;text-align: center;font-weight: bold;"
								:hasSlot="true" :title="timeName" ref="dropdownItemC">
							<view class="dropdown-item-content"
							      style="z-index: 99999999999999999999999999;line-height: 2.133rem;">
								<!--								<view :id="dateIndex==0 ? 'ChangeColor' : ''" @click="today(),changeDateIndex(0,'今日')">-->
								<!--									今日-->
								<!--								</view>-->
								<view :id="dateIndex==1 ? 'ChangeColor' : ''" @click="ysd(),changeDateIndex(1,'昨日')">昨日
								</view>
								<view :id="dateIndex==2 ? 'ChangeColor' : ''"
								      @click="lastWD(),changeDateIndex(2,'近七天')">近七天
								</view>
								<view :id="dateIndex==3 ? 'ChangeColor' : ''"
								      @click="lastMD(),changeDateIndex(3,'近三十天')">近三十天
								</view>
								<view :id="dateIndex==4 ? 'ChangeColor' : ''"
								      @click="onShowDatePicker('range2'),changeDateIndex(4)">自定义时间
								</view>
							</view>
						</ms-dropdown-item>
					</ms-dropdown-menu>
				</view>
			</view>

			<view v-show="userIndex==1">
				<view style="display: flex;width: 100%;	height: 2.133rem;margin-top: 0.3rem">
					<view v-show="show==0" @click="chooseStaff"
					      style="flex-grow: 1;justify-content:center;display: flex;
						align-items: center;font-weight: bold;font-size: 0.747rem;color: #999;">
						<view style="cursor: pointer;font-size: 0.747rem;display: inline-block;">
							<text v-if="userCount == 0" style="cursor: pointer">选择成员</text>
							<text v-if="userCount > 0">{{userCount}}个成员</text>
						</view>
						<uni-icons type="arrowdown"
						           style="font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
					</view>
					<ms-dropdown-menu style="flex-grow: 1;height: 2.133rem;font-size: 0.747rem">
						<ms-dropdown-item
								style="height: 2.133rem;font-size: 0.747rem;text-align: center;font-weight: bold;color: #2C3E50;line-height: 2.133rem;color: #999;"
								:hasSlot="true" :title="timeName" ref="dropdownItemD">
							<view class="dropdown-item-content" style="z-index: 99999999999;">
								<view :id="dateIndex==1 ? 'ChangeColor' : ''" @click="ysd(),changeDateIndex(1,'昨日')">昨日
								</view>
								<view :id="dateIndex==2 ? 'ChangeColor' : ''"
								      @click="lastWD(),changeDateIndex(2,'近七天')">近七天
								</view>
								<view :id="dateIndex==3 ? 'ChangeColor' : ''"
								      @click="lastMD(),changeDateIndex(3,'近三十天')">近三十天
								</view>
								<view :id="dateIndex==4 ? 'ChangeColor' : ''"
								      @click="onShowDatePicker('range2'),changeDateIndex(4)">自定义时间
								</view>
							</view>
						</ms-dropdown-item>
					</ms-dropdown-menu>
				</view>

				<!--	tab栏		-->
				<view class="tab2">
					<view :id="ucount==0 ? 'border':''" @click="changeUCount(0)" class="td">群聊</view>
					<view :id="ucount==1 ? 'border':''" @click="changeUCount(1)" class="td">群成员</view>
					<view :id="ucount==2 ? 'border':''" @click="changeUCount(2)" class="td">群消息</view>
				</view>
			</view>
		</view>

		<!--  成员客户	-->
		<view v-if="userIndex==0 && !showChooseDepartment" style="margin-top: 9.519999rem  /* 180/18.75 */;">
			<view style="background: #F1F3F5;padding-top: 0.533rem" v-if="xarr.length !=0">
				<view class="view_p" style="padding-top: 0.8rem;background: #FFF">Top10</view>
				<!-- 跟进成员柱状图 -->
				<view style="background: #FFF;padding-top: 0.533rem;padding-bottom: 0.8rem">
					<view v-for="(item,index) in barr" :key="index"
					      style="padding: 0 1rem 0;display: flex;justify-content: start">
						<view style="width: 100%">
							<view style="width: 100%;height: 1.067rem;" v-show="titleActive==false">
								<view style="float: left" class="title_style">{{ xarr[index] }}</view>
								<text v-if="data_Type==1" style="float: right" class="font_style">{{
									countArr[index]
									}}次
								</text>
								<text v-if="data_Type==2 || data_Type==3 || data_Type==4" style="float: right"
								      class="font_style">{{ countArr[index] }} 位
								</text>
							</view>
							<view class="text_style">
								<view style="width: 100%;display: flex;justify-content: start">
									<view v-show="item>0" :style="{'width':item+'%'}" class="color"></view>
									<view v-show="item==0" class="item0"></view>
								</view>

							</view>
						</view>
					</view>
				</view>
			</view>

			<view>
				<view class="line">
					<view v-show="index==0" class="view_p">趋势图</view>
					<view v-show="index==1" class="view_p">趋势图</view>
					<view v-show="index==2" class="view_p">趋势图</view>
					<view v-show="index==3" class="view_p">趋势图</view>
				</view>

				<!--	 折线图		-->
				<canvas canvas-id="canvasLineOne" class="charts" @touchstart="touchLineA"></canvas>

				<!--	 详细数据		-->
				<view style="background: #F1F3F5;padding: 0.553rem 0">
					<view style="background: #FFF;text-align: center;" @click="goData">
						<text class="data">客户详细数据</text>
						<uni-icons type="arrowright"
						           style=" font-size:0.8rem;color: #000;margin-left: 0.373rem"></uni-icons>
					</view>
				</view>
			</view>

		</view>
		<!--	客户群	-->
		<view v-if="userIndex==1 && !showChooseDepartment" class="users" style="margin-top: 9.383rem /* 180/18.75 */;">

			<!--	 群聊数量		-->
			<view v-show="ucount==0" class="count_info">
				<view class="sum">
					<view class="item" :id="itemIndex==0 ? 'item_color':''" @click="changeItem(0)">
						<view class="one">群聊总数
						</view>
						<view class="two">{{ suma }}
						</view>
					</view>
					<view class="item" @click="changeItem(1)"
					      :id="itemIndex==1 ? 'item_color':''">
						<view class="one">新增群聊数
						</view>
						<view class="two">{{ sumb }}
						</view>
					</view>
					<view class="item" :id="itemIndex==2 ? 'item_color':''" @click="changeItem(2)">
						<view class="one">有过消息的群聊数
						</view>
						<view class="two">{{ sumc }}
						</view>
					</view>
				</view>
			</view>
			<!--	 群成员		-->
			<view v-show="ucount==1" class="count_info">
				<view class="sum">
					<view class="item" :id="groupIndex==0 ? 'item_color':''" @click="changeGroupItem(0)">
						<view class="one">群成员总数
						</view>
						<view class="two">{{ suma }}
						</view>
					</view>
					<view class="item" @click="changeGroupItem(1)"
					      :id="groupIndex==1 ? 'item_color':''">
						<view class="one">新增群成员数
						</view>
						<view class="two">{{ sumb }}
						</view>
					</view>
					<view class="item" :id="groupIndex==2 ? 'item_color':''" @click="changeGroupItem(2)">
						<view class="one">有过消息的群成员数
						</view>
						<view class="two">{{ sumc }}
						</view>
					</view>
					<view class="item" @click="changeGroupItem(3)"
					      :id="groupIndex==3 ? 'item_color':''">
						<view class="one">退群人数
						</view>
						<view class="two">{{ sumd }}
						</view>
					</view>
				</view>
			</view>
			<!--	 群消息		-->
			<view v-show="ucount==2" class="count_info">
				<view class="sum">
					<view class="item" :id="threeItem==0 ? 'item_color':''" @click="changeThreeItem(0)">
						<view class="one">群聊消息总数
						</view>
						<view class="two">{{ suma }}
						</view>
					</view>
				</view>
			</view>

			<!--	 趋势图		-->
			<view class="lchart">
				<canvas canvas-id="canvasLineTwo" class="charts" ref="getheight" @touchstart="touchLineB"></canvas>
			</view>


			<!--	 详细数据		-->
			<view style="background: #F1F3F5;padding: 0.553rem 0">
				<view style="background: #FFF;text-align: center;" @click="goGroup()">
					<text class="data">客户群详细数据</text>
					<uni-icons type="arrowright"
					           style=" font-size:0.8rem;color: #000;margin-left: 0.373rem"></uni-icons>
				</view>
			</view>
		</view>
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
	import uCharts from '@/components/u-charts/u-charts.js';
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
		if (lastMonth == 11) {
			lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
		}
		return formatDate(lastMonthStartDate);
	}

	//获得上月结束时间
	function getLastMonthEndDate () {
		var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
		if (lastMonth == 11) {
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
	var time = weekDate.getDate() - day + (day == 0 ? -6 : 1);

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

	var _self;
	var canvaColumn = null;
	var canvasLineOne = null;
	var canvasLineTwo = null;
	export default {
		name  : "member",
		inject: ['initPage', 'getParameter'],
		data () {
			let userIdx = localStorage.getItem('tab2') !== null ? localStorage.getItem('tab2') : (this.getParameter('uix') !== null ? this.getParameter('uix') : 0)

			return {
				isLoading           : false,
				show                : null,
				titleActive         : false,
				countArr            : [],
				barr                : [],
				xarr                : [],
				threeItem           : 0,
				suma                : 0,
				sumb                : 0,
				sumc                : 0,
				sumd                : 0,
				groupIndex          : 0,
				datasType           : 1,
				itemIndex           : 0,
				ucount              : 0,
				cWidth              : '',
				cHeight             : '',
				lWidth              : '',
				lHeight             : '',
				pixelRatio          : 1,
				serverData          : '',
				//切换参数
				data_Type           : 1,
				userIndex           : userIdx,
				index               : 0,
				dateIndex           : 2,
				timeName            : '近七天',//选择时间
				s_date              : fun_date(7),
				e_date              : fun_date(1),
				user_ids            : [],//选择的成员
				userCount           : 0,//选择的成员数量
				//	日期计算
				range2              : [],
				dtype               : 'range2',
				value               : '',
				showPicker          : false,
				// 	year             : gety(12), // 12月前
				yesterday           : fun_date(1), // 一天前日期
				months              : fun_date(30), // 30天前日期
				nowDay              : now_date(), // 当前日期
				weekDay             : fun_date(7), // 7天前日期
				//上周日期
				last_week_s         : beginTime,
				last_week_e         : endTime,
				//本周日期
				week_s              : getWeekStartDate(),
				week_e              : now_date(),
				//上月日期
				last_month_s        : getLastMonthStartDate(),
				last_month_e        : getLastMonthEndDate(),
				//本月日期
				month_s             : getMonthStartDate(),
				month_e             : getMonthEndDate(),
				showChooseDepartment: false,//选择成员组件的显示与隐藏
				selectDepartment    : [],//已选择的成员
			}
		},

		created () {
			// this.userIndex=0
			// localStorage.setItem('user_id', 'shakalaka')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'TWFpblVzZXItNGVjODgwNmYxMzNhMjM4NmU1NTA0NTM5MDM5NDExYmM=')

			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(600);
			this.lWidth = uni.upx2px(750);
			this.lHeight = uni.upx2px(600);
			this.userCount = 0

			if (this.userIndex == 1) {
				this.selectDepartment = []
				this.user_ids = []
				this.dateIndex = 2
				this.s_date = fun_date(7)
				this.e_date = fun_date(1)
				this.timeName = '近七天'
				this.range2 = []
				this.getGroupInfo()
			} else {
				this.getMemberInfo(1)
				this.getline(1)
			}
			localStorage.setItem('tab2', '')
		},
		methods   : {
			init () {

			},
			goGroup () {
				this.selectDepartment = []
				this.user_ids = []
				this.userCount = 0
				this.dateIndex = 2
				this.s_date = fun_date(7)
				this.e_date = fun_date(1)
				this.timeName = '近七天'
				this.range2 = []
				this.getGroupInfo()
				localStorage.setItem('tab2', 1)
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/groupData?corpId=' + localStorage.getItem('corpid') + '&agent_id=' + agent_id
				});
			},
			changeThreeItem (index) {
				if (index != this.threeItem) {
					this.threeItem = index
				}
				switch (this.threeItem) {
					case 0:
						this.datasType = 7
						this.getGroupInfo()
						break;
				}
			},
			changeGroupItem (index) {
				if (index != this.groupIndex) {
					this.groupIndex = index
				}

				switch (this.groupIndex) {
					case 0:
						this.datasType = 4
						this.getGroupInfo()
						break;
					case 1:
						this.datasType = 5
						this.getGroupInfo()
						break;
					case 2:
						this.datasType = 6
						this.getGroupInfo()
						break;
					case 3:
						this.datasType = 8
						this.getGroupInfo()
						break;
				}
			},
			//获取客户群数据
			async getGroupInfo () {
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
				const {data: res} = await this.axios.post('wap-user-desktop/work-user-chat-statistic', {
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					data_type: this.datasType,
					user_ids : this.user_ids,
					s_date   : this.s_date,
					e_date   : this.e_date,
					type     : 1,
				})
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.suma = res.data.snum1
					this.sumb = res.data.snum2
					this.sumc = res.data.snum3
					this.sumd = res.data.snum4
					this.userCount = res.data.user_count
					this.show = res.data.show
					let LineA = {categories: [], series: []};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					LineA.categories = res.data.xData;
					LineA.series = res.data.seriesData;
					_self.showLineTwo("canvasLineTwo", LineA);
				}

			},
			showLineTwo (canvasId, chartData) {
				canvasLineTwo = new uCharts({
					$this         : _self,
					canvasId      : canvasId,
					type          : 'line',
					fontSize      : 11,
					legend        : {
						show      : true,
						lineHeight: 16,
					},
					dataLabel     : false,
					//调整边距
					padding       : [20, 30, 0, 15],
					// boundaryGap:center,
					dataPointShape: true,
					background    : '#FFFFFF',
					pixelRatio    : _self.pixelRatio,
					categories    : chartData.categories,
					series        : chartData.series,
					xAxis         : {
						type         : 'grid',
						axisLineColor: '#F2F2F2',
						gridColor    : '#CCCCCC',
						gridType     : 'dash',
						dashLength   : 8,
						labelCount   : 3,
						disableGrid  : true,
						// rotateLabel:true
						// boundaryGap:'center'

					},

					yAxis : {
						gridType   : 'dash',
						gridColor  : '#CCCCCC',
						dashLength : 8,
						disableGrid: true,
						splitNumber: 5,
						data       : [
							{
								axisLineColor: '#F2F2F2',
								min          : 0,
								format       : (val) => {
									if (val == 0) {
										return val.toFixed(0)
									} else if (val > 0 && val < 10) {
										return val.toFixed(1)
									} else {
										return val.toFixed(0)
									}
								},
							}
						],

						// max:180,
						// format:(val)=>{return val.toFixed(0)+'元'}
					},
					width : document.body.clientWidth * _self.pixelRatio,
					height: 300 * _self.pixelRatio,
					extra : {
						line   : {
							type: 'straight'
						},
						tooltip: {
							gridColor: '#F2F2F2'
						}
					}
				});
			},
			touchLineB (e) {
				canvasLineTwo.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
				canvasLineTwo.touchLegend(e, {animation: true});
			},
			changeItem (index) {
				if (index != this.itemIndex) {
					this.itemIndex = index
				}
				switch (this.itemIndex) {
					case 0:
						this.datasType = 1
						this.getGroupInfo()
						break;
					case 1:
						this.datasType = 2
						this.getGroupInfo()
						break;
					case 2:
						this.datasType = 3
						this.getGroupInfo()
						break;
				}
			},
			changeUCount (index) {
				if (index != this.ucount) {
					this.ucount = index
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}
				switch (this.ucount) {
					case 0:
						this.datasType = 1
						this.itemIndex = 0
						this.getGroupInfo()
						break;
					case 1:
						this.datasType = 4
						this.groupIndex = 0
						this.getGroupInfo()
						break;
					case 2:
						this.datasType = 7
						this.threeItem = 0
						this.getGroupInfo()
						break;
				}
			},
			//跳转到详细数据
			goData () {
				this.$emit('func', true)
				this.user_ids = []
				this.userCount = 0
				this.selectDepartment = []
				this.dateIndex = 2
				this.s_date = fun_date(7)
				this.e_date = fun_date(1)
				this.timeName = '近七天'
				this.range2 = []
				this.getline()
				this.getMemberInfo()
				localStorage.setItem('tab2', 0)
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/member_data?corpId=' + localStorage.getItem('corpid') + '&agent_id=' + agent_id
				});
			},
			//趋势图
			async getline (sum) {
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
				if (sum == 1) {
					this.selectDepartment = []
				}
				const {data: res} = await this.axios.post('wap-user-desktop/work-user-custom-num-increase', {
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					data_Type: this.data_Type,
					s_date   : this.s_date,
					e_date   : this.e_date,
					type     : 2,
					user_ids : this.user_ids
				})
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					if (sum == 1) {
						this.userCount = 0
					}
					let LineA = {categories: [], series: []};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					LineA.categories = res.data.xData;
					LineA.series = res.data.seriesData;
					_self.showLineOne("canvasLineOne", LineA);
				}
			},
			showLineOne (canvasId, chartData) {
				canvasLineOne = new uCharts({
					$this         : _self,
					canvasId      : canvasId,
					type          : 'line',
					fontSize      : 11,
					legend        : {
						show      : true,
						lineHeight: 12,
					},
					dataLabel     : false,
					dataPointShape: true,
					background    : '#FFFFFF',
					//调整边距
					padding       : [20, 30, 0, 15],
					pixelRatio    : _self.pixelRatio,
					categories    : chartData.categories,
					series        : chartData.series,
					xAxis         : {
						type         : 'grid',
						gridType     : 'dash',
						axisLineColor: '#F2F2F2',
						dashLength   : 8,
						labelCount   : 3,
						disableGrid  : true,
						// rotateLabel:true
					},
					yAxis         : {
						gridType   : 'dash',
						// gridColor  : '#CCCCCC',
						dashLength : 8,
						disableGrid: true,
						splitNumber: 5,
						data       : [
							{
								axisLineColor: '#F2F2F2',
								min          : 0,
								format       : (val) => {
									if (val == 0) {
										return val.toFixed(0)
									} else if (val > 0 && val < 10) {
										return val.toFixed(1)
									} else {
										return val.toFixed(0)
									}
								},
							}
						],
					},

					width : document.body.clientWidth * _self.pixelRatio,
					height: 300 * _self.pixelRatio,
					extra : {
						line   : {
							type: 'curve'
						},
						tooltip: {
							gridColor: '#F2F2F2'
						}
					}
				});
			},
			touchLineA (e) {
				canvasLineOne.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
				canvasLineOne.touchLegend(e, {animation: true});
			},
			//top柱状图
			async getMemberInfo (sum) {
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
				if (sum == 1) {
					this.selectDepartment = []
				}
				const {data: res} = await this.axios.post('wap-user-desktop/work-user-custom-num-top', {
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					data_Type: this.data_Type,
					s_date   : this.s_date,
					e_date   : this.e_date,
					type     : 2,
					user_ids : this.user_ids
				})
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					let l = res.data.seriesData
					this.show = res.data.show
					if (sum == 1) {
						res.data.user_count = 0
					}
					this.userCount = res.data.user_count
					this.countArr = res.data.seriesData
					if (l.length == 0) {
						this.titleActive = true
					}
					let max = Number(l[0])
					let b = []
					for (let i = 1; i < l.length; i++) {
						if (max < l[i]) {
							max = l[i]
						}
					}
					if (max == 0) {
						this.titleActive = false
						for (let index = 0; index < l.length; index++) {
							l[index] = max
							let index2 = Number(l[index])
							b.push(index2)
							this.barr = b
						}
					} else if (max != 0) {
						for (let j = 0; j < l.length; j++) {
							this.titleActive = false
							let z = Number(l[j])
							let m = Number(max)
							b.push((z / m) * 100)
							this.barr = b
						}
					}

					this.xarr = res.data.xData
					_self.serverData = res.data;
				}
				//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
				let Column = {categories: [], series: []};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				Column.categories = res.data.xData;
				let s = [{
					name: 'Top10',
					data: res.data.seriesData
				}]
				Column.series = s;
				_self.showColumn("canvasColumn", Column);

			},

			showColumn (canvasId, chartData) {
				canvaColumn = new uCharts({
					$this     : _self,
					canvasId  : canvasId,
					type      : 'column',
					legend    : {show: true},
					fontSize  : 11,
					background: '#FFFFFF',
					//调整边距
					padding   : [20, 15, 4, 15],
					pixelRatio: _self.pixelRatio,
					animation : true,
					categories: chartData.categories,
					series    : chartData.series,
					xAxis     : {
						disableGrid: true,
					},
					yAxis     : {
						//disabled:true
						gridType: 'dash',
						min     : 0,
						format  : (val) => {
							return val.toFixed(0)
						},
					},
					dataLabel : true,
					width     : document.body.clientWidth * _self.pixelRatio,
					height    : 300 * _self.pixelRatio,
					extra     : {
						column: {
							type : 'group',
							width: document.body.clientWidth * _self.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});
			},
			touchColumn (e) {
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						if (typeof item.data == 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
			changeUserIndex (index) {
				if (index != this.userIndex) {
					this.userIndex = index
					this.selectDepartment = []
					this.user_ids = []
					this.userCount = 0
					this.dateIndex = 2
					this.s_date = fun_date(7)
					this.e_date = fun_date(1)
					this.timeName = '近七天'
					this.range2 = []
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}

				localStorage.setItem('tab2', index)
				if (this.userIndex == 0) {
					this.$refs.dropdownItemC.closePopup()
					this.$refs.dropdownItemD.closePopup()
					this.getline()
					this.getMemberInfo()
				} else if (this.userIndex == 1) {
					this.$refs.dropdownItemC.closePopup()
					this.$refs.dropdownItemD.closePopup()
					this.getGroupInfo()
				}
			},
			changeIndex (index) {
				if (index != this.index) {
					this.$refs.dropdownItemC.closePopup()
					this.index = index
					this.selectDepartment = []
					this.user_ids = []
					this.userCount = 0
					this.dateIndex = 2
					this.s_date = fun_date(7)
					this.e_date = fun_date(1)
					this.range2 = []
					this.timeName = '近七天'
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					switch (this.index) {
						case 0:
							this.data_Type = 1
							break;
						case 1:
							this.data_Type = 2
							break;
						case 2:
							this.data_Type = 3
							break;
						case 3:
							this.data_Type = 4
							break;
					}
					this.getline()
					this.getMemberInfo()
				}

			},
			//选择成员
			chooseStaff () {
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				uni.hideTabBar()
				document.getElementsByClassName('content_head')[0].style.display = 'none'
				this.showChooseDepartment = true
				this.$emit('func', this.showChooseDepartment)
			},
			replyDepartment (arr) {
				document.getElementsByClassName('content_head')[0].style.display = 'initial'
				this.showChooseDepartment = false
				this.$emit('func', this.showChooseDepartment)
				uni.showTabBar()
				if (typeof arr == 'object') {
					this.selectDepartment = arr
					if (this.userIndex == 0) {
						this.getMemberInfo()
						this.getline()
					} else if (this.userIndex == 1) {
						this.getGroupInfo()
					}
				}
			},
			changeDateIndex (index, timeName) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					this.range2 = []
					if (index != 4) {
						this.timeName = timeName
					}
				}
				if (this.userIndex == 0) {
					this.getline()
					this.getMemberInfo()
					// this.$refs.dropdownItemC.closePopup()
				} else if (this.userIndex == 1) {
					this.getGroupInfo()
					// this.$refs.dropdownItemD.closePopup()
				}

			},
			//		定义时间
			//		近七天
			lastWD () {
				this.s_date = this.weekDay
				this.e_date = this.yesterday
				if (this.userIndex == 0) {
					this.$refs.dropdownItemC.closePopup()
				} else if (this.userIndex == 1) {
					this.$refs.dropdownItemD.closePopup()
				}
			},
			// //今日
			// today () {
			// 	this.s_date = this.nowDay
			// 	this.e_date = this.nowDay
			// 	switch (this.userIndex) {
			// 		case 0:
			// 			this.getline()
			// 			this.getMemberInfo()
			// 			this.$refs.dropdownItemC.closePopup()
			// 			break;
			// 		case 1:
			// 			this.getGroupInfo()
			// 			this.$refs.dropdownItemD.closePopup()
			// 			break;
			// 	}
			// },
			//昨日
			ysd () {
				this.s_date = this.yesterday
				this.e_date = this.yesterday
				if (this.userIndex == 0) {
					this.$refs.dropdownItemC.closePopup()
				} else if (this.userIndex == 1) {
					this.$refs.dropdownItemD.closePopup()
				}
			},
			//		近三十天
			lastMD () {
				this.s_date = this.months
				this.e_date = this.yesterday
				if (this.userIndex == 0) {
					this.$refs.dropdownItemC.closePopup()
				} else if (this.userIndex == 1) {
					this.$refs.dropdownItemD.closePopup()
				}
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
					if (this.range2.length > 0) {
						this.s_date = this.range2[0]
						this.e_date = this.range2[1]
						this.timeName = this.s_date + '-' + this.e_date
					}
					if (this.userIndex == 0) {
						this.getline()
						this.getMemberInfo()
						this.$refs.dropdownItemC.closePopup()
					} else if (this.userIndex == 1) {
						this.getGroupInfo()
						this.$refs.dropdownItemD.closePopup()
					}
				}
			},
		},
		components: {
			msDropdownMenu,
			msDropdownItem,
			uCharts,
			MxDatePicker,
			ChooseDepartment
		}
	}
</script>

<style scoped lang="less">

	.sum {
		display: flex !important;
		justify-content: space-between !important;

		.item {
			width: 30%;
		}
	}

	.member_container {
		background: #F1F3F5;
		overflow-y: auto;

		.chartColor {
			color: #FFFFFF !important;
			background: #5183EB !important;
			border-color: #5183EB !important;
		}

		.activity-btn {
			background: #5183EB !important;
			color: #FFF !important;
		}

		/deep/ uni-button[size=mini] {
			padding: 0 0.2rem 0;
		}

		/deep/ .dropdown-item__selected[data-v-aa4f4da6] {
			padding: 0;
		}

		/*/deep/ .dropdown-item__selected .selected__name[data-v-aa4f4da6] {*/
		/*	font-size: 0.693rem*/
		/*}*/

		/deep/ .iconfont[data-v-aa4f4da6] {
			font-size: 0.693rem
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.693rem !important;
		}

		.view_p {
			font-size: 0.8rem;
			font-weight: bold;
			color: #212329;
			line-height: 1.6rem;
			padding-left: 0.533rem;
			text-align: left;
			background: #FFF;
		}

		/*样式的width和height一定要与定义的cWidth和cHeight相对应*/

		.qiun-charts {
			width: 20rem;
			height: 17rem;
			background-color: #FFFFFF;
		}

		.charts {
			width: 100%;
			height: 16.3rem;
			background-color: #FFFFFF;
		}

		.line {
			margin-top: 0.533rem;
			background: #FFF;
			padding-top: 0.8rem;
		}

		.data {
			font-size: 0.8rem;
			font-weight: 500;
			color: #000;
			line-height: 2rem;
			text-align: center;
		}

		.tab2 {
			display: flex;
			padding: 0 0.533rem;
			margin-top: 0.533rem;

			.td {
				font-size: 0.8rem;
				padding: 0 0.533rem 0.6rem;
				margin-right: 0.533rem;
				color: #666;
			}

			#border {
				color: #1890FF;
				border-bottom: 0.16rem solid #1890FF;

			}
		}


		.users {
			margin-top: 0.533rem;
			background: #FFF;

			.count_info {
				background: #FFF;
				padding: 1.067rem 0.533rem 0;

				.sum {
					width: 100%;
					display: flex;
					flex-wrap: wrap;

					#item_color {
						background: #E5F1FF;
						color: #1890FF;
					}

					.item {
						width: 49%;
						height: 4.267rem;
						background: #EDEDED;
						/*background: #b3d4fc;*/
						margin-bottom: 0.533rem;

						.one {
							font-size: 0.75rem;
							text-align: left;
							height: 0.64rem;
							margin: 0.7rem 0 0.533rem 0.693rem;
							font-weight: 500;
							line-height: 1.6rem;
						}

						.two {
							font-size: 1rem;
							text-align: left;
							font-weight: bold;
							line-height: 1.6rem;
							margin-left: 0.693rem
						}
					}
				}
			}

			.lchart {
				padding-top: 1.4rem;
			}
		}

		#ChangeColor {
			/*background: #5183EB;*/
			color: #5183EB;
		}

		.title_style {
			font-size: 0.747rem;
			margin-bottom: 0.16rem;
		}

		.color {
			background: #1890FF;
			height: 0.5rem;
			border-radius: 0.4rem;
		}

		.item0 {
			background: #CCC;
			height: 0.5rem;
			border-radius: 0.4rem;
			width: 100%;
		}

		.text_style {
			/*display: flex;*/
			/*align-items: center;*/
			margin-bottom: 0.267rem;
		}

		.font_style {
			font-size: 0.64rem;
			margin-left: 0.16rem;
		}


		/deep/ .dropdown-item:not(:last-child):after {
			width: 0;
		}

		.button-sp-area {
			width: 100%;
		}

		.tab-btn {
			height: 1.28rem /* 23/18.75 */;
			line-height: 1.28rem /* 23/18.75 */;
			background: #EDEDED;
			border-radius: 0.587rem /* 11/18.75 */;
			font-size: 0.7rem /* 11/18.75 */;
			color: #666;
			width: 24%;
			display: inline-block;
			text-align: center;
			margin-right: 1%;
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

		/* /deep/.uni-app--showtabbar uni-page-wrapper{*/
		/*	background: #F1F3F5!important;*/
		/*}*/

		/deep/ uni-page-wrapper {
			background: #F1F3F5 !important;
		}
	}
</style>