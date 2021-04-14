<template>
	<view class="box content_head">
		<uni-nav-bar left-icon="back" @clickLeft="back" left-text="返回" background-color="#01B065" color="#fff">
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
		<uni-indexed-list :options="usersList" :showSelect="true" @click="bindClick"
		                  @jump="jumpClick" ref="uniList" v-show="usersList.length > 0"
		                  v-if="isReady" style="bottom: 0;"></uni-indexed-list>
		<view class="footer content_head" v-show="usersList.length > 0">
			<uni-icons :type="isCheck ? 'checkbox-filled' : 'circle'" size="22" @click="changeCheck" color="#01B065"
			           style="line-height: 2.667rem  /* 50/18.75 */;float: left;margin-left: 7.5px;"></uni-icons>
			<scroll-view class="scroll-view" scroll-x="true" :scroll-into-view="toView" scroll-with-animation>
				<view class="scroll-view-item" v-for="item in selectArr" @click="clearItem(item)" :id="'view'+item.id">
					<text v-if="item.depart == 1" class="tag">{{item.name}}</text>
					<image style="width: 30px;height: 30px;margin-right: 10px;vertical-align: middle;"
					       :src="item.avatar" v-if="item.depart == 0"></image>
				</view>
				<uni-icons type="close"
				           style="color: #2C3E50;font-size: 0.853rem  /* 16/18.75 */;" @click="clear"
				           v-if="selectArr.length > 0"></uni-icons>
			</scroll-view>
			<button type="primary" class="btn" @click="save">确定</button>
		</view>
	</view>
</template>

<script>
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"

	export default {
		name      : "chooseDepartment",
		props     : {
			callBack : {
				type   : Function,
				default: null
			},
			selectArray: {
				type   : Array,
				default: []
			},//已选择的所有数据
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
				selectList   : [],//选择的id数组
				inputValue   : '',//搜索值
				isFresh      : false,//是否去了下一级
				searchVisible: false,//搜索框的显示与隐藏
				selectArr    : this.selectArray,//已选择的所有数据
				isCheck      : false,//全选按钮是否勾选上
				toView       : '',//要跳转的位置
			}
		},
		created () {
			this.getData()
		},
		methods   : {
			async getData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("work-party/get-depart-user", {
					corp_id : localStorage.getItem('corpid'),
					uid     : localStorage.getItem('uid'),
					user_id : localStorage.getItem('user_id'),
					user_ids: [],
					id      : this.id,
					name    : this.inputValue
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
					if (this.isFresh) {
						this.usersList.map(x => {
							x.data.map(y => {
								this.selectList.map(j => {
									if (j == y.id) {
										y.checked = true
									}
								})
							})
						})
						this.$refs.uniList.setList()
					}

					if (this.selectList.length == 0 && this.selectArr.length > 0) {
						for (let i = 0; i < this.selectArr.length; i++) {
							this.selectList.push(this.selectArr[i].id)
						}
						let that = this
						that.selectList.map(z => {
							that.usersList.map(x => {
								x.data.map(y => {
									if (z == y.id) {
										y.checked = true
									}
								})
							})
						})
					}

					let checked = true
					this.usersList.map(x => {
						x.data.map(y => {
							if (!y.checked) {
								checked = false
							}
						})
					})
					this.isCheck = checked

					this.isReady = true
					uni.hideLoading();
				}
			},
			bindClick (e) {
				let arr = ''
				let arr1 = {}
				arr = e.item.id
				arr1 = e.item

				function unique (arr) {
					return Array.from(new Set(arr))
				}

				function unique1 (arr, key) {
					for (let i = 0; i < arr.length; i++) {
						for (let j = i + 1; j < arr.length; j++) {
							if (arr[i][key] === arr[j][key]) {
								arr.splice(j, 1);
								j = j - 1;
							}
						}
					}

					return arr;
				}

				function isSameArr (arr, other) {
					var i, j;
					if (!other) {
						return false
					}
					if (arr.length != other.length) {
						return false
					}
					for (i = 0; i < arr.length; i++) {
						if (other.indexOf(arr[i]) == -1) {
							return false
						} else if (arr.indexOf(other[i]) == -1) {
							return false
						}
					}
					return true
				}

				if (this.selectList.indexOf(arr) == -1) {
					this.selectList.push(arr)
					this.selectList = unique(this.selectList)
					this.selectArr.push(arr1)
					this.$nextTick(() => {
						this.toView = 'view' + arr
					})
					// this.selectArr = unique1(this.selectArr, 'itemIndex')
				} else {
					this.selectList.splice(this.selectList.indexOf(arr), 1)
					this.selectList = unique(this.selectList)
					this.selectArr.map((x, index) => {
						if (arr1.id == x.id) {
							this.selectArr.splice(index, 1)
						}
					})
				}
				let usersArr = []
				this.usersList.map(x => {
					x.data.map(y => {
						usersArr.push(y.id)
					})
				})
				this.isCheck = isSameArr(usersArr, this.selectList)
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
				if (this.callBack !== null && typeof this.callBack === "function") {
					this.callBack(this.selectArr)
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
			//勾选全部
			changeCheck () {
				this.isCheck = !this.isCheck
				if (this.isCheck) {
					this.selectList = []
					this.selectArr = []
					this.usersList.map(x => {
						x.data.map(y => {
							y.checked = true
							this.selectList.push(y.id)
							this.selectArr.push(y)
						})
					})
					this.$nextTick(() => {
						this.toView = 'view' + this.selectList[this.selectList.length - 1]
					})
				} else {
					this.selectList = []
					this.selectArr = []
					this.usersList.map(x => {
						x.data.map(y => {
							y.checked = false
						})
					})
				}
				this.$refs.uniList.setList()
			},
			//展示搜索框
			showSearch () {
				this.searchVisible = !this.searchVisible
			},
			//清除某一项
			clearItem (item) {
				function unique (arr) {
					return Array.from(new Set(arr))
				}

				if (this.selectList.indexOf(item.id) > -1) {
					this.selectList.splice(this.selectList.indexOf(item.id), 1)
					this.selectList = unique(this.selectList)
					this.selectArr.map((x, index) => {
						if (item.id == x.id) {
							this.selectArr.splice(index, 1)
						}
					})
					let isCheck = true
					this.usersList.map(x => {
						x.data.map(y => {
							if (this.selectList.indexOf(y.id) > -1) {
								y.checked = true
							} else {
								y.checked = false
							}
							if (!y.checked) {
								isCheck = false
							}
						})
					})
					this.isCheck = isCheck
					this.$refs.uniList.setList()
				}
			},
			//清空选项
			clear () {
				this.isCheck = false
				this.selectArr = []
				this.selectList = []
				this.usersList.map(x => {
					x.data.map(y => {
						y.checked = false
					})
				})
				this.$refs.uniList.setList()
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/ .uni-searchbar__box-search-input {
		font-size: 14px !important;
	}

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
		height: calc(100% - 50px);
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
		background-color: #01B065;
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
		background-color: #01B065;
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
