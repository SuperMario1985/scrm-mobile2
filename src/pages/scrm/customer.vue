<template>
	<view class="box" v-if="isReady" :class="wosScroll">
		<view v-show="!showChooseTags && !showChooseDepartment">
			<view id="searchBar" class="content_head">
				<view style="text-align: center;background: rgba(82, 132, 236, 1);" v-if="isdetail==1&&searchBarFixed">
					<view class="tabs" :class="tabType == 1 ? 'chooseTab' : ''" @click="changeTab(1)">
						企微客户
					</view>
					<view class="tabs" :class="tabType == 2 ? 'chooseTab' : ''" @click="changeTab(2)">
						非企微客户
					</view>
					<view class="tabs" :class="tabType == 3 ? 'chooseTab' : ''" @click="changeTab(3)">客户群</view>
				</view>
				<template v-if="(tabType == 1 || tabType == 2)">
					<view style="overflow: hidden;background: #5284EC;" v-if="isdetail==1&&searchBarFixed">
						<view class="input-box">
							<uni-icons type="search"
							           style="font-size: 0.853rem  /* 16/18.75 */;color: #999;margin-right: 0.267rem  /* 5/18.75 */; margin-top: 0.107rem  /* 2/18.75 */; line-height: 1.493rem  /* 28/18.75 */; height: 1.493rem  /* 28/18.75 */;"></uni-icons>
							<input class="search-input" confirm-type="search"
							       :placeholder="tabType == 1 ? '请输入客户姓名/昵称/备注/公司名称' : '请输入客户姓名/手机号/QQ号/邮箱' "
							       v-model="name" @input="search" placeholder-style="color:#999"/>
							<uni-icons type="clear"
							           style="font-size: 0.96rem  /* 18/18.75 */;color: #999;margin-left: calc(-100% + 2.133rem  /* 40/18.75 */); line-height: 1.493rem  /* 28/18.75 */; margin-top: 0.107rem  /* 2/18.75 */;"
							           v-if="name != ''" @click="clearInput"></uni-icons>
						</view>
						<text style="cursor:pointer;display: inline-block;width: 15%;text-align: center;color: #FFF;background: #5284EC;line-height: 1.6rem  /* 30/18.75 */;"
						      @click="reSetting">重置
						</text>
						<!--					<text style="color: #666;font-size: 13px;" @click="lossCustomer">流失客户</text>-->
					</view>
					<view class="tab_picker">
						<view class="choose-tags choose-tags2" @click="chooseTags">
							<span v-if="tagIds.length == 0"
							      style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;float: left;display: inline-block;width: 2.933rem  /* 55/18.75 */;">按标签</span>
							<span v-if="tagIds.length > 0">{{tagIds.length}}个标签</span>
							<uni-icons type="arrowdown"
							           style="color: #999;margin: 0rem  /* 0/18.75 */ 0.267rem  /* 5/18.75 */ 0 0.267rem  /* 5/18.75 */;font-size: 0.853rem  /* 16/18.75 */;"></uni-icons>
						</view>
						<view class="choose-tags" @click="chooseStaff" v-if="show == 0">
							<span v-if="userCount == 0">所属成员</span>
							<span v-if="userCount > 0">{{userCount}}个成员</span>
							<uni-icons type="arrowdown"
							           style="color: #999;margin: 0rem  /* 0/18.75 */ 0.427rem  /* 8/18.75 */ 0 0.267rem  /* 5/18.75 */;font-size: 0.853rem  /* 16/18.75 */;"></uni-icons>
						</view>
						<ms-dropdown-menu
								style="font-size: 0.693rem  /* 13/18.75 */;width:42%;float: left;color: #999;">
							<ms-dropdown-item :hasSlot="true" :title="followName"
							                  ref="dropdownItem">
								<view class="dropdown-item-content">
									<uni-list>
										<uni-list-item @click="changeFollowId(-1,'全部状态')" :showArrow="false"
										               title="全部状态" :clickable="true">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="followId == -1"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item v-for="item in followList" :title="item.title" :ellipsis="1"
										               :showArrow="false" @click="changeFollowId(item.id,item.title)"
										               :clickable="true">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="followId == item.id"></uni-icons>
											</template>
										</uni-list-item>
									</uni-list>
								</view>
							</ms-dropdown-item>
							<ms-dropdown-item :hasSlot="true" title="更多"
							                  ref="dropdownItem2" class="dropdownItem2">
								<view class="dropdown-item-content2">
									<view style="margin-bottom: 2.667rem  /* 50/18.75 */;">
										<view class="more-title" v-if="tabType == 1">添加时间</view>
										<view class="more-title" v-if="tabType == 2">认领时间</view>
										<view style="margin: 10px 0;overflow:hidden;">
											<div type="default" class="more-choose"
											     :class="tabBtnType == 0 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(0)">
												全部客户
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 1 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(1)">今日新增
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 2 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(2)">本周新增
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 3 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(3)">本月新增
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 4 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(4)">自定义
											</div>
										</view>
										<view style="margin: 10px 0;overflow:hidden;" v-if="tabBtnType == 4">
											<view class="uni-list-cell">
												<view class="uni-list-cell-left">
													当前选择
												</view>
												<view class="uni-list-cell-db" @click="onShowDatePicker('rangetime')">
													<text v-if="rangetime.length > 0">
														{{rangetime[0]}} - {{rangetime[1]}}
													</text>
													<text v-if="rangetime.length == 0" style="color: #999;">请点击选择添加时间
													</text>
												</view>
											</view>
										</view>
										<view class="more-title">性别</view>
										<view style="margin: 10px 0;overflow:hidden;">
											<div type="default" class="more-choose"
											     :class="sex == -1 ? 'more-choose-blue' : ''" @click="changeSex(-1)">
												全部
											</div>
											<div type="default" class="more-choose"
											     :class="sex == 1 ? 'more-choose-blue' : ''" @click="changeSex(1)">男
											</div>
											<div type="default" class="more-choose"
											     :class="sex == 2 ? 'more-choose-blue' : ''" @click="changeSex(2)">女
											</div>
											<div type="default" class="more-choose"
											     :class="sex == 3 ? 'more-choose-blue' : ''" @click="changeSex(3)">未知
											</div>
										</view>
										<view class="more-title" v-if="tabType == 1">是否粉丝</view>
										<view style="margin: 10px 0;overflow:hidden;" v-if="tabType == 1">
											<div type="default" class="more-choose"
											     :class="isFans == 0 ? 'more-choose-blue' : ''"
											     @click="changeIsFans(0)">
												全部
											</div>
											<div type="default" class="more-choose"
											     :class="isFans == 1 ? 'more-choose-blue' : ''"
											     @click="changeIsFans(1)">
												是
											</div>
											<div type="default" class="more-choose"
											     :class="isFans == 2 ? 'more-choose-blue' : ''"
											     @click="changeIsFans(2)">
												否
											</div>
										</view>
										<view class="more-title" v-if="tabType == 1">客户持群数</view>
										<view style="margin: 10px 0;overflow:hidden;" v-if="tabType == 1">
											<div type="default" class="more-choose"
											     :class="chat_type == 0 ? 'more-choose-blue' : ''"
											     @click="changeChatType(0)">全部
											</div>
											<div type="default" class="more-choose"
											     :class="chat_type == 1 ? 'more-choose-blue' : ''"
											     @click="changeChatType(1)">无群
											</div>
											<div type="default" class="more-choose"
											     :class="chat_type == 2 ? 'more-choose-blue' : ''"
											     @click="changeChatType(2)">一个
											</div>
											<div type="default" class="more-choose"
											     :class="chat_type == 3 ? 'more-choose-blue' : ''"
											     @click="changeChatType(3)">多个
											</div>
										</view>
										<view class="more-title" v-if="tabType == 1 || tabType == 2">客户保护</view>
										<view style="margin: 10px 0;overflow:hidden;"
										      v-if="tabType == 1 || tabType == 2">
											<div type="default" class="more-choose"
											     :class="is_protect == -1 ? 'more-choose-blue' : ''"
											     @click="changeIsProtect(-1)">全部
											</div>
											<div type="default" class="more-choose"
											     :class="is_protect == 1 ? 'more-choose-blue' : ''"
											     @click="changeIsProtect(1)">已保护
											</div>
											<div type="default" class="more-choose"
											     :class="is_protect == 0 ? 'more-choose-blue' : ''"
											     @click="changeIsProtect(0)">未保护
											</div>
										</view>
									</view>
									<view class="dropdown-footer">
										<view type="default" class="dropdown-btn" @click="clear">重置</view>
										<view type="default" class="dropdown-btn"
										      style="color: #FFF;background: #5284EC;margin-left: 1.6rem  /* 30/18.75 */;"
										      @click="sure">
											确定
										</view>
									</view>
								</view>
							</ms-dropdown-item>
						</ms-dropdown-menu>
						<view class="sort"
						      style="float:left;line-height: 2.453rem  /* 46/18.75 */;text-align: center;font-size: 0.693rem  /* 13/18.75 */;">
							<image style="width: 0.693rem  /* 13/18.75 */;height: 0.693rem  /* 13/18.75 */;vertical-align: middle;"
							       src="../../static/scrm/sort.png" @click="showSortPicker"></image>
						</view>
					</view>
				</template>
				<template v-if="tabType == 3">
					<view style="overflow: hidden;background: #5284EC;" v-if="searchBarFixed">
						<view class="input-box">
							<uni-icons type="search"
							           style="font-size: 0.853rem  /* 16/18.75 */;color: #999;margin-right: 0.267rem  /* 5/18.75 */; margin-top:  0.107rem  /* 2/18.75 */; line-height: 1.493rem  /* 28/18.75 */; height: 1.493rem  /* 28/18.75 */;"></uni-icons>
							<input class="search-input" confirm-type="search" placeholder="请输入客户群名称" v-model="name2"
							       @input="search2" placeholder-style="color:#999"/>
							<uni-icons type="clear"
							           style="font-size: 0.96rem  /* 18/18.75 */;color: #999;margin-left: calc(-100% + 2.133rem  /* 40/18.75 */); line-height: 1.493rem  /* 28/18.75 */; margin-top:  0.107rem  /* 2/18.75 */;"
							           v-if="name2 != ''" @click="clearInput2"></uni-icons>
						</view>
						<text style="cursor:pointer;display: inline-block;width: 15%;text-align: center;color: #FFF;background: #5284EC;line-height: 1.6rem  /* 30/18.75 */;"
						      @click="reSetting2">重置
						</text>
					</view>
					<view class="tab_picker">
						<view class="choose-tags" @click="chooseStaff" v-if="show2 == 0">
							<span v-if="userCount == 0">选择群主</span>
							<span v-if="userCount > 0">{{userCount}}个群主</span>
							<uni-icons type="arrowdown"
							           style="color: #999;margin: 0rem  /* 0/18.75 */ 0.427rem  /* 8/18.75 */ 0 0.267rem  /* 5/18.75 */;font-size: 0.853rem  /* 16/18.75 */;"></uni-icons>
						</view>
						<ms-dropdown-menu
								style="width:71%;font-size: 0.693rem  /* 13/18.75 */;float: left;color: #999;">
							<ms-dropdown-item :hasSlot="true" :title="groupStatusName"
							                  ref="groupDropdown">
								<view class="dropdown-item-content">
									<uni-list>
										<uni-list-item :clickable="true" @click="changeGroupStatus(-1,'全部')"
										               :showArrow="false"
										               title="全部">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="groupStatus == -1"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item :clickable="true" @click="changeGroupStatus(0,'正常')"
										               :showArrow="false" title="正常">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="groupStatus == 0"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item :clickable="true" @click="changeGroupStatus(1,'跟进人离职')"
										               :showArrow="false"
										               title="跟进人离职">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="groupStatus == 1"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item :clickable="true" @click="changeGroupStatus(2,'离职继承中')"
										               :showArrow="false"
										               title="离职继承中">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="groupStatus == 2"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item :clickable="true" @click="changeGroupStatus(3,'离职继承完成')"
										               :showArrow="false"
										               title="离职继承完成">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="groupStatus == 3"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item :clickable="true" @click="changeGroupStatus(4,'群已解散')"
										               :showArrow="false"
										               title="群已解散">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="groupStatus == 4"></uni-icons>
											</template>
										</uni-list-item>
									</uni-list>
								</view>
							</ms-dropdown-item>
							<ms-dropdown-item :hasSlot="true" :title="followStatusName"
							                  ref="followDropdown">
								<view class="dropdown-item-content">
									<uni-list>
										<uni-list-item :showArrow="false" :ellipsis="1"
										               title="全部状态" @click="changeFollowId2(-1,'全部状态')"
										               :clickable="true">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="followId2 == -1"></uni-icons>
											</template>
										</uni-list-item>
										<uni-list-item v-for="item in followList" :ellipsis="1" :title="item.title"
										               :showArrow="false" @click="changeFollowId2(item.id,item.title)"
										               :clickable="true">
											<template v-slot:right="">
												<uni-icons type="checkmarkempty" size="22" color="#5284EC"
												           mode="widthFix"
												           v-if="followId2 == item.id"></uni-icons>
											</template>
										</uni-list-item>
									</uni-list>
								</view>
							</ms-dropdown-item>
							<ms-dropdown-item :hasSlot="true" :title="timeName" ref="timeDropdown">
								<view class="dropdown-item-content">
									<view style="margin-bottom: 5.333rem  /* 100/18.75 */;">
										<view style="margin: 0.533rem  /* 10/18.75 */;overflow:hidden;">
											<div type="default" class="more-choose"
											     :class="tabBtnType == 0 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(0)">
												全部群
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 1 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(1)">今日新增
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 2 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(2)">本周新增
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 3 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(3)">本月新增
											</div>
											<div type="default" class="more-choose"
											     :class="tabBtnType == 4 ? 'more-choose-blue' : ''"
											     @click="changeTabBtn(4)">自定义
											</div>
										</view>
										<view style="margin: 0 0.533rem  /* 10/18.75 */;overflow:hidden;"
										      v-if="tabBtnType == 4">
											<view class="uni-list-cell">
												<view class="uni-list-cell-left">
													当前选择
												</view>
												<view class="uni-list-cell-db"
												      @click="onShowDatePicker('rangetime2')">
													<text v-if="rangetime2.length > 0">
														{{rangetime2[0]}} - {{rangetime2[1]}}
													</text>
													<text v-if="rangetime2.length == 0" style="color: #999;">
														请点击选择创建时间
													</text>
												</view>
											</view>
										</view>
									</view>
									<view class="dropdown-footer">
										<view type="default" class="dropdown-btn" @click="clear2">重置</view>
										<view type="default" class="dropdown-btn"
										      style="color: #FFF;background: #5284EC;margin-left: 1.6rem  /* 30/18.75 */;"
										      @click="sure2">
											确定
										</view>
									</view>
								</view>
							</ms-dropdown-item>
						</ms-dropdown-menu>
					</view>
				</template>
				<view style="background: #FFF;">
					<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" :scroll-into-view="toView"
					             scroll-with-animation
					             v-if="tabType == 1 || tabType == 2"
					             style="white-space: nowrap;padding: 10px 10px 0 10px;width: auto;">
						<view class="content-hd-tabs" :id="'view'+0" @click="changeLinkTime(0)"
						      :style="{'background':linkTime == 0 ? '#5283EC' : '','color': linkTime == 0 ? '#FFF' : ''}">
							全部客户
						</view>
						<view class="content-hd-tabs" :id="'view'+-1" @click="changeLinkTime(-1)"
						      :style="{'background':linkTime == -1 ? '#5283EC' : '','color': linkTime == -1 ? '#FFF' : ''}">
							一直未联系
						</view>
						<view class="content-hd-tabs" v-for="item in notFollowDay" :id="'view'+item.id"
						      @click="changeLinkTime(item.id)"
						      :style="{'background':linkTime == item.id ? '#5283EC' : '','color': linkTime == item.id ? '#FFF' : ''}">
							超过{{item.day}}天未联系
						</view>
					</scroll-view>
					<view style="padding: 0 0.533rem  /* 10/18.75 */;">
						<text style="color: #2A3349;font-size: 0.747rem  /* 14/18.75 */;line-height: 1.867rem  /* 35/18.75 */;"
						      v-if="tabType == 1">
							共{{customCount}}位客户，实际客户{{uniqueCount}}位
						</text>
						<text style="color: #2A3349;font-size: 0.747rem  /* 14/18.75 */;line-height: 1.867rem  /* 35/18.75 */;"
						      v-if="tabType == 2">
							共{{noCustomCount}}位客户
						</text>
						<text style="color: #2A3349;font-size: 0.693rem  /* 13/18.75 */;line-height: 1.867rem  /* 35/18.75 */;"
						      v-if="tabType == 3">
							共{{count2}}个客户群
						</text>
						<button type="default" plain="true"
						        style="float: right;height: 1.067rem  /* 20/18.75 */;border: 0.053rem  /* 1/18.75 */ solid #5284EC;line-height: 1.067rem;font-size: 0.587rem  /* 11/18.75 */;color: #5284EC;border-radius: 1.6rem  /* 30/18.75 */;display: none;">
							重复客户
						</button>
					</view>
				</view>
			</view>
			<view class="content-list" :style="{'margin-top':tabType == 1 || tabType == 2 ? '12rem' : ''}">
				<template v-if="tabType == 1">
					<view class="content-list-item" v-for="item in customList" v-if="customList.length > 0">
						<view class="content-list-item-title">{{item.name}}</view>
						<view v-for="item2 in item.info" class="content-list-item-text">
							<view style="overflow:hidden;" @click="toCustomDetail(item2.userid,item2.external_userid)">
								<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
								       :src="item2.customerInfo.avatar" v-if="item2.customerInfo.avatar"></image>
								<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
								       src="../../static/useradvart.png" v-if="!item2.customerInfo.avatar"></image>
								<view class="list-hd-content"
								      style="display: flex;justify-content: space-between;align-items: center">
									<view style="width: 75%">
										<view class="list-hd-content-name">
											{{item2.customerInfo.name}}
											<text v-if="item2.customerInfo.corp_name != null"
											      style="font-size: 0.587rem;color: #FA9635;line-height: 1.067rem  /* 20/18.75 */;">
												@{{item2.customerInfo.corp_name}}
											</text>
											<text v-else
											      style="color: #30AB55;font-size: 0.587rem;line-height: 1.067rem  /* 20/18.75 */;">
												@微信
											</text>
											<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
											       src="../../static/scrm/man.png"
											       v-if="item2.customerInfo.gender == '男性'"></image>
											<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
											       src="../../static/scrm/woman.png"
											       v-if="item2.customerInfo.gender == '女性'"></image>
											<view v-if="item2.is_protect == 1"
											      style="font-size: 0.64rem  /* 12/18.75 */;display: inline-block;border: 0.053rem  /* 1/18.75 */ solid #4CD964;padding: 0.16rem  /* 3/18.75 */ 0.427rem  /* 8/18.75 */;border-radius: 0.16rem  /* 3/18.75 */;color: #4CD964;margin-left: 0.533rem  /* 10/18.75 */;">
												已保护
											</view>
										</view>
										<view class="list-hd-content-name"
										      style="font-size: 0.693rem  /* 13/18.75 */; line-height: 1.28rem  /* 24/18.75 */;height: 1.28rem  /* 24/18.75 */;overflow: hidden;">
											<text v-if="item2.per_name.length == 0 && item2.tag_name.length == 0"
											      style="color: #5283EC;">暂无标签
											</text>
											<text v-for="tag in item2.per_name" class="list-hd-content-tag">{{tag}}
											</text>
											<text v-for="tag in item2.tag_name" class="list-hd-content-tag">{{tag}}
											</text>
										</view>
									</view>
									<view style="background-color: #58E182;margin: 0 auto;border-radius: 8px;width: 25%;height: 20px;text-align: center"
									      @click.stop="contact(item2,0)"
									      v-if="item2.dialout_phone&&item2.dialout_exten">
										<span style="font-size: 14px;color:#FFF">联系TA</span>
									</view>
								</view>
								<uni-icons type="arrowright"
								           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;line-height: 2.4rem  /* 45/18.75 */;"></uni-icons>
							</view>
							<view style="margin-top: 0.427rem  /* 8/18.75 */;">
								<text style="font-size: 0.587rem  /* 11/18.75 */;color: #00B77B;">{{item2.chat}}</text>
								<text style="border: 0.053rem  /* 1/18.75 */ solid #FF684B;font-size: 0.587rem  /* 11/18.75 */;color: #FF684B;margin: 0 0.267rem  /* 5/18.75 */;border-radius: 3px;padding: 0 5px;"
								      :style="{'float': from == 1 ? 'right' : ''}">
									{{item2.follow_status}}
								</text>
								<text style="background: #F5F6FE;border-radius: 0.533rem  /* 10/18.75 */;color: #5283EC;font-size: 0.587rem  /* 11/18.75 */;padding: 0 0.267rem  /* 5/18.75 */;line-height: 1.067rem  /* 20/18.75 */;display: inline-block;float: right;"
								      v-if="from == 2">
									{{item2.memberInfo[0].member}}
								</text>
							</view>
						</view>
					</view>
					<drag-button
							:isDock="true"
							:existTabBar="true"
							@btnClick="toAddCustom" :content="addCustomImg" v-if="userPlatform != 'other'"/>
				</template>
				<template v-if="tabType == 2">
					<template v-if="noCustomList.length > 0">
						<view class="content-list-item" v-for="item in noCustomList">
							<view class="content-list-item-title">{{item.name}}</view>
							<view v-for="item2 in item.info" class="content-list-item-text">
								<view style="overflow:hidden;" @click="toNoCustomDetail(item2.key)">
									<image style="width: 2.4rem  /* 45/18.75 */; height: 2.4rem  /* 45/18.75 */; background-color: #FFF;float: left;border-radius: 0.267rem  /* 5/18.75 */;"
									       src="../../static/useradvart.png"></image>
									<view class="list-hd-content"
									      style="display: flex;justify-content: space-between;align-items: center">
										<view width="75%">
											<view class="list-hd-content-name">{{item2.customerInfo.name}}
												<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
												       src="../../static/scrm/man.png"
												       v-if="item2.customerInfo.gender == '男'"></image>
												<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
												       src="../../static/scrm/woman.png"
												       v-if="item2.customerInfo.gender == '女'"></image>
												<uni-tag text="已保护" type="success" :inverted="true"
												         style="width: 2.133rem;height: 1.3rem;line-height: 1.3rem;"
												         v-if="item2.is_protect == 1"></uni-tag>
											</view>
											<view class="list-hd-content-name"
											      style="font-size: 0.693rem  /* 13/18.75 */; line-height: 1.28rem  /* 24/18.75 */;height: 1.28rem  /* 24/18.75 */;overflow: hidden;">
												<text v-if="item2.tag_name.length == 0"
												      style="color: #5283EC;">暂无标签
												</text>
												<text v-for="tag in item2.tag_name" v-if="item2.tag_name.length > 0"
												      class="list-hd-content-tag">{{tag}}
												</text>
											</view>
										</view>

										<view style="background-color: #58E182;border-radius: 8px;width: 25%;height: 20px;text-align: center"
										      v-if="item2.dialout_phone&&item2.dialout_exten"
										      @click.stop="contact(item2,1)">
											<span style="font-size: 14px;color:#FFF">联系TA</span>
										</view>
									</view>

									<uni-icons type="arrowright"
									           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;line-height: 2.4rem  /* 45/18.75 */;"></uni-icons>
								</view>
								<view style="margin-top: 0.427rem  /* 8/18.75 */;">
									<text style="font-size: 0.587rem  /* 11/18.75 */;color: #00B77B;">{{item2.chat}}
									</text>
									<text style="border: 0.053rem  /* 1/18.75 */ solid #FF684B;font-size: 0.587rem  /* 11/18.75 */;color: #FF684B;margin: 0 0.267rem  /* 5/18.75 */;border-radius: 3px;padding: 0 5px;"
									      :style="{'float': from == 1 ? 'right' : ''}">
										{{item2.follow_status}}
									</text>
									<text style="background: #F5F6FE;border-radius: 0.533rem  /* 10/18.75 */;color: #5283EC;font-size: 0.587rem  /* 11/18.75 */;padding: 0 0.267rem  /* 5/18.75 */;line-height: 1.067rem  /* 20/18.75 */;display: inline-block;float: right;"
									      v-if="from == 2 && item2.memberInfo">
										{{item2.memberInfo.member}}
									</text>
								</view>
							</view>
						</view>
					</template>
					<drag-button
							:isDock="true"
							:existTabBar="true"
							@btnClick="openAddCustom" :content="addBtnImg" v-has="'client-import'"/>
				</template>
				<template
						v-if="(isLoading&&tabType == 1 && customList.length == 0) || (isLoading&&tabType == 2 && noCustomList.length == 0) || (isLoading&&tabType == 3 && groupList.length == 0)">
					<img src="../../static/scrm/empty.png" alt="" class="empty-img">
				</template>
				<view class="content-list-item-text" v-for="item in groupList" v-if="tabType == 3">
					<view style="overflow: hidden;">
						<view style="overflow:hidden;margin-bottom: 5px;"
						      @click="toGroupDetail(item.owner,item.chat_id_str)">
							<view style="background: #1890FF;width: 2.4rem  /* 45/18.75 */;height:2.4rem  /* 45/18.75 */;border-radius: 0.267rem  /* 5/18.75 */;float: left;overflow: hidden;"
							      v-if="item.avatarData.length == 0">
								<img src="../../static/group/chat.png"
								     style="width: 1.707rem  /* 32/18.75 */;margin: 0.347rem  /* 6.5/18.75 */;height: 1.707rem  /* 32/18.75 */;"/>
							</view>
							<view style="background: #DFDFDF;width: 2.4rem  /* 45/18.75 */;height:2.4rem  /* 45/18.75 */;border-radius: 0.267rem  /* 5/18.75 */;float: left;overflow: hidden;"
							      v-else-if="item.avatarData.length == 1">
								<img :src="item.avatarData[0]"
								     style="width: 2.4rem  /* 45/18.75 */;height:2.4rem  /* 45/18.75 */;"
								     v-if="item.avatarData[0] != ''"/>
								<img src="../../static/group/useradvart.png"
								     style="width: 2.4rem  /* 45/18.75 */;height:2.4rem  /* 45/18.75 */;"
								     v-if="item.avatarData[0] == ''"/>
							</view>
							<view style="background: #DFDFDF;width: 2.4rem  /* 45/18.75 */;height:2.4rem  /* 45/18.75 */;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 0.267rem  /* 5/18.75 */;float: left;align-items: center;overflow: hidden;"
							      v-else-if="item.avatarData.length > 1 && item.avatarData.length <= 4">
								<template v-for="imgItem in item.avatarData">
									<img :src="imgItem"
									     style="width: 1.173rem  /* 22/18.75 */;height: 1.173rem  /* 22/18.75 */;"
									     v-if="imgItem != ''"/>
									<img src="../../static/group/useradvart.png"
									     style="width: 1.173rem  /* 22/18.75 */;height: 1.173rem  /* 22/18.75 */;"
									     v-if="imgItem == ''"/>
								</template>
							</view>
							<view style="background: #DFDFDF;width: 2.4rem  /* 45/18.75 */;height:2.4rem  /* 45/18.75 */;display: flex;flex-wrap: wrap;justify-content: space-around;border-radius: 0.267rem  /* 5/18.75 */;float: left;align-items: center;overflow: hidden;"
							      v-else-if="item.avatarData.length > 4">
								<template v-for="imgItem in item.avatarData">
									<img :src="imgItem"
									     style="width: 0.747rem  /* 14/18.75 */;height: 0.747rem  /* 14/18.75 */;"
									     v-if="imgItem != ''"/>
									<img src="../../static/group/useradvart.png"
									     style="width: 0.747rem  /* 14/18.75 */;height: 0.747rem  /* 14/18.75 */;"
									     v-if="imgItem == ''"/>
								</template>
							</view>
							<view class="list-hd-content" style="width: calc(100% - 3.253rem  /* 61/18.75 */);">
								<view class="list-hd-content-name">{{item.name}}</view>
								<view style="color: #999999;font-size: 0.693rem  /* 13/18.75 */;font-weight: 500;overflow: hidden;line-height: 1.28rem  /* 24/18.75 */;">
									<text style="float: left;">
										{{item.member_num}}人 | 群主：{{item.owner_name}}
									</text>
								</view>
								<view style="overflow: hidden;">
									<view class="list-hd-content-name"
									      style="font-size: 0.64rem  /* 12/18.75 */;line-height: 1.28rem  /* 24/18.75 */;height: 1.28rem  /* 24/18.75 */;overflow: hidden;width: calc(100% - 20px);float: left;">
										<text v-if="item.tag_name.length == 0"
										      style="color: #5283EC;">暂无标签
										</text>
										<text v-for="tag in item.tag_name" class="list-hd-content-tag">{{tag.tname}}
										</text>
									</view>
								</view>
							</view>
							<uni-icons type="arrowright"
							           style="color: #CCC;font-size: 0.853rem  /* 16/18.75 */;float: right;line-height: 3.467rem  /* 65/18.75 */;"></uni-icons>
						</view>
						<view>
							<text style="font-size: 0.587rem  /* 11/18.75 */;color: #00B77B;">{{item.follow_des}}</text>
							<text style="border: 0.053rem  /* 1/18.75 */ solid #FF684B;font-size: 0.587rem  /* 11/18.75 */;color: #FF684B;margin: 0 0.267rem  /* 5/18.75 */;border-radius: 3px;padding: 0 5px;float: right;">
								{{item.follow_name}}
							</text>
						</view>
					</view>
				</view>
				<view class="custom-tabs-loading"
				      v-if="(tabType == 1 && customList.length > 0) || (tabType == 2 && noCustomList.length > 0) || (tabType == 3 &&groupList.length > 0)">
					{{loadingText}}
				</view>
			</view>
			<!-- 日期时间选择器 -->
			<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'"
			                :end-text="'结束'" :show-seconds="false" @confirm="onSelected" @cancel="onSelected"/>
			<!-- 选择排序弹窗 -->
			<uni-popup ref="sortPop" type="center">
				<!--				<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -9.2rem;"-->
				<!--				           color="#bfbabd" @click="closeSortPop"></uni-icons>-->
				<view style="width: 75%;background: #FFF;margin: auto;height: 5.333rem  /* 100/18.75 */;">
					<view style="line-height: 2.667rem  /* 50/18.75 */;line-height: 2.667rem  /* 50/18.75 */;padding: 0 0.533rem  /* 10/18.75 */;"
					      @click="changeFrom(2)">
						按添加时间排序
						<uni-icons type="checkmarkempty" size="22" color="#5284EC" style="float: right;"
						           v-if="from == 2"></uni-icons>
					</view>
					<view style="border-bottom: 0.053rem  /* 1/18.75 */ solid #CCC;line-height: 2.667rem  /* 50/18.75 */;line-height: 2.667rem  /* 50/18.75 */;padding: 0 0.533rem  /* 10/18.75 */;"
					      @click="changeFrom(1)">
						按添加人排序
						<uni-icons type="checkmarkempty" size="22" color="#5284EC" style="float: right;"
						           v-if="from == 1"></uni-icons>
					</view>

				</view>
			</uni-popup>
			<!--录入客户弹窗-->
			<uni-popup ref="addCustomVisible" type="bottom" :mask-click="false" class="add-project">
				<view class="uni-tip">
					<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
						录入客户
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
							<input class="add-input" type="text" v-model="recordMark" placeholder="请输入备注"
							       maxlength="10"/>
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
						<view style="margin: 0.8rem  /* 15/18.75 */ 0 0 0; display: flex;flex-wrap: wrap;justify-content: flex-start">
							<view style="margin-bottom: 0.8rem">
								<view class="lable-left">
									<text style="font-weight: 700;vertical-align: sub;">客户标签：</text>
								</view>
								<button type="default"
								        style="font-size: 0.693rem  /* 13/18.75 */;display: inline-block;vertical-align: middle;"
								        @click="chooseTags1">
									选择标签
								</button>
							</view>
							<view class="tags-li" v-for="(tag,tagIndex) in hasTags" @click="delHasTags(tag.id)">
								{{tag.tagname}}
								<uni-icons type="closeempty"
								           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"></uni-icons>
							</view>
						</view>
					</scroll-view>
					<view class="uni-tip-group-button">
						<text class="add-project-cancal" @click="cancelCustom('addCustomVisible')">取消</text>
						<text class="add-project-ok" @click="addCustom">确定</text>
					</view>
				</view>
			</uni-popup>
			<template
					v-if="(isLoading&&tabType == 1 && customList.length == 0) || (isLoading&&tabType == 2 && noCustomList.length == 0) || (isLoading&&tabType == 3 && groupList.length == 0)">
				<Footer v-if="is_show_copyright == 1 && is_show_copyright2"
				        style="position: absolute;bottom: 50px;right: 0;left: 0;"></Footer>
			</template>
			<template v-else>
				<Footer v-if="is_show_copyright == 1 && is_show_copyright2" style="background: #FFF;"></Footer>
			</template>
		</view>
		<choose-tags v-if="showChooseTags" :title="tagTitle" :call-back="replyMsg" :hasTagsId="hasTagsId"
		             :hasTags="hasTags"></choose-tags>
		<ChooseDepartment v-if="showChooseDepartment" :call-back="replyDepartment"
		                  :selectArray="selectDepartment"></ChooseDepartment>

		<uni-popup ref="showPhone" type="center" :maskClick="false">
			<phoneCall v-if="showCall" :customerData="selectedCustomer" :callBack="replyCall"/>
		</uni-popup>

		<uni-popup ref="addCustomer" type="center" class="add-project">
			<view class="uni-tip" style="width: 80%;margin-left: 10%">
				<text class="uni-tip-title">需要添加对方的个人微信吗？</text>
				<label class="radio">
					<radio :checked="isRemind" @click="handleRadioChange"/>
					直接跳过该提醒，下次直接进行电话拨打</label>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="handleCancel">取消</text>
					<text class="uni-tip-button" @click="handleConfirm">确定</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import ChooseTags from "../../components/ChooseTags.vue";
	import Footer from "../../components/footer/footer.vue";
	import ChooseDepartment from "@/components/ChooseDepartment.vue";
	import copyText from '../../static/js/copyText'
	import phoneCall from "@/components/call/phoneCall.vue";

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
		name        : "list",
		inject      : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden', 'getPermissionButton'],
		components  : {
			msDropdownMenu,
			msDropdownItem,
			MxDatePicker,
			ChooseTags,
			Footer,
			ChooseDepartment,
			phoneCall
		},
		data () {
			return {
				isRemind            : false,
				selectedCustomer    : {},
				contactType         : 0,
				showCall            : false,
				actionId            : '',
				phone               : '',
				tagTitle            : '标签筛选',
				wosScroll           : "wos-scroll-yes",
				isLoading           : false,
				scrollTop           : null,
				searchBarFixed      : true,
				isdetail            : 1,
				url                 : '',
				ticketData          : {},
				agentData           : {},
				commonUrl           : this.$store.state.commonUrl,
				isReady             : false,
				tabType             : 1,//1企微客户，2客户群
				tabBtnType          : 0,//0全部客户，1今日新增，2本周新增，3本月新增
				followId            : -1,//选择的跟进状态id
				followName          : '跟进状态',//选择的跟进状态名称
				followList          : [],//跟进状态数组
				//时间日期选择组件
				showPicker          : false,
				rangetime           : [],
				type                : 'rangetime',
				value               : '',
				//客户列表
				customList          : [],//列表数据
				page                : 1,//页码
				count               : 0,//分页
				customCount         : 0,//客户数
				uniqueCount         : 0,//去重客户数
				show                : 0,//0显示选择成员，1不显示选择成员
				tagIds              : [],//选择标签
				userId              : [],//选择的成员
				userCount           : 0,//选择的成员数量
				name                : '',//搜索客户名
				sex                 : -1,//性别
				isFans              : 0,//是否粉丝
				chat_type           : 0,//客户持群数
				is_protect          : -1,//客户保护
				from                : 2,//排序方式，1按人，2按时间
				loadingText         : '加载中...',
				lastId              : '',//最后一个客户的id值，为了后端分页取值，可能上拉加载时候会有新客户
				lastUser            : '',//最后一个客户的成员id值，为了后端分页取值，可能上拉加载时候会有新客户
				//非企微客户列表
				noCustomList        : [],//列表数据
				noCustomCount       : 0,////分页
				noCustomPage        : 1,//页码
				//客户群列表
				groupList           : [],//列表数据
				show2               : 0,//0显示选择群主，1不显示选择群主
				name2               : '',//搜索客户群名
				page2               : 1,//页码
				count2              : 0,//分页
				groupStatus         : -1,//群状态
				groupStatusName     : '群状态',//群状态名称
				rangetime2          : [],//创建群时间
				followId2           : -1,//选择的跟进状态
				followStatusName    : '跟进状态',//选择的跟进状态名称
				timeName            : '创建时间',
				toView              : '',//要跳转的位置
				notFollowDay        : [],//联系时间选项数组
				linkTime            : 0,//联系时间类型
				searchTimeout       : '',
				showChooseTags      : false,//是否展示选择标签组件
				addBtnImg           : '../../static/scrm/btn.png',//新建悬浮按钮
				addCustomImg        : '../../static/scrm/addCustom.png',//添加客户悬浮按钮
				//录入客户
				recordName          : '',//姓名
				recordWx            : '',//微信号
				recordQQ            : '',//QQ号
				recordPhone         : '',//手机号
				recordCompany       : '',//公司名称
				recordEmail         : '',//Email
				recordSex           : 0,//性别
				recordSexList       : [
					{name: '男'},
					{name: '女'},
					{name: '未知'},
				],//性别选择列表
				recordArea          : [],//地区
				recordMark          : '',//备注
				recordStatusList    : [],//客户来源列表
				recordStatusIndex   : 0,//客户来源index
				recordStatus        : '',//客户来源id
				recordTags          : '',//客户标签
				hasTagsId           : [],//传给选择标签组件的标签id
				hasTags             : [],//传给选择标签组件的标签数据
				hasTagsId2          : [],//非企微客户筛选与录入客户打标签冲突缓存
				hasTags2            : [],//非企微客户筛选与录入客户打标签冲突缓存
				userPlatform        : localStorage.getItem('userPlatform'),//客户端平台，pc端other，安卓手机android，苹果手机ios
				showChooseDepartment: false,//选择成员组件的显示与隐藏
				selectDepartment    : [],//已选择的成员
				is_show_copyright   : localStorage.getItem('is_show_copyright'),//是否展示底部版權
				is_show_copyright2  : false,//切换tab时候是否展示底部版权
			}
		},
		mounted () {
			window.addEventListener('scroll', this.handleScroll)
		},
		onTabItemTap: function (obj) {
			this.hasTagsId = []
			this.hasTags = []
			this.selectDepartment = []
			this.tabType = 1
			this.loadingText = '加载中...'
			this.tabBtnType = 0
			this.name = ''
			this.followId = -1
			this.followName = '跟进状态'
			this.rangetime = []
			this.sex = -1
			this.isFans = 0
			this.chat_type = 0
			this.groupList = []
			this.tagIds = []
			this.userId = []
			this.userCount = 0
			this.linkTime = 0
			this.from = 2
			this.toView = ''
			this.lastId = ''
			this.lastUser = ''
		},
		onShow () {
			uni.setNavigationBarTitle({
				title: '客户'
			});
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			let that = this

			that.$store.dispatch('setWx', () => {
				that.initPage(that.limit)
			})

			// localStorage.setItem('user_id', 'xuyumin')
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww93caebeee67d134b')
			// localStorage.setItem('agent_id', '25')
			// localStorage.setItem('token', 'U3ViVXNlci04NGVmZDNjMGVmNWFmYTJlMWM1ODFmNWU4ZjgyNTg3Nw=')
			// localStorage.setItem('is_show_copyright', 1)
			// that.is_show_copyright = 1
			// that.is_show_copyright2 = true
			// that.getInfoData()
		},

		onReachBottom: function () {
			if (this.tabType == 1) {
				let num = 0
				this.customList.map(x => {
					num = num + x.info.length
				})
				if (num < this.customCount) {
					if (this.from == 1) {
						//按添加人排序
						let info = this.customList[this.customList.length - 1]
						let total = this.customList[this.customList.length - 1].ContactCount
						if (info.info.length < total) {
							this.lastId = info.info[info.info.length - 1].key
							this.lastUser = info.user_id
							this.getData(this.page)
						} else {
							if (this.customList.length % 10 == 0) {
								this.lastId = ''
								this.lastUser = ''
								this.page += 1
								this.getData(this.page)
							} else {
								this.lastId = info.info[info.info.length - 1].key
								this.lastUser = info.user_id
								this.getData(this.page)
							}
						}
					} else if (this.from == 2) {
						//按添加时间排序
						this.page += 1
						this.getData(this.page)
					}
				} else {
					this.loadingText = '已加载全部'
				}
			} else if (this.tabType == 2) {
				let num = 0
				this.noCustomList.map(x => {
					num = num + x.info.length
				})
				if (num < this.noCustomCount) {
					this.noCustomPage += 1
					this.getNoCustomData(this.noCustomPage)
				} else {
					this.loadingText = '已加载全部'
				}
			} else if (this.tabType == 3) {
				if (this.groupList.length < this.count2) {
					this.page2 += 1
					this.getData2(this.page2)
				} else {
					this.loadingText = '已加载全部'
				}
			}
		},

		methods: {
			contact (item, type) {
				let that = this
				this.selectedCustomer = item
				this.selectedCustomer.type = type
				this.contactType = type
				let text1 = '是否拨打电话？拨打后，请先接听来电电话，接听后，才可自动对客户呼叫。'
				let text = '是否拨打电话'
				let msg = localStorage.getItem('userPlatform') == 'ios' ? text1 : text
				uni.showModal({
					title  : '提示',
					content: msg,
					success: function (res) {
						if(res.confirm){
							that.$refs.showPhone.open()
							that.showCall = true
						}
					}
				});
			},
			replyCall (data) {
				if (!data.showCall) {
					this.$refs.showPhone.close()
					this.actionId = data.actionId
					this.phone = data.phone
					this.showCall = false
					if (data.type == 1) {
						this.showTip()
					}
				}
			},

			async showTip () {
				const {data: res} = await this.axios.post("dialout/get-ignore-tip", {
					ActionID: this.actionId
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					if (res.data.state == 0) {
						this.$refs.addCustomer.open()
					}
				}
			},
			async handleConfirm () {
				const result = copyText(this.phone)
				if (result === false) {
					uni.showToast({
						title: '不支持',
					})
				} else {
					uni.showToast({
						title: '复制手机号成功',
						icon : 'none'
					})
				}
				if (this.isRemind) {
					const {data: res} = await this.axios.post("dialout/ignore-tip", {
						ActionID: this.actionId,
					});
					if (res.error != 0) {
						uni.showToast({
							title   : res.error_msg,
							image   : '/static/fail.png',
							duration: 2000
						});
					} else {
						this.$refs.addCustomer.close()
					}
				} else {
					this.$refs.addCustomer.close()
				}
				this.$store.state.wx.invoke('navigateToAddCustomer', {},
					function (res) {
						if (res.err_code != 0) {
							// uni.showToast({
							//   title: '请检查应用权限与客户功能权限',
							//   image: '/static/fail.png',
							//   duration: 2000
							// });
						}
					}
				);
			},
			handleRadioChange () {
				this.isRemind = !this.isRemind
			},
			handleCancel () {
				this.$refs.addCustomer.close()
			},

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
			getInfoData () {
				this.userPlatform = localStorage.getItem('userPlatform')
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.tabType = 1
				try {
					const tab_type = uni.getStorageSync('tab_type');
					if (typeof tab_type != null && tab_type != '') {
						this.tabType = tab_type
					}
					if (this.tabType == 1) {
						try {
							const value = uni.getStorageSync('follow_id');
							const value2 = uni.getStorageSync('follow_name');
							const value3 = uni.getStorageSync('tab_btn_type');
							const value4 = uni.getStorageSync('rangetime');
							const value5 = uni.getStorageSync('sex');
							const value6 = uni.getStorageSync('is_fans');
							const value7 = uni.getStorageSync('chat_type');
							const value8 = uni.getStorageSync('link_time');
							const value9 = uni.getStorageSync('from');
							const value10 = uni.getStorageSync('name');
							const value11 = uni.getStorageSync('hasTagsId');
							const value12 = uni.getStorageSync('hasTags');
							const value13 = uni.getStorageSync('tagIds');
							if (typeof value != null || typeof value3 != null || typeof value5 != null || typeof value6 != null || typeof value7 != null || typeof value8 != null || typeof value9 != null || typeof value10 != null || typeof value11 != null) {
								if (typeof value != null && value != '') {
									this.followId = value;
									this.followName = value2;
								}
								if (typeof value3 != null) {
									this.tabBtnType = value3;
									this.rangetime = value4;
								}
								if (typeof value5 != null && value5 != '') {
									this.sex = value5;
								}
								if (typeof value6 != null) {
									this.isFans = value6;
								}
								if (typeof value7 != null) {
									this.chat_type = value7;
								}
								if (typeof value8 != null) {
									this.linkTime = value8;
									this.toView = 'view' + value8
								}
								if (typeof value9 != null && value9 != '') {
									this.from = value9;
								}
								if (typeof value10 != null) {
									this.name = value10;
								}
								if (typeof value11 != null && value11 != '') {
									this.hasTagsId = value11;
									this.hasTags = value12;
									this.tagIds = value13;
								}
								this.customList = []
								this.lastId = ''
								this.lastUser = ''
								uni.pageScrollTo({
									scrollTop: 0,
									duration : 0
								});
								this.getData()
								try {
									uni.removeStorageSync('name');
									uni.removeStorageSync('follow_id');
									uni.removeStorageSync('follow_name');
									uni.removeStorageSync('tab_btn_type');
									uni.removeStorageSync('rangetime');
									uni.removeStorageSync('sex');
									uni.removeStorageSync('is_fans');
									uni.removeStorageSync('chat_type');
									uni.removeStorageSync('link_time');
									uni.removeStorageSync('from');
									uni.removeStorageSync('hasTagsId');
									uni.removeStorageSync('hasTags');
									uni.removeStorageSync('tagIds');
								} catch (e) {
									// error
								}
							} else {
								this.customList = []
								this.lastId = ''
								this.lastUser = ''
								uni.pageScrollTo({
									scrollTop: 0,
									duration : 0
								});
								this.getData()
							}
						} catch (e) {
							// error
						}
						// this.getData()
					} else if (this.tabType == 2) {
						try {
							const value = uni.getStorageSync('follow_id');
							const value2 = uni.getStorageSync('follow_name');
							const value3 = uni.getStorageSync('tab_btn_type');
							const value4 = uni.getStorageSync('rangetime');
							const value5 = uni.getStorageSync('sex');
							const value6 = uni.getStorageSync('is_fans');
							const value7 = uni.getStorageSync('chat_type');
							const value8 = uni.getStorageSync('link_time');
							const value9 = uni.getStorageSync('from');
							const value10 = uni.getStorageSync('name');
							const value11 = uni.getStorageSync('hasTagsId');
							const value12 = uni.getStorageSync('hasTags');
							const value13 = uni.getStorageSync('tagIds');
							if (typeof value != null || typeof value3 != null || typeof value5 != null || typeof value6 != null || typeof value7 != null || typeof value8 != null || typeof value9 != null || typeof value10 != null || typeof value11 != null) {
								if (typeof value != null && value != '') {
									this.followId = value;
									this.followName = value2;
								}
								if (typeof value3 != null) {
									this.tabBtnType = value3;
									this.rangetime = value4;
								}
								if (typeof value5 != null && value5 != '') {
									this.sex = value5;
								}
								if (typeof value6 != null) {
									this.isFans = value6;
								}
								if (typeof value7 != null) {
									this.chat_type = value7;
								}
								if (typeof value8 != null) {
									this.linkTime = value8;
									this.toView = 'view' + value8
								}
								if (typeof value9 != null && value9 != '') {
									this.from = value9;
								}
								if (typeof value10 != null) {
									this.name = value10;
								}
								if (typeof value11 != null) {
									this.hasTagsId = value11;
									this.hasTags = value12;
									this.tagIds = value13;
								}
								this.noCustomList = []
								this.lastId = ''
								this.lastUser = ''
								uni.pageScrollTo({
									scrollTop: 0,
									duration : 0
								});
								this.getNoCustomData()
								try {
									uni.removeStorageSync('name');
									uni.removeStorageSync('follow_id');
									uni.removeStorageSync('follow_name');
									uni.removeStorageSync('tab_btn_type');
									uni.removeStorageSync('rangetime');
									uni.removeStorageSync('sex');
									uni.removeStorageSync('is_fans');
									uni.removeStorageSync('chat_type');
									uni.removeStorageSync('link_time');
									uni.removeStorageSync('from');
									uni.removeStorageSync('hasTagsId');
									uni.removeStorageSync('hasTags');
									uni.removeStorageSync('tagIds');
								} catch (e) {
									// error
								}
							} else {
								this.noCustomList = []
								this.lastId = ''
								this.lastUser = ''
								uni.pageScrollTo({
									scrollTop: 0,
									duration : 0
								});
								this.getNoCustomData()
							}
						} catch (e) {
							// error
						}
					} else if (this.tabType == 3) {
						try {
							const value = uni.getStorageSync('name2');
							const value2 = uni.getStorageSync('groupStatus');
							const value3 = uni.getStorageSync('groupStatusName');
							const value4 = uni.getStorageSync('followId2');
							const value5 = uni.getStorageSync('followStatusName');
							const value6 = uni.getStorageSync('tabBtnType');
							const value7 = uni.getStorageSync('timeName');
							const value8 = uni.getStorageSync('rangetime2');
							if (typeof value != null || typeof value2 != null || typeof value4 != null || typeof value6 != null) {
								if (typeof value != null) {
									this.name2 = value;
								}
								if (typeof value2 != null && value2 != '') {
									this.groupStatus = value2;
									this.groupStatusName = value3;
								}
								if (typeof value4 != null && value4 != '') {
									this.followId2 = value4;
									this.followStatusName = value5;
								}
								if (typeof value6 != null) {
									this.isFans = value6;
								}
								if (typeof value6 != null && value6 != '') {
									this.tabBtnType = value6;
									this.timeName = value7;
									this.rangetime2 = value8;
								}
								this.getData2()
								try {
									uni.removeStorageSync('name2');
									uni.removeStorageSync('groupStatus');
									uni.removeStorageSync('groupStatusName');
									uni.removeStorageSync('followId2');
									uni.removeStorageSync('followStatusName');
									uni.removeStorageSync('tabBtnType');
									uni.removeStorageSync('timeName');
									uni.removeStorageSync('rangetime2');
								} catch (e) {
									// error
								}
							} else {
								this.getData2()
							}
						} catch (e) {
							// error
						}
					}
					try {
						uni.removeStorageSync('tab_type');
					} catch (e) {
						// error
					}
				} catch (e) {
					// error
				}
				this.getFollow()
				this.getNotFollowDay()
			},
			async getNotFollowDay () {
				const {data: res} = await this.axios.post("follow-statistic/days",
					{
						corp_id: localStorage.getItem('corpid'),
						uid    : localStorage.getItem('uid'),
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.notFollowDay = res.data
				}
			},
			//客户列表
			async getData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.loadingText = '加载中...'
				this.isLoading = false

				this.userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.userId.push(this.selectDepartment[i].id)
					}
				}

				const {data: res} = await this.axios.post("wap-user-desktop/custom-list", {
					corp_id   : localStorage.getItem('corpid'),
					uid       : localStorage.getItem('uid'),
					user_id   : localStorage.getItem('user_id'),
					tag_ids   : this.tagIds,
					user_ids  : this.userId,
					name      : this.name,
					follow_id : this.followId,
					sex       : this.sex,
					is_fans   : this.isFans,
					chat_type : this.chat_type,
					is_protect: this.is_protect,
					start_time: this.rangetime.length > 0 ? this.rangetime[0] : '',
					end_time  : this.rangetime.length > 0 ? this.rangetime[1] : '',
					from      : this.from,
					type      : this.tabBtnType,
					status_id : this.linkTime,
					page      : page,
					last_id   : this.lastId,
					last_user : this.lastUser
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
					that.isReady = true
					that.userCount = res.data.user_count
					that.page = page
					that.count = res.data.customCount
					that.customCount = res.data.customCount
					that.uniqueCount = res.data.uniqueCount
					that.show = res.data.show
					if (that.show != 0) {
						that.$nextTick(() => {
							let box1 = document.getElementsByClassName('choose-tags2')
							let box2 = document.getElementsByClassName('dropdown-item__selected')
							let box3 = document.getElementsByClassName('selected__name')
							box1[0].style.padding = '0 1.03rem  /* 27/18.75 */'
							box2[0].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box2[1].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box3[0].style.width = '2.933rem  /* 55/18.75 */'
						})
					} else {
						that.$nextTick(() => {
							let box1 = document.getElementsByClassName('choose-tags2')
							let box2 = document.getElementsByClassName('dropdown-item__selected')
							let box3 = document.getElementsByClassName('selected__name')
							box1[0].style.padding = '0 0 0 0.693rem /* 13/18.75; */'
							box2[0].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
							box2[1].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
							// box3[0].style.width = '2.933rem  /* 55/18.75 */'
						})
					}
					if (that.page == 1) {
						if (that.from == 1) {
							//按添加人排序
							if (res.data.info.length > 0) {
								if (that.customList.length == 0) {
									that.customList = res.data.info
								} else {
									let lastData = res.data.info[res.data.info.length - 1]
									if (lastData.info.length < lastData.ContactCount) {
										that.customList[that.customList.length - 1].info = that.customList[that.customList.length - 1].info.concat(res.data.info[0].info)
										for (let i = 1; i < res.data.info.length; i++) {
											that.customList.push(res.data.info[i])
										}
									} else {
										if (that.customList[that.customList.length - 1].user_id == res.data.info[0].user_id) {
											that.customList[that.customList.length - 1].info = that.customList[that.customList.length - 1].info.concat(res.data.info[0].info)
											for (let i = 1; i < res.data.info.length; i++) {
												that.customList.push(res.data.info[i])
											}
										} else {
											that.customList = that.customList.concat(res.data.info)
										}
									}
								}
							}
						} else if (that.from == 2) {
							//按添加时间排序
							that.customList = res.data.info
						}
					} else {
						if (that.from == 1) {
							//按添加人排序
							if (this.lastId == '') {
								that.customList = that.customList.concat(res.data.info)
							} else {
								let lastData = res.data.info[res.data.info.length - 1]
								if (lastData.info.length < lastData.ContactCount) {
									that.customList[that.customList.length - 1].info = that.customList[that.customList.length - 1].info.concat(res.data.info[0].info)
									for (let i = 1; i < res.data.info.length; i++) {
										that.customList.push(res.data.info[i])
									}
								} else {
									if (that.customList[that.customList.length - 1].user_id == res.data.info[0].user_id) {
										that.customList[that.customList.length - 1].info = that.customList[that.customList.length - 1].info.concat(res.data.info[0].info)
										for (let i = 1; i < res.data.info.length; i++) {
											that.customList.push(res.data.info[i])
										}
									} else {
										that.customList = that.customList.concat(res.data.info)
									}
								}
							}
						} else if (that.from == 2) {
							//按添加时间排序
							if (res.data.info[0].name == that.customList[that.customList.length - 1].name) {
								that.customList[that.customList.length - 1].info = that.customList[that.customList.length - 1].info.concat(res.data.info[0].info)
								res.data.info.splice(0, 1)
							}
							that.customList = that.customList.concat(res.data.info)
						}
					}

					let num = 0
					if (that.customList.length > 0) {
						that.customList.map(x => {
							num = num + x.info.length
						})
					}
					if (num < 15) {
						that.loadingText = '已加载全部'
					}

					uni.hideLoading();
					this.isLoading = true
					this.is_show_copyright2 = true
				}
			},
			//非客户列表
			async getNoCustomData (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.loadingText = '加载中...'
				this.isLoading = false

				this.userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.userId.push(this.selectDepartment[i].id)
					}
				}

				const {data: res} = await this.axios.post("wap-public-sea/custom-list", {
					uid       : localStorage.getItem('uid'),
					corp_id   : localStorage.getItem('corpid'),
					user_id   : localStorage.getItem('user_id'),
					user_ids  : this.userId,
					name      : this.name,
					sex       : this.sex,
					is_protect: this.is_protect,
					follow_id : this.followId,
					tag_ids   : this.tagIds,
					from      : this.from,
					start_time: this.rangetime.length > 0 ? this.rangetime[0] : '',
					end_time  : this.rangetime.length > 0 ? this.rangetime[1] : '',
					type      : this.tabBtnType,
					status_id : this.linkTime,
					page      : page
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
					that.isReady = true
					that.userCount = res.data.user_count
					that.noCustomPage = page
					that.noCustomCount = res.data.count
					that.show = res.data.show
					that.recordStatusList = res.data.optionList
					that.recordStatus = Number(that.recordStatusList[0].id)
					if (that.show != 0) {
						that.$nextTick(() => {
							let box1 = document.getElementsByClassName('choose-tags2')
							let box2 = document.getElementsByClassName('dropdown-item__selected')
							let box3 = document.getElementsByClassName('selected__name')
							box1[0].style.padding = '0 1.03rem  /* 27/18.75 */'
							box2[0].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box2[1].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box3[0].style.width = '2.933rem  /* 55/18.75 */'
						})
					} else {
						that.$nextTick(() => {
							let box1 = document.getElementsByClassName('choose-tags2')
							let box2 = document.getElementsByClassName('dropdown-item__selected')
							let box3 = document.getElementsByClassName('selected__name')
							box1[0].style.padding = '0 0 0 0.693rem /* 13/18.75; */'
							box2[0].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
							box2[1].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
							// box3[0].style.width = '2.933rem  /* 55/18.75 */'
						})
					}

					if (that.noCustomPage == 1) {
						that.noCustomList = res.data.info
					} else {
						if (that.from == 1) {
							//按添加人排序
							if (res.data.info[0].id == that.noCustomList[that.noCustomList.length - 1].id) {
								that.noCustomList[that.noCustomList.length - 1].info = that.noCustomList[that.noCustomList.length - 1].info.concat(res.data.info[0].info)
								res.data.info.splice(0, 1)
							}
							that.noCustomList = that.noCustomList.concat(res.data.info)
						} else if (that.from == 2) {
							//按添加时间排序
							if (res.data.info[0].name == that.noCustomList[that.noCustomList.length - 1].name) {
								that.noCustomList[that.noCustomList.length - 1].info = that.noCustomList[that.noCustomList.length - 1].info.concat(res.data.info[0].info)
								res.data.info.splice(0, 1)
							}
							that.noCustomList = that.noCustomList.concat(res.data.info)
						}
					}

					let num = 0
					if (that.noCustomList.length > 0) {
						that.noCustomList.map(x => {
							num = num + x.info.length
						})
					}
					if (num < 15) {
						that.loadingText = '已加载全部'
					}

					uni.hideLoading();
					this.isLoading = true
					this.is_show_copyright2 = true
				}
			},
			//切换tab
			changeTab (type) {
				this.isLoading = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.tabType = type
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.loadingText = '加载中...'
				this.tabBtnType = 0
				this.selectDepartment = []
				this.is_show_copyright2 = false
				if (this.tabType == 1) {
					this.name = ''
					this.followId = -1
					this.followName = '跟进状态'
					this.sex = -1
					this.isFans = 0
					this.chat_type = 0
					this.linkTime = 0
					this.toView = 'view0'
					this.groupList = []
					this.userId = []
					this.userCount = 0
					this.tagIds = []
					this.from = 2
					this.hasTagsId = []
					this.hasTags = []
					this.is_protect = -1
					this.value = ''
					this.rangetime = []
					this.customList = []
					this.lastId = ''
					this.lastUser = ''
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					this.getData()
				} else if (this.tabType == 2) {
					this.name = ''
					this.followId = -1
					this.followName = '跟进状态'
					this.sex = -1
					this.isFans = 0
					this.linkTime = 0
					this.toView = 'view0'
					this.groupList = []
					this.userId = []
					this.userCount = 0
					this.tagIds = []
					this.from = 2
					this.hasTagsId = []
					this.hasTags = []
					this.is_protect = -1
					this.value = ''
					this.rangetime = []
					this.noCustomList = []
					this.lastId = ''
					this.lastUser = ''
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					this.getNoCustomData()
				} else if (this.tabType == 3) {
					this.name2 = ''
					this.groupStatus = -1
					this.followId2 = -1
					this.customList = []
					this.userId = []
					this.userCount = 0
					this.tagIds = []
					this.groupStatusName = '群状态'
					this.followStatusName = '跟进状态'
					this.timeName = '创建时间'
					this.value = ''
					this.rangetime2 = []
					this.getData2()
				}
			},
			//搜索确认
			search () {
				clearTimeout(this.searchTimeout)

				this.searchTimeout = setTimeout(() => {
					this.lastId = ''
					this.lastUser = ''
					this.is_show_copyright2 = false
					uni.pageScrollTo({
						scrollTop: 0,
						duration : 0
					});
					if (this.tabType == 1) {
						this.customList = []
						this.getData()
					} else if (this.tabType == 2) {
						this.noCustomList = []
						this.getNoCustomData()
					}
				}, 300)
			},
			//切换按钮tab
			changeTabBtn (type) {
				this.tabBtnType = type
				if (type == 4) {
					if (this.tabType == 1) {
						this.onShowDatePicker('rangetime')
					} else if (this.tabType == 3) {
						this.onShowDatePicker('rangetime2')
					}
				}
			},
			//流失客户
			lossCustomer () {
				this.hasTagsId = []
				this.hasTags = []
				this.selectDepartment = []
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/lossCustomer?agent_id=' + agent_id
				});
			},
			//修改沟通时间
			changeLinkTime (type) {
				// uni.pageScrollTo({
				// 	duration : 0,//过渡时间必须为0，uniapp bug，否则运行到手机会报错
				// 	scrollTop: 300,//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
				// })

				this.linkTime = type
				this.toView = 'view' + type
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				if (this.tabType == 1) {
					this.customList = []
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.getNoCustomData()
				}
			},
			//选择标签
			chooseTags () {
				if (this.$refs.dropdownItem) {
					this.$refs.dropdownItem.closePopup()
				}
				if (this.$refs.dropdownItem2) {
					this.$refs.dropdownItem2.closePopup()
				}
				this.tagTitle = '标签筛选'
				this.showChooseTags = true
			},
			chooseTags1 () {
				if (this.$refs.dropdownItem) {
					this.$refs.dropdownItem.closePopup()
				}
				if (this.$refs.dropdownItem2) {
					this.$refs.dropdownItem2.closePopup()
				}
				this.tagTitle = '选择标签'
				this.showChooseTags = true
			},
			replyMsg (tags, arr) {
				this.hasTagsId = tags
				this.hasTags = arr
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				if (this.tabType == 1) {
					this.tagIds = tags
					this.customList = []
					this.getData()
					uni.showTabBar()
					this.showChooseTags = false
				} else if (this.tabType == 2) {
					if (!this.$refs.addCustomVisible.showPopup) {
						this.tagIds = tags
						this.noCustomList = []
						this.getNoCustomData()
						uni.showTabBar()
						this.showChooseTags = false
					} else {
						//录入客户的选择标签
						this.recordTags = tags
						uni.showTabBar()
						this.showChooseTags = false
						this.$nextTick(() => {
							var ele = document.getElementsByClassName('scroll-Y')[0]
							ele.scrollTop = ele.scrollHeight;
						})
					}
				}
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
			//选择成员
			chooseStaff () {
				if (this.tabType == 1) {
					this.$refs.dropdownItem.closePopup()
					this.$refs.dropdownItem2.closePopup()
				} else if (this.tabType == 3) {
					this.$refs.groupDropdown.closePopup()
					this.$refs.followDropdown.closePopup()
					this.$refs.timeDropdown.closePopup()
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.lastId = ''
				this.lastUser = ''
				uni.hideTabBar()
				this.showChooseDepartment = true
			},
			replyDepartment (arr) {
				this.showChooseDepartment = false
				this.is_show_copyright2 = false
				uni.showTabBar()
				if (typeof arr == 'object') {
					this.selectDepartment = arr
					if (this.tabType == 1) {
						this.customList = []
						this.getData()
					} else if (this.tabType == 2) {
						this.getNoCustomData()
					} else if (this.tabType == 3) {
						this.getData2()
					}
				}
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.navigateTo({
					url: '/pages/scrm/chooseDepartment?agent_id=' + agent_id
				});
			},
			//获取跟进状态
			async getFollow () {
				const {data: res} = await this.axios.post("custom-field/follow", {
					uid: localStorage.getItem('uid')
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg + '22',
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.followList = res.data.follow
					this.followList.map(x => {
						if (x.status == 0) {
							x.title = x.title + '（已删除）'
						}
					})
				}
			},
			//选择跟进状态
			changeFollowId (id, name) {
				this.followId = id
				this.followName = name
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.$refs.dropdownItem.closePopup()
				if (this.tabType == 1) {
					this.customList = []
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.getNoCustomData()
				}
			},
			onShowDatePicker (type) {//显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected (e) {//选择
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
				}
			},
			//选择性别
			changeSex (type) {
				this.sex = type
			},
			//是否粉丝
			changeIsFans (type) {
				this.isFans = type
			},
			//客户持群数
			changeChatType (type) {
				this.chat_type = type
			},
			//客户保护
			changeIsProtect (type) {
				this.is_protect = type
			},
			//确定
			sure () {
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.$refs.dropdownItem2.closePopup()
				if (this.tabType == 1) {
					this.customList = []
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.getNoCustomData()
				}
			},
			//重置
			clear () {
				this.sex = -1
				this.isFans = 0
				this.chat_type = 0
				this.tabBtnType = 0
				this.rangetime = []
				this.is_protect = -1
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.$refs.dropdownItem2.closePopup()
				if (this.tabType == 1) {
					this.customList = []
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.getNoCustomData()
				}
			},
			//排序
			showSortPicker () {
				this.$refs.dropdownItem.closePopup()
				this.$refs.dropdownItem2.closePopup()
				this.wosScroll = 'wos-scroll-no'

				this.$refs['sortPop'].open()
			},
			closeSortPop () {
				this.wosScroll = 'wos-scroll-yes'

				this.$refs['sortPop'].close()
			},
			changeFrom (type) {
				this.from = type
				this.lastId = ''
				this.lastUser = ''
				this.wosScroll = 'wos-scroll-yes'
				this.is_show_copyright2 = false

				this.$refs['sortPop'].close()
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				if (this.tabType == 1) {
					this.customList = []
					this.page = 1
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.noCustomPage = 1
					this.getNoCustomData()
				}
			},
			reSetting () {
				this.name = ''
				this.followId = -1
				this.followName = '跟进状态'
				this.rangetime = []
				this.sex = -1
				this.isFans = 0
				this.chat_type = 0
				this.linkTime = 0
				this.toView = 'view0'
				this.groupList = []
				this.userId = []
				this.userCount = 0
				this.tagIds = []
				this.hasTagsId = []
				this.hasTags = []
				this.from = 2
				this.is_protect = -1
				this.selectDepartment = []
				this.tabBtnType = 0
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				if (this.tabType == 1) {
					this.customList = []
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.getNoCustomData()
				}
			},
			reSetting2 () {
				this.name2 = ''
				this.groupStatus = -1
				this.groupStatusName = '群状态'
				this.followId2 = -1
				this.followStatusName = '跟进状态'
				this.timeName = '创建时间'
				this.rangetime2 = []
				this.groupList = []
				this.userId = []
				this.userCount = 0
				this.hasTagsId = []
				this.hasTags = []
				this.is_protect = -1
				this.selectDepartment = []
				this.tabBtnType = 0
				this.is_show_copyright2 = false
				this.getData2()
			},
			//客户群列表
			async getData2 (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.loadingText = '加载中...'
				this.isLoading = false

				this.userId = []
				if (this.selectDepartment.length > 0) {
					for (let i = 0; i < this.selectDepartment.length; i++) {
						this.userId.push(this.selectDepartment[i].id)
					}
				}

				const {data: res} = await this.axios.post("wap-user-desktop/work-user-chat-list", {
					corp_id  : localStorage.getItem('corpid'),
					user_id  : localStorage.getItem('user_id'),
					name     : this.name2,
					user_ids : this.userId,
					status   : this.groupStatus,
					follow_id: this.followId2,
					stime    : this.rangetime2.length > 0 ? this.rangetime2[0] : '',
					etime    : this.rangetime2.length > 0 ? this.rangetime2[1] : '',
					time_type: this.tabBtnType,
					page     : page
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
					this.page2 = page
					this.isReady = true
					this.count2 = res.data.count
					this.show2 = res.data.show
					this.userCount = res.data.user_count
					if (this.page2 == 1) {
						this.groupList = res.data.list
					} else {
						this.groupList = this.groupList.concat(res.data.list)
					}
					if (this.groupList.length < 15) {
						this.loadingText = '已加载全部'
					}
					if (this.show2 != 0) {
						this.$nextTick(() => {
							let box2 = document.getElementsByClassName('dropdown-item__selected')
							let box3 = document.getElementsByClassName('selected__name')
							box2[0].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box2[1].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box2[2].style.padding = '0.8rem  /* 15/18.75 */ 1.03rem  /* 27/18.75 */'
							box3[0].style.width = '2.933rem  /* 55/18.75 */'
							box3[1].style.width = '2.933rem  /* 55/18.75 */'
							box3[2].style.width = '2.933rem  /* 55/18.75 */'
						})
					} else {
						this.$nextTick(() => {
							let box2 = document.getElementsByClassName('dropdown-item__selected')
							box2[0].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
							box2[1].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
							box2[2].style.padding = '0.8rem /* 15/18.75 */ 0.48rem  /* 9/18.75 */'
						})
					}

					uni.hideLoading();
					this.isLoading = true
					this.is_show_copyright2 = true
				}
			},
			//搜索确认
			search2 () {
				clearTimeout(this.searchTimeout)

				this.searchTimeout = setTimeout(() => {
					this.is_show_copyright2 = false
					this.getData2()
				}, 300)
			},
			//选择群状态
			changeGroupStatus (type, name) {
				this.groupStatusName = name
				this.groupStatus = type
				this.is_show_copyright2 = false
				this.$refs.groupDropdown.closePopup()
				this.getData2()
			},
			//选择群跟进状态
			changeFollowId2 (id, name) {
				this.followStatusName = name
				this.followId2 = id
				this.is_show_copyright2 = false
				this.$refs.followDropdown.closePopup()
				this.getData2()
			},
			//确定
			sure2 () {
				this.is_show_copyright2 = false
				if (this.tabBtnType == 0) {
					this.timeName = '创建时间'
				} else if (this.tabBtnType == 1) {
					this.timeName = '今日新增'
				} else if (this.tabBtnType == 2) {
					this.timeName = '本周新增'
				} else if (this.tabBtnType == 3) {
					this.timeName = '本月新增'
				} else if (this.tabBtnType == 4) {
					if (this.rangetime2.length > 0) {
						this.timeName = this.rangetime2[0] + '-' + this.rangetime2[1]
					}
				}
				this.$refs.timeDropdown.closePopup()
				this.getData2()
			},
			//重置
			clear2 () {
				this.rangetime2 = []
				this.tabBtnType = 0
				this.timeName = '创建时间'
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				this.$refs.timeDropdown.closePopup()
				this.getData2()
			},
			//跳转客户详情
			toCustomDetail (user_id, externalId) {
				try {
					uni.setStorageSync('name', this.name);
					uni.setStorageSync('follow_id', this.followId);
					uni.setStorageSync('follow_name', this.followName);
					uni.setStorageSync('tab_btn_type', this.tabBtnType);
					uni.setStorageSync('rangetime', this.rangetime);
					uni.setStorageSync('sex', this.sex);
					uni.setStorageSync('is_fans', this.isFans);
					uni.setStorageSync('chat_type', this.chat_type);
					uni.setStorageSync('link_time', this.linkTime);
					uni.setStorageSync('from', this.from);
					uni.setStorageSync('hasTagsId', this.hasTagsId);
					uni.setStorageSync('hasTags', this.hasTags);
					uni.setStorageSync('tagIds', this.tagIds);
				} catch (e) {
					// error
				}
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				if (agent_id == '') {
					agent_id = localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id')
				}
				uni.reLaunch({
					url: '/pages/customDetail/index?user_id=' + user_id + "&external_userid=" + externalId + "&agentId=" + agent_id + "&page=1"
				});
			},
			//跳转非企微客户详情
			toNoCustomDetail (cid) {
				try {
					uni.setStorageSync('name', this.name);
					uni.setStorageSync('follow_id', this.followId);
					uni.setStorageSync('follow_name', this.followName);
					uni.setStorageSync('tab_btn_type', this.tabBtnType);
					uni.setStorageSync('rangetime', this.rangetime);
					uni.setStorageSync('sex', this.sex);
					uni.setStorageSync('is_fans', this.isFans);
					uni.setStorageSync('chat_type', this.chat_type);
					uni.setStorageSync('link_time', this.linkTime);
					uni.setStorageSync('from', this.from);
					uni.setStorageSync('tab_type', this.tabType);
					uni.setStorageSync('hasTagsId', this.hasTagsId);
					uni.setStorageSync('hasTags', this.hasTags);
					uni.setStorageSync('tagIds', this.tagIds);
				} catch (e) {
					// error
				}
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				if (agent_id == '') {
					agent_id = localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id')
				}
				uni.reLaunch({
					url: '/pages/customDetail/noCustom?agentId=' + agent_id + '&cid=' + cid
				});
			},
			//跳转客户群
			toGroupDetail (user_id, chat_id) {
				try {
					uni.setStorageSync('name2', this.name2);
					uni.setStorageSync('groupStatus', this.groupStatus);
					uni.setStorageSync('groupStatusName', this.groupStatusName);
					uni.setStorageSync('followId2', this.followId2);
					uni.setStorageSync('followStatusName', this.followStatusName);
					uni.setStorageSync('tabBtnType', this.tabBtnType);
					uni.setStorageSync('timeName', this.timeName);
					uni.setStorageSync('rangetime2', this.rangetime2);
					uni.setStorageSync('tab_type', this.tabType);
				} catch (e) {
					// error
				}
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				uni.reLaunch({
					url: '/pages/group/index?user_id=' + user_id + "&chat_id=" + chat_id + "&agentId=" + agent_id
				});
			},
			//清除输入框
			clearInput () {
				this.name = ''
				this.lastId = ''
				this.lastUser = ''
				this.is_show_copyright2 = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration : 0
				});
				if (this.tabType == 1) {
					this.customList = []
					this.getData()
				} else if (this.tabType == 2) {
					this.noCustomList = []
					this.getNoCustomData()
				}
			},
			clearInput2 () {
				this.name2 = ''
				this.is_show_copyright2 = false
				this.getData2()
			},
			//添加客戶
			toAddCustom () {
				this.$store.state.wx.invoke('navigateToAddCustomer',
					{},
					function (res) {
						if (res.err_code != 0) {
							uni.showToast({
								title   : '请检查应用权限与客户功能权限',
								image   : '/static/fail.png',
								duration: 2000
							});
						}
					}
				);
			},
			//录入客户
			openAddCustom () {
				this.hasTagsId2 = JSON.parse(JSON.stringify(this.hasTagsId))
				this.hasTagsId = []
				this.hasTags2 = JSON.parse(JSON.stringify(this.hasTags))
				this.hasTags = []
				this.wosScroll = 'wos-scroll-no'
				this.$refs['addCustomVisible'].open()
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
				this.hasTagsId = this.hasTagsId2
				this.hasTags = this.hasTags2
				this.wosScroll = 'wos-scroll-yes'
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
				const {data: res} = await this.axios.post("wap-public-sea/set-follow-user", {
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
		}
		,
	}
</script>

<style scoped lang="less">
	.content_head {
		background: #FFF;
		z-index: 99;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		box-shadow: 0 0.053rem /* 1/18.75 */ 0.213rem /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);
	}

	.box {
		background: #F2F3F5;
		text-align: left;
		font-size: 0.8rem /* 15/18.75 */;
		height: calc(100% - 50px);
		overflow: hidden;
	}

	.tabs {
		border: 0.053rem /* 1/18.75 */ solid #FFF;
		line-height: 1.387rem /* 26/18.75 */;
		display: inline-block;
		font-size: 0.8rem /* 15/18.75 */;
		padding: 0 0.427rem /* 8/18.75 */;
		margin: 0.8rem /* 15/18.75 */ 0 0.533rem /* 10/18.75 */;
		background: rgba(82, 132, 236, 1);
		color: #FFF;
		width: 4.267rem /* 80/18.75 */;
	}

	.tabs:nth-child(1) {
		border-radius: 2px 0px 0px 2px;
	}

	.tabs:nth-child(2) {
		border-left: 0;
		border-right: 0;
	}

	.tabs:nth-child(3) {
		border-radius: 0px 2px 2px 0px;
	}

	.chooseTab {
		background: #FFF;
		color: rgba(82, 132, 236, 1);
	}

	.tab_picker {
		border-bottom: 0.053rem /* 1/18.75 */ solid #F7F7F7;
		overflow-x: auto;
	}

	.dropdownItem2 /deep/ .selected__name {
		width: 1.867rem /* 35/18.75 */ !important;
	}

	/deep/ .dropdown-item__selected .selected__name {
		font-size: 0.693rem /* 13/18.75 */;
		font-weight: 500;
		color: #999;
		width: 2.933rem /* 55/18.75 */;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	/deep/ .dropdown-item__selected {
		padding: 0.8rem /* 15/18.75 */ 0.693rem /* 13/18.75 */;
	}

	/deep/ .dropdown-item__selected .selected__icon {
		margin-left: 0.267rem /* 5/18.75 */;
	}

	.tab-btn {
		height: 1.227rem /* 23/18.75 */;
		background: #EDEDED;
		border-radius: 0.587rem /* 11/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
		color: #666;
		line-height: 1.227rem /* 23/18.75 */;
		padding: 0 0.96rem /* 18/18.75 */;
	}

	.active-tab-btn {
		background: #5283EC;
		color: #FFF !important;
	}

	.choose-tags {
		float: left;
		line-height: 2.453rem /* 46/18.75 */;
		text-align: center;
		padding: 0 0 0 0.693rem /* 13/18.75 */;
		font-size: 0.693rem /* 13/18.75 */;
		color: #999;
		position: relative;
		font-weight: 500;
	}

	.choose-tags:after {
		content: ' ';
		position: absolute;
		width: 1px;
		top: 0.96rem /* 18/18.75 */;
		bottom: 0.96rem /* 18/18.75 */;
		right: 0;
		background: #C8C7CC;
	}

	.dropdown-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		border-top: 1px solid #F7F7F7;
		background: #FFF;
	}

	.dropdown-btn {
		width: 5.333rem /* 100/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		height: 1.6rem /* 30/18.75 */;
		line-height: 1.6rem /* 30/18.75 */;
		margin: 0.267rem /* 5/18.75 */ 0;
		color: #2A3349;
		border-radius: 0.96rem /* 18/18.75 */;
		text-align: center;
		border: 1px solid #F2F2F2;
		background: #F2F2F2;
	}

	/deep/ .dropdown-item__content .list {
		height: 100%;
		max-height: 258px;
	}

	.dropdown-item-content2 {
		max-height: 258px;
		overflow-y: auto;
		position: absolute;
		left: 0;
		right: 0;
		padding: 0 10px;
	}

	.more-title {
		color: #2A3349;
	}

	.more-choose {
		height: 1.76rem /* 33/18.75 */;
		line-height: 1.92rem /* 36/18.75 */;
		box-sizing: border-box;
		margin: 0 0.533rem /* 10/18.75 */ 0.533rem 0;
		border-radius: 0.853rem /* 16/18.75 */;
		float: left;
		padding: 0 0.8rem /* 15/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		background: #F4F4F4;
		color: #666;
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
		margin-top: 9.653rem /* 181/18.75 */;
		z-index: -1;
		background: #FFF;
	}

	.content-list-item {
		margin: 0 0 0.533rem /* 10/18.75 */;
	}

	.content-list-item-title {
		background: #F2F3F5;
		padding: 0 0.533rem /* 10/18.75 */;
		color: #999;
		font-size: 0.747rem /* 14/18.75 */;
		line-height: 1.6rem /* 30/18.75 */;
	}

	.content-list-item-text {
		overflow: hidden;
		padding: 0.427rem /* 8/18.75 */ 0.533rem /* 10/18.75 */;
		border-bottom: 1px solid #F7F7F7;
	}

	.content-list-item .content-list-item-text:last-child {
		border-bottom: 0;
	}

	.list-hd-content {
		padding: 0 0.533rem /* 10/18.75 */;
		width: calc(100% - 3.253rem /* 61/18.75 */);
		float: left;
		box-sizing: border-box;
	}

	.list-hd-content-name {
		color: #333;
		font-weight: 700;
		font-size: 0.8rem /* 15/18.75 */;
		/*white-space: nowrap;*/
		/*text-overflow: ellipsis;*/
		overflow: hidden;
		/*word-break: break-all;*/
	}

	.list-hd-content-tag {
		background: #E7EFFC;
		color: #5283EC;
		border-radius: 0.267rem /* 5/18.75 */;
		height: 0.853rem /* 16/18.75 */;
		margin-right: 0.267rem /* 5/18.75 */;
		padding: 0.16rem /* 3/18.75 */ 0.427rem /* 8/18.75 */;
		font-size: 0.587rem /* 11/18.75 */;
	}

	.more-choose-blue {
		background: #E7EFFC;
		color: #5283EC;
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
		width: 81%;
		height: 1.6rem /* 30/18.75 */;
		float: left;
		box-sizing: border-box;
		border: 0.053rem /* 1/18.75 */ solid #FFF;
		margin: 0 2% 0.8rem /* 15/18.75 */;
		background: #FFF;
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
		background: #5283EC;
		font-size: 0.8rem /* 15/18.75 */;
		color: #FFF;
	}

	.add-input {
		height: 1.493rem /* 28/18.75 */;
		line-height: 1.493rem /* 28/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		text-align: left;
		border: 0.053rem /* 1/18.75 */ solid #CCC;
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
		color: #5283EC;
	}

	.add-input /deep/ .uni-input-wrapper {
		margin-top: 0.053rem /* 1/18.75 */;
	}

</style>
