<template>
	<view class="box">
		<view v-show="!showFilingCabinet">
			<!-- 头部区域 -->
			<uni-nav-bar
					left-icon="back"
					background-color="#5077B7"
					color="#FFFFFF"
					status-bar
					fixed
					@clickLeft="navigateBack">
				<view slot="default" class="notice-box">
					<uni-notice-bar
							v-if="nickname"
							:speed="20"
							color="#FFFFFF"
							background-color="#5077B7"
							scrollable="true"
							single="true"
							:text="nickname"
							class="notice-bar">
					</uni-notice-bar>
				</view>
				<view slot="right">
					<uni-icons color="#FFFFFF" type="more-filled" size="24"></uni-icons>
				</view>
			</uni-nav-bar>

			<!-- 消息区域 -->
			<view class="body-content" :class="actionBoxClass">
				<scroll-view
						:scroll-y="true"
						:style="{height: '100%'}"
						:scroll-with-animation="scrollAnimation"
						:scroll-top="scrollTop"
						:scroll-into-view="scrollToView"
						@scrolltoupper="loadHistory"
						@@scrolltolower="clearNewMsg"
						:upper-threshold="50"
						:lower-threshold="50"
						ref="msgContent">
					<view id="loadBox" class="loadMore">
						<uni-load-more :status="loadMoreStatus" :content-text="contentText"/>
					</view>
					<view v-for="msg in msgContent" :id="'msg' + msg.id" class="chat-content-list"
					      :ref="msg.id">
						<view class="time-divider" v-if="showTimeDivider(msg.id, msg.create_time)">
							{{formatMsgTime(msg.create_time, true)}}
						</view>
						<view class="content">
							<view :class="'avatar-box'  + (msg.from.type == 1 ? ' float-left' : ' float-right')">
								<image
										:src="typeof msg.from.data.headerimg != 'undefined' ? msg.from.data.headerimg : (typeof msg.from.data.head_img != 'undefined' ? msg.from.data.head_img : msg.from.data.avatar)"
										:lazy-load="true"
										class="user-avatar"/>
							</view>
							<view
									:class="'msg-content msg-content-' + msg.type + (msg.from.type == 1 ? ' float-left' : ' float-right')"
									v-html="initMsgContent(msg.content, msg.type, msg.id)"
									:data-type="msg.type"
									:data-key="msg.id"
									@click="addComment">
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 控制区域 -->
			<view class="action-box" :class="actionBoxClass">
				<view class="action-input">
					<input
							class="uni-input"
							v-model="valueInput.input"
							confirm-type="send"
							@confirm="reply"
							@focus="inputFocus"/>
				</view>
				<view class="action-btn-box">
					<view v-if="valueInput.input == ''">
						<view class="action-btn-list">
							<view class="action-btn more-icon biaoqing"></view>
						</view>
						<view class="action-btn-list" @click="showMore">
							<view class="action-btn more-icon add"></view>
						</view>
					</view>
					<view v-else class="send-box">
						<button
								class="send-btn"
								type="primary"
								@click="reply">
							发送
						</button>
					</view>
				</view>
				<view v-if="showMoreLayer" class="more-layer">
					<view class="more-list">
						<view class="more-box" @tap="chooseImage">
							<view class="more-icon tupian2"></view>
						</view>
						<view class="more-box" @tap="camera">
							<view class="more-icon paizhao"></view>
						</view>
						<view class="more-box">
							<view class="more-icon jianpan" @tap="filingCabinetOpen"></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 新消息 -->
			<view
					v-if="newMsg"
					class="new-msg-box"
					@click="newMsgChange">
				<uni-icons type="arrowdown" color="#54A9EB" style="margin-right: 0.267rem  /* 5/18.75 */;"></uni-icons>
				<text>{{unReadNum}}条新消息</text>
			</view>

			<!-- 图片预览 -->
			<view
					v-if="previewShow"
					class="uni-margin-wrap preview-box">
				<swiper
						class="swiper swiper-box"
						:current-item-id="previewIndex">
					<swiper-item v-for="(item, key) in previewInfo" :key="key" :item-id="key">
						<view
								class="swiper-item"
								@touchmove="touchMove"
								@touchstart="touchStart"
								@touchend="touchEnd"
								@click="closePreview">
							<img
									v-if="typeof item.previewType != 'undefined' && item.previewType == 'IMG'"
									:alt="item.previewAlt"
									:src="item.previewUrl"
									:width="item.previewWidth"
									:height="item.previewHeight"
									class="img-info"/>
							<video
									v-if="typeof item.previewType != 'undefined' && item.previewType == 'VIDEO'"
									:src="item.previewUrl"
									class="video-info"
									:width="item.previewWidth"
									:height="item.previewHeight"
									:enable-progress-gesture="false"
									:data-key="key"/>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 图片确认区域 -->
			<view>
				<van-dialog
						v-model="showDialog"
						show-cancel-button
						@confirm="confirmDialog"
						@cancel="cancelDialog"
				>
					<img
							:src="dialogImg"
							:style="{
							maxWidth: '100%',
							maxHeight:'300px',
							margin: '10px auto',
						}"/>
				</van-dialog>
			</view>
			<Footer v-show="$store.state.is_show_copyright == 1"></Footer>
		</view>
		<filing-cabinet
				v-if="showFilingCabinet"
				:close="filingCabinetClose"
				:come-from="chatType == 0 ? 'wx' : 'mini'"
				:call-back="replyMsg">
		</filing-cabinet>
	</view>
</template>

<script>
	import {Toast} from 'vant'
	import moment from "moment"
	import WEmoji from "@/static/js/wechatEmoji.js"
	import axios from "axios"
	import FilingCabinet from "../../components/FilingCabinet";
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import Footer from "../../components/footer/footer.vue";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	export default {
		name      : "msg",
		inject    : ['initPage'],
		components: {
			FilingCabinet,
			uniNoticeBar,Footer
		},
		data () {
			return {
				showFilingCabinet: false,
				agentId          : 0,
				commonUrl        : this.$store.state.commonUrl,
				loadMoreStatus   : 'more',
				valueInput       : {
					input         : '',
					reply         : '',
					item          : '',
					local_url     : '',
					media_duration: ''
				},
				msgType          : 1, // 消息类型 1：文本、2：图片、3：音频/小程序、4：视频、5、图文、6：音乐
				contentText      : {
					contentdown   : '',
					contentrefresh: '',
					contentnomore : '没有更多'
				},
				msgContent       : [],
				newMsg           : false,
				unReadNum        : 0,
				unReadMsgId      : 0,
				nickname         : '',//对话人的姓名
				chatType         : '',
				multiKey         : '',
				timeDivider      : {
					time: [],
					show: []
				},    // 消息的时间展示项
				userId           : 0,
				fromId           : '',
				isHistoryLoading : false,
				scrollAnimation  : false,
				scrollTop        : 0,
				scrollToView     : '',
				previewShow      : false,
				previewIndex     : 0,
				previewInfo      : {},
				windowWidth      : 0,
				windowHeight     : 0,
				touchStartX      : 0,
				touchStartY      : 0,
				playAudio        : {
					isPlay  : false,  //  是否在播放
					key     : 0,  // 播放key
					dom     : '', // 播放的dom
					interval: '',
				}, // 播放的音频信息
				actionBoxClass   : '',
				showMoreLayer    : false,
				showDialog       : false,
				unUploadImg      : '',
				comeFrom         : 1,    // 1:sys2:slider
				dialogImg        : '',
				mediaItem        : {}
			}
		},
		onLoad    : function (option) {
			let _this = this
			uni.getSystemInfo({
				success (res) {
					_this.windowWidth = res.windowWidth
					_this.windowHeight = res.windowHeight
				}
			})

			// 追加粉丝消息页面的获取消息后的回调
			this.ws.setCallback(this.websocketOnMessage)
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('sub_id', 2)
			// localStorage.setItem('user_type', 1)
			this.nickname = decodeURIComponent(option.nickname)
			this.chatType = parseInt(option.chatType)
			this.multiKey = typeof option.key != "undefined" ? option.key : "0,0"
			this.userId = option.id
			this.fromId = option.chatFromId
			this.agentId = option.agentId
			_this.$store.dispatch('setWx', () => {
				_this.initPage(_this.getData)
			})
			// _this.initPage(_this.$store.dispatch('setWx', () => {
			// 	_this.getData()
			// }))

			// _this.getData()
		},
		methods   : {
			loadHistory (e) {
				if (this.isHistoryLoading) {
					return
				}
				this.isHistoryLoading = true//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false//关闭滑动动画
				let lastId = this.msgContent[0].id//记住第一个信息ID

				this.loadMoreStatus = 'loading'
				this.getData(lastId)
			},
			clearNewMsg () {
				if (this.newMsg) {
					this.msgRead()
				}
			},
			// 点击新消息
			newMsgChange () {
				this.scrollToView = 'msg' + this.unReadMsgId

				this.$nextTick(() => {
					this.msgRead()
				})
			},
			//navbar返回
			navigateBack () {
				uni.reLaunch({
					url: "/pages/message/index?chatType=" + this.chatType + "&key=" + this.multiKey + "&agentId=" + this.agentId
				})
			},
			// 绑定预览和音频播放暂停事件
			addComment (e) {
				let previewData = ['2', '4', '7']
				let voiceData = ['3']
				if (previewData.indexOf(e.target.dataset.type) != -1) {
					this.preview(e)
				}

				if (voiceData.indexOf(e.target.dataset.type) != -1) {
					this.voicePlayOrStop(e)
				}
			},
			preview (e) {
				this.previewIndex = 'msg' + e.target.dataset.key
				this.previewShow = true
			},
			// 音频播放和暂停方法
			voicePlayOrStop (e) {
				// 取消语音结束监听
				clearInterval(this.playAudio.interval)

				// 初始化当前的语音信息
				const audioKey = e.target.dataset.key
				const audioDom = document.getElementById('voiceAudio' + audioKey)
				const cricleFirst = document.getElementById('voiceCircleFirst' + audioKey)
				const cricleSecond = document.getElementById('voiceCircleSecond' + audioKey)
				const cricleThird = document.getElementById('voiceCircleThird' + audioKey)

				// 判断当前是否有语音在播放中
				if (this.playAudio.isPlay) {
					this.playAudio.dom.pause()

					// 判断播放中的语音是否为当前的语音
					if (this.playAudio.key == audioKey) {
						this.playAudio.isPlay = false
						this.playAudio.key = 0
						this.playAudio.dom = ''

						cricleFirst.setAttribute("style", "")
						cricleSecond.setAttribute("style", "")
						cricleThird.setAttribute("style", "")
					} else {
						document.getElementById('voiceCircleFirst' + this.playAudio.key).setAttribute("style", "")
						document.getElementById('voiceCircleSecond' + this.playAudio.key).setAttribute("style", "")
						document.getElementById('voiceCircleThird' + this.playAudio.key).setAttribute("style", "")

						this.playAudio.key = audioKey
						this.playAudio.dom = audioDom

						cricleFirst.setAttribute("style", "animation: voiceRun1 3s linear infinite-moz-animation: voiceRun1 3s linear infinite-webkit-animation: voiceRun1 3s linear infinite-o-animation: voiceRun1 3s linear infinite")
						cricleSecond.setAttribute("style", "animation: voiceRun2 3s linear infinite-moz-animation: voiceRun2 3s linear infinite-webkit-animation: voiceRun2 3s linear infinite-o-animation: voiceRun2 3s linear infinite")
						cricleThird.setAttribute("style", "animation: voiceRun3 3s linear infinite-moz-animation: voiceRun3 3s linear infinite-webkit-animation: voiceRun3 3s linear infinite-o-animation: voiceRun3 3s linear infinite")

						audioDom.currentTime = 0
						audioDom.play()
					}
				} else {
					this.playAudio.isPlay = true
					this.playAudio.key = audioKey
					this.playAudio.dom = audioDom

					cricleFirst.setAttribute("style", "animation: voiceRun1 3s linear infinite-moz-animation: voiceRun1 3s linear infinite-webkit-animation: voiceRun1 3s linear infinite-o-animation: voiceRun1 3s linear infinite")
					cricleSecond.setAttribute("style", "animation: voiceRun2 3s linear infinite-moz-animation: voiceRun2 3s linear infinite-webkit-animation: voiceRun2 3s linear infinite-o-animation: voiceRun2 3s linear infinite")
					cricleThird.setAttribute("style", "animation: voiceRun3 3s linear infinite-moz-animation: voiceRun3 3s linear infinite-webkit-animation: voiceRun3 3s linear infinite-o-animation: voiceRun3 3s linear infinite")

					audioDom.currentTime = 0
					audioDom.play()
				}

				// 监听语音何时播放结束
				if (this.playAudio.isPlay) {
					this.playAudio.interval = setInterval(() => {
						if (this.playAudio.dom.ended) {
							document.getElementById('voiceCircleFirst' + this.playAudio.key).setAttribute("style", "")
							document.getElementById('voiceCircleSecond' + this.playAudio.key).setAttribute("style", "")
							document.getElementById('voiceCircleThird' + this.playAudio.key).setAttribute("style", "")

							this.playAudio.isPlay = false
							this.playAudio.key = 0
							this.playAudio.dom = ''

							clearInterval(this.playAudio.interval)
						}
					}, 10)
				}

			},
			// 初始化消息格式
			initMsgContent (content, type = 1, msgId = null) {
				let msgContent = ''
				switch (type) {
					case 1:
						msgContent = this.initTextMsgContent(content)

						break
					case 2:
						let imgContent = typeof content.local_path != "undefined" ? content : content[0]
						msgContent = this.initImgMsgContent(imgContent, msgId)

						break
					case 3:
						msgContent = this.initVoiceMsgContent(content, msgId)

						break
					case 5:
						msgContent = this.initNewsMsgContent(content)

						break
					case 4:
					case 7:
						msgContent = this.initVideoMsgContent(content, msgId)

						break
					case 8:
						msgContent = this.initLocationMsgContent(content)

						break
					case 9:
						msgContent = this.initLinkMsgContent(content)

						break
					case 10:
						msgContent = this.initMiniMsgContent(content)

						break
					default:

						break
				}

				return msgContent
			},
			// 初始化文本信息的格式
			initTextMsgContent (content) {
				const _this = this
				if (content.search(/[\/\[\]\(\)\|\$\*\?\+\-\_]/g) !== -1) {
					WEmoji.wechatEmojiKey.map((alt) => {
						let preg = new RegExp(_this.utils.addslashes(alt), 'g')
						let emojiUrl = WEmoji.getEmojiUrl(alt)
						content = content.replace(preg, "<img src=\"" + emojiUrl + "\" alt=\"" + alt + "\" height=\"21\" width=\"21\"/>")
					})
				}

				return content.replace(/[\r\n|\n]/g, "<br/>")
			},
			// 获取新的大小
			getNewSize (localWidth, localHeight) {
				const maxWidth = 160
				const maxHeight = 160
				const maxPreviewWidth = this.windowWidth
				const maxPreviewHeight = this.windowHeight

				let newWidth = maxWidth
				let newHeight = maxHeight
				let newPreviewWidth = maxPreviewWidth
				let newPreviewHeight = maxPreviewHeight

				if (parseInt(localHeight) > parseInt(localWidth)) {
					if (parseInt(localHeight) > maxHeight) {
						newWidth = maxHeight * localWidth / localHeight
					} else {
						newWidth = localWidth
						newHeight = localHeight
					}


					if (parseInt(localHeight) > maxPreviewHeight) {
						newPreviewWidth = maxPreviewHeight * localWidth / localHeight
					} else {
						newPreviewWidth = localWidth
						newPreviewHeight = localHeight
					}

					if (newPreviewWidth > maxPreviewWidth) {
						newPreviewWidth = maxPreviewWidth
						newPreviewHeight = maxPreviewWidth * localHeight / localWidth
					}
				} else {
					if (parseInt(localWidth) > maxWidth) {
						newHeight = maxWidth * localHeight / localWidth
					} else {
						newWidth = localWidth
						newHeight = localHeight
					}

					if (parseInt(localWidth) > newPreviewWidth) {
						newPreviewHeight = maxPreviewWidth * localHeight / localWidth
					} else {
						newPreviewWidth = localWidth
						newPreviewHeight = localHeight
					}

					if (newPreviewHeight > maxPreviewHeight) {
						newPreviewWidth = maxPreviewHeight * localWidth / localHeight
						newPreviewHeight = maxPreviewHeight
					}
				}

				return {
					newWidth        : newWidth,
					newHeight       : newHeight,
					newPreviewWidth : newPreviewWidth,
					newPreviewHeight: newPreviewHeight,
				}
			},
			// 初始化图片信息的格式
			initImgMsgContent (content, msgId) {
				let imgDom = '<span class="wrong-notice">【图片无法显示】</span>'
				if (typeof content.local_url !== 'undefined' || typeof content.local_path !== 'undefined') {
					const imgUrl = typeof content.local_url !== 'undefined' ? content.local_url : this.$store.state.commonUrl + content.local_path
					const {newWidth, newHeight, newPreviewWidth, newPreviewHeight} = this.getNewSize(content.media_width, content.media_height)

					// 图片的展示 DOM
					imgDom = '<img class="media-content" src="' + imgUrl + '" alt="' + content.file_name + '" height="' + newHeight + '" width="' + newWidth + '" data-type="img" data-key="' + msgId + '" />'

					content.preview_width = newPreviewWidth
					content.preview_height = newPreviewHeight

					this.initPreviewInfo(msgId, content, 'IMG')
				}

				return imgDom
			},
			// 初始化语音消息的格式
			initVoiceMsgContent (content, msgId) {
				let voiceDom = '<span class="wrong-notice">【音频无法加载】</span>'
				if (typeof content.local_url !== 'undefined') {
					let voiceTime = 1
					let durationCount = 0

					if (typeof content.media_duration.length === 'undefined') {
						durationCount = Object.keys(content.media_duration).length
					} else {
						durationCount = content.media_duration.length
					}

					if (durationCount > 0) {
						voiceTime = content.media_duration[2]
						if (parseInt(content.media_duration[1]) !== 0) {
							voiceTime = parseInt(content.media_duration[1]) * 60 + parseInt(content.media_duration[2])
						}
					}

					const maxWidth = 240
					const mixWidth = 75
					let newWidth = voiceTime * maxWidth / 60
					newWidth = newWidth < mixWidth ? mixWidth : newWidth

					voiceDom = '<div class="voice-box voice-btn" style="width: ' + newWidth + 'px" data-type="voice" data-key="' + msgId + '">' +
						'<div class="voice-symbol voice-btn" data-type="voice" data-key="' + msgId + '">' +
						'<span id="voiceCircleFirst' + msgId + '" class="voice-circle first voice-btn" data-type="voice" data-key="' + msgId + '"></span>' +
						'<span id="voiceCircleSecond' + msgId + '"  class="voice-circle second voice-btn" data-type="voice" data-key="' + msgId + '"></span>' +
						'<span id="voiceCircleThird' + msgId + '"  class="voice-circle third voice-btn" data-type="voice" data-key="' + msgId + '"></span>' +
						'</div>'

					voiceDom += '<span class="voice-time voice-btn" data-type="voice" data-key="' + msgId + '">' + voiceTime + '″</span>' +
						'</div>'

					voiceDom += '<audio id="voiceAudio' + msgId + '" preload src="' + content.local_url + '" style="display: none "/>'
				}

				return voiceDom
			},
			// 初始化视频消息的格式
			initVideoMsgContent (content, msgId) {
				let videoDom = '<span class="wrong-notice">【视频无法加载】</span>'
				if (typeof content.local_url !== 'undefined') {
					const {newWidth, newHeight, newPreviewWidth, newPreviewHeight} = this.getNewSize(content.media_width, content.media_height)

					videoDom = '<video class="media-content" src="' + content.local_url + '" preload width="' + newWidth + '" height="' + newHeight + '" data-type="video" data-key="' + msgId + '"></video>' +
						'<div class="media-play-btn"><span class="play-btn" data-type="video" data-key="' + msgId + '"></span></div>'

					let durationCount = 0

					if (typeof content.media_duration.length === 'undefined') {
						durationCount = Object.keys(content.media_duration).length
					} else {
						durationCount = content.media_duration.length
					}

					if (durationCount === 4) {
						videoDom += '<span class="voice-duration" data-type="video" data-key="' + msgId + '">' + content.media_duration[1] + ':' + content.media_duration[2] + '</span>'
					}

					content.preview_width = newPreviewWidth
					content.preview_height = newPreviewHeight

					this.initPreviewInfo(msgId, content, 'VIDEO')
				}

				return videoDom
			},
			// 初始化地理位置消息的格式
			initLocationMsgContent (content) {
				let locationDom = '<span class="wrong-notice">' +
					'<i aria-label="图标: environment" class="anticon anticon-environment" style="color: green vertical-align: middle ">' +
					'<svg viewBox="64 64 896 896" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">' +
					'<path d="M854.6 289.1a362.49 362.49 0 0 0-79.9-115.7 370.83 370.83 0 0 0-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 0 0 169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0 0 22.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 0 1 512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 0 1 400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path>' +
					'</svg>' +
					'</i> ' +
					'<strong style="vertical-align: middle ">位置信息：</strong>' +
					'<i style="vertical-align: middle ">' + content.label + '</i>' +
					'</span>'

				return locationDom
			},
			// 初始化链接消息的格式
			initLinkMsgContent (content) {
				let linkDom = '<a class="link-box" href="' + content.url + '" target="_blank">' +
					'<p class="link-title">' +
					'<i aria-label="图标: link" class="anticon anticon-link" style="color: #1890FF vertical-align: middle">' +
					'<svg viewBox="64 64 896 896" data-icon="link" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">' +
					'<path d="M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"></path>' +
					'</svg>' +
					'</i> ' +
					'<span style="vertical-align: middle ">' + content.title + '</span>' +
					'</p>' +
					'<p class="link-description">' + content.description + '</p>' +
					'</a>'

				return linkDom
			},
			// 初始化预览的数据
			initPreviewInfo (msgId, content, type) {
				let previewInfo = {}
				let previewLength = Object.keys(this.previewInfo).length

				switch (type) {
					case 'IMG':
						previewInfo = {
							previewType  : 'IMG',
							previewUrl   : typeof content.local_url !== 'undefined' ? content.local_url : this.$store.state.commonUrl + content.local_path,
							previewAlt   : content.file_name,
							previewWidth : content.preview_width,
							previewHeight: content.preview_height,
						}

						break
					case 'VIDEO':
						previewInfo = {
							previewType  : 'VIDEO',
							previewUrl   : content.local_url,
							previewAlt   : content.file_name,
							previewWidth : content.preview_width,
							previewHeight: content.preview_height,
						}

						break
					default:
						break
				}

				this.previewInfo['msg' + msgId] = previewInfo
			},
			initNewsMsgContent (content) {
				if (typeof content.article === 'undefined') {
					return '<span class="wrong-notice">【图文无法显示】</span>'
				} else {
					const article = content.article[0]
					const dom = '<a class="new-box" href="' + article.content_source_url + '" target="_blank">' +
						'<img class="new-cover" src="' + this.$store.state.commonUrl + article.thumb_info.local_path + '">' +
						'<div class="new-info-box">' +
						'<p class="new-title">' + article.title + '</p>' +
						'<p class="new-digest">' + article.digest + '</p>' +
						'</div>' +
						'</a>'

					return dom
				}
			},
			initMiniMsgContent (content) {

				return '<span class="wrong-notice">【' + content + '】小程序已发送</span>'
			},
			// 判断时间线是否显示
			showTimeDivider (msgId, time) {
				time = this.formatMsgTime(time)
				if (this.timeDivider.time.indexOf(time) > -1 && this.timeDivider !== msgId) {
					return false
				} else {
					if (this.timeDivider.time.indexOf(time) === -1) {
						this.timeDivider.time.push(time)
						this.timeDivider.show[time] = msgId
					}

					return true
				}
			},
			// 初始化时间线
			initTimeDivider () {
				this.timeDivider = {
					time: [],
					show: []
				}
			},
			// 格式化消息时间
			formatMsgTime (time, checkToday = false, format = 'YYYY-MM-DD HH:mm') {
				if (checkToday && this.isToday(time)) {
					return moment(time).format('HH:mm')
				}

				return moment(time).format(format)
			},
			//判断时间戳是否为今天
			isToday (signDate) {
				if (!signDate) {
					return false
				}

				const currentDate = moment().format('YYYYMMDD')
				signDate = moment.unix(signDate).format('YYYYMMDD')

				return signDate === currentDate
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
					this.previewShow = false
				} else {
					// window.event.target.style.marginLeft = 0
					// window.event.target.style.marginTop = 0
				}
			},
			closePreview () {
				this.previewShow = false
			},
			websocketOnMessage (data) {
				let need = false
				switch (this.chatType) {
					case 0:
						need = typeof data.type != 'undefined' && data.type == 'chat' && (!data.hasOwnProperty('msg_type') || data.msg_type == 'wx') && data.from == this.userId

						break
					case 1:
						need = typeof data.type != 'undefined' && data.type == 'chat' && (!data.hasOwnProperty('msg_type') || data.msg_type == 'mini') && data.from == this.userId

						break
				}
				if (need) {
					let scrollToView = this.scrollToView
					const msgBoxScrollTop = this.$refs.msgContent.$el.firstChild.firstChild.scrollTop
					const msgBoxHeight = this.$refs.msgContent.$el.firstChild.firstChild.clientHeight
					const msgBoxScrollHeight = this.$refs.msgContent.$el.firstChild.firstChild.scrollHeight

					if (msgBoxScrollTop + msgBoxHeight == msgBoxScrollHeight) {
						scrollToView = 'msg' + data.msg_list.id
					} else {
						this.newMsg = true
						if (this.unReadNum == 0) {
							this.unReadMsgId = data.msg_list.id
						}
						this.unReadNum++
					}

					this.msgContent = this.msgContent.concat(data.msg_list)

					this.initTimeDivider(data.wx_id, data.from)

					this.$nextTick(() => {
						this.scrollToView = scrollToView
					})
				}
			},
			// 消息回复成功回调
			replySuccess (msgId, replyData) {
				Toast.clear()
				let content
				switch (replyData.msg_type) {
					case 1:
						content = replyData.msg_content.text

						break
					case 2:
						const imgList = this.valueInput.item
						content = {
							local_path  : imgList.local_path,
							media_width : imgList.file_width,
							media_height: imgList.file_height,
						}

						break
					case 3:
						if (this.chatType == 0) {
							const local_url = this.valueInput.local_url
							const media_duration = this.valueInput.media_duration
							content = {
								local_url     : local_url,
								media_duration: media_duration,
							}
						} else {
							content = this.valueInput.item.file_name
						}

						break
					case 4:
						const video_local_url = this.valueInput.local_url
						const video_media_duration = this.valueInput.media_duration
						content = {
							local_url     : video_local_url,
							media_duration: video_media_duration,
							media_width   : this.valueInput.item.file_width,
							media_height  : this.valueInput.item.file_height,
						}

						break
					case 5:
						const artList = this.valueInput.item.artList[0]
						content = {
							article: [
								{
									thumb_info        : {
										local_path: artList.local_path
									},
									title             : artList.title,
									digest            : artList.digest,
									content_source_url: artList.content_source_url,
								}
							]
						}
						break
					case 10:
						content = this.valueInput.item.title

						break
					default:
						break
				}

				this.msgType = 1
				this.valueInput = {
					input         : '',
					reply         : '',
					item          : '',
					local_url     : '',
					media_duration: '',
				}

				let msgData = {
					id         : msgId,
					from       : this.msgContent[0].from.type == 2 ? this.msgContent[0].from : this.msgContent[0].to,
					to         : this.msgContent[0].to == 1 ? this.msgContent[0].to : this.msgContent[0].from,
					content    : content,
					type       : replyData.msg_type,
					create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
				}
				this.msgContent.push(msgData)

				this.initTimeDivider(this.activeKey, this.fansId)

				this.$nextTick(() => {
					this.scrollToView = 'msg' + msgId//跳转上次的第一行信息位置
				})
			},
			inputFocus () {
				if (this.showMoreLayer) {
					this.hideDrawer()
				}
			},
			//更多功能(点击+弹出)
			showMore () {
				if (!this.showMoreLayer) {
					this.showMoreLayer = true
					this.openDrawer()
				} else {
					this.hideDrawer()
				}
			},
			// 打开抽屉
			openDrawer () {
				this.actionBoxClass = 'showLayer'
			},
			// 隐藏抽屉
			hideDrawer () {
				this.actionBoxClass = ''
				setTimeout(() => {
					this.showMoreLayer = false
				}, 150)
			},
			// 选择图片发送
			chooseImage () {
				this.getImage('album')
			},
			//拍照发送
			camera () {
				this.getImage('camera')
			},
			// 打开内容引擎
			filingCabinetOpen () {
				this.showFilingCabinet = true
				this.hideDrawer()
			},
			filingCabinetClose () {
				this.showFilingCabinet = false
			},
			getImage (type) {
				this.hideDrawer()
				uni.chooseImage({
					sourceType: [type],
					sizeType  : ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success   : (res) => {
						this.unUploadImg = res.tempFiles[0]
						uni.getImageInfo({
							src    : res.tempFilePaths[0],
							success: (image) => {
								this.dialogImg = image.path
								this.comeFrom = 1
								this.showDialog = true
							}
						})
					}
				})
			},
			confirmDialog () {
				if (this.comeFrom == 1) {
					this.uploadMaterial()
				} else {
					switch (this.msgType) {
						case 2:
							this.valueInput.reply = this.mediaItem.id
							this.valueInput.item = this.mediaItem
							this.uploadMedia({
								wx_id        : this.fromId,
								attachment_id: this.mediaItem.id
							}, this.mediaItem.id)

							break
						case 5:
							this.valueInput.item = this.mediaItem
							this.uploadMedia({
								wx_id        : this.fromId,
								attachment_id: this.mediaItem.id
							}, this.mediaItem.id)

							break
					}
				}
			},
			cancelDialog (e) {
				this.dialogImg = ''
			},
			//消息回复之内容引擎
			replyMsg (type, content, item) {
				if (content == '' && type == 1) {
					Toast.fail("回复内容不可为空！")
				}

				this.showFilingCabinet = false
				Toast.loading({
					forbidClick: true,
					message    : '发送中...',
					duration   : 0
				});

				switch (type) {
					case 1:
						this.msgType = 1
						this.valueInput.input = content
						this.reply()

						break
					case 2:
						Toast.clear()
						this.msgType = 2
						this.comeFrom = 2
						this.mediaItem = item
						this.dialogImg = this.$store.state.commonUrl + content
						this.showDialog = true

						break
					case 3:
						Toast.clear()
						this.msgType = 5
						this.comeFrom = 2
						this.mediaItem = item
						this.dialogImg = this.$store.state.commonUrl + content
						this.showDialog = true

						break
					case 4:
						this.msgType = 3
						this.mediaItem = item

						this.uploadMedia({
							wx_id        : this.fromId,
							attachment_id: this.mediaItem.id
						}, this.mediaItem.id)

						break
					case 5:
						this.msgType = 4
						this.mediaItem = item

						this.uploadMedia({
							wx_id        : this.fromId,
							attachment_id: this.mediaItem.id
						}, this.mediaItem.id)

						break
					case 6:
						if (item.attach_id == null) {
							Toast.fail("当前小程序不合法，请重新选择")
							return false
						}

						this.msgType = this.chatType == 0 ? 10 : 3
						this.mediaItem = item

						this.uploadMedia({
							wx_id        : this.fromId,
							attachment_id: this.mediaItem.attach_id
						}, this.mediaItem.attach_id, this.mediaItem.appId, this.mediaItem.appPath, this.mediaItem.file_name)

						break
				}
			},
			async getData (lastId = 0, msgSize = 15) {
				let res = {
					error    : -1,
					error_msg: '网络请求失败，请稍后重试'
				}
				switch (this.chatType) {
					case 0:
						res = await this.getFansData(lastId, msgSize)
						break
					case 1:
						res = await this.getMiniData(lastId, msgSize)

						break
				}

				if (res.error != 0) {
					Toast.fail(res.error_msg)
				} else {
					if (res.data.msg_list.length > 0) {
						let _this = this
						res.data.msg_list.map((msg) => {
							_this.msgContent.unshift(msg)
						})
						this.loadMoreStatus = 'more'
					} else {
						this.loadMoreStatus = 'noMore'
					}

					if (lastId == 0 && this.msgContent.length > 0) {
						lastId = this.msgContent[this.msgContent.length - 1].id
						this.initTimeDivider()
					}

					this.msgRead()

					this.previewInfo = {}

					//这段代码很重要，不然每次加载历史数据都会跳到顶部
					this.$nextTick(() => {
						this.scrollToView = 'msg' + lastId//跳转上次的第一行信息位置
						this.$nextTick(() => {
							this.scrollAnimation = true//恢复滚动动画
						})
					})
					this.isHistoryLoading = false
				}
			},
			async getFansData (lastId = 0, msgSize = 15) {
				const {data: res} = await this.axios.post("fans-msg/get-msg-list", {
					wx_id   : this.fromId,
					fans_id : this.userId,
					last_id : lastId,
					msg_size: msgSize
				})

				return res
			},
			async getMiniData (lastId = 0, msgSize = 15) {
				const {data: res} = await this.axios.post("mini-msg/get-msg-list", {
					wx_id   : this.fromId,
					mini_id : this.userId,
					last_id : lastId,
					msg_size: msgSize
				})

				return res
			},
			async msgRead () {
				switch (this.chatType) {
					case 0:
						const {data: fansRes} = await this.axios.post('fans-msg/msg-read', {
							fans_id: this.userId,
							wx_id:localStorage.getItem('wxNum')
						})
						if (fansRes.error == 0 && fansRes.data.status) {
							this.unReadNum = 0
							this.unReadMsgId = 0
							this.newMsg = false
						}

						break
					case 1:
						const {data: miniRes} = await this.axios.post('mini-msg/msg-read', {
							mini_id: this.userId,
							wx_id:localStorage.getItem('wxNum')
						})
						if (miniRes.error == 0 && miniRes.data.status) {
							this.unReadNum = 0
							this.unReadMsgId = 0
							this.newMsg = false
						}

						break
				}
			},
			async reply () {
				Toast.clear()
				Toast.loading({
					forbidClick: true,
					message    : '发送中...',
					duration   : 0
				});
				let textValue = ''

				if (typeof this.valueInput.reply === 'number') {
					textValue = this.valueInput.reply
				} else {
					textValue = this.valueInput.input.replace(/(^\s*)|(\s*$)/g, "")
				}

				if (textValue.length == 0 || !/[^\n]/g.test(textValue)) {
					Toast.clear()
					Toast.fail("回复内容不可为空！")
				} else {
					let replyData = {
						wx_id      : this.fromId,
						from       : 2,
						msg_content: {},
						msg_type   : this.msgType,
					}
					let replyUrl = 'fans-msg/send'
					switch (this.chatType) {
						case 0:
							replyData.fans_id = this.userId

							break
						case 1:
							replyData.mini_id = this.userId
							replyUrl = 'mini-msg/send'

							break
					}
					switch (this.msgType) {
						case 1:
							replyData.msg_content = {
								text: this.valueInput.input
							}
							break
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
							replyData.msg_content = {
								media_id: this.valueInput.reply
							}

							break
						case 10:
							replyData.msg_content = {
								media_id: this.valueInput.reply,
								appid   : this.valueInput.item.appid,
								pagepath: this.valueInput.item.pagepath,
								title   : this.valueInput.item.title
							}
							break
					}

					if (this.chatType == 1 && this.msgType == 3) {
						replyData.msg_content = {
							media_id: this.valueInput.reply,
							appid   : this.valueInput.item.appid,
							pagepath: this.valueInput.item.pagepath,
							title   : this.valueInput.item.title
						}
					}

					const {data: res} = await this.axios.post(replyUrl, replyData)
					if (res.error == 0 && res.data.status) {
						this.replySuccess(res.data.status, replyData)
					} else {
						this.msgType = 1

						Toast.clear()
						Toast.fail(res.data.error_info.errmsg)
					}
				}
			},
			async uploadMedia (uploadData, id, appid = 0, pagepath = '', title = '') {
				Toast.clear()
				Toast.loading({
					forbidClick: true,
					message    : '校验中...',
					duration   : 0
				});
				const {data: result} = await this.axios.post('material/upload-media', uploadData)
				if (result.error == 0) {
					if (this.msgType == 2) {
						this.valueInput.reply = result.data[id].id
						this.valueInput.item = this.mediaItem
					} else {
						if (this.chatType == 0) {
							if (this.msgType == 3 || this.msgType == 4) {
								this.valueInput.item = this.mediaItem
								this.valueInput.local_url = result.data[id].local_url
								this.valueInput.media_duration = result.data[id].media_duration
							}
							if (this.msgType == 10) {
								this.valueInput.reply = result.data[id].id
								this.valueInput.item = {
									appid   : appid,
									pagepath: pagepath,
									title   : title
								}
							} else {
								this.valueInput.reply = result.data[id].id
							}
						} else {
							if (this.msgType == 3) {
								this.valueInput.reply = result.data[id].id
								this.valueInput.item = {
									appid   : appid,
									pagepath: pagepath,
									title   : title
								}
							} else {
								this.valueInput.reply = result.data[id].id
							}
						}
					}
					this.reply()
				} else {
					Toast.clear()
					Toast.fail(res.error_msg)
				}
			},
			async uploadMaterial () {
				Toast.clear()
				Toast.loading({
					forbidClick: true,
					message    : '上传中...',
					duration   : 0
				});
				let params = new FormData()
				params.append("wx_id", this.fromId)
				params.append("uid", localStorage.getItem('uid'))
				params.append("isMasterAccount", localStorage.getItem('user_type'))
				params.append("sub_id", localStorage.getItem('sub_id'))
				params.append("file_type", 1)
				params.append("fileInfo", this.unUploadImg)
				params.append("is_sync", 0)
				params.append("comefrom", 4)
				const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
				if (res.error == 0) {
					this.unUploadImg = ''
					this.msgType = 2
					this.mediaItem = res.data.info

					this.uploadMedia({
						wx_id        : this.fromId,
						attachment_id: res.data.attachment_id
					}, res.data.attachment_id)
				} else {
					Toast.clear()
					Toast.fail(res.error_msg)
				}
			},
		},
	}
</script>

<style scoped>
	@import "~@/static/css/uni.css"
</style>
<style lang="less" scoped>
	/deep/ .uni-navbar__header-btns-left {
		width: 60px;
	}

	.notice-box {
		width: 100%;

		.notice-bar {
			margin-top: 2px;
			margin-bottom: 0;
		}
	}

	.box {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;

		.preview-box {
			top: 44px;
			right: 0;
			bottom: 0;
			left: 0;
			position: absolute;
			z-index: 9999;
			background-color: #000000;

			.swiper-box {
				height: 100%;

				.swiper-item {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;

					.img-info {
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 25% 0;
					}

					.video-info {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.body-content {
			&.showLayer {
				transform: translate3d(0, -158px, 0);
			}

			background: #EBEBEB;
			position: fixed;
			top: 44px;
			bottom: 53px;
			left: 0;
			right: 0;
			font-size: 0.853rem /* 16/18.75 */;

			.chat-content-list {
				width: 100%;
				padding: 0.267rem /* 5/18.75 */ 0.533rem /* 10/18.75 */;
				display: inline-block;
				box-sizing: border-box;


				.time-divider {
					font-size: 0.64rem /* 12/18.75 */;
					color: grey;
					margin: 0.853rem /* 16/18.75 */ 0;
					white-space: nowrap;
					text-align: center;
					background: transparent;
				}

				.content {
					width: 100%;
					height: 2.133rem /* 40/18.75 */;
					display: block;

					.avatar-box {
						width: 2.133rem /* 40/18.75 */;
						height: 2.133rem /* 40/18.75 */;
						display: block;

						.user-avatar {
							width: 2.133rem /* 40/18.75 */;
							height: 2.133rem /* 40/18.75 */;
							border-radius: 0.267rem /* 5/18.75 */;
						}
					}

					.msg-content {
						text-align: left;
						max-width: 60%;
						min-height: 0.853rem /* 16/18.75 */;
						margin: 0 0.533rem /* 10/18.75 */;
						color: #000000;
						background-color: white;
						border: 0.053rem /* 1/18.75 */ solid #E5E5E5;
						border-radius: 0.267rem /* 5/18.75 */;
						vertical-align: top;
						position: relative;

						&-1 {
							padding: 0.427rem /* 8/18.75 */ 0.587rem /* 11/18.75 */;
							word-break: normal;
							word-wrap: break-word;
							overflow-wrap: break-word;

							/deep/ img {
								vertical-align: middle;
							}

							&:before {
								position: absolute;
								left: -0.64rem /* -12/18.75 */;
								top: 0.48rem /* 9/18.75 */;
								width: 0;
								height: 0;
								content: '';
								border-color: transparent #E9E9E9 transparent transparent;
								border-style: solid;
								border-width: 0.32rem /* 6/18.75 */;
							}

							&:after {
								position: absolute;
								left: -0.48rem /* -9/18.75 */;
								top: 0.533rem /* 10/18.75 */;
								width: 0;
								height: 0;
								content: '';
								border-color: transparent #FFF transparent transparent;
								border-style: solid;
								border-width: 0.267rem /* 5/18.75 */;
							}
						}

						/deep/ .wrong-notice {
							padding: 0.427rem /* 8/18.75 */ 0.587rem /* 11/18.75 */;
							word-break: normal;
							word-wrap: break-word;
							overflow-wrap: break-word;
							display: inline-block;
						}

						/deep/ .voice-box {
							padding: 0.427rem /* 8/18.75 */ 0.587rem /* 11/18.75 */;
							height: 1.067rem /* 20/18.75 */;
							cursor: pointer;

							.voice-symbol {
								width: 0.533rem /* 10/18.75 */;
								height: 0.533rem /* 10/18.75 */;
								box-sizing: border-box;
								transform: rotate(135deg);
								overflow: hidden;
								position: relative;
								margin-top: 0.267rem /* 5/18.75 */;
								margin-left: 0.267rem /* 5/18.75 */;

								.voice-circle {
									border: 0.107rem /* 2/18.75 */ solid #2390FF;
									border-radius: 50%;
									position: absolute;

									&.first {
										width: 1.067rem /* 20/18.75 */;
										height: 1.067rem /* 20/18.75 */;
										top: 0;
										left: 0;
									}

									&.second {
										width: 0.64rem /* 12/18.75 */;
										height: 0.64rem /* 12/18.75 */;
										top: 0.213rem /* 4/18.75 */;
										left: 0.213rem /* 4/18.75 */;
									}

									&.third {
										border: none;
										width: 0.213rem /* 4/18.75 */;
										height: 0.213rem /* 4/18.75 */;
										background: #2390FF;
										top: 0.427rem /* 8/18.75 */;
										left: 0.427rem /* 8/18.75 */;

									}
								}
							}

							.voice-time {
								top: 0.32rem /* 6/18.75 */;
								right: 0.8rem /* 15/18.75 */;
								bottom: 0.32rem /* 6/18.75 */;
								position: absolute;
								display: inline-block;
							}
						}

						/deep/ .media-content {
							border-radius: 0.267rem /* 5/18.75 */;
							display: block;
						}

						/deep/ img,
						/deep/ video {
							&.media-content {
								cursor: pointer;
							}
						}

						/deep/ .media-play-btn {
							width: 2.133rem /* 40/18.75 */;
							height: 2.133rem /* 40/18.75 */;
							top: 50%;
							left: 50%;
							background: rgba(128, 128, 128, 0.5);
							border: 0.107rem /* 2/18.75 */ solid white;
							border-radius: 1.067rem /* 20/18.75 */;
							margin-top: -1.067rem /* -20/18.75 */;
							margin-left: -1.067rem /* -20/18.75 */;
							display: block;
							position: absolute;
							cursor: pointer;

							.play-btn {
								width: 0;
								height: 0;
								margin-top: 0.533rem /* 10/18.75 */;
								margin-left: 0.72rem /* 13.5/18.75 */;
								border-top: 0.533rem /* 10/18.75 */ solid transparent;
								border-right: 0.924rem /* 17.32/18.75 */ solid transparent;
								border-bottom: 0.533rem /* 10/18.75 */ solid transparent;
								border-left: 0.924rem /* 17.32/18.75 */ solid white;
								display: block;
							}
						}

						/deep/ .voice-duration {
							right: 0.267rem /* 5/18.75 */;
							bottom: 0.267rem /* 5/18.75 */;
							color: white;
							font-size: 0.64rem /* 12/18.75 */;
							line-height: 0.64rem /* 12/18.75 */;
							display: inline-block;
							position: absolute;
							cursor: pointer;
						}

						/deep/ .link-box {
							text-decoration: none;

							.link-title {
								font-size: 0.96rem /* 18/18.75 */;
								line-height: 1.44rem /* 27/18.75 */;
								padding: 0.8rem /* 15/18.75 */ 0.8rem /* 15/18.75 */ 0 0.8rem /* 15/18.75 */;
								color: black;
								margin: 0;
							}

							.link-description {
								font-size: 0.747rem /* 14/18.75 */;
								line-height: 1.12rem /* 21/18.75 */;
								padding: 0.8rem /* 15/18.75 */;
								color: #BFBFBF;
								margin: 0;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}

						/deep/ .new-box {
							width: 10.667rem /* 200/18.75 */;
							border-radius: 0.267rem /* 5/18.75 */;
							overflow: hidden;
							display: block;
							background: white;

							.new-cover {
								width: 10.667rem /* 200/18.75 */;
								height: 5.333rem /* 100/18.75 */;
							}

							.new-info-box {
								.new-title {
									font-size: 0.96rem /* 18/18.75 */;
									line-height: 1.44rem /* 27/18.75 */;
									padding: 0;
									color: black;
									margin: 0.533rem /* 10/18.75 */ 0.8rem /* 15/18.75 */;
									word-break: break-all;
									white-space: normal;
									letter-spacing: 0.107rem /* 2/18.75 */;
									text-overflow: -o-ellipsis-lastline;
									overflow: hidden;
									text-overflow: ellipsis;
									-webkit-line-clamp: 2;
									-webkit-box-orient: vertical;
									display: -webkit-box;
								}

								.new-digest {
									font-size: 0.747rem /* 14/18.75 */;
									line-height: 1.12rem /* 21/18.75 */;
									padding: 0;
									color: #BFBFBF;
									margin: 0 0.8rem /* 15/18.75 */ 0.533rem /* 10/18.75 */;
									word-break: break-all;
									white-space: normal;
									letter-spacing: 0.107rem /* 2/18.75 */;
									text-overflow: -o-ellipsis-lastline;
									overflow: hidden;
									text-overflow: ellipsis;
									-webkit-line-clamp: 3;
									-webkit-box-orient: vertical;
									display: -webkit-box;
								}
							}
						}
					}

					.float-right {
						&.msg-content {
							background-color: #CDE6FB;
							border-color: #C6D5E1;

							&.msg-content-1 {
								&:before {
									left: initial;
									right: -0.64rem /* -12/18.75 */;
									border-color: transparent transparent transparent #C6D5E1;
								}

								&:after {
									right: -0.48rem /* -9/18.75 */;
									left: initial;
									border-color: transparent transparent transparent #CDE6FB;
								}
							}

						}
					}
				}
			}
		}

		.new-msg-box {
			position: fixed;
			bottom: 3.467rem /* 65/18.75 */;
			right: 0.533rem /* 10/18.75 */;
			background: #FEFEFE;
			padding: 0.053rem /* 1/18.75 */ 0.8rem /* 15/18.75 */;
			border: 0.053rem /* 1/18.75 */ solid #E3E3E3;
			border-radius: 0.267rem /* 5/18.75 */;
			color: #54A9EB;
		}

		.action-box {
			&.showLayer {
				transform: translate3d(0, -158px, 0);
			}

			background: #F5F5F5;
			position: fixed;
			height: 37px;
			padding: 8px;
			bottom: 0;
			left: 0;
			right: 0;
			font-size: 0.853rem;

			.action-input {
				float: left;
				text-align: left;
				border-radius: 5px;
				width: calc(100% - 77px);
				overflow: hidden;
				.uni-input {
					height: 25px;
					padding: 7px 12px;
					line-height: 25px;
					font-size: 14px;
				}
			}

			.action-btn-box {
				float: right;
				width: 65px;
				height: 100%;

				.action-btn-list {
					width: 29px;
					height: 29px;
					float: left;
					margin-right: 7px;

					&:last-child {
						margin-right: 0;
					}

					.action-btn {
						color: #CECECE;
						font-size: 29px !important;
						line-height: 37px;
						display: block;
					}
				}

				.send-box {
					height: 100%;

					.send-btn {
						font-size: 15px;
						line-height: 37px;
					}
				}
			}

			.more-layer {
				right: 0;
				bottom: -158px;
				left: 0;
				height: 158px;
				background: #EBEBEB;
				position: absolute;

				.more-list {
					width: 100%;
					height: 100%;
					display: flex;
					flex-wrap: wrap;

					.more-box {
						&:first-child {
							margin-left: 10px;
						}

						width: 68px;
						height: 68px;
						border-radius: 10px;
						background-color: #FFF;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 10px 5px 5px 5px;

						.more-icon {
							font-size: 35px;
						}
					}
				}
			}
		}
	}

	.float-left {
		float: left;
	}

	.float-right {
		float: right;
	}

	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAn8AAsAAAAAE1wAAAmvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCFDAqWYJI9ATYCJANACyIABCAFhFUHgV8bThBRlFFWNdkXBXbDsSFQq221McNWrxUbYqGhiTju98MTeXqNh/9fo90388cEMe0bwSOJRIjavZIgESqnE5J5JqQVDZH/XdNfoHSAjqKqRsA+Tf/Ruya33E/bkdHsJtycY2XWAGbM5oenzf173A3lHrEilsmMbu74Y5VmYtxpgza9DMxkWL0gfjGbGRE54AL2f2ut3h2u8Q7RaZRCjDPLIv8cfAUR30MtEUWbSReVJkk0RB4lWWkNg7WVA1sBKmIUdr0uzibQOmxA4vrWwQXkJUweKHPfdwXkA+FSik2o1aVizyTegEKdvWINwGv59bEGY9GeTJFjW95pswIrzz3LYi//0O4JEaDrY3DZjxwXgUR8V3IfIeXARaloVRXT3mK/tsi3LubcJfese8l96Xbd1l1ve2z7eJp5lv3zB7URSdJNYd3Dfm7UUxxkGu0sLFcbVEa5pP3D6/QmokQw3OGzfJp/2kBkLJYQDYuziJbFJUSweIkoWXQRNYuEGFi0BLzFOhAjS4+InKUPRGI5I2a+kg7VSWUGoXoos2BNmGIWexwFroD8IUD6C1A9lYp8F3ClwsFgcgPdNpN08v1czkEOJ4aeieaC3QyVfb9PX2kbn9/0CwTeNAm79H1Kc2x3i9C7LcEZtMSLfE6T4aM+YWOm06dZ5cm9I+xoYw+rqGlScKKlHytu9h6Dw0E5nXK7nbTZknT1jFldR9cuzNMz9Srf7FydqpYW5mRr6Dq1OC9HqzYzoiw1cjohV2tX1Ji1K9bSdVkEbaxS1xQwpmpVpUFheyyzPyGdbXKHexkByib+vtgeK1X75xKqWl+grUNIbRZDXT31tBMiPZAyF0KmniCQhSgACkh5+gIxtvTS/si+VjbAuY6SMdCzbqInzwkjk5ENzMCkNv+ghQQ0qSSAUGmAMQoBozoAIrUe6qpzM+tma1T1jDgvVzdBWcIcLT170njGQU3cCpnUTSdkHH3ltwPHpKotTIP6HH12Lvd4czCWgbJYhY1U5ddlTCICSs1is0in8tXExk7VVRuMQhIQGgOtFcolPmMkIqDVduTGEOn1jI4gFERmSUsv3rGmoKUEQLITLUyzqpFukq8T6U+omVQsT8XHxsnipPEyBAlKNmkNMlMJgOT5Tpsoo2RGP3lOTQyk5GRBgJKw2WQsarWzSa1aLF/+UBk2PkA3wEkBM/RwOLJ0ORWiVCR3YYAAFyIlAdaNqEnmh0sTqOsAq97R85Jt+HGHrNKWgDHmxOPxumKmRGzudayPtogu9D2Zx688C3D6XJSgpgF6MJbomdtyOYBgcXOGSgMAPXqy+F11pMYHlFLCkkKM0S1T+U5SN0Ynh39SxcxmTPNHrTFIuieyxYgZXSDUAPpLLT2ZciVvihOh05k+JIAjoL7HtNsVFc5Rl+1hgAAIlNqGX3GEK0llMm0nZUdmhQzymg3Q9j6yO4FQsmqtQbXmZ+z+sOynUrt3nmbeXu3MYW9f8y38128LpWAVeyLMz4cTORbEDPYKHU19Oyx0OF12GIhfEx+/RRIm2RzPeIPE2yYRM7HBWBx+GvANWXAlMYcmWriz1/Tt2bk+jq7CdOzMu5zsn3zZXwg2Gu14YCBuh3NggN0DI8BbJpCXZb2I4xh+kdAmbU0IA6HYquya81nqYSk87Xgi35ur4HnxZWEvnoLrzbOEjHmJiY2JjV6I8c4ynSEsJTKcHxuWYPRFFleV2Sbi0Dsk4XmDSToXTMnUnW/PW9J9W4UCgP+h0rTi9tiJd6qQgk2lPI/KKeybAPx+c7vZHdimbruzyCP9iZvd0VuBuIniuXirHQ8oG2IThFIUI8QOhjfNMg86GH4Bv4ixLlr4BDi2wDDwXTYYTgfnBJur1nAw2yGngw96JhQo+48cMWVE8kWwcA55ZuzwkSP/mpp9D6wFm2e1Bc8cPVraL2Ng7y6KfSNHqQfTYByYMmbT73WNmwZs6m8sBR54XCndTHwvu6v+8N+Jze9/jeGd8bpoHePtMv0/9U6e78bTtf+aly55P40cNtJ3PH3U6xQ9DkRNos+Chp2TpNwX4lZOwkTa4nOLPxpMLc8Sm0srSwD6Y1KW7ftPZ68x3DWS8d4cJbAKE6QJEfRrhAafMLV0RoCRLhKdBaJzNtzPD7dxLIgZ7Al4006exyHEYXMewjqApFokPRIu9FvLiPf96uWlpuZmRZKiH1i0OCNj1ar7zSDqYiRbCQsMrKUXZswxBkQEbCmv2RJgKK82+UcGbpk+0woVSxekQrYCzp4Hk30E3oHhAh+4fLcOPCfzOVu3cvKkHAWzNAVyjAyOQsrJix47n0OZpbTUDKdJp8CZs+BkAKfMnDkF+kJmmrcN4OSZs8CRuwZ+N76gampCxtj83XWO5X1GYc7hIypq+N32eTe6Wr/GfXW5GukBLnvJ1gEPhlmsuUHzg3Osp/vJCZ4flGsFf27fjV18spjdTfQUuVANcgldRA3hKhSUutCGgGhDaMo0tXMHwiUq3gG5entO2xmnECa3H53AjRpKFFYIK7qrHjMJ75sEC91BPlGc0TlZY9qlsdcuZaXy0D3hfz4cmLd2WzbK3Xhhdw7c2VLCxtxsFCMEo8bArEww9ruOrc5joK9g1xp85MghQ4wyuPV71+/tMVxAMmzA1lSt+WmbjFkwL/lV6az7APzZ5qvVmmy7b1bJGrTDhmRfMBYbWMZmNOu3bJdPlLL/5WOR2XZCTJpmU4mx8lv9Fg76T8NagO4vUacJ+n/Sr0b/LYb8+1z5QCb935a0m6WWYXzwh4DO2Sa9g2jEnJ6tYwTU5jp7N2RmaHkn/gjEb/fXpmpXbkpAGaAv7pnKAfdc6bg4GZx1L3QuQ8lVC3BvXbC8f2eHQEqkBuc9aO6h9849M3oPucrgAyQY/HEv7PYJJQy23Ft3/R+xczqmsHWDgrDCyzfcl1o5ehKxnUOr5Bm6NhTGR4u1rtDEvlZ8dGgklLeNCk3ZbeKaO0bkcMfoKt+6ng/DUPPI6AAlDXlE0dzwsKPadkjqKjDXGEgg4b2CK7vx65M0xSlPmNsOA58/g1xWSDDKeq/KV5AR89+zc6OGjKSKtxUqR4NtF47VuMZemcTBDQxGqzqqrXIMCnm2xkXq1QJIIkO8EpmROcOkIyevYmhUqurWBmgCe4U5WJFHiiLKqKKOJtrooo8hxphihl6g5bGv3MAXkfBvPaFbVq6ga4Uq+wWdEfo6NVTmr1oVkYoye2NvfCWLmYQx0sjozFSxszhZ4Ctjb7QtavLQDNa0L5HRZQYJYxrNLbJR4QhZvOV46Fm/lqB428nsrJSx/OwbEgYA') format('woff2');
	}

	.more-icon {
		font-family: "HMfont-home" !important;
		font-size: 28px;
		font-style: normal;
		color: #333;

		&.biaoqing:before {
			content: "\e797";
		}

		&.jianpan:before {
			content: "\e7b2";
		}

		&.yuyin:before {
			content: "\e805";
		}

		&.tupian:before {
			content: "\e639";
		}

		&.chehui:before {
			content: "\e904";
		}

		&.luyin:before {
			content: "\e905";
		}

		&.luyin2:before {
			content: "\e677";
		}

		&.other-voice:before {
			content: "\e667";
		}

		&.my-voice:before {
			content: "\e906";
		}

		&.hongbao:before {
			content: "\e626";
		}

		&.tupian2:before {
			content: "\e674";
		}

		&.paizhao:before {
			content: "\e63e";
		}

		&.add:before {
			content: "\e655";
		}

		&.close:before {
			content: "\e607";
		}

		&.to:before {
			content: "\e675";
		}
	}
</style>