<template>
	<view class="box content_head">
		<uni-nav-bar left-icon="back" title="修改客户画像" @clickLeft="back">
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
		<view class="custom-tabs-content content_head" v-if="isLoading">
			<view class="custom-tabs-list">
				<view style="padding: 0px 0 0.8rem;">
					<template v-for="(item,index) in list"
					          v-if="item.key == 'phone' && is_hide_phone != 1 || item.key != 'phone'">
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
								<input class="list-content" placeholder="请输入公司" :value="company"
								       @input="changeSpecialInput($event,item.key)"/>
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
								<view class="uni-hello-addfile demo" style="cursor:pointer;float: left;"
								      @click="chooseImage(index)">
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
					<view class="list">
						<text class="list-title">描述</text>
						<input class="list-content" placeholder="请输入描述，150字以内" v-model="des" maxlength="150"/>
						<!--						<view v-if="imageSrc != ''" style="position: relative;display: inline-block;">-->
						<!--							<image :src="commonUrl + imageSrc" @click="" class="img2" style="margin: 0.533rem  /* 10/18.75 */ 0 0 4.427rem;display: inline-block;" @click="previewImageSrc"></image>-->
						<!--							<uni-icons type="close" size="20"-->
						<!--							           style="position: absolute;right: 0;top: 0.8rem  /* 15/18.75 */;"-->
						<!--							           color="#1890FF" @click="deleteImageSrc"></uni-icons>-->
						<!--						</view>-->
						<!--						<view class="uni-hello-addfile demo"-->
						<!--						      style="margin: 0.533rem  /* 10/18.75 */ 0 0 4.427rem;color: #007AFF;"-->
						<!--						      @click="chooseImage(-1)" v-else>-->
						<!--							<text style="margin: 0.533rem 0; display: inline-block;font-size: 1.493rem  /* 28/18.75 */;">-->
						<!--								+-->
						<!--							</text>-->
						<!--							<view style="margin-top: 0.267rem  /* 5/18.75 */;">上传</view>-->
						<!--						</view>-->
					</view>
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
	import {Toast} from "vant";
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
		name      : "list",
		inject    : ['getParameter', 'initPage'],
		components: {
			pickRegions, Footer
		},
		data () {
			return {
				field_list       : [],
				list             : [],
				commonUrl        : this.$store.state.commonUrl,
				previewShow      : false,
				imgList          : [],
				previewIndex     : 0,
				des              : 0,
				imageSrc         : '',//描述中的图片
				phone            : [],//手机号
				company          : [],//公司
				type             : 1,//企微客户详情进入，2非企微客户进入
				is_hide_phone    : 0,//对特殊账号做处理，1影藏手机号，0显示
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
				isLoading        : false,//页面是否加载完成
			}
		},
		onLoad    : function () {
			uni.setNavigationBarTitle({
				title: '客户详情'
			});

			// localStorage.setItem('user_id', 'liyunli')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('agent_id', '25')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// localStorage.setItem('externalId', 'wm_4OwBwAA-MI9VyYbcTI4d3JitD8gqg')
			// this.startPage()

			this.type = this.getParameter('type')
			this.$store.dispatch('setWx', () => {
				this.initPage(this.startPage)
			})
		},
		methods   : {
			startPage () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				if (this.type == 1) {
					this.getData()
				} else if (this.type == 2) {
					this.getData2()
				}
			},
			async getData () {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("wap-custom-detail/custom-field-detail", {
					uid            : localStorage.getItem('uid'),
					external_userid: this.getParameter('external_userid') || localStorage.getItem('externalId') || localStorage.getItem('external_userid') || localStorage.getItem('external_id'),
					userid         : this.getParameter('user_id') || localStorage.getItem('user_id')
				});
				if (res.error != 0) {
					this.isLoading = true
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					Toast.clear();
					this.field_list = res.data.field_list
					this.is_hide_phone = res.data.is_hide_phone
					this.des = res.data.des
					this.imageSrc = res.data.path
					if (res.data.phone != '') {
						this.phone = res.data.phone.split(',')
						this.phone.push('')
					} else {
						this.phone.push('')
					}
					this.company = res.data.company
					this.list = JSON.parse(JSON.stringify(res.data.field_list))
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
					this.isLoading = true
				}
			},
			async getData2 () {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("wap-public-sea/custom-field-detail", {
					uid: localStorage.getItem('uid'),
					cid: this.getParameter('cid')
				});
				if (res.error != 0) {
					this.isLoading = true
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					Toast.clear();
					this.field_list = res.data.field_list
					this.des = res.data.des
					this.imageSrc = res.data.path
					if (res.data.phone != '') {
						this.phone = res.data.phone.split(',')
						this.phone.push('')
					} else {
						this.phone.push('')
					}
					this.company = res.data.company
					this.list = JSON.parse(JSON.stringify(res.data.field_list))
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
					this.isLoading = true
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
							Toast.fail('文件大小超过2M');
							return false
						}
						Toast.setDefaultOptions({duration: 200000});
						Toast.loading({
							message    : '正在上传...',
							forbidClick: true,
							loadingType: 'spinner',
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
								Toast.setDefaultOptions({duration: 1000});
								Toast.clear()
								if (JSON.parse(res.data).error == 0) {
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
								} else {
									uni.showToast({
										title   : JSON.parse(res.data).error_msg,
										image   : '/static/fail.png',
										duration: 2000
									});
								}
							},
							fail    : (err) => {
								Toast.setDefaultOptions({duration: 1000});
								Toast.clear()
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
					Toast.fail('选项不可重复');
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
						} else if (x.key == 'company') {
							fieldData.push({
								fieldid: x.fieldid,
								key    : x.key,
								type   : x.type,
								value  : this.company
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
									Toast.fail('手机号格式不正确！')
									return false
								}
							}
						}
						fieldData[i].value = phoneArray.join()
					}
					if (fieldData[i].type == 6) {
						if (!postBoxReg.test(fieldData[i].value) && fieldData[i].value != '') {
							Toast.fail('邮箱格式不正确！')
							return false
						}
					}
				}
				if (this.type == 1) {
					const {data: res} = await this.axios.post("wap-custom-detail/custom-field-update", {
						uid            : localStorage.getItem('uid'),
						external_userid: localStorage.getItem('externalId'),
						userid         : this.getParameter('user_id') || localStorage.getItem('user_id'),
						fieldData      : fieldData,
						des            : this.des,
						path           : this.imageSrc,
						corp_id        : localStorage.getItem('corpid')
					});
					if (res.error != 0) {
						Toast.fail(res.error_msg);
						if (typeof this.phone == 'object' && this.phone.length == 0) {
							this.phone.push('')
						}
					} else {
						uni.navigateBack()
					}
				} else if (this.type == 2) {
					const {data: res} = await this.axios.post("wap-public-sea/custom-field-update", {
						uid      : localStorage.getItem('uid'),
						cid      : this.getParameter('cid'),
						fieldData: fieldData,
						des      : this.des,
						path     : this.imageSrc
					});
					if (res.error != 0) {
						Toast.fail(res.error_msg);
						if (typeof this.phone == 'object' && this.phone.length == 0) {
							this.phone.push('')
						}
					} else {
						uni.navigateBack()
					}
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