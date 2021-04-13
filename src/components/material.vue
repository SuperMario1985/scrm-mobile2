<template>
	<view class="hello">
		<view v-if="showList">
			<view class="web-back" v-if="showWebview">
				<uni-nav-bar
						@clickLeft="webViewCancel"
						@clickRight="sendMsg(1)">
					<view slot="default"
					      style="text-align: center;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
						{{previewTitle}}
					</view>
					<view slot="left" style="margin-left:9px; cursor: pointer; color:#1989FA;">取消</view>
				</uni-nav-bar>
			</view>
			<view class="web-view" v-if="showWebview">
				<!-- 图文预览页面 -->
				<web-view :src="hFiveurl" v-if="showH5Preview"></web-view>
				<!-- 视频预览页面 -->
				<web-view :src="videourl" v-if="showVideoPreview"></web-view>
			</view>

			<!--		搜索框-->
			<view style="position: fixed;left: 0;right: 0;top: 0;">
				<van-search
						v-model="inputValue"
						placeholder="请输入素材名称"
						show-action
						:disabled="!wxReady"
						clearable
				>
					<div slot="action" v-if="inputValue.length>0" @click="focusSearch">搜索</div>
					<div slot="action" v-if="inputValue.length<=0" @click="searchCancel">取消</div>
				</van-search>

				<!--		选择分组-->
				<van-field
						readonly
						clickable
						name="picker"
						label="选择分组："
						v-model="groupName"
						@click="showPicker = true"
						placeholder="所有"/>
			</view>
			<!-- 分组 -->
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
						<Group :data="groupArr"></Group>
					</view>
				</view>
			</van-popup>

			<!--		Tab切换-->
			<van-tabs @click="changeTab" v-model="active" swipeable>
				<van-tab v-if="type==4" title="图文">
					<van-pull-refresh
							v-model="ishFiveLoading"
							success-text="刷新成功"
							@refresh="onRefresh"
					>
						<van-list
								v-model="hFiveLoading"
								:finished="noMorehFive"
								finished-text="没有更多了"
								@load="loadingItem">
							<template v-for="(item,index) in hFiveList">
								<van-cell
										:key="index"
										:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active' :''">
									<template slot="title">
										<img
												v-lazy="commonUrl+item.s_local_path"
												class="img2"
												v-if="item.s_local_path != null && item.s_local_path != ''"
												@click="h5Preview(item.jump_url,item)"/>
										<img
												v-lazy="commonUrl+item.local_path"
												class="img2"
												v-if="item.s_local_path == null || item.s_local_path == ''"
												@click="h5Preview(item.jump_url,item)"/>
										<view style="width: calc(100% - 65px);float: right;"
										      @click="h5Preview(item.jump_url,item)">
											<span class="list-text"
											      v-html="typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name  : item.file_name"
											      style="line-height: 18px;"></span>
											<span class="list-text2" v-html="item.content"
											      v-show="item.content != '' && item.content != null"></span>
											<span class="list-text2" v-if="!item.content" v-html="item.file_name"
											      style="line-height: 18px;"></span>
										</view>
										<van-icon
												:name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"
												class="icon-passed"
												:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active2' :''"
												@click="chooseMsg(item)"
												style="margin-top: 10px;margin-right: 5px;font-size: 22px;"/>
									</template>
								</van-cell>
							</template>
						</van-list>
					</van-pull-refresh>
				</van-tab>
				<van-tab v-if="type==2" title="图片">
					<van-pull-refresh
							v-model="isPicLoading"
							success-text="刷新成功"
							@refresh="onRefresh"
					>
						<van-grid :gutter="10" :column-num="3" style="padding: 10px 0;">
							<van-grid-item
									v-for="(item,index) in picList"
									:key="index"
									:class="{ active:includeId(chooseMsgH5OrFileArr, item.id) != -1}">
								<img
										v-lazy="commonUrl+item.s_local_path"
										@click="previewPic(index,item)"
										class="img"
										v-if="item.s_local_path != null && item.s_local_path != ''"
										:style="height"/>
								<img
										v-lazy="commonUrl+item.local_path"
										@click="previewPic(index,item)"
										class="img"
										v-if="item.s_local_path == null || item.s_local_path == ''"
										:style="height"/>
								<van-icon :name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"
								          class="icon-passed"
								          :class="{active2:includeId(chooseMsgH5OrFileArr, item.id) != -1}"
								          @click="chooseMsg(item)"/>
								<span class="pic-text"
								      @click="previewPic(index,item)">{{typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name : item.file_name}}</span>
							</van-grid-item>
						</van-grid>
					</van-pull-refresh>
					<view v-if="noMorePic"
					      style="color: #969799;font-size: 14px;line-height: 50px;margin-top: -20px;">
						没有更多了
					</view>
					<van-loading size="24px" v-if="picLoading" style="margin: -5px 20px 15px">加载中...</van-loading>
				</van-tab>
				<van-tab v-if="type==3" title="视频">
					<van-pull-refresh
							v-model="isVideoLoading"
							success-text="刷新成功"
							@refresh="onRefresh">
						<van-list
								v-model="videoLoading"
								:finished="videoFinished"
								finished-text="没有更多了"
								@load="loadingItem">
							<van-cell
									v-for="(item,index) in videoList"
									:key="index"
									:class="{ active:includeId(chooseMsgH5OrFileArr, item.id) != -1}">
								<template slot="title">
									<view style="height: 44px;">
										<img src="@/static/assets/video.png"
										     @click="videoPreview(commonUrl+item.local_path,item)" alt=""
										     class="file-img"
										>
										<span class="file-title"
										      style="color: #323233;font-size: 14px;width: 100%;max-width: calc(100% - 60px);"
										      @click="videoPreview(commonUrl+item.local_path,item)">{{typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name : item.file_name}}</span>
										<van-icon
												:name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"
												class="icon-passed"
												:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active2' :''"
												@click="chooseMsg(item)"
												style="margin-top: 10px;margin-right: 5px;font-size: 22px;"/>
									</view>
								</template>
							</van-cell>
						</van-list>
					</van-pull-refresh>
				</van-tab>
			</van-tabs>


			<!--			预览图片-->
			<view
					v-if="show"
					class="uni-margin-wrap preview-box">
				<swiper
						class="swiper swiper-box"
						:current-item-id="index">
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
			<!--		发送-->
			<view class="btn_box">
				<van-button
						type="primary"
						plain
						hairline
						block
						class="cancel_btn"
						:disabled="!wxReady"
						@click="cancel">
					取消
				</van-button>
			</view>
			<view class="btn_box">
				<van-button
						type="primary"
						plain
						hairline
						block
						class="send_btn"
						:disabled="!wxReady"
						@click="sendMsg">
					提交<span
						v-if="(tabType != 6) && chooseMsgH5OrFileArr.length > 0 && this.$store.state.chooseMsgType == tabType">（{{chooseMsgH5OrFileArr.length}}）</span>
				</van-button>
			</view>

			<!--      <view v-if="(tabType != 6) && wxReady"-->
			<!--            style="position: fixed;bottom: 0;left: 0;padding-left: 10px; z-index:1001;cursor: pointer;height: 2.347rem  /* 44/18.75 */;line-height: 2.347rem  /* 44/18.75 */;"-->
			<!--            :class="!wxReady ? 'blue-disabled' : 'blue'">-->
			<!--      </view>-->
		</view>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import Group from "@/components/Group";
	import axios from "axios";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()
	export default {
		name      : 'index',
		props     : {
			msg     : String,
			type    : Number,
			callBack: {
				type   : Function,
				default: null
			},
		},
		components: {
			Group
		},
		inject    : ['initPage', 'getExternalId', 'getChatId', 'forbidden', 'getContext'],
		data () {
			return {
				getListLoading        : true,
				wxReady               : false,
				showList              : false,
				corpid                : '',//企业微信的corpid，必须与当前登录的企业一致
				agentid               : this.$route.query.agentId,//企业微信的应用id
				agentkey              : '',
				url                   : '',
				ticketData            : {},
				agentData             : {},
				uid                   : '',
				userId                : null,
				commonUrl             : this.$store.state.commonUrl,//公共的链接
				activeNames           : ['1'],
				groupName             : '',//获取的分组名称
				group_id              : '',//获取的分组id
				showPicker            : false,//分组弹窗的显示与隐藏
				inputValue            : '',//搜索框内容
				resultId              : '',//搜索框搜索的素材id
				groupArr              : [],//分组
				active                : 0,//Tab类型,序列号
				tabType               : this.type,//Tab类型,6文本，1图片，3视频，5文件，4图文h5
				page                  : 1,//页数
				pageSize              : 15,//每页默认15条
				count                 : '',//所有素材总数量
				keys                  : '',
				//文本
				textLoading           : false,
				textFinished          : false,
				textList              : [],
				textPicker            : false,//预览长文本弹窗的显示与隐藏
				textIndex             : 0,//选中的文本的序列号
				isTextLoading         : false,//文本下拉刷新的Loading
				//图片
				isPicLoading          : false,//图片下拉刷新的Loading
				images                : [],//预览时图片数组
				picList               : [],
				picLoading            : false,//图片的加载组件
				noMorePic             : false,//图片没有更多的显示与隐藏
				height                : {
					height: ''
				},//图片的高度
				index                 : 0,//预览图片的起始位置
				show                  : false,//预览图片的显示与隐藏
				touchStartX           : 0,
				touchStartY           : 0,
				//视频
				isVideoLoading        : false,//视频下拉刷新的Loading
				videoList             : [],
				videoLoading          : false,//视频的加载组件
				videoFinished         : false,
				//文件
				isFileLoading         : false,//文件下拉刷新的Loading
				fileList              : [],
				fileLoading           : false,//文件的加载组件
				fileFinished          : false,
				//h5
				ishFiveLoading        : false,//h5下拉刷新的Loading
				hFiveList             : [],
				hFiveLoading          : false,//h5的加载组件
				noMorehFive           : false,//图片没有更多的显示与隐藏
				chooseMsgArr          : '',//发送的素材id数组
				chooseMsgArray        : {},//发送的素材数组
				chooseMsgH5OrFileArr  : [],
				chooseMsgH5OrFileArray: [],
				allSelectValue        : [],
				selectFlag            : false,
				attach_id             : '',//查询所有数据中是否包含该条
				hFiveurl              : '',//图文预览链接地址
				showH5Preview         : false,//图文预览iframe的显示与隐藏
				showWebview           : false, // 是否显示webview
				previewTitle          : '',   // 预览NavBar标题
				videourl              : '',//视频预览链接地址
				showVideoPreview      : false,//图文预览iframe的显示与隐藏
				previewId             : '',//预览的id
				previewItem           : {},//预览的item
				picture               : [],
				video                 : [],
				pictureTxet           : []

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
			focusSearch () {
				this.getList()
			},
			searchCancel () {
				this.inputValue = ''
				this.getList()
			},
			initData () {
				this.page = 1
				this.textList = []
				this.picList = []
				this.videoList = []
				this.fileList = []
				this.hFiveList = []

				this.textFinished = false
				this.fileFinished = false
				this.videoFinished = false
				this.noMorePic = false
				this.noMorehFive = false

				this.isTextLoading = false
				this.ishFiveLoading = false
				this.isFileLoading = false
				this.isPicLoading = false
				this.isVideoLoading = false

				this.textLoading = true
				this.hFiveLoading = true
				this.fileLoading = true
				this.picLoading = true
				this.videoLoading = true
			},
			//切换标签页
			changeTab (val) {
				if (!this.wxReady) {
					return false
				}
				if (this.getListLoading) {
					source.cancel()
				}
				//6文本，1图片，3视频，5文件，4图文h5
				if (val == 0) {
					this.tabType = 4
				} else if (val == 1) {
					this.tabType = 1
				} else if (val == 2) {
					this.tabType = 3
				}
				this.initData()
				if (this.tabType == 1) {
					this.getList()
				} else if (this.tabType == 5 || this.tabType == 4 || this.tabType == 3 || this.tabType == 6) {
					this.loadingItem()
				}
			},
			// 获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("chat-message/group", {
					uid: this.uid
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

			//获取素材列表
			async getList () {
				this.getListLoading = true
				const {data: res} = await this.axios.post("chat-message/list", {
					uid      : this.uid,
					file_type: this.tabType,
					name     : this.inputValue,
					group_id : this.group_id,
					id       : this.resultId,
					page     : this.page,
					pageSize : this.pageSize,
					attach_id: this.attach_id,//查询所有数据中是否包含该条
				}, {cancelToken: source.token});
				this.getListLoading = false
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.keys = []
					this.count = parseInt(res.data.count)
					if (this.getListLoading) {
						this.textList = []
						this.picList = []
						this.videoList = []
						this.fileList = []
						this.hFiveList = []
					}
					// this.tabType = res.data.file_type
					if (this.tabType == 1) {
						this.active = 3
					} else if (this.tabType == 3) {
						this.active = 4
					} else if (this.tabType == 4) {
						this.active = 1
					}
					for (let i = 0; i < res.data.attachment.length; i++) {
						if (res.data.attachment[i].file_type != this.tabType) {
							res.data.attachment.splice(i, 1)
						}
					}
					if (this.tabType == 6) {
						//文本
						if (this.page == 1) {
							this.textList = res.data.attachment
						} else {
							this.textList = this.textList.concat(res.data.attachment)
						}
						this.isTextLoading = false
						// 加载状态结束
						this.textLoading = false
						for (let i = 0; i < this.textList.length; i++) {
							if (this.textList[i].content) {
								this.textList[i].content = this.textList[i].content.replace('\n', '<br>')
							}
						}
						if (this.textList.length >= this.count || this.textList.length == 0) {
							// 数据全部加载完成
							this.textFinished = true;
						}
						if (this.chooseMsgArray != "{}" && this.chooseMsgArray.file_type == 6 && res.data.is_have == 1) {
							for (let x = 0; x < this.textList.length; x++) {
								if (this.chooseMsgArr == this.textList[x].id) {
									this.textList.splice(x, 1)
								}
							}
							this.textList.unshift(this.chooseMsgArray)
						}
					} else if (this.tabType == 1) {
						//图片
						this.keys = res.data.keys
						if (this.page == 1) {
							this.picList = res.data.attachment
						} else {
							this.picList = this.picList.concat(res.data.attachment)
						}
						this.images = []
						this.picLoading = false
						this.isPicLoading = false
						if (this.picList.length == 0) {
							this.noMorePic = true
						} else {
							for (let i = 0; i < this.picList.length; i++) {
								this.images.push(this.commonUrl + this.picList[i].local_path)
							}
						}

						if (this.chooseMsgH5OrFileArray.length > 0 && this.chooseMsgArray.file_type == 1 && res.data.is_have == 1) {
							for (let x = 0; x < this.picList.length; x++) {
								for (let choose of this.chooseMsgH5OrFileArray) {
									if (choose == this.picList[x].id) {
										this.picList.splice(x, 1)
									}
								}
							}
							this.picList.unshift(this.chooseMsgArray)
						}
						//动态让图片高度等于宽度
						let width = (window.innerWidth - 46) / 3
						this.height.height = parseInt(width) + 'px'
					} else if (this.tabType == 3) {
						//视频
						this.keys = res.data.keys
						if (this.page == 1) {
							this.videoList = res.data.attachment
						} else {
							this.videoList = this.videoList.concat(res.data.attachment)
						}
						this.isVideoLoading = false
						// 加载状态结束
						this.videoLoading = false
						if (this.videoList.length >= this.count) {
							// 数据全部加载完成
							this.videoFinished = true;
						}
						if (this.chooseMsgArray != "{}" && this.chooseMsgArray.file_type == 3 && res.data.is_have == 1) {
							for (let x = 0; x < this.videoList.length; x++) {
								if (this.chooseMsgArr == this.videoList[x].id) {
									this.videoList.splice(x, 1)
								}
							}
							this.videoList.unshift(this.chooseMsgArray)
						}

					} else if (this.tabType == 5) {
						//文件
						// 加载状态结束
						this.keys = res.data.keys
						if (this.includeArray(this.chooseMsgH5OrFileArr, this.keys)) {
							this.allSelectValue = ['1']
						} else {
							this.allSelectValue = []
						}
						let chooseMsgH5OrFileArray = JSON.parse(JSON.stringify(this.chooseMsgH5OrFileArray))
						for (let i = res.data.is_have.length - 1; i >= 0; i--) {
							if (res.data.is_have[i] == 0) {
								chooseMsgH5OrFileArray.splice(i, 1)
							}
						}
						if (chooseMsgH5OrFileArray.length != 0 && chooseMsgH5OrFileArray[0].file_type == 5) {
							for (let x = 0; x < res.data.attachment.length; x++) {
								for (let j = 0; j < chooseMsgH5OrFileArray.length; j++) {
									if (chooseMsgH5OrFileArray[j].id == res.data.attachment[x].id) {
										res.data.attachment.splice(x, 1)
									}
								}
							}
						}
						if (this.page == 1) {
							if (chooseMsgH5OrFileArray.length != 0 && chooseMsgH5OrFileArray[0].file_type == 5) {
								this.fileList = chooseMsgH5OrFileArray.concat(res.data.attachment)
							} else {
								this.fileList = res.data.attachment
							}
						} else {
							this.fileList = this.fileList.concat(res.data.attachment)
						}

						// 数据全部加载完成
						if (this.fileList.length >= this.count) {
							this.fileFinished = true
							this.fileLoading = false
							this.isFileLoading = false
							return false
						}
						if (res.data.attachment.length == 0) {
							this.page++
							let a = this.count / this.pageSize
							let b = ''
							if (this.count % this.pageSize !== 0) {
								b = parseInt(a) + 1
							} else {
								b = a
							}
							if (this.page <= b) {
								this.getList()
							} else {
								this.page--
							}
						} else {
							this.isFileLoading = false
							this.fileLoading = false
						}

					} else if (this.tabType == 4) {
						// 图文
						this.keys = res.data.keys
						if (this.includeArray(this.chooseMsgH5OrFileArr, this.keys)) {
							this.allSelectValue = ['1']
						} else {
							this.allSelectValue = []
						}
						let chooseMsgH5OrFileArray = JSON.parse(JSON.stringify(this.chooseMsgH5OrFileArray))
						for (let i = res.data.is_have.length - 1; i >= 0; i--) {
							if (res.data.is_have[i] == 0) {
								chooseMsgH5OrFileArray.splice(i, 1)
							}
						}
						if (chooseMsgH5OrFileArray.length != 0 && chooseMsgH5OrFileArray[0].file_type == 4) {
							for (let x = 0; x < res.data.attachment.length; x++) {
								for (let j = 0; j < chooseMsgH5OrFileArray.length; j++) {
									if (chooseMsgH5OrFileArray[j].id == res.data.attachment[x].id) {
										res.data.attachment.splice(x, 1)
									}
								}
							}
						}
						if (this.page == 1) {
							if (chooseMsgH5OrFileArray.length != 0 && chooseMsgH5OrFileArray[0].file_type == 4) {
								this.hFiveList = chooseMsgH5OrFileArray.concat(res.data.attachment)
							} else {
								this.hFiveList = res.data.attachment
							}
						} else {
							this.hFiveList = this.hFiveList.concat(res.data.attachment)
						}
						// 数据全部加载完成
						if (this.hFiveList.length >= this.count) {
							this.hFiveLoading = false
							this.ishFiveLoading = false
							this.noMorehFive = true
							return false
						}
						if (res.data.attachment.length == 0) {
							this.page++
							let a = this.count / this.pageSize
							let b = ''
							if (this.count % this.pageSize !== 0) {
								b = parseInt(a) + 1
							} else {
								b = a
							}
							if (this.page <= b) {
								this.getList()
							} else {
								this.page--
							}
						} else {
							this.hFiveLoading = false
							this.ishFiveLoading = false
						}
					}
				}
			},

			//文本的下拉刷新
			onRefresh () {
				this.initData()
				this.getList()
			},
			//预览长文本
			showTextPicker (index, item) {
				this.textPicker = true
				this.textIndex = index

				if (this.chooseMsgArr != item.id) {
					this.chooseMsg(item)
				}
			},
			textPickerCancle () {
				this.textPicker = false
				this.previewId = ''
				this.previewItem = {}
			},
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
			//预览图片
			previewPic (index, item) {
				this.index = String(index)
				this.show = true
				this.attach_id = item.id
				this.previewId = item.id
				this.previewItem = item
			},
			//选择发送素材
			chooseMsg (item) {
				console.log(item)
				//6文本，1图片，3视频，5文件，4图文h5
				if ((this.tabType == 3 || this.tabType == 4) & this.picture.length >= 1) {
					this.chooseMsgH5OrFileArr = []
					this.chooseMsgH5OrFileArray = []
					this.picture = []
				} else if (this.tabType == 1 & this.picture.length >= 9) {
					uni.showToast({
						title   : '只能选9个',
						image   : '/static/fail.png',
						duration: 2000
					});
					return
				}
				if (this.chooseMsgH5OrFileArr.length > 0) {
					if (this.$store.state.chooseMsgType != this.tabType) {
						this.chooseMsgH5OrFileArr = []
						this.chooseMsgH5OrFileArray = []
						this.picture = []
					}
				}

				let index = this.includeId(this.chooseMsgH5OrFileArr, item.id)
				if (index == -1) {
					this.chooseMsgH5OrFileArr.push(item.id)
					this.picture.push(item)
					if (!this.selectFlag) {
						this.chooseMsgH5OrFileArray.push(item)
					}
				} else {
					if (this.chooseMsgH5OrFileArr.length - 1 >= index) {
						this.chooseMsgH5OrFileArr.splice(index, 1)
						this.picture.splice(index, 1)
						if (!this.selectFlag) {
							this.chooseMsgH5OrFileArray.splice(index, 1)
						}
					}
				}
				if (this.includeArray(this.chooseMsgH5OrFileArr, this.keys)) {
					this.allSelectValue = ['1']
				} else {
					this.allSelectValue = []
				}
				this.attach_id = this.chooseMsgH5OrFileArr
				this.chooseMsgArr = ''
				this.chooseMsgArray = {}
				this.$store.commit("setChooseMsgH5OrFileArr", this.chooseMsgH5OrFileArr);
				this.$store.commit("setChooseMsgH5OrFileArray", this.chooseMsgH5OrFileArray);
				this.$store.commit("setChooseMsgArr", '');
				this.$store.commit("setChooseMsgArray", {});
				this.$store.commit("setChooseMsgType", this.tabType)
			},
			//发送
			cancel () {
				this.callBack()
			},
			sendMsg (value) {
				if (this.picture.length <= 0) {
					uni.showToast({
						title   : '请选择内容',
						image   : '/static/fail.png',
						duration: 2000
					});
					return
				}
				let content = []
				for (let item of this.picture) {
					let obj = {
						attachment  : item.id,
						sort        : item.id,
						local_path  : item.local_path,
						s_local_path: item.s_local_path,
						file_name   : item.file_name
					}
					content.push(obj)
				}
				this.callBack(content)
			},

			//监听页面滑动，要不要加载
			handleScroll () {
				//变量scrollTop是滚动条滚动时，距离顶部的距离
				var scrollTop = document.getElementsByClassName("van-tabs")[0].scrollTop;
				//变量windowHeight是可视区的高度
				var windowHeight = document.getElementsByClassName("van-tabs")[0].clientHeight;
				//变量scrollHeight是滚动条的总高度
				var scrollHeight = document.getElementsByClassName("van-tabs")[0].scrollHeight;
				//滚动条到底部的条件
				if (scrollTop + windowHeight == scrollHeight) {
					// window.console.log('触发啦')
					if (this.tabType == 1) {
						this.picLoading = true
						if (this.picList.length < this.count) {
							this.page++
							let a = this.count / this.pageSize
							let b = ''
							if (this.count % this.pageSize !== 0) {
								b = parseInt(a) + 1
							} else {
								b = a
							}
							if (this.page <= b) {
								this.getList()
							}
						} else {
							this.picLoading = false
							this.noMorePic = true
						}
					}
				}
			},
			loadingItem () {
				if (!this.wxReady) {
					return false
				}
				if (this.tabType == 6) {
					if (this.textList.length <= 0) {
						this.getList()
					} else if (this.textList.length < this.count) {
						this.page = this.page + 1
						let a = this.count / this.pageSize
						let b = ''
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						}
					}
				} else if (this.tabType == 3) {
					this.videoLoading = true
					if (this.videoList.length <= 0) {
						this.getList()
					} else if (this.videoList.length < this.count) {
						this.page++
						let a = this.count / this.pageSize
						let b = ''
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						}
					}
				} else if (this.tabType == 5) {
					if (this.getListLoading) {
						return false
					}
					this.fileLoading = true
					if (this.fileList.length == 0) {
						this.getList()
					} else if (this.fileList.length < this.count) {
						this.page++
						let a = this.count / this.pageSize
						let b = ''
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						}
					}
				} else if (this.tabType == 4) {
					this.hFiveLoading = true
					this.ishFiveLoading = true
					if (this.hFiveList.length == 0) {
						this.getList()
					} else if (this.hFiveList.length < this.count) {
						this.page++
						let a = this.count / this.pageSize
						let b = ''
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						}
					}
				}
			},

			//一进入页面请求该方法获取应用的权限
			initAgentConfig (that) {
				that.$store.state.wx.agentConfig({
					corpid   : that.agentData.corpid,
					agentid  : that.agentData.agentid,
					timestamp: that.agentData.timestamp,
					nonceStr : that.agentData.nonceStr,
					signature: that.agentData.signature,
					jsApiList: that.agentData.jsApiList,
					success  : function () {
						that.wxReady = true
						// alert('success')
						that.getGroupList()
						that.getList()

						// 回调
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
						} else if (res.errMsg == 'agentConfig:not match any reliable domain.') {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : '可信域名未填写或未验证'
							})
						} else {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : res.errMsg
							})
						}
					}
				})
			},
			includeId (ids, id) {
				if (!ids || ids.length == 0) {
					return -1
				}
				for (let i = 0; i < ids.length; i++) {
					if (id == ids[i]) {
						return i
					}
				}
				return -1
			},
			includeArray (list1, list2) {
				let flag1 = false
				for (let i = 0; i < list2.length; i++) {
					let flag = false
					for (let j = 0; j < list1.length; j++) {
						if (list2[i] == list1[j]) {
							flag = true
						}
					}
					if (!flag) {
						flag1 = false
						return false
					} else {
						flag1 = true
					}
				}
				if (!flag1) {
					return false
				}
				return true
			}
		},
		created () {
			if (this.type == 2) {
				this.tabType = 1
			}
			this.showList = true

			this.wxReady = true
			this.uid = 2
			this.getGroupList()
			this.getList()

			this.$nextTick(function () {
				window.document.getElementsByClassName("van-tabs")[0].addEventListener('scroll', this.handleScroll);
			})
		}
		,
		onLoad () {
			localStorage.setItem('needAgentConfig', 'true')
		}
		,
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
	/*.hello {*/
	/*	background: #F7F8FA;*/
	/*}*/
	.send_btn {
		width: 7rem;
		left: 11rem;
		bottom: 0.5rem;
		position: fixed;
		border-radius: 45px;
		border: none;
		/*width: 10rem;*/
		/*left: 10rem;*/
		/*bottom: 0;*/
		z-index: 1000;
		background: rgb(25, 137, 250);
		cursor: pointer;
		color: #FFF !important;
		height: 1.347rem;
	}

	.btn_box {

	}

	.cancel_btn {
		left: 2rem;
		bottom: 0.5rem;
		width: 7rem;
		background: #EEE9E9;
		border-radius: 45px;
		border: 1px solid #fff;
		position: fixed;
		color: #B5B5B5 !important;
		z-index: 1000;
		cursor: pointer;
		height: 1.347rem;
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		width: 16px;
		height: 16px;
	}

	/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #FFF;
	}

	.van-tab__pane, .van-tab__pane-wrapper {
		padding: 0 10px;
		border-bottom: 1px solid #F2F2F2;
	}

	.van-cell__title {
		width: 100%;
		text-align: left;
	}

	.van-cell__value {
		flex: 0;
	}

	/deep/ .van-cell {
		margin: 0px;
	}

	/deep/ .van-tabs__content {
		padding-top: 44px;
		background-color: #fff;
	}

	/deep/ .van-tabs--line .van-tabs__wrap {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
	}

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
	}

	/deep/ .van-grid-item__content {
		padding: 0;
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
		margin: 5px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/deep/ .van-tabs {
		top: 98px;
		right: 0;
		bottom: 44px;
		left: 0;
		position: fixed;
		overflow-y: auto;
	}

	.active {
		border: 2px solid #1989FA;
	}

	.active2 {
		color: #1989FA !important;
	}

	/deep/ .van-grid-item {
		padding-right: 0px !important;
		flex-basis: 30.5233% !important;
		margin-right: 4.21505% !important;
		padding-bottom: 25px;
	}

	/deep/ .van-grid-item:nth-child(3n+3) {
		padding-right: 0 !important;
		flex-basis: 30.5233% !important;
		margin-right: 0px !important;
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

	.img {
		max-width: 100%;
	}

	.img2 {
		width: 60px;
		height: 33px;
		margin-top: 3px;
	}

	.chooseGroupName {
		font-size: 14px;
		display: inline-block;
		max-width: calc(100% - 64px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		top: 5px;
		right: 5px;
		font-size: 22px;
		color: #C8C9CC;
	}

	/deep/ .van-image-preview__cover {
		width: 100%;
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

	.blue-disabled {
		background-color: #8CC4FC;
	}

	.blue {
		background-color: #1989FA;
	}

	.student-lists /deep/ uni-checkbox .uni-checkbox-input {
		background-color: #1989FA;
	}

	.student-lists /deep/ uni-checkbox .uni-checkbox-input, .student-lists /deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border-color: #FFF;
	}

	.student-lists /deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		color: #FFF;
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
