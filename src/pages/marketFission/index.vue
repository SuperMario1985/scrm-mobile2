<template>
	<view>
		<view v-if="status != 5 && status != 1 && !loadding && !canvasing" class="content-msg1">
			活动已结束
		</view>
		<view style="width: 94%;margin: 0.6rem auto 3rem;">
			<!--   弹窗遮罩	-->
			<view @click="clickShade" v-if="endDialog || PosterVisible || succsessDialog"
			      style="margin: 0 !important;position: fixed;top: 0; left: 0; width: 100%;height: 100%;background-color: rgba(0,0,0,0.9);z-index: 999999999">
			</view>
			<!--   弹窗内容 1助力成功 2助力已完成  -->
			<uni-popup ref="helpDialog" type="center" @change="openHelpDialog">
				<img src="../../static/fissionIndex/helpBackground.png" alt=""
				     style="width: 14.8rem;position: relative;">
				<image style="width: 3.4rem;height: 3.4rem;border-radius: 1.7rem;position: absolute;top: 1.7rem;left: calc(50% - 1.7rem);"
				       :src="help_head_url"/>
				<text v-if="is_help == 1"
				      style="position:absolute;font-size: 0.9rem;top: 5.7rem;color: white;text-align: center;width: 100%;left: 0;">
					{{help_name}}
				</text>
				<text v-if="is_help == 1"
				      style="position:absolute;top: 8.2rem;font-size: 0.9rem;color: white;width: 100%;left: 0;">
					帮“{{nick_name}}”打Call成功
				</text>
				<text v-if="is_help == 2"
				      style="position:absolute;font-size: 0.9rem;color: white;line-height: 1.4rem;width: 76%;left: 12%;top: 4rem;">
					来晚一步，好友【{{nick_name}}】已完成打Call任务
				</text>
				<!--			<text v-if="is_help == 2" style="display: block;">好友助力已完成</text>-->
				<button style="font-size: 0.85rem;
				    font-weight: 500;
				    width: 7.4rem;
				    background-color: white;
				    border-radius: 3.7rem;
				    height: 2.1rem;
				    color: #F1301E;
				    line-height: 2.1rem;left: calc(50% - 3.7rem);position: absolute;bottom: 1.7rem;"
				        @click="isHelp">知道了
				</button>
			</uni-popup>
			<!--	结束弹窗 	-->
			<view v-if="endDialog"
			      style='margin: 0 !important; width: 16rem;
              height: 21rem;position: fixed;left: 50%;top: 35.5%;
		      transform: translate(-50%, -50%);z-index: 9999999999;
			  '
			>
				<image style="width: 16rem;height: 21rem;"
				       src="/static/fissionIndex/endBackground.png"/>
				<button style="font-size: 0.85rem;
				    font-weight: 500;
				    width: 7.4rem;
				    background-color: #FFDF00;
				    border-radius: 3.7rem;
				    height: 2.1rem;
				    margin-top: -5rem;
				    color: #F1301E;
				    line-height: 2.1rem;"
				        @click="endHelp">知道了
				</button>
				<image @click="endHelp" style="width: 1.8rem;height: 4.8rem;margin-top: 2rem;"
				       src="/static/fissionIndex/close.png"/>
			</view>

			<!--完成提示弹窗-->
			<view v-if="succsessDialog"
			      style='margin: 0 !important; width: 15rem;
              height: 16.1rem;position: fixed;left: 50%;top: 35.5%;
		      transform: translate(-50%, -50%);z-index: 9999999999;
			  '
			>
				<image style="width: 15rem;height: 16.1rem;"
				       src="/static/fissionIndex/tooltip.png"/>
				<text style="display: block;margin-top: 1rem;font-size: 0.9rem;color: white;position: relative;margin-top: -8.3rem;">
					恭喜你！好友为你打Call人数已达标
				</text>
				<text style="display: block;font-size: 0.9rem;color: white;line-height: 1.4rem;width: 100%;position: relative;margin-top: 0.3rem;">
					免费获得
					<text v-if="levels[0].type == 1">
						{{levels[0].prize_name || ''}}
					</text>
					<text v-if="levels[0].type == 2">
						{{levels[0].money_amount}}元红包
					</text>
				</text>
				<button style="font-size: 0.85rem;
				    font-weight: 500;
				    width: 7.4rem;
				    margin-top: 1rem;
				    background-color: white;
				    border-radius: 3.7rem;
				    height: 2.1rem;
				    color: #F1301E;
				    line-height: 2.1rem;"
				        @click="successKnow">知道了
				</button>
			</view>
			<uni-popup ref="ticketDialog" type="center">
				<img :src="success_url" style="width: 50%;"/>
				<button style="font-size: 0.85rem;font-weight: 500;width: 7.4rem;background-color: white;border-radius: 3.7rem;height: 2.1rem;color: #F1301E;line-height: 2.1rem;margin-top: 1rem;"
				        @click="isTicket">关闭
				</button>
			</uni-popup>
			<!--    页面  -->
			<view v-show="!loadding && !canvasing && !PosterVisible" style="margin-bottom:0.27rem;">
				<view class="fission" :class="status != 5 && status != 1 ? 'mTop': ''">
					<view class="backGroundImage">
						<view class="fission-head" v-if="status == 5">
							<!--						<text style="margin-right: 0.3rem;font-size: 0.9rem;">倒计时</text>-->
							<text class="time-view">{{day || '00'}}</text>
							<text class="question">天</text>
							<text class="time-view">{{hour || '00'}}</text>
							<text class="question">时</text>
							<text class="time-view">{{minutes || '00'}}</text>
							<text class="question">分</text>
							<text class="time-view">{{seconds || '00'}}</text>
							<text class="question">秒</text>
						</view>
						<view v-if="is_self != 1 || !invitate_num">
							<view class="receive-num">
								{{complete_num}}人已免费领取
							</view>
							<view style="border-bottom: 1px dashed #CCC;margin: 0.3rem auto 0;width: 50%;"></view>
							<!--						<view>-->
							<!--							<image src="/static/fissionIndex/header.png" style="height: 0.75rem;width: 11rem;"/>-->
							<!--						</view>-->
							<view style="font-size: 0.7rem;margin-top: 0.1rem !important;">
								<view class="text-p" style="padding: 0 2.667rem  /* 50/18.75 */;"
								      v-for="(item, index) in levels">
									<text>奖品：</text>
									<text v-if="item.type == 1">{{item.prize_name}}，
										<span v-if="item.num_old != null">剩余{{item.num}}个</span>
										<span v-if="item.num_old == null">数量不限</span>
									</text>
									<text v-if="item.type == 2">红包{{item.money_amount}}元，
										<span v-if="item.money_count_old != null">剩余{{item.money_count}}个</span>
										<span v-if="item.money_count_old == null">数量不限</span>
									</text>
								</view>
								<!--								<text v-if="self_success == 1">已兑奖</text>-->
							</view>
						</view>
						<view v-if="is_self == 1 && invitate_num"
						      style="border-radius: 0.5rem;width: 17.87rem;height: 5.2rem;margin: 0.26rem auto 0;border: 1px solid rgba(0, 0, 0, 0.03);box-shadow: 0px 3px 8px 2px rgba(218, 218, 218, 0.17);padding: 0.2rem 0.8rem 0.2rem;box-sizing: border-box;background: #FFF;">
							<view style="text-align: left;border-bottom: 1px solid #F5F5F5;padding-bottom: 0.6rem;">
								<view class="text-span" style="float: left;">
									<image v-if="head_url"
									       style="width: 2.67rem;margin-top: 0.3rem; height: 2.67rem;border-radius: 50%;"
									       :src="head_url"/>
									<image v-if="!head_url"
									       style="width: 2.67rem;margin-top: 0.3rem; height: 2.67rem;border-radius: 50%;"
									       src="/static/useradvart.png"/>
								</view>
								<view class="text-span" style="margin-left: 0.6rem;">
									<text class="text-p" style="font-size: 0.7rem;font-weight: 700;">第
										<text class="red">{{rank}}</text>
										名 | 已有
										<text class="red">{{invitate_num}}</text>
										位好友打Call
									</text>
									<text style="font-size: 0.65rem;color: rgba(0, 0, 0, 0.5);margin-top: 0.2rem"
									      class="text-p">
										再需<span style="color: red;">{{invitate_again_num}}</span>位好友打Call成功
									</text>
								</view>

								<view class="text-span" style="float: right;margin-top: 0.7rem">
									<button class="status-title"
									        v-if="is_self== 1 && success_level == 1 && self_success == 2"
									        @click="gotoAddress">领取
									</button>
									<button v-if="is_self== 1 && success_level == 2"
									        @click="openEmployeeCode" class="status-title">联系客服
									</button>
									<button class="status-title" v-if="self_success == 1">已获奖品</button>
								</view>
							</view>
							<view @click="goList" style="margin: 0.3rem 0 0 !important;background-color: #FFFFFF;">
								<image style="width: 0.7rem;height: 0.6rem;margin-right: 0.3rem;"
								       src="/static/fissionIndex/crown.png"/>
								<text class="red" style="font-size: 0.7rem;font-weight: 600;">戳此查看人气榜单</text>
							</view>
						</view>
						<view style="margin-top: 0.63rem;">
							<image style="height: 1.76rem;width: 98%;" src="/static/fissionIndex/step1.png"/>
						</view>
					</view>
				</view>
			</view>

			<!-- 海报图片 -->
			<image v-if="PosterVisible" :src="url" :style="{height: imgHeight}"
			       style="background-color: transparent;position: absolute;z-index:9999999999999999999; width: 72.38%;transform: translate(-50%, 0);"
			/>

			<!-- 0.94页面 94% 0.77海报 77%   页面海报区域 -->
			<view v-show="!loadding && !canvasing && !PosterVisible" class="back-pic" ref="img">
				<image class="back-pic-img" :style="{height: imgHeight+ ' !important'}"
				       :src="back_pic_url"/>
				<view
						:style="{
					position: 'absolute',
					left: qrcodeStyle.x / 375.0 * windowWidth * 0.94 * 0.77 + windowWidth * 0.1081 + 'px',
					top: qrcodeStyle.y / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					width: qrcodeStyle.w / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					height: qrcodeStyle.w / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					marginTop: '1rem',
					zIndex: '99',
					display:'none'
				}" ref="pageQrcode" id="pageQrcode"></view>
				<text v-if="nick_name && is_nickname == 1" id="nickName"
				      :style="{
			        fontSize: fontSize + 'px',
			        textAlign: align,
			        color: color,
					position: 'absolute',
					left: nickNameLeft+ 'px',
					top: nickNameStyle.y / 375.0 * windowWidth * 0.94 * 0.77 + fontSize + 'px',
					width: nickNameStyle.w / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					minHeight: nickNameStyle.h / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis',
					marginTop: '1rem',
					display:'none'
				}">{{nick_name}}
				</text>
				<image v-if="head_url && is_avatar == 1"

				       :class="shape=='circle'? 'border50': ''"
				       :style="{
					position: 'absolute',
					left: avatarStyle.x / 375.0 * windowWidth * 0.94 * 0.77 + windowWidth * 0.1081 + 'px',
					top: avatarStyle.y / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					width: avatarStyle.w / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					height: avatarStyle.w / 375.0 * windowWidth * 0.94 * 0.77 + 'px',
					marginTop: '1rem',
					display:'none'
				}" :src="head_url"/>
			</view>
			<Footer v-if="is_show_copyright == 1 && !loadding && !canvasing"></Footer>
			<!--生成海报二维码DOM，不展示-->
			<view v-show="!canvasing">
				<div ref="qrcode" id="qrcode"></div>
			</view>
			<!--		<image src="/static/fissionIndex/3.png"></image>-->
		</view>
		<template v-if="(join_type != 0 || help_type != 0) && !loadding && !canvasing && status == 5">
			<template v-if="is_self == 1">
				<view
						style="width: 100%;position: fixed; z-index: 99999; bottom: 0;height: 3rem;font-size: 0.853rem  /* 16/18.75 */; background-color: #FFF;color: white;line-height: 2rem;"
						v-if="join_type == 1" @click="joinActivity(0)">
					<view style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						我要参与
					</view>
				</view>
				<a
						style="width: 100%;position: fixed; z-index: 99999; bottom: 0;height: 3rem;font-size: 0.853rem  /* 16/18.75 */; background-color: #FFF;color: white;line-height: 2rem;"
						v-if="join_type == 2" :href="my_url">
					<view style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						进入我的
					</view>
				</a>
				<view
						style="width: 100%;position: fixed; z-index: 99999; bottom: 0;height: 3rem;font-size: 0.853rem  /* 16/18.75 */; background-color: #FFF;color: white;line-height: 2rem;"
						@click="createPoster" v-if="join_type == 3">
					<view style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						生成海报
					</view>
				</view>
			</template>
			<template v-if="is_self != 1">
				<view
						style="width: 100%;position: fixed; z-index: 99999; bottom: 0;height: 3rem;font-size: 0.853rem  /* 16/18.75 */; background-color: #FFF;color: white;line-height: 2rem;"
						v-if="join_type == 0 || help_type == 0">
					<view v-if="help_type == 1" @click="joinActivity(1)"
					      style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						帮TA打Call
					</view>
					<view v-if="help_type == 2" @click="createPoster"
					      style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						帮TA打Call
					</view>
					<view v-if="join_type == 1" @click="joinActivity(0)"
					      style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						我要参与
					</view>
					<a :href="my_url" v-if="join_type == 2"
					   style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">进入我的</a>
					<view @click="createPoster" v-if="join_type == 3"
					      style="background-color: #F1301E;width: 40%;border-radius: 30px;height: 2rem;margin: 0.5rem auto;">
						生成海报
					</view>
				</view>
				<view v-else
				      style="width: 100%;position: fixed; z-index: 99999; bottom: 0;height: 3rem;font-size: 0.853rem  /* 16/18.75 */; background-color: #FFF;color: white;line-height: 2rem;">
					<view v-if="join_type == 1"
					      style="background-color: #FF6667;width: 40%;float: left;height: 2rem;line-height: 2rem;margin: 0.5rem 2% 0.5rem 8%;border-radius: 1.6rem  /* 30/18.75 */;"
					      @click="joinActivity(0)">我要参与
					</view>
					<a :href="my_url" v-if="join_type == 2"
					   style="background-color: #F1301E;width: 40%;float: left;height: 2rem;line-height: 2rem;margin: 0.5rem 2% 0.5rem 8%;border-radius: 1.6rem  /* 30/18.75 */;">进入我的</a>
					<view v-if="join_type == 3"
					      style="background-color: #FF6667;width: 40%;float: left;height: 2rem;line-height: 2rem;margin: 0.5rem 2% 0.5rem 8%;border-radius: 1.6rem  /* 30/18.75 */;"
					      @click="createPoster">生成海报
					</view>
					<view v-if="help_type == 1"
					      style="background-color: #F1301E;width: 40%;height: 2rem;line-height: 2rem;margin: 0.5rem 8% 0.5rem 2%;float: left;border-radius: 1.6rem  /* 30/18.75 */;"
					      @click="joinActivity(1)">帮TA打Call
					</view>
					<view v-if="help_type == 2"
					      style="background-color: #F1301E;width: 40%;height: 2rem;line-height: 2rem;margin: 0.5rem 8% 0.5rem 2%;float: left;border-radius: 1.6rem  /* 30/18.75 */;"
					      @click="createPoster">帮TA打Call
					</view>
				</view>
			</template>
		</template>
		<view class="content-msg"
		      style="position: fixed;bottom: 0;z-index:9999999999999999999;"
		      v-if="PosterVisible">
			长按保存图片
		</view>
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
		<!--二维码弹窗-->
		<uni-popup ref="codePop" type="center">
			<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -11.2rem  /* -210/18.75 */;"
			           color="#bfbabd" @click="closeCodePop"></uni-icons>
			<img :src="codeUrl" alt="" style="width: 50%;margin-top: -6.933rem  /* -130/18.75 */;">
			<p style="position: absolute;left: 2.987rem  /* 56/18.75 */;top: 4.8rem  /* 90/18.75 */;width: 13.973rem  /* 262/18.75 */;color: #FFF;word-wrap:break-word;">
				参与活动，请先添加企业成员为好友</p>
			<p style="position: absolute;left: 2.987rem  /* 56/18.75 */;top: 8.267rem  /* 155/18.75 */;width: 13.973rem  /* 262/18.75 */;word-wrap:break-word;color: yellow;font-size: 0.693rem  /* 13/18.75 */;line-height: 1.173rem  /* 22/18.75 */;">*若您已添加员工企微后，依然弹出二维码情况时，可以尝试点击刷新，即可正常参与。<uni-icons type="reload" size="15" color="yellow" @click="reloadPage"></uni-icons></p>
		</uni-popup>
	</view>
</template>

<script>
	import QRCode from 'qrcodejs2'
	import Footer from "../../components/footer/footer.vue";

	export default {
		name   : "index",
		inject : ['initPage','getCopyright'],
		components  : {Footer},
		data () {
			return {
				addressUrl        : '',
				canvasing         : '',
				windowUrl         : '', //授权url
				wx                : false,
				wxWork            : false,
				loadding          : true,
				is_self           : 1,//是不是自己进入
				activity_id       : '',
				fans_id           : 0,
				is_help           : 0,
				help_name         : '',
				nickNameLeft      : '',
				// code: '',
				is_parent         : 1, // 1有上级 0无上级
				openid            : '',
				levels            : [],
				tier              : 0,
				success_level     : 0,
				success_url       : '',
				self_success      : 0,
				fid               : '',
				day               : '00', // 天数
				hour              : '00', // 小时
				minutes           : '00', // 分
				seconds           : '00', // 秒
				join_status       : 0, // 按钮状态
				complete_num      : '0', // 领取人数
				fission_num       : '0', // 需要邀请人数
				prize_name        : '', // 奖品名称
				rank              : '1', // 排名
				invitate_num      : '0', // 已邀请人数
				invitate_again_num: '0', // 还需人数
				status            : '', // 任务状态,2进行中
				back_pic_url      : '', // 背景图
				qrcode_url        : '', // 二维码链接
				qrcodeStyle       : {}, // 二维码样式
				is_nickname       : 0,  // 昵称是否展示
				nick_name         : '', // 昵称
				fontSize          : '14', // 昵称文字大小
				align             : 'left',
				nickNameStyle     : {},  // 昵称样式
				is_avatar         : 0, // 头像是否展示
				head_url          : '', // 头像
				shareData         : {}, // 分享链接
				shape             : "", // 头像圆形  正方形
				avatarStyle       : {}, // 头像样式
				time              : 0, // 倒计时计数值
				windowWidth       : 1200,
				imgHeight         : '',
				fissionListUrl    : '',
				url               : '', // 海报url
				endDialog         : false,
				succsessDialog    : false,
				ticketData        : [],
				agentData         : [],
				jsApiList         : [],
				paddingTop        : {
					paddingTop: ''
				},//loading组件的高度
				PosterVisible     : false,
				base64Data        : '',
				h5Url             : '',
				title             : '',
				creatingPoster    : false,
				join_type         : 0,// 0、隐藏，1、我要参与，2、进入我的，3、生成海报
				my_url            : '',//进入我的地址
				help_type         : 0,//0、隐藏，1、帮他助力，2、帮他分享
				area_type         : 1,//1、不限制，2、部分地区
				external_id       : '',//外部联系人id
				help_head_url     : '',//助力者头像
				lat               : '',//纬度
				lng               : '',//经度
				err_msg           : '',//提示弹窗的文案
				codeUrl           : '',//二维码弹窗
				is_refresh        : 0,//是否刷新页面,0不刷，1刷新
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		methods: {
			gotoAddress () {
				window.location.href = this.addressUrl
			},
			// 点击生成海报
			createPoster () {
				this.poster()
			},
			// 生成海报
			poster () {
				let that = this
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.canvasing = true
				if (!this.creatingPoster) {
					this.creatingPoster = true
					let canvas = document.createElement('canvas')
					let ctx = canvas.getContext('2d')
					let that = this
					let devicePixelRatio = window.devicePixelRatio
					let image = new Image()
					image.setAttribute('crossOrigin', 'anonymous')
					image.src = this.back_pic_url
					image.onload = () => {
						canvas.width = that.windowWidth * 0.7238 * devicePixelRatio
						canvas.height = that.windowWidth * 0.7238 * image.height / image.width * devicePixelRatio
						ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
						if (that.is_nickname == 1) {
							ctx.globalCompositeOperation = "source-over";
							let view = document.getElementById('nickName')
							let x = (that.nickNameStyle.x / 375 * that.windowWidth * 0.7238) * devicePixelRatio
							let y = (that.nickNameStyle.y / 375 * that.windowWidth * 0.7238 + that.nickNameStyle.h / 375 * that.windowWidth * 0.7238 / 1.5) * devicePixelRatio
							let wi = view !== null ? view.style.width : 0
							let w = wi ? parseInt(wi.substring(0, wi.length - 2)) * devicePixelRatio : 0
							ctx.fillStyle = that.color
							ctx.font = that.fontSize * devicePixelRatio + "px 'Avenir',Helvetica,Arial,sans-serif";
							if (x < 0) {
								x = 0
							}
							ctx.textAlign = 'left'
							ctx.fillText(that.nick_name, x, y);
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
										let left = that.avatarStyle.x / 375.0 * canvas.width
										let top = that.avatarStyle.y / 375.0 * canvas.width
										let minWidth = that.avatarStyle.w / 375.0 * canvas.width
										ctx.drawImage(avatar, left, top, minWidth, minWidth)
										that.addQrcode(ctx, canvas, devicePixelRatio)
									}
								} else {
									ctx.globalCompositeOperation = "source-over";
									let left = that.avatarStyle.x / 375.0 * canvas.width
									let top = that.avatarStyle.y / 375.0 * canvas.width
									let width = that.avatarStyle.w / 375.0 * canvas.width
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
				new QRCode(that.$refs.qrcode, {
					text        : that.h5Url,
					width       : parseInt((that.qrcodeStyle.w / 375.0 * canvas.width).toString()),
					height      : parseInt((that.qrcodeStyle.w / 375.0 * canvas.width).toString()),
					colorDark   : "#000000",
					colorLight  : "#FFFFFF",
					correctLevel: QRCode.CorrectLevel.H
				})
				let qrCode = new Image()
				let flag = setInterval(function () {
					if (document.getElementById('qrcode').getElementsByTagName('img').length > 0) {
						qrCode.src = document.getElementById('qrcode').getElementsByTagName('img')[0].getAttribute("src")
						if (qrCode.src && qrCode !== null) {
							clearInterval(flag)
							qrCode.setAttribute('crossOrigin', 'anonymous')
							qrCode.onload = () => {
								ctx.globalCompositeOperation = "source-over";
								let left = that.qrcodeStyle.x / 375.0 * canvas.width
								let top = that.qrcodeStyle.y / 375.0 * canvas.width
								let width = that.qrcodeStyle.w / 375.0 * canvas.width
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
								let left = that.qrcodeStyle.x / 375.0 * canvas.width
								let top = that.qrcodeStyle.y / 375.0 * canvas.width
								let width = that.qrcodeStyle.w / 375.0 * canvas.width
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
				this.url = canvas.toDataURL("image/png");
				this.PosterVisible = true
				this.creatingPoster = false
				this.canvasing = false
				setTimeout(() => {
					uni.hideLoading();
				}, 1000)
			},
			//页面显示的二维码
			showQrcode () {
				let that = this
				let qrcode = new QRCode('pageQrcode', {
					text      : that.h5Url,
					width     : that.qrcodeStyle.w / 375.0 * that.windowWidth * 0.7238,
					height    : that.qrcodeStyle.w / 375.0 * that.windowWidth * 0.7238,
					colorDark : "#000000",
					colorLight: "#FFFFFF"
				})
			},
			// // 初始化页面
			initPageNew () {
				let that = this
				uni.getSystemInfo({
					success: function (res) { // res - 各种参数
						that.windowWidth = res.windowWidth > 1200 ? 1200 : res.windowWidth // 屏幕的宽度
					}
				});
				this.getData()
				// this.getData()
			},
			// // 跳转微信
			// goWx () {
			// 	let CORPID = this.getParameter('suite_id') !== null ? this.getParameter('suite_id') : this.getParameter('corpid')
			// 	let code = this.getParameter('code')
			// 	let state = this.getParameter('state')
			// 	this.windowUrl = this.windowUrl.replace('&code=' + code, '')
			// 	this.windowUrl = this.windowUrl.replace('?code=' + code + "&", '?')
			// 	this.windowUrl = this.windowUrl.replace('?code=' + code, '?')
			// 	this.windowUrl = this.windowUrl.replace('&state=' + state, '')
			// 	this.windowUrl = this.windowUrl.replace('?state=' + state + "&", '?')
			// 	this.windowUrl = this.windowUrl.replace('?state=' + state, '?')
			// 	let REDIRECT_URI = encodeURIComponent(this.windowUrl)
			// 	let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + CORPID + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
			// 	window.location.href = url
			// },
			// 点击遮罩
			clickShade () {
				this.endDialog = false
				this.PosterVisible = false
			},
			// 打call弹窗
			isHelp () {
				this.$refs['helpDialog'].close()
			},
			isTicket () {
				this.$refs['ticketDialog'].close()
			},
			//监听打call弹窗的显示与隐藏
			openHelpDialog (e) {
				if (!e.show && this.is_refresh == 1) {
					this.getData()
				}
			},
			// 活动结束
			endHelp () {
				this.endDialog = false
			},
			goList () {
				uni.navigateTo(
					{
						url: this.fissionListUrl
					}
				)
			},
			openEmployeeCode () {
				this.$refs['ticketDialog'].open()
			},
			// 任务完成
			successKnow () {
				this.succsessDialog = false
			},
			// 获取数据
			async getData (external_id = (this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('external_int_id'))) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				let that = this
				let corp_id = this.getParameter('corp_id')
				let corpid = this.getParameter('corpid')
				let agent_id = this.getParameter('agent_id')
				let assist = this.getParameter('assist')
				let deviceCode = this.$cookies.get(this.$store.state.authKey)
				// let corp_id = '1'
				// let agent_id = '5'
				// let assist = 'fission_98_0'
				// let code = ""
				const {data: res} = await this.axios.post("chat-message/activity-help", {
					corp_id    : corp_id,
					agent_id   : agent_id,
					code       : deviceCode,
					assist     : assist,
					external_id: external_id
					// external_id: 3469
				});
				if (res.error != 0) {
					this.limit(1)
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.status = res.data.is_over
					if (this.status == 1) {
						uni.navigateTo({
							url: "/pages/marketFission/preview?agent_id=" + agent_id + "&corp_id=" + corp_id + "&assist=" + assist
						});
						return false
					}
					if (res.data.activity_num != 0) {
						window.location.href = res.data.my_url
						uni.hideLoading();
						return false
					}
					this.shareData = res.data.shareData
					this.limit(res.data.is_forbid)
					this.title = res.data.title
					this.openid = res.data.openid
					localStorage.setItem('openid', this.openid)
					this.levels = res.data.level
					this.tier = res.data.tier
					this.success_level = res.data.success_level
					this.success_url = res.data.success_url
					this.self_success = res.data.self_success
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
										openid    : localStorage.getItem('openid') != null ? localStorage.getItem('openid') : '',
										bindType  : 3,
									}
								})
							)
						}
					}, 300)
					this.activity_id = res.data.activity_id
					this.addressUrl = 'address?activity=' + this.activity_id + "&corp_id=" + this.getParameter('corp_id') + "&corpid=" + this.getParameter('corpid') + "&agent_id=" + this.getParameter('agent_id') + "&assist=" + this.getParameter('assist') + '&type=' + 2
					this.fans_id = res.data.fans_id
					this.parent_id = res.data.parent_id
					document.title = res.data.title
					this.h5Url = res.data.h5Url
					this.base64Data = res.data.base64Data
					this.is_self = res.data.is_self
					this.new_self = res.data.new_self
					this.is_parent = res.data.is_parent
					this.is_help = res.data.is_help
					if ((this.is_help == 1 || this.is_help == 2) && res.data.is_remind != 1) {
						this.is_refresh = 0
						this.$refs['helpDialog'].open()
					}
					if (this.is_self == 1 && res.data.is_remind == 1) {
						this.succsessDialog = true
					}
					if (res.data.help_tip && res.data.help_tip != '') {
						this.err_msg = res.data.help_tip
						this.$refs['errorPop'].open()
					}
					this.join_type = res.data.join_type
					this.my_url = res.data.my_url
					this.help_type = res.data.help_type
					this.area_type = res.data.area_type
					this.external_id = res.data.external_id
					this.help_head_url = res.data.help_head_url

					this.help_name = res.data.help_name
					this.fissionListUrl = "/pages/marketFission/list?activity_id=" + this.activity_id + "&title=" + encodeURIComponent(this.title) + '&fans_id=' + this.fans_id
					this.day = res.data.timeData.day
					this.hour = res.data.timeData.hour
					this.minutes = res.data.timeData.minutes
					this.seconds = res.data.timeData.seconds
					this.timing()
					this.complete_num = res.data.complete_num
					this.fission_num = res.data.fission_num
					this.prize_name = res.data.prizeName
					this.rank = res.data.ranking
					this.invitate_num = res.data.invitate_num
					this.invitate_again_num = res.data.rest_num
					this.join_status = res.data.join_status
					if (this.status != 5 && this.is_help != 1 && this.join_status != 1 && !(this.is_self == 1 && this.success_level == 1 && this.self_success == 2 && !(this.is_self == 1 && this.success_level == 2)) && !this.self_success == 1) {
						this.endDialog = true
					}
					this.qrcode_url = res.data.qr_code
					this.qrcodeStyle = res.data.picRule.qrCode
					this.nickNameStyle = res.data.picRule.nickName
					this.is_nickname = res.data.picRule.is_nickname
					let color = res.data.picRule.color.split(',')
					this.color = '#'
					for (let i = 0; i < color.length; i++) {
						this.color += parseInt(color[i]).toString(16)
					}
					this.nick_name = res.data.nick_name
					this.align = res.data.picRule.align
					this.fontSize = res.data.picRule.font_size
					this.is_avatar = res.data.picRule.is_avatar
					this.head_url = res.data.head_url
					this.shape = res.data.picRule.shape
					this.avatarStyle = res.data.picRule.avatar
					this.back_pic_url = res.data.picRule.back_pic_url
					let img = new Image()
					img.src = this.back_pic_url
					img.onload = function () {
						that.imgHeight = that.windowWidth * 0.94 * 0.77 / img.width * img.height + 'px'
						let left = that.nickNameStyle.x / 375.0 * that.windowWidth * 0.94 * 0.77
						that.loadding = false
						uni.hideLoading();
						that.$nextTick(() => {
							let minWidth = document.getElementById('nickName').style.width
							let width = parseInt(minWidth.substring(0, minWidth.length - 2)) / 375.0 * that.windowWidth * 0.94 * 0.77
							let maxWidth = that.windowWidth * 0.94 * 0.77
							if (width + left > maxWidth) {
								that.nickNameLeft = that.windowWidth * 0.94 * 0.77 - width + that.windowWidth * 0.1081
							} else {
								that.nickNameLeft = that.nickNameStyle.x / 375.0 * that.windowWidth * 0.94 * 0.77 + that.windowWidth * 0.1081
							}
						})
					}
					this.showQrcode()
				}
			},
			timing () {
				let that = this
				that.time = setInterval(function () {
					let day = parseInt(that.day)
					let hour = parseInt(that.hour)
					let minutes = parseInt(that.minutes)
					let seconds = parseInt(that.seconds)
					if (seconds == 0) {
						if (minutes == 0) {
							if (hour == 0) {
								if (day == 0) {
									that.status = 3
									clearInterval(that.time)
								} else {
									day = day - 1
									hour = 23
									minutes = 59
									seconds = 59
								}
							} else {
								hour = hour - 1
								minutes = 59
								seconds = 59
							}
						} else {
							minutes = minutes - 1
							seconds = 59
						}
					} else {
						seconds = seconds - 1
					}
					that.seconds = that.formatter(seconds)
					that.minutes = that.formatter(minutes)
					that.hour = that.formatter(hour)
					that.day = day
				}, 1000)
			},
			formatter (value) {
				if (value < 10) {
					return "0" + value
				}
				return value
			},
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null) {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
			async limit (is_forbid) {
				let that = this
				this.url = window.location.href
				let agent_id = this.getParameter("agent_id")
				localStorage.setItem('agent_id', agent_id)
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
								uni.showToast({
									title   : "请在微信中打开",
									image   : '/static/fail.png',
									duration: 2000
								});
								return false
							}
						} else if (typeof res.errMsg !== "undefined" && res.errMsg.indexOf("invalid corpid") != -1) {
							uni.showToast({
								title   : "请在微信中打开",
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						}
						uni.showToast({
							title   : "初始化失败，请刷新重试",
							image   : '/static/fail.png',
							duration: 2000
						});
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
									uni.showToast({
										title   : "分享成功",
										icon    : 'success',
										duration: 2000
									});
								},
								fail    : function () {
									uni.showToast({
										title   : "分享失败",
										image   : '/static/fail.png',
										duration: 2000
									});
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
											uni.showToast({
												title   : "分享成功",
												icon    : 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : "分享失败",
												image   : '/static/fail.png',
												duration: 2000
											});
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
											uni.showToast({
												title   : "分享成功",
												icon    : 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : "分享失败",
												image   : '/static/fail.png',
												duration: 2000
											});
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
											uni.showToast({
												title   : "分享成功",
												icon    : 'success',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : "分享失败",
												image   : '/static/fail.png',
												duration: 2000
											});
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
			refresh(){
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			//我要参与、帮他助力
			joinActivity (val) {
				//有区域限制，需要获取地址
				if (this.area_type == 2) {
					this.getLocation(val)
				} else if (this.area_type == 1) {
					this.joinActivity2(val)
				}
				// this.joinActivity2(val)
			},
			async joinActivity2 (val) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("chat-message/activity-call", {
					type       : val,
					uid        : localStorage.getItem('uid'),
					activity_id: this.activity_id,
					parent_id  : this.parent_id,
					openid     : this.openid,
					fans_id    : this.fans_id,
					tier       : this.tier,
					external_id: this.external_id,
					lat        : this.lat,//经度
					lng        : this.lng,//纬度
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					if (res.data.err_msg == '') {
						if (res.data.open_type == 0) {
							//二维码
							this.codeUrl = res.data.qr_code
							let that = this
							let img = new Image()
							img.src = this.codeUrl
							img.onload = function () {
								that.$refs['codePop'].open()
							}
						} else if (res.data.open_type == 1) {
							//我也要参与
							uni.showToast({
								title   : "参与成功",
								icon    : 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.getData(this.external_id)
							}, 1500)
						} else if (res.data.open_type == 2) {
							//帮TA助力
							this.is_help = res.data.is_help
							this.help_name = res.data.help_name
							this.help_head_url = res.data.help_head_url
							this.nick_name = res.data.nick_name
							this.is_refresh = res.data.is_refresh
							let that = this
							let img = new Image()
							img.src = this.help_head_url
							img.onload = function () {
								that.$refs['helpDialog'].open()
							}
						}
					} else {
						this.err_msg = res.data.err_msg
						this.$refs['errorPop'].open()
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
						that.joinActivity2(val)
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
			//关闭二维码弹窗
			closeCodePop () {
				this.$refs['codePop'].close()
			},
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'activity' && typeof data.has_chat != 'undefined' && data.has_chat) {
					this.ws.setCallback()
					if (localStorage.getItem(this.getParameter('code'))) {
						localStorage.removeItem(this.getParameter('code'))
					}
					this.$refs.codePop.close()
					this.initPage(this.getData())
				}
			},
			fun () {
				this.$router.go(-4)
			},
			reloadPage(){
				this.$refs.codePop.close()
				this.initPage(this.getData())
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

			//loading组件的paddingTop的距离
			let height = window.innerHeight
			let paddingTop = (height - 40) / 2
			this.paddingTop.paddingTop = parseInt(paddingTop) + 'px'

			document.body.style.backgroundColor = "#F5F5F5";
			let that = this

			this.$store.dispatch('setWx', () => {
				that.initPage(that.initPageNew)
			})
		}

	}
</script>

<style scoped>
	a {
		color: #FFF;
		display: block;
	}

	.fission-head {
		margin-top: 0.63rem !important;
	}

	.fission {
		width: 100%;
		max-width: 1200px;
		font-size: 0.8rem;
		/*height: 11.01rem;*/
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
		max-width: 1200px;
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

	.status-title1 {
		height: 1.3rem;
		font-size: 0.7rem;
		background-color: #F5F5F5;
		color: #C3C3C3;
		line-height: 1.4rem;
	}

	.status-title2 {
		height: 1.3rem;
		font-size: 0.7rem;
		color: #1890FF;
		line-height: 1.4rem;
	}

	.status-title1:after {
		border: 1px solid #F5F5F5;
	}

	.status-title2:after {
		border: 1px solid #1890FF;
	}

	.receive-num {
		font-size: 0.65rem;
		color: #C3C3C3;
		margin-top: 0.64rem;
	}

	.back-pic-img {
		width: 77% !important;
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
		width: 94%;
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		height: 1.2rem;
		font-size: 0.8rem;
	}

	.errorPop {
		width: 16rem /* 300/18.75 */;
		height: 17.067rem /* 320/18.75 */;
		background: #FFF;
		box-shadow: 0px 9px 25px 8px rgba(208, 6, 40, 0.61);
		border-radius: 5px;
		margin: auto;
	}

	.errorPop-btn {
		width: 240px;
		height: 45px;
		background-color: #E73424;
		border-radius: 8px;
		color: #FFF;
		margin-top: 1.44rem /* 27/18.75 */;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
	}

	.action-btn {
		margin: 0 10px;
		display: inline-block;
		cursor: pointer;
		color: #1890FF;
		height: 2.773rem /* 52/18.75 */;
		line-height: 2.773rem /* 52/18.75 */;
		vertical-align: top;
		float: right;
	}

	.action-btn /deep/ uni-button:after {
		border: 1px solid #1890FF;
	}

	.content-msg1 {
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

	.mTop {
		margin-top: 2.6rem;;
	}
</style>