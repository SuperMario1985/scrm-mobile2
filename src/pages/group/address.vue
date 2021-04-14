<template>
	<view class="fission-page">
		<img src="../../static/marketFission/back_pig.png" style="width: 100%;"/>
		<view style="position: absolute;top: 0;">
			<view class="title">
				<img src="../../static/marketFission/titleLeft.png"/>
				<text class="title-name">请填写收货地址</text>
				<img src="../../static/marketFission/titleRight.png"/>
			</view>
			<view style="width: calc(100% - 1.6rem  /* 30/18.75 */);margin : 0 auto; background-color: #FFFFFF;border-radius: 0.533rem  /* 10/18.75 */ 0.533rem  /* 10/18.75 */ 0 0;">
				<view style="height: 1.493rem  /* 28/18.75 */;background: #BE0000;border-radius: 0.533rem  /* 10/18.75 */;"></view>
				<view style="width: 100%; margin: 0 auto; background-color: #FFFFFF;border-radius: 0.533rem  /* 10/18.75 */ 0.533rem  /* 10/18.75 */ 0 0;">
					<view style="height: 1.067rem  /* 20/18.75 */;background: #BE0000;opacity: 0.34;border-radius: 0.533rem  /* 10/18.75 */ 0.533rem  /* 10/18.75 */ 0 0;margin-top: -1.067rem  /* -20/18.75 */;"></view>
				</view>
			</view>
			<view class="info">
				<text style="display: inline-block; text-align: left; width: calc(100% - 2.133rem  /* 40/18.75 */);font-size: 0.587rem  /* 11/18.75 */;font-weight: 500;color: #606E80;line-height: 0.96rem  /* 18/18.75 */;margin-top: 0.853rem;">
					如因信息填写错误导致未能收货，责任自负。提交前，请确认您的提交的信息是否正确，提交后则不可修改
				</text>
				<view class="row" v-if="info.indexOf(1) > -1">
					<input class="input" type="text" v-model="name" placeholder="请输入姓名"
					       placeholder-class="placeholder" maxlength="32"/>
				</view>
				<view class="row" v-if="info.indexOf(2) > -1">
					<input class="input" type="text" @input="changeSpecialInput($event)" v-model="mobile"
					       placeholder="请输入手机号"
					       placeholder-class="placeholder"/>
				</view>
				<view class="row" style="height: auto;" v-if="info.indexOf(3) > -1">
					<text class="input area normal" v-if="region == ''" @click="openAddress">所在地区</text>
					<text class="input area" v-else @click="openAddress">{{region}}-{{city}}-{{county}}</text>
					<simpleAddress ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault"
					               @onConfirm="onConfirm"
					               themeColor="#01B065"></simpleAddress>
				</view>
				<view class="row" v-if="info.indexOf(3) > -1">
					<input class="input" type="text" v-model="detail" placeholder="请输入详细地址"
					       placeholder-class="placeholder"/>
				</view>
				<view class="row" v-if="info.indexOf(4) > -1">
					<input class="input" type="text" v-model="remark" placeholder="请输入备注"
					       placeholder-class="placeholder"/>
				</view>

				<button class="add-btn" @click="confirm">立即提交</button>
			</view>
			<Footer v-if="is_show_copyright == 1" style="background: #de191e;"></Footer>
		</view>
	</view>
</template>

<script>
	import simpleAddress from '@/components/simple-address/simple-address.vue'
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : "ticket",
		data () {
			return {
				wx                    : false,
				wxWork                : false,
				jsApiList             : [],
				openId                : '',
				info                  : [1, 2, 3, 4],
				statrTime             : '',
				endTime               : '',
				fans_id               : '',
				name                  : '',
				mobile                : '',
				region                : '',
				city                  : '',
				county                : '',
				detail                : '',
				remark                : '',
				cityPickerValueDefault: [0, 0, 1],
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		inject    : ['initPage', 'getParameter'],
		onLoad () {
			document.title = '我的收货地址'
		},
		onShow () {
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
			this.getData()
		},
		components: {
			simpleAddress,
			Footer
		},
		methods   : {
			changeSpecialInput (e) {
				let phoneReg = /[^+|-|\d]/
				let f = phoneReg.test(e.target.value)
				if (phoneReg.test(e.target.value)) {
					this.$nextTick(() => {
						this.mobile = this.mobile.substring(0, this.mobile.length - 1)
					})
				}
			},
			//获取之前填过的信息
			async getData () {
				const {data: res} = await this.axios.post("wap-clock-activity/get-address", {
					assist         : this.getParameter('assist') ? this.getParameter('assist') : '',
					external_userid: localStorage.getItem('external_id') || localStorage.getItem('externalId'),
					openid         : localStorage.getItem('openid'),
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.name = res.data.name
					this.mobile = res.data.mobile
					this.region = res.data.region
					this.city = res.data.city
					this.county = res.data.county
					this.detail = res.data.detail
					this.remark = res.data.remark
				}
			},
			//提交
			async confirm () {
				let phoneReg = /[^+|-|\d]/
				if (this.info.indexOf(1) > -1 && this.name.trim() == '') {
					// uni.hideLoading();
					uni.showToast({
						title   : '请填写姓名！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				} else if (this.info.indexOf(3) > -1 && (this.region.trim() == '' || this.city.trim() == '' || this.county.trim() == '' || this.detail.trim() == '')) {
					uni.hideLoading();
					uni.showToast({
						title   : '请检查地址',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.info.indexOf(2) > -1) {
					if (this.mobile.trim() == '') {
						uni.hideLoading();
						uni.showToast({
							title   : '请填写手机号',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false
					}
					if (phoneReg.test(this.mobile.trim())) {
						uni.hideLoading();
						uni.showToast({
							title   : '请检查手机号',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false
					}
				}
				const {data: res} = await this.axios.post("wap-clock-activity/sub-address", {
					assist         : this.getParameter('assist') ? this.getParameter('assist') : '',
					external_userid: localStorage.getItem('external_id') || localStorage.getItem('externalId'),
					openid         : localStorage.getItem('openid'),
					name           : this.name,
					mobile         : this.mobile,
					region         : this.region,
					city           : this.city,
					county         : this.county,
					detail         : this.detail,
					remark         : this.remark
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.showToast({
						title   : '兑奖地址填写成功',
						duration: 2000
					});
					setTimeout(function () {
						uni.navigateBack()
					}, 2000);
				}
			},
			onConfirm (e) {
				if (e.labelArr.length > 2) {
					this.region = e.labelArr[0]
					this.city = e.labelArr[1]
					this.county = e.labelArr[2]
				}
			},
			openAddress () {
				this.$refs.simpleAddress.open();
			},
		}
	}
</script>

<style scoped lang="less">
	.fission-page {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		overflow-y: auto;
		/*background-image: url('../../static/marketFission/back_pig.png');*/
		/*background-size: 100% 100%;*/
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-position: center;
	}

	.title {
		width: 100%;
		height: 1.067rem /* 20/18.75 */;
		line-height: 1.067rem /* 20/18.75 */;
		margin: 10.773rem /* 202/18.75 */ 0 0.853rem /* 16/18.75 */ 0;

		img {
			width: 3.307rem /* 62/18.75 */;
			height: 0.533rem /* 10/18.75 */;
			margin: 0.267rem /* 5/18.75 */ 0;
		}

		.title-name {
			font-size: 1.067rem /* 20/18.75 */;
			margin: 0 0.533rem /* 10/18.75 */ 0 0.533rem /* 10/18.75 */;
			font-weight: 800;
			color: #FFD86C;
			background: linear-gradient(176deg, #FFC486 0%, #FFF3E8 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}

	.info {
		height: 23.52rem /* 441/18.75 */;
		margin: 0 auto;
		width: calc(100% - 1.6rem /* 30/18.75 */);
		background-color: #FFFFFF;
	}

	.row {
		border: 1px solid;
		margin: 0 auto;
		margin-top: 0.853rem /* 16/18.75 */;
		width: calc(100% - 2.88rem /* 54/18.75 */);
		height: 2.24rem /* 42/18.75 */;
		border: 1px solid #D8D8D8;
		background-color: #FFFFFF;
		border-radius: 1.12rem /* 21/18.75 */;
		text-align: center;

		.tit {
			font-size: 0.853rem /* 16/18.75 */;
			vertical-align: top;
			height: 1.6rem /* 30/18.75 */;
			line-height: 1.6rem /* 30/18.75 */;
			text-align: right;
			display: inline-block;
			width: 4.8rem /* 90/18.75 */;
		}

		.input {
			font-size: 0.747rem /* 14/18.75 */;
			margin-left: 0.533rem /* 10/18.75 */;
			display: inline-block;
			width: calc(100% - 20px);
			height: 100%;
			text-align: left;

		}

		.uni-input-placeholder {
			color: #BABABA;
		}

		.area {
			margin: 0.64rem /* 12/18.75 */ 0;
		}

		.normal {
			color: #BABABA;
		}
	}

	.add-btn {
		width: 14.933rem /* 280/18.75 */;
		font-size: 0.96rem /* 18/18.75 */;
		height: 2.293rem /* 43/18.75 */;
		line-height: 2.293rem /* 43/18.75 */;
		margin: 0px auto;
		margin-top: 1.227rem /* 23/18.75 */;
		margin-bottom: 1.28rem /* 24/18.75 */;
		background: linear-gradient(90deg, #FD5656, #FD7060);
		color: #FFF;
		border-radius: 1.173rem /* 22/18.75 */;
	}
</style>