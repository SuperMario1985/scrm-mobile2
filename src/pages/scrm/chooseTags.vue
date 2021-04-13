<template>
	<view class="box">
		<uni-nav-bar left-icon="back" title="标签筛选" @clickLeft="back" background-color="#5284ec"
		             color="#fff"></uni-nav-bar>
		<!--		退出确认弹窗-->
		<uni-popup ref="visible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">确定本次编辑?</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="unSave">取消</text>
					<text class="uni-tip-button" @click="save">确定</text>
				</view>
			</view>
		</uni-popup>
		<view class="tags" v-if="tagList.length == 0">
			<image src="../../static/customDetail/tagEmpty.png" class="tags-empty-img"></image>
			<view style="text-align: center;margin-top: 23px;color: #999999;font-size: 13px;">暂无标签</view>
		</view>
		<view class="tags" v-if="tagList.length > 0">
			<uni-list>
				<uni-list-item :show-arrow="false" v-for="(item,index) in tagList">

					<template v-slot:body>
						<view style="margin-bottom: 0.8rem  /* 15/18.75 */;">{{item.name}}</view>
						<view>
							<view class="tags-li tags-grey" v-for="(tag,tagIndex) in item.data"
							      :class="[ hasTagsId.indexOf(tag.id) != -1 ? 'tags-blue' : '' ]"
							      @click="choose(tag.id)">
								{{tag.tagname}}
							</view>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		<view class="footer" v-if="tagList.length > 0">
			<button type="primary" class="btn" @click="save">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		name      : "chooseDepartment",
		inject    : ['getParameter'],
		components: {},
		data () {
			return {
				commonUrl: this.$store.state.commonUrl,
				tagList  : [],//标签数据
				hasTagsId: localStorage.getItem('hasTagsId') ? localStorage.getItem('hasTagsId').split(',') : [],//已选标签id数组
			}
		},
		onLoad () {
			uni.setNavigationBarTitle({
				title: '选择标签'
			});

			if (this.hasTagsId.length > 0) {
				for (let i = 0; i < this.hasTagsId.length; i++) {
					this.hasTagsId[i] = Number(this.hasTagsId[i])
				}
			}
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('token', 'TWFpblVzZXItYjRjMGE5YjU0NWNmMTczNTYwY2Y1MzI0YWQ5ODBlMGE=')
			this.getData()
		},
		methods   : {
			async getData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("work-tag-group/tag-group", {
					corp_id   : localStorage.getItem('corpid'),
					is_not_add: 0
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.tagList = res.data
					uni.hideLoading();
				}
			},
			//选择标签
			choose (id) {
				if (this.hasTagsId.indexOf(id) == -1) {
					this.hasTagsId.push(id)
				} else {
					this.hasTagsId.splice(this.hasTagsId.indexOf(id), 1)
				}
			},
			//确定
			save () {
				this.$store.commit("setHasTagsId", this.hasTagsId)
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				beforePage.getData()
				uni.navigateBack()
			},
			//返回
			back () {
				// this.$refs['visible'].open()
				this.unSave()
			},
			unSave () {
				// this.$refs['visible'].close()
				uni.navigateBack()
			},
		}
	}
</script>

<style scoped lang="less">
	.box {
		background: #FFF;
		text-align: left;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 0.8rem /* 15/18.75 */;
		overflow-y: auto;
	}

	.tags {
		padding: 0 0 2.667rem /* 50/18.75 */;
		text-align: left;
		overflow: hidden;
	}

	.tags-empty-img {
		margin: 8rem /* 150/18.75 */ auto 0;
		display: block;
		width: 60px;
		height: 60px;
	}

	.tags-li {
		height: 1.76rem /* 33/18.75 */;
		line-height: 1.92rem /* 36/18.75 */;
		box-sizing: border-box;
		margin: 0 0.533rem /* 10/18.75 */ 0.533rem 0;
		border-radius: 0.853rem /* 16/18.75 */;
		float: left;
		padding: 0 0.853rem /* 16/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
	}

	.tags-grey {
		background: #F4F4F4;
		color: #666;
	}

	.tags-blue {
		background: #E7EFFC;
		color: #5283EC;
	}

	.uni-list-item:hover {
		background: transparent;
	}

	.footer {
		height: 2.667rem /* 50/18.75 */;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		border-top: 1px solid rgba(241, 244, 246, 1);
		background: #FFF;
	}

	.btn {
		background-color: #5283EC;
		color: #E7EFFC;
		float: right;
		font-size: 0.8rem /* 15/18.75 */;
		height: 1.6rem /* 30/18.75 */;
		line-height: 1.6rem /* 30/18.75 */;
		border-radius: 0.8rem /* 15/18.75 */;
		margin: 0.533rem /* 10/18.75 */ 0.8rem /* 15/18.75 */;
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

	/deep/ .uni-tip-button {
		font-size: 16px;
	}

	/deep/ .uni-list-item__container {
		display: block;
	}
</style>
