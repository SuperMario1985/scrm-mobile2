<template>
	<div id="app">
		<van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
			<template name="search" slot="title">
				<van-search
						v-model="inputValue"
						placeholder="请输入素材名称"
						@focus="focusSearch"
						@input="changeInputValue"
						:clearable="false"
				/>
			</template>
			<span slot="right" @click="onSearch" v-if="inputValue == '' || !showOne">搜索</span>
			<span slot="right" @click="onCancle" v-if="inputValue != '' && showOne">取消</span>
		</van-nav-bar>


		<van-row type="flex" justify="space-between" v-show="inputValue == ''">
			<van-col span="6" style="font-weight: 700;">搜索历史</van-col>
			<van-col span="8" style="font-size: 14px;cursor: pointer;" @click="clearHistory">清除搜索历史</van-col>
		</van-row>
		<div style="padding: 10px;text-align: left;" v-show="inputValue == ''">
			<van-tag round v-for="(item,index) in historyList" :key="index"
			         style="font-size:14px;margin-right: 10px;margin-bottom: 10px;" @click="searchTag(item)">{{item}}
			</van-tag>
		</div>
		<div v-show="inputValue == '' && historyList.length == 0">无搜索历史</div>
		<Footer v-if="is_show_copyright == 1 && inputValue == ''" style="position: fixed;bottom: 0;left: 0;right: 0;"></Footer>
		<van-list
				:finished="finished"
				finished-text="没有更多了"
				v-show="inputValue != '' && !showOne"
		>
			<van-cell v-for="(item,index) in fuzzyArr" :key="index" @click="chooseResult(item.id,item.title)">
				<template slot="title">
					<span style="float: left;display:inline-block;max-width: 80%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.title  : item.title}}</span>
					<span style="float: right;font-size: 12px;color: #999;">{{item.type_name}}</span>
				</template>
			</van-cell>
		</van-list>
		<Footer v-if="is_show_copyright == 1 && inputValue != '' && !showOne"></Footer>

		<div v-if="inputValue != '' && showOne" style="padding: 0 10px;">
			<!--		文本-->
			<van-cell
					v-if="tabType == 6"
					:class="{ active:chooseMsgArr == list[0].id}"
					label-class="slider-text-label">
				<template slot="title">
					<span
							class="list-text"
							v-html="typeof list[0].first_group.first_group_name != 'undefined' && list[0].first_group.is_not_group != 1 ? '【' + list[0].first_group.first_group_name + '】' + list[0].file_name  : list[0].file_name"
							@click="chooseMsg(list[0])">
					</span>
					<span style="float: right;margin-left: 6px;" @click="showTextPicker(list[0])">
						<van-icon :name="textPicker ? 'arrow-down' : 'arrow'"/>
					</span>
				</template>
				<span
						slot="label"
						v-html="list[0].content"
						@click="chooseMsg(list[0])">

				</span>

				<van-popup v-model="textPicker" position="bottom" @close="textPickerCancle">
					<div>
						<div style="height: 40px;line-height: 40px;color: #1989FA;padding: 0 10px;">
							<div style="float: left;font-size: 14px;" @click="textPickerCancle">取消</div>
							<div style="float: right;font-size: 14px;" @click="sendMsg">发送</div>
						</div>
						<div style="height: 200px;overflow-y: auto;">
							<div style="padding: 0 16px 10px;text-align: left;color: #333;font-size: 14px;">
								{{list[0].file_name}}
							</div>
							<div style="text-align: left;padding: 0 16px;font-size: 12px;"
							     v-html="list[0].content"></div>
						</div>
					</div>
				</van-popup>
			</van-cell>
			<!--	    	1图片-->
			<van-grid :gutter="10" :column-num="3" style="padding: 10px 0;" v-if="tabType == 1">
				<van-grid-item :class="{ active:chooseMsgArr == list[0].id}">
					<img v-lazy="commonUrl+list[0].s_local_path" @click="previewPic(list[0])" class="img"
					     :style="height" v-if="list[0].s_local_path != null && list[0].s_local_path != ''"/>
					<img v-lazy="commonUrl+list[0].local_path" @click="previewPic(list[0])" class="img" :style="height"
					     v-if="list[0].s_local_path == null || list[0].s_local_path == ''"/>
					<van-icon :name="chooseMsgArr == list[0].id ? 'passed' : 'circle'" class="icon-passed"
					          :class="{active2:chooseMsgArr == list[0].id}" @click="chooseMsg(list[0])"/>
					<span class="pic-text" @click="previewPic(list[0])">{{typeof list[0].first_group.first_group_name != 'undefined' && list[0].first_group.is_not_group != 1 ? '【' + list[0].first_group.first_group_name + '】' + list[0].file_name  : list[0].file_name}}</span>
				</van-grid-item>
			</van-grid>
			<!--		3视频-->
			<van-cell v-if="tabType == 3" :class="{ active:chooseMsgArr == list[0].id}">
				<template slot="title">
					<img src="@/static/assets/video.png" alt="" class="file-img">
					<span class="file-title"
					      style="color: #323233;font-size: 14px;width: 100%;max-width: calc(100% - 60px);"
					      @click="videoPreview(commonUrl+list[0].local_path,list[0])">{{typeof list[0].first_group.first_group_name != 'undefined' && list[0].first_group.is_not_group != 1 ? '【' + list[0].first_group.first_group_name + '】' + list[0].file_name  : list[0].file_name}}</span>
					<van-icon
							:name="chooseMsgArr == list[0].id ? 'passed' : 'circle'"
							class="icon-passed"
							:class="chooseMsgArr == list[0].id?'active2' :''"
							@click="chooseMsg(list[0])"
							style="margin-top: 10px;margin-right: 5px;font-size: 22px;"/>
				</template>
			</van-cell>
			<!--		5文件-->
			<van-cell v-if="tabType == 5" @click="chooseMsg(list[0])" :class="{ active:chooseMsgArr == list[0].id}">
				<template slot="title">
					<img src="@/static/assets/doc.png" alt="" class="file-img" v-if="list[0].extension == 'doc'">
					<img src="@/static/assets/docx.png" alt="" class="file-img" v-if="list[0].extension == 'docx'">
					<img src="@/static/assets/xls.png" alt="" class="file-img" v-if="list[0].extension == 'xls'">
					<img src="@/static/assets/xlsx.png" alt="" class="file-img" v-if="list[0].extension == 'xlsx'">
					<img src="@/static/assets/csv.png" alt="" class="file-img" v-if="list[0].extension == 'csv'">
					<img src="@/static/assets/ppt.png" alt="" class="file-img" v-if="list[0].extension == 'ppt'">
					<img src="@/static/assets/pptx.png" alt="" class="file-img" v-if="list[0].extension == 'pptx'">
					<img src="@/static/assets/txt.png" alt="" class="file-img" v-if="list[0].extension == 'txt'">
					<img src="@/static/assets/pdf.png" alt="" class="file-img" v-if="list[0].extension == 'pdf'">
					<img src="@/static/assets/xmind.png" alt="" class="file-img" v-if="list[0].extension == 'xmind'">
					<div class="file-title">{{typeof list[0].first_group.first_group_name != 'undefined' &&
						list[0].first_group.is_not_group != 1 ? '【' + list[0].first_group.first_group_name + '】' +
						list[0].file_name : list[0].file_name}}
					</div>
				</template>
			</van-cell>
			<!--		4图文h5-->
			<van-cell :class="{ active:chooseMsgArr == list[0].id}" v-if="tabType == 4">
				<template slot="title">
					<img
							v-lazy="commonUrl+list[0].s_local_path"
							class="img2"
							v-if="list[0].s_local_path != null && list[0].s_local_path != ''"
							@click="h5Preview(list[0].jump_url,list[0])"/>
					<img
							v-lazy="commonUrl+list[0].local_path"
							class="img2"
							v-if="list[0].s_local_path == null || list[0].s_local_path == ''"
							@click="h5Preview(list[0].jump_url,list[0])"/>
					<view style="width: calc(100% - 65px);float: right;"
					      @click="h5Preview(list[0].jump_url,list[0])">
											<span class="list-text"
											      v-html="typeof list[0].first_group.first_group_name != 'undefined' && list[0].first_group.is_not_group != 1 ? '【' + list[0].first_group.first_group_name + '】' + list[0].file_name  : list[0].file_name"
											      style="line-height: 18px;"></span>
						<span class="list-text2" v-html="list[0].content"
						      v-show="list[0].content != '' && list[0].content != null"></span>
						<span class="list-text2" v-if="!list[0].content" v-html="list[0].file_name"
						      style="line-height: 18px;"></span>
					</view>
					<van-icon
							:name="chooseMsgArr == list[0].id ? 'passed' : 'circle'"
							class="icon-passed"
							:class="{active2:chooseMsgArr == list[0].id}"
							@click="chooseMsg(list[0])"
							style="margin-top: 10px;margin-right: 5px;font-size: 22px;"/>
				</template>
			</van-cell>
			<!--	小程序		-->
			<van-cell style="padding: 0 !important;width: 50%;" :class="{ active:chooseMsgArr == list[0].id}" v-if="tabType == 7">
				<template slot="title">
					<img v-lazy="commonUrl+list[0].s_local_path"
					     style="width: 100%;"
					     v-if="list[0].s_local_path != null && list[0].s_local_path != ''"
					     :style="height"/>
					<img v-lazy="commonUrl+list[0].local_path"
					     style="width: 100%;"
					     v-if="list[0].s_local_path == null || list[0].s_local_path == ''"
					     :style="height"/>
					<van-icon :name="chooseMsgArr == list[0].id ? 'passed' : 'circle'" class="icon-passed"
					          :class="{active2:chooseMsgArr == list[0].id}" @click="chooseMsg(list[0])"/>
					<span style="background: #0F0F0F;color: #FFF;font-size: 14px;width: 100%;opacity: 0.3;display: inline-block;width: 100%;">
						{{list[0].file_name}}
					</span>
				</template>
			</van-cell>
			<Footer v-if="is_show_copyright == 1"  style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
		</div>
		<!--		发送-->
		<van-button type="info" plain hairline block
		            style="position: fixed;bottom: 0;z-index:999;background: #1989FA;cursor: pointer;color: #FFF;"
		            @click="sendMsg" v-if="inputValue != '' && showOne">发送
		</van-button>
		<!--			预览图片-->
		<view
				v-if="show"
				class="uni-margin-wrap preview-box">
			<view @click="sendMsg(1)"
			      style="position: absolute;right: 16px;top: 16px;color: #FFF;cursor: pointer;z-index:9999999999999999;">
				发送
			</view>
			<swiper
					class="swiper swiper-box"
					current-item-id="0">
				<swiper-item v-for="(item, key) in images" :key="key" :item-id="String(key)">
					<view
							class="swiper-item"
							@touchmove="touchMove"
							@touchstart="touchStart"
							@touchend="touchEnd"
							@click="closePreview">
						<img
								:src="item"
								width="75%"
								class="img-info"/>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 图文预览页面 -->
		<view class="web-back" v-if="showWebview">
			<uni-nav-bar
					@clickLeft="webViewCancel"
					@clickRight="sendMsg(1)">
				<view slot="default"
				      style="text-align: center;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					{{previewTitle}}
				</view>
				<view slot="left" style="margin-left:9px; cursor: pointer; color:#1989FA;">取消</view>
				<view slot="right" style="color:#1989FA;cursor: pointer;">发送</view>
			</uni-nav-bar>
		</view>
		<view class="web-view" v-if="showWebview">
			<!-- 图文预览页面 -->
			<web-view :src="hFiveurl" v-if="showH5Preview"></web-view>
			<!-- 视频预览页面 -->
			<web-view :src="videourl" v-if="showVideoPreview"></web-view>
		</view>
	</div>
</template>

<script>
	import {Toast} from 'vant';
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : 'searchFocus',
		components: {Footer},
		inject    : ['initPage', 'getExternalId', 'getChatId', 'forbidden', 'getContext'],
		data () {
			return {
				agentId         : '',
				url             : '',
				user_id         : null,
				external_id     : null,
				wxReady         : false,
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				inputValue      : '',//搜索框输入内容
				historyList     : [],//搜索历史列表
				fuzzyArr        : [],//模糊搜索结果列表
				finished        : false,
				refreshing      : false,
				tabType         : '',//选中素材的Tab类型,6文本，1图片，3视频，5文件，4图文h5
				list            : [],//选中的素材
				showOne         : false,//是否展示搜索单个素材
				//文本
				textPicker      : false,//预览长文本弹窗的显示与隐藏
				chooseMsgArr    : '',//发送的素材id数组
				chooseMsgArray  : {},//发送的素材数组
				images          : [],//预览图片的数组
				height          : {
					height: ''
				},//图片的高度
				show            : false,//预览图片的显示与隐藏
				searchTimeout   : '',
				hFiveurl        : '',//图文预览链接地址
				showH5Preview   : false,//图文预览iframe的显示与隐藏
				showWebview     : false, // 是否显示webview
				previewTitle    : '',   // 预览NavBar标题
				previewId       : '',//预览的id
				previewItem     : {},//预览的item
				videourl        : '',//视频预览链接地址
				showVideoPreview: false,//图文预览iframe的显示与隐藏
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			};
		},
		methods   : {
			h5Preview (url, item) {
				// if (this.chooseMsgArr != item.id) {
				// 	this.chooseMsg(item)
				// }
				this.previewTitle = item.file_name
				this.hFiveurl = url
				this.showWebview = true
				this.showH5Preview = true

				this.previewId = item.id
				this.previewItem = item
			},
			webViewCancel () {
				this.initPage(this.resetWebView)
			},
			resetWebView() {
				this.showH5Preview = false
				this.showVideoPreview = false
				this.showWebview = false
				this.previewId = ''
				this.previewItem = {}
			},
			videoPreview (url, item) {
				// if (this.chooseMsgArr != item.id) {
				// 	this.chooseMsg(item)
				// }
				this.previewTitle = item.file_name
				this.videourl = url
				this.showWebview = true
				this.showVideoPreview = true

				this.previewId = item.id
				this.previewItem = item
			},
			onClickLeft () {
				localStorage.setItem('tabKey', 2)
				uni.reLaunch({
					url: "/pages/slider/index?agentId=" + this.agentId
				})
			},
			onSearch () {
				if (this.inputValue == '') {
					Toast.fail('请输入素材名称');
				} else {
					if (!this.historyList.includes(this.inputValue)) {
						if (this.historyList.length >= 15) {
							this.historyList.shift()
						}
						this.historyList.unshift(this.inputValue)
						localStorage.setItem('historyList', this.historyList)
					}
					this.$store.commit("setInputValue", this.inputValue);
					localStorage.setItem('tabKey', 2)
					uni.reLaunch({
						url: "/pages/slider/index?agentId=" + this.agentId
					})
				}
			},
			onCancle () {
				this.inputValue = ''
				this.showOne = false
				this.list = []
				this.tabType = ''
			},
			//清除搜索历史
			clearHistory () {
				this.historyList = []
				localStorage.setItem('historyList', this.historyList)
			},
			focusSearch () {
				if (!this.wxReady) {
					Toast.fail({
						forbidClick: false,
						duration   : 0,
						message    : '初始化未完成，请等待'
					})
				}
			},
			//搜索框内容变化
			changeInputValue () {
				if (this.wxReady) {
					this.showOne = false
					this.finished = false

					if (this.inputValue != '') {
						this.fuzzySearch()
					}
				} else {
					Toast.fail({
						forbidClick: false,
						duration   : 0,
						message    : '初始化未完成，请等待'
					})
				}
			},
			//模糊搜索
			fuzzySearch () {
				clearTimeout(this.searchTimeout)
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				this.searchTimeout = setTimeout(async () => {
					if (this.refreshing) {
						this.fuzzyArr = [];
						this.refreshing = false;
					}
					const {data: res} = await this.axios.post("chat-message/search", {
						uid     : localStorage.getItem('uid'),
						name    : this.inputValue,
						agent_id: localStorage.getItem('agent_id'),
						user_id : localStorage.getItem('user_id') != null ? localStorage.getItem('user_id') : '',
						group_id: this.$store.state.group_id,
					});
					if (res.error != 0) {
						uni.hideLoading();
						Toast.fail(res.error_msg);
					} else {
						this.fuzzyArr = res.data;
						this.finished = true
						uni.hideLoading();
					}
				}, 300)
			},
			//选择搜索结果
			chooseResult (id, title) {
				if (!this.historyList.includes(title)) {
					if (this.historyList.length >= 15) {
						this.historyList.shift()
					}
					this.historyList.unshift(title)
					localStorage.setItem('historyList', this.historyList)
				}
				this.inputValue = title
				this.showOne = true
				this.getList(id)
			},
			//获取素材列表
			async getList (id) {
				const {data: res} = await this.axios.post("chat-message/list", {
					uid : localStorage.getItem('uid'),
					name: this.inputValue,
					id  : id,
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.tabType = res.data.file_type
					this.list = res.data.attachment
					if (this.tabType == 6) {
						this.list[0].content = this.list[0].content.replace('\n', '<br>')
					} else if (this.tabType == 1) {
						//动态让图片高度等于宽度
						let width = (window.innerWidth - 46) / 3
						this.height.height = parseInt(width) + 'px'
					} else if (this.tabType == 7) {
						let width = (window.innerWidth - 46) / 2
						this.height.height = parseInt(width / 5 * 4) + 'px'
					}
				}
			},
			//预览长文本
			showTextPicker (item) {
				this.textPicker = true

				if (this.chooseMsgArr != item.id) {
					this.chooseMsg(item)
				}
			},
			textPickerCancle () {
				this.textPicker = false
			},
			//预览图片
			touchMove (e) {
				let currentX = e.changedTouches[0].pageX
				let currentY = e.changedTouches[0].pageY

				// window.event.target.style.marginLeft = (currentX - this.touchStartX) + 'px'
				// window.event.target.style.marginTop = (currentY - this.touchStartY) + 'px'
			},
			touchStart (e) {
				this.touchStartX = e.changedTouches[0].pageX
				this.touchStartY = e.changedTouches[0].pageY
			},
			touchEnd (e) {
				let currentY = e.changedTouches[0].pageY

				if (Math.abs(currentY) - Math.abs(this.touchStartY) > 100) {
					this.show = false
				} else {
					// window.event.target.style.marginLeft = 0
					// window.event.target.style.marginTop = 0
				}
			},
			closePreview () {
				this.show = false
				this.previewId = ''
				this.previewItem = {}
			},
			previewPic (item) {
				this.images = []
				this.images.push(this.commonUrl + item.local_path)
				this.show = true

				// if (this.chooseMsgArr == item.id) {
				// 	this.chooseMsgArr = ''
				// 	this.chooseMsgArray = {}
				// } else {
				// 	this.chooseMsgArr = item.id
				// 	this.chooseMsgArray = item
				// }
				// this.$store.commit("setChooseMsgArr", this.chooseMsgArr);
				// this.$store.commit("setChooseMsgArray", this.chooseMsgArray);

				this.previewId = item.id
				this.previewItem = item
			},
			//点击查询历史的tag
			searchTag (val) {
				if (this.wxReady) {
					this.inputValue = val
					this.fuzzySearch()
				} else {
					Toast.fail({
						forbidClick: false,
						duration   : 0,
						message    : '初始化未完成，请等待'
					})
				}
			},
			//选择发送素材
			chooseMsg (item) {
				// if(this.chooseMsgArr.length < 5){
				// 	//indexOf未找到返回-1，找到返回序列号
				// 	if(this.chooseMsgArr.indexOf(item.id) == -1){
				// 		this.chooseMsgArr.push(item.id)
				// 		this.chooseMsgArray.push(item)
				// 	}else {
				// 		let index = this.chooseMsgArr.indexOf(item.id)
				// 		this.chooseMsgArr.splice(index,1)
				// 		this.chooseMsgArray.splice(index,1)
				// 	}
				// }else {
				// 	if(this.chooseMsgArr.indexOf(item.id) == -1){
				// 		Toast.fail('一次最多发送5条素材');
				// 	}else {
				// 		let index = this.chooseMsgArr.indexOf(item.id)
				// 		this.chooseMsgArr.splice(index,1)
				// 		this.chooseMsgArray.splice(index,1)
				// 	}
				// }
				// localStorage.setItem('chooseMsgArr',this.chooseMsgArr)
				// localStorage.setItem('chooseMsgArray',JSON.stringify(this.chooseMsgArray))

				if (this.chooseMsgArr == item.id) {
					this.chooseMsgArr = ''
					this.chooseMsgArray = {}
				} else {
					this.chooseMsgArr = item.id
					this.chooseMsgArray = item
				}
				this.$store.commit("setChooseMsgArr", this.chooseMsgArr);
				this.$store.commit("setChooseMsgArray", this.chooseMsgArray);
			},
			//发送
			async sendMsg (value) {
				if(this.tabType == 7) {
					let agent = ''
					navigator.userAgent.replace(/(wxwork\/)[\S]*/g, function($1) {
						agent = $1.substring(7, 12)
					})
					if(agent < '3.1.0') {
						Toast.fail('企业微信版本过低，请更新版本！')
						return false
					}
				}
				this.show = false
				let chooseMsgArr = ''
				if (value && value == 1) {
					//预览中的发送,除文本
					chooseMsgArr = this.previewId
				} else {
					chooseMsgArr = this.chooseMsgArr
				}

				if (chooseMsgArr == '') {
					Toast.fail('请先选择素材');
				} else {
					Toast.loading({
						forbidClick: true,
						message    : '上传中...',
						duration   : 0
					});
					const {data: res} = await this.axios.post("chat-message/send-data", {
						uid        : this.uid,
						ids        : chooseMsgArr,
						corpid     : this.corpid,
						agent_id   : this.$route.query.agentId,
						user_id    : this.user_id,
						external_id: this.$store.state.externalId,
						chat_id    : this.$store.state.chatId
					});
					if (res.error != 0) {
						Toast.fail(res.error_msg);
					} else {
						let that = this
						Toast.clear()
						that.$store.state.wx.invoke('sendChatMessage', res.data[0], function (res) {
							if (res.err_msg == 'sendChatMessage:ok') {
								//发送成功
								that.textPicker = false
								that.show = false
								that.showWebview = false
								that.chooseMsgArr = ''
								that.chooseMsgArray = {}
								that.$store.commit("setChooseMsgArr", this.chooseMsgArr);
								that.$store.commit("setChooseMsgArray", this.chooseMsgArray);
							} else {
								if(res.err_msg.indexOf('not allow to cross corp') > -1) {
									Toast.fail('小程序发送失败，请将其关联到企业微信（企业微信管理后台-应用管理-小程序-关联小程序）。')
								}
							}
						})
					}
				}
			},
			async limit () {
				this.url = window.location.href
				let agent_id = localStorage.getItem('agent_id')
				this.user_id = localStorage.getItem('user_id') != null ? localStorage.getItem('user_id') : ''
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
					that.$store.dispatch('setCorpId', that.corpid)
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
										that.wxReady = true
										Toast.clear()

										that.getContext((entry = '') => {
											if (entry == '') {
												Toast.fail({
													forbidClick: true,
													duration   : 0,
													message    : '版本过低请升级'
												})
											}

											if (entry == 'group_chat_tools') {
												that.getChatId(null, () => {
													Toast.fail({
														forbidClick: true,
														duration   : 0,
														message    : '获取群组失败'
													})
												})
											} else {
												that.getExternalId(null, () => {
													Toast.fail({
														forbidClick: true,
														duration   : 0,
														message    : '获取外部联系人失败'
													})
												})
											}
										}, () => {
											Toast.fail({
												forbidClick: true,
												duration   : 0,
												message    : '版本过低请升级'
											})
										})
									},
									fail     : function (res) {
										if (res.errMsg.indexOf('function not exist') > -1) {
											Toast.fail({
												forbidClick: true,
												duration   : 0,
												message    : '版本过低请升级'
											})
										}
									}
								})
							}
						}, 300)
					})
				}
			}
		},
		onShow () {
			let historyList = localStorage.getItem('historyList')
			if (historyList) {
				this.historyList = historyList.split(',')
			} else {
				this.historyList = []
			}
			let chooseMsgArr = this.$store.state.chooseMsgArr
			if (chooseMsgArr) {
				this.chooseMsgArr = chooseMsgArr
			} else {
				this.chooseMsgArr = ''
			}
			this.agentId = this.$route.query.agentId
			let chooseMsgArray = this.$store.state.chooseMsgArray
			if (chooseMsgArray) {
				this.chooseMsgArray = chooseMsgArray
			} else {
				this.chooseMsgArray = {}
			}

			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.limit)
			})

			this.is_show_copyright = localStorage.getItem('is_show_copyright')

			// this.wxReady = true
			// localStorage.setItem('uid', 2)
		},
		onLoad () {
			localStorage.setItem('needAgentConfig', 'true')
		},
		onHide () {
			if (localStorage.getItem('needAgentConfig')) {
				localStorage.removeItem('needAgentConfig')
			}
		}
	}
</script>

<style>
	@import 'vant/lib/index.css'
</style>

<style scoped>


	.list-text {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: calc(100% - 20px);
		text-align: left;
	}

	.list-text2 {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
		color: #969799;
		font-size: 12px;
		line-height: 18px;
		max-width: calc(100% - 20px);
	}

	.van-cell__title {
		width: 100%;
	}

	.van-cell__value {
		flex: 0;
	}

	/deep/ .van-grid-item__content, .van-grid-item {
		padding: 0;
	}

	.img {
		max-width: 100%;
	}

	.pic-text {
		position: absolute;
		bottom: -25px;
		left: 0;
		right: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		padding: 3px;
		background: #0F0F0F;
		color: #FFF;
		opacity: 0.3;
		line-height: 19px;
	}

	.file-text {
		font-size: 14px;
		width: 100%;
		padding: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .van-nav-bar {
		height: 54px;
		line-height: 54px;
		margin-bottom: 10px;
	}

	.active {
		border: 2px solid #1989FA;
	}

	/deep/ .van-grid-item {
		padding-right: 0px !important;
		flex-basis: 30.5233% !important;
		margin-right: 14px !important;
		padding-bottom: 25px;
	}

	.slider-text-label {
		text-align: left;
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		/*text-overflow: -o-ellipsis-lastline;*/
		line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.file-img {
		width: 24px;
		float: left;
	}

	.file-title {
		float: left;
		margin-left: 15px;
		font-size: 16px;
		max-width: calc(100% - 39px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
	}

	.video-box {
		max-width: 100%;
		height: 0;
		padding-bottom: 100%;
		overflow: hidden;
		border: 1px solid #F2F2F2;
		line-height: 240px;
	}

	.video-img {
		max-width: 100%;
		max-height: 165.5px;
	}

	.video-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		padding: 5px;
		background: #0F0F0F;
		color: #FFF;
		opacity: 0.3;
		line-height: 15px;
	}

	.play-video {
		font-size: 40px;
		position: absolute;
		left: 50%;
		margin-left: -20px;
		margin-top: -20px;
		color: #646566;
	}

	.icon-passed {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 22px;
		color: #C8C9CC;
	}

	/deep/ .van-image-preview__cover {
		width: 100%;
	}

	.active2 {
		color: #1989FA !important;
	}

	.web-back {
		top: 0;
		right: 0;
		left: 0;
		height: 44px;
		z-index: 99;
		position: fixed;
	}

	.web-view {
		top: 44px;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
	}

	/deep/ .uni-navbar__header {
		background: rgba(0, 0, 0, .1) !important;
	}

	/deep/ .uni-navbar__header-container {
		width: calc(100% - 160px);
	}

	.icon-passed {
		position: absolute;
		top: 5px;
		right: 5px;
		font-size: 22px;
		color: #C8C9CC;
	}

	.img2 {
		width: 60px;
		height: 33px;
		margin-top: 3px;
	}

	.preview-box {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
		z-index: 9999999;
		background-color: #000000;
	}

	.swiper-box {
		height: 100%;
	}

	.swiper-item {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.img-info {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 25% 0;
	}
</style>
