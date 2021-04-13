<template>
	<view class="box content_head">
		<uni-nav-bar left-icon="back" @clickLeft="back" left-text="返回" background-color="#5284ec" color="#fff">
			<uni-search-bar radius="30" placeholder="请输入搜索内容" clearButton="always"
			                cancelButton="none" @input="search" ref="searchBar" v-if="searchVisible"/>
			<view slot="right">
				<uni-icons type="search" size="22" @click="showSearch" color="#fff"
				           style="line-height: 46px;"></uni-icons>
			</view>
		</uni-nav-bar>
		<view v-show="usersList.length == 0" v-if="isReady">
			<img src="../static/scrm/empty.png" alt="" class="empty-img">
		</view>
		<uni-indexed-list :options="usersList" :showSelect="false" @click="bindClick"
		                  @jump="jumpClick" ref="uniList" v-show="usersList.length > 0"
		                  v-if="isReady"></uni-indexed-list>
		<view class="footer content_head" v-show="usersList.length > 0">
			<scroll-view class="scroll-view" scroll-x="true" scroll-with-animation>
				<view class="scroll-view-item" @click="clearItem(selectArr)" :id="'view'+selectArr.id">
					<text v-if="selectArr.depart == 1" class="tag">{{selectArr.name}}</text>
					<image style="width: 30px;height: 30px;margin-right: 10px;vertical-align: middle;"
					       :src="selectArr.avatar" v-if="selectArr.depart == 0"></image>
				</view>
				<uni-icons type="close"
				           style="color: #2C3E50;font-size: 0.853rem  /* 16/18.75 */;" @click="clear"
				           v-if="selectArr != ''"></uni-icons>
			</scroll-view>
			<button type="primary" class="btn" @click="save">确定</button>
		</view>
	</view>
</template>

<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"

	export default {
		name      : "chooseStaffSelect",
		props     : {
			callBack: {
				type   : Function,
				default: null
			},
			isAll   : {
				type   : Number,
				default: 0,//1全部，0根据可见范围
			}
		},
		inject    : ['getParameter'],
		components: {uniIndexedList},
		data () {
			return {
				commonUrl    : this.$store.state.commonUrl,
				isReady      : false,
				id           : '',//部门id，用于选择下级
				id2          : [],//部门id，用于返回上级做的缓存
				usersList    : [],//成员列表
				selectList   : '',//选择的id
				inputValue   : '',//搜索值
				isFresh      : false,//是否去了下一级
				searchVisible: false,//搜索框的显示与隐藏
				selectArr    : '',//已选择的所有数据
			};
		},
		methods   : {
			async getData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("work-party/get-depart-user", {
					corp_id: localStorage.getItem('corpid'),
					uid    : localStorage.getItem('uid'),
					user_id: localStorage.getItem('user_id'),
					id     : this.id,
					name   : this.inputValue,
					is_all : this.isAll
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.usersList = res.data.users
					this.isReady = true
					uni.hideLoading();

					this.usersList.map(x => {
						x.data.map(y => {
							if (y.depart == 1) {
								//部门
								y.disabled = true
							} else {
								//成员
								y.disabled = false
							}
						})
					})

					if (this.isFresh) {
						this.usersList.map(x => {
							x.data.map(y => {
								if (this.selectList == y.id) {
									y.checked = true
								}
							})
						})
						this.$refs.uniList.setList()
					}
				}
			},
			bindClick (e) {
				let arr = ''
				let arr1 = {}
				arr = e.item.id
				arr1 = e.item

				if (e.item.depart == 0) {
					//选择成员
					if (this.selectList == arr) {
						this.selectList = ''
						this.selectArr = ''
						this.usersList.map(x => {
							x.data.map(y => {
								y.checked = false
							})
						})
					} else {
						this.selectList = arr
						this.selectArr = arr1
						this.usersList.map(x => {
							x.data.map(y => {
								y.checked = false
								if (arr == y.id) {
									y.checked = true
								}
							})
						})
					}
					this.$refs.uniList.setList()
				}

			},
			//查看下级部门
			jumpClick (e) {
				this.id2.push(this.id)
				this.id = e
				this.isFresh = true
				this.getData()
			},
			//确定
			save () {
				if (this.selectArr == '') {
					uni.showToast({
						title   : '请选择成员',
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					if (this.callBack !== null && typeof this.callBack === "function") {
						this.callBack(this.selectArr)
					}
				}
			},
			//返回上一级
			back () {
				if (this.id2.length - 1 >= 0) {
					this.id = this.id2[this.id2.length - 1]
					this.id2.splice(this.id2.length - 1, 1)
					this.inputValue = ''
					this.getData()
				} else {
					if (this.callBack !== null && typeof this.callBack === "function") {
						this.callBack()
					}
				}
			},
			//搜索
			search (e) {
				this.inputValue = e.value
				this.isFresh = true
				this.getData()
			},
			//展示搜索框
			showSearch () {
				this.searchVisible = !this.searchVisible
				if (!this.searchVisible) {
					this.inputValue = ''
					this.getData()
				}
			},
			//清除某一项
			clearItem (item) {
				this.selectArr = ''
				this.selectList = ''
				this.usersList.map(x => {
					x.data.map(y => {
						y.checked = false
					})
				})
				this.$refs.uniList.setList()
			},
			//清空选项
			clear () {
				this.selectArr = ''
				this.selectList = ''
				this.usersList.map(x => {
					x.data.map(y => {
						y.checked = false
					})
				})
				this.$refs.uniList.setList()
			}
		},
		created () {
			this.getData()
		},
		onShow () {
		}
	}
</script>

<style scoped>
	.box {
		background: #F2F3F5;
		text-align: left;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 0.8rem /* 15/18.75 */;
		overflow-y: auto;
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
		background-color: #5284EC;
		color: #E7EFFC;
		float: right;
		font-size: 15px;
		width: 60px;
		height: 30px;
		line-height: 30px;
		border-radius: 15px;
		margin: 0.533rem /* 10/18.75 */ 15px;
	}

	/deep/ .uni-input-placeholder, /deep/ .uni-searchbar__text-placeholder {
		color: #CCC;
	}

	/deep/ .uni-searchbar__box-icon-clear {
		line-height: unset;
	}

	/deep/ .uni-searchbar__box-icon-clear .uni-icons {
		color: #CCC !important;
	}

	/deep/ .uni-searchbar__box-icon-search {
		color: #CCC !important;
	}

	/*.check-box /deep/ .uni-checkbox-input {*/
	/*	border-radius: 50%;*/
	/*	width: 0.96rem !* 18/18.75 *!;*/
	/*	height: 0.96rem !* 18/18.75 *!;*/
	/*	border: 2px solid #FFF;*/
	/*}*/

	.scroll-view {
		width: calc(100% - 127px);
		float: left;
		white-space: nowrap;
		height: 2.667rem /* 50/18.75 */;
		line-height: 2.667rem /* 50/18.75 */;
		margin-left: 7.5px;
	}

	.scroll-view-item {
		display: inline-block;
	}

	.tag {
		display: inline-block;
		padding: 0 0.267rem /* 5/18.75 */;
		height: 1.067rem /* 20/18.75 */;
		line-height: 1.067rem /* 20/18.75 */;
		text-align: center;
		font-size: 0.587rem /* 11/18.75 */;
		border: 1px solid rgba(241, 244, 246, 1);
		border-radius: 0.8rem /* 15/18.75 */;
		margin: 0 0.267rem /* 5/18.75 */ 0.267rem /* 5/18.75 */ 0;
		cursor: pointer;
	}

	/deep/ .uni-searchbar {
		background-color: #5284EC;
		width: 100%;
	}

	.empty-img {
		width: 38%;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
