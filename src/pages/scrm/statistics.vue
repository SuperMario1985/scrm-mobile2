<template>
	<view class="container" style="background: #FFF">
		<root-font-size />
		<view class="title" v-if="!showChooseDepartment">
			<view class="back">
					<uni-icons @click="back()" type="arrowleft"
					           style=" font-size:0.8rem;color: #FFF;margin-left: 0.373rem"></uni-icons>
					<text class="data">内容统计</text>
					<!--		<uni-nav-bar left-icon="back" left-text="返回" @clickLeft="back" background-color="#01B065" color="#fff"></uni-nav-bar>-->
			</view>
			<view style="top:0">
				<view style="width: 100%; display: flex;background: #FFF;align-items: center">
					<view @click="aaa">
						<ms-dropdown-menu
								style="width:7.253rem;height: 2.133rem;font-size: 0.747rem;margin: 0.267rem  /* 5/18.75 */ 0;font-weight: bold;">
							<ms-dropdown-item v-model="file_type" :list="list"
							                  :hasSlot="true" :title="currentItemName"
							                  ref="dropdownItema"
							                  style="color: #999;font-size: 0.747rem;line-height: 2.133rem  /* 40/18.75 */;text-align: center;margin-top: 0.267rem;">
								<view class="dropdown-item-content" style="height: 10.133rem">
									<view :id="file_type===item.value ? 'currentItemStyle' : ''"
									      class="dateSelect"
									      @click="select(item)" v-for="(item,index) in list" :key="index">
										{{item.text}}
									</view>
								</view>
							</ms-dropdown-item>
						</ms-dropdown-menu>
					</view>

					<uni-search-bar :radius="100" @input="searchEnterFun"
					                cancelButton="none"
					                placeholder="搜索内容"
					                clearButton="always"
					                class="searchBar"></uni-search-bar>
				</view>
				<view class="header">
					<view v-show="show==0" @click="chooseStaff"
					      style="flex-grow: 1;text-align: center;line-height: 2.133rem;font-weight: bold;font-size: 0.747rem;color: #999;">
						<view style="font-size: 0.747rem;display: inline-block;cursor: pointer;">
							<span v-if="userCount == 0">选择成员</span>
							<span v-if="userCount > 0">{{userCount}}个成员</span>
						</view>
						<uni-icons type="arrowdown"
						           style="font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
					</view>
					<ms-dropdown-menu style="flex-grow: 1;height: 2.133rem;font-size: 0.747rem;">
						<ms-dropdown-item
								style="font-size: 0.747rem;line-height: 2.133rem;justify-content: center;font-weight: bold;display: flex;align-items: center;color: #999;"
								v-model="value3" :hasSlot="true" :title="timeName" ref="dropdownItemc">
							<view class="dropdown-item-content"
							      style="z-index: 99999999999;line-height: 2.133rem;text-align: center;font-size: 0.747rem;">
								<view :id="dateIndex===0 ? 'ChangeColor' : ''" @click="today(),changeDateIndex(0,'今日')">
									今日
								</view>
								<view :id="dateIndex===1 ? 'ChangeColor' : ''" @click="ytday(),changeDateIndex(1,'昨日')">
									昨日
								</view>
								<view :id="dateIndex===2 ? 'ChangeColor' : ''" @click="week(),changeDateIndex(2,'近7天')">
									近7天
								</view>
								<view :id="dateIndex===3 ? 'ChangeColor' : ''"
								      @click="month(),changeDateIndex(3,'近30天')">近30天
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
		<!--		<scroll-view scroll-y="true" style="position: fixed;top: 7.2rem  /* 135/18.75 */;bottom: 0;left: 0;right: 0;" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="abc">-->
		<scroll-view style="top: 7.467rem; left: 0; right: 0; bottom: 0; position: fixed;"
		             @scrolltolower="loadMore"
		             :scroll-x="false"
		             :scroll-y="true"
		             class="scroll-Y" v-if="!showChooseDepartment">
			<view class="table" style="position: relative">
				<view class="table_left" style="z-index: 50; position: absolute;top: 0;left: 0;">
					<view class="t_tile" style="position: fixed;left: 0;z-index: 10">
						<text>内容</text>
					</view>
					<view style="position: relative;top: 1.6rem; padding-bottom: 1.6rem;">
						<view class="item" v-for="(item,index) in contentData">
							<view style="padding-top: 0.267rem;text-align: left; font-size:0.8rem;line-height: 1.35rem;font-weight:700;color:rgba(51,51,51,1);width: 5.333rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
								<text class="item_title">{{ item.file_name }}</text>
							</view>
							<view style="font-size:0.7rem;
						    text-align: left;
							font-weight:500;
							width: 5.333rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
							color:rgba(153,153,153,1);">{{ item.type_name }}
							</view>
						</view>
					</view>
				</view>

				<view class="scroll"  style="z-index: 30;">
<!--					<view >-->
						<scroll-view ref="scrollBox" class="scroll-view_H" :scroll-x="true" @scroll="scroll"
						             scroll-left="0">
							<view id="demo1" style=" height: 100%;"
							      class="scroll-view-item_H uni-bg-red">
								<view class="table_right">
									<view class="scroll_left"
									      style="position: fixed;display: flex;z-index: 30;left: 6.88rem;background: rgb(243, 243, 247)">
										<view class="clock">
											<view class="title_right"  @click="search">搜索次数
												<uni-icons :type="iconIndexOne===true ? 'arrowthindown':'arrowthinup'"
												           size="0.533rem"
												           style="color: rgba(172,172,172,1);margin-left: 0.427rem  /* 8/18.75 */;"/>
											</view>

										</view>
										<view class="clock">
											<view class="title_right" @click="send">发送次数
												<uni-icons :type="iconIndexTwo===true ? 'arrowthindown':'arrowthinup'"
												           size="0.533rem"
												           style="color: rgba(172,172,172,1);margin-left: 0.427rem  /* 8/18.75 */;"/>
											</view>

										</view>
										<view class="clock">
											<view class="title_right" @click="open">打开次数
												<uni-icons :type="iconIndexThree===true ? 'arrowthindown':'arrowthinup'"
												           size="0.533rem"
												           style="color: rgba(172,172,172,1);margin-left: 0.427rem  /* 8/18.75 */;"/>
											</view>

										</view>
									</view>
									<view style="position: relative;top: 1.6rem; padding-bottom: 1.6rem; background: #FFF">
										<view v-for="(item,index) in contentData" style="display: flex;align-items: center">
											<view class="count-item">{{
												item.search_num }}
											</view>
											<view class="count-item">{{
												item.send_num }}
											</view>

											<view class="count-item">{{
												item.open_num }}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
<!--					</view>-->
				</view>
			</view>
			<view class="custom-tabs-loading" v-if="list.length > 0">{{loadingText}}</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</scroll-view>
		<mx-date-picker format="yyyy-mm-dd" :show="showPicker" :type="type" :value="value" :show-tips="true"
		                :begin-text="'开始'" :end-text="'结束'" :show-seconds="true" @confirm="onSelected"
		                @cancel="onSelected"/>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>
	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import {Toast} from "vant";
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";

	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay(); //今天本周的第几天
	var nowDay = now.getDate(); //当前日
	var nowMonth = now.getMonth() + 1; //当前月
	var nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //

	var lastMonthDate = new Date(); //上月日期
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	var lastYear = lastMonthDate.getYear();
	var lastMonth = lastMonthDate.getMonth();


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

	/*时间戳改日期--不传第二个参数返回年月日,传第二个参
	数返回年月日时分秒*/
	//格式化日期：yyyy-MM-dd
	function formatDateTime (date) {
		var myyear = date.getFullYear();
		var mymonth = date.getMonth();
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

	//获得本周的开始日期
	function getWeekStartDate () {
		if (nowDayOfWeek == 0) {
			nowDayOfWeek = 7
		}
		var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
		return formatDateTime(weekStartDate);
	}

	//获得本周的结束日期
	function getWeekEndDate () {
		var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
		return formatDateTime(weekEndDate);
	}

	//获得本月的开端日期
	function getMonthStartDate () {
		var monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDateTime(monthStartDate);
	}

	//获得本月的停止日期
	function getMonthEndDate () {
		var monthEndDate = new Date(nowYear, nowMonth, nowDay);
		return formatDateTime(monthEndDate);
	}

	//获得上周开端时候
	function getLastWeekStartDate () {
		var lastWeekStartDate = moment().day(-6).format('YYYY-MM-DD')
		return lastWeekStartDate;
	}

	//获得上周停止时候
	function getLastWeekEndDate () {
		var lastWeekEndDate = moment().day(0).format('YYYY-MM-DD')
		return lastWeekEndDate;
	}

	//获得上月开端时候
	function getLastMonthStartDate () {
		var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
		if(lastMonth == 11) {
			lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
		}
		return formatDateTime(lastMonthStartDate);
	}

	//获得上月停止时候
	function getLastMonthEndDate () {
		var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
		if(lastMonth == 11) {
			lastMonthEndDate = new Date(nowYear - 1, lastMonth, getMonthDays(lastMonth));
		}
		return formatDateTime(lastMonthEndDate);
	}

	export default {
		inject    : ['initPage', 'getParameter'],
		data () {
			return {
				scrollTimeout: '',
				isLoading   : true,
				searchTimeout   : '',
				fontSize   : 0,
				show       : null,
				dateIndex  : 2,
				timeName   : '近7天',//选择的时间名称
				yesterday  : fun_date(1), // 一天前日期
				months     : fun_date(29), // 30天前日期
				nowDay     : now_date(), // 当前日期
				weekDay    : fun_date(6), // 7天前日期
				page       : 1,
				count      : '',
				isReady    : false,
				loadingText: '加载中...',
				ccc        : '',
				showPicker : false,
				type       : 'range',
				range      : [],
				value      : '',
				list       : [
					{
						text : '所有类型',
						value: '0'
					},
					{
						text : '图片',
						value: 1
					},
					{
						text : '音频',
						value: 2
					},
					{
						text : '视频',
						value: 3
					},
					{
						text : '图文',
						value: 4
					},
					{
						text : '文件',
						value: 5
					},
					{
						text : '文本',
						value: 6
					},
					{
						text : '小程序',
						value: 7
					}
				],
				value1     : 0,
				value2     : 1,
				value3     : 'init',

				scrollTop : 0,
				old       : {
					scrollTop: 0
				},
				//	数据请求对象
				file_name : '', // 附件名称
				file_type : '0', // 类型
				s_date    : fun_date(6), // 开始时间
				e_date    : now_date(), // 结束时间
				order_type: '', // 排序字段
				order_sort: '', // 正序倒序
				pages     : 1,
				user_ids  : [],//选择的成员
				userCount : 0,//选择的成员数量
				counts    : 0,

				//	返回数据
				contentData    : [],
				//	判断升序降序条件
				iconIndexOne   : true,
				iconIndexTwo   : true,
				iconIndexThree : true,
				currentItemName: '类型',//选择的类型名称
				showChooseDepartment  : false,//选择成员组件的显示与隐藏
				selectDepartment      : [],//已选择的成员
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		name             : "statistics",
		onLoad () {
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
			// this.getContentInfo()

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
		onPullDownRefresh: function () {
			this.page = 1
			this.getContentInfo();
		},

		onReachBottom: function () {
			if (this.contentData.length < this.counts) {
				this.page += 1
				this.getContentInfo(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		methods      : {
			init () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.getContentInfo()
			},
			loadMore (e) {
				if (!this.isLoading) {
					this.isLoading = true;
					if (this.contentData.length < this.counts) {
						this.page += 1
						this.getContentInfo(this.page)
					} else {
						this.loadingText = '已加载全部'
					}
				}
			},
			aaa(){
				this.$refs.dropdownItemc.closePopup()
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
					this.getContentInfo()
				}
			},
			changeDateIndex (index, name) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					this.range = []
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					if (index != 4) {
						this.timeName = name
					}
				}
				this.page = 1
				this.loadingText = '加载中...'
				// this.$refs.dropdownItemc.closePopup()
			},
			abc () {
				if (this.contentData.length < this.counts) {
					this.pages += 1
					this.getContentInfo(this.pages)
				} else {
					this.loadingText = '已加载全部'
				}
			},
			today () {
				this.s_date = this.nowDay
				this.e_date = this.nowDay
				this.getContentInfo()
				this.$refs.dropdownItemc.closePopup()
			},
			ytday () {
				this.s_date = this.yesterday
				this.e_date = this.yesterday
				this.getContentInfo()
				this.$refs.dropdownItemc.closePopup()
			},
			week () {
				this.s_date = this.weekDay
				this.e_date = this.nowDay
				this.getContentInfo()
				this.$refs.dropdownItemc.closePopup()
			},
			month () {
				this.s_date = this.months
				this.e_date = this.nowDay
				this.getContentInfo()
				this.$refs.dropdownItemc.closePopup()
			},
			onShowDatePicker (type) {//显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type]
			},
			onSelected (e) {//选择
				this.showPicker = false;
				// this.$refs.dropdownItemc.closePopup()
				if (e) {
					this[this.type] = e.value;
					if (this.range.length > 0) {
						this.s_date = this.range[0]
						this.e_date = this.range[1]
						this.timeName = this.s_date + '-' + this.e_date
						this.page = 1
						this.loadingText = '加载中...'
						this.getContentInfo()
					}
					this.$refs.dropdownItemc.closePopup()
				}
			},
			//按下回车键搜索
			searchEnterFun (e) {
				this.file_name = e.value
				clearTimeout(this.searchTimeout)

				this.searchTimeout = setTimeout(() => {
					this.getContentInfo()
				}, 300)
			},
			select (data) {
				this.file_type = data.value
				this.currentItemName = data.text
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.page = 1
				this.loadingText = '加载中...'
				this.getContentInfo()
				this.$refs.dropdownItema.closePopup()
			},
			search () {
				this.iconIndexOne = !this.iconIndexOne
				if (this.iconIndexOne) {
					this.order_sort = '3'
					this.getContentInfo()
				} else {
					this.order_type = 'search_num'
					this.order_sort = '4'
					this.getContentInfo()
				}
			},
			send () {
				this.iconIndexTwo = !this.iconIndexTwo
				if (this.iconIndexTwo) {
					this.order_sort = '3'
					this.getContentInfo()
				} else {
					this.order_type = 'send_num'
					this.order_sort = '4'
					this.getContentInfo()
				}
			},
			open () {
				this.iconIndexThree = !this.iconIndexThree
				if (this.iconIndexThree) {
					this.order_sort = '3'
					this.getContentInfo()
				} else {
					this.order_type = 'open_num'
					this.order_sort = '4'
					this.getContentInfo()
				}
			},
			async getContentInfo (page = 1) {
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
				const {data: res} = await this.axios.post('wap-user-desktop/get-attachment-statistic', {
						user_id   : localStorage.getItem('user_id'),
						uid       : localStorage.getItem('uid'),
						corp_id   : localStorage.getItem('corpid'),
						file_type : this.file_type, // 类型
						order_type: this.order_type, // 排序字段
						order_sort: this.order_sort, // 正序倒序
						file_name : this.file_name, // 附件名称
						s_date    : this.s_date, // 开始时间
						e_date    : this.e_date, // 结束时间
						page      : page,
						user_ids  : this.user_ids
					}
				)
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
					this.pages = page
					this.show = res.data.show
					this.userCount = res.data.user_count
					if (this.pages == 1) {
						this.contentData = res.data.fileData
						this.counts = res.data.count
					} else {
						this.contentData = this.contentData.concat(res.data.fileData)
					}
					this.isLoading = false
					if (this.contentData.length == this.counts) {
						this.isLoading = true
						this.loadingText = '已加载全部'
					}
					// uni.stopPullDownRefresh();
				}
			},

			//滑动表格区域
			upper : function (e) {
			},
			lower : function (e) {
			},
			scroll: function (e) {
				console.log(e.detail.scrollLeft)
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
			//返回
			back () {
				this.selectDepartment = []
				let userIdx = localStorage.getItem('tab4') !== null ? localStorage.getItem('tab4') :0
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				window.location.href = this.$store.state.h5Url + '/h5/pages/scrm/contents?tax=2&uix=' + userIdx + '&agent_id=' + agent_id
			},
		},

		components: {
			msDropdownMenu,
			msDropdownItem,
			MxDatePicker,
			Footer,
			ChooseDepartment
		}
	}
</script>

<style scoped lang="less">
	.container {
		background: #F2F3F5;

		/*bottom: 2.667rem;*/
		font-size: 0.8rem /* 15/18.75 */;
		overflow-y: auto;

		.title {
			background: #FFF;
			text-align: left;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 12;
		}

		.header {
			display: flex;
			width:100%;
			height: 2.4rem;
			background: rgba(255, 255, 255, 1);

			.htitle {
				flex-grow: 1;
				text-align: center;
				line-height: 1.6rem;
				font-size: 0.747rem;
				font-weight: bold;
				color: rgba(153, 153, 153, 1);
				/*line-height: 2.133rem;*/
			}
		}

		/deep/ .iconfont {
			font-size: 0.693rem
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem;
		}


		/deep/ .dropdown-item__selected {
			padding: 0;
		}


		.table {
			width: 100%;
			/*height: 100%;*/

			.table_left {
				width: 6.88rem;
				position: absolute;
				left: 0;
				top: 0;
				/*float: left;*/
				box-shadow: 0.107rem 0rem 0.32rem rgba(31, 34, 41, 0.08);
				z-index: 9;

				.t_tile {
					width: 6.88rem;
					font-size: 0.64rem;
					font-weight: 500;
					color: rgba(122, 122, 122, 1);
					line-height: 1.6rem;
					background: rgba(243, 243, 247, 1);
					text-align: center;
				}
			}

			.scroll {
				margin-left: 6.88rem;
				height: 100%;
				background: rgba(255, 255, 255, 1);

				.table_right {
					.clock {
						display: inline-block;
					}

					.title_right {
						background: rgba(243, 243, 247, 1);
						font-size: 0.64rem;
						font-weight: 500;
						color: rgba(122, 122, 122, 1);
						line-height: 1.6rem;
						width: 5.2rem;
						text-align: center;
					}
				}
			}
		}

		/deep/ .dropdown-item:not(:last-child):after {
			display: none;
		}

		.item {
			height: 2.667rem;
			padding-left: 0.747rem;
			background: rgba(255, 255, 255, 1);
			border-bottom: 0.053rem solid rgba(243, 243, 247, 1);
			/*overflow: hidden; !*内容超出后隐藏*!*/
			/*text-overflow: ellipsis; !*超出部分以省略号显示*!*/
			/*white-space: nowrap; !*文本不进行换行*!*/

			.item_title {
				width: 3.733rem;
			}
		}

		.count-item {
			display: flex;
			width: 5.2rem;
			height: 2.667rem;
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

		.searchBar {
			height: 2.133rem;
			box-sizing: border-box;
			padding: 0;
			width: calc(100% - 8rem /* 150/18.75 */);
			background: #FFF;

			/deep/ .uni-searchbar__box {
				margin: 0.267rem /* 5/18.75 */ 0;
				border-color: #F2F2F2;
			}
		}

		/deep/.uni-searchbar__box{
			height: 1.6rem;
			padding-top: 0.267rem;
		}

		#currentItemStyle {
			color: #01B065;
		}

		.back {
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

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem;
			/*white-space: nowrap;*/
			/*text-overflow: ellipsis;*/
			/*overflow: hidden;*/
			overflow: hidden;
			white-space: nowrap;
			word-break: break-all;
			text-overflow: ellipsis;
			max-width: 3.733rem;
		}

		/deep/.uni-searchbar__box-icon-clear{
			display: flex;
			align-items: center;
		}

		uni-view /deep/.scroll-view-item_H{
			display: inline-block;
		}

		.scroll_left {
			transition:left 50ms;
		}
	}
</style>
