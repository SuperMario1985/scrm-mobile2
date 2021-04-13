<template>
	<view class="uni-steps">
		<view :class="[direction==='column'?'uni-steps__column':'uni-steps__row']">
			<view :class="[direction==='column'?'uni-steps__column-text-container':'uni-steps__row-text-container']"
			      v-for="(part,partIndex) in options">
				<view style="margin: 0.533rem  /* 10/18.75 */ 0;text-align: left;font-size: 0.8rem  /* 15/18.75 */;font-weight: 700;">
					{{part.date}}
				</view>

				<view v-for="(item,index) in part.data" :key="index"
				      :class="[direction==='column'?'uni-steps__column-text':'uni-steps__row-text']"
				      style="margin-top: 10px;">
					<view :class="[direction==='column'?'uni-steps__column-circle':'uni-steps__row-circle']"
					      :style="{backgroundColor:deactiveColor}"></view>
					<view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line']"></view>
					<template v-if="type == 1">

						<text :class="[direction==='column'?'uni-steps__column-title':'uni-steps__row-title']">
							{{item.time}}
						</text>
						<text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']">
							{{item.content}}
						</text>
					</template>
					<template v-if="type == 2">
						<text :class="[direction==='column'?'uni-steps__column-title':'uni-steps__row-title']">
							{{item.time}}
						</text>
						<image class="custom-info-edit-icon"
						       src="../../static/customDetail/edit-icon2.png" @click="edit(item)"
						       v-if="item.can_edit == 1" v-has="'client-addFollow'"></image>

						<view v-if="item.record_type==1">
							<text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']">
								<text style="color: #1989FA;">{{item.name}}</text>
								<span style="color:red">【打电话】</span>联系了他
							</text>
							<view :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"
							      style="word-wrap:break-word;">
								<free-audio style="height: 2rem" v-if="item.call_info.file&&isPlay"
								            :url='item.call_info.file'></free-audio>
							</view>
						</view>
						<view v-if="item.record_type!=1">
							<text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']">
								<image style="width: 0.8rem;height: 0.8rem;margin: 0 0.1rem"
								       src="../../static/assets/call.png" v-if="item.record_type==1"></image>
								<text style="color: #1989FA;">{{item.name}}</text>
								发表：<span style="color: red;" v-if="item.follow_status != ''">【{{item.follow_status}}】{{item.context}}</span>
							</text>
							<text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"
							      style="word-wrap:break-word;">
								{{item.record}}
							</text>
							<view v-if="item.file.length > 0" style="text-align: left;margin-left: 15px;">
								<image class="img"
								       :src="$store.state.commonUrl + img" v-for="(img,imgIndex) in item.file"
								       @click="preview(partIndex,index,imgIndex)"></image>
							</view>
						</view>
					</template>
					<template v-if="type == 3">
						<view style="margin: -12px 0 10px 0;">
							<text :class="[direction==='column'?'uni-steps__column-title':'uni-steps__row-title']">
								{{item.time}}
								<text :style="{'color':item.status_color}"
								      style="margin-left: 0.427rem  /* 8/18.75 */;">{{item.status_title}}
								</text>
							</text>
							<text style="width: 8rem  /* 150/18.75 */;float: right;">
								<cmdProgress :percent="item.per" stroke-color="#5284EC"></cmdProgress>
							</text>
						</view>
						<text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"
						      style="word-wrap:break-word;background: #F9F9F9;border-radius: 4px;padding: 12px;box-sizing: border-box;line-height: 20px;">
							{{item.per_desc}}
						</text>
					</template>
				</view>
				<view
						v-if="previewShow"
						class="uni-margin-wrap preview-box">
					<swiper
							class="swiper swiper-box"
							:current-item-id="previewIndex">
						<swiper-item v-for="(previewImg, key) in options[optionIndex].data[index].file" :key="key"
						             :item-id="String(key)">
							<view
									class="swiper-item"
									@touchmove="touchMove"
									@touchstart="touchStart"
									@touchend="touchEnd"
									@click="closePreview">
								<img
										:src="$store.state.commonUrl + previewImg"
										width="75%"
										class="img-info"/>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	import cmdProgress from '../cmd-progress/cmd-progress.vue'
	import freeAudio from '../free-audio.vue'


	export default {
		name      : 'UniSteps',
		components: {
			uniIcons, cmdProgress, freeAudio
		},
		props     : {
			direction    : {
				// 排列方向 row column
				type   : String,
				default: 'row'
			},
			deactiveColor: {
				// 未激活状态颜色
				type   : String,
				default: '#5283EC'
			},
			options      : {
				type: Array,
				default () {
					return []
				}
			}, // 数据
			type         : {
				type   : Number,
				default: 1
			} // 1互动轨迹，2跟进记录,3待办事项详情
		},
		filters   : {
			dateFormat: function (time) {
				var minutes = parseInt(time / 60);
				var second = parseInt(time % 60);
				let m = (minutes < 10 ? '0' + minutes : minutes);
				let s = (second < 10 ? '0' + second : second);
				if (isNaN(m) || isNaN(s)) {
					m = '--'
					s = '--'
				}
				return `${m}:${s}`
			}
		},
		data () {
			return {
				index       : 0,
				optionIndex : 0,
				previewShow : false,
				previewIndex: 0,
				touchStartX : 0,
				touchStartY : 0,
				duration    : [],
				isplay      : false,
				clickIndex  : -1,
				isPlay:true
			}
		},
		beforeDestroy () {
			this.isPlay = false
		},
		methods   : {
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
			//预览图片
			preview (partIndex, index, imgIndex) {
				this.previewIndex = String(imgIndex)
				this.index = index
				this.optionIndex = partIndex
				console.log(partIndex, 'partIndex')
				this.previewShow = true
			},
			edit (item) {
				this.$emit('editFollowRecort', item);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.audio_container {
		width: 108px;
		height: 25px;
		line-height: 25px;
		background: #1890FF;
		border-radius: 3px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #FFF
	}

	.uni-steps__column-text {
		padding: 0.32rem 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: relative;
	}

	.uni-steps__row-title {
		font-size: $uni-font-size-base;
		line-height: 16px;
		text-align: center;
	}

	.uni-steps__column-title {
		font-size: 0.64rem;
		color: #999;
		text-align: left;
		line-height: 0.533rem;
		margin-bottom: 0.64rem;
		width: calc(100% - 15px);
		margin-left: 15px;
		margin-top: -6px;
	}

	.uni-steps__row-desc {
		font-size: 12px;
		line-height: 14px;
		text-align: center;
	}

	.uni-steps__column-desc {
		font-size: 0.693rem;
		text-align: left;
		line-height: 0.853rem;
		color: #333;
		width: calc(100% - 15px);
		margin-left: 15px;
		margin-bottom: 10px;
		word-wrap: break-word;
		display: inline-block;
	}

	.uni-steps__row-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-container {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		width: 30px;
		flex-direction: column;
	}

	.uni-steps__row-line-item {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		height: 14px;
		line-height: 14px;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__row-line {
		flex: 1;
		height: 1px;
		background-color: $uni-text-color-grey;
	}

	.uni-steps__column-line {
		position: absolute;
		top: 0.64rem;
		left: 0.107rem;
		height: calc(100% - 0.533rem);
		border-left: 2px solid #F6F6F6;
	}

	.uni-steps__row-line--after {
		transform: translateX(1px);
	}

	.uni-steps__column-line--after {
		flex: 1;
		transform: translate(0px, 1px);
	}

	.uni-steps__row-line--before {
		transform: translateX(-1px);
	}

	.uni-steps__column-line--before {
		height: 6px;
		transform: translate(0px, -1px);
	}

	.uni-steps__row-circle {
		width: 5px;
		height: 5px;
		border-radius: 100px;
		background-color: $uni-text-color-grey;
		margin: 0px 3px;
	}

	.uni-steps__column-circle {
		width: 5px;
		height: 5px;
		border-radius: 100px;
		background-color: $uni-text-color-grey;
	}

	.img {
		width: 3.627rem;
		height: 3.627rem;
		border-radius: 0.267rem;
		margin: 0 0.533rem 0.533rem 0;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
		height: 100%;
	}

	.hide {
		display: none;
	}

	.custom-info-edit-icon {
		width: 0.587rem;
		height: 0.587rem;
		margin-left: 0.25rem;
		position: absolute;
		right: 0;
		cursor: pointer;
	}

	.preview-box {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
		z-index: 99999999;
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

	.uni-slider-thumb{
		width: 15px;
		height: 15px;
	}
</style>
