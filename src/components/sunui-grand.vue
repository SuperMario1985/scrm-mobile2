<template name='sunui-grand'>
	<view>
		<view v-show="isHide">
			<view class="sunui-grand-hide-bg">
				<view class="sunui-grand-summary" style="display:block;white-space: pre-wrap;word-wrap: break-word;">{{
					content }}
				</view>
				<view class="sunui-grand-show-btn" v-show="clamp>=4">
					<view @tap="show" :style="{color:color}" v-if="content&&content.length>100">
						<text>{{expandText}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-show="!isHide">
			<view class="sunui-grand-show-bg">
				<view style="display:block;white-space: pre-wrap;word-wrap: break-word;">
					{{ content }}
				</view>
				<view class="sunui-grand-hide-btn" v-show="shinkText!=''" v-if="content&&content.length>100">
					<view @tap="hide" :style="{color:color}">
						{{shinkText=='true' || shinkText==true?'':shinkText}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	export default {
		data () {
			return {
				isHide: true
			};
		},
		name   : 'sunui-grand',
		props  : {
			clamp     : {
				type   : [Number, String],
				default: `4`
			},
			color     : {
				type   : String,
				default: `#1D82FE`
			},
			content   : {
				type   : [String, Object],
				default: ``
			},
			bg        : {
				type   : String,
				default: `#E6E6E6`
			},
			expandText: {
				type   : String,
				default: "全文"
			},
			shinkText : {
				type   : String,
				default: "收起全文"
			}
		},
		created () {
			_self = this;
		},
		methods: {
			show () {
				let _this = this;
				_this.isHide = false;
			},
			hide () {
				let _this = this;
				_this.isHide = true;
			}
		}
	}
</script>

<style>
	.sunui-grand-hide-bg {
		font-size: 15px;
		letter-spacing: 0.01rem;
		padding: 0.2rem;
		padding-bottom: 0;
		position: relative;
	}

	.sunui-grand-show-bg {
		font-size: 15px;
		letter-spacing: 0.01rem;
		padding: 0.2rem;
		padding-bottom: 0;
		position: relative;
	}

	.sunui-grand-summary {
		overflow: hidden;
		text-overflow: clip;
		display: -webkit-box;
		-webkit-box-orient: vertical;
    line-height: 1rem;
	}

	.sunui-grand-show-btn {
		text-align: left;
	}

	.sunui-grand-hide-btn {
		text-align: left;
	}
</style>
