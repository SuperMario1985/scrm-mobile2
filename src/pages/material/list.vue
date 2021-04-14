<template>
	<view class="hello">
		<view v-if="showList && !pdfVisible">
			<!--		搜索框-->
			<view style="position: fixed;left: 0;right: 0;top: -1px;z-index: 1000; padding-top: 10px;">
				<van-field
					clearable
					size="small"
					style="width: calc(100% - 80px);display: inline-block;height: 33px;padding: 5px 10px;background-color: #EBEDF0; border-radius: 8px;"
					v-model="inputValue"
					placeholder="请输入素材名称"
				/>
				<span type="info" size="small"
				      style="width: 43px; display: inline-block;vertical-align: top;height: 34px;line-height: 34px;font-size: 14px;"
				      @click="queryName">搜索</span>
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
			<!-- 图片预览 -->
			<!--			<view v-if="show"-->
			<!--			      @click="cancelShow"-->
			<!--			      class="uni-margin-wrap preview-box">-->
			<!--				<view class="swiper-item">-->
			<!--					<img :src="previewUrl"-->
			<!--					     :width="picWidth+'%'" class="img-info"/>-->
			<!--				</view>-->

			<!--				<view style="position:fixed;bottom: 10px;left:calc(50% - 160px)">-->
			<!--					<button @click.stop="enlargePic" class="pic-btn">放大</button>-->
			<!--					<button @click.stop="shrinkPic" class="pic-btn">缩小</button>-->
			<!--					<button @click.stop="actureWidth" class="pic-btn" style="width: 100px">实际大小</button>-->
			<!--				</view>-->
			<!--			</view>-->
			<view class="web-back" v-if="showVideoPreview">
				<uni-nav-bar
					@clickLeft="cancelVideo">
					<view slot="default"
					      style="text-align: center;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
						{{ previewTitle }}
					</view>
					<view slot="left" style="margin-left:9px; cursor: pointer; color:#1989FA;">关闭</view>
				</uni-nav-bar>
			</view>
			<view class="web-view" v-if="showVideoPreview">
				<!-- 视频预览页面 -->
				<web-view :src="videourl" @click="cancelVideo"></web-view>
			</view>
			<!-- 分组 -->
			<van-popup v-model="showPicker" position="bottom">
				<view>
					<view style="height: 40px;line-height: 40px;color: #1989FA;padding: 0 10px;">
						<view style="float: left;cursor: pointer;" @click="handlerCancle">取消</view>
						<view class="chooseGroupName">{{ this.$store.state.groupName }}
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
			<view :key="pageKey" style="position: fixed; top: 100px; width: 100%;height: calc(100% - 100px)">
				<view class="metarial-list" style="height: 100%; overflow-y: auto;">
					<van-pull-refresh v-if="fileType == 1"
					                  v-model="ishFiveLoading"
					                  success-text="刷新成功"
					                  @refresh="onRefresh"
					>
						<van-grid :gutter="10" :column-num="3" style="padding: 10px 10px;">
							<van-grid-item
								v-for="(item,index) in picList"
								:key="index">
								<img
									v-lazy="item.s_local_path"
									@click="previewPic(item.local_path, item)"
									class="img"
									v-if="item.s_local_path != null && item.s_local_path != ''"
									:style="height"/>
								<img
									v-lazy="item.local_path"
									@click="previewPic(item.local_path, item)"
									class="img"
									v-if="item.s_local_path == null || item.s_local_path == ''"
									:style="height"/>
								<span class="pic-text" @click="previewPic(index, item)">{{ item.file_name }}</span>
							</van-grid-item>
						</van-grid>
						<Footer v-if="is_show_copyright == 1"></Footer>
					</van-pull-refresh>
					<view v-if="noMorePic && fileType == 1"
					      style="color: #969799;font-size: 14px;line-height: 50px;margin-top: -20px;">
						没有更多了
					</view>
					<van-loading size="24px" v-if="picLoading && fileType == 1" style="margin: -5px 20px 15px">加载中...
					</van-loading>
					<van-pull-refresh v-if="fileType == 4"
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
									:key="index">
									<template slot="title">
										<img
											v-lazy="item.s_local_path"
											class="img2"
											v-if="item.s_local_path != null && item.s_local_path != ''"
											@click="h5Preview(item.jump_url,item)"/>
										<img
											v-lazy="item.local_path"
											class="img2"
											v-if="item.s_local_path == null || item.s_local_path == ''"
											@click="h5Preview(item.jump_url,item)"/>
										<view style="width: calc(100% - 65px);float: right;"
										      @click="h5Preview(item.jump_url,item)">
														<span class="list-text" v-html="item.file_name"
														      style="line-height: 18px;"></span>
											<span class="list-text2" v-html="item.content"
											      v-show="item.content != '' && item.content != null"></span>
											<span class="list-text2" v-if="!item.content" v-html="item.file_name"
											      style="line-height: 18px;"></span>
										</view>
									</template>
								</van-cell>
							</template>
						</van-list>
						<Footer v-if="is_show_copyright == 1"></Footer>
					</van-pull-refresh>
					<van-pull-refresh v-if="fileType == 5"
					                  v-model="isFileLoading"
					                  success-text="刷新成功"
					                  @refresh="onRefresh"
					>
						<van-list
							v-model="fileLoading"
							:finished="fileFinished"
							finished-text="没有更多了"
							@load="loadingItem"
						>
							<van-cell @click="openFile(item.local_path, item)"
							          v-for="(item,index) in fileList"
							          :key="index">
								<template slot="title">
									<img src="@/static/assets/doc.png" alt="" class="file-img"
									     v-if="item.extension == 'doc'">
									<img
										src="@/static/assets/docx.png"
										alt=""
										class="file-img"
										v-if="item.extension == 'docx'">
									<img src="@/static/assets/xls.png" alt="" class="file-img"
									     v-if="item.extension == 'xls'">
									<img
										src="@/static/assets/xlsx.png"
										alt=""
										class="file-img"
										v-if="item.extension == 'xlsx'">
									<img src="@/static/assets/csv.png" alt="" class="file-img"
									     v-if="item.extension == 'csv'">
									<img src="@/static/assets/ppt.png" alt="" class="file-img"
									     v-if="item.extension == 'ppt'">
									<img
										src="@/static/assets/pptx.png"
										alt=""
										class="file-img"
										v-if="item.extension == 'pptx'">
									<img src="@/static/assets/txt.png" alt="" class="file-img"
									     v-if="item.extension == 'txt'">
									<img src="@/static/assets/pdf.png" alt="" class="file-img"
									     v-if="item.extension == 'pdf'">
									<img
										src="@/static/assets/xmind.png"
										alt=""
										class="file-img"
										v-if="item.extension == 'xmind'">
									<view class="file-title">{{ item.file_name }}</view>
								</template>
							</van-cell>
						</van-list>
						<Footer v-if="is_show_copyright == 1"></Footer>

					</van-pull-refresh>
					<van-pull-refresh v-if="fileType == 3"
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
								:key="index">
								<template slot="title">
									<view style="height: 24px;padding: 10px 0;">
										<img src="@/static/assets/video.png"
										     @click="videoPreview(item.local_path,item)" alt=""
										     class="file-img"
										>
										<span class="file-title"
										      style="color: #323233;font-size: 14px;width: 100%;max-width: calc(100% - 60px);"
										      @click="videoPreview(item.local_path, item)">{{ item.file_name }}</span>
										<!--										<van-icon-->
										<!--												:name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"-->
										<!--												class="icon-passed"-->
										<!--												:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active2' :''"-->
										<!--												@click="chooseMsg(item)"-->
										<!--												style="margin-top: 10px;margin-right: 5px;font-size: 22px;"/>-->
									</view>
								</template>
							</van-cell>
						</van-list>
						<Footer v-if="is_show_copyright == 1"></Footer>
					</van-pull-refresh>
				</view>
			</view>
		</view>
		<view v-if="!showList && !pdfVisible" style="padding: 20px;">
			<img src="@/static/assets/site.png" alt="" style="max-width: 300px; width: 100%;">
			<h2>欢迎使用云美来智慧营销系统</h2>
		</view>
		<view class="web-back" v-if="showList && pdfVisible">
			<uni-nav-bar
				@clickRight="closeWebView">
				<view slot="default"
				      style="text-align: center;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #FFF">
					{{ previewTitle }}
				</view>
				<view slot="right" style="color:#FFF;cursor: pointer;">关闭</view>
			</uni-nav-bar>
		</view>
		<view class="web-view" v-if="showList && pdfVisible">
			<web-view :src="pdfUrl"></web-view>
		</view>
		<uni-popup ref="txtVisible" type="center" @change="openPopup">
			<view
				style="font-size: 0.693rem  /* 13/18.75 */;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);width: calc(80% - 2.133rem  /* 40/18.75 */);height: 20.267rem  /* 380/18.75 */;background-color: rgb(255, 255, 255); padding: 1.067rem  /* 20/18.75 */;">
				<view style="margin-bottom: 0.533rem  /* 10/18.75 */;">
					<text style="display: inline-block; max-width: 60%;overflow: hidden; text-overflow: ellipsis;">
						{{ txtTitle }}
					</text>
					<uni-icons @click="openPopup({show: false})" type="close" size="16"
					           style="float: right; color: #01B065;"></uni-icons>
				</view>
				<scroll-view style="height: 18.667rem  /* 350/18.75 */;" :scroll-y="true">
					<pre style="text-align: left;word-break: break-all; white-space: normal;overflow-y: auto;"
					     v-html="txtContent"></pre>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import UniPopup from "../../components/uni-popup/uni-popup"
	import UniIcons from "../../components/uni-icons/uni-icons";
	import Group from "@/components/Group";
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : 'index',
		props     : {
			msg: String
		},
		components: {
			UniIcons,
			UniPopup,
			Group,
			Footer
		},
		inject    : ['initPage', 'getParameter', 'getCopyright'],
		data () {
			return {
				platForm   : '',
				picWidth   : 95,
				wxReady    : false,
				showList   : false,
				corpid     : '',//企业微信的corpid，必须与当前登录的企业一致
				agentId    : '',//企业微信的应用id
				chatId     : '',//群id
				agentkey   : '',
				url        : '',
				ticketData : {},
				agentData  : {},
				uid        : '',
				ids        : '',
				attachCode : '',
				fileType   : 5,
				activeNames: ['1'],
				groupName  : '',//获取的分组名称
				group_id   : '',//获取的分组id
				showPicker : false,//分组弹窗的显示与隐藏
				inputValue : '',//搜索框内容
				resultId   : '',//搜索框搜索的素材id
				groupArr   : [],//分组
				page       : 1,//页数
				pageSize   : 15,//每页默认15条
				count      : '',//所有素材总数量
				//文件
				isFileLoading: false,//文件下拉刷新的Loading
				fileList     : [],
				fileLoading  : false,//文件的加载组件
				fileFinished : false,
				//h5
				ishFiveLoading: false,//h5下拉刷新的Loading
				hFiveList     : [],
				hFiveLoading  : false,//h5的加载组件
				noMorehFive   : false,//图片没有更多的显示与隐藏
				previewTitle  : '',   // 预览NavBar标题
				//视频
				isVideoLoading  : false,//视频下拉刷新的Loading
				videoList       : [],
				videoLoading    : false,//视频的加载组件
				videoFinished   : false,
				videourl        : '',
				showVideoPreview: false,
				// 图片
				noMorePic        : false,
				picList          : [],
				picLoading       : false,
				isPicLoading     : false,
				images           : [],
				height           : {
					height: ''
				},//图片的高度
				show             : false,
				previewUrl       : '',
				top              : 0,
				attachId         : '',
				getIdLoading     : false,
				statisticId      : '',
				interval         : '',
				width            : 100,
				pdfDoc           : null,
				pages            : 0,
				showPdf          : false,
				pdfUrl           : '',
				pdfVisible       : false,
				txtContent       : '',
				txtTitle         : '',
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
				pageKey          : 0,
			};
		},
		methods: {
			h5Preview (url, item) {
				if (this.getIdLoading) {
					return false
				}
				this.getIdLoading = true
				this.attachId = item.id
				if (url.indexOf(this.$store.state.h5Url) > -1) {
					this.getStatisticId(null, url + '&history_url=' + encodeURIComponent(encodeURIComponent(window.location.href)), 1)
				} else {
					this.getStatisticId(null, url, 1)
				}
			},
			initData () {
				this.page = 1

				this.fileList = []
				this.hFiveList = []
				this.videoList = []
				this.picList = []

				this.fileFinished = false
				this.noMorehFive = false
				this.videoFinished = false
				this.noMorePic = false

				this.ishFiveLoading = false
				this.isFileLoading = false
				this.isPicLoading = false
				this.isVideoLoading = false

				this.hFiveLoading = true
				this.fileLoading = true
				this.picLoading = true
				this.videoLoading = true
			},
			// 获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("chat-message/group", {
					uid: this.uid,
					ids: this.ids
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
			queryName () {
				this.page = 1
				this.getList()
			},
			//获取素材列表
			async getList () {
				if (this.fileType == 1) {
					this.picLoading = true
				}
				const {data: res} = await this.axios.post("chat-message/send-display", {
					uid        : this.uid,
					ids        : this.ids,
					agent_id   : this.agentId,
					chat_id    : this.chatId,
					name       : this.inputValue,
					group_id   : this.group_id,
					page       : this.page,
					pageSize   : this.pageSize,
					attach_code: this.attachCode || ''
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.count = parseInt(res.data.count)
					this.fileType = res.data.file_type
					if (this.fileType == 5) {
						//文件
						if (this.page == 1) {
							this.fileList = res.data.attachment
						} else {
							this.fileList = this.fileList.concat(res.data.attachment)
						}
						// 数据全部加载完成
						if (this.fileList.length >= this.count) {
							this.fileFinished = true
						}
						this.fileLoading = false
						this.isFileLoading = false
					} else if (this.fileType == 4) {
						// 图文
						if (this.page == 1) {
							this.hFiveList = res.data.attachment
						} else {
							this.hFiveList = this.hFiveList.concat(res.data.attachment)
						}
						// 数据全部加载完成
						if (this.hFiveList.length >= this.count) {
							this.noMorehFive = true
						}
						this.hFiveLoading = false
						this.ishFiveLoading = false
					} else if (this.fileType == 1) {
						if (this.page == 1) {
							this.picList = res.data.attachment
						} else {
							this.picList = this.picList.concat(res.data.attachment)
						}
						this.images = []
						this.picLoading = false
						this.isPicLoading = false
						for (let i = 0; i < this.picList.length; i++) {
							this.images.push(this.picList[i].local_path)
						}
						//动态让图片高度等于宽度
						let width = (window.innerWidth - 46) / 3
						this.height.height = parseInt(width) + 'px'
						if (this.picList.length == 1) {
							console.log(this.picList[0].local_path)
							this.previewPic(this.picList[0].local_path, this.picList[0])
						}
					} else if (this.fileType == 3) {
						//视频
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
						if (this.videoList.length == 1) {
							this.videoPreview(this.videoList[0].local_path, this.videoList[0])
						}
					}
				}
			},
			//预览图片
			previewPic (url, item) {
				if (this.getIdLoading) {
					return false
				}
				let that = this
				uni.previewImage({
					urls    : [url],
					success : function (data) {
						that.getIdLoading = true
						that.previewUrl = url
						that.attachId = item.id
						that.getStatisticId()
					},
					complete: function () {
						console.log(83891)
					},
					fail    : function (err) {
					}
				});

				// this.show = true
			},
			cancelShow () {
				this.show = false
				this.previewUrl = ''
				this.attachId = ''
				clearInterval(this.interval)
				this.getIdLoading = false
			},
			enlargePic () {
				if (this.picWidth >= 95) {
					return
				}
				this.picWidth += 5
			},
			shrinkPic () {
				if (this.picWidth <= 30) {
					return
				}
				this.picWidth -= 5
			},
			actureWidth () {
				this.picWidth = 95
			},
			videoPreview (url, item) {
				if (this.getIdLoading) {
					return false
				}
				this.getIdLoading = true
				this.previewTitle = item.file_name
				this.attachId = item.id
				this.getStatisticId()
				this.videourl = url
				this.showVideoPreview = true
			},
			cancelVideo () {
				this.showVideoPreview = false
				this.previewTitle = ''
				clearInterval(this.interval)
				this.attachId = ''
				this.videourl = ''
				this.getIdLoading = false
			},
			async getStatisticId (callback, url, type) {
				let that = this
				let params = {
					attach_id  : that.attachId,
					attach_code: that.attachCode || ''
				}
				if (localStorage.getItem("user_id")) {
					// 外部联系人
					// params['user'] = localStorage.getItem('user_id')
					// params['user_type'] = 1
				} else if (localStorage.getItem("external_id")) {
					// 外部联系人
					params['user'] = localStorage.getItem('external_id')
					params['user_type'] = 2
				} else if (localStorage.getItem("openid")) {
					// 普通用户
					params['user'] = localStorage.getItem('openid')
					params['user_type'] = 3
				}
				// else if (localStorage.getItem("user_id")) {
				// 	// 企业成员 暂不记录
				// 	params.user = localStorage.getItem('user_id')
				// 	params.user_type = 1
				// }
				const {data: res} = await this.axios.post("image-text/get-statistic-id", params);
				if (res.error != 0) {
					// Toast.fail(res.error_msg);
				} else {
					let that = this
					that.statisticId = res.data.statistic_id
					if (typeof callback == 'function') {
						callback(url)
					}
					if (type == 1) {
						window.location.href = url
					}

					if (that.getParameter("agent_id") !== null || window.location.href.indexOf('preview-image') > 0) {
						that.interval = setInterval(() => {
							that.send()
						}, 300)
					}
				}
			},
			send () {
				this.ws.websocketSend(
					JSON.stringify({
						channel: "pull",
						info   : {
							type        : 1,
							uid         : this.getParameter('user_id'),
							statistic_id: this.statisticId
						}
					})
				)
			},
			//下拉刷新
			onRefresh () {
				this.initData()
				this.getList()
			},
			openFile (url, item) {
				if (this.getIdLoading) {
					return false
				}
				this.getIdLoading = true
				this.attachId = item.id
				this.previewTitle = item.file_name
				if (item.extension == 'pdf') {
					this.getStatisticId(this.openPdf, '/hybrid/html/web/viewer.html?file=' + encodeURIComponent(url))
				} else if (item.extension == 'txt') {
					this.txtTitle = item.file_name
					this.txtContent = item.txt_content
					this.getStatisticId(this.openTxt)
				} else {
					this.getStatisticId(this.openUrl, url)
				}
			},
			openTxt () {
				this.$refs.txtVisible.open()
				this.getIdLoading = false
			},
			openPopup (e) {
				if (e.show == false) {
					this.$refs.txtVisible.close()
					clearInterval(this.interval)
				}
				this.getIdLoading = false
			},
			closeWebView () {
				clearInterval(this.interval)
				this.previewTitle = ''
				this.pdfUrl = ''
				this.pdfVisible = false
			},
			openPdf (url) {
				this.pdfUrl = url
				this.pdfVisible = true
			},
			openUrl (url) {
				clearInterval(this.interval)
				// this.getIdLoading = false
				window.location.href = url
			},
			loadingItem () {
				if (this.count == '') {
					return false
				}
				if (this.fileType == 5) {
					this.fileLoading = false
					if (this.fileList.length < this.count) {
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
						// 加载状态结束
						this.fileLoading = false;
						// 数据全部加载完成
						this.fileFinished = true;
					}
				} else if (this.fileType == 4) {
					this.hFiveLoading = false
					this.ishFiveLoading = false
					if (this.hFiveList.length < this.count) {
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
						this.noMorehFive = true
						this.hFiveLoading = false
						this.ishFiveLoading = true
					}
				} else if (this.fileType == 3) {
					this.videoLoading = true
					if (this.videoList.length == 0) {
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
				}
			},
			//监听页面滑动，要不要加载
			handleScroll () {
				//变量scrollTop是滚动条滚动时，距离顶部的距离
				var scrollTop = document.getElementsByClassName("metarial-list")[0].scrollTop;
				//变量windowHeight是可视区的高度
				var windowHeight = document.getElementsByClassName("metarial-list")[0].clientHeight;
				//变量scrollHeight是滚动条的总高度
				var scrollHeight = document.getElementsByClassName("metarial-list")[0].scrollHeight;
				//滚动条到底部的条件
				if (scrollTop + windowHeight == scrollHeight) {
					// window.console.log('触发啦')
					if (this.fileType == 1) {
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
			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				this.userId = localStorage.getItem('user_id') != null ? localStorage.getItem('user_id') : ''
				let agent_id = this.agentId
				localStorage.setItem('agent_id', agent_id)
				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.uid = res.data.uid
					this.corpid = res.data.corpid
					localStorage.setItem('uid', this.uid)

					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						this.getCopyright(this.refresh)
					}

					localStorage.setItem('corpid', this.corpid)
					this.getGroupList()
					this.getList()
				}
			},
			//重新渲染頁面
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
		},
		onShow () {
			// 取消定时器
			if (this.interval) {
				this.pageKey++
				this.cancelShow()
				return
			}

			this.attachId = ''
			this.showList = true
			this.platForm = localStorage.getItem('userPlatform')
			this.getIdLoading = false
			if (this.$route.query.ids) {
				this.ids = this.$route.query.ids
			}
			if (this.$route.query.attach_code) {
				this.attachCode = this.$route.query.attach_code
			}
			if (this.$route.query.uid) {
				this.uid = this.$route.query.uid

				localStorage.setItem('uid', this.uid)
				if (localStorage.getItem('uid')) {
					//获取底部技术支持
					this.getCopyright(this.refresh)
				}
			}
			if (this.$route.query.agent_id) {
				if (typeof this.$route.query.agent_id == 'object') {
					if (this.$route.query.agent_id.length > 0) {
						this.agentId = this.$route.query.agent_id[0]
					} else {
						this.agentId = ''
					}
				} else {
					this.agentId = this.$route.query.agent_id
				}
			}

			if (this.$route.query.chat_id) {
				this.chatId = this.$route.query.chat_id
			}

			if (this.$route.query.file_type) {
				this.fileType = this.$route.query.file_type
				let _this = this
				if (this.fileType == 1) {
					uni.setNavigationBarTitle({
						title: '图片查看'
					});
				} else if (this.fileType == 3) {
					uni.setNavigationBarTitle({
						title: '视频查看'
					});
				} else if (this.fileType == 4) {
					uni.setNavigationBarTitle({
						title: '图文查看'
					});
				} else if (this.fileType == 5) {
					uni.setNavigationBarTitle({
						title: '文件查看'
					});
				}
				if (this.agentId) {
					this.$store.dispatch('setWx', () => {
						_this.initPage(_this.limit)
					})

					// this.userId = 'xuyumin'
					// this.corpid = 'ww93caebeee67d134b'
					// this.getGroupList()
					// this.getList()

				} else {
					this.getGroupList()
					this.getList()
				}
				if (this.fileType == 1) {
					this.$nextTick(function () {
						window.document.getElementsByClassName("metarial-list")[0].addEventListener('scroll', _this.handleScroll);
					})
				}
			} else {
				this.getGroupList()
				this.getList()
			}
		},
		mounted () {
			document.body.style.backgroundColor = "#FFFFFF"
		}
	}
</script>

<style>
	@import 'vant/lib/index.css'
</style>

<style scoped>
	.hello {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #FFF;
	}

	.van-pull-refresh {
		height: 100%;
		overflow-y: auto;
	}

	body > iframe {
		position: fixed !important;
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
		max-width: calc(100% - 20px);
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
		z-index: 999;
		position: fixed;
	}

	.web-view {
		top: 43px;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
	}

	/deep/ iframe {
		z-index: 9999 !important;
	}

	/deep/ .uni-navbar__header {
		background: #01B065 !important;
	}

	/deep/ .uni-navbar__header-container {
		width: calc(100% - 160px);
	}

	.preview-box {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
		z-index: 9999999;
		background-color: #000000;
		height: 100%;
		overflow: auto;
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
	}

	.pic-btn {
		display: inline-block;
		margin: 0 10px;
		width: 80px;
		font-size: 14px;
		line-height: 30px;
	}

	.add-project /deep/ .uni-tip {
		width: 100%;
		border-radius: 5px 5px 0 0;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
	}
</style>
