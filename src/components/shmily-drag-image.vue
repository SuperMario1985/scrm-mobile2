<template>
	<view class="con">
		<view v-if="!showMaterial&&text.length>0">
			<view style="display: flex;height: 5.4rem;background-color: #F7F7F7">
				<image v-if="text[0].local_path"
				       style="height: 4rem;width:4rem;margin:0.7rem 0.5rem;background-color: #999999"
				       :src="commonUrl+text[0].local_path"
				       mode="aspectFill"></image>
				<view style="margin: 0.7rem 0px 0px 0.5rem;font-size: 14px;">
					{{text[0].file_name}}
				</view>
				<image
						class="img"
						@click="deleteVideo"
						style="height: 1rem;width: 1rem;position: absolute;left: 18.5rem;"
						src="../static/assets/shanchus2.png"
						mode="aspectFill"></image>
			</view>
		</view>
		<view style="text-align: left;position: relative;" v-if="!showMaterial&&video.length>0">
			<videoplayer :url="commonUrl + video[0].local_path" style="width: 7rem;height:7rem;margin: 0">
			</videoplayer>
			<image
					class="img"
					@click="deleteVideo"
					style="height: 1rem;width: 1rem;top:-0.2rem;left:7rem;position: absolute"
					src="../static/assets/shanchus2.png"
					mode="aspectFill"></image>
		</view>
		<view v-if="!showMaterial&&video.length<=0&&text.length<=0">
			<movable-area class="area" :style="{ height: areaHeight }" @mouseenter="mouseenter"
			              @mouseleave="mouseleave">
				<block v-if="imageList.length>0"
				       v-for="(item, index) in imageList" :key="item.id">
					<movable-view
							class="view"
							:x="item.x"
							:y="item.y"
							direction="all"
							:damping="40"
							:disabled="item.disable"
							@change="onChange($event, item)"
							@touchstart="touchstart(item)"
							@mousedown="touchstart(item)"
							@touchend="touchend(item)"
							@mouseup="touchend(item)"
							:style="{ width: viewWidth + 'px', height: viewWidth + 'px', 'z-index': item.zIndex, opacity: item.opacity }"
					>
						<view class="area-con"
						      :style="{ width: childWidth, height: childWidth, transform: 'scale(' + item.scale + ')' }">
							<image class="pre-image"
							       :src="item.s_local_path?commonUrl+item.s_local_path:commonUrl+item.local_path  "
							       mode="aspectFill"></image>
							<view class="del-con" @click="delImage(item, index)"
							      @touchstart.stop="delImageMp(item, index)" @touchend.stop="nothing()"
							      @mousedown.stop="nothing()" @mouseup.stop="nothing()">
								<view class="del-wrap">
									<image
											class="del-image"
											src="../static/assets/shanchus2.png"
									></image>
								</view>
							</view>
						</view>
					</movable-view>
				</block>
				<view
						class="add"
						v-if="imageList.length < number"
						:style="{ top: add.y, left: add.x, width: viewWidth + 'px', height: viewWidth + 'px' }"
						@click="uploadFile"
				>
					<view class="add-wrap" :style="{ width: childWidth, height: childWidth }">
						<image
								style="width: 54rpx;height: 54rpx;"
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAABIUlEQVRoQ+2a2w2DMAxFeQzWrsMUbadAsEw3S1CqVgppKwLX8BEOP4iHTXx8uUgWdVXoVhdaV0VhSmf7vr/H8V3XzY6V3P9iD+nYOI5P7/01LMI596AwoZV0TIBXIUWFXhKLFBWYSFGhhxQN6SFFQ5i4ogITKSr0cEVDekjRECauqMBEigq9U7piOk2yAti27SUe5ljlTfPEQ6KZecTvwl4P3ytvOv06R2HDMNzes7+6aRrvnHvtf50L13Lp50rx88zcvNlS3JpwKQ67XyK04nq2nFbk/LqVjin0TvmBNgQ2S4UUDcliHgpMpKjQwxUN6SFFQ5i4ogITKSr0cEVDekjRECauqMAsVoph+hVPtYr5+03p9tbYQ96xrYtT4ootbAJGVxxVTapVswAAAABJRU5ErkJggg=="
						></image>
					</view>
				</view>
			</movable-area>
		</view>
		<material
				v-if="showMaterial"
				style="height: 100vh;z-index: 9999"
				:type="parseInt(this.type)"
				:close="filingCabinetClose"
				:call-back="replyMsg">
		</material>
	</view>
</template>

<script>
	import MD5 from "js-md5";
	import material from "@/components/material";
	import videoplayer from "../components/videoplayer/bw-videoPlayer"

	export default {
		data () {
			return {
				poster           : '../static/assets/video.jpg',
				showMaterial     : false,
				showFilingCabinet: false,
				video            : [],
				text             : [],
				commonUrl        : this.$store.state.commonUrl,
				imageList        : [],
				width            : 0,
				add              : {
					x: 0,
					y: 0
				},
				colsValue        : 0,
				viewWidth        : 0,
				tempItem         : null,
				timer            : null,
				changeStatus     : true,
				preStatus        : true,
				type             : 1,
				cameraList       : [{
					value  : 'back',
					name   : '后置摄像头',
					checked: 'true'
				},
					{
						value: 'front',
						name : '前置摄像头'
					},
				],
			}
		},
		components: {
			material,
			videoplayer
		},
		props     : {
			firstImage : {
				type   : Array,
				default: null
			},
			callBack   : {
				type   : Function,
				default: null
			},
			// 返回排序后图片
			list       : {
				type   : Array,
				default: function () {
					return []
				}
			},
			// 选择图片数量限制
			number     : {
				type   : Number,
				default: 6
			},
			// 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
			imageWidth : {
				type   : Number,
				default: 230
			},
			// 图片列数（cols > 0 则 imageWidth 无效）
			cols       : {
				type   : Number,
				default: 0
			},
			// 图片周围空白填充，单位 rpx
			padding    : {
				type   : Number,
				default: 10
			},
			// 拖动图片时放大倍数 [0, ∞)
			scale      : {
				type   : Number,
				default: 1.1
			},
			// 拖动图片时不透明度
			opacity    : {
				type   : Number,
				default: 0.7
			},
			publishType: {
				type   : Number,
				default: null
			}
		},
		computed  : {
			areaHeight () {
				if (this.imageList.length < this.number) {
					return Math.ceil((this.imageList.length + 1) / this.colsValue) * this.viewWidth + 'px'
				} else {
					return Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				}
			},
			childWidth () {
				return this.viewWidth - this.rpx2px(this.padding) * 2 + 'px'
			},
		},
		created () {
			this.width = uni.getSystemInfoSync().windowWidth
			this.viewWidth = this.rpx2px(this.imageWidth)
		},
		watch     : {
			firstImage () {
				for (let item of this.firstImage) {
					let absX = this.imageList.length % this.colsValue
					let absY = Math.floor(this.imageList.length / this.colsValue)
					let x = absX * this.viewWidth
					let y = absY * this.viewWidth
					this.imageList.push({
						md5         : item.md5,
						local_path  : item.local_path,
						s_local_path: item.s_local_path,
						attchment   : "",
						sort        : this.imageList.length + 1,
						x,
						y,
						oldX        : x,
						oldY        : y,
						absX,
						absY,
						scale       : 1,
						zIndex      : 9,
						opacity     : 1,
						index       : this.imageList.length,
						id          : this.guid(),
						disable     : false,
						offset      : 0,
						moveEnd     : false
					})
					this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
					this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				}
			},
			list () { // 监听数组变化
				if (this.publishType == 2) {
				} else if (this.publishType == 3) {
					this.video = this.list
				} else if (this.publishType == 4) {
					this.text = this.list
				}
				console.log('this.list', this.imageList)

			}
		},
		mounted () {
			const query = uni.createSelectorQuery().in(this)
			query.select('.area').boundingClientRect(data => {
				this.colsValue = Math.floor(data.width / this.viewWidth)
				if (this.cols > 0) {
					this.colsValue = this.cols
					this.viewWidth = data.width / this.cols
				}
				for (let item of this.list) {
				}
			})
			query.exec()
		},
		methods   : {
			//素材库
			filingCabinetClose () {
				this.showFilingCabinet = false
			},
			replyMsg (content) {
				// this.content = {local_path: content, attachment: item.id}
				this.showMaterial = false
				console.log('素材库', content)
				if (content) {
					//图片
					if (this.type == 2) {
						for (let item of content) {
							let absX = this.imageList.length % this.colsValue
							let absY = Math.floor(this.imageList.length / this.colsValue)
							let x = absX * this.viewWidth
							let y = absY * this.viewWidth
							if (this.imageList.length >= 9) {
								uni.showToast({
									title   : '只能选9个',
									image   : '/static/fail.png',
									duration: 2000
								});
								return
							}
							this.imageList.push({
								file_name   : item.file_name,
								local_path  : item.local_path,
								s_local_path: item.s_local_path,
								attchment   : item.attachment,
								sort        : this.imageList.length + 1,
								src         : item.s_local_path ? item.s_local_path : item.local_path,
								x,
								y,
								oldX        : x,
								oldY        : y,
								absX,
								absY,
								scale       : 1,
								zIndex      : 9,
								opacity     : 1,
								index       : this.imageList.length,
								id          : this.guid(),
								offset      : 0,
								moveEnd     : false
							})
							this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
							this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
							this.sortList()
						}
					}
					// 视频
					if (this.type == 3) {
						this.video = content
						this.callBack(3, content)
					}
					// 图文
					if (this.type == 4) {
						this.text = content
						this.callBack(4, content)
					}
				}
			},
			// 视频相关操作
			videoErrorCallback: function (e) {
				uni.showModal({
					content   : e.target.errMsg,
					showCancel: false
				})
			},
			chooseVideo (sourceType) {
				// 上传视频
				uni.chooseVideo({
					maxDuration: 60,
					count      : 1,
					sourceType : sourceType,
					success    : (res) => {
						let file = res.tempFile
						let that = this
						that.getFileContent(file, async function (str) {
							that.md = (MD5(str))
							uni.showLoading({
								message    : '正在上传...',
								forbidClick: true,
								loadingType: 'spinner',
							});
							const {data: res2} = await that.axios.post('moments-web/moments-upload', {
								type: file.type,
								md5 : that.md,
							})
							if (res2.error != 0) {
								uni.hideLoading()
								that.$refs.popup.close()
								uni.showToast({
									title   : res2.error_msg,
									image   : '/static/fail.png',
									duration: 2000
								});
							} else {
								if (!res2.data.local_path) {
									let params2 = new FormData();
									params2.append("fileInfo", file);
									params2.append("type", file.type);
									params2.append("md5", that.md);
									const {data: res3} = await that.axios.post("moment/moments-upload", params2);
									if (res3.error != 0) {
										uni.hideLoading()
										uni.showToast({
											title   : res2.error_msg,
											image   : '/static/fail.png',
											duration: 2000
										});
									} else if (res3.data) {
										uni.hideLoading()
										res3.data.attchment = ''
										res3.data.sort = 1
										that.video = [res3.data]
										that.callBack(that.type, that.video)
									}
								} else {
									uni.hideLoading()
									if (res2.data) {
										res2.data.attchment = ''
										res2.data.sort = 1
										that.video = [res2.data]
										that.callBack(that.type, that.video)
									}
								}
							}
						})
					}
				})
			},
			deleteVideo () {
				this.video = [];
				this.lists = []
				this.text = []
				this.callBack(this.type, [])
			},
			// 上传文件
			uploadFile () {
				uni.showActionSheet({
					title   : '',
					itemList: ['从手机相册选择', '拍摄视频', '从手机相册选择视频', '从内容引擎选择图片（9张）', '从内容引擎选择视频', '从内容引擎选择图文'],
					success : async (e) => {
						let that = this
						switch (e.tapIndex) {
							case 0:
								if (this.video.length > 0 || this.text.length > 0) {
									uni.showModal({
										content: '是否替换为图片？',
										success: function (res) {
											if (res.confirm) {
												that.video = []
												that.text = []
												that.type = 2
												that.addImages()
											} else if (res.cancel) {
												return
											}
										}
									});
								} else {
									this.type = 2
									this.addImages()
								}
								break;
							case 1:
								if (this.imageList.length > 0 || this.text.length > 0) {
									uni.showModal({
										content: '是否替换为视频？',
										success: function (res) {
											if (res.confirm) {
												that.imageList = []
												that.text = []
												that.add.y = 0
												that.add.x = 0
												that.type = 3
												that.chooseVideo(['camera'])
											} else if (res.cancel) {
												return
											}
										}
									});
								} else {
									this.type = 3
									this.chooseVideo(['camera'])
								}
								break
							case 2:
								if (this.imageList.length > 0 || this.text.length > 0) {
									uni.showModal({
										content: '是否替换为视频？',
										success: function (res) {
											if (res.confirm) {
												that.text = []
												that.imageList = []
												that.add.y = 0
												that.add.x = 0
												that.type = 3
												that.chooseVideo(['album'])
											} else if (res.cancel) {
												return
											}
										}
									});
								} else {
									this.type = 3
									this.chooseVideo(['album'])
								}
								break
							case 3:
								if (this.video.length > 0 || this.text.length > 0) {
									uni.showModal({
										content: '是否替换为图片？',
										success: function (res) {
											if (res.confirm) {
												that.text = []
												that.imageList = []
												that.type = 2
												that.showMaterial = true
											} else if (res.cancel) {
												return
											}
										}
									});
								} else {
									that.type = 2
									that.showMaterial = true
								}

								break
							case 4:
								if (this.imageList.length > 0 || this.text.length > 0) {
									uni.showModal({
										content: '是否替换为视频？',
										success: function (res) {
											if (res.confirm) {
												that.text = []
												that.imageList = []
												that.add.y = 0
												that.add.x = 0
												that.type = 3
												that.showMaterial = true
											} else if (res.cancel) {
												return
											}
										}
									});
								} else {
									this.type = 3
									this.showMaterial = true
								}
								break
							case 5:
								if (this.video.length > 0 || this.imageList.length > 0) {
									uni.showModal({
										content: '是否替换为图文？',
										success: function (res) {
											if (res.confirm) {
												that.imageList = []
												that.video = []
												that.add.y = 0
												that.add.x = 0
												that.type = 4
												that.showMaterial = true
											} else if (res.cancel) {
												return
											}
										}
									});
								} else {
									this.type = 4
									this.showMaterial = true
								}
								break
						}
					}
				})
			},
			onChange (e, item) {
				if (!item) return
				item.oldX = e.detail.x
				item.oldY = e.detail.y
				if (e.detail.source === 'touch') {
					if (item.moveEnd) {
						item.offset = Math.sqrt(Math.pow(item.oldX - item.absX * this.viewWidth, 2) + Math.pow(item.oldY - item.absY * this.viewWidth, 2))
					}
					let x = Math.floor((e.detail.x + this.viewWidth / 2) / this.viewWidth)
					if (x >= this.colsValue) return
					let y = Math.floor((e.detail.y + this.viewWidth / 2) / this.viewWidth)
					let index = this.colsValue * y + x
					if (item.index != index && index < this.imageList.length) {
						this.changeStatus = false
						for (let obj of this.imageList) {
							if (item.index > index && obj.index >= index && obj.index < item.index) {
								this.change(obj, 1)
							} else if (item.index < index && obj.index <= index && obj.index > item.index) {
								this.change(obj, -1)
							} else if (obj.id != item.id) {
								obj.offset = 0
								obj.x = obj.oldX
								obj.y = obj.oldY
								setTimeout(() => {
									this.$nextTick(() => {
										obj.x = obj.absX * this.viewWidth
										obj.y = obj.absY * this.viewWidth
									})
								}, 0)
							}
						}
						item.index = index
						item.absX = x
						item.absY = y
						this.sortList()
					}
				}
			},
			change (obj, i) {
				obj.index += i
				obj.offset = 0
				obj.x = obj.oldX
				obj.y = obj.oldY
				obj.absX = obj.index % this.colsValue
				obj.absY = Math.floor(obj.index / this.colsValue)
				setTimeout(() => {
					this.$nextTick(() => {
						obj.x = obj.absX * this.viewWidth
						obj.y = obj.absY * this.viewWidth
					})
				}, 0)
			},
			touchstart (item) {
				this.imageList.forEach(v => {
					v.zIndex = v.index + 9
				})
				item.zIndex = 99
				item.moveEnd = true
				this.tempItem = item
				this.timer = setTimeout(() => {
					item.scale = this.scale
					item.opacity = this.opacity
					clearTimeout(this.timer)
					this.timer = null
				}, 200)
			},
			touchend (item) {
				this.previewImage(item)
				item.scale = 1
				item.opacity = 1
				item.x = item.oldX
				item.y = item.oldY
				item.offset = 0
				item.moveEnd = false
				setTimeout(() => {
					this.$nextTick(() => {
						item.x = item.absX * this.viewWidth
						item.y = item.absY * this.viewWidth
						this.tempItem = null
						this.changeStatus = true
					})
				}, 0)
			},
			previewImage (item) {
				if (this.timer && this.preStatus && this.changeStatus && item.offset < 28.28) {
					clearTimeout(this.timer)
					this.timer = null
					let lists = []
					for (let item of this.list) {
						let url = item.local_path.substr(0, 1) == '/' ? this.commonUrl + item.local_path : item.local_path
						lists.push(url)
					}
					let index = this.imageList.findIndex(v => v.local_path === item.local_path)

					uni.previewImage({
						urls   : lists,
						current: index,
						success: () => {
							this.preStatus = false
							setTimeout(() => {
								this.preStatus = true
							}, 600)
						}
					})
				} else if (this.timer) {
					clearTimeout(this.timer)
					this.timer = null
				}
			},
			mouseenter () {
				//#ifdef H5
				this.imageList.forEach(v => {
					v.disable = false
				})
				//#endif

			},
			mouseleave () {
				//#ifdef H5
				if (this.tempItem) {
					this.imageList.forEach(v => {
						v.disable = true
						v.zIndex = v.index + 9
						v.offset = 0
						v.moveEnd = false
						if (v.id == this.tempItem.id) {
							if (this.timer) {
								clearTimeout(this.timer)
								this.timer = null
							}
							v.scale = 1
							v.opacity = 1
							v.x = v.oldX
							v.y = v.oldY
							this.$nextTick(() => {
								v.x = v.absX * this.viewWidth
								v.y = v.absY * this.viewWidth
								this.tempItem = null
							})
						}
					})
					this.changeStatus = true
				}
				//#endif
			},
			addImages () {
				let checkNumber = this.number - this.imageList.length
				uni.chooseImage({
					count     : 9,
					sourceType: ['album', 'camera'],
					success   : res => {
						console.log(111111111111111)
						let count = checkNumber <= res.tempFilePaths.length ? checkNumber : res.tempFilePaths.length
						for (let i = 0; i < count; i++) {
							let file2 = res.tempFiles[i]
							let that = this
							console.log(file2)
							that.getFileContent(file2, async function (str) {
								that.md = (MD5(str))
								uni.showLoading({
									message    : '正在上传...',
									forbidClick: true,
									loadingType: 'spinner',
								});
								let params = new FormData();
								params.append("type", file2.type);
								params.append("md5", that.md);
								params.append("fileInfo", file2);
								const {data: res2} = await that.axios.post("moments-web/moments-upload", params)
								if (res2.error != 0) {
									that.$refs.popup.close()
									uni.hideLoading()
									uni.showToast({
										title   : res2.error_msg,
										image   : '/static/fail.png',
										duration: 2000
									});
								} else {
									uni.hideLoading()
									if (res2.data) {
										let absX = that.imageList.length % that.colsValue
										let absY = Math.floor(that.imageList.length / that.colsValue)
										let x = absX * that.viewWidth
										let y = absY * that.viewWidth
										that.imageList.push({
											md5         : res2.data.md5,
											local_path  : res2.data.local_path,
											s_local_path: res2.data.s_local_path,
											attchment   : "",
											sort        : that.imageList.length + 1,
											// src: res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path,
											x,
											y,
											oldX        : x,
											oldY        : y,
											absX,
											absY,
											scale       : 1,
											zIndex      : 9,
											opacity     : 1,
											index       : that.imageList.length,
											id          : that.guid(),
											offset      : 0,
											moveEnd     : false
										})
										that.add.x = (that.imageList.length % that.colsValue) * that.viewWidth + 'px'
										that.add.y = Math.floor(that.imageList.length / that.colsValue) * that.viewWidth + 'px'
										that.sortList()
									}
								}
							})
						}
					}, fail (e) {
						console.log(e)
					},
				})
			},
			delImage (item, index) {
				this.imageList.splice(index, 1)
				for (let obj of this.imageList) {
					if (obj.index > item.index) {
						obj.index -= 1
						obj.x = obj.oldX
						obj.y = obj.oldY
						obj.absX = obj.index % this.colsValue
						obj.absY = Math.floor(obj.index / this.colsValue)
						this.$nextTick(() => {
							obj.x = obj.absX * this.viewWidth
							obj.y = obj.absY * this.viewWidth
						})
					}
				}
				this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
				this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				this.sortList()
			},
			delImageMp (item, index) {
				//#ifdef MP
				this.delImage(item, index)
				//#endif
			},
			sortList () {
				console.log('this.imageList', this.imageList)
				let list = this.imageList.slice()
				list.sort((a, b) => {
					return a.index - b.index
				})
				let tempArr = []
				for (let i = 0; i < list.length; i++) {
					let {md5, s_local_path, local_path, sort, attchment} = list[i]
					tempArr.push({md5, s_local_path, local_path, sort, attchment})
				}
				this.callBack(2, tempArr)
				// this.$emit('update:list', list)
			},
			getFileContent (file, callback) {
				if (file && file.size > 0) {
					//下面这一句相当于JQuery的：var file =$("#upload").prop('files')[0];
					if (window.FileReader) {
						var reader = new FileReader();
						reader.onloadend = function (evt) {
							if (evt.target.readyState == FileReader.DONE) {
								callback(evt.target.result);
							}
						};
						// 包含中文内容用gbk编码
						reader.readAsText(file, 'utf-8');
					}
				}
			},
			addProperties (item) {
				let that = this
				this.getFileContent(item, async function (str) {
					this.md = (MD5(str))
					uni.showLoading({
						message    : '正在上传...',
						forbidClick: true,
						loadingType: 'spinner',
					});
					let params = new FormData();
					params.append("type", item.type);
					params.append("md5", that.md);
					params.append("fileInfo", item);
					const {data: res} = await this.axios.post("moments-web/moments-upload", params)

					if (res.error != 0) {
						that.$refs.popup.close()
						uni.hideLoading()
						uni.showToast({
							title   : res.error_msg,
							image   : '/static/fail.png',
							duration: 2000
						});
					} else {
						console.log(res)
					}
				})
				// let absX = this.imageList.length % this.colsValue
				// let absY = Math.floor(this.imageList.length / this.colsValue)
				// let x = absX * this.viewWidth
				// let y = absY * this.viewWidth
				// this.imageList.push({
				//   src: item,
				//   x,
				//   y,
				//   oldX: x,
				//   oldY: y,
				//   absX,
				//   absY,
				//   scale: 1,
				//   zIndex: 9,
				//   opacity: 1,
				//   index: this.imageList.length,
				//   id: this.guid(),
				//   disable: false,
				//   offset: 0,
				//   moveEnd: false
				// })
				// this.add.x = (this.imageList.length % this.colsValue) * this.viewWidth + 'px'
				// this.add.y = Math.floor(this.imageList.length / this.colsValue) * this.viewWidth + 'px'
				// this.sortList()
			},
			nothing () {
			},
			rpx2px (v) {
				return this.width * v / 750
			},
			guid () {
				function S4 () {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}

				return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			}
		}
	}
</script>

<style lang="scss" scoped>
	.con {
		padding: 30 rpx;

		.area {
			width: 100%;

			.view {
				display: flex;
				justify-content: center;
				align-items: center;

				.area-con {
					position: relative;

					.pre-image {
						width: 100%;
						height: 100%;
					}

					.del-con {
						position: absolute;
						top: 0rem;
						right: 0rem;
						padding: 0 0 20 rpx 20 rpx;

						.del-wrap {
							width: 36 rpx;
							height: 36 rpx;
							border-radius: 0 0 0 10 rpx;
							display: flex;
							justify-content: center;
							align-items: center;

							.del-image {
								width: 1rem;
								height: 1rem;
							}
						}
					}
				}
			}

			.add {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;

				.add-wrap {
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #EEEEEE;
				}
			}
		}
	}
</style>