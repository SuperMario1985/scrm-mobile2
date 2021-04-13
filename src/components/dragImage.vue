<template>
	<view class="image-drag-sort">
		<view style="text-align: left" v-if="video">
			<video
					:controls="false"
					object-fit="fill"
					:src="commonUrl + video.local_path"
					style="width: 6.333rem /* 100/18.75 */;height:6.333rem;z-index: 1;position: relative;"
					disabled="disabled"
					webkit-playsinline
					playsinline
					loop
					x5-video-player-type="h5"
			>
			</video>
			<image
					class="img"
					@click="deleteVideo"
					style="height: 1rem;width: 1rem;position: absolute"
					src="../static/assets/shanchus2.png"
					mode="aspectFill"></image>
		</view>
		<view v-if="text">
			<view style="display: flex;height: 5.4rem;background-color: #F7F7F7">
				<image v-if="text.local_path"
				       style="height: 5rem;width:5rem;margin:0.2rem;background-color: #999999"
				       :src="commonUrl+text.local_path"
				       mode="aspectFill"></image>
				<view style="margin: 0 1rem">
					{{text.file_name}}
				</view>
				<image
						class="img"
						@click="deleteVideo"
						style="height: 1rem;width: 1rem;position: absolute"
						src="../static/assets/shanchus2.png"
						mode="aspectFill"></image>
			</view>
		</view>
		<view class="inner" v-if="!video&&!text">
			<movable-area class="movable-area">
				<view
						class="item"
						v-for="(item, index) in lists"
						:key="index"
						@click="imageTap(index)"
						@longpress="longtap"
						@touchend="touchend"
						@touchmove.stop="touchm">
					<image v-if="item.local_path"
					       class="img"
					       :src="commonUrl+item.local_path"
					       mode="aspectFill"></image>
				</view>
				<view class="moment-add" v-if="lists.length<9">
					<uni-icons type="plusempty" class="add-icon" @tap="imageUpload"></uni-icons>
				</view>
				<movable-view
						class="movable-view"
						:x="x"
						:y="y"
						direction="all"
						damping="5000"
						friction="1"
						v-show="active">
					<view
							class="item-move"
							:class="{'item-move-active': active}">
						<image v-if="lists[beginIndex]"
						       class="img"
						       :src="commonUrl+lists[beginIndex].local_path"
						       mode="aspectFill"></image>
					</view>
				</movable-view>
			</movable-area>
		</view>
	</view>
</template>
<script>
	import MD5 from "js-md5";
	import ImageCropper from "./invinbg-image-cropper.vue";

	let wrapW = 0, // 拖拽范围的总宽度
		wrapH = 0, // 拖拽范围的总高度
		wrapW2 = 0, // 可拖拽区域宽度
		wrapH2 = 0, // 可拖拽区域高度
		wrapTop = 0, // 拖拽范围的上边界坐标
		wrapLeft = 0, // 拖拽范围的左边界坐标
		wrapDragTop = 0, // 可拖拽范围的上边界坐标
		wrapDragLeft = 0, // 可拖拽范围的左边界坐标
		itemW = 0, // 拖拽元素的宽
		itemH = 0, // 拖拽元素的高
		itemXNun = 0 // 拖拽元素的列数

	export default {
		name   : 'image-drag-sort',
		data () {
			return {
				commonUrl   : this.$store.state.commonUrl,
				lists       : this.imgList,
				active      : false, // 是否拖拽状态
				flag        : false, // 是否可拖拽
				x           : 0,
				y           : 0,
				beginIndex  : null, // 当前拖拽元素的索引
				video       : this.videoList[0],
				text        : '',
				tempFilePath: '',
				cropFilePath: '',
				type        : null,
				cameraList  : [{
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
		props  : {
			imgList  : {
				default: function () {
					return []
				}
			},
			videoList: {
				default: function () {
					return []
				}
			},
			callBack : {
				type   : Function,
				default: null
			}
		},
		mounted () {
			if (this.lists.length > 0) {
				let l = this.lists.length
				if (l) { // 有图片时初始化
					this.init()
				}
			}
		},
		methods: {
			init () { // 初始化数据
				// 设置拖拽区域信息
				let wrap = uni.createSelectorQuery().in(this).select('.inner')
				wrap.boundingClientRect(data => {
					wrapW = data.width // 设置拖拽范围的总宽度
					wrapH = data.height // 设置拖拽范围的总高度
					wrapTop = data.top // 设置拖拽范围的上边界坐标
					wrapLeft = data.left // 设置拖拽范围的左边界坐标
					this.setNodeWH()
				}).exec()
			},
			setNodeWH () { // 设置拖拽元素的宽高
				// 获取拽拖元素的信息
				let item = uni.createSelectorQuery().in(this).select('.item')
				item.boundingClientRect(data => {
					if (data) {
						itemW = data.width // 拖拽元素的宽度
						itemH = data.height // 拖拽元素的高度
						this.setDragData()
					}
				}).exec()
			},
			setDragData () { // 设置拖拽区域及元素配置
				wrapDragTop = wrapTop + itemH / 2 // 设置拖拽范围上边距
				wrapDragLeft = wrapLeft + itemW / 2 // 设置可拖拽范围左边距
				wrapW2 = wrapW - itemW // 设置可拖拽区域宽度
				wrapH2 = wrapH - itemH // 设置可拖拽区域高度
				itemXNun = Math.round(wrapW / itemW) - 1 // 设置拖拽元素的列数
			},
			longtap (e) { // 长按
				const left = e.currentTarget.offsetLeft,
					top = e.currentTarget.offsetTop
				this.beginIndex = this.computationIndex({left: left, top: top}) // 获取所在位置索引
				this.x = left
				this.y = top
				this.active = true
				this.flag = true
			},
			computationIndex (e) { // 计算元素索引
				const left = e.left,
					top = e.top
				let index = 0, // 计算拖拽元素所在的索引位置
					x = Math.round(left / itemW), // 计算拖拽元素所在的横向索引位置
					y = Math.round(top / itemH), // 计算拖拽元素所在的纵向索引位置
					num = itemXNun * y
				if (x && !y) { // 第一行
					index = x
				}
				if (y) { // 第一行以下
					index = x + y + num
				}
				return index
			},
			touchm (e) { // 拖拽过程
				if (this.flag) {
					let x = e.touches[0].pageX - wrapDragLeft,
						y = e.touches[0].pageY - wrapDragTop
					if (x < 0) {
						x = 0
					}
					if (x > wrapW2) {
						x = wrapW2
					}
					if (y < 0) {
						y = 0
					}
					if (y > wrapH2) {
						y = wrapH2
					}
					this.x = x
					this.y = y
				}
			},
			touchend (e) { // 拖拽结束
				this.active = false
				const left = e.currentTarget.offsetLeft,
					top = e.currentTarget.offsetTop
				if (!this.flag || this.x === left && this.y === top) {
					return
				}
				const x = this.x, // 计算拖拽横向距离
					y = this.y, // 计算拖拽纵向距离
					itemNum = this.lists.length - 1 // 拖拽元素的总数量
				let endIndex = this.computationIndex({left: x, top: y}) // 获取所在位置索引
				if (endIndex > itemNum) {
					endIndex = itemNum
				}
				// 交换位置
				const beginIndex = this.beginIndex // 当前拖拽元素索引
				let data = this.lists,
					tem = data[beginIndex]
				data[beginIndex] = data[endIndex]
				data[endIndex] = tem
				this.flag = false
			},
			imageTap (i) { // 图片点击事件
				uni.showActionSheet({
					itemList: ['全屏预览大图', '删除（不可撤销）'],
					success : res => {
						if (res.tapIndex) { // 删除
							this.imageDel(i)
						} else { // 预览
							this.previewImage(i)
						}
					}
				})
			},
			previewImage (i) { // 预览图片
				const url = []
				for (let item of this.lists) {
					url.push(this.commonUrl + item.local_path)
				}
				uni.previewImage({
					current: i,
					urls   : url
				})
			},
			imageDel (i) { // 删除图片事件
				this.lists.splice(i, 1)
				this.callBack(2, this.lists)
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
			imageUpload () {
				uni.showActionSheet({
					title   : '',
					itemList: ['从手机相册选择', '拍摄视频', '从内容引擎选择图片（9张）', '从内容引擎选择视频', '从内容引擎选择图文'],
					success : async (e) => {
						switch (e.tapIndex) {
							case 0:
								this.type = 2
								this.getAlbum()
								break;
							case 1:
								this.type = 3
								this.chooseVideo()
								break
							case 2:
								this.$store.commit("setMomentImage", this.lists);
								this.type = 2
								uni.navigateTo({
									url: '/pages/moments/filing?type=' + this.type
								})
								break
							case 3:
								this.lists = []
								this.type = 3
								uni.navigateTo({
									url: '/pages/moments/filing?type=' + this.type
								})
								break
							case 4:
								this.type = 4
								uni.navigateTo({
									url: '/pages/moments/filing?type=' + this.type
								})
								break
						}
						this.$store.commit("setMomentImage", this.Lists);
					}
				})
			},
			chooseVideo () {
				// 上传视频
				uni.chooseVideo({
					maxDuration: 60,
					count      : 1,
					camera     : this.cameraList[0].value,
					sourceType : ['album', 'camera'],
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
								uni.hideLoading()
								if (!res2.data.local_path) {
									let params2 = new FormData();
									params2.append("fileInfo", file);
									params2.append("type", file.type);
									params2.append("md5", that.md);
									const {data: res3} = await that.axios.post("moment/moments-upload", params2);
									if (res3.data) {
										res3.data.attchment = ''
										res3.data.sort = 1
										that.video = res3.data
										that.callBack(that.type, [that.video])
									}
								} else {
									if (res2.data) {
										res2.data.attchment = ''
										res2.data.sort = 1
										that.video = res2.data
										that.callBack(that.type, [that.video])
									}
								}

								uni.hideLoading()
							}
						})
						// this.src = responent.tempFilePath;  //头条
					}
				})
			},
			getAlbum () {
				uni.chooseImage({
					count     : 6, //默认9
					sizeType  : ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success   : (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
						for (let item of res.tempFiles) {
							let file2 = item
							let that = this
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
										res2.data.attchment = ''
										if (that.lists.length >= 9) {
											uni.showToast({
												title   : '只能选9张图',
												image   : '/static/fail.png',
												duration: 2000
											});
											return
										}
										res2.data.sort = that.lists.length + 1
										that.lists.push(res2.data)
									}
								}
							})
						}
						this.callBack(this.type, this.lists)
					},
					fail      : (err) => {
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
				});
			},
			confirm (e) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath
			},
			cancel () {
				console.log('canceled')
			},
			chooseImage (index) { // 选择图片
				const count = 9 - this.lists.length,
					sourceType = index > 0 ? 'camera' : 'album'
				uni.chooseImage({
					count     : count,
					sizeType  : ['original', 'compressed'],
					sourceType: [sourceType],
					success   : res => {
						uni.showLoading({
							title: '上传中'
						})
						this.upload(res.tempFilePaths)
					}
				})
			},
			upload (e) { // 可多图上传，不需要的可改成单一上传
				uni.hideLoading()
				let data = this.lists
				for (let i = 0, l = e.length; i < l; i++) {
					data.push(e[i])
				}
				this.lists = data
				// 可写上传图片方法或者将本地图片路径传给父组件
			},
			deleteVideo () {
				this.video = '';
				this.lists = []
				this.text = ''
				this.callBack(3, [])
			},
		},
		watch  : {
			imgList () { // 监听数组变化
				if (this.$route.query.type && this.$route.query.type == 1) {
					this.lists = this.imgList
					this.text = ''
					let l = this.imgList.length
					if (l > 0) { // 有图片或图片数量改变时重新初始化
						this.init()
					}
				} else if ((this.$route.query.type && this.$route.query.type == 4) || (this.imgList[0] && this.imgList[0].type == 4)) {
					if (typeof this.imgList != Object) {
						this.text = this.imgList[0]
					} else {
						this.text = this.imgList
					}
					this.lists = []
				} else {
					this.lists = this.imgList
					let l = this.imgList.length
					if (l > 0) { // 有图片或图片数量改变时重新初始化
						this.init()
					}
				}
			},
			videoList () {
				this.video = this.videoList[0]
			}
		}
	}
</script>

<style scoped lang="less">
	.img {
		width: 100%;
		height: 100%;
	}

	.image-drag-sort {
		width: 100%;
		padding: 30 upx;
		box-sizing: border-box;
	}

	.movable-area {
		width: 100%;
		height: auto;
		display: flex;
		flex-flow: wrap;
	}

	.item {
		overflow: hidden;
		height: 5.5rem;
		width: 5.5rem;
		margin: 0.3rem;
	}

	.moment-add {
		background-color: #F7F7F7;
		height: 5.5rem /* 50/18.75 */;
		width: 5.5rem /* 50/18.75 */;
		margin-top: 0.3rem;

		.add-icon {
			width: 5.5rem /* 50/18.75 */;
			height: 5.5rem /* 50/18.75 */;
			display: block;
			vertical-align: top;
			font-size: 1.6rem /* 30/18.75 */ !important;
			line-height: 5.5rem /* 50/18.75 */;
		}

	}

	.img-upload-btn {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #F5F5F5;
	}

	.img-upload-btn .icon {
	}

	.img-upload-btn .text {
		color: #CCCCCC;
	}

	.movable-view {
		width: 31%;
		height: calc(31vw * .7);
	}

	.item-move {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 12 upx;
	}

	.item-move-active {
		box-shadow: 0 0 30px #000;
	}

	.prompt {
		font-size: 28 upx;
		line-height: 40 upx;
		color: #999;
		margin-top: 28 upx;
	}
</style>
