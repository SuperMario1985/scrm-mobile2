<template>
	<view class="follow_container">
		<view class="header content_head"
		      style="box-shadow: 0 0.053rem  /* 1/18.75 */ 0.213rem  /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);background: #FFF;position: fixed;box-sizing: border-box;top: 43px;z-index:999;"
		      v-if="!showChooseDepartment">
			<view style=" display: flex;width: 100%;height: 2.133rem;margin: 0.2rem 0">
				<!--				v-show="show==0"-->
				<view @click="chooseStaff"
				      style="flex-grow: 1;;text-align: center;line-height: 2.133rem;font-weight: bold;font-size: 0.747rem;color: #999;">
					<view style="cursor: pointer;font-size: 0.747rem;display: inline-block;">
						<span v-if="userCount == 0" style="cursor: pointer">选择成员</span>
						<span v-if="userCount > 0">{{userCount}}个成员</span>
					</view>
					<uni-icons type="arrowdown"
					           style="font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
				</view>
				<ms-dropdown-menu style="flex-grow: 1;font-size: 0.747rem">
					<ms-dropdown-item
							style="font-size: 0.747rem;display: flex;
                            justify-content: center;font-weight: bold;color: #999;"
							:hasSlot="true"
							:title="timeName" ref="dropdownItemD">
						<view class="dropdown-item-content"
						      style="z-index: 99999999999;line-height: 2.133rem;text-align: center">
							<view :id="dateIndex==0 ? 'ChangeColor' : ''" @click="lastWD(),changeDateIndex(0,'上一周')">
								上一周
							</view>
							<view :id="dateIndex==1 ? 'ChangeColor' : ''" @click="lastMD(),changeDateIndex(1,'上一月')">
								上一月
							</view>
							<view :id="dateIndex==2 ? 'ChangeColor' : ''" @click="weekD(),changeDateIndex(2,'本周')">本周
							</view>
							<view :id="dateIndex==3 ? 'ChangeColor' : ''" @click="monthD(),changeDateIndex(3,'本月')">本月
							</view>
							<view :id="dateIndex==4 ? 'ChangeColor' : ''"
							      @click="onShowDatePicker('range1'),changeDateIndex(4)">自定义时间
							</view>
						</view>
					</ms-dropdown-item>
				</ms-dropdown-menu>
			</view>
			<mx-date-picker :showTips="true" format="yyyy-mm-dd" :show="showPicker" :type="dtype"
			                :value="value"
			                :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true"
			                @confirm="onSelected" @cancel="onSelected"/>
			<view style="background: #F1F3F5;">
				<view class="nav_tab"
				      style="background: #FFF;padding:0.16rem 0 0.533rem  /* 8/18.75 */;">
						<button @click="changeIndex(0)" :class="index == 0 ? 'activity-btn' : ''"
						        style="width: 30%;
					height: 1.28rem;line-height: 1.28rem;
					border-radius: 0.64rem;
					border: 0px solid #DFDFDF;
					font-size:0.7rem;
					font-weight:500;
					background: #F3F3F3;
					color: #656565;margin-left: 2.5%;
" type="default" size="mini" plain="true">未跟进
						</button>
						<button @click="changeIndex(1)" :class="index == 1 ? 'activity-btn' : ''"
						        style="width: 30%;
					height: 1.28rem;line-height: 1.28rem;
					border: 0px solid #DFDFDF;
					border-radius: 0.64rem;
					border: 0px solid #DFDFDF;
					font-size:0.7rem;
					font-weight:500;
					background: #F3F3F3;
					color: #656565;margin-left: 2.5%;
" type="default" size="mini" plain="true">已跟进
						</button>
						<button @click="changeIndex(2)" :class="index == 2 ? 'activity-btn' : ''" style="width: 30%;
					height: 1.28rem;line-height: 1.28rem;
					border-radius: 0.64rem;
					border: 0px solid #DFDFDF;
					font-size:0.7rem;
					font-weight:500;
					background: #F3F3F3;
					color: #656565;margin-left: 2.5%;
" type="default" size="mini" plain="true">跟进漏斗
						</button>
				</view>
			</view>
		</view>
		<!--  未跟进	-->
		<view v-if="index==0 && !showChooseDepartment" style="margin-top: 7.331rem  /* 137/18.75 */;">
			<view style="background: #F1F3F5;padding-top: 0.533rem">
				<view class="top" style="background: #FFF">
					<view class="item_top">未跟进TOP10</view>
					<view>
						<ms-dropdown-menu style="
						font-size: 0.64rem;
						width: 5.8rem;
						height: 1.387rem;
						display: flex;
						align-items: center;
						color: #999;
						border: 0.027rem solid #F2F2F2;
						border-radius: 0.693rem; " class="aaaa">
							<ms-dropdown-item
									style="font-size: 0.75rem; text-align: center;font-weight: bold;color: #999;"
									:hasSlot="true"
									:title="statusName" ref="dropdownItems">
								<view class="dropdown-item-content"
								      style="line-height: 2.133rem;font-size: 0.747rem;height: 10.133rem"
								      id="statusSelect"
								>
									<view :class="statusIndex=='0' ? 'statuscolor' : ''"
									      @click="changeStatus('0','全部状态')">
										全部状态
									</view>
									<view v-for="(item,index) in statusData"
									      :key="index" :class="statusIndex==item.id ? 'statuscolor' : ''"
									      @click="changeStatusIndex(item,item.title)">{{ item.title }}
									</view>
								</view>
							</ms-dropdown-item>
						</ms-dropdown-menu>
					</view>
				</view>
			</view>

			<!--	未跟进柱状图		-->
			<view>
				<!--	 未跟进天数		-->
				<view class="not_follow" style="background: #FFF">
					<text
							@click="changedayid(-1)" class="not_follow_day">
						<text :id="keys==-1 ? 'not_style':''" style="padding: 0.2rem 0.5rem">全部未跟进</text>
					</text>
					<text v-for="(item,index) in NotFollowDays" :key="index"
					      @click="changekeys(item)" class="not_follow_day">
						<text :id="keys==item.key ? 'not_style':''" style="padding: 0.2rem 0.5rem">{{ item.name }}
						</text>
					</text>
				</view>
				<view>
					<view style="background: #FFF;padding-bottom: 0.8rem;padding-top: 0.533rem">
						<view v-for="(item,index) in barr" :key="index"
						      style="padding: 0 1rem 0;display: flex;justify-content: start">
							<view v-if="titleActive==false" style="width: 100%;">
								<view style="width: 100%;height: 1.067rem;">
									<view style="float: left" class="title_style">{{ xarr[index] }}</view>
									<text style="float: right" class="font_style">{{ countArr[index] }}位</text>
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
			</view>

			<!--	 未跟进趋势		-->
			<view style="background: #F1F3F5;padding-top: 0.533rem">
				<view style="background: #FFF;">
					<view class="top">
						<view class="item_top">未跟进趋势</view>
					</view>
					<!--	 图表切换		-->
					<view style="display: flex;margin: 0.533rem 0 0.267rem 0;justify-content: center;margin-right: 0.533rem;">
						<button :class="chartIndex==0 ? 'chartColor':''" @click="changeChart(0)" style="width: 3.147rem;
						height: 1.3rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-right: 0;
						border-radius: 0.533rem 0px 0px 0.533rem;
						margin: 0;
						font-size: 0.587rem;
						font-weight: 500;
						color: #333333;
						line-height:1.3rem;
						" type="default" plain="">饼图
						</button>
						<button :class="chartIndex==1 ? 'chartColor':''" @click="changeChart(1)" style="width: 3.147rem;
						height: 1.3rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-radius: 0px 0.533rem 0.533rem 0rem;
						margin: 0;
						font-size: 0.587rem;
						font-weight: 500;
						color: #333333;
						line-height:1.3rem;
						" type="default" plain="">折线图
						</button>
					</view>
					<!--	 未跟进天数		-->
					<view class="not_follow">
						<text v-for="(item,index) in NotFollowDays" :key="index"
						      @click="changechartkeys(item)" class="not_follow_day">
							<text style="padding: 0.2rem 0.5rem" :id="chartkeys==item.key ? 'not_style':''">{{ item.name
								}}
							</text>
						</text>
					</view>
					<!--  饼状图	-->
					<canvas v-show="chartIndex==0" canvas-id="canvasPie" id="canvasPie" class="charts"
					        @touchstart="touchPie"></canvas>
					<!--  折线图	-->
					<canvas v-if="chartIndex==1" canvas-id="canvasLineA" id="canvasLineA" class="charts3"
					        @touchstart="touchLineA"></canvas>
					<!--	 未跟进详细数据		-->
					<view style="background: #F1F3F5;padding: 0.533rem 0">
						<view style="background: #FFF;text-align: center" @click="goData">
							<text class="data">未跟进详细数据</text>
							<uni-icons type="arrowright"
							           style=" font-size:0.8rem;color: #000;margin-left: 0.373rem"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--   已跟进	-->
		<view v-if="index==1 && !showChooseDepartment"
		      style="background: #F1F3F5;margin-top: 7.331rem  /* 137/18.75 */;">
			<view style="background: #F1F3F5;padding-top: 0.533rem">
				<!--     未跟进区域		-->
				<view class="trend" style="background: #FFF;padding-top: 0.8rem;">
					<view>
						<view class="view_p">已跟进Top10</view>
					</view>
					<view class="select_chart">
						<button :class="coms==0 ? 'chartColor':''" @click="changecoms(0)" style="width:4.8rem;
						height: 1.3rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-right: 0;
						border-radius: 0.533rem 0px 0px 0.533rem;
						margin: 0;
						margin-left: 0.533rem;
						font-size: 0.587rem;
						font-weight: 500;
						color: #333333;
						line-height:1.3rem;
						" type="default" plain="">跟进客户数
						</button>
						<button :class="coms==1 ? 'chartColor':''" @click="changecoms(1)" style="width: 4.8rem;
						height: 1.3rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-radius: 0px 0.533rem 0.533rem 0rem;
						margin: 0;
						font-size: 0.587rem;
						font-weight: 500;
						color: #333333;
						line-height:1.3rem;
						" type="default" plain="">跟进次数
						</button>
					</view>
					<!-- 跟进成员柱状图 -->
					<view>
						<view style="background: #FFF;padding: 0.8rem 0">
							<view v-for="(item,index) in barr" :key="index"
							      style="padding: 0 1rem 0;display: flex;justify-content: start">
								<view v-if="titleActive==false" style="width: 100%">
									<view style="width: 100%;height: 1.067rem;">
										<view style="float: left" class="title_style">{{ xarr[index] }}</view>
										<text v-if="coms==0" style="float: right" class="font_style">{{ countArr[index]
											}}位
										</text>
										<text v-if="coms==1" style="float: right" class="font_style">{{ countArr[index]
											}}次
										</text>

									</view>
									<view class="text_style">
										<view style="width: 100%;display: flex;justify-content: start">
											<view v-if="item>0" :style="{'width':item+'%'}" class="color"></view>
											<view v-if="item==0" class="item0"></view>
										</view>

									</view>
								</view>
							</view>
						</view>
					</view>
					<!--	 未跟进图表区域		-->
				</view>
			</view>
			<!--     已跟进区域		-->
			<view>
				<view style="margin-top: 0.533rem;background: #FFF;">
					<view class="top" style="padding-left: 0">
						<view class="view_p">已跟进趋势</view>
						<!--						<view class="text">在2020-08-10至2020-08-14内，所有成员已跟进走势情况</view>-->
					</view>
					<!--	 已跟进图表区域		-->
					<canvas canvas-id="canvasLineB" class="charts2" @touchstart="touchLineB"></canvas>

					<!--	 已跟进详细数据		-->
					<view style="background: #F1F3F5;padding: 0.533rem 0">
						<view style="background: #FFF;text-align: center" @click="goFollowUpData()">
							<text class="data">已跟进详细数据</text>
							<uni-icons type="arrowright"
							           style=" font-size:0.8rem;color: #000;margin-left: 0.373rem"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--	跟进漏斗	-->
		<view v-show="index==2 && !showChooseDepartment" style="margin-top: 7.331rem  /* 137/18.75 */;">
			<view style="background: #F1F3F5;padding-top: 0.533rem">
				<!--	 漏斗图		-->
				<view class="qiun-charts" style="padding-top: 0.533rem;background: #FFF">
					<canvas canvas-id="canvasFunnel" id="canvasFunnel" class="qiun-charts"
					        @touchstart="touchFunnel" v-if="isShowFunnel"></canvas>
					<img src="../../static/scrm/funnelEmpty.png" alt="" v-if="!isShowFunnel"
					     style="width: 54%;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);">
				</view>
			</view>

			<!--	 跟进表格区域		-->
			<view class="warp" style="background: #F1F3F5;padding-top: 0.533rem">
				<view class="box">
					<view class="view_p">详细数据</view>
					<t-table border="0" border-color="#ccc" @change="change">
						<t-tr style="background: #F1F3F5;">
							<t-th class="table_th">跟进阶段</t-th>
							<t-th class="table_th">客户数</t-th>
							<t-th class="table_th">占比</t-th>
							<t-th class="table_th">阶段转化率</t-th>
							<t-th class="table_th">最长停留天数</t-th>
							<t-th class="table_th">平均停留天数</t-th>
						</t-tr>
						<t-tr v-for="(item,index) in followdata" :key="index">
							<t-td class="table_th2">{{ item.name }}</t-td>
							<t-td class="table_th2">{{ item.num }}</t-td>
							<t-td class="table_th2">{{ item.per }}</t-td>
							<t-td class="table_th2">{{ item.rate }}</t-td>
							<t-td class="table_th2">{{ item.day }}</t-td>
							<t-td class="table_th2">{{ item.everyDay }}</t-td>
						</t-tr>
					</t-table>
				</view>
			</view>
			<view class="custom-tabs-loading" v-if="followdata.length > 0">{{loadingText}}</view>
		</view>

		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>

	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
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

	// if(nowMonth<10){
	// 	nowMonth='0'+nowMonth
	// }
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

	//ucharts图形配置
	var _self;
	var canvaFunnel = null;
	var canvaColumn = null;
	var canvaPie = null;
	var canvaLineA = null;
	var canvaLineB = null;

	export default {
		name         : "followup.vue",
		inject       : ['initPage', 'getParameter'],
		data () {
			let userIdx = localStorage.getItem('tab3') !== null ? localStorage.getItem('tab3') : (this.getParameter('gix') !== null ? this.getParameter('gix') : 0)

			return {
				select       : false,
				page         : 1,
				count        : 0,
				isShowFunnel : false,//漏斗占位图的显示与隐藏
				loadingText  : '加载中...',
				titleActive  : false,
				countArr     : [],
				barr         : [],
				xarr         : [],
				show         : null,
				coms         : 0,
				type         : 1,
				//切换图表天数
				chartkeys    : 0,
				chartdayId   : -3,
				//折线图
				lWidth       : '',
				lHeight      : '',
				lWidth2      : '',
				lHeight2     : '',
				//饼状图数据
				pWidth       : '',
				pHeight      : '',
				//柱状图数据
				uWidth       : '',
				uHeight      : '',
				serverData   : '',
				//漏斗图数据
				cWidth       : '',
				cHeight      : '',
				pixelRatio   : 1,
				textarea     : [],
				notIndex     : 0,
				chartIndex   : 0,
				dateIndex    : 2,
				index        : userIdx,
				//未跟进天数数据
				NotFollowDays: [],
				keys         : -1,
				dayId        : -1,
				//状态
				// followId:0,
				statusIndex  : '0',
				statusName   : '全部状态',//选择的状态名
				statusData   : [],
				//	漏斗数据请求参数
				s_date       : getWeekStartDate(),
				e_date       : now_date(),
				user_ids     : [],
				userCount    : 0,//选择的成员数量
				//	日期计算
				range1       : [],
				dtype        : 'range1',
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
				month_e      : now_date(),

				//	表格数据
				followdata          : [],
				timeName            : '本周',//选择的时间的名称
				showChooseDepartment: false,//选择成员组件的显示与隐藏
				selectDepartment    : [],//已选择的成员
			}
		},
		created      : function () {
			localStorage.setItem('tab3', '')


			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'TWFpblVzZXItOTZlOWM3Njg1OGE0OTE3NTZlOGNhOTM1MGYwZDc4ZmQ=')
			// localStorage.setItem('agent_id', 5)

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
			this.cHeight = 300;
			//柱状图
			this.uWidth = uni.upx2px(750);
			this.uHeight = uni.upx2px(600);
			// this.getfollowup();
			//	饼状图
			this.pWidth = uni.upx2px(750);
			this.pHeight = 360;
			// this.getNotFollowCharts();
			//	折线图
			this.lWidth = uni.upx2px(700);
			this.lHeight = 350;
			this.lWidth2 = uni.upx2px(750);
			this.lHeight2 = 300;

			this.selectDepartment = []
			this.user_ids = []
			this.userCount = 0
			this.dateIndex = 2
			this.timeName = '本周'
			this.range1 = []
			this.s_date = getWeekStartDate()
			this.e_date = now_date()

			if (this.index == 1) {
				this.type = 2
				this.getFollowTop()
				this.getUInfo()
			} else if (this.index == 0) {
				this.type = 1

				this.$nextTick(() => {
					this.getNotFollowCharts(1);
					this.getNotFollowDay()
					this.getFollowTop()
					this.getStatus()
				})
			} else if (this.index == 2) {
				this.getfollowup()
			}
		},
		onReachBottom: function () {
			if (this.followdata.length < this.count) {
				this.page += 1
				this.getfollowup(this.page)
			} else {
				this.loadingText = '已加载全部'
			}
		},
		methods      : {
			//跳转到已跟进数据页面
			goFollowUpData () {
				this.user_ids = []
				this.userCount = 0
				this.selectDepartment = []
				this.type = 2
				this.dateIndex = 2
				this.timeName = '本周'
				this.range1 = []
				this.s_date = getWeekStartDate(),
					this.e_date = now_date(),
					this.getFollowTop()
				this.getUInfo()
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/follow_up_data?corpId=' + localStorage.getItem('corpid') + '&agent_id=' + agent_id
				});
			},
			//已跟进趋势图
			async getUInfo () {
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
				const {data: res} = await this.axios.post('follow-statistic/analysis-three', {
					corp_id : localStorage.getItem('corpid'),
					uid     : localStorage.getItem('uid'),
					user_id : localStorage.getItem('user_id'),
					user_ids: this.user_ids,
					s_date  : this.s_date,
					e_date  : this.e_date,
					page    : null,
					pageSize: null,
					type    : 2
				})
				this.userCount = res.data.user_count
				let LineA = {categories: [], series: []};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				LineA.categories = res.data.xData;
				LineA.series = res.data.seriesData;
				_self.showLineB("canvasLineB", LineA);
			},
			showLineB (canvasId, chartData) {
				canvaLineB = new uCharts({
					$this         : _self,
					canvasId      : canvasId,
					type          : 'line',
					fontSize      : 11,
					lineHeight    : 16,
					legend        : {
						show      : true,
						lineHeight: 16,
					},
					//调整边距
					padding       : [20, 30, 0, 15],
					dataLabel     : false,
					dataPointShape: true,
					background    : '#FFFFFF',
					pixelRatio    : _self.pixelRatio,
					categories    : chartData.categories,
					series        : chartData.series,
					// animation     : true,
					xAxis         : {
						type         : 'grid',
						axisLineColor: '#F2F2F2',
						gridType     : 'dash',
						dashLength   : 8,
						labelCount   : 3,
						disableGrid  : true,
					},
					yAxis         : {
						gridType   : 'dash',
						dashLength : 8,
						splitNumber: 5,
						disableGrid: true,
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
					width         : document.body.clientWidth * _self.pixelRatio,
					height        : _self.cHeight * _self.pixelRatio,
					extra         : {
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
				canvaLineB.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
				canvaLineB.touchLegend(e, {animation: true});
			},
			//切换跟进次数
			changecoms (index) {
				if (index != this.coms) {
					this.coms = index
				}
				switch (index) {
					case 0:
						this.type = 2
						this.getFollowTop()
						break;
					case 1:
						this.type = 3
						this.getFollowTop()
						break;
				}
			},
			//跳转到详细数据
			goData () {
				this.$emit('func',true)
				this.user_ids = []
				this.userCount = 0
				this.selectDepartment = []
				this.type = 1
				this.dateIndex = 2
				this.timeName = '本周'
				this.range1 = []
				this.s_date = getWeekStartDate(),
					this.e_date = now_date(),
					this.getFollowTop()
				this.getNotFollowCharts()
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/DetailedData?corpId=' + localStorage.getItem('corpid') + '&agent_id=' + agent_id
				});
			},
			changeStatus (index, name) {
				if (index != this.statusIndex) {
					this.statusIndex = index
					this.statusName = name
				}
				this.getFollowTop()
				this.$refs.dropdownItems.closePopup()
			},
			changeStatusIndex (item, name) {
				if (item.id != this.statusIndex) {
					this.statusIndex = item.id
					this.statusName = name
				}
				this.getFollowTop()
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
			//获取饼图、折线图数据
			async getNotFollowCharts (sum) {
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
				const {data: res} = await this.axios.post('follow-statistic/analysis-one', {
					corp_id  : localStorage.getItem('corpid'),
					uid      : localStorage.getItem('uid'),
					user_id  : localStorage.getItem('user_id'),
					user_ids : this.user_ids,
					s_date   : this.s_date,
					e_date   : this.e_date,
					status_id: this.chartdayId
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
						res.data.user_count = 0
					}
					this.userCount = res.data.user_count
					let Pie = {series: []};
					res.data.pieData.map(item => {
						item.data = Number(item.value)
					})
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					Pie.series = res.data.pieData;
					_self.showPie("canvasPie", Pie);

					let LineA = {categories: [], series: []};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					LineA.categories = res.data.xData;
					LineA.series = res.data.seriesData;
					_self.showLineA("canvasLineA", LineA);
				}
			},
			showPie (canvasId, chartData) {
				canvaPie = new uCharts({
					$this     : _self,
					canvasId  : canvasId,
					type      : 'pie',
					fontSize  : 11,
					padding   : [60, 0, 0, 0],
					legend    : {
						show      : true,
						lineHeight: 18,
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series    : chartData.series,
					// animation : true,
					width     : document.body.clientWidth * _self.pixelRatio,
					height    : _self.pHeight * _self.pixelRatio,

					dataLabel: true,
					extra    : {
						pie: {
							lableWidth: 15
						},
						// format       : (val) => {
						// 	return val.toFixed(3)
						// }
					},
				});
			},
			touchPie (e) {
				canvaPie.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data
					}
				});
			},
			//折线图
			showLineA (canvasId, chartData) {
				canvaLineA = new uCharts({
					$this         : _self,
					canvasId      : canvasId,
					type          : 'line',
					fontSize      : 11,
					legend        : {
						show      : true,
						lineHeight: 18,
					},
					dataLabel     : false,
					dataPointShape: true,
					background    : '#FFFFFF',
					//调整边距
					padding       : [20, 30, 0, 15],
					pixelRatio    : _self.pixelRatio,
					categories    : chartData.categories,
					series        : chartData.series,
					// animation : true,
					xAxis         : {
						type         : 'grid',
						axisLineColor: '#F2F2F2',
						gridType     : 'dash',
						dashLength   : 8,
						labelCount   : 3,
						disableGrid  : true,
						// boundaryGap:'center'
					},
					yAxis         : {
						gridType   : 'dash',
						gridColor  : '#CCCCCC',
						dashLength : 8,
						splitNumber: 5,
						disableGrid: true,
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
					width         : document.body.clientWidth * _self.pixelRatio,
					height        : _self.lHeight * _self.pixelRatio,
					extra         : {
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
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				})
				canvaLineA.touchLegend(e, {animation: true});
			},
			changechartkeys (item) {
				if (item.key != this.chartkeys) {
					this.chartkeys = item.key
				}
				this.chartdayId = item.id
				this.getNotFollowCharts()
			},
			changedayid (index) {
				if (index != this.keys) {
					this.keys = index
				}
				if (this.keys == -1) {
					this.dayId = -1
				}
				this.getFollowTop()
			},
			changekeys (item) {
				if (item.key != this.keys) {
					this.keys = item.key
				}
				this.dayId = item.id
				this.getFollowTop()
			},
			//获取未跟进天数
			async getNotFollowDay () {
				const {data: res} = await this.axios.post('follow-statistic/days', {
					uid: localStorage.getItem('uid')
				})
				this.NotFollowDays = res.data
			},
			//获取未跟进成员top
			async getFollowTop () {
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
				const {data: res} = await this.axios.post('follow-statistic/top', {
					corp_id  : localStorage.getItem('corpid'),
					uid      : localStorage.getItem('uid'),
					user_id  : localStorage.getItem('user_id'),
					user_ids : this.user_ids,
					s_date   : this.s_date,
					e_date   : this.e_date,
					page     : null,
					pageSize : null,
					type     : this.type,
					status_id: this.dayId,
					follow_id: this.statusIndex
				})
				if (res.error != 0) {
					this.$emit('func',false)
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.show = res.data.show
					// _self.serverData = res.data;
					let l = res.data.seriesData
					this.countArr = res.data.seriesData
					let max = Number(l[0])
					let b = []
					for (let i = 0; i < l.length; i++) {
						if (max < l[i]) {
							max = l[i]
						}
					}
					if (l.length == 0) {
						this.titleActive = true
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
					this.$emit('func',false)
				}
				//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
				let Column = {categories: [], series: []};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				Column.categories = res.data.xData;
				let s = [{
					name: '成员Top10',
					data: res.data.seriesData
				}]
				Column.series = s
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
						// labelCount : 4,
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
					height    : _self.cHeight * _self.pixelRatio,
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


			showFunnel (canvasId, chartData) {
				if (typeof chartData.series != 'undefined' && chartData.series.length > 0) {
					for (let i = 0; i < chartData.series.length; i++) {
						chartData.series[i].data = Number(chartData.series[i].data)
					}
				} else {
					chartData.series = []
				}
				canvaFunnel = new uCharts({
					$this     : _self,
					canvasId  : canvasId,
					type      : 'funnel',
					fontSize  : 11,
					padding   : [15, 15, 0, 15],
					legend    : {
						show      : true,
						padding   : 5,
						lineHeight: 18,
						margin    : 0,
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series    : chartData.series,
					animation : true,
					width     : document.body.clientWidth * _self.pixelRatio,
					height    : _self.cHeight * _self.pixelRatio,
					dataLabel : true,
					extra     : {
						funnel: {
							border     : true,
							borderWidth: 2,
							borderColor: '#FFFFFF'
						}
					},
				});
			},
			touchFunnel (e) {
				canvaFunnel.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data
					}
				});
				// canvaFunnel.touchLegend(e, {animation: true});
			},
			changeData () {
				if (isJSON(_self.textarea)) {
					let newdata = _self.textarea;
					canvaFunnel.updateData({
						series    : newdata.series,
						categories: newdata.rate
					});
				} else {
					uni.showToast({
						title: '数据格式错误',
						image: '../../../static/images/alert-warning.png'
					})
				}
			},
			changeNotIndex (index) {
				if (index != this.notIndex) {
					this.notIndex = index
				}
			},
			changeChart (index) {
				if (index != this.chartIndex) {
					this.chartIndex = index
				}
				this.getNotFollowCharts()
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
				this.$emit('func',this.showChooseDepartment)
			},
			replyDepartment (arr) {
				document.getElementsByClassName('content_head')[0].style.display = 'initial'
				this.showChooseDepartment = false
				this.$emit('func',this.showChooseDepartment)
				uni.showTabBar()
				if (typeof arr == 'object') {
					this.selectDepartment = arr
					if (this.index == 0) {
						this.getNotFollowCharts()
						this.getFollowTop()
					} else if (this.index == 1) {
						this.getFollowTop()
						this.getUInfo()
					} else if (this.index == 2) {
						this.getfollowup()
					}
				}
			},
			change (e) {
			},
			changeDateIndex (index, name) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					this.range1 = []
					if (index != 4) {
						this.timeName = name
					}
				}

				localStorage.setItem('tab3', this.index)
				if (this.index == 0) {
					this.getFollowTop()
					this.getNotFollowCharts()
				} else if (this.index == 1) {
					this.getFollowTop()
					this.getUInfo()
				} else if (this.index == 2) {
					this.getfollowup()
				}

				this.page = 1
				this.loadingText = '加载中...'
				// this.$refs.dropdownItemD.closePopup()
			},
			changeIndex (index) {
				if (index != this.index) {
					this.$emit('func',true)
					this.index = index
					this.selectDepartment = []
					this.user_ids = []
					this.userCount = 0
					this.dateIndex = 2
					this.timeName = '本周'
					this.range1 = []
					this.s_date = getWeekStartDate()
					this.e_date = now_date()
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}

				localStorage.setItem('tab3', this.index)
				if (this.index == 0) {
					this.type = 1
					this.getFollowTop()
					this.getNotFollowCharts()
				} else if (this.index == 1) {
					this.type = 2
					this.getFollowTop()
					this.getUInfo()
				} else if (this.index == 2) {
					this.getfollowup(1)
				}
			},
			clear () {
				this.range1 = []
				this.$emit('clearArr')
			},
			async getfollowup (page = 1) {
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
				const {data: res} = await this.axios.post('follow-statistic/hopper', {
					corp_id : localStorage.getItem('corpid'),
					uid     : localStorage.getItem('uid'),
					s_date  : this.s_date,
					e_date  : this.e_date,
					user_id : localStorage.getItem('user_id'),
					user_ids: this.user_ids,
					page    : page
				})
				if (res.error != 0) {
					this.$emit('func',false)
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					let Funnel = {series: []};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					Funnel.series = res.data.series;
					// _self.textarea = res.data;
					_self.showFunnel("canvasFunnel", Funnel);
					this.isReady = true
					this.page = page
					this.userCount = res.data.user_count
					this.count = res.data.info.length
					this.isShowFunnel = false
					if (typeof res.data.series != 'undefined' && res.data.series.length > 0) {
						res.data.series.map(x => {
							if (Number(x.data) > 0) {
								this.isShowFunnel = true
							}
						})
					}

					if (page == 1) {
						this.followdata = res.data.info
						this.visible = true
					} else {
						this.followdata = this.followdata.concat(res.data.info)
					}
					if (this.followdata.length < 15) {
						this.loadingText = '已加载全部'
					}
					this.$emit('func',false)
				}

			},

			//		定义时间
			//		上一周
			lastWD () {
				this.s_date = this.last_week_s
				this.e_date = this.last_week_e
				this.$refs.dropdownItemD.closePopup()
			},
			//		上一月
			lastMD () {
				this.s_date = this.last_month_s
				this.e_date = this.last_month_e
				this.$refs.dropdownItemD.closePopup()
			},
			//		本周
			weekD () {
				this.s_date = this.week_s
				this.e_date = this.week_e
				this.$refs.dropdownItemD.closePopup()
			},
			//		本月
			monthD () {
				this.s_date = this.month_s
				this.e_date = this.month_e
				this.$refs.dropdownItemD.closePopup()
			},
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
					if (this.range1.length > 0) {
						this.s_date = this.range1[0]
						this.e_date = this.range1[1]
						this.timeName = this.range1[0] + '-' + this.range1[1]
						this.page = 1
						this.loadingText = '加载中...'
						this.getfollowup()
						this.getFollowTop()
						this.getNotFollowCharts()
						this.getUInfo()
						this.$refs.dropdownItemD.closePopup()
					}
				}
			},
		},
		components   : {
			msDropdownMenu,
			msDropdownItem,
			tTable,
			tTh,
			tTr,
			tTd,
			uCharts,
			MxDatePicker,
			ChooseDepartment
		}

	}
</script>

<style scoped lang="less">
	.follow_container {
		background: #FFF;
		overflow-y: auto;

		.header {
			width: 100%;

		}

		/deep/ .dropdown-item__selected[data-v-aa4f4da6] {
			padding: 0;
		}

		/deep/ .iconfont {
			font-size: 0.693rem
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem !important;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
			max-width: 3.733rem;
		}

		.activity-btn {
			background: #5183EB !important;
			color: #FFF !important;
		}

		.table_th {
			font-size: 0.64rem;
		}

		.table_th2 {
			font-size: 0.64rem;
			background: #FFF;
		}

		.view_p {
			font-size: 0.8rem;
			font-weight: bold;
			color: #212329;
			line-height: 1.6rem;
			padding-left: 0.533rem;
			text-align: left;
		}

		.text {
			font-size: 0.587rem;
			font-weight: 500;
			color: #999999;
			line-height: 1.6rem;
			padding-left: 0.533rem;
			text-align: left;
		}

		.chartColor {
			color: #FFFFFF !important;
			background: #5183EB !important;
			border-color: #5183EB !important;
		}

		.statuscolor {
			color: #5183EB !important;
			/*background: #5183EB !important;*/
		}


		.not_follow {
			/*width: 100%;*/
			display: flex;
			padding: 0.4rem 0.533rem 0;
			/*margin-top: 0.4rem;*/
			/*width: 18.933rem;*/
			flex-wrap: wrap;

			.not_follow_day {
				/*display: inline-block;*/
				/*flex-grow: 1;*/
				width: 33.3%;
				font-size: 0.6rem !important;
				text-align: center;
				font-weight: 500;
				color: #999999;
				line-height: 1.3rem;
				margin: 0.267rem 0;
			}

			#not_style {
				color: #FFF;
				/*border: 1px solid #4993F9;*/
				background: #5183EB;
				border-radius: 0.213rem;
			}
		}

		.container .tab_picker {
			width: 100% !important;
		}

		.data {
			font-size: 0.8rem;
			font-weight: 500;
			color: #000;
			line-height: 2rem;
			text-align: center;
		}

		.top {
			padding: 0.8rem 0.533rem 0;
			/*height: 2.133rem;*/
			display: flex;
			justify-content: space-between;

			.item_top {
				font-size: 0.8rem;
				font-weight: bold;
				color: #212329;
				line-height: 1.6rem;
			}

		}

		/*样式的width和height一定要与定义的cWidth和cHeight相对应*/

		.qiun-charts {
			width: 20rem;
			height: 17rem;
			background-color: #FFFFFF;
		}

		.charts {
			width: 100%;
			height: 22rem;
			background-color: #FFFFFF;
		}

		.charts2 {
			width: 100%;
			height: 16.5rem;
			background-color: #FFFFFF;
		}

		.charts3 {
			width: 100%;
			height: 19rem;
			background-color: #FFFFFF;
		}

		#ChangeColor {
			color: #5183EB !important;
			/*background: #5183EB !important;*/
		}

		.title_style {
			font-size: 0.747rem;
			margin-bottom: 0.16rem;
		}

		.color {
			background: #1890FF !important;
			height: 0.5rem;
			border-radius: 0.4rem;
		}

		.item0 {
			background: #CCC !important;
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

		.custom-tabs-loading {
			text-align: center;
			line-height: 1.6rem;
			font-size: 0.693rem;
			color: #CCC;
		}

		/deep/ .dropdown-item:not(:last-child):after {
			width: 0;
		}

		.box {
			background: #FFF;
		}

		.aaaa /deep/ .dropdown-item__content {
			margin-top: 0.267rem;
		}

		.view_p {
			font-size: 0.8rem;
			font-weight: bold;
			color: #212329;
			line-height: 1.6rem;
			padding-left: 0.533rem;
			text-align: left;
			background: #FFF;
			padding-bottom: 0.533rem;
		}

		.select_chart {
			display: flex;
			margin-top: 0.267rem;
			justify-content: flex-end;
			margin-right: 0.533rem;

			/deep/ uni-button {
				padding-left: 0;
				padding-right: 0;
			}
		}
	}
</style>