<template>
	<view>
		<view v-if="tip" class="content-msg">
			{{tip}}
		</view>
		<view style="width: 94%;margin: 0 auto;margin-top: 0.6rem !important;">
			<!--		<uni-load-more status="loading" :style="paddingTop" v-if="loadding"></uni-load-more>-->
			<!--    页面  -->
			<view v-if="!loadding" style="margin-bottom:0.27rem;">
				<view class="fission" :class="tip ? 'mTop': ''">
					<view class="backGroundImage">
						<view>
							<view class="receive-num">
								{{complete_num}}人已免费领取
							</view>
							<view style="border-bottom: 1px dashed #CCC;margin: 0.3rem auto 0;width: 50%;"></view>
							<!--						<view>-->
							<!--							<image src="/static/fissionIndex/header.png" style="height: 0.75rem;width: 11rem;"/>-->
							<!--						</view>-->
							<view style="font-size: 0.7rem;margin-top: 0.1rem !important;">
								<text class="text-p">呼朋唤友<span
										style="font-size: 1.07rem;color: red;">{{fission_num}}</span>位人气打Call
								</text>
								<text class="text-p prize-name"><span
										style="color: red;margin-right: 0.53rem;">免费拿</span>{{prize_name}}
								</text>
							</view>
							<view style="margin-top: 0.63rem;">
								<image style="height: 1.76rem;width: 98%;" src="/static/fissionIndex/step1.png"/>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 0.94页面 94% 0.77海报 77%   海报区域 -->
			<view class="back-pic" ref="img" v-if="!loadding">
				<image class="back-pic-img" :style="{height: imgHeight}"
				       :src="commonUrl + back_pic_url"/>
				<!--			<div id="qrcode"-->
				<!--					:style="{-->
				<!--					position: 'absolute',-->
				<!--					left: qrcodeStyle.x / 250 * windowWidth * 0.94 * 0.77 + windowWidth * 0.1081 + 'px',-->
				<!--					top: qrcodeStyle.y / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					width: qrcodeStyle.w / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					height: qrcodeStyle.w / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					marginTop: '1rem',-->
				<!--					display:'none'-->
				<!--				}"> </div>-->
				<!--			<text v-if="is_nickname == 1"-->
				<!--			      :style="{-->
				<!--			       fontSize: fontSize + 'px',-->
				<!--			       textAlign: align,-->
				<!--			       color: color,-->
				<!--					position: 'absolute',-->
				<!--					left: nickNameStyle.x / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					top: nickNameStyle.y / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					minWidth: nickNameStyle.w / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					minHeight: nickNameStyle.h / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					marginTop: '1rem',-->
				<!--					display:'none'-->
				<!--				}">{{nickName}}-->
				<!--			</text>-->
				<!--			<image v-if="is_avatar == 1"-->
				<!--			       :class="shape=='circle'? 'border50': ''"-->
				<!--			       :style="{-->
				<!--					position: 'absolute',-->
				<!--					left: avatarStyle.x / 250 * windowWidth * 0.94 * 0.77 + windowWidth * 0.1081 + 'px',-->
				<!--					top: avatarStyle.y / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					width: avatarStyle.w / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					height: avatarStyle.w / 250 * windowWidth * 0.94 * 0.77 + 'px',-->
				<!--					marginTop: '1rem',-->
				<!--					display:'none'-->
				<!--				}" src="/static/useradvart.png"/>-->
			</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</view>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import QRCode from 'qrcodejs2'
	import Footer from "../../components/footer/footer.vue";

	export default {
		name   : "index",
		inject : ['getCopyright'],
		components  : {Footer},
		data () {
			return {
				loadding     : true,
				tip          : '',
				commonUrl    : this.$store.state.commonUrl,
				complete_num : '0', // 领取人数
				fission_num  : '0', // 需要邀请人数
				prize_name   : '', // 奖品名称
				back_pic_url : '', // 背景图
				qrcode_url   : '', // 二维码链接
				qrcodeStyle  : {}, // 二维码样式
				is_nickname  : 0,  // 昵称是否展示
				nick_name    : '我不是唯一', // 昵称
				fontSize     : '14', // 昵称文字大小
				align        : 'left',
				nickNameStyle: {},  // 昵称样式
				is_avatar    : 0, // 头像是否展示
				head_url     : '', // 头像
				shareData    : {}, // 分享链接
				shape        : "", // 头像圆形  正方形
				avatarStyle  : {}, // 头像样式
				windowWidth  : 1200,
				imgHeight    : '',
				paddingTop   : {
					paddingTop: ''
				},//loading组件的高度
				jsApiList    : [],
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		mounted () {
			let that = this
			let height = window.innerHeight
			let paddingTop = (height - 40) / 2
			this.paddingTop.paddingTop = parseInt(paddingTop) + 'px'
			uni.getSystemInfo({
				success: function (res) { // res - 各种参数
					that.windowWidth = res.windowWidth > 1200 ? 1200 : res.windowWidth // 屏幕的宽度
				}
			});
			this.getData()
		},
		methods: {
			async getData () {
				let that = this
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("chat-message/preview", {
					fid: this.$route.query.fid
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					localStorage.setItem('uid',res.data.uid)
					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						this.getCopyright(this.refresh)
					}

					this.tip = res.data.tip
					this.complete_num = res.data.complete_num
					this.fission_num = res.data.fission_num
					this.back_pic_url = res.data.picRule.back_pic_url
					let img = new Image()
					img.src = this.commonUrl + this.back_pic_url
					img.onload = function () {
						that.imgHeight = that.windowWidth * 0.94 * 0.77 / img.width * img.height + 'px'
					}
					this.qrcode_url = res.data.qr_code
					// this.$nextTick(() => {
					// 	new QRCode('qrcode', {
					// 		text        : that.qrcode_url,
					// 		width       : parseInt((that.qrcodeStyle.w / 250 * that.windowWidth * 0.7238).toString()),
					// 		height      : parseInt((that.qrcodeStyle.w / 250 * that.windowWidth * 0.7238).toString()),
					// 		colorDark   : "#000000",
					// 		colorLight  : "#FFFFFF",
					// 		correctLevel: QRCode.CorrectLevel.H
					// 	})
					// })
					this.qrcodeStyle = res.data.picRule.qrCode
					this.nickNameStyle = res.data.picRule.nickName
					this.is_nickname = res.data.picRule.is_nickname
					this.color = res.data.picRule.color
					this.align = res.data.picRule.align
					this.fontSize = res.data.picRule.fontSize
					this.is_avatar = res.data.picRule.is_avatar
					this.head_url = res.data.head_url
					this.shape = res.data.picRule.shape
					this.avatarStyle = res.data.picRule.avatar
					this.prize_name = res.data.prizeName
					document.title = res.data.title
					Toast.clear();
					setTimeout(() => {
						this.loadding = false
					}, 500)
				}
			},
			//重新渲染頁面
			refresh(){
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
		},
		onLoad () {
			document.body.style.backgroundColor = "#F5F5F5";
		}

	}
</script>

<style scoped>
	.loadding {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 99999999999999;
		background-color: rgba(0, 0, 0, 0.6);
	}

	.loadding-title {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 999999999999999;
		color: white;
		/*background-color: rgba(0,0,0,0.8);*/
	}

	.fission-head {
		margin-top: 0.63rem !important;
	}

	.fission {
		width: 100%;
		max-width: 1200px;
		font-size: 0.8rem;
		height: 11.01rem;

	}

	.mTop {
		margin-top: 2.6rem;;
	}

	.text-p {
		display: block;
		margin-top: 0.65rem;
	}

	.text-span {
		display: inline-block;
	}

	.text-span button {
		border-radius: 0.1rem;
	}

	.time-view {
		vertical-align: text-top;
		padding: 0.25rem 0.25rem;
		border-radius: 0.2rem;
		font-size: 0.65rem;
		background-color: #F1301E;
		color: white;
	}

	.time-view >>> span {
		display: inline-block;
		min-width: 20px;
		min-height: 20px;
	}

	.prize-name {
		margin-top: 0.56rem;
		font-size: 1rem;
		font-weight: 700;
	}

	.look-list {
		width: 87%;
		text-align: center;
		background-color: white;
		font-size: 1rem;
		font-size: 0.8rem;
	}

	.back-pic {
		margin: 0px;
		/*position: absolute;*/
		max-width: 1200px;
		/*width: 94%;*/
		background-color: white;
		border-radius: 0.2rem;
	}

	.status-title {
		height: 1.3rem;
		font-size: 0.7rem;
		background-color: #F1301E;
		color: white;
		line-height: 1.4rem;
	}

	.receive-num {
		font-size: 0.65rem;
		color: #C3C3C3;
		margin-top: 0.64rem;
	}

	.back-pic-img {
		width: 77%;
		margin: 1rem 0;
		max-width: 1200px;
	}

	.red {
		color: #F1301E;
	}

	.border50 {
		border-radius: 50%;
	}

	.question {
		color: #F1301E;
		vertical-align: text-top;
	}

	.backGroundImage {
		padding: 0.3rem 1% 0.88rem 1%;
		background: url('../../static/fissionIndex/background.png') no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
		-webkit-background-size: 100% 100%;
		-o-background-size: 100% 100%;
		height: 100%;
		box-sizing: border-box;
		border-radius: 0.2rem;
	}

	.question {
		margin: 0.27rem;
	}

	.content-msg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 0.5rem 0;
		margin-top: 0;
		height: 1.2rem;
		font-size: 0.8rem;
		z-index: 99999999;
	}
</style>