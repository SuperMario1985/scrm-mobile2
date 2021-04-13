<template>
	<view>
		<view>
			<!--活动已删除的占位符-->
			<img src="../../static/raffle/delete.png" alt="" v-show="status == 4" :style="{paddingTop: imgPaddingTop}"
			     class="delete">
			<!--加载-->
			<!--			<uni-load-more status="loading" :style="paddingTop" v-show="isLoading && status != 4"></uni-load-more>-->
			<img src="../../static/raffle/background.jpg" alt="" style="width: 100%;" v-if="!isLoading && status != 4">
			<view v-if="status == 2" class="content-msg" style="top: 0;">活动未开始，仅供预览</view>
			<view v-if="status == 3" class="content-msg" style="top: 0;">活动未发布，仅供预览</view>

			<view class="draw" v-show="!isLoading && status != 4">
				<view class="light">
					<view class="turntable" id="turntable"></view>
					<view class="bg" id="turntable_bg">
						<template v-for="(item,index) in list">
							<ul :style="listUlStyle(index, list.length)">
								<li
										class="award-li"
										:style="listLiStyle(list.length)">
									{{item.name}}
									<img :src="commonUrl + item.image" alt=""
									     style="width:1.6rem;display: block;margin: 0.5rem auto 0;">
								</li>
							</ul>
						</template>
					</view>
					<img src="../../static/raffle/start.png" alt="" class="start" v-if="status == 2 || status == 3">
					<img src="../../static/raffle/start.png" alt="" class="start" @click="startAward"
					     v-if="status == 0 || status == 1">
				</view>
				<view class="text" v-if="is_mine == 0 && isNeedShare == 1">
					<p class="text-content1" style="font-size: 0.853rem  /* 16/18.75 */;">
						每获得1位好友支持，可增加{{chance2}}次抽奖机会。</p>
					<p class="text-content2">【{{nick_name}}】喜提大奖，近在咫尺，快来支持TA吧！</p>
				</view>
				<view class="text" v-if="is_mine == 0 && isNeedShare == 0">
					<p class="text-content1" style="font-size: 0.853rem  /* 16/18.75 */;width: 70%;margin-left: 15%;">
						欢迎您参与，点击“抽奖”，添加员工企业微信后，开始抽奖</p>
				</view>
				<view class="text" v-if="is_mine == 1">
					<p class="text-content1">您还有<span class="text-box">{{chance}}</span>次抽奖机会</p>
					<p class="text-content2" v-if="limitNum != 0 && isNeedShare == 1">每获得1位好友支持，可增加{{chance2}}次抽奖机会，单日最多可获得{{chance3}}次</p>
					<p class="text-content2" v-if="limitNum == 0 && isNeedShare == 1">每获得1位好友支持，可增加{{chance2}}次抽奖机会，单日最多可获得次数不限</p>
				</view>
				<view class="btn">
					<template v-if="status == 0">
						<!--进入我的-->
						<a :href="my_url" v-if="externalId >0 && is_mine==0">
							<img src="../../static/raffle/btn3.png" alt="" class="btn-img1">
						</a>
						<!--中奖名单-->
						<navigator :url="raffleListUrl" class="btn-img1"
						           v-if="is_mine==1">
							<img src="../../static/raffle/btn1.png" alt="" style="width: 100%;">
						</navigator>
					</template>
					<!--已结束-->
					<template v-if="status == 1">
						<!--进入我的-->
						<a :href="my_url" v-if="externalId >0 && is_mine==0">
							<img src="../../static/raffle/btn3.png" alt="" class="btn-img3">
						</a>
						<!--中奖名单-->
						<navigator :url="raffleListUrl" class="btn-img3"
						           v-if="externalId<=0 || externalId >0 && is_mine==1">
							<img src="../../static/raffle/btn1.png" alt="" style="width: 100%;">
						</navigator>
					</template>
					<!--生成海报-->
					<img src="../../static/raffle/btn2.png" alt="" class="btn-img2" @click="createPoster"
					     v-if="status == 0 && is_mine == 1 && join_id > 0 && !showPoster">
					<!--帮TA助力-->
					<img src="../../static/raffle/btn4.png" alt="" class="btn-img2" @click="start3(1)"
					     v-if="status == 0 && is_help == 1 && isNeedShare == 1">
					<img src="../../static/raffle/btn4.png" alt="" class="btn-img2" @click="createPoster"
					     v-if="status == 0 && is_help == 2 && isNeedShare == 1">
				</view>
				<view class="recordList">
					<view class="recordList-title">中奖名单</view>
					<view class="recordList-content">
						<view v-for="(item, index) in recordList" :key="index" style="line-height: 1.2rem;">
							<span class="recordList-content-left">{{item.nick_name}}</span>
							<span class="recordList-content-right">{{item.award_name}}</span>
						</view>
					</view>
				</view>
				<view class="activeRule">
					<view class="activeRule-title">活动规则</view>
					<view class="activeRule-content">
						<view style="overflow: hidden;">1.
							<div style="float: right;width: calc(100% - 0.8rem);margin-right: 0.21rem;">
								抽奖时间：{{rules.start_time}}—{{rules.end_time}}
							</div>
						</view>
						<view v-if="rules.description" style="overflow: hidden;">2.
							<div style="float: right;width: calc(100% - 0.8rem);margin-right: 0.21rem;">
								{{rules.description}}
							</div>
						</view>
					</view>
				</view>
				<!--谢谢参与弹窗-->
				<uni-popup ref="popup" type="center" @change="openPopup">
					<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -3.2rem;"
					           color="#bfbabd" @click="closePop"></uni-icons>
					<img src="../../static/raffle/noAward.png" alt="" style="width: 75%;">
					<button style="position: absolute;bottom: 15px;left: 50%;width: 200px;margin-left: -100px;background: #FFC100;color: #FFF;"
					        @click="again(is_refresh,0)">再玩一次
					</button>
				</uni-popup>
				<!--中奖弹窗-->
				<uni-popup ref="popup2" type="center">
					<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -3.2rem;"
					           color="#bfbabd" @click="closePop2"></uni-icons>
					<img src="../../static/raffle/award.png" alt="" style="width: 100%;">
					<view style="height: 6.4rem;position: absolute;width: 75%;top: 7.57rem;left: 50%;margin-left: -39%;">
						<img :src="commonUrl + awardRes.logo" alt="" style="max-width: 75%;max-height: 100%;"
						     v-if="awardRes.prize_type == 0">
						<img src="../../static/raffle/redBgc.png" alt="" style="width: 75%;"
						     v-if="awardRes.prize_type == 1">
					</view>
					<view style="position: absolute;width: 75%;top: 8.533rem  /* 160/18.75 */;left: 50%;margin-left: -39%;color: #742B23;"
					      v-if="awardRes.prize_type == 1"><span
							style="font-size: 1.493rem  /* 28/18.75 */;margin-right:0.267rem  /* 5/18.75 */;">{{awardRes.amount}}</span>元
					</view>
					<view style="position: absolute;width: 50%;top: 10.667rem  /* 200/18.75 */;left: 23%;color: #742B23;font-size: 0.64rem  /* 12/18.75 */;"
					      v-if="awardRes.prize_type == 1">
						<span v-if="awardRes.prize_send_type == 1">红包已发放至个人微信零钱</span>
						<span v-if="awardRes.prize_send_type == 2">红包将于{{awardRes.end_time}}发放至个人微信零钱</span>
					</view>
					<view style="position: absolute;bottom: 2.3rem;width: 75%;color: #FFF;font-size: 1.1rem;left: 50%;margin-left: -39%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;"
					      v-if="awardRes.prize_type == 0">
						恭喜您获得{{awardRes.name}}产品~
					</view>
					<view style="position: absolute;bottom: 2.3rem;width: 75%;color: #FFF;font-size: 1.1rem;left: 50%;margin-left: -39%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;"
					      v-if="awardRes.prize_type == 1">
						恭喜您获得红包~
					</view>
				</uni-popup>
				<!--活动结束弹窗-->
				<uni-popup ref="popup3" type="center">
					<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -3.2rem;"
					           color="#bfbabd" @click="closePop3"></uni-icons>
					<img src="../../static/raffle/end.png" alt="" style="width: 75%;">
				</uni-popup>
				<!--活码弹窗-->
				<uni-popup ref="popup4" type="center">
					<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -11.2rem  /* -210/18.75 */;"
					           color="#bfbabd" @click="closePop4"></uni-icons>
					<img :src="codeUrl" alt="" style="width: 50%;margin-top: -6.933rem  /* -130/18.75 */;">
					<p style="position: absolute;left: 15%;top: 4.8rem  /* 90/18.75 */;width: 70%;color: #FFF;">中奖后，方便商户与您联系</p>
					<p style="position: absolute;left: 15%;top: 6.4rem  /* 120/18.75 */;width: 70%;color: #FFF;">请先添加企业成员为好友</p>
					<p style="position: absolute;left: 2.987rem  /* 56/18.75 */;top: 8.267rem  /* 155/18.75 */;width: 13.973rem  /* 262/18.75 */;word-wrap:break-word;color: yellow;font-size: 0.693rem  /* 13/18.75 */;line-height: 1.173rem  /* 22/18.75 */;">*若您已添加员工企微后，依然弹出二维码情况时，可以尝试点击刷新，即可正常参与。<uni-icons type="reload" size="15" color="yellow" @click="reloadPage"></uni-icons></p>
				</uni-popup>
				<!--成功助力返回弹窗-->
				<uni-popup ref="popup6" type="center" @change="openPopup6">
					<img src="../../static/fissionIndex/helpBackground.png" alt="" style="width: 77%;">
					<img :src="avatar2" alt="" class="success-img">
					<p class="success-txt1">{{nick_name2}}</p>
					<p class="success-txt2">帮“{{nick_name}}”获得{{add_chance}}次抽奖机会</p>
					<p class="success-btn" @click="closePop6">知道了</p>
				</uni-popup>
			</view>
			<!-- 页面 100%  0.77海报 77%   海报区域 -->
			<uni-popup ref="popup5" type="center" v-show="!isLoading && status != 4 && showPoster" @change="openPopup5">
				<image :src="posterUrl" :style="{height: imgHeight,width:imgWidth}"
				       style="background-color: transparent;position: absolute;z-index:9999999999999999999; transform: translate(-50%, -50%);"
				/>
				<view>
					<div ref="qrcode" id="qrcode"></div>
				</view>
				<view class="content-msg" :style="{bottom:bottom}">
					长按保存图片
				</view>
			</uni-popup>
			<!--提示弹窗-->
			<uni-popup ref="errorPop" type="center">
				<view class="errorPop">
					<img src="../../static/redFission/errorPop.png" alt=""
					     style="width: 4.16rem  /* 78/18.75 */;margin: 1.973rem  /* 37/18.75 */ auto;">
					<p style="font-size: 0.96rem  /* 18/18.75 */;color: #333;width: 90%;margin-left: 5%;">
						{{err_msg}}</p>
					<button class="errorPop-btn" @click="closeErrorPop">知道了</button>
				</view>
			</uni-popup>
		</view>
		<Footer v-if="is_show_copyright == 1 && !isLoading" style="background: #4320B0;"></Footer>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import QRCode from "qrcodejs2";
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : "index",
		inject    : ['initPage', 'getCopyright'],
		components: {Footer},
		data () {
			return {
				isLoading        : true,
				wx               : false,
				wxWork           : false,
				commonUrl        : this.$store.state.commonUrl,
				windowWidth      : 1200,
				windowHeight     : 1200,
				paddingTop       : {
					paddingTop: ''
				},//loading组件的高度
				itemNum          : 6,//多少份转盘
				chance           : 0,//剩余抽奖机会
				chance2          : 0,//分享一次可获得抽奖机会
				limitNum         : 0,//单日分享最大次数,0不限，1限制
				chance3          : 0,//单日分享最大次数
				list             : [],//转盘信息
				recordList       : [],//中奖名单
				rules            : [],//规则
				awardRes         : {},//中奖结果
				status           : 0,//活动状态，1已结束，2未开始,3活动尚未发布,4活动已删除
				raffleListUrl    : '',
				url              : '',
				shareData        : {}, // 分享链接
				awardId          : '',//活动id
				externalId       : '',//上级id
				isContact        : '',//0是外部联系人1不是
				my_url           : '',//进入我的链接
				join_id          : '',//参与者id
				codeUrl          : '',//活码链接
				rotateSpeed      : '',//旋转时间
				startFlag        : true,//控制抽奖按钮是否可以点击
				is_mine          : '',//0进入我的
				area_type        : 1,//1、不限制，2、部分地区
				lat              : '',//纬度
				lng              : '',//经度
				err_msg          : '',//提示弹窗的文案
				external_id      : '',//外部联系人id
				is_refresh       : 0,//是否刷新页面,0不刷，1刷新
				ele_refresh      : 1,//关闭谢谢参与弹窗后是否刷新页面，0不刷，1刷新
				is_help          : '',//帮他助力按钮，0 隐藏 1 帮他助力 2 帮他分享
				add_chance       : '',//助力获得的抽奖机会次数
				//海报
				back_pic_url     : '',//海报背景图
				creatingPoster   : false,
				fontSize         : '14', // 昵称文字大小
				align            : 'left',
				nickNameStyle    : {},  // 昵称样式
				shape            : "", // 头像圆形  正方形
				avatarStyle      : {}, // 头像样式
				is_avatar        : 0, // 头像是否展示
				head_url         : '', // 头像
				qrcode_url       : '', // 二维码链接
				qrcodeStyle      : {}, // 二维码样式
				color            : '#F5F5F5',
				imgHeight        : '',
				imgWidth         : '',
				is_nickname      : 0,  // 昵称是否展示
				nick_name        : '', // 昵称
				nickNameLeft     : '',
				posterUrl        : '',
				base64Data       : '',
				bottom           : '',
				imgPaddingTop    : '100px',//活动已删除占位符paddingTop
				nick_name2       : '',//助力人昵称
				avatar2          : '',//助力人头像
				showPoster       : false,//海报弹窗的有没有显示
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
				isNeedShare      : 1,////是否需要分享
			}
		},
		onShow () {
			//loading组件的paddingTop的距离
		},
		methods   : {
			//监听谢谢参与弹窗的显示与隐藏
			openPopup (e) {
				if (!e.show) {
					if (this.is_refresh == 1 && this.ele_refresh == 1) {
						this.getData()
					}
				}
			},
			//监听海报弹窗的显示与隐藏
			openPopup5 (e) {
				this.showPoster = e.show
			},
			//监听成功助力返回弹窗的显示与隐藏
			openPopup6 (e) {
				if (!e.show) {
					// this.$refs.popup5.open()
					this.getData()
				}
			},
			// 生成海报
			createPoster () {
				this.isLoading = true
				this.$refs.popup5.open()
				setTimeout(() => {
					this.isLoading = false
				}, 1000)
				if (!this.creatingPoster) {
					this.creatingPoster = true
					let canvas = document.createElement('canvas')
					let ctx = canvas.getContext('2d')
					let that = this
					let devicePixelRatio = window.devicePixelRatio
					let image = new Image()
					image.setAttribute('crossOrigin', 'anonymous')
					image.src = this.commonUrl + this.back_pic_url
					image.onload = () => {
						canvas.width = that.windowWidth * 0.77 * devicePixelRatio
						canvas.height = that.windowWidth * 0.77 * image.height / image.width * devicePixelRatio
						ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
						if (that.is_nickname == 1) {
							ctx.globalCompositeOperation = "source-over";
							let x = (that.nickNameStyle.x / 250 * that.windowWidth * 0.77) * devicePixelRatio
							let y = (that.nickNameStyle.y / 250 * that.windowWidth * 0.77 + that.nickNameStyle.h / 250 * that.windowWidth * 0.77 / 1.5) * devicePixelRatio
							let w = that.nickNameStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
							ctx.fillStyle = that.color
							ctx.font = that.fontSize * devicePixelRatio + "px 'Avenir',Helvetica,Arial,sans-serif";
							if (x < 0) {
								x = 0
								ctx.textAlign = 'left'
								ctx.fillText(that.nick_name, x, y);
							} else {
								if (this.align == 'left') {
									ctx.textAlign = this.align
									ctx.fillText(that.nick_name, x, y);
								} else if (this.align == 'center') {
									ctx.textAlign = this.align
									ctx.fillText(that.nick_name, x + w / 2, y);
								} else if (this.align == 'right') {
									ctx.textAlign = this.align
									ctx.fillText(that.nick_name, x + w, y);
								}
							}
						}

						let img = new Image()
						img.src = this.commonUrl + this.back_pic_url
						img.onload = function () {
							that.imgHeight = that.windowWidth * 0.77 / img.width * img.height + 'px'
							that.imgWidth = that.windowWidth * 0.77 + 'px'
							// let left = that.nickNameStyle.x / 250 * that.windowWidth * 0.77
							// that.$nextTick(() => {
							// let minWidth = document.getElementById('nickName').style.width
							// let width = parseInt(minWidth.substring(0, minWidth.length - 2)) / 250.0 * that.windowWidth * 0.94 * 0.77
							// let maxWidth = that.windowWidth * 0.94 * 0.77
							// if (width + left > maxWidth) {
							// 	that.nickNameLeft = that.windowWidth * 0.94 * 0.77 - width + that.windowWidth * 0.1081
							// } else {
							// 	that.nickNameLeft = that.nickNameStyle.x / 250 * that.windowWidth * 0.94 * 0.77 + that.windowWidth * 0.1081
							// }
							// })

							if (that.windowHeight - that.windowWidth * 0.77 / img.width * img.height > 0) {
								that.bottom = 0
							} else {
								that.bottom = ((that.windowHeight - that.windowWidth * 0.77 / img.width * img.height) / 18.75 - 1.97) + 'rem'
							}
						}

						if (that.is_avatar == 1) {
							let avatar = new Image()
							avatar.setAttribute('crossOrigin', 'anonymous')
							avatar.src = that.base64Data
							avatar.onload = () => {
								if (that.shape == "circle") {
									avatar.src = that.circle_image_v2(avatar, 1)
									avatar.onload = () => {
										ctx.globalCompositeOperation = "source-over";
										let left = that.avatarStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
										let top = that.avatarStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
										let minWidth = that.avatarStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
										ctx.drawImage(avatar, left, top, minWidth, minWidth)
										that.addQrcode(ctx, canvas, devicePixelRatio)
									}
								} else {
									ctx.globalCompositeOperation = "source-over";
									let left = that.avatarStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
									let top = that.avatarStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
									let width = that.avatarStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
									ctx.drawImage(avatar, left, top, width, width)
									that.addQrcode(ctx, canvas, devicePixelRatio)
								}
							}
						} else {
							that.addQrcode(ctx, canvas, devicePixelRatio)
						}
					}
				}
			},
			// 添加二维码
			addQrcode (ctx, canvas, devicePixelRatio) {
				let that = this
				let flag = setInterval(function () {
					new QRCode(that.$refs.qrcode, {
						text        : that.qrcode_url,
						width       : parseInt((that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio).toString()),
						height      : parseInt((that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio).toString()),
						colorDark   : "#000000",
						colorLight  : "#FFFFFF",
						correctLevel: QRCode.CorrectLevel.H
					})
					let qrCode = new Image()
					if (document.getElementById('qrcode').getElementsByTagName('img').length > 0) {
						qrCode.src = document.getElementById('qrcode').getElementsByTagName('img')[0].getAttribute("src")
						if (qrCode.src && qrCode !== null) {
							clearInterval(flag)
							qrCode.setAttribute('crossOrigin', 'anonymous')
							qrCode.onload = () => {
								ctx.globalCompositeOperation = "source-over";
								let left = that.qrcodeStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let top = that.qrcodeStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let width = that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
								ctx.drawImage(qrCode, left, top, width, width)
								ctx.scale(devicePixelRatio, devicePixelRatio)
								that.createUrl(canvas)
							}

						}
						if (document.getElementById('qrcode').getElementsByTagName('canvas').length > 0) {
							clearInterval(flag)
							qrCode.src = document.getElementById('qrcode').getElementsByTagName('canvas')[0].toDataURL("image/png")
							qrCode.onload = () => {
								ctx.globalCompositeOperation = "source-over";
								let left = that.qrcodeStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let top = that.qrcodeStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let width = that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
								ctx.drawImage(qrCode, left, top, width, width)
								ctx.scale(devicePixelRatio, devicePixelRatio)
								that.createUrl(canvas)
							}
						}
					}
				}, 100)
			},
			// 头像形状
			circle_image_v2 (img, imgType) {
				var type = imgType || 0;
				var radius, diameter, canvas, ctx, natural;
				if (type) {
					if (img.naturalWidth > img.naturalHeight) {
						radius = img.naturalHeight / 2;
					} else {
						radius = img.naturalWidth / 2;
					}
				} else {
					if (img.width > img.height) {
						radius = img.height / 2;
					} else {
						radius = img.width / 2;
					}
					if (img.naturalWidth > img.naturalHeight) {
						natural = img.naturalHeight;
					} else {
						natural = img.naturalWidth;
					}
				}
				diameter = radius * 2;
				canvas = document.createElement('canvas');
				if (!canvas.getContext) { // 判断浏览器是否支持canvas，如果不支持在此处做相应的提示
					console.log('您的浏览器版本过低，暂不支持。');
					return false;
				}
				canvas.width = diameter;
				canvas.height = diameter;
				let contex = canvas.getContext("2d");
				contex.clearRect(0, 0, diameter, diameter);
				contex.save();
				contex.beginPath();
				contex.arc(radius, radius, radius, 0, Math.PI * 2, false);
				contex.clip();
				if (type) {
					contex.drawImage(img, 0, 0, diameter, diameter, 0, 0, diameter, diameter);
				} else {
					contex.drawImage(img, 0, 0, natural, natural, 0, 0, diameter, diameter);
				}
				contex.restore();
				return canvas.toDataURL('image/png');
			},
			// 海报生成图片
			createUrl (canvas) {
				this.$refs.qrcode.innerHTML = ''
				this.posterUrl = canvas.toDataURL("image/png");
				this.creatingPoster = false
			},

			initPageNew () {
				let that = this
				uni.getSystemInfo({
					success: function (res) { // res - 各种参数
						that.windowWidth = res.windowWidth > 1200 ? 1200 : res.windowWidth // 屏幕的宽度
						that.windowHeight = res.windowHeight > 1200 ? 1200 : res.windowHeight // 屏幕的宽度
					}
				});
				this.external_id = this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('external_int_id')
				this.getData()

				// this.getData()
			},
			// // 跳转微信
			// goWx () {
			// 	let CORPID = this.getParameter('suite_id') !== null ? this.getParameter('suite_id') : this.getParameter('corpid')
			// 	let code = this.getParameter('code')
			// 	let state = this.getParameter('state')
			// 	this.url = this.url.replace('&code=' + code, '')
			// 	this.url = this.url.replace('?code=' + code + "&", '?')
			// 	this.url = this.url.replace('?code=' + code, '?')
			// 	this.url = this.url.replace('&state=' + state, '')
			// 	this.url = this.url.replace('?state=' + state + "&", '?')
			// 	this.url = this.url.replace('?state=' + state, '?')
			// 	let REDIRECT_URI = encodeURIComponent(this.url)
			// 	let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + CORPID + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
			// 	window.location.href = url
			// },
			async getData () {
				if (this.is_refresh == 0) {
					this.isLoading = true
				}
				let corp_id = this.getParameter('corp_id')
				let corpid = this.getParameter('corpid')
				let agent_id = this.getParameter('agent_id')
				let assist = this.getParameter('assist')
				let deviceCode = this.$cookies.get(this.$store.state.authKey)
				// let corp_id = '1'
				// let agent_id = '5'
				// let assist = 'award_76_2375'
				// let code = ""
				const {data: res} = await this.axios.post("wap-award/get-awards", {
					corp_id    : corp_id,
					agent_id   : agent_id,
					code       : deviceCode,
					assist     : assist,
					external_id: this.external_id
				});
				if (res.error != 0) {
					this.limit2(1)
					Toast.fail(res.error_msg);
				} else {
					if (this.is_refresh == 0) {
						this.limit2(res.data.is_forbid)
					}
					this.isLoading = false
					document.title = res.data.title
					this.shareData = res.data.shareData
					this.chance = res.data.chance
					this.list = res.data.info.awards
					this.itemNum = this.list.length
					this.chance2 = res.data.info.rules.share_setting[0].total_num
					this.limitNum = res.data.info.rules.share_setting[1].limit1
					this.chance3 = res.data.info.rules.share_setting[1].day_num
					this.recordList = res.data.info.records
					this.rules = res.data.info.rules
					this.status = res.data.status
					this.awardId = res.data.awardId
					this.externalId = res.data.externalId
					this.isContact = res.data.isContact
					this.my_url = res.data.my_url
					this.join_id = res.data.join_id
					this.is_mine = res.data.is_mine
					this.raffleListUrl = "/pages/raffle/list?id=" + this.awardId + '&jid=' + this.join_id
					this.area_type = res.data.area_type
					this.external_id = res.data.external_id
					this.is_help = res.data.is_help
					this.isNeedShare = res.data.is_share_open
					this.$forceUpdate()

					this.qrcode_url = res.data.share_url
					this.qrcodeStyle = res.data.picRule.qrCode
					this.nickNameStyle = res.data.picRule.nickName
					this.is_nickname = res.data.picRule.is_nickname
					this.nick_name = res.data.nick_name
					this.color = res.data.picRule.color
					this.align = res.data.picRule.align
					this.fontSize = res.data.picRule.font_size
					this.head_url = res.data.head_url
					this.shape = res.data.picRule.shape
					this.avatarStyle = res.data.picRule.avatar
					this.is_avatar = res.data.picRule.is_avatar
					this.back_pic_url = res.data.picRule.back_pic_url
					this.base64Data = res.data.base64Data

					if (this.is_refresh == 0) {
						this.$nextTick(() => {
							//转盘分的块数（外层）
							let bgFragment = document.createDocumentFragment();
							for (let i = 0; i < this.itemNum; i++) {
								let bgItem = document.createElement('ul');
								let deg = (360 / this.itemNum) * i
								let skewX = 90 - (360 / this.itemNum)
								let bgDeg = 360 / this.itemNum

								if (bgDeg == 180) {
									let newWidth = 7.065 * 2
									skewX = 0
									bgItem.style.cssText = `width: ${newWidth}rem !important; transform-origin: bottom center; `;
								} else if (bgDeg > 90) {
									let newWidth = 7.065 / Math.cos((bgDeg - 90) * Math.PI / 180)
									let newLeft = 7.065 - newWidth
									bgItem.style.cssText = `width: ${newWidth}rem !important; left: ${newLeft}rem !important; `;
								} else if (bgDeg < 90) {
									let newHeight = 7.065 * Math.sin(bgDeg * Math.PI / 180)
									let newTop = 7.065 - newHeight

									bgItem.style.height = newHeight + 'rem!important';
									bgItem.style.top = newTop + 'rem!important';
								}

								if (this.itemNum == 4 && i == 3 || this.itemNum == 7 && i == 6) {
									bgItem.style.background = '#FFFAF1'
								}

								bgItem.style.transform = `rotate(${deg}deg) skewX(${skewX}deg)`;
								bgFragment.appendChild(bgItem);
							}
							let turntable = document.getElementsByClassName('turntable')[0]
							turntable.appendChild(bgFragment);
						})

						localStorage.setItem('openid', res.data.openid)
						let websocketInterval
						websocketInterval = setInterval(() => {
							if (this.ws.websocket.readyState == 1) {
								clearInterval(websocketInterval)
								this.ws.websocketSend(
									JSON.stringify({
										channel: "bind",
										info   : {
											session_id: this.global.session_id,
											uid       : localStorage.getItem("uid") != null ? localStorage.getItem("uid") : '',
											subId     : (localStorage.getItem('user_type') == 2 && localStorage.getItem("sub_id") != null) ? localStorage.getItem("sub_id") : '',
											openid    : localStorage.getItem("openid") != null ? localStorage.getItem("openid") : '',
											bindType  : 3,
										}
									})
								)
							}
						}, 300)
					}
					if (this.status == 1) {
						this.$nextTick(x => {
							this.$refs.popup3.open()
						})
					} else if (this.status == 2) {
						this.startFlag = false
					}
					if (this.showPoster) {
						this.$refs.popup5.close()
					}
					this.is_refresh = 0
				}
			},
			listUlStyle (index, num) {
				let style = {
					transform: 'rotate(' + (360 / num) * index + 'deg)' + ' ' + 'skewX(' + (90 - (360 / num)) + 'deg)'
				}

				let bgDeg = 360 / num
				if (bgDeg == 180) {
					let newWidth = 6.35 * 2
					style.width = newWidth + 'rem !important'
					style.transformOrigin = 'bottom center'
					style.transform = 'rotate(' + (360 / num) * index + 'deg)'
				} else if (bgDeg > 90) {
					let newWidth = 6.35 / Math.cos((bgDeg - 90) * Math.PI / 180)
					let newLeft = 6.35 - newWidth

					style.width = newWidth + 'rem !important'
					style.left = newLeft + 'rem !important'
				} else if (bgDeg < 90) {
					let newHeight = 6.35 * Math.sin(bgDeg * Math.PI / 180)
					let newTop = 6.35 - newHeight


					style.height = newHeight + 'rem !important'
					style.top = newTop + 'rem !important'
				}

				if (num == 4 && index == 3 || num == 7 && index == 6) {
					style.background = '#FEE4B9'
				}

				return style
			},
			listLiStyle (num) {
				let style = {
					transform: 'skewX(' + (-(90 - (360 / num))) + 'deg) rotate(' + (-(90 - (360 / num / 2))) + 'deg)'
				}

				if (num == 2) {
					style = {
						transform : 'skewX(0deg) rotate(' + (-(90 - (360 / num / 2))) + 'deg)',
						marginLeft: 0
					}
				} else if (num == 7) {
					style = {
						transform : 'skewX(' + (-(90 - (360 / num))) + 'deg) rotate(' + (-(90 - (360 / num / 2))) + 'deg)',
						marginLeft: '2.667rem',
						marginTop : '-0.533rem'
					}
				}

				return style
			},
			async limit2 (is_forbid) {
				let that = this
				this.url = window.location.href
				let agent_id = this.getParameter("agent_id")
				localStorage.setItem('agent_id', agent_id)
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

					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						that.getCopyright(that.refresh)
					}

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
						jsApiList: that.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					})

					that.$store.state.wx.error(function (res) {
						if (typeof res.errCode !== "undefined" && res.errCode == 2) {
							if (typeof res.err_Info !== "undefined" && res.err_Info == 'invalid corpid' && that.wxWork) {
								Toast.fail({
									forbidClick: true,
									duration   : 0,
									message    : "请在微信中打开"
								})

								return false
							}
						} else if (typeof res.errMsg !== "undefined" && res.errMsg.indexOf("invalid corpid") != -1) {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : "请在微信中打开"
							})
							return false
						}

						console.log(res, 'res')
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : '初始化失败，请刷新重试'
						})
					})

					that.$store.state.wx.ready(function () {
						if (is_forbid == 1 || that.wx) {
							that.$store.state.wx.hideOptionMenu();
						} else {
							let shareData = {
								title   : that.shareData.title, // 分享标题
								desc    : that.shareData.desc.length > 0 ? that.shareData.desc : that.shareData.shareUrl, // 分享描述
								link    : that.shareData.shareUrl, // 分享地址
								imgUrl  : that.shareData.pic_url, // 分享显示的缩略图地址
								success : function () {
									Toast.success("分享成功");
								},
								fail    : function () {
									Toast.fail("分享失败");
								},
								complete: function () {
									// alert('调用结束')
								}
							}

							that.$store.state.wx.onMenuShareAppMessage(shareData)

							if (this.wxWork) {
								that.$store.state.wx.onMenuShareWechat(shareData)

								that.$store.state.wx.invoke(
									"shareAppMessage",
									{
										title : shareData.title,
										desc  : shareData.desc, // 分享描述
										link  : shareData.link, // 分享地址
										imgUrl: shareData.imgUrl, // 分享显示的缩略图地址
									},
									function (res) {
										if (res.err_msg == "shareAppMessage:ok") {
											Toast.success("分享成功");
										} else {
											Toast.fail("分享失败");
										}
									}
								)
								that.$store.state.wx.invoke(
									"shareWechatMessage",
									{
										title : shareData.title,
										desc  : shareData.desc, // 分享描述
										link  : shareData.link, // 分享地址
										imgUrl: shareData.imgUrl, // 分享显示的缩略图地址
									},
									function (res) {
										if (res.err_msg == "shareWechatMessage:ok") {
											Toast.success("分享成功");
										} else {
											Toast.fail("分享失败");
										}
									}
								)
								that.$store.state.wx.invoke(
									"shareToExternalContact",
									{
										title : shareData.title,
										desc  : shareData.desc, // 分享描述
										link  : shareData.link, // 分享地址
										imgUrl: shareData.imgUrl, // 分享显示的缩略图地址
									},
									function (res) {
										if (res.err_msg == "shareToExternalContact:ok") {
											Toast.success("分享成功");
										} else {
											Toast.fail("分享失败");
										}
									}
								)
							}

							that.$store.state.wx.onMenuShareTimeline(that.$delete(shareData, 'desc'))
						}
					})

				}
			},
			//重新渲染頁面
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null) {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
			//再玩一次
			again (val, ele) {
				this.ele_refresh = ele
				this.$refs.popup.close()
				this.$refs.popup2.close()
				this.$refs.popup3.close()
				this.start(val, ele)
			},
			//开始抽奖
			startAward () {
				if (this.startFlag) {
					if (this.status == 1) {
						this.$refs.popup3.open()
					} else {
						if (this.externalId > 0 && this.is_mine == 0) {
							Toast.fail('请点击进入我的，进行抽奖');
						} else {
							if (this.isContact == 1) {
								this.startFlag = false
								this.start()
							} else {
								this.startFlag = false
								this.start3()
							}
						}
					}
				}
			},
			//获取位置
			getLocation (val) {
				let that = this
				that.$store.state.wx.getLocation({
					type   : 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function (res) {
						that.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						that.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						that.start2(val)
					},
					fail   : function (res) {
						that.err_msg = '仅限部分地区参与，需先知道您当前地址。'
						that.$refs.errorPop.open()
					}
				});
			},
			//关闭提示弹窗
			closeErrorPop () {
				this.$refs['errorPop'].close()
			},
			async start (val, ele) {
				if (this.status == 1) {
					this.startFlag = true
					this.$refs.popup3.open()
				} else {
					if (val != null && typeof val != 'undefined') {
						this.is_refresh = val
					} else {
						this.is_refresh = 0
					}
					if (ele != null && typeof ele != 'undefined') {
						this.ele_refresh = ele
					} else {
						this.ele_refresh = 1
					}
					if (this.chance > 0) {
						const {data: res} = await this.axios.post("wap-award/set-prize", {
							uid    : localStorage.getItem('uid'),
							id     : this.awardId,
							join_id: this.join_id
						});
						if (res.error != 0) {
							this.startFlag = true
							Toast.fail(res.error_msg);
						} else {
							// 1. 中奖结果
							let randomRate = res.data.info.id
							this.awardRes = res.data.info
							//获取中奖值的位置index
							let location = 0
							this.list.map((x, index) => {
								if (randomRate == x.id) {
									location = index
								}
							})
							// 2. 计算旋转角度, 需要多转5圈，达转1圈用时1s, 到旋转的效果
							let rotateItemDeg = -(location * (360 / this.list.length)) + 90 - (Math.floor(Math.random() * 45 + 1))
							let rotate = rotateItemDeg + 5 * 360;
							let rotateSpeed = (rotateItemDeg / 360 * 1 + 5).toFixed(2);
							this.rotateSpeed = rotateSpeed * 1000
							// 重置转盘样式
							let turntable = document.getElementsByClassName('turntable')[0]
							turntable.removeAttribute('style');
							let bg = document.getElementsByClassName('bg')[0]
							bg.removeAttribute('style');
							// 保证下一次旋转动画生效
							setTimeout(() => {
								turntable.style.transform = `rotate(${rotate}deg)`;
								turntable.style.transition = `transform ${rotateSpeed}s ease-out`;
								bg.style.transform = `rotate(${rotate}deg)`;
								bg.style.transition = `transform ${rotateSpeed}s ease-out`;
							}, 10)
							// 3. 动画结束，显示中奖结果，中奖结果如何显示，视实际情况而定
							setTimeout(() => {
								if (randomRate == 0) {
									this.$refs.popup.open()
								} else {
									this.$refs.popup2.open()
								}
								this.chance = res.data.chance
								this.recordList = res.data.records
								this.startFlag = true
							}, rotateSpeed * 1000);
						}
					} else {
						this.startFlag = true
						Toast.fail({
							message : '您已经抽了很多了，给小伙伴一点机会吧',
							duration: 2000
						});
					}
				}
			},
			async start2 (val) {
				if (this.status == 1) {
					this.startFlag = true
					this.$refs.popup3.open()
				} else {
					const {data: res} = await this.axios.post("wap-award/code", {
						uid        : localStorage.getItem('uid'),
						id         : this.awardId,
						externalId : this.externalId,
						external_id: this.external_id,
						lat        : this.lat,//经度
						lng        : this.lng,//纬度
					});
					if (res.error != 0) {
						this.startFlag = true
						Toast.fail(res.error_msg);
					} else {
						if (res.data.open_type == 0) {
							this.codeUrl = res.data.qr_code
							this.$refs.popup4.open()
						} else {
							if (val && val == 1) {
								Toast.success({
									message : '成功帮好友获得' + this.chance2 + '次抽奖机会',
									duration: 2000
								});
								setTimeout(() => {
									this.getData()
								}, 1500)
							} else {
								this.isContact = res.data.isContact
								this.join_id = res.data.join_id
								this.is_refresh = res.data.is_refresh
								if (this.is_refresh == 1) {
									this.getData()
								}
								this.start(this.is_refresh)
							}
						}
						this.startFlag = true
					}
				}
			},
			start3 (val) {
				if (this.area_type == 2) {
					this.getLocation(val)
				} else {
					this.start2(val)
				}
			},
			//关闭谢谢参与弹窗
			closePop () {
				this.$refs.popup.close()
				if (this.is_refresh == 1) {
					this.getData()
				}
			},
			//关闭中奖弹窗
			closePop2 () {
				this.$refs.popup2.close()
				if (this.is_refresh == 1) {
					this.getData()
				}
			},
			//关闭活动结束弹窗
			closePop3 () {
				this.$refs.popup3.close()
			},
			//关闭活码弹窗
			closePop4 () {
				this.$refs.popup4.close()
			},
			//关闭成功助力返回弹窗
			closePop6 () {
				this.$refs.popup6.close()
			},
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'award' && typeof data.has_chat != 'undefined' && data.has_chat) {
					this.ws.setCallback()
					if (localStorage.getItem('openid')) {
						localStorage.removeItem('openid')
					}
					this.nick_name2 = data.nick_name
					this.avatar2 = data.avatar
					this.add_chance = data.add_chance
					if (this.showPoster) {
						this.$refs.popup5.close()
					}
					if (data.is_refresh && typeof data.is_refresh != 'undefined' && data.is_refresh == 1) {
						this.$refs.popup4.close()
						this.initPage(this.getData)
					} else {
						if (this.add_chance != '') {
							this.$refs.popup6.open()
						}
					}
				}
			},
			fun () {
				this.$router.go(-4)
			},
			reloadPage(){
				this.$refs.popup4.close()
				this.initPage(this.getData)
			}
		},
		mounted () {
			if (window.history && window.history.pushState) {

				history.pushState(null, null, document.URL);

				window.addEventListener('popstate', this.fun, false);//false阻止默认事件
			}
		},
		destroyed () {
			//页面销毁时，取消监听。否则其他vue路由页面也会被监听
			window.removeEventListener('popstate', this.fun, false);//false阻止默认事件

		},
		onLoad () {
			this.wx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') === -1

			this.wxWork = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') !== -1

			if (this.wx) {
				this.jsApiList = [
					'hideOptionMenu',
					'onMenuShareAppMessage',
					'onMenuShareTimeline',
					'getLocation'
				]
			}

			if (this.wxWork) {
				this.jsApiList = [
					'hideOptionMenu',
					'onMenuShareAppMessage',
					'onMenuShareWechat',
					'onMenuShareTimeline',
					'shareAppMessage',
					'shareWechatMessage',
					'shareToExternalContact',
					'getLocation'
				]
			}

			this.ws.setCallback(this.websocketOnMessage)
			let height = window.innerHeight
			let paddingTop = (height - 40) / 2
			this.paddingTop.paddingTop = parseInt(paddingTop) + 'px'
			//活动已删除占位符的paddingTop的距离
			let paddingTop2 = (height - 314.27) / 2
			this.imgPaddingTop = parseInt(paddingTop2) + 'px'

			let that = this
			this.$store.dispatch('setWx', () => {
				that.initPage(that.initPageNew)
			})
		},
	}
</script>

<style scoped>
	.draw {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.light {
		width: 16.21rem;
		height: 16.21rem;
		background: url("../../static/raffle/circle-bgc.png");
		background-size: 16.29rem 16.9rem;
		background-repeat: no-repeat;
		margin: 11.52rem auto 0;
		position: relative;
	}

	.turntable {
		position: absolute;
		top: 1.07rem;
		left: 1.07rem;
		width: 14.13rem;
		height: 14.13rem;
		background: #FFD07E;
		border-radius: 50%;
		overflow: hidden;
	}

	/deep/ .turntable > ul {
		position: absolute;
		top: 0;
		left: 0;
		width: 7.065rem;
		height: 7.065rem;
		transform-origin: right bottom;
		overflow: hidden;
	}

	/*/deep/ .turntable ul:nth-child(4n) {*/
	/*	background: #FFECC9;*/
	/*}*/

	/deep/ .turntable ul:nth-child(3n) {
		background: #FEE4B9;
	}

	/deep/ .turntable ul:nth-child(3n+1) {
		background: #FFDBA3;
	}

	/deep/ .turntable ul:nth-child(3n+2) {
		background: #FFFAF1;
	}

	.bg {
		position: absolute;
		top: 1.81rem;
		left: 1.76rem;
		width: 12.69rem;
		height: 12.69rem;
		background: #FFF;
		border-radius: 50%;
		overflow: hidden;
	}

	/deep/ .bg > ul {
		position: absolute;
		top: 0;
		left: 0;
		text-align: left;
		width: 6.35rem;
		height: 6.35rem;
		transform-origin: bottom right;
	}

	/deep/ .bg > ul:nth-child(3n) {
		background: #FFDBA3;
	}

	/deep/ .bg > ul:nth-child(3n+1) {
		background: #FFFAF1;
	}

	/deep/ .bg > ul:nth-child(3n+2) {
		background: #FEE4B9;
	}

	/*/deep/ .bg > ul:nth-child(4n+3) {*/
	/*	background: #FFECC9;*/
	/*}*/

	.award-li {
		font-size: 13px;
		font-weight: 700;
		color: #F7511E;
		width: 100%;
		height: 100%;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		padding: 0.4rem 1.3rem;
		box-sizing: border-box;
		margin-left: 50%;
		transform-origin: center bottom;
	}

	.start {
		width: 3.25rem;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -1.83rem;
		margin-left: -1.63rem;
	}

	.text {
		height: 5.73rem;
		margin-top: 1.28rem;
	}

	.text-box {
		display: inline-block;
		height: 1.84rem;
		background: #FFF;
		border-radius: 0.16rem;
		color: #392BCD;
		margin: 0 0.53rem;
		vertical-align: middle;
		line-height: 1.84rem;
		padding: 0 0.27rem;
	}

	.text-content1 {
		font-size: 0.96rem;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #FFFFFF;
		padding: 1.07rem 0 0.5rem;
	}

	.text-content2 {
		font-size: 0.64rem;
		font-weight: bold;
		font-stretch: normal;
		letter-spacing: 0px;
		color: #FDBF14;
		width: 60%;
		margin: auto;
	}

	.btn {
		margin-top: 1.47rem;
		text-align: left;
		height: 2.24rem;
	}

	.btn-img1 {
		width: 6.35rem;
		margin: 0 2.19rem 0 2.61rem;
		cursor: pointer;
		position: relative;
		display: inline-block;
	}

	.btn-img3 {
		width: 6.35rem;
		margin: 0 auto;
		cursor: pointer;
		position: relative;
		display: block;
	}

	.btn-img1:active, .btn-img2:active {
		top: 0.11rem; /**向下偏移2px **/
	}

	.btn-img2 {
		width: 6.35rem;
		cursor: pointer;
		position: relative;
	}

	.recordList {
		margin-top: 1.92rem;
	}

	.recordList-title {
		font-size: 1.07rem;
		color: #FFF;
		line-height: 2.45rem;
	}

	.recordList-content {
		width: 100%;
		height: 8.21rem;
		margin: 1.49rem auto 0.43rem;
		font-size: 0.64rem;
		color: #FFF;
		line-height: 1.17rem;
		padding: 0.5rem 3rem;
		text-align: left;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.recordList-content-left {
		color: #FED200;
		margin-right: 1.33rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		width: 4rem;
		display: inline-block;
	}

	.recordList-content-right {
		display: inline-block;
		width: calc(100% - 5.33rem);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.activeRule {
		margin-top: 2.51rem;
		font-size: 1.07rem;
		color: #FFF;
		line-height: 2.51rem;
	}

	.activeRule-content {
		width: 17.17rem;
		height: 8.21rem;
		margin: 1.49rem auto 0.43rem;
		font-size: 0.64rem;
		line-height: 1.17rem;
		text-align: left;
		box-sizing: border-box;
		overflow-y: auto;
		padding: 1.01rem 0.91rem;
		word-wrap: break-word;
		color: #FED200;
	}

	.content-msg {
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		height: 1.2rem;
		font-size: 0.8rem;
		z-index: 999;
		position: fixed;
		left: 0;
		right: 0;
	}

	.back-pic {
		margin: 0px;
		position: absolute;
		max-width: 1200px;
		width: 94%;
		padding-bottom: 3rem;
		background-color: white;
		border-radius: 0.2rem;
	}

	.back-pic-img {
		width: 72.38% !important;
		margin: 1rem 0;
		max-width: 1200px;
	}

	.border50 {
		border-radius: 50%;
	}

	.success-img {
		width: 3.42rem;
		border-radius: 50%;
		position: absolute;
		left: 50%;
		margin-left: -1.71rem;
		top: 2rem;
	}

	.success-txt1 {
		position: absolute;
		left: 11.5%;
		top: 6.42rem;
		width: 77%;
		color: #FFF;
	}

	.success-txt2 {
		width: 77%;
		position: absolute;
		left: 11.5%;
		top: 8.42rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
		padding: 0 1rem;
		box-sizing: border-box;
		color: #FFF;
	}

	.success-btn {
		background: #FFF;
		width: 8rem;
		height: 2.13rem;
		line-height: 2.13rem;
		position: absolute;
		bottom: 1.87rem;
		left: 50%;
		margin-left: -4rem;
		border-radius: 1.07rem;
		font-size: 0.85rem;
		color: #FF683F;
	}

	/deep/ .uni-transition {
		overflow-y: auto;
		background-color: rgba(0, 0, 0, 0.75);
	}

	.delete {
		width: 125px;
	}

	.errorPop {
		width: 16rem /* 300/18.75 */;
		height: 17.067rem /* 320/18.75 */;
		background: #FFF;
		box-shadow: 0px 9px 25px 8px rgba(208, 6, 40, 0.61);
		border-radius: 5px;
	}

	.errorPop-btn {
		width: 240px;
		height: 45px;
		background-color: #E73424;
		border-radius: 8px;
		color: #FFF;
		margin-top: 1.44rem /* 27/18.75 */;
	}

</style>