<template>
	<view v-if="isReady" class="container" style="background: #FFF">
		<view v-if="!showChooseDepartment" class="content">
			<view class="content_head" style="background: #FFF; position:fixed;top: 0;left:0;right:0;z-index: 999;">
				<view class="nav">
					<ms-tabs class="nav_title" :list="tabList" v-model="tabActiveIdx"></ms-tabs>
				</view>

				<view class="nav_tab" v-if="tabActiveIdx==2"
				      style=" background: #FFF;padding-top: 0.827rem;">
					<view class="button-sp-area">
						<view plain="true" class="tab-btn"
						      :class="index == 0 ? 'activity-btn' : ''" @click="changeIndex(0)">内容
						</view>
						<view plain="true" class="tab-btn"
						      :class="index == 1 ? 'activity-btn' : ''" @click="changeIndex(1)">员工
						</view>
						<view plain="true" class="tab-btn"
						      :class="index == 2 ? 'activity-btn' : ''" @click="changeIndex(2)">搜索词
						</view>
					</view>
					<view>
						<hr class="line_hr"/>
					</view>
					<view class="tab_picker">
						<view @click="open" v-show="index==0 || index==1" class="group_open">
							<view class="group_select2">
								<span v-if="groupName == ''" style="cursor: pointer">所有分组</span>
								<span v-if="groupName != ''" style="cursor: pointer">{{groupName}}</span>
							</view>
							<uni-icons type="arrowdown"
							           style=" font-size:0.8rem;color: #999;margin-left: 0.373rem"></uni-icons>
						</view>
						<ms-dropdown-menu style="flex-grow: 2;color: #999;">
							<ms-dropdown-item v-show="index==0 || index==1" v-model="value3" :list="list"
							                  :hasSlot="true" :title="currentItemName"
							                  ref="dropdownItemType"
							                  style="font-weight: bold;"
							>
								<view class="dropdown-item-content " style="height: 10.133rem">
									<view :id="currentItem==item.value ? 'currentItemStyle' : ''"
									      class="dateSelect content_head"
									      @click="select(item)" v-for="(item,index) in list" :key="index">
										{{item.text}}
									</view>
								</view>
							</ms-dropdown-item>
							<ms-dropdown-item v-model="value3" :hasSlot="true"
							                  :title="timeName"
							                  ref="dropdownItemDate"
							                  style="font-weight: bold;"
							>
								<view class="dropdown-item-content" style="text-align: center;">
									<view :id="dateIndex==0 ? 'dateChangeColor' : ''" class="dateSelect"
									      @click="today(),dateChangeIndex(0,'今日')">今日
									</view>
									<view :id="dateIndex==1 ? 'dateChangeColor' : ''" class="dateSelect"
									      @click="ytd(),dateChangeIndex(1,'昨日')">昨日
									</view>
									<view :id="dateIndex==2 ? 'dateChangeColor' : ''" class="dateSelect"
									      @click="week(),dateChangeIndex(2,'近7天')">近7天
									</view>
									<view :id="dateIndex==3 ? 'dateChangeColor' : ''" class="dateSelect"
									      @click="month(),dateChangeIndex(3,'近30天')">近30天
									</view>
									<view :id="dateIndex==4 ? 'dateChangeColor' : ''" class="dateSelect"
									      @click="onShowDatePicker('range'),dateChangeIndex(4)">自定义时间
									</view>
								</view>
							</ms-dropdown-item>
						</ms-dropdown-menu>
						<mx-date-picker :showTips="true" format="yyyy-mm-dd" :show="showPicker" :type="dtype"
						                :value="value"
						                :show-tips="true" :begin-text="'开始'" :end-text="'结束'" :show-seconds="true"
						                @confirm="onSelected" @cancel="onSelected"/>
						<view v-if="showGroup==0" @click="chooseStaff" v-show="index==0"
						      style="flex-grow: 1;text-align: center">
							<view style="cursor: pointer;font-size: 0.747rem;display: inline-block;font-weight: bold;">
								<span v-if="userCount==0" style="cursor: pointer">选择成员</span>
								<span v-if="userCount > 0" style="cursor: pointer">{{userCount}}个成员</span>
							</view>
							<uni-icons type="arrowdown"
							           style="font-size:0.8rem;color: #999;margin-left: 0.373rem;font-weight: bold;"></uni-icons>
						</view>
					</view>
				</view>
				<van-popup v-model="showPickera" position="bottom">
					<view>
						<view class="group_select" style="color: #1989FA;padding: 0 0.533rem;">
							<view style="float: left;cursor: pointer;margin-right: 0.267rem" @click="handlerCancle">取消
							</view>
							<view class="chooseGroupName">{{this.$store.state.groupName}}
								<van-icon
										name="close"
										@click="clearGroup"
										v-show="this.$store.state.groupName != ''"
										style="margin-left: 0.267rem;"/>
							</view>
							<view style="float: right;cursor: pointer;" @click="handlerOk">确定</view>
						</view>
						<view style="height: 10.667rem;overflow-y: auto;">
							<Group :data="groupArr"></Group>
						</view>
					</view>
				</van-popup>
			</view>
			<member ref="member" v-if="tabActiveIdx==0" style="width: 100%" @func="getMemberMsg"></member>
			<follow ref="follow" v-if="tabActiveIdx==1" @func="getMemberMsg"></follow>
			<view v-if="tabActiveIdx==2" style="padding-top: 7.691rem  /* 149/18.75 */;">
				<view style="background: #F1F3F5;padding-top: 0.533rem">
					<view style="background: #FFF;padding-top: 0.8rem">
						<view v-show="index==0" class="content_top">
							<text class="hot">内容TOP10
							</text>
						</view>
						<view v-show="index==1" class="content_top">
							<text class="hot">员工TOP10
							</text>
						</view>
						<view v-show="index==2" class="content_top">
							<text class="hot">搜索词TOP10
							</text>
						</view>
					</view>
				</view>

				<view v-show="index==0" class="button-sp-area" style="background: #FFF;padding-top: 0.533rem">
					<view plain="true" class="tab-btn2"
					      :class="pickerIndex==0 ? 'activity-btn' : ''" @click="changePicker(0)">搜索次数
					</view>
					<view plain="true" class="tab-btn2"
					      :class="pickerIndex==1 ? 'activity-btn' : ''" @click="changePicker(1)">发送次数
					</view>
					<view plain="true" class="tab-btn2"
					      :class="pickerIndex==2 ? 'activity-btn' : ''" @click="changePicker(2)">打开次数
					</view>
				</view>
				<view v-show="index==1" class="back2">
					<view class="content_item2">
						<view plain="true" class="tab-btn2"
						      :class="personnelIndex==0 ? 'activity-btn' : ''" @click="changePersonnel(0)">员工贡献内容
						</view>
						<view plain="true" class="tab-btn2"
						      :class="personnelIndex==1 ? 'activity-btn' : ''" @click="changePersonnel(1)">员工发送
						</view>
					</view>
				</view>

				<view v-if="xarr.length !=0" class="ifChart">
					<!--      柱状图区域        -->
					<view style="background: #FFF;width: 100%;">
						<view v-for="(item,index) in barr" :key="index" class="chartStyle">
							<view v-show="titleActive==false" style="width: 100%">
								<view style="width: 100%;height: 1.067rem;">
									<view style="float: left" class="title_style">{{ xarr[index] }}</view>
									<text style="float: right" class="font_style">{{ countArr[index] }}次</text>
								</view>
								<view class="text_style">
									<view class="chartStyle_t">
										<view v-show="item>0" :style="{'width':item+'%'}" class="color"></view>
										<view v-show="item==0" class="item0"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="xarr.length ==0" class="ifChart"
				      style="display: flex;justify-content: center;align-items: center">
					<view style="width: 10rem; height: 6rem; margin: 0.64rem 0.533rem 0.64rem; background: url(../../static/scrm/noData.png) 50% 0% no-repeat;background-size:contain;padding: 0.427rem 0.693rem;box-sizing: border-box;"></view>
				</view>
				<!--		TOP10table表格区域		-->
				<view v-show="index==1" class="top_f">
					<view class="warp">
						<view class="box">
							<t-table border="0" border-color="#ccc" @change="change">
								<t-tr>
									<t-th class="table_th">排行</t-th>
									<t-th class="table_th">员工姓名</t-th>
									<t-th class="table_th">{{userText}}</t-th>
									<!--											<t-th v-if="this.personnelInfo.times_type = '2'">发送次数</t-th>-->
								</t-tr>
								<t-tr style="background: #FFF" v-for="(item,index) in personnelFileData"
								      :key="index">
									<t-td class="table_th">{{ item.sort }}</t-td>
									<t-td class="table_th">{{ item.name }}</t-td>
									<t-td class="table_th">{{ item.sum }}</t-td>
								</t-tr>
							</t-table>
						</view>
					</view>
					<view class="custom-tabs-loading" v-if="personnelFileData.length > 0">{{loadingText}}</view>
				</view>
				<!--		搜索词10table表格区域		-->
				<view v-show="index==2" class="top_f">
					<view class="warp">
						<view class="box">
							<t-table border="0" border-color="#ccc" @change="change">
								<t-tr style="background: #F3F3F7">
									<t-th class="table_th">排行</t-th>
									<t-th class="table_th">员工姓名</t-th>
									<t-th class="table_th">搜索词次数</t-th>
								</t-tr>
								<t-tr style="background: #FFF" v-for="(item,index) in keysData" :key="index">
									<t-td class="table_th">{{ item.sort }}</t-td>
									<t-td class="table_th">{{ item.name }}</t-td>
									<t-td class="table_th">{{ item.sum }}</t-td>
								</t-tr>
							</t-table>
						</view>
					</view>
					<view class="custom-tabs-loading" v-if="keysData.length > 0">{{loadingText2}}</view>
				</view>

				<!--      发送次数走势图      -->
				<view style="background:#F1F3F5">
					<view v-show="index==0" style="background: #FFF;padding-top: 0.7rem">
						<text class="hot">{{ text }}次数走势图</text>
					</view>
				</view>
				<!--      走势图区域        -->
				<view v-show="index==0" class="qiun-charts"
				      style="padding-bottom: 0.533rem;background: #FFF;padding-top: 0.533rem">
					<view class="picker-active"
					      style="padding: 0.427rem 0.693rem;box-sizing: border-box;background: #E5F1FF;width: 5.92rem; height: 3.413rem; margin-left:0.533rem;">
						<view class="time">{{ text }}次数
						</view>
						<view v-show="pickerIndex==0 " class="time_date">{{ count.searchCount }}
						</view>
						<view v-show="pickerIndex==1 " class="time_date">{{ count.sendCount }}
						</view>
						<view v-show="pickerIndex==2 " class="time_date">{{ count.openCount }}
						</view>
					</view>
					<canvas ref="canvasLinethree" canvas-id="canvasLinethree" id="canvasLinethree" class="charts"
					        @touchstart="touchLineA"></canvas>
				</view>
				<!--					</view>-->
				<!--	  内容统计      -->
				<view v-show="index==0" style="background: #F1F3F5;padding: 0.553rem 0;cursor: pointer;">
					<view @click="goContent" class="nr_box">
						<text class="nr_text">
							内容统计
						</text>
						<uni-icons type="arrowright" size="14"
						           style="color: #000;font-size: 0.8rem;margin-left: 0.373rem;"/>
					</view>
				</view>
			</view>
			<Footer v-show="is_show_copyright == 1 && is_show_copyright2"></Footer>
		</view>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>

	</view>
</template>

<script>
	// import {Calendar} from 'vant';
	import uCharts from '../../components/u-charts/u-charts.js'
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue"
	import {Toast} from "vant";
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import Group from "@/components/Group";
	import follow from '@/pages/scrm/followup.vue'
	import member from '@/pages/scrm/member'
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";

	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay(); //今天本周的第几天
	var nowDay = now.getDate(); //当前日
	var nowMonth = now.getMonth() + 1; //当前月
	var nowYear = now.getYear(); //当前年
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	if (nowDayOfWeek == 0) {
		nowDayOfWeek = 7
	}

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

	function gety (year) {
		var date1 = new Date()
		var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
		var date2 = new Date(date1);
		let m = (date2.getMonth() + 1)
		m = m < 10 ? ('0' + m) : m;
		let d = date2.getDate()
		d = d < 10 ? ('0' + d) : d;
		var time2 = date2.getFullYear() + "-" + m + "-" + d;
		return time2
	}

	/*时间戳改日期--不传第二个参数返回年月日,传第二个参数返回年月日时分秒*/
	function formatDateTime (inputTime, type) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth();
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		if (type) {
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//2017-12-12 12:23:34
		} else {
			return y + '-' + m + '-' + d; //2017-12-12
		}
	}


	//获得某月的天数
	function getMonthDays (myMonth) {
		var monthStartDate = new Date(nowYear, myMonth, 1);
		var monthEndDate = new Date(nowYear, myMonth + 1, 1);
		var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
		return days;
	}

	//获得本周的开端日期
	function getWeekStartDate () {
		var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
		return formatDateTime(weekStartDate);
	}

	var _self;
	var canvaColumn = null;
	var canvasLinethree = null;

	export default {
		inject       : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden', 'getCopyright'],
		data () {
			let tabActiveIdx = localStorage.getItem('tax') !== null ? localStorage.getItem('tax') : (this.getParameter('tax') !== null ? this.getParameter('tax') : 0)
			let userIdx = localStorage.getItem('tab4') !== null ? localStorage.getItem('tab4') : (this.getParameter('uix') !== null ? this.getParameter('uix') : 0)

			return {
				userText      : '贡献次数',
				// personnelFileData2:[],
				showGroup     : null,
				titleActive   : false,
				countArr      : [],
				barr          : [],
				xarr          : [],
				scrollTop     : 0,
				old           : {
					scrollTop: 0
				},
				counts        : 0,
				isReady       : false,
				loadingText   : '加载中...',
				loadingText2  : '加载中...',
				getListLoading: true,
				wxReady       : false,
				showList      : false,
				corpid        : '',//企业微信的corpid，必须与当前登录的企业一致
				agentid       : this.$route.query.agentId,//企业微信的应用id
				agentkey      : '',
				url           : '',
				ticketData    : {},
				agentData     : {},
				uid           : '',
				userId        : null,
				commonUrl     : this.$store.state.commonUrl,//公共的链接
				activeNames   : ['1'],
				groupName     : '',//获取的分组名称
				group_id      : '',//获取的分组id
				showPickera   : false,//分组弹窗的显示与隐藏
				inputValue    : '',//搜索框内容
				resultId      : '',//搜索框搜索的素材id
				groupArr      : [],//分组
				active        : 0,//Tab类型,序列号
				page          : 1,//页数
				pageSize      : 15,//每页默认15条
				counta        : '',//所有素材总数量
				keys          : '',

				range               : [],
				dtype               : 'range',
				value               : '',
				year                : gety(12), // 12月前
				yesterday           : fun_date(1), // 一天前日期
				months              : fun_date(29), // 30天前日期
				nowDay              : now_date(), // 当前日期
				weekDay             : fun_date(6), // 7天前日期
				// 自定义日期范围
				dateS               : '',
				dateE               : '',
				showPicker          : false,
				currentItem         : '0',
				currentItemName     : '所有类型',//选择的类型名称
				// 类型列表
				list                : [
					{
						text : '所有类型',
						value: '0'
					},
					{
						text : '图片',
						value: '1'
					},
					{
						text : '音频',
						value: '2'
					},
					{
						text : '视频',
						value: '3'
					},
					{
						text : '图文',
						value: '4'
					},
					{
						text : '文件',
						value: '5'
					},
					{
						text : '文本',
						value: '6'
					},
					{
						text : '小程序',
						value: '7'
					}
				],
				dateIndex           : 2,
				timeName            : '近7天',//选择的时间名称
				//搜索词TOP10列表数据
				keysData            : [],
				//员工TOP10列表数据
				personnelFileData   : [],
				// start_date       : this.yesterday,
				// end_date         : this.nowDay,
				//员工TOP10柱状图渲染请求参数
				personnelInfo       : {
					uid       : localStorage.getItem('uid'),
					corp_id   : localStorage.getItem('corpid'),
					user_id   : localStorage.getItem('user_id'),
					type      : '5',
					times_type: '1',
					date_type : '1',
					s_date    : fun_date(6),
					e_date    : now_date(),
					// pageSize  : 5,
					file_type : null,
					group_id  : null
				},
				page2               : 1,
				//搜索词TOP10柱状图渲染请求参数
				pagek               : 1,
				countK              : 0,
				keysInfo            : {
					uid      : localStorage.getItem('uid'),
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					type     : '6',
					date_type: '1',
					// pageSize : 10,
					s_date   : fun_date(6),
					e_date   : now_date(),
					group_id : null
				},
				//获取各类型内容引擎的次数参数
				// userIds:[],
				userInfo            : {
					uid      : localStorage.getItem('uid'),
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					type     : '1',
					date_type: '1',
					s_date   : fun_date(6),
					e_date   : now_date(),
					file_type: null,
					group_id : null,
					user_ids : []
				},
				personnelIndex      : 0,
				//图表显示文本
				text                : '搜索',
				//获取图表数据的参数
				//内容TOP10获取柱状图数据的方法
				contentInfo         : {
					// uid       : localStorage.getItem('uid'),
					corp_id   : localStorage.getItem('corpid'),
					user_id   : localStorage.getItem('user_id'),
					type      : '1',
					date_type : '1',
					times_type: '1',
					s_date    : fun_date(6),
					e_date    : now_date(),
					file_type : null,
					group_id  : null,
					user_ids  : []
				},
				// 折线图
				lineContentInfo     : {
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					type     : '2',
					date_type: '1',
					// times_type: '1',
					s_date   : fun_date(6),
					e_date   : now_date(),
					// s_date   : '2020-09-01',
					// e_date   : '2020-09-01',
					file_type: null,
					group_id : null,
					user_ids : []
				},
				cWidth              : '',
				cHeight             : '',
				eWidth              : '',
				eHeight             : '',
				pixelRatio          : 1,
				serverData          : '',
				chartData           : {},
				type                : '',
				date_type           : '',
				count               : {
					searchCount: '',
					sendCount  : '',
					openCount  : ''
				},
				countP              : {
					createSum: '',
					sendSum  : ''
				},
				pickerIndex         : 0,
				index               : userIdx,
				tabList             : [{
					title: '成员统计'
				}, {
					title: '跟进统计'
				}, {
					title: '内容统计'
				}],
				tabActiveIdx        : tabActiveIdx,//当前tab值
				// aaa
				value3              : 'init',
				userCount           : 0,//选择的成员数量
				showChooseDepartment: false,//选择成员组件的显示与隐藏
				selectDepartment    : [],//已选择的成员
				is_show_copyright   : localStorage.getItem('is_show_copyright'),//是否展示底部版權
				is_show_copyright2  : true,//子组件传值时候
			}
		},
		props        : {},
		onTabItemTap : function (obj) {
			this.tabActiveIdx = 0
			this.userCount = 0
			this.$nextTick(() => {
				this.selectDepartment = []
				this.$refs.member.userCount = 0
			})

			if (localStorage.getItem('uid') != null) {
				this.getInfoData()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.limit)
				})
			}
		},
		onLoad () {
			localStorage.setItem('tax', '')
			uni.setNavigationBarTitle({
				title: '数据统计'
			});

			if (localStorage.getItem('uid') != null) {
				this.getInfoData()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.limit)
				})
			}

			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('user_id', 'liyunli')
			// // localStorage.setItem('user_id', 'jinhui')
			// localStorage.setItem('agent_id', 25)
			// localStorage.setItem('token', 'TWFpblVzZXItYTE5YTZiNDAwZmRlYzk4ZDU2MDFiNmIxZjU0YmUxNmU=')
			// this.is_show_copyright = 1
			// this.getUserInfo()


			localStorage.setItem('tab4', '')
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = 300;
			this.eWidth = uni.upx2px(750);
			this.eHeight = 300;
		},
		onReachBottom: function () {
			if (this.personnelFileData.length < this.counts) {
				this.page2 += 1
				this.getPersonnelData(this.page2)
			} else {
				this.loadingText = '已加载全部'
			}
			if (this.keysData.length < this.countK) {
				this.pagek += 1
				this.getKeysData(this.pagek)
			} else {
				this.loadingText2 = '已加载全部'
			}
		},
		watch        : {
			tabActiveIdx: function () {
				localStorage.setItem('tax', this.tabActiveIdx)
				this.selectDepartment = []
				if (this.tabActiveIdx == 0) {
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				} else if (this.tabActiveIdx == 1) {
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				} else if (this.tabActiveIdx == 2) {
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					this.groupName = ''
					this.currentItemName = '所有类型'
					this.timeName = '近7天'
					this.range = []
					this.dateIndex = 2
					this.index = 0
					//员工TOP10柱状图渲染请求时间参数
					this.personnelInfo.s_date = this.weekDay
					this.personnelInfo.e_date = this.nowDay
					//搜索词TOP10柱状图渲染请求时间参数
					this.keysInfo.s_date = this.weekDay
					this.keysInfo.e_date = this.nowDay
					//获取各类型内容引擎的次数时间参数
					this.userInfo.s_date = this.weekDay
					this.userInfo.e_date = this.nowDay
					//内容TOP10柱状图渲染请求时间参数
					this.contentInfo.s_date = this.weekDay
					this.contentInfo.e_date = this.nowDay
					// 折线图
					this.lineContentInfo.s_date = this.weekDay
					this.lineContentInfo.e_date = this.nowDay
					this.contentInfo.user_ids = []
					this.userCount = 0
					this.$store.commit("setGroupId", '')
					this.$store.commit("setGroupName", '');
					this.getUserInfo()
					this.getServerData()
					this.getCanvaLine()
				}
			}
		},
		methods      : {
			getMemberMsg (data) {
				this.is_show_copyright2 = !data
			},
			open () {
				this.$refs.dropdownItemDate.closePopup()
				this.$refs.dropdownItemType.closePopup()
				this.showPickera = true
				this.getGroupList()
			},
			// 获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("chat-message/group", {
					uid: localStorage.getItem('uid'),
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.groupArr = res.data.group;
					let g = {
						key         : "",
						value       : "0",
						parent_id   : null,
						title       : "所有",
						sort        : 0,
						is_not_group: 0,
						scopedSlots : {
							title: "custom"
						},
						children    : []
					}
					this.groupArr.splice(0, 0, g)
				}
			},
			//分组下的确定、取消
			handlerOk () {
				this.group_id = this.$store.state.group_id
				this.groupName = this.$store.state.groupName
				this.showPicker = false
				this.textFinished = false
				this.fileFinished = false
				this.videoFinished = false
				this.noMorePic = false
				this.noMorehFive = false
				this.page = 1
				if (this.index == 0) {
					this.userInfo.group_id = this.group_id
					this.contentInfo.group_id = this.group_id
					this.lineContentInfo.group_id = this.group_id
					this.getUserInfo()
					this.getServerData()
					this.getCanvaLine()
				} else if (this.index == 1) {
					this.userInfo.group_id = this.group_id
					this.personnelInfo.group_id = this.group_id
					this.getUserInfo()
					this.getPersonnelData()
				}
				this.showPickera = false
			},
			handlerCancle () {
				this.$store.commit("setGroupId", this.group_id);
				this.$store.commit("setGroupName", this.groupName);
				this.showPickera = false
			},
			clearGroup () {
				this.$store.commit("setGroupId", '');
				this.$store.commit("setGroupName", '');
			},


			onShowDatePicker (type) {//显示
				this.dtype = type;
				this.showPicker = true;
				this.value = this[type]
			},
			onSelected (e) {//选择
				this.showPicker = false;
				// this.$refs.dropdownItemDate.closePopup()
				if (e) {
					this[this.dtype] = e.value;
					if (this.range.length > 0) {
						this.timeName = this.range[0] + '-' + this.range[1]
						//员工TOP10柱状图渲染请求时间参数
						this.personnelInfo.s_date = this.range[0]
						this.personnelInfo.e_date = this.range[1]
						//搜索词TOP10柱状图渲染请求时间参数
						this.keysInfo.s_date = this.range[0]
						this.keysInfo.e_date = this.range[1]
						//获取各类型内容引擎的次数时间参数
						this.userInfo.s_date = this.range[0]
						this.userInfo.e_date = this.range[1]
						//内容TOP10柱状图渲染请求时间参数
						this.contentInfo.s_date = this.range[0]
						this.contentInfo.e_date = this.range[1]
						// 折线图
						this.lineContentInfo.s_date = this.range[0]
						this.lineContentInfo.e_date = this.range[1]
					}
					if (this.index == 0) {
						this.getUserInfo()
						this.getCanvaLine()
						this.getServerData()
					} else if (this.index == 1) {
						this.getUserInfo()
						this.getPersonnelData()
					} else if (this.index == 2) {
						this.getKeysData()
					}
					this.$refs.dropdownItemDate.closePopup()
				}
			},
			//日历
			formatDate (date) {
				return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
			},
			onConfirm (date) {
				const [start, end] = date;
				this.aaa = false;
				this.dateS = `${this.formatDate(start)}`;
				this.dateE = `${this.formatDate(end)}`
			},

			select (item) {

				if (item.value != this.currentItem) {
					this.currentItem = item.value
					this.currentItemName = item.text
				}
				if (item.value == '0') {
					this.personnelInfo.file_type = null
					this.userInfo.file_type = null
					this.contentInfo.file_type = null
					this.lineContentInfo.file_type = null
					if (this.index == 0) {
						this.getUserInfo()
						this.getCanvaLine()
						this.getServerData()
					} else if (this.index == 1) {
						this.getUserInfo()
						this.getPersonnelData()
					}
				} else {
					this.personnelInfo.file_type = item.value
					this.userInfo.file_type = item.value
					this.contentInfo.file_type = item.value
					this.lineContentInfo.file_type = item.value
					if (this.index == 0) {
						this.getUserInfo()
						this.getCanvaLine()
						this.getServerData()
					} else if (this.index == 1) {
						this.getUserInfo()
						this.getPersonnelData()
					}
				}
				this.$refs.dropdownItemType.closePopup()
			},
			//选择时间
			today () {
				//员工TOP10柱状图渲染请求时间参数
				this.personnelInfo.s_date = this.nowDay
				this.personnelInfo.e_date = this.nowDay
				//搜索词TOP10柱状图渲染请求时间参数
				this.keysInfo.s_date = this.nowDay
				this.keysInfo.e_date = this.nowDay
				//获取各类型内容引擎的次数时间参数
				this.userInfo.s_date = this.nowDay
				this.userInfo.e_date = this.nowDay
				//内容TOP10柱状图渲染请求时间参数
				this.contentInfo.s_date = this.nowDay
				this.contentInfo.e_date = this.nowDay
				// 折线图
				this.lineContentInfo.s_date = this.nowDay
				this.lineContentInfo.e_date = this.nowDay
				this.$refs.dropdownItemDate.closePopup()
			},
			ytd () {
				//员工TOP10柱状图渲染请求时间参数
				this.personnelInfo.s_date = this.yesterday
				this.personnelInfo.e_date = this.yesterday
				//搜索词TOP10柱状图渲染请求时间参数
				this.keysInfo.s_date = this.yesterday
				this.keysInfo.e_date = this.yesterday
				//获取各类型内容引擎的次数时间参数
				this.userInfo.s_date = this.yesterday
				this.userInfo.e_date = this.yesterday
				//内容TOP10柱状图渲染请求时间参数
				this.contentInfo.s_date = this.yesterday
				this.contentInfo.e_date = this.yesterday
				// 折线图
				this.lineContentInfo.s_date = this.yesterday
				this.lineContentInfo.e_date = this.yesterday
				this.$refs.dropdownItemDate.closePopup()
			},
			week () {
				//员工TOP10柱状图渲染请求时间参数
				this.personnelInfo.s_date = this.weekDay
				this.personnelInfo.e_date = this.nowDay
				//搜索词TOP10柱状图渲染请求时间参数
				this.keysInfo.s_date = this.weekDay
				this.keysInfo.e_date = this.nowDay
				//获取各类型内容引擎的次数时间参数
				this.userInfo.s_date = this.weekDay
				this.userInfo.e_date = this.nowDay
				//内容TOP10柱状图渲染请求时间参数
				this.contentInfo.s_date = this.weekDay
				this.contentInfo.e_date = this.nowDay
				// 折线图
				this.lineContentInfo.s_date = this.weekDay
				this.lineContentInfo.e_date = this.nowDay
				this.$refs.dropdownItemDate.closePopup()
			},
			month () {
				//员工TOP10柱状图渲染请求时间参数
				this.personnelInfo.s_date = this.months
				this.personnelInfo.e_date = this.nowDay
				//搜索词TOP10柱状图渲染请求时间参数
				this.keysInfo.s_date = this.months
				this.keysInfo.e_date = this.nowDay
				//获取各类型内容引擎的次数时间参数
				this.userInfo.s_date = this.months
				this.userInfo.e_date = this.nowDay
				//内容TOP10柱状图渲染请求时间参数
				this.contentInfo.s_date = this.months
				this.contentInfo.e_date = this.nowDay
				// 折线图
				this.lineContentInfo.s_date = this.months
				this.lineContentInfo.e_date = this.nowDay

				this.$refs.dropdownItemDate.closePopup()
			},
			dateChangeIndex (index, name) {
				if (index != this.dateIndex) {
					this.dateIndex = index
					this.range = []
					if (index != 4) {
						this.timeName = name
					}
				}
				if (this.index == 0) {
					this.getUserInfo()
					this.getCanvaLine()
					this.getServerData()
				} else if (this.index == 1) {
					this.getUserInfo()
					this.getPersonnelData()
				} else if (this.index == 2) {
					this.getKeysData()
				}
				// this.$refs.dropdownItemDate.closePopup()
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
					if (this.tabActiveIdx == 2) {
						if (this.index == 0) {
							this.getUserInfo()
							this.getServerData()
							this.getCanvaLine()
						} else if (this.index == 1) {
							this.getUserInfo()
						}

					}
				}
			},
			change (e) {
			},
			changePersonnel (index) {
				if (index != this.personnelIndex) {
					this.personnelIndex = index
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}
				switch (this.personnelIndex) {
					case 0:
						this.personnelInfo.times_type = '1'
						this.userText = '贡献次数'
						this.getPersonnelData()
						break;
					case 1:
						this.personnelInfo.times_type = '2'
						this.userText = '发送次数'
						this.getPersonnelData()
						break;
				}
			},
			//获取折线图
			async getCanvaLine () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.lineContentInfo.corp_id = localStorage.getItem('corpid')
				this.lineContentInfo.user_id = localStorage.getItem('user_id')

				this.lineContentInfo.user_ids = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.lineContentInfo.user_ids.push(this.selectDepartment[i].id)
					}
				}
				const {data: res} = await this.axios.post('attachment/sum-list', this.lineContentInfo)
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
				}
				let LineA = {categories: [], series: []};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				LineA.categories = res.data.xData;
				LineA.series = res.data.seriesData;
				_self.showLineCanvas("canvasLinethree", LineA);
			},
			showLineCanvas (canvasId, chartData) {
				canvasLinethree = new uCharts({
					$this         : _self,
					canvasId      : canvasId,
					type          : 'line',
					fontSize      : 11,
					legend        : {
						show      : true,
						lineHeight: 16,
					},
					dataLabel     : false,
					dataPointShape: true,
					//调整边距
					padding       : [20, 30, 0, 15],
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
						gridColor  : '#CCCCCC',
						dashLength : 8,
						padding    : 20,
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
					height        : _self.eHeight * _self.pixelRatio,
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
				canvasLinethree.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
				canvasLinethree.touchLegend(e, {animation: true});
			},

			//内容TOP10获取柱状图数据的方法
			async getServerData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				// this.personnelInfo.uid=localStorage.getItem('uid')
				this.contentInfo.corp_id = localStorage.getItem('corpid')
				this.contentInfo.user_id = localStorage.getItem('user_id')

				this.contentInfo.user_ids = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.contentInfo.user_ids.push(this.selectDepartment[i].id)
					}
				}
				const {data: res} = await this.axios.post('attachment/sum-list', this.contentInfo)
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					let l = []
					this.countArr = []
					if (res.data.seriesData.length > 0) {
						l = res.data.seriesData[0].data
						this.countArr = res.data.seriesData[0].data
					}
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
				}
				this.visible = true
			},
			//成员TOP10获取柱状图数据的方法
			async getPersonnelData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.personnelInfo.uid = localStorage.getItem('uid')
				this.personnelInfo.corp_id = localStorage.getItem('corpid')
				this.personnelInfo.user_id = localStorage.getItem('user_id')
				let param = this.personnelInfo
				param['page'] = page
				const {data: res} = await this.axios.post('attachment/top10', param)
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.isReady = true
					// uni.hideLoading();
					uni.hideLoading();

					this.page2 = page
					this.counts = res.data.count
					if (page == 1) {
						this.personnelFileData = res.data.fileData
						let l = res.data.seriesData[0].data
						this.countArr = res.data.seriesData[0].data
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
						this.visible = true
					} else {
						this.personnelFileData = this.personnelFileData.concat(res.data.fileData)
					}
					if (this.personnelFileData.length == this.counts) {
						this.loadingText = '已加载全部'
					}
				}
			},
			//搜索词TOP10获取柱状图数据的方法
			async getKeysData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.keysInfo.uid = localStorage.getItem('uid')
				this.keysInfo.corp_id = localStorage.getItem('corpid')
				this.keysInfo.user_id = localStorage.getItem('user_id')
				let params = this.keysInfo
				params['page'] = page
				const {data: res} = await this.axios.post('attachment/top10', params)
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.isReady = true
					// uni.hideLoading();
					uni.hideLoading();

					this.pagek = page

					if (page == 1) {
						this.keysData = res.data.fileData
						this.countK = res.data.count
						let l = res.data.seriesData[0].data
						this.countArr = res.data.seriesData[0].data
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
						}
						for (let j = 0; j < l.length; j++) {
							this.titleActive = false
							let z = Number(l[j])
							let m = Number(max)
							b.push((z / m) * 100)
							this.barr = b
						}
						this.xarr = res.data.xData
						this.visible = true
					} else {
						this.keysData = this.keysData.concat(res.data.fileData)
					}
					if (this.keysData.length == this.countK) {
						this.loadingText2 = '已加载全部'
					}
				}

			},

			//跳转到内容统计页面
			goContent () {
				// this.text='搜索'
				this.userInfo.group_id = null
				this.contentInfo.group_id = null
				this.lineContentInfo.group_id = null
				this.$store.commit("setGroupId", '');
				this.$store.commit("setGroupName", '');
				this.selectDepartment = []
				// this.pickerIndex = 0
				this.timeName = '近7天'
				this.currentItemName = '所有类型'
				this.range = []
				this.groupName = ''
				// this.contentInfo.times_type = '1'
				// this.lineContentInfo.type = '2'
				this.userInfo.type = '1'
				this.currentItem = null
				this.userInfo.file_type = null
				this.contentInfo.file_type = null
				this.lineContentInfo.file_type = null

				this.userInfo.user_ids = []
				this.lineContentInfo.user_ids = []
				this.contentInfo.user_ids = []
				this.userCount = 0

				this.dateIndex = 2,
					//获取各类型内容引擎的次数时间参数
					this.userInfo.s_date = this.weekDay
				this.userInfo.e_date = this.nowDay
				//内容TOP10柱状图渲染请求时间参数
				this.contentInfo.s_date = this.weekDay
				this.contentInfo.e_date = this.nowDay
				// 折线图
				this.lineContentInfo.s_date = this.weekDay
				this.lineContentInfo.e_date = this.nowDay
				this.getUserInfo()
				// this.contentInfo.group_id=this.group_id
				// this.lineContentInfo.group_id=this.group_id
				this.getServerData()
				this.getCanvaLine()
				localStorage.setItem('tab1', 2)
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/statistics?corpId=' + localStorage.getItem('corpid') + '&agent_id=' + agent_id
				});
			},
			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
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
							if (typeof that.$store.state.wx.agentConfig == 'function') {
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
										that.getGroupList()
										that.getInfoData()
										// this.corpId=that.agentData.corpid
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
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			getInfoData () {
				if (this.index == 0) {
					this.groupName = ''
					this.currentItemName = '所有类型'
					this.timeName = '近7天'
					this.dateIndex = 2
					this.range = []
					this.contentInfo.user_ids = []
					this.userCount = 0
					this.$store.commit("setGroupId", '');
					this.$store.commit("setGroupName", '');
					this.selectDepartment = []
					this.userInfo.user_ids = []
					this.lineContentInfo.user_ids = []
					this.contentInfo.user_ids = []
					//获取各类型内容引擎的次数时间参数
					this.userInfo.s_date = this.weekDay
					this.userInfo.e_date = this.nowDay
					//内容TOP10柱状图渲染请求时间参数
					this.contentInfo.s_date = this.weekDay
					this.contentInfo.e_date = this.nowDay
					// 折线图
					this.lineContentInfo.s_date = this.weekDay
					this.lineContentInfo.e_date = this.nowDay
					this.personnelInfo.s_date = this.weekDay
					this.personnelInfo.e_date = this.nowDay
					this.keysInfo.s_date = this.weekDay
					this.keysInfo.e_date = this.nowDay
					this.userInfo.group_id = null
					this.contentInfo.group_id = null
					this.lineContentInfo.group_id = null
					this.pickerIndex = 0
					this.contentInfo.times_type = '1'
					this.lineContentInfo.type = '2'
					this.userInfo.type = '1'
					this.currentItem = null
					this.userInfo.file_type = null
					this.contentInfo.file_type = null
					this.lineContentInfo.file_type = null
					this.getUserInfo()
					this.getServerData()
					this.getCanvaLine()
				} else {
					this.getUserInfo()
				}
			},
			changeIndex (index) {
				if (index != this.index) {
					this.$refs.dropdownItemDate.closePopup()
					this.index = index
					this.groupName = ''
					this.currentItemName = '所有类型'
					this.timeName = '近7天'
					this.dateIndex = 2
					this.range = []
					this.contentInfo.user_ids = []
					this.userCount = 0
					this.$store.commit("setGroupId", '');
					this.$store.commit("setGroupName", '');
					this.selectDepartment = []
					this.userInfo.user_ids = []
					this.lineContentInfo.user_ids = []
					this.contentInfo.user_ids = []
					//获取各类型内容引擎的次数时间参数
					this.userInfo.s_date = this.weekDay
					this.userInfo.e_date = this.nowDay
					//内容TOP10柱状图渲染请求时间参数
					this.contentInfo.s_date = this.weekDay
					this.contentInfo.e_date = this.nowDay
					// 折线图
					this.lineContentInfo.s_date = this.weekDay
					this.lineContentInfo.e_date = this.nowDay
					this.personnelInfo.s_date = this.weekDay
					this.personnelInfo.e_date = this.nowDay
					this.keysInfo.s_date = this.weekDay
					this.keysInfo.e_date = this.nowDay
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}
				if (this.index == 0) {
					this.userInfo.group_id = null
					this.contentInfo.group_id = null
					this.lineContentInfo.group_id = null
					this.pickerIndex = 0
					this.contentInfo.times_type = '1'
					this.lineContentInfo.type = '2'
					this.userInfo.type = '1'
					this.currentItem = null
					this.userInfo.file_type = null
					this.contentInfo.file_type = null
					this.lineContentInfo.file_type = null
					this.getUserInfo()
					this.getServerData()
					this.getCanvaLine()
				} else if (this.index == 1) {
					this.personnelIndex = 0
					this.personnelInfo.times_type = '1'
					this.userInfo.group_id = null
					this.personnelInfo.group_id = null
					// this.personnelIndex = 0
					this.userInfo.type = '5'
					this.currentItem = null
					this.personnelInfo.file_type = null
					this.userInfo.file_type = null

					this.getUserInfo()
					this.getPersonnelData()
				} else if (this.index == 2) {
					this.getKeysData()
				}

			},
			changePicker (index) {
				if (index != this.pickerIndex) {
					this.pickerIndex = index
					this.getServerData()
					this.getCanvaLine()
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
				}
				switch (this.pickerIndex) {
					case 0:
						this.text = '搜索'
						this.contentInfo.times_type = '1'
						this.lineContentInfo.type = '2'
						break;
					case 1:
						this.text = '发送'
						this.contentInfo.times_type = '2'
						this.lineContentInfo.type = '3'
						break;
					case 2:
						this.text = '打开'
						this.contentInfo.times_type = '3'
						this.lineContentInfo.type = '4'
						break;
				}
			},
			async getUserInfo () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.userInfo.uid = localStorage.getItem('uid')
				this.userInfo.corp_id = localStorage.getItem('corpid')
				this.userInfo.user_id = localStorage.getItem('user_id')

				this.userInfo.user_ids = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.userInfo.user_ids.push(this.selectDepartment[i].id)
					}
				}
				const {data: res} = await this.axios.post('wap-user-desktop/attachment-sum', this.userInfo)
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.isReady = true
					uni.hideLoading();
					this.showGroup = res.data.show
					if (this.userInfo.type == '1') {
						this.userCount = res.data.user_count
						this.count.searchCount = res.data.searchNum
						this.count.openCount = res.data.openSum
						this.count.sendCount = res.data.sendNum
					} else {
						this.countP.sendSum = res.data.sendNum
						this.countP.createSum = res.data.createNum
					}

				}
			}
		},
		components   : {
			uCharts,
			msDropdownMenu,
			msDropdownItem,
			tTable,
			tTh,
			tTr,
			tTd,
			MxDatePicker,
			Group,
			follow,
			member,
			Footer,
			ChooseDepartment
		}

	};
</script>

<style scoped lang="less">

	.charts {
		width: 20rem;
		height: 16rem;
		background-color: #FFFFFF;
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
		font-size: 0.853rem;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.dropdown-item[data-v-aa4f4da6]:not(:last-child):after {
		display: none;
	}

	.tab-btn {
		height: 1.28rem;
		line-height: 1.28rem;
		background: #EDEDED;
		border-radius: 0.587rem /* 11/18.75 */;
		font-size: 0.7rem /* 11/18.75 */;
		color: #666;
		/*padding: 0 1.92rem  !* 36/18.75 *!;*/
		width: 4.8rem;
		text-align: center;
	}

	.tab-btn2 {
		height: 1.28rem;
		line-height: 1.28rem;
		background: #EDEDED;
		border-radius: 0.213rem /* 11/18.75 */;
		font-size: 0.7rem /* 11/18.75 */;
		color: #666;
		/*padding: 0 1.92rem  !* 36/18.75 *!;*/
		width: 4.8rem;
		text-align: center;
	}

	.button-sp-area {
		display: flex;
		justify-content: space-around;
		width: 100%;
	}

	.activity-btn {
		background: #01B065 !important;
		color: #FFF !important;
	}

	.container {
		background: #F1F3F5;
		text-align: left;
		font-size: 0.8rem /* 15/18.75 */;
		height: calc(100% - 2.667rem);

		.header {
			width: 20rem;
			height: 3.413rem;
			background: #01B065;
		}

		.content {
			/*height: 100%;*/
			background: rgba(242, 243, 245, 1);
			/*overflow: hidden;*/
		}

		.nav {
			width: 100%;
			height: 42px;
			background: rgba(255, 255, 255, 1);
			/*line-height: 2.667rem;*/
			/*overflow: hidden;*/
			border-bottom: 0.053rem solid #F5F5F5;
			font-size: 0.747rem;
			color: rgba(153, 153, 153, 1);
			font-weight: 500;

			/deep/ .tabBlock .tab__item {
				font-size: 0.747rem;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}

			/deep/ .tabBlock .tab__line {
				width: 1.1rem !important;
				height: 0.213rem;
				background: #01B065;
				border-radius: 0.107rem;
			}

			/deep/ #tab_list {
				padding: 0;
			}

			.nav_tab {
				width: 20rem;
				height: 37.813rem;
				background: rgba(255, 255, 255, 1);
			}
		}

		.hot {
			font-size: 0.8rem;
			font-weight: bold;
			color: rgba(33, 36, 42, 1);
			line-height: 1.6rem;
			margin-left: 0.587rem
		}

		.personnel {
			background: #0A98D5;
			height: 3.413rem;
			margin: 0.64rem 0.533rem 0;
			width: 30%;
		}

		.dateSelect {
			text-align: center;
			font-weight: bold;
			font-size: 0.747rem;
			color: #999;
			line-height: 2.133rem;
		}

		/deep/ .dropdown-item__selected {
			padding: 0;
		}

		/deep/ .iconfont {
			font-size: 0.693rem
		}

		/deep/ .dropdown-item__selected .selected__name {
			font-size: 0.747rem !important;
			max-width: 3.36rem /* 63/18.75 */;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
		}


		#dateChangeColor {
			/*background: #01B065;*/
			color: #01B065;
		}

		#currentItemStyle {
			/*background: #01B065;*/
			color: #01B065;
		}

		.picker-active {
			color: #01B065 !important;
		}

		.custom-tabs-loading {
			text-align: center;
			line-height: 1.6rem;
			font-size: 0.693rem;
			color: #CCC;
		}


		.title_style {
			font-size: 0.747rem;
			margin-bottom: 0.16rem;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			word-break: break-all;
			text-overflow: ellipsis;
		}

		.color {
			background: #01B065 !important;
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

		/deep/ .dropdown-item:not(:last-child):after {
			width: 0;
		}

		/deep/ uni-toast {
			z-index: 99999999999999999 !important;
		}

		.top_f {
			background: #FFF;
			padding-top: 1.067rem;
		}

		.ifChart {
			background: rgba(255, 255, 255, 1);
			padding: 0.8rem 0 0.8rem 0;
			margin-bottom: 0.533rem
		}

		.chartStyle {
			padding: 0 1rem 0;
			display: flex;
			justify-content: start
		}

		.chartStyle_t {
			width: 100%;
			display: flex;
			justify-content: start
		}

		.tab_picker {
			width: 18.933rem;
			padding: 0 0.533rem 0;
			display: flex;
			/*line-height: 2.133rem;*/
			color: #999;
			height: 2.133rem;
			align-items: center;
		}

		.content_top {
			text-align: left;
			background: #FFF
		}

		.content_item {
			height: 4.8rem;
			background: rgba(242, 243, 245, 1);
			display: flex;
			box-sizing: border-box
		}

		.back {
			background: #FFF;
			padding-top: 0.267rem;
		}

		.back2 {
			background: #FFF;
			padding-top: 0.533rem;
		}


		.content_item2 {
			height: 1.4rem;
			display: flex;
			justify-content: space-around;
			box-sizing: border-box
		}

		.time {
			font-size: 0.64rem;
			margin-top: 0.32rem /* 6/18.75 */;
		}

		.time_date {
			font-size: 0.853rem;
			font-weight: bold;
			line-height: 1.6rem
		}


		.line_hr {
			margin: 0.533rem 0.533rem 0.2rem;
			border: 0.027rem dashed rgba(242, 242, 242, 1);
		}

		.group_popup {
			height: 2.133rem;
			text-align: center;
			line-height: 2.133rem;
			color: #1989FA;
			padding: 0 0.533rem
		}

		.nr_text {
			font-size: 0.8rem;
			font-weight: 500;
			color: #000;
			line-height: 1.8rem;
			text-align: center
		}

		.nr_box {
			background-color: #FFF;
			text-align: center
		}

		.table_th {
			font-size: 0.64rem;
		}


		.group_select {
			font-size: 0.747rem !important;
			/*display: inline-block;*/
			height: 2.133rem;
			line-height: 2.133rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all
		}

		.group_select2 {
			font-size: 0.747rem !important;
			display: inline-block;
			max-width: 3.36rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all
		}

		.group_open {
			font-weight: bold;
			flex-grow: 1;
			display: flex;
			justify-content: center;
			align-items: center
		}

		.chooseGroupName {
			font-size: 0.747rem;
			display: inline-block;
			max-width: calc(100% - 5.333rem);
			overflow: hidden;
			white-space: nowrap;
			word-break: break-all;
			text-overflow: ellipsis;
		}

		.tab_picker {
			width: 100% !important;

		}

		/deep/ .uni-app--showtabbar uni-page-wrapper:after {
			background: #F1F3F5 !important;
		}


	}
</style>
