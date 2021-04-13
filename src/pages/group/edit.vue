<template>
	<view class="box" v-if="isReady">
		<uni-nav-bar left-icon="back" title="修改群画像" @clickLeft="back">
			<button type="primary" class="custom-tabs-button" @click="submit" slot="right">提交</button>
		</uni-nav-bar>
		<!--		退出确认弹窗-->
		<uni-popup ref="visible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">保存本次编辑?</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="unSave">不保存</text>
					<text class="uni-tip-button" @click="submit">保存</text>
				</view>
			</view>
		</uni-popup>
		<view class="custom-tabs-content content_head">
			<view class="custom-tabs-list">
				<view style="padding: 0px 0 0.8rem;">
					<template v-for="(item,index) in list">
						<view class="list">
							<text class="list-title">{{item.title}}</text>
							<!--输入框-->
							<input class="list-content" :placeholder="'请输入'+item.title"
							       v-model="item.value"
							       v-if="item.type != 2 && item.type != 3 && item.type != 7 && item.type != 4 && item.type != 8 && item.key != 'phone' && item.key != 'company'"/>
							<!--手机号-->
							<template v-if="item.key == 'phone'">
								<div v-for="(phoneNum,phoneIndex) in phone" class="phone-line">
									<input class="list-content2" placeholder="请输入手机号" :value="phoneNum"
									       @input="changeSpecialInput($event,item.key,phoneIndex)"/>
									<uni-icons type="close" color="#c5c5c5" style="font-size: 0.907rem  /* 17/18.75 */;"
									           @click="deletePhone(phoneIndex)"
									           v-if="phoneIndex != phone.length-1"></uni-icons>
								</div>
							</template>
							<!--公司-->
							<template v-if="item.key == 'company'">
								<input class="list-content" placeholder="请输入公司" v-model="item.value"/>
							</template>
							<!--图片-->
							<view v-if="item.type == 8" class="list-content">
								<view v-for="(img, imgIndex) in item.value" class="img">
									<image :src="commonUrl + img.url" @click="preview(index, imgIndex)"
									       class="img2"></image>
									<uni-icons type="close" size="20"
									           style="position: absolute;right: 0;top: 0.267rem  /* 5/18.75 */;"
									           color="#1890FF" @click="deleteImg(index, imgIndex)"></uni-icons>
								</view>
								<view class="uni-hello-addfile demo" style="cursor:pointer;float: left;" @click="chooseImage(index)">
									<text style="margin: 0.533rem 0; display: inline-block;font-size: 1.493rem  /* 28/18.75 */;">
										+
									</text>
									<view style="margin-top: 0.267rem  /* 5/18.75 */;">上传</view>
								</view>
							</view>
							<!--单选-->
							<picker @change="changeOneSelect($event,index)" :value="item.optionValIndex"
							        :range="item.optionVal2"
							        class="list-content">
								<view v-if="item.type == 2">
									<view class="choose-status placeholder-style" v-if="item.optionValIndex == -1">
										请选择{{item.title}}
									</view>
									<view class="choose-status" v-if="item.optionValIndex == -2">{{item.value}}</view>
									<view class="choose-status" v-else>{{item.optionVal2[item.optionValIndex]}}</view>
									<uni-icons type="arrowright" size="20"
									           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
								</view>
							</picker>
							<!--多选-->
							<view class="list-content" v-if="item.type == 3">
								<template v-if="item.hasOption.length > 0">
									<view class="choose-status2" v-for="(option,optionIndex) in item.hasOption">
										{{option}}
										<uni-icons type="closeempty" size="20" style="float: right;color: #007AFF;"
										           @click="deleteTag(optionIndex,index)"></uni-icons>
									</view>
								</template>
								<picker @change="changeSelect($event,index)" :range="item.optionVal2">
									<template v-if="item.hasOption.length == 0">
										<view class="choose-status placeholder-style">请选择{{item.title}}</view>
									</template>
									<uni-icons type="arrowright" size="20"
									           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
								</picker>
							</view>
							<!--地区-->
							<pick-regions :default-regions="item.defaultRegions" @getRegions="changeArea"
							              class="list-content" :index="index">
								<view v-if="item.type == 7">
									<view class="choose-status placeholder-style" v-if="item.regionsName == ''">
										请选择{{item.title}}
									</view>
									<view class="choose-status" v-if="item.regionsName != ''">{{item.regionsName}}
									</view>
									<uni-icons type="arrowright" size="20"
									           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
								</view>
							</pick-regions>
							<!--日期-->
							<picker mode="date" :value="item.date" :start="item.startDate" :end="item.endDate"
							        @change="bindDateChange($event,index)"
							        class="list-content">
								<view v-if="item.type == 4">
									<view v-if="item.date != ''">{{item.date}}</view>
									<view v-if="item.date == ''" class="placeholder-style">请选择{{item.title}}</view>
								</view>
							</picker>
						</view>
					</template>
				</view>
			</view>
			<Footer v-if="is_show_copyright == 1"></Footer>
		</view>
		<!--预览图片弹窗-->
		<view
				v-if="previewShow"
				class="uni-margin-wrap preview-box">
			<swiper
					class="swiper swiper-box"
					:current-item-id="previewIndex">
				<swiper-item v-for="(item, key) in imgList" :key="key" :item-id="String(key)">
					<view
							class="swiper-item"
							@touchmove="touchMove"
							@touchstart="touchStart"
							@touchend="touchEnd"
							@click="closePreview">
						<img
								:src="commonUrl + item.url"
								width="75%"
								class="img-info"/>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	import Footer from "../../components/footer/footer.vue";

	function getDate (type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;
		;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}

	export default {
		name      : "edit",
		inject    : ['initPage', 'getParameter','getCopyright'],
		components: {
			pickRegions,Footer
		},
		data () {
			return {
				isReady     : false,
				field_list  : [],
				list        : [],
				commonUrl   : this.$store.state.commonUrl,
				previewShow : false,
				imgList     : [],
				previewIndex: 0,
				des         : 0,
				imageSrc    : '',//描述中的图片
				phone       : [],//手机号
				company     : [],//公司
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},
		onLoad    : function () {
			uni.setNavigationBarTitle({
				title: '修改群画像'
			});
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
			this.$store.dispatch('setWx', () => {
				this.initPage(this.getData())
			})
			// this.getData()
		},
		// onBackPress () {
		// 	alert(111)
		// },
		methods   : {
			async getData () {
				let that = this
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-custom-detail/chat-detail", {
					uid    : localStorage.getItem('uid'),
					corp_id: localStorage.getItem('corpid'),
					chat_id: this.getParameter('chat_id') ? this.getParameter('chat_id') : this.$store.state.chatId,
				});
				if (res.error != 0) {
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading()
					that.isReady = true
					that.list = res.data.fieldList
					this.list.map(x => {
						if (x.type == 2 || x.type == 3) {
							x.optionVal2 = x.optionVal.split(',')
							if (x.type == 2) {
								if (x.value == '') {
									x.optionValIndex = -1
								} else {
									if (x.optionVal2.indexOf(x.value) == -1) {
										x.optionValIndex = -2
									} else {
										x.optionValIndex = x.optionVal2.indexOf(x.value)
									}
								}
							}
							if (x.type == 3) {
								if (x.value != '') {
									x.hasOption = x.value.split(',')
								} else {
									x.hasOption = []
								}
							}
						} else if (x.type == 7) {
							if (x.value == '') {
								x.regions = [{name: ''}, {name: ''}]
								x.defaultRegions = []
								x.regionsName = ''
							} else {
								x.regions = [{name: ''}, {name: ''}]
								x.defaultRegions = x.value.split('-')
								x.regions[0].name = x.defaultRegions[0]
								x.regions[1].name = x.defaultRegions[1]
								x.regionsName = x.regions.map(item => item.name).join('-')
							}
						} else if (x.type == 4) {
							x.date = x.value
							x.startDate = getDate('start')
							x.endDate = getDate('end')
						}
					})
					for (let i = 0; i < that.list.length; i++) {
						if (that.list[i].key === 'phone') {
							that.phone = that.list[i].value.split(',')
						}
					}
					if (that.phone.length == 0) {
						that.phone = ['']
					}
				}
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
			//删除手机号
			deletePhone (phoneIndex) {
				this.phone.splice(phoneIndex, 1)
				this.$forceUpdate()
			},
			changeSpecialInput (e, key, phoneIndex) {
				if (key == 'phone') {
					this.phone[phoneIndex] = e.target.value
					//只能输入数字与+-
					let phoneReg = /[^+|-|\d]/
					if (this.phone.length < 5 && !phoneReg.test(e.target.value) && e.target.value.length >= 5 && e.target.value.length <= 32 && this.phone.length - 1 == phoneIndex) {
						this.phone.push('')
						this.$forceUpdate()
					}
				} else if (key == 'company') {
					this.company = e.target.value
				}
			},
			//预览图片
			preview (index, imgIndex) {
				this.imgList = this.list[index].value
				this.previewIndex = String(imgIndex)
				this.previewShow = true
			},
			//删除图片
			deleteImg (index, imgIndex) {
				this.list[index].value.splice(imgIndex, 1)
			},
			//预览描述图片
			previewImageSrc () {
				let obj = {
					url: this.imageSrc
				}
				this.imgList = []
				this.imgList.push(obj)
				this.previewIndex = '0'
				this.previewShow = true
			},
			//删除描述图片
			deleteImageSrc () {
				this.imageSrc = ''
			},
			//上传图片
			chooseImage: function (index) {
				let that = this
				uni.chooseImage({
					count     : 1,
					sizeType  : ['compressed'],
					sourceType: ['album'],
					success   : (res) => {
						if (res.tempFiles[0].size > 2 * 1024 * 1024) {
							uni.showToast({
								title   : '文件大小超过2M',
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						}
						uni.showLoading({
							title   : '正在上传...',
							duration: 200000
						});
						var imageSrc = res.tempFilePaths[0]
						uni.uploadFile({
							url     : that.$store.state.commonUrl + '/api/sub-user/upload-image',
							filePath: imageSrc,
							fileType: 'image',
							name    : 'fileInfo',
							formData: {
								'uid': localStorage.getItem('uid'),
							},
							header  : {
								'Authorization': 'Bearer ' + localStorage.getItem('token')
							},
							success : (res) => {
								uni.hideLoading()
								if(JSON.parse(res.data).error == 0){
									uni.showToast({
										title   : '上传成功',
										icon    : 'success',
										duration: 2000
									});
									if (index == -1) {
										//描述
										that.imageSrc = JSON.parse(res.data).data.local_path
									} else {
										that.list[index].value.push(
											{
												uid   : (new Date()).getTime(),
												url   : JSON.parse(res.data).data.local_path,
												status: 'done',
												name  : '1.png'
											}
										)
									}
								}else {
									uni.showToast({
										title   : JSON.parse(res.data).error_msg,
										image   : '/static/fail.png',
										duration: 2000
									});
								}
							},
							fail    : (err) => {
								uni.hideLoading()
								uni.showModal({
									content   : err.errMsg,
									showCancel: false
								});
							}
						});
					},
					fail      : (err) => {
						console.log('chooseImage fail', err)
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'];
								if (!authStatus) {
									uni.showModal({
										title  : '授权失败',
										content: '需要从您的相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			//单选
			changeOneSelect (e, index) {
				this.list[index].optionValIndex = e.detail.value
				this.$forceUpdate()
			},
			//多选
			changeSelect (e, index) {
				if (this.list[index].hasOption.indexOf(this.list[index].optionVal2[e.detail.value]) == -1) {
					this.list[index].hasOption.push(this.list[index].optionVal2[e.detail.value])
				} else {
					uni.showToast({
						title   : '选项不可重复',
						image   : '/static/fail.png',
						duration: 2000
					});
				}
				this.$forceUpdate()
			},
			deleteTag (optionIndex, index) {
				this.list[index].hasOption.splice(optionIndex, 1)
				this.$forceUpdate()
			},
			//地区
			changeArea (regions, index) {
				this.list[index].regions = regions
				this.list[index].regionsName = regions.map(item => item.name).join('-')
				this.$forceUpdate()
			},
			//日期
			bindDateChange (e, index) {
				this.list[index].date = e.detail.value
				this.$forceUpdate()
			},
			//提交
			async submit () {
				let fieldData = []
				this.list.map(x => {
					if (x.type == 2) {
						if (x.optionValIndex == -1) {
							fieldData.push({
								fieldid: x.fieldid,
								key    : x.key,
								type   : x.type,
								value  : ''
							})
						} else if (x.optionValIndex == -2) {
							fieldData.push({
								fieldid: x.fieldid,
								key    : x.key,
								type   : x.type,
								value  : x.value
							})
						} else {
							fieldData.push({
								fieldid: x.fieldid,
								key    : x.key,
								type   : x.type,
								value  : x.optionVal2[x.optionValIndex]
							})
						}
					} else if (x.type == 3) {
						fieldData.push({
							fieldid: x.fieldid,
							key    : x.key,
							type   : x.type,
							value  : x.hasOption.join(',')
						})
					} else if (x.type == 7) {
						fieldData.push({
							fieldid: x.fieldid,
							key    : x.key,
							type   : x.type,
							value  : x.regionsName
						})
					} else if (x.type == 4) {
						fieldData.push({
							fieldid: x.fieldid,
							key    : x.key,
							type   : x.type,
							value  : x.date
						})
					} else {
						if (x.key == 'phone') {
							for (let i = this.phone.length - 1; i >= 0; i--) {
								if (this.phone[i] == '') {
									this.phone.splice(i, 1);
								}
							}
							fieldData.push({
								fieldid: x.fieldid,
								key    : x.key,
								type   : x.type,
								value  : this.phone.join()
							})
						} else {
							fieldData.push({
								fieldid: x.fieldid,
								key    : x.key,
								type   : x.type,
								value  : x.value
							})
						}
					}
				})
				//只能输入数字与+-
				let phoneReg = /[^+|-|\d]/
				let postBoxReg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
				for (let i = fieldData.length - 1; i >= 0; i--) {
					if (fieldData[i].key == 'phone') {
						let phoneArray = fieldData[i].value.split(',')
						for (let i = 0; i < phoneArray.length; i++) {
							if (phoneArray[i] == '') {
								phoneArray.splice(i, 1)
							} else {
								if (phoneReg.test(phoneArray[i])) {
									uni.showToast({
										title   : '手机号格式不正确！',
										image   : '/static/fail.png',
										duration: 2000
									});
									return false
								}
							}
						}
						fieldData[i].value = phoneArray.join()
					}
					if (fieldData[i].type == 6) {
						if (!postBoxReg.test(fieldData[i].value) && fieldData[i].value != '') {
							uni.showToast({
								title   : '邮箱格式不正确！',
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						}
					}
				}
				const {data: res} = await this.axios.post("work-chat/chat-field-update", {
					chatid   : this.getParameter('chat_id') != null ? this.getParameter('chat_id') : this.$store.state.chatId,
					user_id  : this.getParameter('user_id') || localStorage.getItem('user_id'),
					fieldData: fieldData,
					corp_id  : localStorage.getItem('corpid')
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					history.back()
				}
			},

			//返回
			back () {
				this.$refs['visible'].open()
			},
			unSave () {
				this.$refs['visible'].close()
				history.back()
			},

		},
	}
</script>

<style scoped>
	.box {
		background: #F6F6F6;
		position: fixed;
		top: 0;
		bottom: 0;
	}

	/deep/ .uni-navbar--border {
		border: 0;
	}

	.custom-tabs-button {
		width: 70px;
		line-height: 30px;
		font-size: 0.693rem;
	}

	.custom-tabs-content {
		background: #FFF;
		padding: 0 0.8rem;;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		top: 2.667rem /* 50/18.75 */;
		bottom: 0;
		overflow: auto;
	}

	.list {
		line-height: 0.747rem;
		padding-top: 0.8rem;
		text-align: left;
		overflow: hidden;
	}

	.list:nth-child(3n) {
		border-bottom: 1px solid #F5F5F5;
		padding-bottom: 0.8rem;
	}

	.list-title {
		color: #ADAEB6;
		font-size: 0.693rem;
		display: inline-block;
		vertical-align: top;
		width: 2.88rem;
		margin-right: 1.547rem;
	}

	.list-content {
		color: #007AFF;
		font-size: 0.693rem;
		display: inline-block;
		width: calc(100% - 4.427rem);
		float: right;
	}

	.list-content2 {
		color: #007AFF;
		font-size: 0.693rem;
		display: inline-block;
		width: calc(100% - 0.907rem);
	}

	.phone-line {
		border-bottom: 1px dashed #F5F5F5;
		float: right;
		width: calc(100% - 4.427rem);
		padding-bottom: 3px;
		margin-bottom: 3px;
	}

	.phone-line:last-child {
		margin-bottom: 0;
	}

	.choose-status {
		float: left;
		font-size: 0.693rem;
		line-height: 15.4629px;
	}

	.choose-status2 {
		float: left;
		border: 1px solid #007AFF;
		padding: 0.16rem /* 3/18.75 */;
		border-radius: 0.16rem /* 3/18.75 */;
		margin: 0 0.16rem /* 3/18.75 */ 0.16rem /* 3/18.75 */ 0;
	}

	.placeholder-style {
		color: #C5C5C5;
	}

	/deep/ .uni-input-placeholder {
		color: #C5C5C5;
	}

	.uni-input {
		height: 28px;
		line-height: 28px;
		font-size: 15px;
		text-align: left;
		border: 1px solid #CCC;
		border-radius: 4px;
		padding: 0 8px;
		margin: 15px 0;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 75%;
		background-color: #FFF;
		border-radius: 4px;
		left: 12.5%;
		position: absolute;
		top: 50%;
		box-sizing: border-box;
		margin-top: -50px;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
		height: 100%;
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3B4144;
	}

	.img {
		width: 3.627rem;
		height: 3.627rem;
		border-radius: 0.267rem;
		margin: 0 0.48rem 0.4rem 0;
		position: relative;
		float: left;
	}

	.img2 {
		max-width: 3.627rem;
		max-height: 3.627rem;
		border-radius: 0.267rem;
	}

	.demo {
		width: 3.627rem;
		height: 3.627rem;
		text-align: center;
		font-size: 0.747rem /* 14/18.75 */;
		border: 1px solid #CCC;
		/*padding: 0.267rem 0px;*/
		border-radius: 4px;
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