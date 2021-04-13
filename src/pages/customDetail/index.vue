<template>
	<view class="box" :class="wosScroll">
		<view v-if="!showChooseStaff">
			<view v-show="!isReady">
				<view class="custom-info">
					<skeleton title avatar="left" :row="3" animate :loading="!isReady"></skeleton>
				</view>

				<view class="chat-name" style="padding: 0">
					<skeleton banner :row="0" animate :loading="!isReady"></skeleton>
				</view>
				<view class="custom-list">
					<skeleton banner :row="0" animate :loading="!isReady"></skeleton>
				</view>
				<view class="custom-tabs">
					<skeleton :row="2" animate :loading="!isReady"></skeleton>
				</view>
				<view class="custom-tabs-content">
					<skeleton title :row="2" animate :loading="!isReady"></skeleton>
					<skeleton title :row="2" animate :loading="!isReady"></skeleton>
					<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				</view>
			</view>

			<view v-if="isReady">
				<uni-nav-bar left-icon="back" title="客户详情" @clickLeft="back" background-color="#5284ec" color="#fff"
				             v-if="this.getParameter('external_userid') != null" :fixed="true"></uni-nav-bar>
				<view class="custom-info">
					<view style="overflow: hidden;">
						<image v-if="list.avatar" class="custom-info-avater" mode="aspectFill"
						       :src="list.avatar"></image>
						<image v-else class="custom-info-avater" mode="aspectFill"
						       src="../../static/useradvart.png"></image>
						<view class="custom-info-content">
							<view class="custom-info-content-title1">{{list.name}}
								<image style="vertical-align: top; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
								       src="../../static/scrm/man.png"
								       v-if="list.gender == '男性'"></image>
								<image style="vertical-align: top;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
								       src="../../static/scrm/woman.png"
								       v-if="list.gender == '女性'"></image>
							</view>
							<view class="custom-info-content-line" v-if="list.is_hide_phone != 1">
								手机：
								<template v-if="list.phone && list.phone != ''">{{list.phone}}</template>
								<template v-else>暂无</template>
							</view>
							<view class="custom-info-content-line">
								地区：
								<template v-if="list.area && list.area != ''">{{list.area}}</template>
								<template v-else>暂无</template>
							</view>
							<view class="custom-info-content-line">
								<view style="display: inline-block;vertical-align: top;">备注名：</view>
								<view style="display: inline-block;width: calc(100% - 48px);"
								      v-if="list.nickname && list.nickname != ''">{{list.nickname}}
									<image v-if="list.del_type != 2" class="custom-info-edit-icon"
									       src="../../static/customDetail/edit-icon2.png"
									       @click="open('remarkVisible')"></image>
								</view>
								<view style="display: inline-block;" v-else>暂无
									<image v-if="list.del_type != 2" class="custom-info-edit-icon"
									       src="../../static/customDetail/edit-icon2.png"
									       @click="open('remarkVisible')"></image>
								</view>
							</view>
						</view>
						<view style="float: left;overflow: hidden;width: calc(100% - 12rem  /* 225/18.75 */);">
							<view style="float: right;">
								<view @click="permissionButton.indexOf('client-addFollow') > -1 ? open('addVisible') : ''"
								      class="custom-info-status tag-blue">
									<view>{{list.follow_title}}
										<image
												style="width: 0.587rem;height: 0.5rem;margin-top: 0.25rem;margin-left: 0.25rem;"
												v-if="list.is_follow_del != 1"
												src="../../static/customDetail/next.png" v-has="'client-addFollow'">
										</image>
									</view>
									<view v-if="list.is_follow_del == 1">（已删除）
										<image style="width: 0.587rem;height: 0.5rem;margin-top: 0.25rem;margin-left: 0.25rem;"
										       src="../../static/customDetail/next.png" v-has="'client-addFollow'">
										</image>
									</view>
								</view>
								<view style="background-color: #58E182;margin: 5px auto;border-radius: 15px;height: 20px;line-height:20px;text-align: center"
								      class="custom-info-status"
								      v-if="list.dialout_phone&&list.dialout_exten"
								      @click.stop="contact">
									<span style="font-size: 14px;color:#FFF">联系TA</span>
								</view>
							</view>
						</view>
					</view>
					<view style="text-align: left;font-size: 0.8rem  /* 15/18.75 */;color: red;margin-top: 0.267rem  /* 5/18.75 */;"
					      v-if="list.is_protect == 1 && list.is_reclaim == 1">该客户已设为保护对象，无法自动退回到公海池
					</view>
					<view style="text-align: left;font-size: 0.8rem  /* 15/18.75 */;color: red;margin-top: 0.267rem  /* 5/18.75 */;"
					      v-if="list.is_protect == 0 && list.is_reclaim == 0">该客户已进入公海池
					</view>
				</view>
				<view class="chat-name">
					<view class="chat-name-title" style="text-align: left;" @click="lookChats(list.chat_name)">
						<span style="float: left;margin-right: 0.533rem  /* 10/18.75 */;">所在群</span>
						<text v-if="typeof list.chat_name == 'undefined' || list.chat_name.length == 0"
						      style="color: #999999;font-size: 0.693rem;margin-left: 1rem; margin-bottom: 0.8rem;display: inline-block;">
							暂无
						</text>
						<view class="chat-name-list"
						      :style="chatMore? {display: 'inline-block', width: 'calc(100% - 4rem)'} : {}">
							<uni-tag :text="item.name" type="primary" :circle="true" class="chat-name-list-tag"
							         v-for="item in list.chat_name"></uni-tag>
						</view>
						<view v-if="chatMore"
						      style="height: 3.65rem; line-height: 3.65rem; margin-left: 0.267rem;width: 0.64rem; display: inline-block; vertical-align: top;color: #D5D5D5;    margin-top: -0.307rem;cursor: pointer;">
							>
						</view>
					</view>
				</view>
				<view style="background-color: #FFF;"
				      v-if="typeof list.memberInfo == 'object' && list.memberInfo.length != 0">
					<view class="uni-padding-wrap">
						<view class="page-section swiper">
							<view class="page-section-spacing">
								<swiper class="swiper" style="height: 6.933rem;" :key="swiperKey"
								        :indicator-dots="list.memberInfo.length == 1 ? false : indicatorDots"
								        indicator-active-color="#007AFF" :autoplay="autoplay">
									<swiper-item v-for="item in list.memberInfo">
										<view class="card-no">
											卡号NO.{{item.cardNo}}
										</view>
										<view style="margin-top: 1.067rem;">
											<view class="userinfo">
												<view class="info-title">{{item.gradeName}}</view>
												<view class="info-name">会员等级</view>
											</view>
											<view style="margin-top: 1.067rem;">
												<view class="userinfo">
													<view class="info-title">{{item.gradeName}}</view>
													<view class="info-name">会员等级</view>
												</view>
												<view class="userinfo">
													<view class="info-title">{{item.points}}</view>
													<view class="info-name">积分</view>
												</view>
												<view class="userinfo">
													<view class="info-title">￥{{item.money}}</view>
													<view class="info-name">余额</view>
												</view>
											</view>
										</view>
									</swiper-item>
								</swiper>
							</view>
						</view>
					</view>
				</view>
				<view class="custom-list">
					<view :class="list.merchantsCount > 0 && permissionButton.indexOf('other-store') > -1 ? 'custom-list-li' : 'custom-list-li2'">
						<view class="custom-list-li-title" v-if="list.close_rate != null">
							{{list.close_rate}}%
						</view>
						<view class="custom-list-li-title" v-else>暂无</view>
						<view class="custom-list-li-des">预计成交率
							<image v-if="list.del_type != 2" class="custom-info-edit-icon"
							       src="../../static/customDetail/edit-icon2.png"
							       @click="open('closeRateVisible')"></image>
						</view>
					</view>
					<view class="custom-list-li" v-if="list.merchantsCount > 0" v-has="'other-store'">
						<view class="custom-list-li-title">
							{{list.bindCount}}条
						</view>
						<view class="custom-list-li-des" @click="goThirdStore" style="cursor: pointer">
							第三方店铺 >
						</view>
					</view>
					<view :class="list.merchantsCount > 0 && permissionButton.indexOf('other-store') > -1 ? 'custom-list-li' : 'custom-list-li2'">
						<view class="custom-list-li-title">{{list.follow_num}}条</view>
						<view class="custom-list-li-des">跟进记录</view>
					</view>
				</view>
				<!-- 顾客数据 -->
				<view class="custom-data" v-if="is_hide==0">
					<navigator url="/pages/customDetail/detailList" class="custom-data-title">
						<text>顾客数据</text>
						<uni-icons type="arrowright" size="16" color="#cccccc"></uni-icons>
					</navigator>
					<view class="custom-data-item">
						<view class="custom-item">
							<view>等级</view>
							<view class="custom-item-garde" :style="{'color':customData.level_color}">
								<picker @change="gardePickerChange" :value="gardeIdx" :range="gardeArr" range-key="title" v-if="gardeArr.length>0">
									<view class="custom-garde">{{gardeIdx<0 ? '暂无':gardeArr[gardeIdx].title}}</view>
								</picker>
								<view v-else>暂无</view>
							</view>
						</view>
						<navigator url="/pages/customDetail/detailList" class="custom-item">
							<view>RFM评级</view>
							<view class="custom-follow">{{customData.rfm_name}}</view>
						</navigator>
					</view>
				</view>
				<view class="custom-tags">
					<view class="custom-tags-title"
					      :style="typeof list.tag_name != 'undefined' && typeof list.tag_name != 'undefined' && list.tag_name.length == 0 && list.per_name.length == 0 ? 'padding-bottom: 1.12rem;' : ''">
						<span style="float: left;">标签</span>
						<text v-if="typeof list.tag_name != 'undefined' && typeof list.tag_name != 'undefined' && list.tag_name.length == 0 && list.per_name.length == 0"
						      style="color: #999999;font-size: 0.693rem;margin-left: 1rem;">暂无
						</text>
						<image class="custom-info-edit-icon" style="float:right;"
						       src="../../static/customDetail/edit-icon2.png" @click="navigatorToTag"
						       v-if="showEdit && list.del_type != 2"></image>
					</view>
					<view @click="lookTags(list.tag_name)" style="margin-top: 0.96rem;"
					      v-if="typeof list.tag_name != 'undefined' && list.tag_name.length > 0">
						<span style="font-size: 0.747rem  /* 14/18.75 */;color: #666;vertical-align: top;width: 4rem  /* 75/18.75 */;display: inline-block;">公有标签：</span>
						<view class="custom-tags-list"
						      :style="tagMore? {display: 'inline-block', width: 'calc(100% - 4.96rem)'} : {}">
							<uni-tag :text="item.tagname" type="primary" :circle="true" class="custom-tags-list-tag"
							         v-for="item in list.tag_name"></uni-tag>
						</view>
						<view v-if="tagMore"
						      style="font-size: 0.8rem; height: 3.65rem; line-height: 3.65rem; margin-left: 0.267rem;width: 0.64rem; display: inline-block; vertical-align: top;color: #B2B2B2;margin-top: 0.693rem;cursor: pointer;">
							>
						</view>
					</view>
					<view style="border-top: 0.053rem  /* 1/18.75 */ dashed #D5D5D5;padding-top: 0.8rem  /* 15/18.75 */;"
					      v-if="typeof list.per_name != 'undefined' && list.per_name.length > 0"
					      :style="list.tag_name.length == 0 ? 'margin-top:0.8rem;' : ''">
						<span style="font-size: 0.747rem  /* 14/18.75 */;color: #666;vertical-align: top;width: 4rem  /* 75/18.75 */;display: inline-block;">私有标签：</span>
						<view class="custom-tags-list">
							<uni-tag :text="item" type="primary" :circle="true" class="custom-tags-list-tag"
							         v-for="item in list.per_name"></uni-tag>
						</view>
					</view>
				</view>
				<!--tab切换-->
				<view style="position: relative;margin-bottom: 2.6rem;">
					<view class="custom-tabs content_head"
					      :style="{'top': this.getParameter('external_userid') != null?'44px':0}"
					      :class="searchBarFixed?'fixed':''">
						<ms-tabs :list="tabList" v-model="tabActiveIdx"></ms-tabs>
					</view>
					<view style="visibility: hidden" :class="searchBarFixed?'occupy':''"></view>

					<!--互动轨迹-->
					<view class="custom-tabs-content" v-show="tabActiveIdx == 1">
						<image class="custom-tabs-content-empty"
						       src="../../static/customDetail/empty.png" v-if="interactList.length == 0"></image>
						<uni-steps :options="interactList" direction="column" v-if="interactList.length > 0"
						           :type="1"></uni-steps>
						<view class="custom-tabs-loading" v-if="interactList.length > 0">{{loadingText}}</view>
					</view>
					<!--跟进状态-->
					<view class="custom-tabs-content" v-show="tabActiveIdx == 0">
						<image class="custom-tabs-content-empty2"
						       src="../../static/customDetail/empty2.png" v-if="followRecord.length == 0"></image>
						<uni-steps :options="followRecord" direction="column" v-if="followRecord.length > 0" :type="2"
						           @editFollowRecort="openPop"></uni-steps>
						<view class="custom-tabs-loading" v-if="followRecord.length > 0">{{loadingText2}}</view>
						<drag-button
								v-if="list.del_type != 2"
								:isDock="true"
								:existTabBar="true"
								@btnClick="open('addVisible')" :content="addBtnImg" v-has="'client-addFollow'"/>
					</view>
					<!--客户画像-->
					<view class="custom-tabs-content" v-show="tabActiveIdx == 2">
						<view class="custom-tabs-list">
							<view style="padding: 0px 0 0.8rem;">
								<template v-for="(item,index) in list.field_list"
								          v-if="item.key == 'phone' && list.is_hide_phone != 1 || item.key != 'phone'">
									<view class="list">
										<text class="list-title">{{item.title}}</text>
										<template v-if="item.key != 'phone' && item.key != 'company'">
											<text class="list-content" v-if="item.value != '' && item.type != 8">
												{{item.value}}
											</text>
											<view class="list-content" v-if="item.value.length !== 0 && item.type == 8">
												<image @click="previewPic(index, imageIndex)"
												       style="width: 1.707rem  /* 32/18.75 */; height: 1.707rem  /* 32/18.75 */;margin: 0.107rem  /* 2/18.75 */;"
												       v-for="(item1,imageIndex) in item.value"
												       :src="commonUrl + item1.url"></image>
											</view>
											<text class="list-content"
											      v-if="item.value == '' || item.value.length == 0">暂无
											</text>
										</template>
										<template v-if="item.key == 'phone'">
											<text class="list-content" v-if="list.phone != ''">{{list.phone}}</text>
											<text class="list-content" v-if="list.phone == ''">暂无</text>
										</template>
										<template v-if="item.key == 'company'">
											<text class="list-content" v-if="list.company != ''">{{list.company}}</text>
											<text class="list-content" v-if="list.company == ''">暂无</text>
										</template>
									</view>
								</template>
								<view class="list">
									<text class="list-title">描述</text>
									<text class="list-content">{{list.des || '暂无'}}</text>
									<image @click="previewPath"
									       style="width: 1.707rem  /* 32/18.75 */; height: 1.707rem  /* 32/18.75 */;margin: 0.107rem  /* 2/18.75 */;margin-left: 4.427rem;"
									       :src="commonUrl + list.path" v-if="list.path"></image>
								</view>
							</view>
						</view>
						<drag-button
								v-if="list.del_type != 2"
								:isDock="true"
								:existTabBar="true"
								@btnClick="editBtn" :content="editBtnImg" v-has="'client-editInfo'"/>
					</view>
					<!--待办事项-->
					<view class="custom-tabs-content" v-show="tabActiveIdx == 3"
					      style="text-align: left;background: #F6F6F6;">
						<template v-for="item in todoList">
							<img src="../../static/customDetail/diot.png" alt="" class="todo-line">
							<text class="todo-status">停留在【{{item.title}}】</text>
							<view class="todo-box" v-for="part in item.data">
								<view class="todo-box-head">
									<view class="todo-box-head-title">
										<view style="">
											{{part.title}}
										</view>
									</view>
									<view>
										<text style="font-size: 0.64rem  /* 12/18.75 */;border: 0.053rem  /* 1/18.75 */ solid;padding: 0.16rem  /* 3/18.75 */ 0.267rem  /* 5/18.75 */;border-radius:0.32rem  /* 6/18.75 */;"
										      :style="{'color':part.status_color,'border-color':part.status_color}">
											{{part.status_title}}
										</text>
										<view style="width: 7rem;display: inline-block;float: right;    margin-top: 0.16rem  /* 3/18.75 */;">
											<cmd-progress :percent="part.per" stroke-color="#5284EC"></cmd-progress>
										</view>
									</view>
								</view>
								<view class="todo-box-body">
									<view class="todo-box-body-txt" v-if="part.status == 3">
										<text class="todo-box-body-txt-left">项目实际完成</text>
										<text style="color: #111;">{{part.finish_time}}
											<span v-if="part.is_finish == 1">（按时完成）</span>
											<span v-if="part.is_finish == 2"
											      style="color: red;">（超时{{part.delay_days}}天）</span>
											<span v-if="part.is_finish == 3">（提前{{part.pre_days}}天）</span>
										</text>
									</view>
									<view class="todo-box-body-txt">
										<text class="todo-box-body-txt-left">项目处理人</text>
										<text style="color: #111;">{{part.leader}}</text>
									</view>
									<view class="todo-box-body-txt">
										<text class="todo-box-body-txt-left">项目优先级</text>
										<text :style="{'color':part.level_color}">{{part.level}}</text>
									</view>
									<view class="todo-box-body-txt" v-if="part.status != 1">
										<text class="todo-box-body-txt-left">项目开始时间</text>
										<text style="color: #111;">{{part.start_time}}</text>
									</view>
									<view class="todo-box-body-txt" v-if="part.status != 1">
										<text class="todo-box-body-txt-left">预计截止时间</text>
										<text style="color: #111;">{{part.end_time}}</text>
									</view>
									<view class="todo-box-body-txt">
										<text class="todo-box-body-txt-left" style="float: left;">待办项目描述</text>
										<text style="word-wrap: break-word;width: calc(100% - 5.333rem  /* 100/18.75 */);float: left;color: #111;"
										      v-if="part.desc != ''">
											{{part.desc}}
										</text>
										<text style="word-wrap: break-word;width: calc(100% - 5.333rem  /* 100/18.75 */);float: left;color: #111;"
										      v-else>--
										</text>
									</view>
									<view style="text-align: right;">
										<button type="primary" class="todo-box-body-btn" @click="startProject(part.id)"
										        v-if="part.status == 1 && part.show_start == 1">项目开始
										</button>
										<button type="default" class="todo-box-body-btn"
										        style="background: transparent;color: #757B84;"
										        @click="detailProject(part.id)"
										        v-if="part.status != 1">待办详情
										</button>
										<button type="primary" class="todo-box-body-btn"
										        @click="openAddProject(part.id,part.title,part.end_time,part.status_id,part.per,part.last_days,part.task_id,part.external_userid,part.sea_id)"
										        v-if="part.status == 2 && part.show_project == 1">
											项目跟进
										</button>
									</view>
								</view>
							</view>
						</template>
						<view class="custom-tabs-loading" v-if="todoList.length > 0">{{loadingText3}}</view>
					</view>
					<Footer v-if="is_show_copyright == 1"></Footer>
				</view>
				<!--底部按钮-->
				<view class="footer content_head" v-if="list.del_type != 2">
					<!--					v-if="list.is_reclaim == 1"-->
					<view class="footer-btn" @click="assignHighSea" v-if="list.is_protect == 0 && list.is_reclaim == 1"
					      :class="list.is_show == 1 && list.is_rest == 1 ? 'three-btn' : 'two-btn'"
					      v-has="'client-backHighSea'">退回公海
					</view>
					<view class="footer-btn"
					      v-if="list.is_protect == 0 && list.is_show == 1 && list.is_rest == 1 && list.is_reclaim == 1"
					      @click="setProtect"
					      style="background-color: #FA6D59;width: 28%;border-radius: 0.96rem  /* 18/18.75 */;height: 1.6rem  /* 30/18.75 */;margin: 0.5rem auto;color: #FFF;"
					      v-has="'client-protect'">
						设为保护
					</view>
					<view class="footer-btn" v-if="list.is_protect == 0 && list.is_reclaim == 1" @click="assignStaff"
					      style="background-color:#FDAD39;"
					      :class="list.is_show == 1 && list.is_rest == 1 ? 'three-btn' : 'two-btn'"
					      v-has="'client-assign'">客户转交
					</view>
					<view class="footer-btn" v-if="list.is_protect == 1" @click="cancelProtect"
					      style="background-color: #5284EC;width: 40%;border-radius: 0.96rem  /* 18/18.75 */;height: 1.6rem  /* 30/18.75 */;margin: 0.5rem auto;color: #FFF;"
					      v-has="'client-protect'">
						取消保护
					</view>
				</view>
				<!--对话悬浮-->
				<drag-button
						:isDock="true"
						:existTabBar="true"
						@btnClick="toChat"
						:content="chatImg"
						v-if="userPlatform != 'other'"
						:marginTop="150"/>

				<!--铃铛-->
				<sop-bell ref="sopBell" :external_userid='externalId' :user_id='user_id'
				          :agent_id='$route.query.agent_id'></sop-bell>
				<!--sop弹框-->
				<sop-pop ref='sopPop' :external_userid='externalId' :user_id='user_id'
				         :agent_id='$route.query.agent_id'></sop-pop>

			</view>
		</view>
		<!--项目跟进弹窗-->
		<uni-popup @scroll.stop.prevent="moveHandle" ref="addProjectVisible" type="bottom" :mask-click="false"
		           class="add-project">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					添加项目跟进
				</text>
				<scroll-view scroll-y class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;height: 20rem  /* 375/18.75 */;overflow-y: auto;">
					<view style="line-height: 3.733rem  /* 70/18.75 */;color: #333333;font-size: 0.853rem  /* 16/18.75 */;font-weight: 700;text-align: left;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;">
						<text style="width: 0.16rem  /* 3/18.75 */;height: 0.72rem  /* 13.5/18.75 */;display: inline-block;background: #5283EC;margin-right: 0.427rem  /* 8/18.75 */;"></text>
						{{projectName}}
					</view>
					<view style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;">
						<view>
							<text style="font-weight: 700;">预计结束时间：</text>
							{{finishTime}}（还有{{restDay}}天)
						</view>
						<view v-if="projectList.length > 0" style="margin-top: 0.8rem  /* 15/18.75 */;">
							<text style="color: red;">*</text>
							<text style="font-weight: 700;">项目状态：</text>
							<picker @change="bindPickerChange" :value="projectIndex" :range="projectList"
							        range-key="title"
							        style="width: calc(100% - 4.667rem  /* 87.5/18.75 */);display: inline-block;">
								<view class="uni-input" style="font-size: 0.64rem  /* 12/18.75 */;">
									{{projectList[projectIndex].title}}
									<uni-icons type="arrowdown" size="20"
									           style="float: right;color: #C5C5C5;font-size: 0.8rem  /* 15/18.75 */;"></uni-icons>
								</view>
							</picker>
						</view>
						<view style="margin-top: 0.8rem  /* 15/18.75 */;">
							<text style="color: red;vertical-align: sub;">*</text>
							<text style="font-weight: 700;vertical-align: sub;">项目进度：</text>
							<input class="uni-input" type="number"
							       style="width: 5.333rem  /* 100/18.75 */;display: inline-block;vertical-align: middle;margin-right: 0.267rem  /* 5/18.75 */;font-size: 0.64rem  /* 12/18.75 */;"
							       v-model="process" placeholder="请输入进度"/>
							<span style="vertical-align: sub;">%</span>
							<span style="vertical-align: sub;color: #FF2438;margin-left: 0.533rem  /* 10/18.75 */;">上次进度在{{lastPer}}%</span>
						</view>
						<view style="margin-top: 0.8rem  /* 15/18.75 */;">
							<text style="color: red;">*</text>
							<text style="font-weight: 700;">进度说明：</text>
							<textarea placeholder="请输入进度说明，200字以内" maxlength="200"
							          v-model="instructions" class="add-project-textareea"/>
						</view>
					</view>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-project-cancal" @click="cancel('addProjectVisible')">取消</text>
					<text class="add-project-ok" @click="addProject">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--修改备注名弹窗-->
		<uni-popup ref="remarkVisible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">修改备注名</text>
				<input class="uni-input" focus placeholder="请输入备注名，10字以内" v-model="remark" maxlength="10"/>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('remarkVisible')">取消</text>
					<text class="uni-tip-button" @click="setRemark">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--修改描述弹窗-->
		<uni-popup ref="desVisible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">修改描述</text>
				<input class="uni-input" focus placeholder="请输入描述，100字以内" v-model="des" maxlength="100"/>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('desVisible')">取消</text>
					<text class="uni-tip-button" @click="setDes">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--修改成交率-->
		<uni-popup ref="closeRateVisible" type="center" :mask-click="false">
			<view class="uni-tip">
				<text class="uni-tip-title">修改成交率</text>
				<input class="uni-input" focus placeholder="请输入成交率" v-model="close_rate" maxlength="100"/>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('closeRateVisible')">取消</text>
					<text class="uni-tip-button" @click="setCloseRate">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--新增更进记录弹窗-->
		<uni-popup ref="addVisible" type="center" :mask-click="false" :custom="true"
		           @touchmove.stop.prevent="moveHandle" @scroll.stop.prevent="moveHandle">
			<view class="uni-tip">
				<text class="uni-tip-title">{{addVisibleText}}</text>
				<!--选择状态-->
				<view style="text-align: left;font-size: 14px;margin: 0.3rem;">跟进状态</view>
				<picker @change="changeStatus" range-key="title" :range="follows"
				        :disabled="canEdit == 1 ? false : true">
					<view class="uni-input">
						<view class="choose-status" v-for="item in follows" v-if="status == item.id">
							<!--								<view >-->
							{{item.title}}
							<!--								</view>-->
						</view>
						<uni-icons type="arrowdown" size="20" style="float: right;font-size: 15px;"
						           v-if="canEdit == 1"></uni-icons>
					</view>
				</picker>
				<!--输单原因-->
				<view v-if="followItem.lose_one==1">
					<view style="text-align: left;font-size: 14px;margin: 0.3rem;">输单原因</view>
					<picker @change="changeReason" range-key="context" :range="reasonList">
						<view class="uni-input">
							<view class="choose-status" v-for="item in reasonList" v-if="lose == item.id">
								{{item.context}}
							</view>
							<view class="choose-status" v-if="!lose">请选择输单原因</view>
							<uni-icons type="arrowdown" size="20" style="float: right;font-size: 15px;"
							           v-if="canEdit == 1"></uni-icons>
						</view>
					</picker>
				</view>

				<!--输入框-->
				<view class="uni-textarea">
					<textarea placeholder="添加跟进记录，1000字以内" v-model="msg" maxlength="1000"/>
				</view>
				<!--图片上传-->
				<view>
					<view class="uni-hello-addfile demo" @click="chooseImage" v-if="imageSrc.length < 9">+
						图片（{{imageSrc.length}}/9）
					</view>
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
					             style="max-height: 5.333rem;margin-top: 0.533rem  /* 10/18.75 */;"
					             @scroll.stop.prevent="scroll" v-if="imageSrc">
						<view v-for="(imgSrc,imgIndex) in imageSrc" class="img">
							<image :src="commonUrl + imgSrc" @click="preview(imgIndex)" class="img2"></image>
							<uni-icons type="close" size="20" style="position: absolute;right: 0;top: 0;"
							           color="#1890FF" @click="deleteImg(imgIndex)"></uni-icons>
						</view>
					</scroll-view>
				</view>

				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('addVisible')">取消</text>
					<text class="uni-tip-button" @click="addBtn">确定</text>
				</view>
			</view>
		</uni-popup>
		<!--预览图片弹窗-->
		<view
				v-if="previewShow"
				class="uni-margin-wrap preview-box">
			<swiper
					class="swiper swiper-box"
					:current-item-id="previewIndex">
				<swiper-item v-for="(item, key) in imageList" :key="key" :item-id="String(key)">
					<view
							class="swiper-item"
							@touchmove="touchMove"
							@touchstart="touchStart"
							@touchend="touchEnd"
							@click="closePreview">
						<img
								:src="commonUrl + item"
								width="75%"
								class="img-info"/>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<chooseStaffSelect v-if="showChooseStaff" :call-back="replyMsg" :isAll="1"></chooseStaffSelect>
		<!--分配、进入公海池后选择页面弹窗-->
		<uni-popup ref="sortPop" type="center">
			<view style="width: 16rem  /* 300/18.75 */;background: #FFF;margin: auto;height: 5.333rem  /* 100/18.75 */;">
				<view style="border-bottom: 0.053rem  /* 1/18.75 */ solid #CCC;line-height: 2.667rem  /* 50/18.75 */;line-height: 2.667rem  /* 50/18.75 */;padding: 0 0.533rem  /* 10/18.75 */;"
				      @click="changeFrom(1)">
					前往客户列表
				</view>
				<view style="line-height: 2.667rem  /* 50/18.75 */;line-height: 2.667rem  /* 50/18.75 */;padding: 0 0.533rem  /* 10/18.75 */;"
				      @click="changeFrom(2)">
					前往公海池列表
				</view>
			</view>
		</uni-popup>
		<!--选择标签组件-->
		<Tag
				v-if="showChooseTags"
				:call-back="replyMsg2"
				:hasTags="list.tag_name"></Tag>


		<uni-popup ref="showPhone" type="center" :maskClick="false">
			<phoneCall v-if="showCall" :customerData="selectedCustomer" :callBack="replyCall"/>
		</uni-popup>

	</view>
</template>

<script>
	import dragButton from "@/components/drag-button/drag-button.vue";
	import skeleton from "@/components/xinyi-skeleton/skeleton.vue";
	import chooseStaffSelect from "@/components/ChooseStaffSelect.vue";
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	import Tag from "../../components/Tag.vue";
	import SopBell from '../../components/sop/SopBell'
	import SopPop from '../../components/sop/SopPop'
	import Footer from "../../components/footer/footer.vue";
	import phoneCall from "@/components/call/phoneCall.vue";

	export default {
		name         : "list",
		inject       : [
			'initPage',
			'getExternalId',
			'getParameter',
			'getChatId',
			'forbidden',
			'getContext',
			'getCopyright','getPermissionButton'
		],
		components   : {
			dragButton,
			skeleton,
			chooseStaffSelect,
			pickRegions,
			Tag,
			Footer,
			SopBell,
			SopPop,
			phoneCall
		},
		data () {
			return {
				selectedCustomer : {},
				showCall         : false,
				actionId         : '',
				reasonList       : [],//输单原因
				lose             : '',//输单原因id
				followItem       : {},
				wosScroll        : "wos-scroll-yes",
				hideFlag         : false,
				user_id          : '',
				permissionButton : [],//权限
				externalId       : '',
				url              : '',
				ticketData       : {},
				agentData        : {},
				tagMore          : false,
				chatMore         : false,
				list             : [],
				swiperKey        : 0,
				indicatorDots    : true,
				autoplay         : false,
				commonUrl        : this.$store.state.commonUrl,
				tabActiveIdx     : 0,//当前tab值
				interactList     : [],//互动轨迹数据
				followRecord     : [],//跟进记录数据
				loadingText      : '加载中...',
				loadingText2     : '加载中...',
				count            : '',//互动轨迹的总数
				page             : 1,//互动轨迹的页码
				remark           : '',//修改的备注名
				des              : '',//修改的描述
				close_rate       : '',//修改的成交率
				tabList          : [{
					title: '跟进记录'
				}, {
					title: '互动轨迹'
				}, {
					title: '客户画像'
				}, {
					title: '服务待办'
				}],
				editBtnImg       : '../../static/customDetail/edit.png',//编辑悬浮按钮
				addBtnImg        : '../../static/customDetail/add.png',//新建悬浮按钮
				chatImg          : '../../static/scrm/chat.png',//对话悬浮按钮
				page2            : 1,//跟进记录的页码
				count2           : '',//跟进记录的总数
				status           : 1,//选择的状态
				// statusArray   : ['跟进中', '已拒绝', '已成交'],//状态选择列表
				follows          : [],
				msg              : '',//新增跟进内容
				imageSrc         : [],//上传图片链接数组
				marginTop        : '',//预览图片的marin-top值
				record_id        : '',//修改的某条记录id
				addVisibleText   : '',//跟进记录弹窗标题
				imageList        : [],
				previewShow      : false,
				previewIndex     : 0,
				touchStartX      : 0,
				touchStartY      : 0,
				scrollTop        : 0,
				old              : {
					scrollTop: 0
				},
				isReady          : false,
				//待办事项
				todoList         : [],//列表数据
				page3            : 1,//待办事项的页码
				count3           : '',//待办事项的总数
				loadingText3     : '加载中...',
				//项目跟进
				projectName      : '',//项目名
				finishTime       : '',//预计结束时间
				process          : '',//项目进度
				instructions     : '',//进度说明
				projectList      : [],//项目状态列表
				projectIndex     : 0,//选中的项目状态index
				projectId        : '',//选中的项目状态id
				lastPer          : 0,//上次项目进度
				cid              : '',//正在操作的项目id
				restDay          : '',//正在操作的项目剩余天数
				canEdit          : 1,//是否可以编辑客户跟进状态,1可以，0不可以
				showChooseStaff  : false,//是否显示选择成员组件
				task_id          : '',//添加跟进需要参数
				external_userid  : '',//添加跟进需要参数
				sea_id           : '',//添加跟进需要参数
				searchBarFixed   : false,
				showChooseTags   : false,//是否展示选择标签组件
				showEdit         : false,//账户是否有打标签、移除标签权限
				userPlatform     : localStorage.getItem('userPlatform'),//客户端平台，pc端other，安卓手机android，苹果手机ios
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權

				customData: {},//顾客数据
				gardeArr:[],//等级数组
				gardeIdx: -1,//等级对应的索引
				customer_id: '',//顾客id
				is_hide: 0,//是否显示顾客数据0:显示，1：不显示
			}
		},
		mounted () {
			window.addEventListener('scroll', this.handleScroll)
		},
		onLoad       : function () {
			uni.setNavigationBarTitle({
				title: '客户详情'
			});

			this.isReady = false
			this.tabActiveIdx = 0
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			let that = this

			this.$store.dispatch('setWx', () => {
				this.initPage(this.limit)
			})


			// let str = ['client-add-tag', 'client-remove-tag', 'client-addFollow', 'client-editInfo']
			// localStorage.setItem('permissionButton', str)
			// localStorage.setItem('user_id', 'xuyumin')
			// that.isReady = true
			// localStorage.setItem('uid', 2)
			// localStorage.setItem('corpid', 'ww800e25f6140d281c')
			// localStorage.setItem('agent_id', '25')
			// localStorage.setItem('externalId', 'wopx8REgAAlshNLZfkzdHmUN3pfbb4lw')
			// localStorage.setItem('token', 'U3ViVXNlci04NGVmZDNjMGVmNWFmYTJlMWM1ODFmNWU4ZjgyNTg3Nw=')
			// that.agentData = {
			// 	corpid    : "ww93caebeee67d134b",
			// 	agentid   : 1000019,
			// 	timestamp : 1596076091,
			// 	nonceStr  : "Fz3Q7PsFTf6bmAn3",
			// 	signature : "21082a14254c9879266e60cf9c9e492e2aa1d418",
			// 	jsApiList : ["sendChatMessage", "getCurExternalContact", "getCurExternalChat"],
			// 	expireTime: 1596083291
			// }
			// that.getInfoData()
			// that.getLoseReason()
		},
		onShow () {
			if (this.hideFlag) {
				this.hideFlag = false
				if (this.tabActiveIdx == 1) {
					this.page = 1
					this.getInteract(this.page)
				} else if (this.tabActiveIdx == 0) {
					this.page2 = 1
					this.getFollowRecord(this.page2)
				} else if (this.tabActiveIdx == 2) {
					this.getData()
				} else if (this.tabActiveIdx == 3) {
					this.page3 = 1
					this.getTodoList(this.page3)
					this.getProjectList()
				}
			}

			try {
				this.$nextTick(() => {
					this.$refs['sopPop'].initData() // sop 弹框
					this.$refs['sopBell'].initData() // sop 铃铛
				})
			} catch (e) {

			}
		},
		onHide () {
			this.hideFlag = true
		},
		onReachBottom: function () {
			if (this.tabActiveIdx == 1) {
				let num = 0
				this.interactList.map(x => {
					num += x.data.length
				})
				if (num < this.count) {
					this.page += 1
					this.getInteract(this.page)
				} else {
					this.loadingText = '已加载全部'
				}
			} else if (this.tabActiveIdx == 0) {
				let num = 0
				this.followRecord.map(x => {
					num += x.data.length
				})
				if (num < this.count2) {
					this.page2 += 1
					this.getFollowRecord(this.page2)
				} else {
					this.loadingText2 = '已加载全部'
				}
			} else if (this.tabActiveIdx == 3) {
				let num = 0
				this.todoList.map(x => {
					num += x.data.length
				})
				if (num < this.count3) {
					this.page3 += 1
					this.getTodoList(this.page3)
				} else {
					this.loadingText3 = '已加载全部'
				}
			}
		},
		watch        : {
			tabActiveIdx () {
				if (this.tabActiveIdx == 1) {
					this.page = 1
					this.getInteract(this.page)
				} else if (this.tabActiveIdx == 0) {
					this.page2 = 1
					this.getFollowRecord(this.page2)
				} else if (this.tabActiveIdx == 2) {
					uni.showLoading({
						title   : '加载中...',
						duration: 2000
					});
					setTimeout(() => {
						uni.hideLoading();
					}, 300);
				} else if (this.tabActiveIdx == 3) {
					this.page3 = 1
					this.getTodoList(this.page3)
					this.getProjectList()
				}
			},
			isReady (v) {
				if (v) {
					this.$nextTick(() => {
						this.$refs['sopPop'] && this.$refs['sopPop'].initData() // sop 弹框
						this.$refs['sopBell'] && this.$refs['sopBell'].initData() // sop 铃铛
					})
				}
			},
		},
		onUnload () {
			this.imageSrc = '';
		},
		methods      : {
			contact () {
				let that = this
				console.log(this.list)
				this.selectedCustomer.customerInfo={}
				this.selectedCustomer.customerInfo.avatar = this.list.avatar
				this.selectedCustomer.customerInfo.name = this.list.name
				this.selectedCustomer.type = 0
				this.selectedCustomer.key = this.list.external_id

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
				console.log(data)
				if (!data.showCall) {
					this.$refs.showPhone.close()
					this.showCall = false
				}
			},

			moveHandle () {
			},
			handleScroll () {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
					document.body.scrollTop
				this.scrollTop = scrollTop;
				if (scrollTop <= 700 && this.searchBarFixed) {
					this.searchBarFixed = false
				}
				if (scrollTop > 700 && !this.searchBarFixed) {
					this.searchBarFixed = true
				}
			},
			changeFrom (type) {
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				if (type == 1) {
					//客户列表
					uni.switchTab({
						url: "/pages/scrm/customer?agent_id=" + agent_id
					});
				} else if (type == 2) {
					//公海池列表
					uni.switchTab({
						url: "/pages/scrm/highSea?agent_id=" + agent_id
					});
				}
			}
			,
			scroll: function (e) {
				this.old.scrollTop = e.detail.scrollTop
			}
			,
			//微信对话
			toChat () {
				let _this = this
				_this.$store.state.wx.openEnterpriseChat({
					// 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
					userIds        : '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
					externalUserIds: _this.externalId, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
					groupName      : '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
					success        : function (res) {
						// 回调
					},
					fail           : function (res) {
						if (res.errMsg.indexOf('function not exist') > -1) {
							uni.showToast({
								title   : '版本过低请升级',
								image   : '/static/fail.png',
								duration: 2000
							});
						}
					}
				});
			}
			,
			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				let agent_id = this.getParameter('agentId') !== null ? this.getParameter('agentId') : (this.getParameter('agent_id') !== null ? this.getParameter('agent_id') : '')
				if (agent_id == null || agent_id == '' || agent_id == 'null') {
					agent_id = localStorage.getItem('agent_id') == null ? sessionStorage.getItem('agent_id') : localStorage.getItem('agent_id')
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

					that.$store.dispatch('setCorpId', that.corpid)

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
					that.$store.state.wx.ready(() => {
						if (typeof that.$store.state.wx.agentConfig === 'function') {
							that.initAgentConfig(that)
						} else {
							let agentConfig
							agentConfig = setInterval(() => {
								if (typeof that.$store.state.wx.agentConfig === 'function') {
									clearInterval(agentConfig)
									that.initAgentConfig(that)
								}
							}, 30)
						}
					})

				}
			}
			,
			//重新渲染頁面
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			}
			,
			initAgentConfig (that) {
				that.$store.state.wx.agentConfig({
					corpid   : that.agentData.corpid,
					agentid  : that.agentData.agentid,
					timestamp: that.agentData.timestamp,
					nonceStr : that.agentData.nonceStr,
					signature: that.agentData.signature,
					jsApiList: that.agentData.jsApiList,
					success  : function () {
						// 回调
						that.getContext((entry = '') => {
							if (entry == '') {
								uni.showToast({
									title   : '版本过低请升级',
									image   : '/static/fail.png',
									duration: 2000
								});
							}

							if (entry == 'group_chat_tools' && that.getParameter('source') != 'group') {
								uni.navigateTo({
									url: '/pages/group/index?agentId=' + (that.getParameter('agentId') !== null ? that.getParameter('agentId') : (that.getParameter('agent_id') !== null ? that.getParameter('agent_id') : ''))
								});
							} else {
								if (that.getParameter('external_userid') != null) {
									that.getInfoData()
								} else {
									that.getExternalId(that.getInfoData)
								}
							}
						}, () => {
							uni.showToast({
								title   : '版本过低请升级',
								image   : '/static/fail.png',
								duration: 2000
							});
						})
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
			,
			getInfoData () {
				this.externalId = this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('externalId')
				this.user_id = this.getParameter('user_id') != null ? this.getParameter('user_id') : localStorage.getItem('user_id')
				localStorage.setItem('externalId', this.externalId)
				this.userPlatform = localStorage.getItem('userPlatform')
				try {
					this.permissionButton = JSON.parse(JSON.stringify(localStorage.getItem('permissionButton'))).split(',')
					if (this.permissionButton.indexOf('client-add-tag') > -1 && this.permissionButton.indexOf('client-remove-tag') > -1) {
						this.showEdit = true
					} else {
						this.showEdit = false
					}
				} catch (e) {

				}
				//测试数据
				// localStorage.setItem('user_id', 'liyunli')
				// this.user_id = 'liyunli'
				// this.externalId = 'wmiWVTDwAAfdxuB23BfutKvq2AYIbM6g'
				// this.externalId = 'wmiWVTDwAAtXPKsrRAEte7aLZyN3D52Q'
				// this.externalId = 'wmiWVTDwAADll_Xi_VRR1ZzeLrfZBzOw'

				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				Promise.all([
					this.getFollowStatus(),
					this.getFollowRecord(1, false),
					this.getLoseReason(),
					this.getTodoList(1),
					this.customFun()
				]).then(res => {
					uni.hideLoading();
				}).catch(e => {
					uni.hideLoading();
				})
			},

			async getData () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-custom-detail/custom-detail", {
					uid            : localStorage.getItem('uid'),
					external_userid: this.externalId,
					corp_id        : localStorage.getItem('corpid'),
					userid         : this.user_id,
					now_userid     : localStorage.getItem('user_id')
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
					this.isReady = true
					this.list = res.data
					// if (this.list.follow_id == '') {
					// 	this.list.follow_id = this.follows[0] ? (this.follows[0].id ? this.follows[0].id : '') : ''
					// }
					if (this.list.is_follow_del == 1 && this.follows[0].status != 0) {
						// console.log(this.follows, 'this.follows')
						let obj = {
							id    : this.list.follow_id,
							title : this.list.follow_title + '（已删除）',
							status: 0,//已删除，1可用
						}
						this.follows.unshift(obj)
					}

					this.remark = res.data.nickname
					this.des = res.data.des
					this.close_rate = res.data.close_rate
					this.$store.commit("setHasTags", res.data.tag_name)
					this.canEditFollow(res.data.external_id)
					this.$nextTick(() => {
						let fzString = document.getElementsByTagName('html')[0].style.fontSize
						fzString = fzString.replace('px', '')
						let fz = parseFloat(fzString)
						let customTagsDom = document.getElementsByClassName('custom-tags-list')[0]
						if (customTagsDom) {
							if (customTagsDom.offsetHeight / fz > 3.65) {
								customTagsDom.style.height = '3.65rem'
								customTagsDom.style.overflowY = 'hidden'
								this.tagMore = true
							}
						}
						let chatNameDom = document.getElementsByClassName('chat-name-list')[0]
						if (chatNameDom) {
							if (chatNameDom.offsetHeight / fz > 3.65) {
								chatNameDom.style.height = '3.65rem'
								chatNameDom.style.overflowY = 'hidden'
								this.chatMore = true
							}
						}
					})
					if (localStorage.getItem('token') == null && typeof res.data.access_token != "undefined" && res.data.access_token != '') {
						localStorage.setItem('token', res.data.access_token)
					}
				}
			}
			,
			//获取互动轨迹数据
			async getInteract (page = 1, needToast = true) {
				if (needToast) {
					uni.showLoading({
						title   : '加载中...',
						duration: 2000
					});
				}
				const {data: res} = await this.axios.post("wap-custom-detail/custom-track", {
					uid            : localStorage.getItem('uid'),
					external_userid: this.externalId,
					corp_id        : localStorage.getItem('corpid'),
					userid         : this.user_id,
					now_userid     : localStorage.getItem('user_id'),
					page           : page,
					page_size      : 15,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					if (needToast) {
						uni.hideLoading();
					}
					this.count = res.data.count
					this.page = page
					if (page == 1) {
						this.interactList = res.data.info
					} else {
						this.interactList = this.interactList.concat(res.data.info)
					}
					let num = 0
					this.interactList.map(x => {
						num += x.data.length
					})
					if (num == this.count) {
						this.loadingText = '已加载全部'
					}
				}
			}
			,
			goThirdStore () {
				if (this.list.del_type == 2) {
					return false
				}
				uni.navigateTo({
					url: "/pages/customDetail/thirdStore?id=" + this.list.customerId
				});
			}
			,
			//打开关闭弹窗
			open (type) {
				if (this.list.del_type == 2) {
					return false
				}
				this.wosScroll = 'wos-scroll-no'
				this.$refs[type].open()
				this.addVisibleText = '添加跟进记录'
				this.status = this.list.follow_id
				let index = this.follows.findIndex(x => x.id == this.status)
				this.followItem = this.follows[index]
			}
			,

			async getLoseReason () {
				const {data: res} = await this.axios.post("custom-field/get-lose-msg", {
						corp_id: localStorage.getItem("corpid"),
					}
				);
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				if (res.error == 0) {
					this.reasonList = res.data
					uni.hideLoading();
				} else {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				}
			}
			,
			cancel (type) {
				this.wosScroll = 'wos-scroll-yes'
				this.$refs[type].close()
				this.remark = this.list.nickname
				this.des = this.list.des
				this.close_rate = this.list.close_rate
				this.status = 0
				this.msg = ''
				this.imageSrc = []
				this.record_id = ''
				this.projectName = ''
				this.finishTime = ''
				this.process = ''
				this.instructions = ''
				this.lastPer = 0
				this.lose = ''
				this.cid = ''
				this.restDay = ''
			}
			,
			//修改备注
			setRemark () {
				if (this.remark.length > 10) {
					uni.showToast({
						title   : "备注不可超过10个字",
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				this.editInfo(this.remark, 'nickname')
			}
			,
			//修改描述
			setDes () {
				if (this.des.length > 100) {
					uni.showToast({
						title   : "描述不可超过100个字",
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				this.editInfo(this.des, 'des')
			}
			,
			//修改成交率
			setCloseRate () {
				var reg = /^(?:0|[1-9][0-9]?|100)$/
				if (this.close_rate > 100) {
					uni.showToast({
						title   : "成交率不可超过100",
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}

				if (!reg.test(this.close_rate)) {
					uni.showToast({
						title   : "成交率必须为0-100正整数",
						image   : '/static/fail.png',
						duration: 2000
					});
					return false;
				}
				this.editInfo(this.close_rate, 'close_rate')
			}
			,
			//修改信息
			async editInfo (value, type) {
				this.wosScroll = 'wos-scroll-yes'
				if (type == 'nickname') {
					if (value == this.list.nickname) {
						this.$refs['remarkVisible'].close()
						return false;
					}
				} else if (type == 'des') {
					if (value == this.list.des) {
						this.$refs['desVisible'].close()
						return false;
					}
				} else if (type == 'close_rate') {
					if (value == this.list.close_rate) {
						this.$refs['closeRateVisible'].close()
						return false;
					}
				}
				const {data: res} = await this.axios.post('wap-custom-detail/custom-update', {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					external_userid: this.externalId,
					userid         : this.user_id,
					type           : type,
					value          : value
				});
				uni.showLoading({
					title   : '上传中...',
					duration: 2000
				});
				if (res.error == 0) {
					this.wosScroll = 'wos-scroll-yes'
					if (type == 'nickname') {
						this.$refs['remarkVisible'].close()
						this.remark = this.list.nickname
					} else if (type == 'des') {
						this.$refs['desVisible'].close()
						this.des = this.list.des
					} else if (type == 'close_rate') {
						this.$refs['closeRateVisible'].close()
						this.close_rate = this.list.close_rate
					}
					uni.showLoading({
						title   : '加载中...',
						duration: 2000
					});
					Promise.all([
						this.getData(),
						this.getInteract(1, false)
					]).then(res => {
						uni.hideLoading();
					}).catch(e => {
						uni.hideLoading();
					})
				} else {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				}
			}
			,
			//编辑按钮
			editBtn () {
				uni.navigateTo({
					url: '/pages/customDetail/edit?user_id=' + this.user_id + '&external_userid=' + this.externalId + '&type=1'
				});
			}
			,
			//获取跟进记录数据
			async getFollowRecord (page = 1, needToast = true) {
				if (needToast) {
					uni.showLoading({
						title   : '加载中...',
						duration: 2000
					});
				}
				const {data: res} = await this.axios.post("wap-custom-detail/custom-follow-record", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : this.user_id,
					now_userid     : localStorage.getItem('user_id'),
					external_userid: this.externalId,
					page           : page,
					page_size      : 15,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					if (needToast) {
						uni.hideLoading();
					}
					this.count2 = res.data.count
					this.page2 = page
					if (page == 1) {
						this.followRecord = res.data.followRecord
					} else {
						this.followRecord = this.followRecord.concat(res.data.followRecord)
					}
					let num = 0
					this.followRecord.map(x => {
						num += x.data.length
					})
					if (num == this.count2) {
						this.loadingText2 = '已加载全部'
					}
				}
			}
			,
			//新建按钮
			async addBtn () {
				if (!this.status) {
					uni.showToast({
						title   : '请选择跟进状态！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.followItem.lose_one == 1) {
					if (!this.lose || this.lose == '') {
						uni.showToast({
							title   : '请选择输单原因！',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false
					}
				} else {
					if (this.msg == '' && this.imageSrc.length == 0) {
						uni.showToast({
							title   : '跟进内容不能为空！',
							image   : '/static/fail.png',
							duration: 2000
						});
						return false
					}
				}
				for (let i = 0; i < this.follows.length; i++) {
					if (this.follows[i].id == this.status) {
						if (this.follows[i].status == 0) {
							uni.showToast({
								title   : '跟进状态已被删除，请更换！',
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						} else {
							break
						}
					}
				}
				uni.showLoading({
					title   : '上传中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wap-custom-detail/custom-follow-record-set", {
					uid            : localStorage.getItem('uid'),
					corp_id        : localStorage.getItem('corpid'),
					userid         : this.user_id,
					now_userid     : localStorage.getItem('user_id'),
					external_userid: this.externalId,
					follow_id      : this.status,
					record_id      : this.record_id,
					record         : this.msg,
					lose           : this.lose,
					file           : this.imageSrc,
				});
				if (res.error != 0) {
					uni.hideLoading();
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.msg = ''
					this.imageSrc = []
					this.status = 0
					this.lose = ''
					this.record_id = ''
					this.wosScroll = 'wos-scroll-yes'
					this.$refs['addVisible'].close()
					uni.showLoading({
						title   : '加载中...',
						duration: 2000
					});
					Promise.all([
						this.getFollowRecord(1, false),
						this.getTodoList(),
						this.getData()
					]).then(res => {
						uni.hideLoading();
					}).catch(e => {
						uni.hideLoading();
					})

				}
			}
			,
			//选择状态
			changeStatus (e) {
				this.status = this.follows[e.target.value].id
				this.followItem = this.follows[e.target.value]
			}
			,

			// 选择输单原因
			changeReason (e) {
				this.lose = this.reasonList[e.target.value].id
			}
			,
			//上传图片
			chooseImage     : function () {
				let that = this
				uni.chooseImage({
					count     : 1,
					sizeType  : ['compressed'],
					sourceType: ['album'],
					success   : (res) => {
						if (res.tempFiles[0].size > 2 * 1024 * 1024) {
							uni.showToast({
								title   : '文件大小超过2M',
								image   : '/static/fail.png',
								duration: 2000
							});
							return false
						}
						uni.showLoading({
							title   : '正在上传...',
							duration: 2000
						});
						var imageSrc = res.tempFilePaths[0]
						uni.uploadFile({
							url     : that.$store.state.commonUrl + '/api/sub-user/upload-image',
							filePath: imageSrc,
							fileType: 'image',
							name    : 'fileInfo',
							formData: {
								'uid': localStorage.getItem('uid'),
							},
							header  : {
								'Authorization': 'Bearer ' + localStorage.getItem('token')
							},
							success : (res) => {
								uni.hideLoading();
								if (JSON.parse(res.data).error == 0) {
									uni.showToast({
										title   : '上传成功',
										icon    : 'success',
										duration: 2000
									});
									that.imageSrc.push(JSON.parse(res.data).data.local_path)
								} else {
									uni.showToast({
										title   : JSON.parse(res.data).error_msg,
										image   : '/static/fail.png',
										duration: 2000
									});
								}
							},
							fail    : (err) => {
								uni.hideLoading();
								uni.showModal({
									content   : err.errMsg,
									showCancel: false
								});
							}
						});
					},
					fail      : (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'];
								if (!authStatus) {
									uni.showModal({
										title  : '授权失败',
										content: '需要从您的相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			}
			,
			touchMove (e) {
				let currentX = e.changedTouches[0].pageX
				let currentY = e.changedTouches[0].pageY

				// window.event.target.style.marginLeft = (currentX - this.touchStartX) + 'px'
				// window.event.target.style.marginTop = (currentY - this.touchStartY) + 'px'
			}
			,
			touchStart (e) {
				this.touchStartX = e.changedTouches[0].pageX
				this.touchStartY = e.changedTouches[0].pageY
			}
			,
			touchEnd (e) {
				let currentY = e.changedTouches[0].pageY

				if (Math.abs(currentY) - Math.abs(this.touchStartY) > 100) {
					this.previewShow = false
				} else {
					// window.event.target.style.marginLeft = 0
					// window.event.target.style.marginTop = 0
				}
			}
			,
			closePreview () {
				this.previewShow = false
			}
			,
			// 预览图片
			previewPic (index, imgIndex) {
				this.imageList = []
				this.previewIndex = String(imgIndex)
				for (let v of this.list.field_list[index].value) {
					this.imageList.push(v.url)
				}
				this.previewShow = true
			}
			,
			//预览图片
			preview (imgIndex) {
				this.previewIndex = String(imgIndex)
				this.imageList = this.imageSrc
				this.previewShow = true
			}
			,
			//预览描述中图片
			previewPath () {
				this.imageList.push(this.list.path)
				this.previewIndex = '0'
				this.previewShow = true
			}
			,
			//删除图片
			deleteImg (imgIndex) {
				this.imageSrc.splice(imgIndex, 1)
			}
			,
			//编辑跟进记录
			openPop (item) {
				console.log(item)
				this.lose = item.lose_id
				this.addVisibleText = '编辑跟进记录'
				this.record_id = item.id
				this.msg = item.record
				this.imageSrc = JSON.parse(JSON.stringify(item.file))
				this.status = item.follow_id
				let index = this.follows.findIndex(x => x.id == this.status)
				this.followItem = this.follows[index]
				this.$refs['addVisible'].open()
			}
			,
			lookChats (chatsName) {
				if (!this.chatMore) {
					return false
				}
				uni.navigateTo({
					url: '/pages/customDetail/chatsList?chatsList=' + encodeURIComponent(JSON.stringify(chatsName))
				});
			}
			,
			lookTags (tagName) {
				if (!this.tagMore) {
					return false
				}
				uni.navigateTo({
					url: '/pages/customDetail/tagsList?tagList=' + encodeURIComponent(JSON.stringify(tagName))
				});
			}
			,
			//打标签
			navigatorToTag () {
				this.wosScroll = 'wos-scroll-no'
				this.showChooseTags = true
			}
			,
			async replyMsg2 (error, tags, arr) {
				if (error == 'ok') {
					const {data: res} = await this.axios.post("wap-custom-detail/custom-tags-set", {
						uid            : localStorage.getItem('uid'),
						corp_id        : localStorage.getItem('corpid'),
						external_userid: this.externalId,
						group_id       : this.group_id,
						tagData        : arr,
						userid         : this.user_id,
						now_userid     : localStorage.getItem('user_id')
					});
					if (res.error != 0) {
						uni.showToast({
							title   : res.error_msg,
							image   : '/static/fail.png',
							duration: 2000
						});
					} else {
						this.wosScroll = 'wos-scroll-yes'
						this.showChooseTags = false
						this.getInfoData()
					}
				} else {
					this.wosScroll = 'wos-scroll-yes'
					this.showChooseTags = false
				}
			}
			,
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"wap-custom-detail/follow",
					{
						uid    : localStorage.getItem("uid"),
						status : 1,
						corp_id: localStorage.getItem("corpid"),
					}
				);

				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.follows = res.data.follow
					this.getData()
				}
			}
			,
			//返回
			back () {
				let agent_id = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
				if (this.getParameter('source') == 'group') {
					history.back()
				} else {
					if (this.getParameter('page') == 1) {
						uni.switchTab({
							url: "/pages/scrm/customer?agent_id=" + agent_id
						});
					} else if (this.getParameter('page') == 2) {
						uni.switchTab({
							url: "/pages/scrm/highSea?agent_id=" + agent_id
						});
					} else {
						history.back()
					}
				}
			}
			,
			//获取待办事项数据
			async getTodoList (page = 1) {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				const {data: res} = await this.axios.post("wait-project/custom-wait-project", {
					uid            : localStorage.getItem('uid'),
					userid         : localStorage.getItem('user_id'),
					user_id        : this.user_id,
					external_userid: this.externalId,
					corp_id        : localStorage.getItem('corpid'),
					page           : page,
					page_size      : 10,
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
					let that = this
					if (res.data.count == 0) {
						this.tabList = [{
							title: '跟进记录'
						}, {
							title: '互动轨迹'
						}, {
							title: '客户画像'
						}]
					} else {
						this.tabList = [{
							title: '跟进记录'
						}, {
							title: '互动轨迹'
						}, {
							title: '客户画像'
						}, {
							title: '服务待办'
						}]
					}
					that.count3 = res.data.count
					that.page3 = page
					if (page == 1) {
						that.todoList = res.data.info
					} else {
						if (res.data.info[0].id == that.todoList[that.todoList.length - 1].id) {
							that.todoList[that.todoList.length - 1].data = that.todoList[that.todoList.length - 1].data.concat(res.data.info[0].data)
							if (res.data.info.length > 1) {
								for (let i = 1; i < res.data.info.length; i++) {
									that.todoList.push(res.data.info[i])
								}
							}
						} else {
							that.todoList = that.todoList.concat(res.data.info)
						}
					}
					let num = 0
					this.todoList.map(x => {
						num += x.data.length
					})

					if (num == that.count3) {
						that.loadingText3 = '已加载全部'
					}
				}
			}
			,
			//开始
			startProject (id) {
				let that = this
				uni.showModal({
					content: '确定开始吗？',
					success: function (res) {
						if (res.confirm) {
							that.startProject2(id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
			,
			async startProject2 (id) {
				const {data: res} = await this.axios.post(
					"wait-project/start",
					{
						uid: localStorage.getItem('uid'),
						id : id,
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.getTodoList()
				}
			}
			,
			//待办详情
			detailProject (id) {
				uni.navigateTo({
					url: "/pages/customDetail/todoDetail?id=" + id + '&external_userid=' + this.externalId + '&user_id=' + this.user_id
				});
			}
			,
			//项目跟进
			openAddProject (id, title, time, status_id, per, last_days, task_id, external_userid, sea_id) {
				this.cid = id
				this.projectName = title
				this.finishTime = time
				this.projectId = status_id
				this.restDay = last_days
				for (let i = 1; i < this.projectList.length; i++) {
					if (this.projectList[i].id == status_id) {
						this.projectIndex = i
						break
					}
				}
				this.lastPer = per
				this.task_id = task_id
				this.external_userid = external_userid
				this.sea_id = sea_id
				this.$refs['addProjectVisible'].open()
			}
			,
			async addProject () {
				if (this.projectId == '') {
					uni.showToast({
						title   : '请选择项目状态！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.process == '') {
					uni.showToast({
						title   : '请填写项目进度！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				let reg = /^(?:0|[1-9][0-9]?|100)$/
				if (this.process == null || this.process == '') {
					uni.showToast({
						title   : '请填写项目进度！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.process != null && this.process != '' && (this.process < 0 || this.process > 100 || !reg.test(this.process))) {
					uni.showToast({
						title   : '项目进度必须为0-100正整数！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				if (this.instructions == '') {
					uni.showToast({
						title   : '进度说明不能为空！',
						image   : '/static/fail.png',
						duration: 2000
					});
					return false
				}
				const {data: res} = await this.axios.post("wait-project/add-project-status", {
					uid            : localStorage.getItem('uid'),
					id             : this.cid,
					per_desc       : this.instructions,
					status         : this.projectId,
					per            : this.process,
					task_id        : this.task_id,
					external_userid: this.external_userid,
					sea_id         : this.sea_id,
				})

				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.cancel('addProjectVisible')
					this.getTodoList()
				}
			}
			,
			//获取项目状态列表
			async getProjectList (id, close_rate) {
				const {data: res} = await this.axios.post(
					"wait-project/common-detail",
					{
						uid: localStorage.getItem("uid"),
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.projectList = []
					for (let j = 1; j < res.data.project_status.length; j++) {
						this.projectList.push(res.data.project_status[j])
					}
					for (let i = 0; i < this.projectList.length; i++) {
						if (this.projectList[i].id == id) {
							this.projectId = Number(id)
							break
						}
					}
					if (this.projectId == '') {
						this.projectId = Number(this.projectList[0].id)
					}
				}
			}
			,
			//修改项目状态
			bindPickerChange: function (e) {
				this.projectIndex = e.detail.value
				this.projectId = Number(this.projectList[this.projectIndex].id)
			}
			,
			//是否可以编辑客户跟进状态
			async canEditFollow (id) {
				const {data: res} = await this.axios.post(
					"wait-project/can-edit-follow",
					{
						cid : id,
						type: 1
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.canEdit = res.data.can_edit_follow
				}
			}
			,
			//客户分配
			//获取成员列表
			assignStaff () {
				this.showChooseStaff = true
			}
			,
			async replyMsg (item) {
				this.showChooseStaff = false
				if (typeof item != 'undefined' && item != '') {
					const {data: res} = await this.axios.post(
						"wap-public-sea/transfer",
						{
							uid           : localStorage.getItem('uid'),
							corp_id       : localStorage.getItem('corpid'),
							user_id       : item.id,
							follow_user_id: this.list.follow_user_id,
							type          : 1
						}
					);
					if (res.error != 0) {
						uni.showToast({
							title   : res.error_msg,
							image   : '/static/fail.png',
							duration: 2000
						});
					} else {
						let that = this
						uni.showModal({
							content   : res.data.textHtml,
							showCancel: false,
							success   : function (res) {
								if (res.confirm) {
									// that.getData()
									that.$refs['sortPop'].open()
								}
							}
						});
					}
				}
				this.$nextTick(() => {
					let fzString = document.getElementsByTagName('html')[0].style.fontSize
					fzString = fzString.replace('px', '')
					let fz = parseFloat(fzString)
					let customTagsDom = document.getElementsByClassName('custom-tags-list')[0]
					if (customTagsDom) {
						if (customTagsDom.offsetHeight / fz > 3.65) {
							customTagsDom.style.height = '3.65rem'
							customTagsDom.style.overflowY = 'hidden'
							this.tagMore = true
						}
					}
					let chatNameDom = document.getElementsByClassName('chat-name-list')[0]
					if (chatNameDom) {
						if (chatNameDom.offsetHeight / fz > 3.65) {
							chatNameDom.style.height = '3.65rem'
							chatNameDom.style.overflowY = 'hidden'
							this.chatMore = true
						}
					}
				})
			}
			,
			//进入公海池
			assignHighSea () {
				let that = this
				uni.showModal({
					content: '确认进入公海池吗？',
					success: function (res) {
						if (res.confirm) {
							that.assignHighSea2()
						}
					}
				});
			}
			,
			async assignHighSea2 () {
				const {data: res} = await this.axios.post(
					"wap-public-sea/give-up",
					{
						uid           : localStorage.getItem('uid'),
						corp_id       : localStorage.getItem('corpid'),
						follow_user_id: this.list.follow_user_id,
						type          : 1
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					let that = this
					uni.showModal({
						content   : res.data.textHtml,
						showCancel: false,
						success   : function (res) {
							if (res.confirm) {
								that.$refs['sortPop'].open()
							}
						}
					});
				}
			}
			,
			//设为保护
			setProtect () {
				let that = this
				uni.showModal({
					content: '确定保护【' + that.list.name + '】永不进入公海池吗？',
					success: function (res) {
						if (res.confirm) {
							that.setProtect2()
						}
					}
				});
			}
			,
			async setProtect2 () {
				const {data: res} = await this.axios.post(
					"wap-public-sea/protect",
					{
						uid           : localStorage.getItem('uid'),
						corp_id       : localStorage.getItem('corpid'),
						user_id       : localStorage.getItem('user_id'),
						follow_user_id: this.list.follow_user_id,
						type          : 1
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					let that = this
					uni.showModal({
						content   : res.data.textHtml,
						showCancel: false,
						success   : function (res) {
							if (res.confirm) {
								that.getData()
							}
						}
					});
				}
			}
			,
			//取消保护
			cancelProtect () {
				let that = this
				uni.showModal({
					content: '一旦取消保护，当符合客户回收规则后，客户将自动进入公海池，被其他同事认领，确定取消保护吗？',
					success: function (res) {
						if (res.confirm) {
							that.cancelProtect2()
						}
					}
				});
			}
			,
			async cancelProtect2 () {
				const {data: res} = await this.axios.post(
					"wap-public-sea/no-protect",
					{
						uid           : localStorage.getItem('uid'),
						corp_id       : localStorage.getItem('corpid'),
						user_id       : localStorage.getItem('user_id'),
						follow_user_id: this.list.follow_user_id,
						type          : 1
					}
				);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					let that = this
					uni.showModal({
						content   : res.data.textHtml,
						showCancel: false,
						success   : function (res) {
							if (res.confirm) {
								that.getData()
							}
						}
					});
				}
			},
			gardePickerChange: function (e) {//修改顾客数据，等级
				this.gardeIdx = e.detail.value
				this.handleBind(e.detail.value)
			},
			async customFun () {//顾客数据
				const {data: res} = await this.axios.post("shop-customer/mobile-msg", {
					corp_user_id: this.user_id,
					corp_id: localStorage.getItem('corpid'),
					external_userid: this.externalId,
					now_userid: localStorage.getItem('user_id')
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.customData = res.data
					this.customer_id = res.data.customer_id
					this.is_hide = res.data.is_hide
					this.rfmLevel()
				}
			},
			async rfmLevel () {//等级和rfm
				const {data: res} = await this.axios.post("shop-customer/level-rfm", {
					corp_id: localStorage.getItem('corpid') ? localStorage.getItem('corpid') : "",
				});
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					this.gardeArr = res.data.level
					this.gardeArr.map((x,y)=>{
						if(x.title==this.customData.level_name){
							this.gardeIdx = y
						}
					})
				}
			},
			async handleBind(index) {//修改等级
				let that = this
				let params={
					corp_id: localStorage.getItem('corpid') ? localStorage.getItem('corpid') : "",
					level_id: that.gardeArr[index].id,
					customer_ids: that.customer_id
				}
				let url = 'shop-customer/change-level';
				const {data: res} = await that.axios.post(url, params);
				if (res.error != 0) {
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					that.customFun()
				}
			},
		},
	}
</script>

<style scoped lang="less">
	.occupy {
		height: 3rem;
	}

	.fixed {
		background: #FFF;
		z-index: 999;
		position: fixed;
		left: 0;
		right: 0;
		box-shadow: 0 0.053rem /* 1/18.75 */ 0.213rem /* 4/18.75 */ 0 rgba(0, 0, 0, 0.08);
	}

	.box {
		background: #F6F6F6;
	}

	.custom-info {
		width: 100%;
		max-height: 10.4rem;
		background: #FFF;
		padding: 1.493rem 0.64rem 0.427rem;
		box-sizing: border-box;
	}

	.custom-info-avater {
		width: 3.093rem;
		height: 3.093rem;
		border-radius: 50%;
		float: left;
	}

	.custom-info-content {
		float: left;
		width: 8.267rem /* 155/18.75 */;
		margin: 0 0 0 0.587rem;
		text-align: left;
	}

	.custom-info-status {
		border-radius: 0.587rem;
		font-size: 0.64rem;
		padding: 0.1rem 0.2rem;
		line-height: 1.12rem;
		word-break: break-all;
	}

	.tag-blue {
		border: 1px solid #5283EC;
		color: #5283EC;
	}

	.tag-green {
		border: 1px solid #42D185;
		color: #42D185;
	}

	.tag-orange {
		border: 1px solid #FF734E;
		color: #FF734E;
	}

	.tag-red {
		border: 1px solid #E64833;
		color: #E64833;
	}

	.custom-info-content-title1 {
		color: #333;
		font-size: 0.853rem /* 16/18.75 */;
		line-height: 0.96rem;
	}

	.custom-info-sex {
		width: 0.907rem;
		height: 0.907rem;
		margin-left: 0.533rem;
		vertical-align: baseline;
	}

	.custom-info-content-line {
		font-size: 0.587rem;
		margin-top: 0.1rem;
		color: #999;
	}

	.custom-info-dec {
		margin-top: 0.747rem;
		background-color: #F7DEC2;
		border-radius: 3px;
		height: 1.787rem;
		line-height: 1.787rem;
		font-size: 0.587rem;
		color: #BD905D;
	}

	.custom-info-edit-icon {
		width: 0.587rem;
		height: 0.587rem;
		margin-left: 0.25rem;
		cursor: pointer;
	}

	.custom-list {
		background: #FFF;
		height: 4.533rem;
	}

	.custom-list-li {
		width: 33.33%;
		float: left;
	}

	.custom-list-li2 {
		width: 50%;
		float: left;
	}

	.custom-list-li-title {
		margin-top: 0.96rem;
		color: #333333;
		font-size: 0.96rem;
		height: 0.96rem;
	}

	.custom-list-li-des {
		color: #999999;
		font-size: 0.747rem /* 14/18.75 */;
		margin-top: 0.853rem;
	}

	.custom-tags {
		background: #FFF;
		margin: 0.533rem 0;
		padding: 1.12rem 0.853rem 0;
		box-sizing: border-box;
	}

	.custom-tags-title {
		height: 0.853rem;
		line-height: 0.853rem;
		font-size: 0.8rem /* 15/18.75 */;
		text-align: left;
	}

	.custom-tags-list {
		overflow: hidden;
		display: inline-block;
		width: calc(100% - 4rem);
	}

	.custom-tags-list-tag {
		height: 1.227rem;
		line-height: 1.227rem;
		box-sizing: border-box;
		background: #E7EFFC;
		border-color: #E7EFFC;
		margin: 0 0.64rem 0.64rem 0;
		float: left;
	}

	.chat-name {
		background: #FFF;
		margin: 0.533rem 0;
		padding: 1.12rem 0.853rem 0.3rem;
		box-sizing: border-box;
	}

	.chat-name-title {
		font-size: 0.8rem /* 15/18.75 */;
	}

	.chat-name-list {
		/*margin-top: 0.96rem;*/
		overflow: hidden;
	}

	.chat-name-list-tag {
		height: 1.227rem;
		line-height: 1.227rem;
		box-sizing: border-box;
		background: #E7EFFC;
		border-color: #E7EFFC;
		margin: 0 0.64rem 0.6rem 0;
		float: left;
	}

	/deep/ .uni-tag-text {
		color: #5283EC;
	}

	/deep/ .uni-tag-text span {
		display: inline-block;
		overflow: hidden;
		max-width: 9.6rem /* 180/18.75 */;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.custom-tabs {
		background: #FFF;
		line-height: 2.293rem;
		overflow: hidden;
		border-bottom: 1px solid #F5F5F5;
		font-size: 0.693rem;
		color: #999;
	}

	.custom-tabs-content {
		background: #FFF;
		padding: 0.8rem /* 15/18.75 */;
		box-sizing: border-box;
		min-height: 11.2rem /* 210/18.75 */;
	}

	.custom-tabs-content-empty {
		width: 6.187rem;
		height: 6.613rem;
		margin-top: 2.667rem;
	}

	.custom-tabs-content-empty2 {
		width: 6.88rem;
		height: 6.667rem;
		margin-top: 2.667rem;
	}

	.custom-tabs-loading {
		text-align: center;
		line-height: 1.6rem;
		font-size: 0.693rem;
		color: #CCC;
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
		height: 30px;
		line-height: 30px;
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

	/deep/ .tab {
		padding-bottom: 0 !important;
	}

	.list {
		line-height: 0.747rem;
		padding-top: 0.8rem;
		text-align: left;
	}

	.list:nth-child(3n) {
		border-bottom: 1px solid #F5F5F5;
		padding-bottom: 0.8rem;
	}

	.list-title {
		color: #ADAEB6;
		font-size: 0.693rem;
		display: inline-block;
		vertical-align: top;
		width: 2.88rem;
		margin-right: 1.547rem;
	}

	.list-content {
		color: #666666;
		font-size: 0.693rem;
		display: inline-block;
		width: calc(100% - 4.427rem);
		word-break: break-all;
	}

	/deep/ .tabBlock .tab__line {
		bottom: 0;
	}

	.choose-status {
		width: calc(100% - 40px);
		float: left;
		font-size: 0.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}

	.uni-textarea {
		border: 1px solid #CCC;
		border-radius: 4px;
		margin: 0.8rem 0;
		font-size: 0.8rem;
		text-align: left;
		padding: 0.427rem;
		box-sizing: border-box;
	}

	uni-textarea {
		width: auto;
	}

	.demo {
		font-size: 0.8rem;
		border: 1px solid #CCC;
		padding: 0.267rem 0px;
		border-radius: 4px;
	}

	.img {
		width: 3.627rem;
		height: 3.627rem;
		border-radius: 0.267rem;
		margin: 0 0.48rem 0.4rem 0;
		position: relative;
		float: left;
	}

	.img2 {
		width: 3.627rem;
		height: 3.627rem;
		border-radius: 0.267rem;
	}

	/*/deep/ .uni-popup__wrapper-box {*/
	/*	width: 100%;*/
	/*	height: 100%;*/
	/*}*/

	.hide {
		display: none;
	}

	.preview-box {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
		z-index: 9999999;
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

	.card-no {
		margin: 0 auto;
		margin-top: 0.693rem;
		font-size: 0.64rem;
		background-color: rgba(204, 204, 204, 0.2);
		color: #999999;
		border-radius: 0.64rem;
		height: 1.28rem;
		line-height: 1.28rem;
		padding: 0 0.8rem /* 15/18.75 */;
		display: inline-block;
	}

	.userinfo {
		width: 33%;
		display: inline-block;
	}

	.info-title {
		font-size: 0.96rem;
		/*font-weight: 700;*/
		font-stretch: normal;
		letter-spacing: 0rem;
		color: #000000;
	}

	.info-name {
		margin-top: 0.64rem /* 12/18.75 */;
		height: 0.68rem;
		font-family: PingFang-SC-Medium;
		font-size: 0.747rem /* 14/18.75 */;
		/*font-weight: normal;*/
		font-stretch: normal;
		letter-spacing: 0rem;
		color: #8D8D8D;
	}

	.todo-line {
		width: 0.933rem /* 17.5/18.75 */;
	}

	.todo-status {
		font-size: 0.8rem /* 15/18.75 */;
		vertical-align: top;
		font-weight: bold;
		color: #333333;
		margin-left: 0.267rem /* 5/18.75 */;
	}

	.todo-box {
		background: #FFFFFF;
		border-radius: 0.267rem /* 5/18.75 */;
		padding: 0.64rem /* 12/18.75 */;
		margin: 0.64rem /* 12/18.75 */ 0;
	}

	.todo-box-head {
		overflow: hidden;
		border-bottom: 1px solid #EEEDF0;
		padding-bottom: 0.64rem /* 12/18.75 */;
		margin-bottom: 0.8rem /* 15/18.75 */;
	}

	.todo-box-head-tag {
		color: #FFF;
		display: inline-block;
		max-width: 5.333rem /* 100/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid;
		border-radius: 0.213rem /* 4/18.75 */;
		padding: 0.053rem /* 1/18.75 */ 0.267rem /* 5/18.75 */;
		font-size: 0.64rem /* 12/18.75 */;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: bottom;
	}

	.todo-box-head-title {
		font-size: 0.747rem /* 14/18.75 */;
		color: #333;
		line-height: 1.173rem /* 22/18.75 */;
	}

	.todo-box-body {
		font-size: 0.693rem /* 13/18.75 */;
		color: #999;
	}

	.todo-box-body-txt {
		margin-bottom: 0.48rem /* 9/18.75 */;
		overflow: hidden;
	}

	.todo-box-body-btn {
		/*width: 4.053rem !* 76/18.75 *!;*/
		background: #5283EC;
		display: inline-block;
		font-size: 0.64rem /* 12/18.75 */;
		line-height: 1.493rem /* 28/18.75 */;
		margin-left: 0.64rem /* 12/18.75 */;
	}

	.add-project /deep/ .uni-tip {
		width: 100%;
		border-radius: 5px 5px 0 0;
	}

	/deep/ .uni-input {
		margin: 0 5px 0 0;
		border-color: #F6F6F6;
	}

	/deep/ .uni-input-placeholder {
		color: #CCC;
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

	.add-project-textareea {
		border: 0.053rem /* 1/18.75 */ solid #EEE;
		margin-top: 0.8rem /* 15/18.75 */;
		padding: 0.533rem /* 10/18.75 */;
		box-sizing: border-box;
		font-size: 0.693rem /* 13/18.75 */;
		width: 100%;
	}

	.add-project-textareea /deep/ .uni-textarea-placeholder {
		font-size: 0.693rem /* 13/18.75 */;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFF;
		display: flex;
		box-shadow: rgba(0, 0, 0, 0.08) 0px 0.053rem 0.213rem 0px;
	}

	.footer-btn {
		font-size: 0.64rem /* 12/18.75 */;
		margin-top: 0.267rem /* 5/18.75 */;
		margin-bottom: 0.267rem /* 5/18.75 */;
		line-height: 1.6rem;
	}

	.todo-box-body-txt-left {
		width: 5.333rem;
		display: inline-block;
	}

	.three-btn {
		background-color: #5284EC;
		width: 28%;
		border-radius: 0.96rem /* 18/18.75 */;
		height: 1.6rem /* 30/18.75 */;
		margin: 0.5rem auto;
		color: #FFF;
	}

	.two-btn {
		background-color: #5284EC;
		width: 40%;
		border-radius: 0.96rem /* 18/18.75 */;
		height: 1.6rem /* 30/18.75 */;
		margin: 0.5rem auto;
		color: #FFF;
	}

	.custom-data{
		background-color: #FFFFFF;
		margin: 0.533rem 0;
		padding: 1.12rem 0.853rem;
		box-sizing: border-box;
		.custom-data-title{
			display: flex;
			justify-content: space-between;
			font-size: 32rpx;
			font-weight: 600;
		}
		.custom-data-item{
			display: flex;
			justify-content: space-around;
			margin-top: 30rpx;
			.custom-item{
				font-size: 36rpx;
				.custom-item-garde{
					margin-top: 10rpx;
					font-size: 28rpx;
					color: #007aff;
				}
				.custom-follow{
					margin-top: 10rpx;
					font-size: 28rpx;
				}
			}

		}
	}


</style>
