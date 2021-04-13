<template>
	<view class="comment-box">
		<view class="uni-flex uni-row moment-head">
			<view class="flex-item">
				<uni-icons type="arrowleft" style="color: #FFF" @click="cancelKeep" size="26"/>
			</view>
			<view class="flex-item" @click="handlePublish">
				<button type="default" class="publish_btn" :disabled="true">发表</button>
			</view>
		</view>
		<view class="blank"></view>

		<view class="moment-info-box">
			<view class="r-top">
      <textarea style="width: 100%;" :maxlength="500" placeholder-style="color:rgba(153,153,153,1);"
                v-model="publishForm.context"
                placeholder="这一刻的想法..."/>
			</view>
			<view class="uploadImg">
				<shmily-drag-image :firstImage="firstImage" :number="9" :list.sync="imgList" :publishType="publishType"
				                   style=" width: 100%;"
				                   :call-back="replyMsg"></shmily-drag-image>
			</view>
		</view>
<!--		<Footer v-if="is_show_copyright == 1" style="position: fixed;bottom: 0;left: 0;right: 0;"></Footer>-->
	</view>

</template>

<script>

	import FilingCabinet from "@/components/FilingCabinet";
	import dragImage from '@/components/dragImage.vue';
	import shmilyDragImage from '@/components/shmily-drag-image.vue'
	import Footer from "../../components/footer/footer.vue";

	const defaultValue = {
		corpid : localStorage.getItem('corpid'),
		is_edit: 1
	}
	export default {
		name      : "publish",
		inject    : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden', 'getContext'],
		components: {FilingCabinet, dragImage, shmilyDragImage,Footer},
		data () {
			return {
				firstImage       : [],
				listQuery        : Object.assign({}, defaultValue),
				commonUrl        : this.$store.state.commonUrl,
				h5Url            : this.$store.state.h5Url,
				showFilingCabinet: false,
				wx               : false,
				wxWork           : false,
				jsApiList        : '',
				timestamp        : '',
				input            : '',
				timeId           : '',
				publishForm      : {info: []},
				imgList          : [],
				videoList        : [],
				md               : '',
				index            : null,
				imgObj           : [],
				edit_id          : '',
				publishType      : null,
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
			}
		},

		methods: {
			limit () {

			},
			async getPublishDetail (data) {
				data.corpid = localStorage.getItem('corpid')
				data.userid = this.getParameter('user_id')
				const {data: res} = await this.axios.post('moments-web/moment-add', data)
				if (res.error != 0) {
					uni.hideLoading()
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					if (res.data) {
						if (!localStorage.getItem('momentId')) {
							this.edit_id = res.data.id
							let {context, info, type} = res.data
							this.publishForm = {context, info, type}
							this.publishType = parseInt(res.data.type)
							if (res.data.type == 2) {
								this.imgList = res.data.info
								this.firstImage = res.data.info
							} else if (res.data.type == 4) {
								this.imgList = res.data.info
								this.publishForm.info = res.data.info
							} else if (res.data.type == 3) {
								this.imgList = res.data.info
							}
						} else {
							let {context, info, id: momentId, type} = res.data
							this.publishForm.info = []
							this.publishForm = {context, info, momentId, type}
							this.publishType = parseInt(res.data.type)
							if (res.data.type == 2) {
								this.imgList = res.data.info
								this.firstImage = res.data.info
							} else if (res.data.type == 4) {
								this.imgList = res.data.info
								this.publishForm.info = res.data.info
							} else if (res.data.type == 3) {
								this.imgList = res.data.info
							}
						}
					} else {
					}
				}
			},
			inputConfirm () {
			},
			replyMsg (type, content) {
				this.imgList = content
				this.publishType = type
				this.publishForm.type = type
				if (type == 2) {
					this.publishForm.info = content
				} else if (type == 3) {
					this.publishForm.info = content
				} else if (type == 4) {
					this.publishForm.info = content
				}
			},
			goList () {
				localStorage.setItem('momentId', '')
				localStorage.setItem('attachmentId', '')
				let url = this.h5Url + '/h5/pages/moments/list?corpid=' + localStorage.getItem('corpid') + '&user_id=' + this.getParameter('user_id') + '&agentId=' + this.getParameter('agentId')
				// let url = '/pages/moments/list?corpid=' + localStorage.getItem('corpid') + '&user_id=' + this.getParameter('user_id') + '&agentId=' + localStorage.getItem('agent_id')
				// uni.navigateTo({
				// 	url: url
				// })
				window.location.href = url
			},
			cancelKeep () {
				let that = this
				if ((this.publishForm.context || this.publishForm.info.length > 0) && !localStorage.getItem('momentId')) {
					uni.showModal({
						content: '保留此次编辑？',
						success: function (res) {
							if (res.confirm) {
								that.publishForm.save_edit = 1
								that.handleKeep()
							} else if (res.cancel) {
								that.publishForm.save_edit = ''
								that.publishForm.is_edit = 2
								that.handleKeep()
							}
						}
					});
				} else {
					this.goList()
				}
			},
			async handleKeep () {
				this.publishForm.corpid = localStorage.getItem('corpid')
				this.publishForm.userid = this.getParameter('user_id')
				this.publishForm.edit_id = this.edit_id
				if (this.publishForm.info.length <= 0) {
					this.publishForm.type = 1
				}
				const {data: res} = await this.axios.post('moments-web/moment-add', this.publishForm)
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.goList()
				}
			},
			async handlePublish () {
				this.publishForm.corpid = localStorage.getItem('corpid')
				this.publishForm.userid = this.getParameter('user_id')
				if (this.publishForm.info.length <= 0) {
					this.publishForm.type = 1
				}
				if (this.publishForm.context || this.publishForm.info.length > 0) {
					const {data: res} = await this.axios.post('moments-web/moment-add', this.publishForm)
					if (res.error != 0) {
						uni.showToast({
							title   : res.error_msg,
							image   : '/static/fail.png',
							duration: 2000
						});
					} else {
						if (res.msg && res.msg != '') {
							uni.showToast({
								title   : res.msg,
								image   : '/static/fail.png',
								duration: 2000
							});
							return
						}
						this.goList()
					}
				} else {
					uni.showToast({
						title   : '请输入内容',
						image   : '/static/fail.png',
						duration: 2000
					});
				}
			},
		},
		onReady () {
		},
		mounted () {
			this.listQuery.userid = this.getParameter('user_id')
			this.getPublishDetail(this.listQuery)
			// 重新编辑
			if (localStorage.getItem('momentId')) {
				this.listQuery.momentId = localStorage.getItem('momentId')
				this.listQuery.is_edit = 1
			} else {
				this.listQuery.is_edit = 1
			}
			this.is_show_copyright = localStorage.getItem('is_show_copyright')
		},
		onShow () {
			let _this = this
			_this.$store.dispatch('setWx', () => {
				_this.initPage()
			})
		},
	}
</script>

<style scoped>
	@import "~@/static/css/uni.css"
</style>

<style scoped lang="less">
	/deep/ uni-page-head {
		z-index: 999999999;
	}

	.publish_btn {
		height: 1.5rem;
		background-color: #FFF;
		font-size: 14px;
		line-height: 1.5rem;
		width: 3.4rem;
	}

	.moment-add {
		background-color: #F7F7F7;
		height: 5.5rem /* 50/18.75 */;
		width: 5.5rem /* 50/18.75 */;

		.deleted-icon {
			height: 1rem;
			width: 1rem;
			margin: 0px 0.2rem;
			position: absolute;
			right: 0.1rem;
		}

		.add-icon {
			width: 5.5rem /* 50/18.75 */;
			height: 5.5rem /* 50/18.75 */;
			display: block;
			vertical-align: top;
			font-size: 1.6rem /* 30/18.75 */ !important;
			line-height: 5.5rem /* 50/18.75 */;
		}
	}

	.moment-head {
		justify-content: space-between;
		align-items: center;
		background-color: #5077B7;
		color: #FFF;
		height: 3rem;
		line-height: 3rem;
		padding-right: 1rem;
	}

	.uploadImg {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}


	.moment-info-box {
		padding: 0.533rem /* 10/18.75 */;
	}

	.r-top {
		text-align: left;
		padding: 10 rpx;
		background: #FFFFFF;
		border-radius: 20 rpx;
		width: 19rem;
		margin-bottom: 0.5rem;

		.uni-textarea {
			width: 100%;
		}

		.uni-textarea-textarea {
			width: 100%;
		}
	}

	.r-top-t {
		display: flex;
		justify-content: space-between;
		font-family: PingFang SC;
		font-weight: 400;
		line-height: 20px;
		color: rgba(153, 153, 153, 1);
		opacity: 1;
	}
</style>