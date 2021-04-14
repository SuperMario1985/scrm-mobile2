<template>
	<view class="detailed_container">
		<root-font-size />
		<view class="top" v-if="!showChooseDepartment">
			<view class="header ">
				<view>
						<uni-icons @click="goBack()" type="arrowleft"
						           style=" font-size:0.8rem;color: #FFF;margin-left: 0.373rem"></uni-icons>
					<text class="data">未跟进</text>
				</view>
			</view>
			<!--	 日期员工切换		-->
			<view style=" display: flex; margin-top: 0.8rem;padding: 0 0.533rem 0 0.15rem;
			justify-content: center;">
				<view style="display: flex; line-height: 1.4rem">
					<button :class="type===2 ? 'chartColor':''" @click="changeChart(2)" style="width: 3.8rem;
						height: 1.4rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-right: 0;
						margin: 0;
						margin-left: 0.533rem;
						border-radius: 0;
						font-size: 0.7rem;
						font-weight: 500;
						color: #333333;
						line-height:1.4rem;
						" type="default" plain="">按日期
					</button>
					<button :class="type===1 ? 'chartColor':''" @click="changeChart(1)" style="width: 3.8rem;
						height: 1.4rem;
						background: #FFFFFF;
						border-radius: 0;
						border: 0.053rem solid #EDEDED;
						margin: 0;
						font-size: 0.7rem;
						font-weight: 500;
						color: #333333;
						line-height:1.4rem;
						" type="default" plain="">按员工
					</button>
				</view>
			</view>
			<view>
				<view   style="display: flex;align-items: center;height: 2.533rem;color: #999;background: #fff;z-index: 150">
					<view v-show="show==0" @click="chooseStaff"
					      style="padding: 0.2rem 0;flex-grow: 1;text-align: center;line-height: 2.133rem;font-weight: bold;font-size: 0.747rem">
						<text v-if="userCount == 0" style="cursor: pointer">选择成员</text>
						<text v-if="userCount > 0" style="cursor: pointer">{{userCount}}个成员</text>
						<uni-icons type="arrowdown"
						           style="font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
					</view>
					<ms-dropdown-menu style="
						font-size: 0.747rem;
						padding: 0.2rem 0;
						flex-grow: 2;
						height: 2.133rem;
						color: #333333; ">
						<ms-dropdown-item
								style="height: 2.133rem;font-size: 0.747rem;text-align: center;font-weight: bold;color: #999;line-height: 2.133rem;"
								:hasSlot="true" :title="statusName" ref="dropdownItems">
							<view class="dropdown-item-content"
							      style="line-height: 2.133rem;font-size: 0.747rem;height: 10.133rem">
								<view :class="statusIndex==='0' ? 'statuscolor' : ''" @click="changeStatus('0','全部状态')">
									全部状态
								</view>
								<view v-for="(item,index) in statusData" :key="index"
								      :class="statusIndex===item.id ? 'statuscolor' : ''"
								      @click="changeStatusIndex(item,item.title)">
									{{ item.title }}
								</view>
							</view>
						</ms-dropdown-item>
						<ms-dropdown-item
								style="z-index: 99999999999;height: 2.133rem;font-size: 0.747rem;text-align: center;font-weight: bold;color: #999;line-height: 2.133rem"
								:hasSlot="true" :title="timeName" ref="dropdownItemD">
							<view class="dropdown-item-content" style="z-index: 99999999999;font-size: 0.747rem;">
								<view :id="dateIndex===0 ? 'ChangeColor' : ''"
								      @click="lastWD(),changeDateIndex(0,'上一周')">上一周
								</view>
								<view :id="dateIndex===1 ? 'ChangeColor' : ''"
								      @click="lastMD(),changeDateIndex(1,'上一月')">上一月
								</view>
								<view :id="dateIndex===2 ? 'ChangeColor' : ''" @click="weekD(),changeDateIndex(2,'本周')">
									本周
								</view>
								<view :id="dateIndex===3 ? 'ChangeColor' : ''"
								      @click="monthD(),changeDateIndex(3,'本月')">本月
								</view>
								<view :id="dateIndex===4 ? 'ChangeColor' : ''"
								      @click="onShowDatePicker('range'),changeDateIndex(4)">自定义时间
								</view>
							</view>
						</ms-dropdown-item>
					</ms-dropdown-menu>
				</view >

			</view>
		</view>
		<!--  按日期列表	-->
		<scroll-view  v-show="type===2" class=""
		             style="top: 7.132rem; left: 0; right: 0; bottom: 0; position: fixed;"
		             @scrolltolower="loadMore"
		             :scroll-x="false"
		             :scroll-y="true" v-if="!showChooseDepartment">
			<view style="position: relative;" class="">
				<view class="left" style="z-index: 50; position: absolute;top: 0;left: 0;">
					<view class="th" style="position: fixed;display: flex;z-index: 10;justify-content: center">日期</view>
					<view style="position: relative;top: 1.6rem; margin-bottom: 1.6rem;">
					<view class="td" style="padding-left: 0" v-for="(item,index) in dateFollowData" :key="index">
						<text style=" font-size: 0.747rem;display: inline-block;width: 100%;text-align: center">
							{{item.name}}
						</text>
					</view>
					</view>
				</view>
				<view class="right " style="z-index: 30;" >
					<scroll-view ref="scrollBox" class="scroll-view_H" scroll-x="true" @scroll="scroll" scroll-left="6.88rem">
						<view :style="{width:tabWidth}" class="scroll-view-item_H uni-bg-green">
							<view class="scroll_left" style="position: fixed;display: flex;z-index: 30;left: 6.88rem;background: rgb(243, 243, 247)">
								<view class="thB" v-for="(item,index) in NotFollowDays" :key="index">{{ item.title }}</view>
							</view>
							<view style="position: relative;top: 1.6rem; margin-bottom: 1.6rem;background: #fff">
							<view class="thC"  v-for="item in dateFollowData">
								<view class="tdB" v-for="co in c">
									{{item[co.key]}}
								</view>
							</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="custom-tabs-loading" v-if="dateFollowData.length > 0">{{loadingText}}</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</scroll-view>

		<!--  按员工列表	-->
		<scroll-view   style="top: 7.132rem; left: 0; right: 0; bottom: 0; position: fixed;" class=""
		               @scrolltolower="loadMore"
		               :scroll-x="false"
		               :scroll-y="true" v-show="type===1 && !showChooseDepartment">
			<view style="position: relative;">
				<view class="left" style="z-index: 50;position: absolute;top: 0;left: 0;">
					<view style="position: fixed;display: flex;z-index: 10;justify-content: center" class="th">员工姓名</view>
					<view style="position: relative;top: 1.6rem; margin-bottom: 1.6rem;">
						<view class="td" v-for="(item,index) in notFollowData" :key="index">
							<view class="title">
								<text>{{ item.name }}</text>
								<view class="content">{{ item.depart }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="right" style="z-index: 30;overflow: hidden">
					<scroll-view ref="scrollBox2" class="scroll-view_H" scroll-x="true" @scroll="scroll2" scroll-left="6.88rem">
					<view :style="{width:tabWidth}" class="scroll-view-item_H uni-bg-green">
						<view class="table_right" style="position: fixed;display: flex;z-index: 30;left: 6.88rem;background: rgb(243, 243, 247)">
							<view class="thB" v-for="(item,index) in NotFollowDays">{{ item.title }}</view>
						</view>
						<view style="position: relative;top: 1.6rem; margin-bottom: 1.6rem;background: #fff">
							<view class="thC"  v-for="(item,index) in notFollowData">
								<view class="tdB" v-for="(co, idx) in c">
									{{item[co.key]}}
								</view>
							</view>
						</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<view class="custom-tabs-loading" v-if="notFollowData.length > 0">{{loadingText2}}</view>
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
		if(nowDayOfWeek==0){
			nowDayOfWeek=7
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

	//获得本季度的开始日期
	function getQuarterStartDate () {

		var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
		return formatDate(quarterStartDate);
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
	var beginTime = startDate.getFullYear() + '-' + ((startDate.getMonth() + 1)<10?('0'+(startDate.getMonth() + 1)):(startDate.getMonth() + 1)) + '-' + (startDate.getDate()<10? ('0'+startDate.getDate()):startDate.getDate());
	var endDate = new Date(weekDate2.setDate(time + 6));
	var endTime = endDate.getFullYear() + '-' + ((endDate.getMonth() + 1)<10?('0'+(endDate.getMonth() + 1)):(endDate.getMonth() + 1)) + '-' +(endDate.getDate()<10? ('0'+endDate.getDate()):endDate.getDate());


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
		name         : "DetailedData",
		inject    : ['initPage', 'getParameter'],
		data () {
			return {
				scrollTimeout: '',
				scrollTimeout2: '',
				isLoading   : true,
				fontSize      : 0,
				statusName    : '全部状态',//选择的状态名
				timeName      : '本周',
				isReady       : false,
				page          : 1,
				show          : null,
				loadingText   : '加载中...',
				loadingText2  : '加载中...',
				// 	year             : gety(12), // 12月前
				yesterday     : fun_date(1), // 一天前日期
				months        : fun_date(30), // 30天前日期
				nowDay        : now_date(), // 当前日期
				weekDay       : fun_date(6), // 7天前日期
				//上周日期
				last_week_s   : beginTime,
				last_week_e   : endTime,
				//本周日期
				week_s        : getWeekStartDate(),
				week_e        : now_date(),
				//上月日期
				last_month_s  : getLastMonthStartDate(),
				last_month_e  : getLastMonthEndDate(),
				//本月日期
				month_s       : getMonthStartDate(),
				month_e       : now_date(),
				dateIndex     : 2,
				range         : [],
				dtype         : 'range',
				value         : '',
				showPicker    : false,
				count         : 0,
				count2        : 0,
				notFollowData : [],
				dateFollowData: [],
				c             : [],
				type          : 2,
				s_date        : getWeekStartDate(),
				e_date        : now_date(),
				user_ids      : [],
				userCount     : 0,//选择的成员数量
				//未跟进天数
				NotFollowDays : [],
				tabWidth      : null,
				//状态
				// followId:0,
				statusIndex   : '0',
				statusData    : [],
				scrollTop     : 0,
				old           : {
					scrollTop: 0
				},
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
			// this.getStatus()
			// this.getNotFollowDate(1,1)

			this.userCount=0
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
			if (this.type == 2) {
				if (this.dateFollowData.length < this.count) {
					this.page += 1
					this.getNotFollowDate(this.page)
				} else {
					this.loadingText = '已加载全部'
				}
			}
			if (this.type == 1) {
				if (this.notFollowData.length < this.count2) {
					this.page += 1
					this.getNotFollowDate(this.page)
				} else {
					this.loadingText2 = '已加载全部'
				}
			}
		},
		methods      : {
			init () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.getStatus()
				this.getNotFollowDate(1,1)
			},
			loadMore (e) {
				if (!this.isLoading) {
					this.isLoading = true;
					if (this.type == 2) {
						if (this.dateFollowData.length < this.count) {
							this.page += 1
							this.getNotFollowDate(this.page)
						} else {
							this.loadingText = '已加载全部'
						}
					}
					if (this.type == 1) {
						if (this.notFollowData.length < this.count2) {
							this.page += 1
							this.getNotFollowDate(this.page)
						} else {
							this.loadingText2 = '已加载全部'
						}
					}
				}
			},
			goBack () {
				this.selectDepartment = []
				let gIndex = localStorage.getItem('tab3') !== null ? localStorage.getItem('tab3') :0
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				window.location.href = this.$store.state.h5Url + '/h5/pages/scrm/contents?tax=1&gix=' + gIndex + '&agent_id=' + agent_id
				// uni.navigateBack()
				uni.reLaunch({
					url: '/pages/scrm/contents'
				});
			},
			//		定义时间
			//		上一周
			lastWD () {
				this.s_date = this.last_week_s
				this.e_date = this.last_week_e
				this.getNotFollowDate()
				this.$refs.dropdownItemD.closePopup()
			},
			//		上一月
			lastMD () {
				this.s_date = this.last_month_s
				this.e_date = this.last_month_e
				this.getNotFollowDate()
				this.$refs.dropdownItemD.closePopup()
			},
			//		本周
			weekD () {
				this.s_date = this.week_s
				this.e_date = this.week_e
				this.getNotFollowDate()
				this.$refs.dropdownItemD.closePopup()
			},
			//		本月
			monthD () {
				this.s_date = this.month_s
				this.e_date = this.month_e
				this.getNotFollowDate()
				this.$refs.dropdownItemD.closePopup()
			},
			changeDateIndex (index, timeName) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 0
					});
					this.range = []
					if (index != 4) {
						this.timeName = timeName
					}
				}
				this.page = 1
				this.loadingText = '加载中...'
				this.loadingText2 = '加载中...'
				// this.$refs.dropdownItemD.closePopup()

			},
			//选择时间
			onShowDatePicker (type) {//显示
				this.dtype = type;
				this.showPicker = true;
				this.value = this[type]
			},
			onSelected (e) {//选择
				this.showPicker = false;
				// this.$refs.dropdownItemD.closePopup()
				if (e) {
					this[this.dtype] = e.value;
					if (this.range.length > 0) {
						this.s_date = this.range[0]
						this.e_date = this.range[1]
						this.timeName = this.s_date + '-' + this.e_date
						this.page = 1
						this.loadingText = '加载中...'
						this.loadingText2 = '加载中...'
						this.getNotFollowDate()
					}
					this.$refs.dropdownItemD.closePopup()
				}
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
					this.getNotFollowDate()
				}
			},
			//获取未跟进详细数据
			async getNotFollowDate (page = 1,sum) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				let that = this

				that.user_ids = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						that.user_ids.push(this.selectDepartment[i].id)
					}
				}
				if(sum==1){
					this.selectDepartment = []
				}
				const {data: res} = await that.axios.post('follow-statistic/analysis-two', {
					corp_id  : localStorage.getItem('corpid'),
					uid      : localStorage.getItem('uid'),
					user_id  : localStorage.getItem('user_id'),
					user_ids : that.user_ids,
					s_date   : that.s_date,
					e_date   : that.e_date,
					page     : page,
					pageSize : 15,
					follow_id: that.statusIndex,
					type     : that.type
				})
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
					that.isLoading = false
				} else {
					uni.hideLoading();
					that.isReady = true
					that.page = page
					if(sum==1){
						res.data.user_count=0
					}
					that.userCount=res.data.user_count
					if (that.page == 1) {
						if (that.type === 2) {
							that.dateFollowData = res.data.dateData
							that.count = res.data.count
						}
						if (that.type === 1) {
							that.notFollowData = res.data.userData
							that.count2 = res.data.count
						}

					} else {
						if (that.type === 2) {
							that.dateFollowData = that.dateFollowData.concat(res.data.dateData)
						}
						if (that.type === 1) {
							that.notFollowData = that.notFollowData.concat(res.data.userData)
						}
					}
					that.isLoading = false
					that.show = res.data.show
					that.userCount = res.data.user_count
					that.c = JSON.parse(JSON.stringify(res.data.columns))
					that.c.splice(0, 1)
					that.NotFollowDays = res.data.columns.splice(1, res.data.columns.length - 1)
					that.tabWidth = that.NotFollowDays.length * 6.88 + 'rem'
					if (that.dateFollowData.length == that.count && that.type === 2) {
						that.isLoading = true
						that.loadingText = '已加载全部'
					}
					if (that.notFollowData.length == that.count2 && that.type === 1) {
						that.isLoading = true
						that.loadingText2 = '已加载全部'

					}
				}
			},
			scroll: function (e) {
				this.old.scrollTop = e.detail.scrollTop
					clearTimeout(this.scrollTimeout)
					let currentLeft = e.detail.scrollLeft
					document.getElementsByClassName('scroll_left')[0].style.left = (6.88 - currentLeft / 18.75) + 'rem'

					this.scrollTimeout = setTimeout(() => {
						let checkLeft = this.$refs.scrollBox.$el.children[0].children[0].scrollLeft
						if (checkLeft != currentLeft) {
							document.getElementsByClassName('scroll_left')[0].style.left = (6.88 - checkLeft / 18.75) + 'rem'
						}
					}, 50)
			},
			scroll2: function (e) {
				this.old.scrollTop = e.detail.scrollTop
					clearTimeout(this.scrollTimeout2)
					let currentLeft2 = e.detail.scrollLeft
					document.getElementsByClassName('table_right')[0].style.left = (6.88 - currentLeft2 / 18.75) + 'rem'
					this.scrollTimeout2 = setTimeout(() => {
						let checkLeft2 = this.$refs.scrollBox2.$el.children[0].children[0].scrollLeft
						if (checkLeft2 != currentLeft2) {
							document.getElementsByClassName('table_right')[0].style.left = (6.88 - checkLeft2 / 18.75) + 'rem'
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

			changeChart (index) {
				if (index != this.type) {
					this.type = index
					this.getNotFollowDate()
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}
				this.$refs.dropdownItems.closePopup()
				this.$refs.dropdownItemD.closePopup()
			},
			changeStatus (index, name) {
				if (index != this.statusIndex) {
					this.statusIndex = index
					this.statusName = name
				}
				this.page = 1
				this.loadingText = '加载中...'
				this.loadingText2 = '加载中...'
				this.getNotFollowDate()
				this.$refs.dropdownItems.closePopup()
			},
			changeStatusIndex (item, name) {
				if (item.id != this.statusIndex) {
					this.statusIndex = item.id
					this.statusName = name
				}
				this.page = 1
				this.loadingText = '加载中...'
				this.loadingText2 = '加载中...'
				this.getNotFollowDate()
				this.$refs.dropdownItems.closePopup()
			},
			//获取全部状态
			async getStatus () {
				const {data: res} = await this.axios.post('custom-field/follow', {
					uid       : localStorage.getItem('uid'),
					status    : 1,
					is_del_str: null
				})
				this.statusData = res.data.follow
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
	.detailed_container {
		overflow-y: auto;

		.top {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			/*overflow-y: auto;*/
			z-index: 12;
			background: #FFF;
		}

		@font-face {
			font-family: 'iconfont';
			src: url('../../static/font/iconfont.eot');
			src: url('../../static/font/iconfont.eot?#iefix') format('embedded-opentype'),
			url('../../static/font/iconfont.woff2') format('woff2'),
			url('../../static/font/iconfont.woff') format('woff'),
			url('../../static/font/iconfont.ttf') format('truetype'),
			url('../../static/font/iconfont.svg#iconfont') format('svg');
		}

		.iconfont {
			font-family: "iconfont" !important;
			font-size: 0.693rem;
			font-style: normal;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
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

		.chartColor {
			color: #FFFFFF !important;
			background: #01B065 !important;
			border-color: #01B065 !important;
		}

		.statuscolor {
			color: #01B065 !important;
			/*background: #01B065 !important;*/
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem;
		}

		/deep/ .dropdown-item__selected {
			padding: 0;
		}

		.left {
			width: 6.88rem;
			float: left;
			box-shadow: 0.107rem 0rem 0.32rem rgba(31, 34, 41, 0.08);
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

		.title{
			width: 33.333%;
			font-size: 0.693rem;
			padding-top: 0.2rem;
			padding-left: 0.747rem;
			line-height: 1.25rem  /* 30/18.75 */;
			color: rgba(51, 51, 51, 1);
			width: 5.333rem;
			overflow: hidden;
			white-space: nowrap;
			word-break: break-all;
			text-overflow: ellipsis;
			text-align: left;
			/*border-bottom: 0.053rem solid #f3f3f7*/
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

		.thB {
			display: inline-block;
			width: 6.88rem;
			font-size: 0.64rem /* 12/18.75 */;
			color: #7A7A7A;
			line-height: 1.6rem /* 30/18.75 */;
			height: 1.6rem /* 30/18.75 */;
			background: #F3F3F7;
			text-align: center;
		}

		.thC {
			display: flex;
			font-size: 0.747rem;
			align-items: center;
			background: #FFF;
		}

		.td {
			height: 2.667rem;
			text-align: left;
			display: flex;
			align-items: center;
			border-bottom: 0.053rem solid #F3F3F7
		}

		.tdB {
			display: flex;
			width: 6.88rem;
			font-size: 0.747rem;
			height: 2.667rem /* 50/18.75 */;
			background: #FFF;
			border-bottom: 0.053rem solid rgba(243, 243, 247, 1);
			align-items: center;
			justify-content: center;
		}

		#ChangeColor {
			/*background: #01B065;*/
			color: #01B065;
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

		/deep/.dropdown-item__content  .list.show{
			z-index:150;
		}

		uni-view /deep/.scroll-view-item_H{
			display: inline-block;
		}

		.scroll_left {
			transition:left 50ms;
		}

		.table_right {
			transition:left 50ms;
		}
	}
</style>