<template>
	<view>
		<view v-if="loaded || list.id < 15" class="uni-indexed-list__title-wrapper">
			<text v-if="list.items && list.items.length > 0" class="uni-indexed-list__title">{{ list.key }}</text>
		</view>
		<view v-if="(loaded || list.id < 15) && list.items && list.items.length > 0" class="uni-indexed-list__list">
			<view v-for="(item, index) in list.items" :key="index" class="uni-indexed-list__item" hover-class="uni-indexed-list__item--hover">
				<view class="uni-indexed-list__item-container">
					<view class="uni-indexed-list__item-border" :class="{'uni-indexed-list__item-border--last':index===list.items.length-1}">
						<view style="margin-right: 20rpx;">
							<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#01B065' : '#e5e5e5'" size="24" @click="onClick(idx, index)" v-if="(showSelect && item.depart == 1) || item.depart == 0" />
						</view>
						<view style="width: calc(100% - 34px);" @click="item.depart == 1 ? jump(item.id) : onClick(idx, index)">
							<image style="width: 30px;height: 30px;margin-right: 10px;float: left;border-radius: 3px;"
							       :src="item.avatar"></image>
							<text class="uni-indexed-list__item-content">{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(idx, index) {
				this.$emit("itemClick", {
					idx,
					index
				})
			},
			jump(id) {
				//点击部门查看下级
				this.$emit("jumpClick", id)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-indexed-list__list {
		background-color: $uni-bg-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #f7f7f7;
	}

	.uni-indexed-list__item {
		font-size: $uni-font-size-lg;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-container {
		padding-left: $uni-spacing-row-lg;
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-indexed-list__item-border {
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		padding: $uni-spacing-row-lg;
		padding-left: 0;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #f7f7f7;
	}

	.uni-indexed-list__item-border--last {
		border-bottom-width: 0px;
	}

	.uni-indexed-list__item-content {
		flex: 1;
		font-size: 14px;
		/*vertical-align: super;*/
		width: calc(100% - 40px);
		float: left;
		word-break: break-all;
		line-height: 30px;
	}

	.uni-indexed-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-indexed-list__title-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		background-color: #f7f7f7;
	}

	.uni-indexed-list__title {
		padding: 6px 12px;
		line-height: $uni-font-size-sm;
		font-size: $uni-font-size-sm;
	}
</style>
