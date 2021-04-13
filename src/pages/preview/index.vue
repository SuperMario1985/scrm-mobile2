<template>
	<div class="preview" ref="preview">
		<h3>{{title}}</h3>
		<p style="color: #E2E2E2;margin-top: 10px">
			<span style="margin-right: 20px">{{author}}</span><span>今天</span>
		</p>
		<p class="sketch-text" style="word-break: break-word;max-width: 100%;" v-html="text"></p>
		<div v-if="historyUrl" @click="goBack()"
		     style="box-shadow: 0px 0px 13px #8CC4FC;position: fixed; bottom: 50px; right: 50px; width: 50px;line-height: 50px;text-align: center; height: 50px; border-radius: 25px;background-color: #1989FA; color: #FFF;cursor: pointer">
			返回
		</div>
		<div @click="closePreview" class="shape"
		     style="position: fixed;top: 0; left: 0; z-index: 10000; background-color: rgba(0, 0, 0, 0.85); width: 100%; height: 100%;"
		     v-if="picPreviewVisible">
		</div>
		<img v-if="picPreviewVisible" @click="closePreview"
		     style="position: fixed;top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 20000"
		     :src="imgUrl"/>
		<Footer v-if="is_show_copyright == 1"></Footer>
	</div>
</template>

<script>
	import {Toast} from 'vant';
	import Footer from "../../components/footer/footer.vue";

	export default {
		name   : "preview",
		data () {
			return {
				picPreviewVisible: false,
				imgUrl           : '',
				historyUrl       : '',
				num              : '',
				attach_id        : '',
				article_id       : '',
				title            : '',
				author           : '',
				text             : '',
				is_playFinish    : 0,
				statisticId      : 0,
				chat_id          : '',
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		inject : ['initPage', 'getParameter','getCopyright'],
		components  : {Footer},
		methods: {
			async getContent () {
				let params = {
					num       : parseInt(this.num),
					article_id: this.article_id,
					attach_id : this.attach_id,
					chat_id   : this.chat_id,
					attach_code : this.$route.query.attach_code || ''
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

				const {data: res} = await this.axios.post("image-text/image-text-preview-info", params);
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					localStorage.setItem('uid',res.data.uid)
					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						this.getCopyright(this.refresh)
					}

					this.title = res.data.title
					this.author = res.data.author
					this.text = res.data.image_text
					this.statisticId = res.data.statistic_id
					if (this.getParameter("agent_id") !== null) {
						setInterval(() => {
							this.leave()
						}, 300)
					}

					uni.setNavigationBarTitle({
						title: this.title
					});
					this.showPage()
				}
			},
			//重新渲染頁面
			refresh(){
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			closePreview () {
				this.picPreviewVisible = false
				this.imgUrl = ""
			},
			showPage () {
				let that = this
				document.getElementsByClassName('sketch-text')[0].addEventListener('click', function (e) {
					if (e.target.nodeName == 'IMG') {
						that.imgUrl = e.target.src
						that.picPreviewVisible = true
					}
				})
				// debugger
				// for (let i = 0; i < imgs.length; i++) {
				// 	imgs[i].addEventListener('click', function (e) {
				// 		debugger
				// 		that.picPreviewVisible = true
				// 	})
				// }
				let preg = new RegExp('<qqmusic([^>]*)albumurl="([^"]*)"([^>]*)audiourl="([^"]*)"([^>]*)music_name="([^"]*)"([^>]*)singer="([^"]*)"([^>]*)play_length="([^"]*)"([^>]*)></qqmusic>', 'g');
				this.text = this.text.replace(preg, "<qqmusic$1albumurl=\"$2\"$3audiourl=\"$4\"$5music_name=\"$6\"$7singer=\"$8\"$9play_length=\"$10\"$11></qqmusic>" +
					"<div class='qqmusic' >" +
					"<audio class='audio'>" +
					"<source " +
					"src='$4' " +
					"type='audio/mpeg' />" +
					"</audio>" +
					"<div class='qqmusic-title' style=''>" +
					"<span class='name music-title'>$6</span>" +
					"<span class='singer music-title'>$8</span>" +
					"</div>" +
					"<div style='float: right;height: 64px;'>" +
					"<img style='width:64px; height: 64px;' class='logo' src='$2'/>" +
					"<span class='play' style='display: block;'></span>" +
					"<span class='pause' style='display: none'></span>" +
					"</div>" +
					"</div>")
				this.$nextTick(() => {
					let that = this
					let qqmusic = document.getElementsByClassName('qqmusic')
					if (qqmusic) {
						for (let i = 0; i < qqmusic.length; i++) {
							document.getElementsByClassName('play')[i].addEventListener('click', function () {
								for (let j = 0; j < qqmusic.length; j++) {
									document.getElementsByClassName('audio')[j].pause()
									document.getElementsByClassName('pause')[j].style.display = 'none'
									document.getElementsByClassName('play')[j].style.display = 'block'
								}
								window.clearInterval(that.is_playFinish);
								document.getElementsByClassName('audio')[i].play()
								document.getElementsByClassName('pause')[i].style.display = 'block'
								document.getElementsByClassName('play')[i].style.display = 'none'
								that.is_playFinish = setInterval(function () {
									if (document.getElementsByClassName('audio')[i].ended) {
										window.clearInterval(that.is_playFinish);
										document.getElementsByClassName('pause')[i].style.display = 'none'
										document.getElementsByClassName('play')[i].style.display = 'block'
									}
								}, 1000);
							})
							document.getElementsByClassName('pause')[i].addEventListener('click', function () {
								document.getElementsByClassName('audio')[i].pause()
								document.getElementsByClassName('pause')[i].style.display = 'none'
								document.getElementsByClassName('play')[i].style.display = 'block'
								window.clearInterval(that.is_playFinish);
							})
						}
					}
				})

			},
			goBack () {
				window.open(this.historyUrl)
			},
			async leave () {
				this.ws.websocketSend(
					JSON.stringify({
						channel: "pull",
						info   : {
							type        : 1,
							statistic_id: this.statisticId
						}
					})
				)
			}
		},
		created () {
			this.num = this.$route.query.num || "0"
			this.attach_id = this.$route.query.attach_id || ""
			this.article_id = this.$route.query.article_id || ""
			this.chat_id = this.$route.query.chat_id || ""
			this.historyUrl = decodeURIComponent(decodeURIComponent(this.$route.query.history_url)) || ""
			console.log(this.historyUrl)
			if (this.getParameter("agent_id") !== null) {
				let _this = this
				_this.$store.dispatch('setWx', () => {
					_this.initPage(_this.getContent)
				})
				// this.initPage(this.getContent)
			} else {
				this.getContent()
			}
		},
		mounted () {
			// this.$refs.preview.style.MozUserSelect = 'all'
			// this.$refs.preview.style.UserSelect = 'all'
			// this.$refs.preview.style.webkitUserSelect = 'all'
			// this.$refs.preview.style.MsUserSelect = 'all'
			document.body.style.backgroundColor = "#FFFFFF"
			document.getElementById("viewMeta").setAttribute('content', 'user-scalable=yes, width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=2');
		},
		destroyed () {
			document.getElementById("viewMeta").setAttribute('content', 'user-scalable=no, width=device-width, minimum-scale=1, initial-scale=1, maximum-scale=1');
		}
	}
</script>

<style>
	@import 'vant/lib/index.css'
</style>

<style scoped>
	.preview >>> * {
		font-size: 16px;
		max-width: 100%;
	}

	.preview {
		max-width: 700px;
		margin: 0 auto;
		padding: 20px;
		text-align: left;
	}

	.sketch-text {
		margin-top: 20px;
	}

	.sketch-text >>> .qqmusic {
		padding: 7px;
		height: 65px;
		background-color: #F7F7F7;
	}

	.sketch-text >>> .qqmusic-title {
		float: left;
		width: calc(100% - 84px)
	}

	.sketch-text >>> .music-title {
		margin-left: 10px;
		margin-top: 12px;
		display: block;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 12px;
		color: #758075;
	}

	.sketch-text >>> .name {
		font-size: 16px !important;
		color: #000000 !important;
		font-weight: 500 !important;
	}

	.sketch-text >>> .pause {
		background: url("../../static/assets/pause.png");
	}

	.sketch-text >>> .play {
		background: url("../../static/assets/play.png");
	}

	.sketch-text >>> .pause, .sketch-text >>> .play {
		position: relative;
		top: -49px;
		left: 20px;
		z-index: 999;
		width: 32px;
		height: 32px;
	}

	.sketch-text >>> p {
		margin: 5px 0;
	}

	.sketch-text >>> ol, .sketch-text >>> ul {
		padding: 0 20px;
	}

	.sketch-text >>> blockquote {
		margin: 0;
		padding-left: 10px;
		border-left: 3px solid #DBDBDB;
	}
</style>
