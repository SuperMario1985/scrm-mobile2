<template>
	<view class="box">
		<view class="search-box">
			<uni-search-bar
					radius="5"
					placeholder="输入要搜索的内容"
					cancelButton="always"
					cancelText="关闭"
					@input="search"
					@cancel="closeFilingCabinet"/>
		</view>
		<view class="group-box">
			<van-field
					readonly
					clickable
					name="picker"
					label="选择分组："
					v-model="groupName"
					@click="showPicker = true"
					placeholder="所有">

			</van-field>

			<van-popup v-model="showPicker" position="bottom">
				<view>
					<view style="height: 40px;line-height: 40px;color: #1989FA;padding: 0 10px;">
						<view style="float: left;cursor: pointer;" @click="handlerCancle">取消</view>
						<view class="chooseGroupName">{{this.$store.state.groupName}}
							<van-icon
									name="close"
									@click="clearGroup"
									v-show="this.$store.state.groupName != ''"
									style="margin-left: 5px;"/>
						</view>
						<view style="float: right;cursor: pointer;" @click="handlerOk">确定</view>
					</view>
					<view style="height: 200px;overflow-y: auto;">
						<group :data="groupArr"></group>
					</view>
				</view>
			</van-popup>
		</view>
		<view class="content-box">
			<view class="content-info">
				<scroll-view
						id="tab-bar"
						class="scroll-h"
						:scroll-x="true"
						:show-scrollbar="false"
						:scroll-into-view="scrollInto">
					<view
							class="uni-tab-item"
							v-for="(tab, index) in tabBar"
							:id="tab.id"
							:data-current="index"
							:key="index"
							@click="onTabTap">
						<text
								class="uni-tab-item-title"
								:class="tabIndex == index ? 'uni-tab-item-title-active' : ''">
							{{tab.name}}
						</text>
					</view>
				</scroll-view>
				<view class="line-h"></view>
				<swiper
						:current="tabIndex"
						class="swiper-box"
						style="flex: 1;"
						:duration="300"
						@change="onTabChange">
					<swiper-item
							class="swiper-item"
							v-for="(filingCabinet, index1) in filingCabinetList"
							:key="index1">
						<scroll-view
								class="scroll-v list"
								:enableBackToTop="true"
								:scroll-y="true"
								@scrolltolower="loadMore(index1)">
							<view
									v-for="(filingCabinetItem, index2) in filingCabinet.list"
									:key="filingCabinetItem.id"
									@click="send(index1, index2)">
								<!-- 文本 -->
								<view
										v-if="filingCabinet.id == 'text'"
										class="scroll-view-item text-item">
									<text class="text-title">{{filingCabinetItem.file_name}}</text>
									<view class="text-content">{{filingCabinetItem.content}}</view>
								</view>
								<!-- 图片 -->
								<view
										v-if="filingCabinet.id == 'image'"
										class="scroll-view-item image-item">
									<view class="image-box">
										<image
												style="width: 60px; height: 60px; background-color: #EEEEEE;"
												:src="$store.state.commonUrl + filingCabinetItem.local_path"
												mode="aspectFit"></image>
									</view>
									<view class="description-box">
										<text>{{filingCabinetItem.file_name}}</text>
									</view>
								</view>
								<!-- 图文 -->
								<view
										v-if="filingCabinet.id == 'news'"
										class="scroll-view-item news-item">

									<view class="image-box">
										<image
												v-if="filingCabinetItem.artList[0].s_local_path"
												:src="$store.state.commonUrl + filingCabinetItem.artList[0].s_local_path"
												style="width: 60px; height: 60px; background-color: #EEEEEE;"
												mode="aspectFit"></image>
										<image
												v-else
												:src="$store.state.commonUrl + filingCabinetItem.artList[0].local_path"
												style="width: 60px; height: 60px; background-color: #EEEEEE;"
												mode="aspectFit"></image>
									</view>
									<view class="description-box">
										<text>{{filingCabinetItem.artList[0].title}}</text>
									</view>
								</view>
								<!-- 音频 -->
								<view
										v-if="filingCabinet.id == 'voice'"
										class="scroll-view-item voice-item">
									<text class="text-title">{{filingCabinetItem.file_name}}</text>
								</view>
								<!-- 视频 -->
								<view
										v-if="filingCabinet.id == 'video'"
										class="scroll-view-item video-item">
									<text class="text-title">{{filingCabinetItem.file_name}}</text>
								</view>
								<!-- 小程序 -->
								<view
										v-if="filingCabinet.id == 'mini'"
										class="scroll-view-item mini-item">

									<view class="image-box">
										<image
												style="width: 60px; height: 60px; background-color: #EEEEEE;"
												:src="$store.state.commonUrl + filingCabinetItem.local_path"
												mode="aspectFit"></image>
									</view>
									<view class="description-box">
										<text>{{filingCabinetItem.file_name}}</text>
									</view>
								</view>
							</view>

							<view class="loading-more" v-if="isMoreLoading">
								<text class="loading-more-text">加载中</text>
							</view>

							<view class="loading-no-more" v-if="isNoMore">
								<text class="loading-more-text">没有更多了</text>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import Group from "./Group";
	import {Toast} from "vant";

	export default {
		name      : "FilingCabinet",
		props     : {
			close   : {
				type    : Function,
				required: true,
			},
			comeFrom: {
				type   : String,
				default: 'wx'
			},
			callBack: {
				type   : Function,
				default: null
			},
			type    : {
				type   : Number,
				default: 0
			}
		},
		components: {
			Group
		},
		data () {
			return {
				searchTimeout    : '',
				showPicker       : false,
				groupName        : "",
				groupArr         : [],//分组
				scrollInto       : '',
				disableTabTap    : false,
				disableTabChange : false,
				tabIndex         : 0,
				tabBar           : [],
				filingCabinetList: [],
				page             : 1,
				pageSize         : 15,
				length           : 0,
				name             : '',
				material_type    : 6,
				file_type        : 6,
				news_type        : 1,
				isMoreLoading    : true,
				isNoMore         : false,
			}
		},
		methods   : {
			search (e) {
				clearTimeout(this.searchTimeout)
				this.searchTimeout = setTimeout(() => {
					this.name = e.value;
					this.page = 1
					this.getMaterial();
				}, 500)
			},
			closeFilingCabinet () {
				this.close()
			},
			//分组下的确定、取消
			handlerOk (e) {
				this.groupName = this.$store.state.groupName
				this.showPicker = false
				this.getList()
			},
			handlerCancle () {
				this.$store.commit("setGroupId", this.group_id);
				this.$store.commit("setGroupName", this.groupName);
				this.showPicker = false
			},
			clearGroup () {
				this.$store.commit("setGroupId", '');
				this.$store.commit("setGroupName", '');
			},
			onTabTap (e) {
				if (!this.disableTabTap) {
					this.disableTabChange = true
					let index = e.target.dataset.current || e.currentTarget.dataset.current;
					this.switchTab(index);
				}
			},
			onTabChange (e) {
				if (!this.disableTabChange) {
					this.disableTabTap = true
					let index = e.target.current || e.detail.current;
					this.switchTab(index);
				}
			},
			switchTab (index) {
				if (this.tabIndex === index) {
					return;
				}

				this.tabIndex = index;
				this.scrollInto = this.tabBar[index].id;

				this.getList();

				this.$nextTick(() => {
					this.disableTabTap = false
					this.disableTabChange = false
				})
			},
			loadMore (e) {
				this.isMoreLoading = true
				this.isNoMore = false
				this.page++
				this.getMaterial()
			},
			getList () {
				this.isMoreLoading = true
				this.isNoMore = false

				switch (this.scrollInto) {
					case 'text':
						this.material_type = 6
						this.file_type = 6
						break;
					case 'image':
						this.material_type = 1
						this.file_type = 2
						break;
					case 'news':
						this.material_type = 4
						this.file_type = 1
						break;
					case 'voice':
						this.material_type = 2
						this.file_type = 3
						break;
					case 'video':
						this.material_type = 3
						this.file_type = 4
						break;
					case 'mini':
						this.material_type = 7
						this.file_type = 7
						break;
				}

				this.filingCabinetList[this.tabIndex].list = []
				this.page = 1
				this.getMaterial()

				this.$nextTick(() => {
					this.isMoreLoading = false
					this.isNoMore = this.filingCabinetList[this.tabIndex].list.length == this.length
				})
			},
			send (listIndex, contentIndex) {
				let _this = this
				//this.$emit('replyMsg', value, content, item);
				let contentType = _this.filingCabinetList[listIndex].id
				let content = _this.filingCabinetList[listIndex].list[contentIndex]

				switch (contentType) {
					case 'text':
						if (_this.callBack !== null && typeof _this.callBack === "function") {
							_this.callBack(1, content.content)
						}

						break
					case 'image':
						if (_this.callBack !== null && typeof _this.callBack === "function") {
							_this.callBack(2, content.local_path, content)
						}

						break;
					case 'news':
						if (_this.callBack !== null && typeof _this.callBack === "function") {
							if (content.artList[0].s_local_path) {
								_this.callBack(3, content.artList[0].s_local_path, content)
							} else {
								_this.callBack(3, content.artList[0].local_path, content)
							}
						}

						break;
					case 'voice':
						if (_this.callBack !== null && typeof _this.callBack === "function") {
							_this.callBack(4, content, content)
						}

						break;
					case 'video':
						if (_this.callBack !== null && typeof _this.callBack === "function") {
							_this.callBack(5, content, content)
						}

						break;
					case 'mini':
						if (_this.callBack !== null && typeof _this.callBack === "function") {
							_this.callBack(6, content, content)
						}

						break;
				}
			},
			async getGroupList () {
				const {data: res} = await this.axios.post("chat-message/group", {
					uid: localStorage.getItem('uid')
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
					this.getMaterial()
				}
			},
			async getMaterial () {
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					file_type: this.file_type,
					comefrom : 2,
					news_type: this.news_type,
					group_id : this.$store.state.group_id,
					page     : this.page,
					pageSize : this.pageSize,
					name     : this.name,
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					if (this.material_type == 4) {
						this.$nextTick(() => {
							let info = [...res.data.attachment.single.list, ...res.data.attachment.double.list]
							if (this.page == 1) {
								this.filingCabinetList[this.tabIndex].list = info;
							} else {
								this.filingCabinetList[this.tabIndex].list = this.filingCabinetList[this.tabIndex].list.concat(info)
							}
							this.length = res.data.count;
						})
					} else if ([1, 2, 3, 5, 6, 7].indexOf(this.material_type) !== -1) {
						this.$nextTick(() => {
							if (this.page == 1) {
								this.filingCabinetList[this.tabIndex].list = res.data.attachment;
							} else {
								this.filingCabinetList[this.tabIndex].list = this.filingCabinetList[this.tabIndex].list.concat(res.data.attachment)
							}
							this.length = res.data.count;
						})
					}
				}

				this.$nextTick(() => {
					this.isMoreLoading = false
					this.isNoMore = this.filingCabinetList[this.tabIndex].list.length == this.length
				})
			},
		},
		created () {
			// localStorage.setItem('token', 'TWFpblVzZXItNTI0OGFhMDI3MGJiMTcyMzNlNmQ1MTMzMzJkYWU0ZGI=')
			// localStorage.setItem('uid', '2')
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('user_id', 'XuYuMin')
			// localStorage.setItem('externalId', 'wmiWVTDwAAF9Q74m4EJwZ7TTfxbQh9JA')
			if (this.comeFrom == 'wx') {
					this.tabBar = [
						{
							id  : 'text',
							name: '文本'
						},
						{
							id  : 'image',
							name: '图片'
						},
						{
							id  : 'news',
							name: '图文'
						},
						{
							id  : 'voice',
							name: '音频'
						},
						{
							id  : 'video',
							name: '视频'
						},
						{
							id  : 'mini',
							name: '小程序'
						},
					]
					this.filingCabinetList = [
						{
							id  : 'text',
							list: []
						},
						{
							id  : 'image',
							list: []
						},
						{
							id  : 'news',
							list: []
						},
						{
							id  : 'voice',
							list: []
						},
						{
							id  : 'video',
							list: []
						},
						{
							id  : 'mini',
							list: []
						},
					]
			} else {
				this.tabBar = [
					{
						id  : 'text',
						name: '文本'
					},
					{
						id  : 'image',
						name: '图片'
					},
				]
				this.filingCabinetList = [
					{
						id  : 'text',
						list: []
					},
					{
						id  : 'image',
						list: []
					},
				]
			}
			this.getGroupList()
		}
	}
</script>

<style lang="less" scoped>
	.box {
		.group-box {
			.chooseGroupName {
				font-size: 14px;
				display: inline-block;
				max-width: calc(100% - 64px);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.content-box {
			width: 100%;
			min-height: calc(100% - 96px);
			display: flex;

			.content-info {
				flex: 1;
				flex-direction: column;
				overflow: hidden;
				background-color: #FFFFFF;
				/* #ifdef MP-ALIPAY || MP-BAIDU */
				height: 100vh;
				/* #endif */
				display: inherit;

				.scroll-h {
					width: 375px;
					height: 40px;
					flex-direction: row;
					/* #ifndef APP-PLUS */
					white-space: nowrap;
					/* #endif */

					.uni-tab-item {
						/* #ifndef APP-PLUS */
						display: inline-block;
						/* #endif */
						flex-wrap: nowrap;
						padding-left: 17px;
						padding-right: 17px;

						.uni-tab-item-title {
							color: #555;
							font-size: 15px;
							height: 40px;
							line-height: 40px;
							flex-wrap: nowrap;
							/* #ifndef APP-PLUS */
							white-space: nowrap;
							/* #endif */
						}

						.uni-tab-item-title-active {
							color: #01B065;
						}
					}
				}

				.line-h {
					height: 0.5px;
					background-color: #CCCCCC;
				}

				.swiper-box {
					flex: 1;
					display: inherit;

					.swiper-item {
						flex: 1;
						flex-direction: row;
						display: flex;

						.scroll-v {
							flex: 1;
							/* #ifndef MP-ALIPAY */
							flex-direction: column;
							/* #endif */
							width: 100%;

							.scroll-view-item {
								width: calc(100% - 60px);
								text-align: left;
								padding: 15px;
								margin: 0 auto;
								border-bottom: 1px solid #E8E8E8;

								.text-title {
									font-size: 14px;
									display: block;
								}

								.text-content {
									font-size: 12px;
									color: #989898;
									display: block;
								}

								.image-box {
									width: 60px;
									height: 60px;
									margin-right: 20px;
									vertical-align: middle;
									display: inline-block;
								}

								.description-box {
									width: calc(100% - 80px);
									vertical-align: middle;
									display: inline-block;
								}
							}


							.loading-more,
							.loading-no-more {
								align-items: center;
								justify-content: center;
								padding-top: 10px;
								padding-bottom: 10px;
								text-align: center;

								.loading-more-text {
									font-size: 14px;
									color: #999;
								}
							}
						}
					}
				}
			}
		}
	}
</style>

<style>
	@import 'vant/lib/index.css'
</style>