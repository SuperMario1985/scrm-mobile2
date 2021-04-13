<template>
	<view class="box2 content_head">
		<uni-nav-bar left-icon="back" title="打标签" @clickLeft="back" :fixed="true" background-color="#5284ec"
		             color="#fff"></uni-nav-bar>
		<!--退出确认弹窗-->
		<uni-popup ref="visible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">确定本次编辑?</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="unSave">取消</text>
					<text class="uni-tip-button" @click="save">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--新建标签弹窗-->
		<uni-popup ref="addVisible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">新建标签</text>
				<input class="tags-blank" placeholder="请输入标签（不得超过15个字符）" v-model="inputTagVal"/>
				<text style="font-size: 12px;color: red;margin-top: 10px;">每个标签名称最多15个字。同时新建多个标签时，请用“空格”隔开</text>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancelAddTags">取消</text>
					<text class="uni-tip-button" @click="okAddTags">确定</text>
				</view>
			</view>
		</uni-popup>
		<view class="tags" v-if="tagList.length == 0">
			<image src="../static/customDetail/tagEmpty.png" class="tags-empty-img"></image>
			<view style="text-align: center;margin-top: 23px;color: #999999;font-size: 13px;">暂无标签</view>
		</view>
		<view class="tags" v-if="tagList.length > 0">
			<uni-list>
				<uni-list-item :show-arrow="false" v-for="(item,index) in tagList">
					<template v-slot:body>
						<view style="margin-bottom: 0.8rem  /* 15/18.75 */;">{{item.name}}</view>
						<view>
							<view class="tags-li tags-grey" v-for="(tag,tagIndex) in item.data"
							      :class="[ hasTagsId2.indexOf(tag.id) != -1 ? 'tags-blue' : '' ]"
							      @click="choose(tag.id,tag)">
								{{tag.tagname}}
							</view>
							<view class="tags-li tags-border" @click="addTags(item.id)" v-has="'client-tag-add'">
								<uni-icons type="plusempty" size="12" color="#2C3E50"></uni-icons>
								新建标签
							</view>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		<view class="footer content_head" v-if="tagList.length > 0">
			<button type="primary" class="btn" @click="save">确定</button>
		</view>
	</view>
</template>

<script>

	export default {
		name   : "list",
		inject : ['getParameter'],
		props  : {
			callBack: {
				type   : Function,
				default: null
			},
			hasTags : {
				type   : Array,
				default: []//已选标签数组
			}
		},
		data () {
			return {
				hasTagsId  : [],//已选标签id数组
				group_id   : [],//新建标签的分组id
				inputTagVal: '',//添加标签的值
				newTagList : [],//添加标签的传给后端的数组
				commonUrl  : this.$store.state.commonUrl,
				tagList    : [],//标签数据
				hasTags2   : [],//页面进行的已选标签数组
				hasTagsId2 : [],//页面进行的已选标签id数组
			}
		},
		created: function () {
			// localStorage.setItem('token', 'TWFpblVzZXItN2RjYmIwZDE3N2IwZDQ2NWFiNDE5YTQ2NWNkNTMzOGQ=')
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// this.hasTags = [
			// 	{
			// 		id  : "1306",
			// 		tagname: "旅途漫漫"
			// 	},
			// 	{
			// 		id  : "1195",
			// 		tagname: "(～￣(OO)￣)ブ111"
			// 	}
			// ]


			this.hasTagsId = []
			if (this.hasTags.length > 0) {
				this.hasTags.map(x => {
					this.hasTagsId.push(x.id)
				})
			}
			this.hasTagsId2 = this.hasTagsId.length > 0 ? JSON.parse(JSON.stringify(this.hasTagsId)) : this.hasTagsId2
			this.hasTags2 = this.hasTags.length > 0 ? JSON.parse(JSON.stringify(this.hasTags)) : this.hasTags2
			if (this.hasTagsId2.length > 0) {
				for (let i = 0; i < this.hasTagsId2.length; i++) {
					this.hasTagsId2[i] = String(this.hasTagsId2[i])
				}
			}
			this.getData()
		},
		methods: {
			//获取标签列表
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
			choose (id, tag) {
				if (this.hasTagsId2.indexOf(id) == -1) {
					this.hasTagsId2.push(id)
					this.hasTags2.push(tag)
				} else {
					this.hasTagsId2.splice(this.hasTagsId2.indexOf(id), 1)
					this.hasTags2.map((x, index) => {
						if (id == x.id) {
							this.hasTags2.splice(index, 1)
						}
					})
				}
			},
			//新建标签
			addTags (id) {
				this.group_id = id
				this.$refs['addVisible'].open()
			},
			async okAddTags () {
				uni.showLoading({
					title   : '保存中...',
					duration: 2000
				});
				if (this.inputTagVal == "") {
					uni.showToast({
						title   : "不能为空",
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				} else {
					this.newTagList = []
					for (var i = 0; i < this.inputTagVal.split(" ").length; i++) {
						if (this.inputTagVal.split(" ")[i].length > 15) {
							uni.showToast({
								title   : "每个标签最多15个字",
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						} else if (
							this.inputTagVal.split(" ")[i].length > 0
						) {
							this.newTagList.push(this.inputTagVal.split(" ")[i])
						}
					}
					const {data: res} = await this.axios.post("work-tag/add", {
						corp_id : localStorage.getItem('corpid'),
						suite_id: 1,
						type    : 0,
						group_id: this.group_id,
						name    : this.newTagList
					});
					if (res.error != 0) {
						uni.showToast({
							title   : res.error_msg,
							image   : '/static/fail.png',
							duration: 2000
						});
					} else {
						this.getData()
						this.cancelAddTags()
					}
				}
			},
			cancelAddTags () {
				this.inputTagVal = ""
				this.newTagList = []
				this.$refs['addVisible'].close()
			},
			//保存
			save () {
				if (this.callBack !== null && typeof this.callBack === "function") {
					this.callBack('ok',this.hasTagsId2, this.hasTags2)
				}
			},
			//返回
			back () {
				this.unSave()
			},
			unSave () {
				if (typeof this.hasTagsId == 'object' && this.hasTagsId.length == 0 && typeof this.hasTags == 'object' && this.hasTags.length == 0) {
					this.hasTagsId2 = []
					this.hasTags2 = []
				}
				if (this.callBack !== null && typeof this.callBack === "function") {
					this.callBack('cancel',this.hasTagsId2, this.hasTags2)
				}
			},
		},
	}
</script>

<style scoped lang="less">
	.box2 {
		background: #FFF;
		text-align: left;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 0.8rem /* 15/18.75 */;
		overflow-y: auto;
		z-index: 999999;
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
		line-height: 1.76rem /* 33/18.75 */;
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

	.tags-border {
		border: 1px dashed #CCC;
	}

	.tags-blank {
		height: 1.76rem /* 33/18.75 */;
		line-height: 1.76rem /* 33/18.75 */;
		box-sizing: border-box;
		border: solid 0.053rem /* 1/18.75 */ #D1D1D1;
		color: #333;
		text-align: left;
		padding: 0 0.427rem /* 8/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
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
		transform: translateY(-50%);
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
	.uni-list-item :active{
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