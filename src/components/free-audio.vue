<template>
	<!-- 音频播放器组件 -->
	<view v-if='url' class='flex justify-between align-center audio'>
		<view class='mr-3' @click='start'>
			<image src='../static/assets/play.png' class='icon' v-show='!status'></image>
			<image src='../static/assets/pause.png' class='icon' v-show='status'></image>
		</view>
		<view class='flex-1' style="height: 15px">
			<slider @change='changeAudio' :activeColor='activeColor' :min='0' :max='duration.toFixed(0)'
			        :value='currentTime.toFixed(0)' :step='0.1'></slider>
		</view>
		<view class='ml-3' style="margin-top: 0.68rem">
			<span>{{getTime(Math.round(currentTime))}}</span>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				context    : null,
				currentTime: 0,
				duration   : 100,
				status     : false
			}
		},
		props  : {
			url        : String,
			activeColor: {
				type   : String,
				default: '#0E7EFC'
			},
			startPic   : String,
			endPic     : String
		},
		created () {
			this.context = uni.createInnerAudioContext();
			this.context.src = this.url;
			this.onTimeUpdate();
			this.onCanplay();
			this.onEnded();
		},
		destroyed () {
			this.context.pause();
		},
		methods: {
			start () { //点击播放
				if (this.status) {
					this.context.pause();
					this.status = !this.status;
				} else {
					this.context.play()
					this.status = !this.status;
				}
			},
			onCanplay () { //进入可播放状态
				this.context.onCanplay(() => {
					this.context.duration;
					setTimeout(() => {
						this.duration = this.context.duration;
					}, 1000)
				})
			},
			onTimeUpdate () { //音频播放进度
				this.context.onTimeUpdate(() => {
					this.currentTime = this.context.currentTime;
				})
			},
			onEnded () { //播放结束
				this.context.onEnded(() => {
					this.status = false;
					this.currentTime = 0;
				})
			},
			changeAudio (e) {
				this.start();
				this.context.seek(e.detail.value)
				this.start();
			},
			getTime (time) {
				let m = parseInt(time / 60);
				let s = time % 60;
				return this.towNum(m) + ':' + this.towNum(s);
			},
			towNum (num) {
				if (num >= 10) {
					return num;
				} else {
					return '0' + num;
				}
			}
		}
	}
</script>

<style>
	.audio {
		background: #F4F4F4;
		padding: 0.533rem;
	}

	.icon {
		width: 1.6rem;
		height: 1.6rem;
		margin-top: 0.213rem;
	}

</style>
