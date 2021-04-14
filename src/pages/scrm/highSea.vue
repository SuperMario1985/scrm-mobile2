<template>
	<view class="mainBox" v-if="isReady">
		<view class="content_head"
		      style="background: #FFF;z-index:99;position: fixed;top: 0;left: 0;right: 0;box-shadow: 0 0.053rem  /* 1/18.75 */ 0.213rem  /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);"
		      v-if="!showChooseStaff">
			<view class="nav" v-if="searchBarFixed">
				<ms-tabs class="nav_title" :list="tabList" v-model="tabType"></ms-tabs>
			</view>
			<template v-if="tabType == 0&&searchBarFixed">
				<view style="overflow: hidden;background: #FFF;">
					<view class="input-box">
						<uni-icons type="search"
						           style="font-size: 0.853rem  /* 16/18.75 */;color: #999;margin-right: 0.267rem  /* 5/18.75 */; margin-top: 0.107rem  /* 2/18.75 */; line-height: 1.493rem  /* 28/18.75 */; height: 1.493rem  /* 28/18.75 */;"></uni-icons>
						<input class="search-input" confirm-type="search"
						       placeholder="请输入客户昵称"
						       v-model="name" @input="search" placeholder-style="color:#999"/>
						<uni-icons type="clear"
						           style="font-size: 0.96rem  /* 18/18.75 */;color: #999;margin-left: -90%; line-height: 1.493rem  /* 28/18.75 */; margin-top: 0.107rem  /* 2/18.75 */;"
						           v-show="name != ''" @click="clearInput"></uni-icons>
					</view>
				</view>
			</template>
			<template v-if="tabType == 1&&searchBarFixed">
				<view style="overflow: hidden;background: #FFF;">
					<view class="input-box" style="width: 81%;">
						<uni-icons type="search"
						           style="font-size: 0.853rem  /* 16/18.75 */;color: #999;margin-right: 0.267rem  /* 5/18.75 */; margin-top:  0.107rem  /* 2/18.75 */; line-height: 1.493rem  /* 28/18.75 */; height: 1.493rem  /* 28/18.75 */;"></uni-icons>
						<input class="search-input" confirm-type="search" placeholder="请输入客户姓名" v-model="noCustomName"
						       @input="search2" placeholder-style="color:#999"/>
						<uni-icons type="clear"
						           style="font-size: 0.96rem  /* 18/18.75 */;color: #999;margin-left: -88%; line-height: 1.493rem  /* 28/18.75 */; margin-top:  0.107rem  /* 2/18.75 */;"
						           v-if="noCustomName != ''" @click="clearInput2"></uni-icons>
					</view>
					<text style="cursor:pointer;display: inline-block;width: 15%;text-align: center;color: #01B065;background: #FFF;line-height: 3.2rem  /* 60/18.75 */;"
					      @click="check">查重
					</text>
				</view>
			</template>
			<view style="display: flex; line-height: 1.4rem;justify-content: center;padding: 0.1rem 0 /* 15/18.75 */;"
			      v-if="tabType == 0">
				<button :class="btnType == 0 ? 'chartColor':''" @click="changeType(0)" style="width: 4.5rem;
						height: 1.5rem;
						background: #FFFFFF;
						border: 0.053rem solid #EDEDED;
						border-right: 0;
						margin: 0;
						border-radius: 0;
						font-size: 0.7rem;
						font-weight: 500;
						color: #333333;
						line-height:1.5rem;
						" type="default" plain="">可认领
				</button>
				<button :class="btnType == 1 ? 'chartColor':''" @click="changeType(1)" style="width: 4.5rem;
						height: 1.5rem;
						background: #FFFFFF;
						border-radius: 0;
						border: 0.053rem solid #EDEDED;
						margin: 0;
						font-size: 0.7rem;
						font-weight: 500;
						color: #333333;
						line-height:1.5rem;
						" type="default" plain="">已认领
				</button>
			</view>
			<view style="background: #FFF;">
				<view style="padding: 0.267rem  /* 5/18.75 */ 0.533rem  /* 10/18.75 */;overflow: hidden;">
					<text style="color: #2A3349;font-size: 0.747rem  /* 14/18.75 */;"
					      v-if="tabType == 0 && btnType == 0">
						共有{{customCount}}条，实际{{realCustomCount}}位客户
					</text>
					<text style="color: #2A3349;font-size: 0.747rem  /* 14/18.75 */;"
					      v-if="tabType == 0 && btnType == 1">
						共有{{customCount2}}条，实际{{realCustomCount2}}位客户
					</text>
					<text style="color: #2A3349;font-size: 0.747rem  /* 14/18.75 */;vertical-align: sub;"
					      v-if="tabType == 1">
						当前公海池共有{{noCustomCount}}位客户
					</text>
				</view>
			</view>
		</view>
		<view class="content-list"
		      :style="{'margin-top':tabType == 0 ? '9.333rem' : '7.573rem  /* 142/18.75 */'}"
		      v-if="!showChooseStaff" :key="keyVal">
			<checkbox-group class="uni-list" @change="checkboxChange"
			                v-if="tabType == 0 && btnType == 0 && customList.length > 0">
				<view class="content-list-item" v-for="item in customList" :key="item.id">
					<checkbox :value="item.id" :checked="item.checked" class="content-list-checkbox"></checkbox>
					<view class="content-list-box">
						<view @click="is_master == 1 ? toCustomDetail(item.userid,item.externaluserid) : ''">
							<img :src="item.customerInfo.avatar" alt="" class="content-list-box-img"
							     v-if="item.customerInfo.avatar">
							<img src="../../static/userface.png" alt="" class="content-list-box-img"
							     v-if="!item.customerInfo.avatar">
							<view class="content-list-box-right wrap">
								<view>{{item.customerInfo.name}}
									<text v-if="item.customerInfo.corp_name != null"
									      style="font-size: 0.587rem;color: #FA9635;line-height: 1.067rem  /* 20/18.75 */;">
										@{{item.customerInfo.corp_name}}
									</text>
									<text v-else
									      style="color: #30AB55;font-size: 0.587rem;line-height: 1.067rem  /* 20/18.75 */;">
										@微信
									</text>
									<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/man.png"
									       v-if="item.customerInfo.gender == '男'"></image>
									<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/woman.png"
									       v-if="item.customerInfo.gender == '女'"></image>
								</view>
								<view style="color: #999;font-size: 0.693rem  /* 13/18.75 */;" class="wrap">
									{{item.member}}
								</view>
							</view>
							<uni-icons type="arrowright"
							           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
							           v-if="is_master == 1"></uni-icons>
							<view style="color: red;font-size: 0.693rem  /* 13/18.75 */;margin-top: 0.267rem;"
							      v-if="item.claimTip && item.claimTip != ''">{{item.claimTip}}
							</view>
						</view>
						<view style="float: right;margin-top: 0.267rem;">
							<button type="default" class="content-list-box-btn"
							        style="margin-right: 0.533rem  /* 10/18.75 */;"
							        @click="claim(item,0)" v-has="'highSeasCustomerList-assign'">客户分配
							</button>
							<button type="default" class="content-list-box-btn" @click="claim(item,1)"
							        style="background: #01B065;color: #FFF;"
							        v-if="item.claimTip == ''" v-has="'highSeasCustomerList-claim'">认领客户
							</button>
						</view>
					</view>
				</view>
			</checkbox-group>
			<view class="content-list-item" v-for="item in customList2" :key="item.id"
			      v-if="tabType == 0 && btnType == 1 && customList2.length > 0">
				<view class="content-list-box" style="width: 100%;">
					<view @click="is_master == 1 ? toCustomDetail(item.userid,item.externaluserid) : ''">
						<img :src="item.avatar" alt="" class="content-list-box-img"
						     v-if="item.avatar">
						<img src="../../static/userface.png" alt="" class="content-list-box-img"
						     v-if="!item.avatar">
						<view class="content-list-box-right wrap">
							<view>{{item.name}}
								<text v-if="item.corp_name != null"
								      style="font-size: 0.587rem;color: #FA9635;line-height: 1.067rem  /* 20/18.75 */;">
									@{{item.corp_name}}
								</text>
								<text v-else
								      style="color: #30AB55;font-size: 0.587rem;line-height: 1.067rem  /* 20/18.75 */;">
									@微信
								</text>
								<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
								       src="../../static/scrm/man.png"
								       v-if="item.gender == '男'"></image>
								<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
								       src="../../static/scrm/woman.png"
								       v-if="item.gender == '女'"></image>
							</view>
							<view style="color: #999;font-size: 0.693rem  /* 13/18.75 */;" class="wrap">
								{{item.old_user_name}}——>{{item.user_name}}
							</view>
						</view>
						<uni-icons type="arrowright"
						           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
						           v-if="is_master == 1"></uni-icons>
						<view style="color: #666;font-size: 0.693rem  /* 13/18.75 */;margin-top: 0.267rem;">
							{{item.add_time}}认领，{{item.status}}
						</view>
					</view>
					<view style="text-align: right;margin-top: 0.267rem  /* 5/18.75 */;">
						<button type="default" class="content-list-box-btn"
						        v-if="item.status == '未添加' && !(item.status == '未添加' && item.claimTip != '')"
						        @click="notice(item)" v-has="'highSeasCustomerList-notice'">提醒原成员共享
						</button>
					</view>
				</view>
			</view>
			<template
					v-if="(tabType == 0 && btnType == 0 && customList.length == 0) || (tabType == 0 && btnType == 1 && customList2.length == 0) || (tabType == 1 && noCustomList.length == 0)">
				<img v-if="isLoading" src="../../static/scrm/empty.png" alt="" class="empty-img">
			</template>
			<checkbox-group class="uni-list" @change="checkboxChange"
			                v-if="tabType == 1 && noCustomList.length > 0">
				<view class="content-list-item" v-for="item in noCustomList" :key="item.id">
					<checkbox :value="item.id" :checked="item.checked" class="content-list-checkbox"></checkbox>
					<view class="content-list-box">
						<view @click="item.can_edit == 1 ? toNoCustomDetail(item.id) : toLookTags(item.tagData)">
							<img src="../../static/userface.png" alt="" class="content-list-box-img">
							<view class="content-list-box-right">
								<view class="wrap">{{item.name}}
									<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/man.png"
									       v-if="item.gender == '男'"></image>
									<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/woman.png"
									       v-if="item.gender == '女'"></image>
								</view>
								<view style=";overflow: hidden;">
									<view style="font-size: 0.693rem  /* 13/18.75 */;margin: 0.267rem  /* 5/18.75 */ 0;white-space: nowrap">
										<text v-if="item.tagData.length == 0"
										      style="color: #01B065;">暂无标签
										</text>
										<text v-for="tag in item.tagData" v-if="item.tagData.length > 0"
										      class="list-hd-content-tag">{{tag.tname}}
										</text>
									</view>
								</view>
							</view>
							<uni-icons type="arrowright"
							           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;vertical-align: super;"
							           v-if="item.can_edit == 1"></uni-icons>
							<view style="color: red;font-size: 0.693rem  /* 13/18.75 */;margin-top: 0.16rem  /* 3/18.75 */;"
							      v-if="item.claimTip && item.claimTip != ''">{{item.claimTip}}
							</view>
						</view>
						<view style="float: right;margin-top: 0.267rem  /* 5/18.75 */;">
							<button type="default" class="content-list-box-btn"
							        style="margin-right: 0.533rem  /* 10/18.75 */;" @click="openAddCustom2(item)"
							        v-if="item.can_edit == 1">客户编辑
							</button>
							<button type="default" class="content-list-box-btn"
							        style="margin-right: 0.533rem  /* 10/18.75 */;" @click="claim(item,0)"
							        v-has="'highSeasCustomerList-assign'">客户分配
							</button>
							<button type="default" style="background: #01B065;color: #FFF;" class="content-list-box-btn"
							        @click="claim(item,1)" v-has="'highSeasCustomerList-claim'">认领客户
							</button>
						</view>
					</view>
				</view>
			</checkbox-group>
			<drag-button
					:isDock="true"
					:existTabBar="true"
					@btnClick="openAddCustom" :content="addBtnImg" v-if="tabType == 1"
					v-has="'highSeasCustomerList-import'"/>
			<view class="custom-tabs-loading"
			      v-if="(tabType == 0 && btnType == 0 && customList.length > 0) || (tabType == 0 && btnType == 1 && customList2.length > 0) || (tabType == 1 && noCustomList.length > 0)">
				{{loadingText}}
			</view>
		</view>
		<view class="fix-btn"
		      v-if="(tabType == 0 && btnType == 0 && customList.length > 0) || (tabType == 1 && noCustomList.length > 0)"
		      v-has="'highSeasCustomerList-assign'">
			<view v-if="isShrink == 1" @click="trigger(0)" style="text-align: right;">全选 / 分配</view>
			<view v-if="isShrink == 0">
				<text class="fix-btn-left" @click="trigger(1)">全选</text>
				<text class="fix-btn-right" @click="claim2(0)">立即分配（{{checkArr.length}}/50）</text>
			</view>
		</view>
		<Footer v-show="is_show_copyright == 1 && is_show_copyright2"
		        style="position: absolute;bottom: 50px;left: 0;right: 0;"
		        v-if="(tabType == 0 && btnType == 0 && customList.length == 0) || (tabType == 0 && btnType == 1 && customList2.length == 0) || (tabType == 1 && noCustomList.length == 0)"></Footer>
		<Footer v-show="is_show_copyright == 1 && is_show_copyright2" v-else></Footer>
		<!--录入客户弹窗-->
		<uni-popup ref="addCustomVisible" type="bottom" :mask-click="false" class="add-project" :key="1">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;"
				      v-if="is_edit == 0">
					录入客户
				</text>
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;"
				      v-if="is_edit == 1">
					编辑客户
				</text>
				<scroll-view scroll-y="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;overflow-y: auto!important;height: 14.933rem  /* 280/18.75 */;">
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="color: red;vertical-align: sub;">*</text>
							<text style="font-weight: 700;vertical-align: sub;">姓名：</text>
						</view>
						<input class="add-input" type="text" v-model="recordName" placeholder="请输入姓名"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">微信号：</text>
						</view>
						<input class="add-input" type="text" v-model="recordWx" placeholder="请输入微信号"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">QQ号：</text>
						</view>
						<input class="add-input" type="number" v-model="recordQQ" placeholder="请输入QQ号"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">手机号：</text>
						</view>
						<input class="add-input" type="number" v-model="recordPhone" placeholder="请输入手机号"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">公司名称：</text>
						</view>
						<input class="add-input" type="text" v-model="recordCompany" placeholder="请输入公司名称"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">Email：</text>
						</view>
						<input class="add-input" type="text" v-model="recordEmail" placeholder="请输入Email"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">性别：</text>
						</view>
						<picker @change="changeRecordSex" :value="recordSex" :range="recordSexList"
						        range-key="name"
						        style="width: calc(100% - 5.867rem  /* 110/18.75 */);display: inline-block;">
							<view class="add-input" style="width: 100%;color: grey;font-size: 15px;">
								{{recordSexList[recordSex].name}}
								<uni-icons type="arrowright"
								           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">地区：</text>
						</view>
						<pick-regions :default-regions="recordArea" @getRegions="changeArea"
						              style="width: calc(100% - 5.867rem  /* 110/18.75 */);display: inline-block;"
						              :index="0">
							<view class="add-input" v-if="recordArea.length == 0" style="width: 100%;">
								<text style="font-size: 0.693rem  /* 13/18.75 */;color: #D2D2D2;">请选择地区</text>
								<uni-icons type="arrowright"
								           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
							</view>
							<view class="add-input" style="width: 100%;font-size: 15px;color: grey;"
							      v-if="recordArea.length > 0">{{recordArea.join('-')}}
								<uni-icons type="arrowright"
								           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
							</view>
						</pick-regions>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">备注：</text>
						</view>
						<input class="add-input" type="text" v-model="recordMark" placeholder="请输入备注" maxlength="10"/>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="color: red;vertical-align: sub;">*</text>
							<text style="font-weight: 700;vertical-align: sub;">客户来源：</text>
						</view>
						<picker @change="changeRecordStatus" :value="recordStatusIndex" :range="recordStatusList"
						        range-key="match"
						        style="width: calc(100% - 5.867rem  /* 110/18.75 */);display: inline-block;">
							<view class="add-input" style="width: 100%;color: grey;font-size: 15px;"
							      v-if="recordStatusList[recordStatusIndex]">
								{{recordStatusList[recordStatusIndex].match}}
								<uni-icons type="arrowright"
								           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
							</view>
						</picker>
					</view>
					<view style="margin: 0.8rem  /* 15/18.75 */ 0 0 0;">
						<view class="lable-left">
							<text style="font-weight: 700;vertical-align: sub;">客户标签：</text>
						</view>
						<template v-if="is_edit == 0">
							<button type="default"
							        style="font-size: 0.693rem  /* 13/18.75 */;display: inline-block;vertical-align: middle;"
							        @click="chooseTags">
								选择标签
							</button>
							<view style="margin-top: 0.533rem  /* 10/18.75 */;overflow: hidden;">
								<view class="tags-li" v-for="(tag,tagIndex) in hasTags" @click="delHasTags(tag.id)">
									{{tag.tagname}}
									<uni-icons type="closeempty"
									           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"></uni-icons>
								</view>
							</view>
						</template>
						<template v-if="is_edit == 1">
							<view style="margin-top: 0.533rem  /* 10/18.75 */;overflow: hidden;"
							      v-if="hasTags.length > 0">
								<view class="tags-li" v-for="(tag,tagIndex) in hasTags">
									{{tag.tname}}
								</view>
							</view>
							<text v-if="hasTags.length == 0" style="vertical-align: bottom;">暂无</text>
						</template>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" @click="cancelCustom('addCustomVisible')">取消</text>
					<text class="add-project-ok" @click="addCustom">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--非企微客户详情弹窗-->
		<uni-popup ref="noCustomDetailVisible" type="bottom" :mask-click="false" class="add-project" :key="2">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					非企微客户详情
				</text>
				<scroll-view scroll-y="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;overflow-y: auto!important;height: 14.933rem  /* 280/18.75 */;">
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="color: red;vertical-align: sub;">*</text>
							<text style="font-weight: 700;">姓名：</text>
						</view>
						<view v-if="detailName != ''"
						      style="width: calc(100% - 4.267rem);display: inline-block;vertical-align: text-top;">
							{{detailName}}
						</view>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">微信号：</text>
						</view>
						<text v-if="detailWx != ''">{{detailWx}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">QQ号：</text>
						</view>
						<text v-if="detailQQ != ''">{{detailQQ}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">手机号：</text>
						</view>
						<text v-if="detailPhone != ''">{{detailPhone}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">公司名称：</text>
						</view>
						<view v-if="detailCompany != ''"
						      style="width: calc(100% - 4.267rem);display: inline-block;vertical-align: text-top;">
							{{detailCompany}}
						</view>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">Email：</text>
						</view>
						<text v-if="detailEmail != ''">{{detailEmail}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">性别：</text>
						</view>
						<text v-if="detailSex != ''">{{detailSex}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">地区：</text>
						</view>
						<text v-if="detailArea != ''">{{detailArea}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="font-weight: 700;">备注：</text>
						</view>
						<text v-if="detailMark != ''">{{detailMark}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<view class="lable-left">
							<text style="color: red;vertical-align: sub;">*</text>
							<text style="font-weight: 700;">客户来源：</text>
						</view>
						<text v-if="detailStatus != ''">{{detailStatus}}</text>
						<text v-else>--</text>
					</view>
					<view style="margin: 0.8rem  /* 15/18.75 */ 0 0 0;">
						<view class="lable-left">
							<text style="font-weight: 700;">客户标签：</text>
						</view>
						<view style="margin-top: 0.533rem  /* 10/18.75 */;overflow: hidden;"
						      v-if="detailTags.length > 0">
							<view class="tags-li" v-for="(tag,tagIndex) in detailTags">
								{{tag.tname}}
							</view>
						</view>
						<text v-if="detailTags.length == 0">--</text>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" style="width: 100%;"
					      @click="cancelDetail('noCustomDetailVisible')">关闭
					</text>
				</view>
			</view>
		</uni-popup>
		<!--查重弹窗-->
		<uni-popup ref="checkVisible" type="bottom" :mask-click="false" class="add-project" :key="3">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					客户查重
				</text>
				<scroll-view scroll-y="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;overflow-y: auto!important;height: 14.933rem  /* 280/18.75 */;"
				             @scrolltolower="scrollTolower">
					<view style="margin-top: 0.8rem  /* 15/18.75 */;">
						<input class="add-input" type="text" v-model="checkName" placeholder="请输入客户姓名、手机号、公司名称"
						       confirm-type="search"
						       style="box-sizing: border-box;width: 80%;" @confirm="searchCheck"/>
						<button class="mini-btn" type="primary" size="mini" @click="searchCheck">搜索</button>
					</view>
					<view style="margin: 0.8rem 0;">搜索结果</view>
					<t-table border="1" border-color="#eaeaea" :is-check="false">
						<t-tr font-size="12" color="#333" align="left">
							<t-th align="center">客户姓名</t-th>
							<t-th align="center">手机号</t-th>
							<t-th align="center">公司名称</t-th>
							<t-th align="center">当前认领人</t-th>
						</t-tr>
						<t-tr font-size="12" color="#666" align="right" v-for="item in checkList">
							<t-td align="center">{{item.name}}</t-td>
							<t-td align="center">{{item.phone}}</t-td>
							<t-td align="center">{{item.company_name}}</t-td>
							<t-td align="center">{{item.user_name}}</t-td>
						</t-tr>
					</t-table>
					<img src="../../static/assets/empty.png" alt="" v-if="checkList.length == 0"
					     style="width: 40%;left: 30%;position: absolute;margin-top: 1.067rem  /* 20/18.75 */;">
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" style="width: 80%;margin: 0 auto;"
					      @click="cancelCheck('checkVisible')">关闭
					</text>
				</view>
			</view>
		</uni-popup>
		<!--查看标签弹窗-->
		<uni-popup ref="tagsVisible" type="bottom" :mask-click="false" class="add-project" :key="4">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					客户标签
				</text>
				<scroll-view scroll-y="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;overflow-y: auto!important;height: 14.933rem  /* 280/18.75 */;">
					<view style="margin-top: 0.533rem  /* 10/18.75 */;overflow: hidden;"
					      v-if="tagData.length > 0">
						<view class="tags-li" v-for="(tag,tagIndex) in tagData">
							{{tag.tname}}
						</view>
					</view>
					<img src="../../static/assets/empty.png" alt="" v-if="tagData.length == 0"
					     style="width: 40%;left: 30%;position: absolute;top: 50%;transform: translateY(-50%);">
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" style="width: 80%;margin: 0 auto;"
					      @click="canceltags('tagsVisible')">关闭
					</text>
				</view>
			</view>
		</uni-popup>
		<!--选择单个成员组件-->
		<chooseStaffSelect v-if="showChooseStaff" :call-back="replyMsg" :isAll="1"></chooseStaffSelect>
		<!--选择标签组件-->
		<choose-tags v-if="showChooseTags" :call-back="replyMsg2" :hasTagsId="hasTagsId"
		             :hasTags="hasTags"></choose-tags>
	</view>
</template>

<script>
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue";
	import ChooseTags from "../../components/ChooseTags.vue";
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import Footer from "../../components/footer/footer.vue";

	Date.prototype.Format = function (fmt) { // author: meizz
		var o = {
			"M+": this.getMonth() + 1, // 月份
			"d+": this.getDate(), // 日
			"h+": this.getHours(), // 小时
			"m+": this.getMinutes(), // 分
			"s+": this.getSeconds(), // 秒
			"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
			"S" : this.getMilliseconds() // 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	export default {
		name         : "list",
		inject       : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden', 'getCopyright','getPermissionButton'],
		components   : {chooseStaffSelect, ChooseTags, tTable, tTh, tTr, tTd, Footer},
		data () {
			return {
				isLoading : false,
				url       : '',
				ticketData: {},
				agentData : {},

				commonUrl         : this.$store.state.commonUrl,
				isReady           : false,
				tabType           : 0,//0企微客户，1非企微客户
				tabList           : [{
					title: '企微客户'
				}, {
					title: '非企微客户'
				}],
				is_claim          : 0,//是不是认领,0分配，1认领
				lotsOf            : 0,//是不是批量，0不是，1是
				//客户列表-》可认领
				customList        : [],//列表数据
				keyVal            : 0,
				page              : 1,//页码
				count             : 0,//分页
				customCount       : 0,//客户数
				realCustomCount   : 0,//实际客户数
				tagIds            : [],//选择标签
				name              : '',//搜索客户名
				actionName        : '',//正在分配/认领的客户名
				actionId          : '',//正在分配/认领的客户名
				//客户列表-》已认领
				customList2       : [],//列表数据
				page2             : 1,//页码
				count2            : 0,//分页
				customCount2      : 0,//客户数
				realCustomCount2  : 0,//实际客户数
				tagIds2           : [],//选择标签
				loadingText       : '加载中...',
				btnType           : 0,//0可认领，1已认领
				is_master         : 1,//1是主账户，0不是
				checkArr          : [],//批量已勾选的客户id
				//非企微客户列表
				noCustomName      : '',//搜索非企微客户名
				noCustomList      : [],//列表数据
				noCustomCount     : 0,////分页
				noCustomPage      : 1,//页码
				addBtnImg         : '../../static/scrm/btn.png',//新建悬浮按钮
				//录入客户
				recordId          : '',//编辑的客户id值
				recordName        : '',//姓名
				recordWx          : '',//微信号
				recordQQ          : '',//QQ号
				recordPhone       : '',//手机号
				recordCompany     : '',//公司名称
				recordEmail       : '',//Email
				recordSex         : 0,//性别
				recordSexList     : [
					{name: '男'},
					{name: '女'},
					{name: '未知'},
				],//性别选择列表
				recordArea        : [],//地区
				recordMark        : '',//备注
				recordStatusList  : [],//客户来源列表
				recordStatusIndex : 0,//客户来源index
				recordStatus      : '',//客户来源id
				recordTags        : '',//客户标签
				hasTagsId         : [],//传给选择标签组件的标签id
				hasTags           : [],//传给选择标签组件的标签数据
				showChooseStaff   : false,//是否显示选择成员组件
				showChooseTags    : false,//是否展示选择标签组件
				is_edit           : 0,//录入客户弹窗打开是否是编辑情况，0新建，1编辑
				//批量操作
				isShrink          : 1,//批量按钮有没有收缩，0不收，1收
				//客户查重弹窗
				checkList        : [],
				checkListPage    : 1,//页码
				checkName        : '',//搜索值
				//非企微客户详情弹窗
				detailName        : '',//姓名
				detailWx          : '',//微信号
				detailQQ          : '',//QQ号
				detailPhone       : '',//手机号
				detailCompany     : '',//公司名称
				detailEmail       : '',//Email
				detailSex         : '',//性别
				detailArea        : '',//地区
				detailMark        : '',//备注
				detailStatus      : '',//客户来源
				detailTags        : '',//客户标签
				tagData           : [],//非企微客户-不是自己录入的-查看标签的数据
				scrollTop         : null,
				searchBarFixed    : true,
				is_show_copyright : localStorage.getItem('is_show_copyright'),//是否展示底部版權
				is_show_copyright2: false,//切换tab时候是否展示底部版权
			}
		},
		onTabItemTap : function (obj) {
			this.hasTagsId = []
			this.hasTags = []
			this.tabType = 0
			this.loadingText = '加载中...'
			this.name = ''
			this.tagIds = []
			if (localStorage.getItem('uid') != null) {
				this.getInfoData()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.limit)
				})
			}
		},
		watch        : {
			tabType () {
				this.isShrink = 1
				this.checkArr = []
				if (typeof document.getElementsByClassName('fix-btn')[0] != 'undefined') {
					document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.is_show_copyright2 = false
				this.loadingText = '加载中...'
				if (this.tabType == 0) {
					this.btnType = 0
					this.name = ''
					this.page = 1
					this.getData(this.page)
				} else if (this.tabType == 1) {
					this.noCustomPage = 1
					this.noCustomName = ''
					this.getNoCustomData(this.noCustomPage)
				}
			}
		},
		onLoad () {
			uni.setNavigationBarTitle({
				title: '公海池'
			});
			this.isReady = false
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});

			if (localStorage.getItem('uid') != null) {
				this.getInfoData()
			} else {
				this.$store.dispatch('setWx', () => {
					this.initPage(this.limit)
				})
			}

			// let str = ['client-add-tag','client-remove-tag','client-addFollow','client-editInfo','other-store','client-bind','client-assign','client-backHighSea','client-protect','client-import','highSeasCustomerList-claim','highSeasCustomerList-import','highSeasCustomerList-assign','highSeasCustomerList-notice']
			// localStorage.setItem('permissionButton', str)
			// localStorage.setItem('user_id', 'shakalaka')
			// localStorage.setItem('user_id', 'liyunli')
			// // localStorage.setItem('user_id', 'wanziyang')
			// // localStorage.setItem('user_id', 'dove_chen')
			// this.isReady = true
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('agent_id', '25')
			// localStorage.setItem('token', 'TWFpblVzZXItMGNkN2VhMTBlMzk1MjFmZDYyOWZjNDA3MGU3ZGI1ZDc=')
			// this.is_show_copyright = 1
			// this.is_show_copyright2 = true
			// this.getInfoData()

		},
		mounted () {
			window.addEventListener('scroll', this.handleScroll)
		},
		onReachBottom: function () {
			if (this.tabType == 0) {
				if (this.btnType == 0) {
					if (this.customList.length < this.customCount) {
						this.page += 1
						this.getData(this.page)
					} else {
						this.loadingText = '已加载全部'
					}
				} else if (this.btnType == 1) {
					if (this.customList2.length < this.customCount2) {
						this.page2 += 1
						this.getData2(this.page2)
					} else {
						this.loadingText = '已加载全部'
					}
				}
			} else if (this.tabType == 1) {
				if (this.noCustomList.length < this.noCustomCount) {
					this.page2 += 1
					this.getNoCustomData(this.page2)
				} else {
					this.loadingText = '已加载全部'
				}
			}
		},
		methods      : {
			// 控制搜索部分显示
			handleScroll () {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
					document.body.scrollTop
				var scroll = scrollTop - this.scrollTop;
				this.scrollTop = scrollTop;
				if (scrollTop <= 200 && !this.searchBarFixed) {
					this.searchBarFixed = true
				}
				if (scrollTop > 200 && this.searchBarFixed) {
					this.searchBarFixed = false
				}
			},
			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				if (agent_id == '') {
					agent_id = localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id')
				} else {
					localStorage.setItem('agent_id', agent_id)
					sessionStorage.setItem('agent_id', agent_id)
				}
				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					let that = this
					that.uid = res.data.uid
					that.corpid = res.data.corpid
					localStorage.setItem('uid', that.uid)

					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						that.getCopyright(that.refresh)
					}

					localStorage.setItem('corpid', that.corpid)

					if ((localStorage.getItem('corpid') || that.getParameter('corpid')) && localStorage.getItem('user_id')) {
						//获取权限
						that.getPermissionButton()
					}
					that.ticketData = res.data.ticketData
					that.agentData = res.data.agentData


					that.$store.state.wx.config({
						beta     : true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
						debug    : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId    : that.ticketData.corpid, // 必填，企业微信的corpID
						timestamp: that.ticketData.timestamp, // 必填，生成签名的时间戳
						nonceStr : that.ticketData.nonceStr, // 必填，生成签名的随机串
						signature: that.ticketData.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
						jsApiList: that.ticketData.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					})

					that.$store.state.wx.error(function (res) {
						uni.showToast({
							title   : res.errMsg,
							image   : '/static/fail.png',
							duration: 2000
						});
					})

					that.$store.state.wx.ready(function () {
						that.$store.state.wx.hideOptionMenu();
						let agentConfig
						agentConfig = setInterval(() => {
							if (typeof that.$store.state.wx.agentConfig === 'function') {
								clearInterval(agentConfig);
								that.$store.state.wx.agentConfig({
									corpid   : that.agentData.corpid,
									agentid  : that.agentData.agentid,
									timestamp: that.agentData.timestamp,
									nonceStr : that.agentData.nonceStr,
									signature: that.agentData.signature,
									jsApiList: that.agentData.jsApiList,
									success  : function () {
										// 回调
										that.getInfoData()
									},
									fail     : function (res) {
										if (res.errMsg.indexOf('function not exist') > -1) {
											uni.showToast({
												title   : '版本过低请升级',
												image   : '/static/fail.png',
												duration: 2000
											});
										} else if (res.errMsg == 'agentConfig:not match any reliable domain.') {
											uni.showToast({
												title   : '可信域名未填写或未验证',
												image   : '/static/fail.png',
												duration: 2000
											});
										} else {
											uni.showToast({
												title   : res.errMsg,
												image   : '/static/fail.png',
												duration: 2000
											});
										}
									}
								})
							}
						}, 300)
					})

				}
			},
			//重新渲染頁面
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			getInfoData () {
				this.tabType = 0
				this.btnType = 0
				try {
					const tab_type = uni.getStorageSync('tab_type');
					const btn_type = uni.getStorageSync('btn_type');
					if (typeof tab_type != null && tab_type != '') {
						this.tabType = tab_type
					}
					if (typeof btn_type != null && btn_type != '') {
						this.btnType = btn_type
					}
					if (this.tabType == 0) {
						try {
							const value = uni.getStorageSync('name');
							if (this.btnType == 0) {
								if (typeof value != null) {
									if (typeof value != null) {
										this.name = value;
									}
									this.getData()
									try {
										uni.removeStorageSync('name');
									} catch (e) {
										// error
									}
								} else {
									this.getData()
								}
							} else if (this.btnType == 1) {
								if (typeof value != null) {
									if (typeof value != null) {
										this.name = value;
									}
									this.getData2()
									try {
										uni.removeStorageSync('name');
									} catch (e) {
										// error
									}
								} else {
									this.getData2()
								}
							}
						} catch (e) {
							// error
						}
						// this.getData()
					} else if (this.tabType == 1) {
						try {
							const value = uni.getStorageSync('noCustomName');
							if (typeof value != null) {
								if (typeof value != null) {
									this.name = value;
								}
								this.getNoCustomData()
								try {
									uni.removeStorageSync('noCustomName');
								} catch (e) {
									// error
								}
							} else {
								this.getNoCustomData()
							}
						} catch (e) {
							// error
						}
					}
					try {
						uni.removeStorageSync('tab_type');
						uni.removeStorageSync('btn_type');
					} catch (e) {
						// error
					}
				} catch (e) {
					// error
				}
			},
			//客户列表->可认领
			async getData (page = 1) {
				this.isLoading = false
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				const {data: res} = await this.axios.post("wap-public-sea/customer", {
					corp_id  : localStorage.getItem('corpid'),
					uid      : localStorage.getItem('uid'),
					user_id  : localStorage.getItem('user_id'),
					name     : this.name,
					page     : page,
					page_size: 50
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
					this.is_show_copyright2 = true
					this.isLoading = true

				} else {
					let that = this
					that.isReady = true
					that.page = page
					that.customCount = res.data.count
					that.realCustomCount = res.data.realCount
					that.is_master = res.data.is_master

					if (that.page == 1) {
						that.customList = res.data.customerData
					} else {
						that.customList = that.customList.concat(res.data.customerData)
					}

					that.customList.map(x => {
						x.checked = false
						that.checkArr.map(y => {
							if (x.id == y) {
								x.checked = true
							}
						})
					})

					if (that.customList.length == that.customCount) {
						that.loadingText = '已加载全部'
					}
					uni.hideLoading();
					this.isLoading = true
					this.is_show_copyright2 = true
				}
			},
			//指定分配、认领
			claim (item, type) {
				if (this.tabType == 0 && this.btnType == 0) {
					this.actionName = item.customerInfo.name
				} else if (this.tabType == 1) {
					this.actionName = item.name
				}
				this.actionId = item.id
				this.is_claim = type
				this.lotsOf = 0
				if (type == 0) {
					//分配
					uni.hideTabBar()
					this.showChooseStaff = true
				} else if (type == 1) {
					//认领
					let that = this
					uni.showModal({
						content: '你确定要认领【' + that.actionName + '】吗？',
						success: function (res) {
							if (res.confirm) {
								that.oneClaim('')
							} else if (res.cancel) {
								that.actionName = ''
								that.actionId = ''
								that.is_claim = 0
							}
						}
					});
				}
			},
			//批量分配
			claim2 (type) {
				this.is_claim = type
				this.lotsOf = 1
				uni.hideTabBar()
				this.showChooseStaff = true
			},
			replyMsg (item) {
				uni.showTabBar()
				let that = this
				that.showChooseStaff = false
				if (typeof item != 'undefined' && item != '') {
					let title = '一旦确定将【' + that.actionName + '】转交给【' + item.name + '】，则进入该成员的客户列表。确定分配吗？'
					if (that.lotsOf == 1) {
						title = '确定分配吗？'
					}
					uni.showModal({
						content: title,
						success: function (res) {
							if (res.confirm) {
								that.oneClaim(item.id)
							} else if (res.cancel) {
								that.actionName = ''
								that.actionId = ''
								that.is_claim = 0
								that.isShrink = 1
								that.checkArr = []
								if (that.tabType == 0 && that.btnType == 0) {
									that.customList.map(x => {
										x.checked = false
									})
								} else if (that.tabType == 1) {
									that.noCustomList.map(x => {
										x.checked = false
									})
								}
								that.$forceUpdate()
								document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
							}
						}
					});
				} else {
					if (that.checkArr.length == 0) {
						that.isShrink = 1
						that.checkArr = []
						that.$nextTick(() => {
							document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
						})
					} else {
						if (that.tabType == 0 && that.btnType == 0) {
							that.customList.map(x => {
								that.checkArr.map(y => {
									if (x.id == y) {
										x.checked = true
									}
								})
							})
						} else if (that.tabType == 1) {
							that.noCustomList.map(x => {
								that.checkArr.map(y => {
									if (x.id == y) {
										x.checked = true
									}
								})
							})
						}
						that.isShrink = 0
						that.$nextTick(() => {
							document.getElementsByClassName('fix-btn')[0].style.left = '5%'
							that.$forceUpdate()
						})
					}
				}
			},
			async oneClaim (id) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				const {data: res} = await this.axios.post("wap-public-sea/customer-assign", {
					corp_id : localStorage.getItem('corpid'),
					uid     : localStorage.getItem('uid'),
					user_id : this.is_claim == 0 ? id : localStorage.getItem('user_id'),
					type    : this.tabType == 0 ? 1 : 0,
					sea_id  : this.lotsOf == 0 ? this.actionId : this.checkArr,
					is_claim: this.is_claim
				});
				if (res.error != 0) {
					uni.hideLoading();
					this.isShrink = 1
					this.checkArr = []
					if (this.tabType == 0 && this.btnType == 0) {
						//企微
						this.customList.map(x => {
							x.checked = false
						})
					} else if (this.tabType == 1) {
						//非企微
						this.noCustomList.map(x => {
							x.checked = false
						})
					}
					document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					uni.showToast({
						title   : res.data.textHtml,
						duration: 2000
					});
					let that = this
					that.actionName = ''
					that.actionId = ''
					that.is_claim = 0
					that.isShrink = 1
					that.checkArr = []
					if (that.tabType == 0 && that.btnType == 0) {
						//企微
						that.customList.map(x => {
							x.checked = false
						})
					} else if (that.tabType == 1) {
						//非企微
						that.noCustomList.map(x => {
							x.checked = false
						})
					}
					document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
					setTimeout(function () {
						if (that.tabType == 0 && that.btnType == 0) {
							//企微客户
							that.getData()
						} else if (that.tabType == 1) {
							//非企微客户
							that.getNoCustomData()
						}
					}, 2000);
				}
			},
			//共享提醒
			notice (item) {
				let that = this
				if (that.tabType == 0 && that.btnType == 1) {
					//企微客户->已认领
					uni.showModal({
						content: '确定提醒【' + item.old_user_name + '】共享【' + item.name + '】？',
						success: function (res) {
							if (res.confirm) {
								that.oneNotice(item.id)
							}
						}
					});
				}
			},
			async oneNotice (id) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				const {data: res} = await this.axios.post("public-sea-customer/claim-remind", {
					corp_id      : localStorage.getItem('corpid'),
					uid          : localStorage.getItem('uid'),
					claim_user_id: id
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					uni.showToast({
						title   : '提醒成功',
						duration: 2000
					});
				}
			},
			//客户列表->已认领
			async getData2 (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.isLoading = false
				const {data: res} = await this.axios.post("wap-public-sea/claim-user", {
					corp_id  : localStorage.getItem('corpid'),
					uid      : localStorage.getItem('uid'),
					user_id  : localStorage.getItem('user_id'),
					name     : this.name,
					page     : page,
					page_size: 15
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
					this.isLoading = true
					this.is_show_copyright2 = true
				} else {
					let that = this
					that.page2 = page
					that.isReady = true
					that.customCount2 = res.data.count
					that.realCustomCount2 = res.data.realCount

					if (that.page2 == 1) {
						that.customList2 = res.data.customerData
					} else {
						that.customList2 = that.customList2.concat(res.data.customerData)
					}

					if (that.customList2.length == that.customCount2) {
						that.loadingText = '已加载全部'
					}
					uni.hideLoading();
					this.isLoading = true
					this.is_show_copyright2 = true

				}
			},
			//切换可认领、已认领
			changeType (type) {
				this.isLoading = false
				this.btnType = type
				this.isShrink = 1
				this.checkArr = []
				this.is_show_copyright2 = false
				if (typeof document.getElementsByClassName('fix-btn')[0] != 'undefined') {
					document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.loadingText = '加载中...'
				if (type == 0) {
					this.page = 1
					this.getData()
				} else if (type == 1) {
					this.page2 = 1
					this.getData2()
				}
			},
			checkboxChange: function (e) {
				//找出当前点击的id值
				function diff (arr1, arr2) {
					var newArr1 = arr1.filter(value => arr2.indexOf(value) == -1);
					var newArr2 = arr2.filter(value => arr1.indexOf(value) == -1);

					return newArr1.concat(newArr2);
				}

				//删除数组中某一项，获取剩余数组
				function arrMove (arr, key) {
					var temp = [];
					for (var i = 0; i < arr.length; i++) {
						if (i != key) {
							temp.push(arr[i]);
						}
					}
					return temp;
				}

				let checkId = diff(e.target.value, this.checkArr).join(',')
				if (this.checkArr.indexOf(checkId) == -1) {
					if (this.checkArr.length >= 50) {
						uni.showToast({
							title   : '最多只能选择50个客户',
							image   : '/static/fail.png',
							duration: 2000
						});
						this.keyVal++
					} else {
						this.checkArr = e.target.value
					}
				} else {
					this.checkArr = arrMove(this.checkArr, this.checkArr.indexOf(checkId))
				}
				if (this.tabType == 0 && this.btnType == 0) {
					//企微
					this.customList.map(x => {
						x.checked = false
						this.checkArr.map(y => {
							if (x.id == y) {
								x.checked = true
							}
						})
					})
				} else if (this.tabType == 1) {
					//非企微
					this.noCustomList.map(x => {
						x.checked = false
						this.checkArr.map(y => {
							if (x.id == y) {
								x.checked = true
							}
						})
					})
				}
				if (this.checkArr.length > 0) {
					this.isShrink = 0
					document.getElementsByClassName('fix-btn')[0].style.left = '5%'
					document.getElementsByClassName('fix-btn')[0].style.transitionDuration = '0.5s'
				} else {
					this.isShrink = 1
					document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
					document.getElementsByClassName('fix-btn')[0].style.transitionDuration = '0.5s'
				}
			},
			trigger (type) {
				if (this.tabType == 0 && this.btnType == 0) {
					//企微
					if (this.customList.length >= 50) {
						if (this.checkArr.length == 0 || this.checkArr.length >= 50) {
							this.isShrink = type
							this.checkArr = []
						} else if (this.checkArr.length > 0 && this.checkArr.length < 50) {
							this.isShrink = 0
						}
					} else {
						if (this.checkArr.length == 0 || this.checkArr.length >= this.customList.length) {
							this.isShrink = type
							this.checkArr = []
						} else if (this.checkArr.length > 0 && this.checkArr.length < this.customList.length) {
							this.isShrink = 0
						}
					}
				} else if (this.tabType == 1) {
					//非企微
					if (this.noCustomList.length >= 50) {
						if (this.checkArr.length == 0 || this.checkArr.length >= 50) {
							this.isShrink = type
							this.checkArr = []
						} else if (this.checkArr.length > 0 && this.checkArr.length < 50) {
							this.isShrink = 0
						}
					} else {
						if (this.checkArr.length == 0 || this.checkArr.length >= this.noCustomList.length) {
							this.isShrink = type
							this.checkArr = []
						} else if (this.checkArr.length > 0 && this.checkArr.length < this.noCustomList.length) {
							this.isShrink = 0
						}
					}
				}

				if (this.isShrink == 0) {
					//批量不收缩，全选
					if (this.tabType == 0 && this.btnType == 0) {
						//企微
						if (this.name == '') {
							this.checkArr = []
						}
						for (let i = 0; i < this.customList.length; i++) {
							if (i < 50) {
								if (this.customList[i] && this.checkArr.indexOf(this.customList[i].id) == -1) {
									this.customList[i].checked = true
									this.checkArr.push(this.customList[i].id)
								}
							} else {
								this.customList[i].checked = false
							}
						}
						let tip = '已成功选择前' + this.checkArr.length + '个客户'
						uni.showToast({
							title   : tip,
							duration: 2000
						});
					} else if (this.tabType == 1) {
						//非企微
						if (this.noCustomName == '') {
							this.checkArr = []
						}
						for (let i = 0; i < this.noCustomList.length; i++) {
							if (i < 50) {
								if (this.noCustomList[i] && this.checkArr.indexOf(this.noCustomList[i].id) == -1) {
									this.noCustomList[i].checked = true
									this.checkArr.push(this.noCustomList[i].id)
								}
							} else {
								this.noCustomList[i].checked = false
							}
						}
						let tip = '已成功选择前' + this.checkArr.length + '个客户'
						uni.showToast({
							title   : tip,
							duration: 2000
						});
					}
					document.getElementsByClassName('fix-btn')[0].style.left = '5%'
					document.getElementsByClassName('fix-btn')[0].style.transitionDuration = '0.5s'
				} else if (this.isShrink == 1) {
					//批量收缩，置空
					if (this.tabType == 0 && this.btnType == 0) {
						for (let i = 0; i < this.customList.length; i++) {
							if (this.customList[i]) {
								this.customList[i].checked = false
							}
						}
					} else if (this.tabType == 1) {
						for (let i = 0; i < this.noCustomList.length; i++) {
							if (this.noCustomList[i]) {
								this.noCustomList[i].checked = false
							}
						}
					}
					document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
					document.getElementsByClassName('fix-btn')[0].style.transitionDuration = '0.5s'
				}
			},
			//非客户列表
			async getNoCustomData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.isLoading = false
				const {data: res} = await this.axios.post("wap-public-sea/no-customer", {
					uid      : localStorage.getItem('uid'),
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					name     : this.noCustomName,
					page     : page,
					page_size: 50
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg + '11',
						image   : '/static/fail.png',
						duration: 2000
					});
					this.isLoading = true
					this.is_show_copyright2 = true
				} else {
					let that = this
					that.noCustomPage = page
					that.noCustomCount = res.data.count
					that.recordStatusList = res.data.optionList
					that.recordStatusIndex = 0
					that.recordStatus = Number(that.recordStatusList[0].id)

					if (that.noCustomPage == 1) {
						that.noCustomList = res.data.customerData
					} else {
						that.noCustomList = that.noCustomList.concat(res.data.customerData)
					}

					that.noCustomList.map(x => {
						x.checked = false
						that.checkArr.map(y => {
							if (x.id == y) {
								x.checked = true
							}
						})
					})

					if (that.noCustomList.length == that.noCustomCount) {
						that.loadingText = '已加载全部'
					}
					uni.hideLoading();
					this.isLoading = true
					this.is_show_copyright2 = true
				}
			},
			//查重
			check () {
				this.$refs['checkVisible'].open()
			},
			async searchCheck (e, page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				const {data: res} = await this.axios.post("public-sea-customer/check-repeat", {
					corp_id : localStorage.getItem('corpid'),
					uid     : localStorage.getItem('uid'),
					name    : this.checkName,
					page    : page,
					pageSize: 15
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.checkListPage = page;
					if(page == 1){
						this.checkList = res.data.info
					}else {
						this.checkList = this.checkList.concat(res.data.info)
					}
				}
			},
			cancelCheck (type) {
				this.checkName = ''
				this.checkList = []
				this.checkListPage = 1
				this.$refs[type].close()
			},
			//查重到达底部加载事件
			scrollTolower () {
				this.checkListPage++
				this.searchCheck('',this.checkListPage)
			},
			//搜索确认
			search () {
				clearTimeout(this.searchTimeout)

				this.searchTimeout = setTimeout(() => {
					if (this.btnType == 0) {
						this.page = 1
						uni.pageScrollTo({
							scrollTop: 0,
							duration : 0
						});
						this.loadingText = '加载中...'
						this.getData()
					} else if (this.btnType == 1) {
						this.page2 = 1
						this.loadingText = '加载中...'
						this.getData2()
					}
				}, 300)
			},
			//选择标签
			chooseTags () {
				this.showChooseTags = true
			},
			replyMsg2 (tags, arr) {
				this.hasTagsId = tags
				this.hasTags = arr
				//录入客户的选择标签
				this.recordTags = tags
				uni.showTabBar()
				this.showChooseTags = false
			},
			//录入客户的删除标签
			delHasTags (id) {
				if (this.hasTagsId.indexOf(id) > -1) {
					this.hasTagsId.splice(this.hasTagsId.indexOf(id), 1)
				}
				if (this.recordTags.indexOf(id) > -1) {
					this.recordTags.splice(this.recordTags.indexOf(id), 1)
				}
				for (let i = this.hasTags.length - 1; i >= 0; i--) {
					if (this.hasTags[i].id == id) {
						this.hasTags.splice(i, 1)
						return false
					}
				}
			},
			reSetting () {
				this.noCustomName = ''
				this.hasTagsId = []
				this.hasTags = []
				this.getNoCustomData()
			},
			//搜索确认
			search2 () {
				clearTimeout(this.searchTimeout)

				this.searchTimeout = setTimeout(() => {
					this.isShrink = 1
					this.checkArr = []
					if (typeof document.getElementsByClassName('fix-btn')[0] != 'undefined') {
						document.getElementsByClassName('fix-btn')[0].style.left = '-12.8rem  /* -240/18.75 */'
					}
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					this.loadingText = '加载中...'
					this.noCustomPage = 1
					this.getNoCustomData()
				}, 300)
			},
			//跳转客户详情
			toCustomDetail (user_id, externalId) {
				try {
					uni.setStorageSync('name', this.name);
					uni.setStorageSync('tab_type', this.tabType);
					uni.setStorageSync('btn_type', this.btnType);
				} catch (e) {
					// error
				}
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.reLaunch({
					url: '/pages/customDetail/index?user_id=' + user_id + "&external_userid=" + externalId + "&agentId=" + agent_id + "&page=2"
				});
			},
			//跳转非企微客户详情
			async toNoCustomDetail (cid) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});

				const {data: res} = await this.axios.post("public-sea-customer/no-customer-detail", {
					corp_id: localStorage.getItem('corpid'),
					sea_id : cid,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.detailName = res.data.name
					this.detailWx = res.data.wx_num
					this.detailQQ = res.data.qq
					this.detailPhone = res.data.phone
					this.detailCompany = res.data.company
					this.detailEmail = res.data.email
					this.detailSex = res.data.gender
					this.detailArea = res.data.area
					this.detailMark = res.data.remark
					this.detailStatus = res.data.field_option_name
					this.detailTags = res.data.tagData
					this.$refs['noCustomDetailVisible'].open()
				}
			},
			cancelDetail (type) {
				this.detailName = ''
				this.detailWx = ''
				this.detailQQ = ''
				this.detailPhone = ''
				this.detailCompany = ''
				this.detailEmail = ''
				this.detailSex = ''
				this.detailArea = ''
				this.detailMark = ''
				this.detailStatus = ''
				this.detailTags = ''
				this.$refs[type].close()
			},
			//查看非企微客户标签
			toLookTags (tagData) {
				this.tagData = tagData
				this.$refs['tagsVisible'].open()
			},
			canceltags (type) {
				this.$refs[type].close()
				this.tagData = []
			},
			//清除输入框
			clearInput () {
				this.name = ''
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.loadingText = '加载中...'
				this.is_show_copyright2 = false
				if (this.btnType == 0) {
					Promise.all([
						this.getData(),
					]).then(res => {
						this.customList.map(x => {
							x.checked = false
							this.checkArr.map(y => {
								if (x.id == y) {
									x.checked = true
								}
							})
						})
						this.$forceUpdate()
					}).catch(e => {
					})
				} else if (this.btnType == 1) {
					this.getData2()
				}
			},
			clearInput2 () {
				this.noCustomName = ''
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.loadingText = '加载中...'
				this.is_show_copyright2 = false
				Promise.all([
					this.getNoCustomData(),
				]).then(res => {
					this.customList.map(x => {
						x.checked = false
						this.checkArr.map(y => {
							if (x.id == y) {
								x.checked = true
							}
						})
					})
					this.$forceUpdate()
				}).catch(e => {
				})
			},
			//录入客户
			openAddCustom () {
				this.hasTagsId = []
				this.hasTags = []
				this.is_edit = 0
				this.recordId = ''
				this.$refs['addCustomVisible'].open()
			},
			//编辑非企微客户
			async openAddCustom2 (item) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.is_edit = 1
				this.recordId = item.id

				const {data: res} = await this.axios.post("public-sea-customer/no-customer-detail", {
					corp_id: localStorage.getItem('corpid'),
					sea_id : item.id,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					uni.hideLoading();
					this.recordName = res.data.name
					this.recordWx = res.data.wx_num
					this.recordQQ = res.data.qq
					this.recordPhone = res.data.phone
					this.recordCompany = res.data.company
					this.recordEmail = res.data.email
					if (res.data.gender == '男') {
						this.recordSex = 0
					} else if (res.data.gender == '女') {
						this.recordSex = 1
					} else if (res.data.gender == '未知') {
						this.recordSex = 2
					}
					if (res.data.area != '') {
						this.recordArea = res.data.area.split('-')
					}
					this.recordMark = res.data.remark
					this.recordStatus = res.data.field_option_id
					this.recordStatusList.map((x, index) => {
						if (x.id == this.recordStatus) {
							this.recordStatusIndex = index
						}
					})
					this.hasTags = res.data.tagData
					this.hasTagsId = []
					if (res.data.tagData.length > 0) {
						res.data.tagData.map(x => {
							this.hasTagsId.push(x.tid)
						})
					}
					this.$refs['addCustomVisible'].open()
				}
			},
			changeRecordStatus (e) {
				this.recordStatusIndex = e.detail.value
				this.recordStatus = Number(this.recordStatusList[this.recordStatusIndex].id)
			},
			//地区
			changeArea (regions) {
				this.recordArea = []
				regions.map(x => {
					this.recordArea.push(x.name)
				})
				this.$forceUpdate()
			},
			//性别
			changeRecordSex (e) {
				this.recordSex = e.detail.value
			},
			cancelCustom (type) {
				this.recordName = ''
				this.recordWx = ''
				this.recordQQ = ''
				this.recordPhone = ''
				this.recordCompany = ''
				this.recordEmail = ''
				this.recordSex = 0
				this.recordArea = []
				this.recordMark = ''
				this.recordStatusIndex = 0
				this.recordStatus = ''
				this.recordTags = []
				this.hasTagsId = []
				this.hasTags = []
				this.$refs[type].close()
			},
			//确定录入客户
			async addCustom () {
				var wxReg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
				var qqReg = /^[1-9][0-9]{4,9}$/
				var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
				var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
				if (this.recordName == '') {
					uni.showToast({
						title   : '请填写姓名',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.recordWx == '' && this.recordQQ == '' && this.recordPhone == '') {
					uni.showToast({
						title   : '微信号/QQ号/手机号至少填写一个',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				if (this.recordWx != '') {
					if (!wxReg.test(this.recordWx)) {
						uni.showToast({
							title   : '请输入正确的微信号',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false;
					}
				}
				if (this.recordQQ != '') {
					if (!qqReg.test(this.recordQQ)) {
						uni.showToast({
							title   : '请输入正确的QQ号',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false;
					}
				}
				if (this.recordPhone != '') {
					if (!phoneReg.test(this.recordPhone)) {
						uni.showToast({
							title   : '请输入正确的手机号',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false;
					}
				}
				if (this.recordEmail != '') {
					if (!emailReg.test(this.recordEmail)) {
						uni.showToast({
							title   : '请输入正确的Email',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false;
					}
				}
				if (typeof this.recordStatus == 'object' && this.recordStatus.length == 0) {
					uni.showToast({
						title   : '请选择客户来源',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				let sexValue = ''
				if (this.recordSex == 0) {
					sexValue = '男'
				} else if (this.recordSex == 1) {
					sexValue = '女'
				} else if (this.recordSex == 2) {
					sexValue = '未知'
				}
				let area = ''
				if (this.recordArea.length > 0) {
					area = this.recordArea.join('-')
				}
				const {data: res} = await this.axios.post("wap-public-sea/set-no-customer", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					user_id        : localStorage.getItem('user_id'),
					name           : this.recordName,
					wx_num         : this.recordWx,
					phone          : this.recordPhone,
					qq             : this.recordQQ,
					company        : this.recordCompany,
					remark         : this.recordMark,
					field_option_id: this.recordStatus,
					sex            : sexValue,
					area           : area,
					email          : this.recordEmail,
					tag_ids        : this.recordTags,
					id             : this.recordId
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.cancelCustom('addCustomVisible')
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					this.reSetting()
				}
			}
		},
	}
</script>

<style scoped>
	.mainBox {
		background: #F2F3F5;
		text-align: left;
		font-size: 0.8rem /* 15/18.75 */;
		height: calc(100% - 50px);
		overflow: hidden;
	}

	.chartColor {
		color: #FFFFFF !important;
		background: #01B065 !important;
		border-color: #01B065 !important;
	}

	.uni-list-cell {
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		flex-direction: row;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding: 0.267rem /* 5/18.75 */ 0;
		border-top: 1px solid hsla(0, 0%, 0%, 0.1);
		border-bottom: 1px solid hsla(0, 0%, 0%, 0.1);
	}

	.uni-list-cell-left {
		white-space: nowrap;
		font-size: 0.747rem /* 14/18.75 */;
		padding: 0 0.8rem /* 15/18.75 */ 0 0;
	}

	.uni-list-cell-db {
		flex: 1;
	}

	.content-list {
		z-index: -1;
		background: #FFF;
	}

	.content-list-item {
		padding: 0.533rem /* 10/18.75 */;
		overflow: hidden;
		border-bottom: 0.053rem /* 1/18.75 */ solid #F7F7F7;
	}

	.content-list-item:last-child {
		margin: 0;
	}

	.content-list-checkbox {
		float: left;
		line-height: 3.2rem /* 60/18.75 */;
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		width: 0.853rem /* 16/18.75 */;
		height: 0.853rem /* 16/18.75 */;
		margin-right: 0.267rem /* 5/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid #D1D1D1;
	}

	.content-list-box {
		float: left;
		width: calc(100% - 1.6rem /* 30/18.75 */);
		padding: 0.533rem /* 10/18.75 */ 0 0 0.533rem /* 10/18.75 */;
		box-sizing: border-box;
	}

	.content-list-box-img {
		width: 2.4rem /* 45/18.75 */;
		height: 2.4rem /* 45/18.75 */;
		border-radius: 50%;
		margin-right: 0.533rem /* 10/18.75 */;
	}

	.content-list-box-right {
		display: inline-block;
		width: calc(100% - 4.053rem /* 76/18.75 */);
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
	}

	.content-hd-tabs {
		display: inline-block;
		padding: 0.16rem /* 3/18.75 */ 0.427rem /* 8/18.75 */;
		height: 1.067rem /* 20/18.75 */;
		line-height: 1.067rem /* 20/18.75 */;
		text-align: center;
		font-size: 0.64rem /* 12/18.75 */;
		border: 1px solid rgba(241, 244, 246, 1);
		border-radius: 0.8rem /* 15/18.75 */;
		margin: 0 0.267rem /* 5/18.75 */ 0.267rem /* 5/18.75 */ 0;
		cursor: pointer;
	}

	.empty-img {
		width: 38%;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.input-box {
		width: 96%;
		height: 1.6rem /* 30/18.75 */;
		float: left;
		box-sizing: border-box;
		border: 0.053rem /* 1/18.75 */ solid #FFF;
		margin: 0.8rem /* 15/18.75 */ 2%;
		background: #F2F3F5;
		border-radius: 0.96rem /* 18/18.75 */;
		font-size: 0.747rem /* 14/18.75 */;
		color: #999;
		padding: 0 0.533rem /* 10/18.75 */ !important;
		display: flex;
		/*align-items: center;*/
		/*justify-content: center;*/
	}

	.search-input {
		font-size: 1.493rem /* 28/18.75 */;
		width: calc(200% - 4rem /* 75/18.75 */);
		flex-shrink: 0;
		display: inline-block;
		line-height: 2.987rem /* 56/18.75 */ !important;
		transform: scale(0.5);
		transform-origin: left top;
		/*margin-top: 0.053rem  !* 1/18.75 *!;*/
		height: 2.987rem /* 56/18.75 */;
		margin-top: 0.053rem /* 1/18.75 */;
		margin-right: 0.267rem /* 5/18.75 */;
	}

	/deep/ .uni-input-input {
		color: grey;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 16rem /* 300/18.75 */;
		background-color: #FFF;
		border-radius: 4px;
		/*left: 12.5%;*/
		/*position: absolute;*/
		/*top: 15%;*/
		box-sizing: border-box;
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

	.add-project /deep/ .uni-tip {
		width: 100%;
		border-radius: 5px 5px 0 0;
	}

	/deep/ .uni-input {
		margin: 0 5px 0 0;
	}

	.add-project-cancal {
		width: 6.4rem /* 120/18.75 */;
		line-height: 2.24rem /* 42/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid #EEEEEE;
		border-radius: 0.267rem /* 5/18.75 */;
		text-align: center;
		margin-right: 0.48rem /* 9/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		color: #333;
	}

	.add-project-ok {
		width: calc(100% - 6.88rem /* 129/18.75 */);
		line-height: 2.24rem /* 42/18.75 */;
		border-radius: 0.267rem /* 5/18.75 */;
		text-align: center;
		background: #01B065;
		font-size: 0.8rem /* 15/18.75 */;
		color: #FFF;
	}

	.add-input {
		height: 1.493rem /* 28/18.75 */;
		line-height: 1.493rem /* 28/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		text-align: left;
		border: 0.053rem /* 1/18.75 */ solid #F2F2F2;
		border-radius: 0.213rem /* 4/18.75 */;
		padding: 0 0.427rem /* 8/18.75 */;
		width: calc(100% - 5.867rem /* 110/18.75 */);
		display: inline-block;
		vertical-align: middle;
	}

	.lable-left {
		width: 4.267rem /* 80/18.75 */;
		text-align: right;
		display: inline-block;
	}

	.add-project /deep/ .input-placeholder {
		font-size: 0.693rem /* 13/18.75 */;
		color: #D2D2D2;
		margin-top: 0.053rem /* 1/18.75 */;
	}

	.add-project /deep/ .uni-input-input {
		font-size: 0.693rem /* 13/18.75 */;
	}

	.tags-li {
		height: 1.6rem /* 30/18.75 */;
		line-height: 1.6rem /* 30/18.75 */;
		box-sizing: border-box;
		margin: 0 0.533rem /* 10/18.75 */ 0.533rem 0;
		border-radius: 0.853rem /* 16/18.75 */;
		float: left;
		padding: 0 0.853rem /* 16/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		background: #E7EFFC;
		color: #01B065;
	}

	.nav {
		width: 100%;
		/*height: 2.667rem;*/
		background: rgba(255, 255, 255, 1);
		/*line-height: 2.667rem;*/
		/*overflow: hidden;*/
		border-bottom: 0.053rem solid #F5F5F5;
		font-size: 0.747rem;
		color: rgba(153, 153, 153, 1);
		font-weight: 500;
	}

	/deep/ .tab__item {
		font-size: 0.747rem;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
	}

	/deep/ .tab__line {
		width: 1.1rem !important;
		height: 0.213rem;
		background: #01B065;
		border-radius: 0.107rem;
	}

	/deep/ #tab_list {
		padding: 0;
	}

	.nav_tab {
		width: 20rem;
		height: 37.813rem;
		background: rgba(255, 255, 255, 1);
	}

	.wrap {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.content-list-box-btn {
		font-size: 0.587rem /* 11/18.75 */;
		display: inline-block;
		line-height: 1.6rem /* 30/18.75 */;
		color: #666;
		margin-right: 0.16rem /* 3/18.75 */;
	}

	.list-hd-content-tag {
		background: #E7EFFC;
		color: #01B065;
		border-radius: 0.267rem /* 5/18.75 */;
		line-height: 0.853rem /* 16/18.75 */;
		margin: 0 0.267rem /* 5/18.75 */ 0.267rem /* 5/18.75 */ 0;
		padding: 0.16rem /* 3/18.75 */ 0.427rem /* 8/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
	}

	/deep/ .uni-list-item__container {
		display: block;
	}

	.fix-btn {
		color: #FFF;
		background: #01B065;
		position: fixed;
		padding: 0.64rem /* 12/18.75 */;
		left: -12.8rem /* -240/18.75 */;
		width: 90%;
		box-sizing: border-box;
		bottom: 55px;
		border-radius: 1.333rem /* 25/18.75 */;
		box-shadow: 0 0.053rem /* 1/18.75 */ 0.213rem /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);
	}

	.fix-btn-left {
		width: 25%;
		display: inline-block;
		text-align: center;
		border-right: 0.107rem /* 2/18.75 */ solid #FFF;
		box-sizing: border-box;
	}

	.fix-btn-right {
		width: 75%;
		display: inline-block;
		text-align: center;
	}

	.mini-btn {
		float: right;
		font-size: 0.64rem /* 12/18.75 */;
		width: 18%;
		height: 1.493rem /* 28/18.75 */;
		line-height: 1.493rem /* 28/18.75 */;
	}

	.add-input /deep/ .uni-input-wrapper {
		margin-top: 0.053rem /* 1/18.75 */;
	}

</style>