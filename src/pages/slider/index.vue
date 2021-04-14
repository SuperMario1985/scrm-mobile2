<template>
	<view class="hello">
		<view v-if="showList && !showWebview">
			<view v-if="isPermission"
			      style="position: fixed;left: 0;right: 0;top: 0; padding: 1.067rem  /* 20/18.75 */ 0;">
				<button @click="changeTabKey(1)" class="tab-btn"
				        :class="tabKey == 1 ? 'active-btn-left' : 'active-btn1'">
					智能推荐
					<text v-if="keywordNum > 0" class="circle"></text>
				</button>
				<button @click="changeTabKey(2)" class="tab-btn"
				        :class="tabKey == 2 ? 'active-btn-right' : 'active-btn2'">内容引擎
				</button>
			</view>
			<!--	搜索框-->
			<view v-if="tabKey == 2" style="position: fixed;left: 0;right: 0;"
			      :style="{top : isPermission ? '3.2rem' : '0'}">
				<van-search
						v-model="inputValue"
						placeholder="请输入素材名称"
						show-action
						:action-text="inputValue.length > 0 ? '取消' : '搜索'"
						:disabled="!wxReady"
						@focus="focusSearch"
						@cancel="searchCancel"/>
				<!--		选择分组-->
				<van-field
						style="width: 33%; float: left;"
						readonly
						clickable
						name="picker"
						label=""
						v-model="groupName"
						@click="showPicker = true"
						placeholder="所有分组"/>
				<view @click="selectTag"
				      style="text-align: center; width: 24%; float: left; padding: 0.533rem  /* 10/18.75 */ 0.853rem  /* 16/18.75 */;font-size: 0.747rem  /* 14/18.75 */;line-height: 1.28rem  /* 24/18.75 */;">
					<text style="font-size: 0.747rem  /* 14/18.75 */; color: #969799;display: inline-block; width: calc(100% - 1.707rem  /* 32/18.75 */); overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
						{{ selectTagName || '所有标签' }}
					</text>
				</view>
				<van-field
						style="width: 33%; float: left;"
						readonly
						clickable
						name="picker"
						label=""
						v-model="radarName"
						@click="showRadar = true"
						placeholder="雷达状态"/>
			</view>
			<view v-if="tabKey == 1 && keyWords.length == 0">
				<img src="../../static/scrm/empty.png" alt="" class="empty-img">
			</view>
			<!--	关键词	-->
			<view v-if="tabKey == 1 && keyWords.length + keywordNum > 0"
			      style="height: 2.933rem  /* 55/18.75 */; overflow: hidden; font-size: 0.747rem  /* 14/18.75 */;text-align: left; position: fixed; top: 3.84rem  /* 72/18.75 */; padding: 0 1.067rem  /* 20/18.75 */;left: 0; right:0;">
				<view style="margin-bottom: 0.373rem  /* 7/18.75 */;">
					为您推荐最近检测到的关键词：
					<text style="color: #FF562D;">{{ keyLength }}</text>
					个<img src="../../static/assets/question.png" style="vertical-align: text-bottom; width: 0.96rem  /* 18/18.75 */;" @click="openQuestion"/>
					<text @click="refreshKeyword"
					      style="float: right; display: inline-block; cursor: pointer; margin-left: 0.533rem  /* 10/18.75 */;color:#01B065">
						刷新
					</text>
				</view>
				<view @click="lookKeyWord">
					<view style="width: calc(100% - 1.067rem  /* 20/18.75 */); height: 1.387rem  /* 26/18.75 */; overflow: hidden; display: inline-block; cursor: pointer;">
						<button class="keyword"
						        :class="includeId(keyWordIds, item.keyword_user_id) > -1 ? 'keywordActive' : ''"
						        v-for="(item, index) in keyWords">
							{{ item.keyword }}
						</button>
					</view>
					<text v-if="keyWords.length > 0"
					      style="font-size: 18px;color: #C3C3C3;display: inline-block; cursor: pointer; height: 1.6rem  /* 30/18.75 */; line-height: 1.6rem  /* 30/18.75 */;float: right;">
						>
					</text>
				</view>
			</view>
			<!--	Tab切换   -->
			<van-tabs :key="tabListKey" v-if="tabKey == 2 || (tabKey == 1 && keyWords.length > 0)" @change="changeTab"
			          :class="tabKey == 1 ? 'tab1-content': 'tab2-content'"
			          :style="{top : isPermission ? (tabKey == 1 ? '7.2rem' : '8.267rem') : '5.067rem'}"
			          v-model="tabType" swipeable>
				<van-tab v-if="tabKey == 2 || (tabKey == 1 && attachmentTypes.indexOf(6) > -1)"
				         :disabled="(!wxReady || getListLoading) && tabType !=6" :name="6" title="文本">
					<van-pull-refresh
							v-model="isTextLoading"
							success-text="刷新成功"
							@refresh="onRefresh">
						<van-list
								v-model="textLoading"
								:finished="textFinished"
								finished-text="没有更多了"
								@load="loadingItem">
							<template v-for="(item,index) in textList">
								<van-cell
										:key="index"
										:class="{ active:chooseMsgArr == item.id}"
										label-class="slider-text-label">
									<template slot="title">
										<span style="cursor: pointer;"
										      class="list-text"
										      v-html="typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name  : item.file_name"
										      @click="chooseMsg(item)"></span>
										<span style="float: right;margin-left: 6px;cursor: pointer;"
										      @click="showTextPicker(index, item)">
											<van-icon style="cursor: pointer;"
											          :name="textPicker && textIndex == index ? 'arrow-down' : 'arrow'"/>
										</span>
									</template>
									<span slot="label"
									      style="cursor: pointer;"
									      v-html="item.content"
									      @click="chooseMsg(item)">

									</span>
								</van-cell>
							</template>
						</van-list>
					</van-pull-refresh>
					<Footer v-if="is_show_copyright == 1 && textList.length > 0"></Footer>
					<Footer v-if="is_show_copyright == 1 && textList.length == 0"
					        style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
				</van-tab>
				<van-tab v-if="tabKey == 2 || (tabKey == 1 && attachmentTypes.indexOf(4) > -1)"
				         :disabled="(!wxReady || getListLoading) && tabType !=4" :name="4" title="图文">
					<van-pull-refresh
							v-model="ishFiveLoading"
							success-text="刷新成功"
							@refresh="onRefresh"
					>
						<van-list
								v-model="hFiveLoading"
								:finished="noMorehFive"
								finished-text="没有更多了"
								@load="loadingItem">
							<template v-for="(item,index) in hFiveList">
								<van-cell
										:key="index"
										:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active' :''">
									<template slot="title">
										<img
												v-lazy="commonUrl+item.s_local_path"
												class="img2"
												v-if="item.s_local_path != null && item.s_local_path != ''"
												@click="h5Preview(item.jump_url,item)"/>
										<img
												v-lazy="commonUrl+item.local_path"
												class="img2"
												v-if="item.s_local_path == null || item.s_local_path == ''"
												@click="h5Preview(item.jump_url,item)"/>
										<view style="width: calc(100% - 65px);float: right;"
										      @click="h5Preview(item.jump_url,item)">
											<img v-if="item.radar_status == 1" src="../../static/radar.png"
											     style="width: 14px;"/>
											<span class="list-text"
											      v-html="typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name  : item.file_name"
											      style="line-height: 18px;"></span>
											<span class="list-text2" v-html="item.content"
											      v-show="item.content != '' && item.content != null"></span>
											<span class="list-text2" v-if="!item.content" v-html="item.file_name"
											      style="line-height: 18px;"></span>
										</view>
										<van-icon
												:name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"
												class="icon-passed"
												:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active2' :''"
												@click="chooseMsg(item)"
												style="margin-top: 10px;margin-right: 5px;font-size: 22px; cursor: pointer;"/>
									</template>
								</van-cell>
							</template>
						</van-list>
					</van-pull-refresh>
					<Footer v-if="is_show_copyright == 1 && hFiveList.length > 0"></Footer>
					<Footer v-if="is_show_copyright == 1 && hFiveList.length == 0"
					        style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
				</van-tab>
				<van-tab v-if="tabKey == 2 || (tabKey == 1 && attachmentTypes.indexOf(5) > -1)"
				         :disabled="(!wxReady || getListLoading) && tabType !=5" :name="5" title="文件">
					<van-pull-refresh
							v-model="isFileLoading"
							success-text="刷新成功"
							@refresh="onRefresh"
					>
						<van-list
								style="cursor: pointer;"
								v-model="fileLoading"
								:finished="fileFinished"
								finished-text="没有更多了"
								@load="loadingItem"
						>
							<van-cell
									v-for="(item,index) in fileList"
									:key="index"
									@click="chooseMsg(item)"
									:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active' :''">
								<template slot="title">
									<img src="@/static/assets/doc.png" alt="" class="file-img"
									     v-if="item.extension == 'doc'">
									<img
											src="@/static/assets/docx.png"
											alt=""
											class="file-img"
											v-if="item.extension == 'docx'">
									<img src="@/static/assets/xls.png" alt="" class="file-img"
									     v-if="item.extension == 'xls'">
									<img
											src="@/static/assets/xlsx.png"
											alt=""
											class="file-img"
											v-if="item.extension == 'xlsx'">
									<img src="@/static/assets/csv.png" alt="" class="file-img"
									     v-if="item.extension == 'csv'">
									<img src="@/static/assets/ppt.png" alt="" class="file-img"
									     v-if="item.extension == 'ppt'">
									<img
											src="@/static/assets/pptx.png"
											alt=""
											class="file-img"
											v-if="item.extension == 'pptx'">
									<img src="@/static/assets/txt.png" alt="" class="file-img"
									     v-if="item.extension == 'txt'">
									<img src="@/static/assets/pdf.png" alt="" class="file-img"
									     v-if="item.extension == 'pdf'">
									<img
											src="@/static/assets/xmind.png"
											alt=""
											class="file-img"
											v-if="item.extension == 'xmind'">
									<view class="file-title">
										<img v-if="item.radar_status == 1" src="../../static/radar.png"
										     style="width: 14px;"/>
										{{
										typeof item.first_group.first_group_name != 'undefined'
										&& item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name
										+ '】' + item.file_name : item.file_name
										}}
									</view>
								</template>
							</van-cell>
						</van-list>

					</van-pull-refresh>
					<Footer v-if="is_show_copyright == 1 && fileList.length > 0"></Footer>
					<Footer v-if="is_show_copyright == 1 && fileList.length == 0"
					        style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
				</van-tab>
				<van-tab v-if="tabKey == 2 || (tabKey == 1 && attachmentTypes.indexOf(1) > -1)"
				         :disabled="(!wxReady || getListLoading) && tabType !=1" :name="1" title="图片">
					<van-pull-refresh
							v-model="isPicLoading"
							success-text="刷新成功"
							@refresh="onRefresh"
					>
						<van-grid :gutter="10" :column-num="3" style="padding: 10px 0;">
							<van-grid-item
									v-for="(item,index) in picList"
									:key="index"
									:class="{ active:includeId(chooseMsgH5OrFileArr, item.id) != -1}">
								<img
										v-lazy="commonUrl+item.s_local_path"
										@click="previewPic(index,item)"
										class="img"
										v-if="item.s_local_path != null && item.s_local_path != ''"
										:style="height"/>
								<img
										v-lazy="commonUrl+item.local_path"
										@click="previewPic(index,item)"
										class="img"
										v-if="item.s_local_path == null || item.s_local_path == ''"
										:style="height"/>
								<van-icon :name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"
								          class="icon-passed"
								          style="cursor: pointer;"
								          :class="{active2:includeId(chooseMsgH5OrFileArr, item.id) != -1}"
								          @click="chooseMsg(item)"/>
								<span class="pic-text" @click="previewPic(index,item)">
									<img v-if="item.radar_status == 1" src="../../static/radar.png"
									     style="width: 14px;"/>
									{{ typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name : item.file_name }}
								</span>
							</van-grid-item>
						</van-grid>
					</van-pull-refresh>
					<view v-if="noMorePic"
					      style="color: #969799;font-size: 14px;line-height: 50px;margin-top: -20px;">
						没有更多了
					</view>
					<van-loading size="24px" v-if="picLoading" style="margin: -5px 20px 15px">加载中...</van-loading>
					<Footer v-if="is_show_copyright == 1 && picList.length > 0"></Footer>
					<Footer v-if="is_show_copyright == 1 && picList.length == 0"
					        style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
				</van-tab>
				<van-tab v-if="tabKey == 2 || (tabKey == 1 && attachmentTypes.indexOf(3) > -1)"
				         :disabled="(!wxReady || getListLoading) && tabType !=3" :name="3" title="视频">
					<van-pull-refresh
							v-model="isVideoLoading"
							success-text="刷新成功"
							@refresh="onRefresh">
						<van-list
								v-model="videoLoading"
								:finished="videoFinished"
								finished-text="没有更多了"
								@load="loadingItem">
							<van-cell
									v-for="(item,index) in videoList"
									:key="index"
									:class="{ active:includeId(chooseMsgH5OrFileArr, item.id) != -1}">
								<template slot="title">
									<view style="height: 44px;">
										<img src="@/static/assets/video.png"
										     @click="videoPreview(commonUrl+item.local_path,item)" alt=""
										     class="file-img"
										>
										<span class="file-title"
										      style="color: #323233;font-size: 14px;width: 100%;max-width: calc(100% - 60px);"
										      @click="videoPreview(commonUrl+item.local_path,item)">
											<img v-if="item.radar_status == 1" src="../../static/radar.png"
											     style="width: 14px;"/>
											{{ typeof item.first_group.first_group_name != 'undefined' && item.first_group.is_not_group != 1 ? '【' + item.first_group.first_group_name + '】' + item.file_name : item.file_name }}
										</span>
										<van-icon
												:name="includeId(chooseMsgH5OrFileArr, item.id) != -1 ? 'passed' : 'circle'"
												class="icon-passed"
												:class="includeId(chooseMsgH5OrFileArr, item.id) != -1?'active2' :''"
												@click="chooseMsg(item)"
												style="margin-top: 10px;margin-right: 5px;font-size: 22px;cursor: pointer;"/>
									</view>
								</template>
							</van-cell>
						</van-list>
					</van-pull-refresh>
					<Footer v-if="is_show_copyright == 1 && videoList.length > 0"></Footer>
					<Footer v-if="is_show_copyright == 1 && videoList.length == 0"
					        style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
				</van-tab>
				<van-tab v-if="tabKey == 2 || (tabKey == 1 && attachmentTypes.indexOf(7) > -1)"
				         :disabled="(!wxReady || getListLoading) && tabType !=7" :name="7" title="小程序">
					<van-pull-refresh
							v-model="isPicLoading"
							success-text="刷新成功"
							@refresh="onRefresh"
					>
						<van-list
								style="text-align: left;"
								v-model="appletLoading"
								:finished="appletFinished"
								finished-text="没有更多了"
								@load="loadingItem">
							<van-cell class="applet-cell"
							          style="cursor: pointer;"
							          v-for="(item,index) in appletList"
							          :key="index" @click="chooseMsg(item)">
								<template slot="title">
									<view :class="{ active:chooseMsgArr == item.id}">
										<img
												v-lazy="commonUrl+item.s_local_path"
												style="width: 100%;"
												v-if="item.s_local_path != null && item.s_local_path != ''"
												:style="height"/>
										<img
												v-lazy="commonUrl+item.local_path"
												style="width: 100%;"
												v-if="item.s_local_path == null || item.s_local_path == ''"
												:style="height"/>
										<span
												style="padding: 0 5px; background: #0F0F0F;color: #FFF;font-size: 14px;width: calc(100% - 10px);opacity: 0.3;display: inline-block;">
											{{ item.file_name }}
										</span>
									</view>
								</template>
							</van-cell>
						</van-list>
					</van-pull-refresh>
					<!--					<view v-if="appletFinished"-->
					<!--					      style="color: #969799;font-size: 14px;line-height: 50px;margin-top: -20px;">-->
					<!--						没有更多了-->
					<!--					</view>-->
					<!--					<van-loading size="24px" v-if="appletLoading" style="margin: -5px 20px 15px">加载中...</van-loading>-->
					<Footer v-if="is_show_copyright == 1 && appletList.length > 0"></Footer>
					<Footer v-if="is_show_copyright == 1 && appletList.length == 0"
					        style="position: fixed;bottom: 44px;left: 0;right: 0;"></Footer>
				</van-tab>
			</van-tabs>

			<!--			预览图片-->
			<view
					v-if="show"
					class="uni-margin-wrap preview-box">
				<view @click="sendMsg(1)"
				      style="position: absolute;right: 16px;top: 16px;color: #FFF;cursor: pointer;z-index:9999999999999999;">
					发送
				</view>
				<swiper
						class="swiper swiper-box"
						:current-item-id="index">
					<swiper-item v-for="(item, key) in images" :key="key" :item-id="String(key)">
						<view
								class="swiper-item"
								@touchmove="touchMove"
								@touchstart="touchStart"
								@touchend="touchEnd"
								@click="closePreview">
							<img
									:src="item"
									width="75%"
									class="img-info"/>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!--		发送-->
			<van-button
					v-if="tabType != 6 && (tabKey == 2 || (tabKey == 1 && keyWords.length > 0))"
					type="info"
					plain
					hairline
					block
					style="width:90%;right:16px;border-radius:14px;border:none;position: fixed;bottom: 0;z-index:1000;background: #1989FA;cursor: pointer;color: #FFF;height: 1.7rem;margin-bottom: 0.2rem"
					:disabled="!wxReady"
					@click="sendMsg">
				发送<span
					v-if="(tabType != 6) && chooseMsgH5OrFileArr.length > 0 && this.$store.state.chooseMsgType == tabType">（{{ chooseMsgH5OrFileArr.length }}）</span>
			</van-button>
			<view v-if="(tabType != 6 && tabType != 7) && wxReady && (tabKey == 2 || (tabKey == 1 && keyWords.length > 0))"
			      style="left:16px;border-radius:14px;border:none;position: fixed;bottom: 0;padding-left: 10px; z-index:1001;cursor: pointer;height: 1.7rem  /* 44/18.75 */;margin-bottom: 0.2rem;line-height: 1.7rem  /* 44/18.75 */;"
			      :class="!wxReady ? 'blue-disabled' : 'blue'">
				<checkbox-group class="student-lists" @change="changeAllSelect">
					<checkbox value="1" :checked="allSelectValue.length != 0"></checkbox>
					<span style="color: #FFF; font-size: 14px;margin-left: 5px;">全选 |</span>
				</checkbox-group>
			</view>
			<van-button
					v-if="tabType == 6 && wxReady"
					type="info"
					plain
					hairline
					block
					class="action-btn"
					style="left:50%;width:46%;background: #1989FA;color: #FFF;"
					:disabled="!wxReady"
					@click="sendMsg">
				发送<span
					v-if="(tabType != 6) && chooseMsgH5OrFileArr.length > 0 && this.$store.state.chooseMsgType == tabType">（{{ chooseMsgH5OrFileArr.length }}）</span>
			</van-button>
			<van-button
					type="info"
					plain
					hairline
					block
					v-if="tabType==6 && wxReady"
					class="action-btn"
					:disabled="!wxReady"
					@click="editMsg">
				编辑
			</van-button>

		</view>
		<view v-if="!showList" style="padding: 20px;">
			<img src="@/static/assets/site.png" alt="" style="max-width: 300px; width: 100%;">
			<h2>欢迎使用云美来智慧营销系统</h2>
		</view>
		<uni-popup class="question" ref="question" type="center">
			<view class="uni-tip" style="width:100%;">
				<view class="question-content">
					触发的关键词及对应内容只展示一小时，超过一小时后不再展示。
				</view>
				<view class="question-content mb-15">
					当所有触发的关键词及对应内容均超过1小时后，只保留最后一次触发的关键词及对应内容。
				</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" style="color:rgb(59, 59, 59);margin-right: -1px"
					      @click="closeQuestion">
						知道了
					</text>
				</view>
			</view>


		</uni-popup>
		<uni-popup class="text-edit" ref="editText" type="center">
			<view class="uni-tip" style="width:100%;">
				<view class="text_container">
				    <textarea style="width: 100%;text-align: left;height:20rem;font-size: 0.853rem;"
				              @input="descInput($event)" :maxlength="maxLen"
				              v-model="context" wrap="hard"/>
				</view>

				<view style="text-align: right;font-size: 14px;color:#E8E8E8;margin-right: 20px">
					{{ contextLength }}/1000
				</view>
				<view style="color: red;font-size: 14px;text-align: left;margin-left: 6%">仅对本次编辑生效</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" style="color:rgb(59, 59, 59);margin-right: -1px" @click="cancelEdit">
						取消
					</text>
					<text class="uni-tip-button" @click="confirmEdit">发送</text>
				</view>
			</view>
		</uni-popup>
		<!--    分组 -->
		<van-popup v-if="tabKey == 2" v-model="showPicker" position="bottom">
			<view>
				<view style="height: 40px;line-height: 40px;color: #1989FA;padding: 0 10px;">
					<view style="float: left;cursor: pointer;" @click="handlerCancle">取消</view>
					<view class="chooseGroupName">{{ this.$store.state.groupName }}
						<van-icon
								name="close"
								@click="clearGroup"
								v-show="this.$store.state.groupName != ''"
								style="margin-left: 5px;"/>
					</view>
					<view style="float: right;cursor: pointer;" @click="handlerOk">确定</view>
				</view>
				<view style="height: 200px;overflow-y: auto;">
					<Group :data="groupArr"></Group>
				</view>
			</view>
		</van-popup>
		<!--    分组 -->
		<van-popup v-if="tabKey == 2" v-model="showRadar" position="bottom">
			<view>
				<view style="height: 40px;line-height: 40px;color: #1989FA;padding: 0 10px;">
					<view style="float: left;cursor: pointer;" @click="handlerCancleRadar">取消</view>
					<view class="chooseGroupName">{{ this.radarName }}
						<van-icon
								name="close"
								@click="clearRadar"
								v-show="this.radarName != ''"
								style="margin-left: 5px;"/>
					</view>
					<view style="float: right;cursor: pointer;" @click="handlerOkRadar">确定</view>
				</view>
				<view style="height: 135px;overflow-y: auto;">
					<div :style="{color : isRadar == item.isRadar ? '#01B065' : '#323233'}" class="radar-item"
					     v-for="item in radarArr" @click="selectRadar(item.isRadar, item.radarName)">
						{{ item.radarName }}
					</div>
				</view>
			</view>
		</van-popup>
		<!--	查看更多关键词	-->
		<uni-popup ref="keyword" type="bottom" :mask-click="false">
			<view class="uni-tip">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					选择关键词
				</text>
			</view>
			<view style="margin-bottom: 0.533rem  /* 10/18.75 */; font-size: 0.747rem  /* 14/18.75 */;text-align: left;max-height: 16rem  /* 300/18.75 */;overflow-y: auto;padding: 0.267rem  /* 5/18.75 */ 0.533rem  /* 10/18.75 */;">
				<button class="keyword"
				        :class="includeId(selectedIds, item.keyword_user_id) > -1 ? 'keywordActive' : ''"
				        @click="selectKeywordId(item.keyword_user_id)" v-for="(item, index) in keyWords">
					{{ item.keyword }}
				</button>
			</view>
			<view class="uni-tip-group-button">
				<text class="add-tag-cancal" @click="cancelSelectId">取消</text>
				<text class="add-tag-ok" @click="handleSelectId">确定</text>
			</view>
		</uni-popup>
		<uni-popup ref="selectTag" type="bottom" :mask-click="false" class="add-project" :key="1">
			<view class="uni-tip" style="padding: 0 !important;">
				<text style="color: #333;font-size: 0.96rem  /* 18/18.75 */;font-weight: 700;line-height: 2.667rem  /* 50/18.75 */;border-bottom: 0.053rem  /* 1/18.75 */ solid #F2F2F2;">
					选择标签
				</text>
				<view style="color: rgb(51, 51, 51);font-size: 0.96rem; text-align: left; font-size: 0.747rem  /* 14/18.75 */;padding: 1.013rem  /* 19/18.75 */ 0.533rem  /* 10/18.75 */ 0.533rem  /* 10/18.75 */;">
					当前选中：
					<text style="font-weight: 700;">{{ selectTagName1 || '所有标签' }}</text>
				</view>
				<scroll-view scroll-y="true" scroll-x="true" class="scroll-Y"
				             style="font-size: 0.747rem  /* 14/18.75 */;color: #333;text-align: left;overflow-y: auto!important;height: 14.933rem  /* 280/18.75 */;">
					<ly-tree
							:highlightCurrent="true"
							:props="groupData"
							node-key="id"
							:currentNodeKey="selectTagId1"
							:load="loadNode"
							@node-click="handleNodeClick"
							lazy
					/>
				</scroll-view>
				<view class="uni-tip-group-button">
					<text class="add-tag-cancal" @click="cancelSelectTag('addCustomVisible')">取消</text>
					<text class="add-tag-ok" @click="addTag">确定</text>
				</view>
			</view>
		</uni-popup>
		<!-- 文本发送预览 -->
		<van-popup v-if="textList.length > 0"
		           v-model="textPicker"
		           position="bottom">
			<view>
				<view style="height: 40px;line-height: 40px;color: #1989FA;padding: 0 10px;">
					<view style="float: left;font-size:14px;cursor: pointer;" @click="textPickerCancle">取消</view>
					<view style="float: right;font-size:14px;cursor: pointer;" @click="sendMsg">发送</view>
				</view>
				<view style="height: 200px;overflow-y: auto;">
					<view style="padding: 0 16px 10px;text-align: left;color: #333;font-size:14px;">
						{{ textList[textIndex].file_name }}
					</view>
					<view style="text-align: left;padding: 0 16px; color:#969799;font-size:12px;"
					      v-html="textList[textIndex].content"></view>
				</view>
			</view>
		</van-popup>
		<!--			预览图片-->
		<view v-if="show" class="uni-margin-wrap preview-box">
			<view @click="sendMsg(1)"
			      style="position: absolute;right: 16px;top: 16px;color: #FFF;cursor: pointer;z-index:9999999999999999;">
				发送
			</view>
			<swiper
					class="swiper swiper-box"
					:current-item-id="index">
				<swiper-item v-for="(item, key) in images" :key="key" :item-id="String(key)">
					<view
							class="swiper-item"
							@touchmove="touchMove"
							@touchstart="touchStart"
							@touchend="touchEnd"
							@click="closePreview">
						<img
								:src="item"
								width="75%"
								class="img-info"/>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!--	遮罩	-->
		<view class="web-back" v-if="showWebview">
			<uni-nav-bar
					@clickLeft="webViewCancel"
					@clickRight="sendMsg(1)">
				<view slot="default"
				      style="text-align: center;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
					{{ previewTitle }}
				</view>
				<view slot="left" style="margin-left:9px; cursor: pointer; color:#1989FA;">取消</view>
				<view slot="right" style="color:#1989FA;cursor: pointer;">发送</view>
			</uni-nav-bar>
		</view>
		<view class="web-view" v-if="showWebview">
			<!-- 图文预览页面 -->
			<web-view :src="hFiveurl" v-if="showH5Preview"></web-view>
			<!-- 视频预览页面 -->
			<web-view :src="videourl" v-if="showVideoPreview"></web-view>
		</view>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import Group from "@/components/Group";
	import axios from "axios";
	import UniTag from "../../components/uni-tag/uni-tag";
	import UniPopup from "../../components/uni-popup/uni-popup";
	import Footer from "../../components/footer/footer.vue";

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()
	export default {
		name      : 'index',
		props     : {
			msg: String
		},
		components: {
			UniPopup,
			UniTag,
			Group,
			Footer
		},
		inject    : ['initPage', 'getExternalId', 'getChatId', 'forbidden', 'getContext'],
		data () {
			return {
				selectTagId           : '', // 内容标签筛选选中的标签id
				selectTagName         : '', // 内容标签筛选选中的标签
				selectTagId1          : '', // 内容标签弹窗选中的标签id
				selectTagName1        : '', // 内容标签弹窗选中的标签
				groupData             : {
					label : 'title',
					isLeaf: 'isLeaf',
				},
				keyLength             : 0, // 关键词个数
				tabKey                : 1,  // 1、智能推送 2、内容引擎
				tabListKey            : 1,
				keyWords              : [], // 关键词数据
				keyWordIds            : [], // 关键词id数组
				selectedIds           : [], // 选中的关键词
				attachmentTypes       : [], // 关键词包含的素材类型
				keywordNum            : 0,  // 触发的关键词数量
				isPermission          : false, // 是否开启智能推荐
				firstOpen             : true, // 是否是第一次进入
				getListLoading        : true,
				wxReady               : false,
				showList              : false,
				corpid                : '', // 企业微信的corpid，必须与当前登录的企业一致
				agentid               : this.$route.query.agentId, // 企业微信的应用id
				agentkey              : '',
				url                   : '',
				ticketData            : {},
				agentData             : {},
				uid                   : '',
				userId                : null,
				commonUrl             : this.$store.state.commonUrl,//公共的链接
				activeNames           : ['1'],
				groupName             : '',//获取的分组名称
				group_id              : '',//获取的分组id
				showPicker            : false,//分组弹窗的显示与隐藏
				isRadar               : 0,
				showRadar             : false,
				radarName             : '',
				radarArr              : [
					{
						isRadar  : 0,
						radarName: '雷达状态'
					}, {
						isRadar  : 1,
						radarName: '非雷达'
					}, {
						isRadar  : 2,
						radarName: '雷达'
					}
				],
				inputValue            : '',//搜索框内容
				resultId              : '',//搜索框搜索的素材id
				groupArr              : [],//分组
				active                : 0,//Tab类型,序列号
				tabType               : 6,//Tab类型,6文本，1图片，3视频，5文件，4图文h5
				page                  : 1,//页数
				pageSize              : 15,//每页默认20条
				count                 : '',//所有素材总数量
				keys                  : '',
				//文本
				textLoading           : false,
				textFinished          : false,
				textList              : [],
				textPicker            : false,//预览长文本弹窗的显示与隐藏
				textIndex             : 0,//选中的文本的序列号
				isTextLoading         : false,//文本下拉刷新的Loading
				//图片
				isPicLoading          : false,//图片下拉刷新的Loading
				images                : [],//预览时图片数组
				picList               : [],
				picLoading            : false,//图片的加载组件
				noMorePic             : false,//图片没有更多的显示与隐藏
				height                : {
					height: ''
				},//图片的高度
				index                 : 0,//预览图片的起始位置
				show                  : false,//预览图片的显示与隐藏
				touchStartX           : 0,
				touchStartY           : 0,
				//视频
				isVideoLoading        : false,//视频下拉刷新的Loading
				videoList             : [],
				videoLoading          : false,//视频的加载组件
				videoFinished         : false,
				//文件
				isFileLoading         : false,//文件下拉刷新的Loading
				fileList              : [],
				fileLoading           : false,//文件的加载组件
				fileFinished          : false,
				//h5
				ishFiveLoading        : false,//h5下拉刷新的Loading
				hFiveList             : [],
				hFiveLoading          : false,//h5的加载组件
				noMorehFive           : false,//图片没有更多的显示与隐藏
				//小程序
				isAppletLoading       : false,
				appletList            : [],
				appletLoading         : [],
				appletFinished        : false,
				chooseMsgArr          : '',//发送的素材id数组
				chooseMsgArray        : {},//发送的素材数组
				chooseMsgH5OrFileArr  : [],
				chooseMsgH5OrFileArray: [],
				allSelectValue        : [],
				selectFlag            : false,
				attach_id             : '',//查询所有数据中是否包含该条
				hFiveurl              : '',//图文预览链接地址
				showH5Preview         : false,//图文预览iframe的显示与隐藏
				showWebview           : false, // 是否显示webview
				previewTitle          : '',   // 预览NavBar标题
				videourl              : '',//视频预览链接地址
				showVideoPreview      : false,//图文预览iframe的显示与隐藏
				previewId             : '',//预览的id
				previewItem           : {},//预览的item
				is_show_copyright     : localStorage.getItem('is_show_copyright'),//是否展示底部版權
				selectedText          : {},//选中的图文
				context               : '',//编辑的内容
				contextLength         : 0,
				localMaxLen           : 1000,
				maxLen                : 1000
			};
		},
		methods   : {
			descInput (e) {
				let userPlatform = localStorage.getItem('userPlatform');

				let finalValue // 去除空格和表情的文本
				let finalLength //去除空格和表情的文本长度

				//去除标签
				let regExpFirst = new RegExp(/<[^.]*?>/g)
				let formatValue = e.target.value.replace(regExpFirst, '')
				let formatValueLength = formatValue.length
				console.log("formatValueLength: " + formatValueLength)

				//判断换行
				let regExpSecond = new RegExp(/[\n|\r]/g)
				let removeEnterValue = formatValue.replace(regExpSecond, '')
				let removeEnterLength = removeEnterValue.length
				console.log("removeEnterValueLength: " + removeEnterLength)

				//换行的个数
				let enterNum = formatValueLength - removeEnterLength
				console.log('enterNum', enterNum)

				//判断表情
				let regExpThird = new RegExp(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g)
				let removeEmojValue = formatValue.replace(regExpThird, '')
				let removeEmojLength = removeEmojValue.length
				console.log("removeEmojLength: " + removeEmojLength)

				//表情个数
				let emojNum = (formatValueLength - removeEmojLength) / 2
				console.log('emojNum', emojNum)

				// 去除空格和表情之后的值
				finalValue = removeEnterValue.replace(regExpSecond, '')
				finalLength = finalValue.length

				if (userPlatform && userPlatform.toLowerCase() === 'ios') {
					finalLength = enterNum * 2 + finalLength - emojNum
				} else {
					finalLength = enterNum * 1 + finalLength
				}

				console.log('finalLength', finalLength)

				this.context = formatValue
				this.contextLength = finalLength

				this.maxLen = finalLength + (this.localMaxLen - formatValueLength)
			},


			computedLen (str) {
				var repOne = /[0-9a-zA-Z|\s]/  // 字母数字
				var repSpace = /[\s]/
				var repEnter = /[\&]/  //  & 符号
				// 用& 代替 换行符
				str = str.replace(/[\r\n]/g, '&')
				var maxLen = 1000
				var strAttr = str.split('')
				var len = 0
				// 删除退格 为空时返回
				if (strAttr.length == 0) {
					return {
						len   : len,
						maxLen: maxLen
					}
				} else {
					strAttr.forEach(function (val, key) {
						// 字母数字空格
						if (repOne.test(val)) {
							len += 1
						} else if (repEnter.test(val)) {
							len += 1
							maxLen++ // 最多输入增加 1个中文
						} else {
							// 中文或者语言其他符号
							len++ // 占位 1个中文
						}
					})
				}
				return {
					textareaLen: Math.ceil(len), // 已输入字符
					maxLen     : Math.ceil(maxLen), // 向上取 textarea最大字符
				}
			},

			getPageData () {
				this.getGroupList()
				this.getKeyWordList()
			},
			changeTabKey (key) {
				if (key != this.tabKey) {
					this.initData()
					this.tabKey = key
					if (this.tabKey == 1) {
						this.getKeyWordList()
					} else {
						this.tabType = 6
						this.getList()
					}
					this.chooseMsgArr = ''
					this.chooseMsgArray = {}
					this.chooseMsgH5OrFileArr = []
					this.chooseMsgH5OrFileArray = []
					this.allSelectValue = []
				}
			},
			h5Preview (url, item) {
				// if (this.chooseMsgArr != item.id) {
				// 	this.chooseMsg(item)
				// }
				this.previewTitle = item.file_name
				this.hFiveurl = url
				this.showWebview = true
				this.showH5Preview = true

				this.previewId = item.id
				this.previewItem = item
			},
			webViewCancel () {
				this.initPage(this.resetWebView)
			},
			resetWebView () {
				this.showH5Preview = false
				this.showVideoPreview = false
				this.showWebview = false
				this.previewId = ''
				this.previewItem = {}
			},
			videoPreview (url, item) {
				// if (this.chooseMsgArr != item.id) {
				// 	this.chooseMsg(item)
				// }
				this.previewTitle = item.file_name
				this.videourl = url
				this.showWebview = true
				this.showVideoPreview = true

				this.previewId = item.id
				this.previewItem = item
			},
			focusSearch () {
				uni.reLaunch({
					url: "/pages/slider/searchFocus?agentId=" + (this.$route.query.agentId || '')
				})
			},
			handleNodeClick (obj) {
				this.selectTagId1 = obj.key
				this.selectTagName1 = obj.label
			},
			async loadNode (node, resolve) {
				const {data: res} = await this.axios.post("work-attachment-tag/get-group-list", {
					uid      : localStorage.getItem('uid'),
					corp_id  : localStorage.getItem('corpid'),
					parent_id: node.key || '',
					tag      : 1,
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					if (node.level == 0) {
						res.data.data.unshift({
							id    : '',
							title : '所有标签',
							isLeaf: true
						})
					}
					setTimeout(() => {
						resolve(res.data.data);
					}, 500);
				}
			},
			selectTag () {
				this.selectTagId1 = this.selectTagId
				this.selectTagName1 = this.selectTagName
				this.$refs['selectTag'].open()
			},
			cancelSelectTag () {
				this.$refs['selectTag'].close()
				this.selectTagId1 = ''
				this.selectTagName1 = ''
			},
			addTag () {
				this.selectTagId = this.selectTagId1
				this.selectTagName = this.selectTagName1
				this.$refs['selectTag'].close()
				this.page = 1
				this.getList()
				this.selectTagId1 = ''
				this.selectTagName1 = ''
			},
			searchCancel () {
				this.inputValue = ''
				// this.active = 0
				// this.tabType = 6
				this.$store.commit("setInputValue", this.inputValue);
				this.getList()
				// location.replace(location.href.replace(location.search, ""));
			},
			initData () {
				this.page = 1
				this.textList = []
				this.picList = []
				this.videoList = []
				this.fileList = []
				this.hFiveList = []
				this.appletList = []

				this.textFinished = false
				this.fileFinished = false
				this.videoFinished = false
				this.noMorePic = false
				this.noMorehFive = false
				this.appletFinished = false

				this.isTextLoading = false
				this.ishFiveLoading = false
				this.isFileLoading = false
				this.isPicLoading = false
				this.isVideoLoading = false
				this.isAppletLoading = false

				this.textLoading = true
				this.hFiveLoading = true
				this.fileLoading = true
				this.picLoading = true
				this.videoLoading = true
				this.appletLoading = false

			},
			//切换标签页
			changeTab (val) {
				if (!this.wxReady) {
					return false
				}
				if (this.getListLoading) {
					source.cancel()
				}
				//6文本，1图片，3视频，5文件，4图文h5
				// if (val == 0) {
				// 	this.textLoading = true
				// 	this.tabType = 6
				// } else if (val == 1) {
				// 	this.hFiveLoading = true
				// 	this.tabType = 4
				// } else if (val == 2) {
				// 	this.fileLoading = true
				// 	this.tabType = 5
				// } else if (val == 3) {
				// 	this.tabType = 1
				// } else if (val == 4) {
				// 	this.videoLoading = true
				// 	this.tabType = 3
				// }
				this.tabType = val
				this.chooseMsgArr = ''
				this.chooseMsgArray = {}
				this.chooseMsgH5OrFileArr = []
				this.chooseMsgH5OrFileArray = []
				this.allSelectValue = []
				this.selectFlag = false
				this.initData()
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				if (this.tabType == 1) {
					this.getList()
				} else if (this.tabType == 5 || this.tabType == 4 || this.tabType == 3 || this.tabType == 6 || this.tabType == 7) {
					this.loadingItem()
				}
			},
			// 获取分组
			async getGroupList () {
				const {data: res} = await this.axios.post("chat-message/group", {
					uid: this.uid
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.groupArr = res.data.group;
					let g = {
						key         : "",
						value       : "0",
						parent_id   : null,
						title       : "所有分组",
						sort        : 0,
						is_not_group: 0,
						scopedSlots : {
							title: "custom"
						},
						children    : []
					}
					this.groupArr.splice(0, 0, g)
				}
			},
			selectRadar (isRadar, radarName) {
				if (isRadar == 0) {
					this.isRadar = ''
					this.radarName = ''
				} else {
					this.isRadar = isRadar
					this.radarName = radarName
				}

			},
			handlerOkRadar () {
				this.$store.commit("setIsRadar", this.isRadar);
				this.$store.commit("setRadarName", this.radarName);
				this.isRadar = this.$store.state.isRadar
				this.radarName = this.$store.state.radarName
				this.showRadar = false
				this.textFinished = false
				this.fileFinished = false
				this.videoFinished = false
				this.noMorePic = false
				this.noMorehFive = false
				this.page = 1
				this.getList()
			},
			//分组下的确定、取消
			handlerOk () {
				this.group_id = this.$store.state.group_id
				this.groupName = this.$store.state.groupName
				this.showPicker = false
				this.textFinished = false
				this.fileFinished = false
				this.videoFinished = false
				this.noMorePic = false
				this.noMorehFive = false
				this.page = 1
				this.getList()
			},
			handlerCancleRadar () {
				this.isRadar = this.$store.state.isRadar
				this.radarName = this.$store.state.radarName
				this.showRadar = false
			},
			handlerCancle () {
				this.$store.commit("setGroupId", this.group_id);
				this.$store.commit("setGroupName", this.groupName);
				this.showPicker = false
			},
			clearRadar () {
				this.isRadar = ''
				this.radarName = ''
			},
			clearGroup () {
				this.$store.commit("setGroupId", '');
				this.$store.commit("setGroupName", '');
			},
			lookKeyWord () {
				this.selectedIds = JSON.parse(JSON.stringify(this.keyWordIds))
				this.$refs.keyword.open()
			},
			selectKeywordId (id) {
				let index = this.includeId(this.selectedIds, id)
				if (index > -1) {
					this.selectedIds.splice(index, 1)
				} else {
					this.selectedIds.push(id)
				}
			},
			cancelSelectId () {
				this.$refs.keyword.close()
				this.selectedIds = []
			},
			handleSelectId () {
				if (this.selectedIds.length == 0) {
					Toast.clear()
					Toast.fail('请先选择关键词')
					return false
				}
				this.keyWordIds = JSON.parse(JSON.stringify(this.selectedIds))
				this.page = 1
				this.tabType = ''
				this.getList()
				this.$refs.keyword.close()
				this.selectedIds = []
			},
			refreshKeyword () {
				uni.showLoading({
					title   : '加载中...',
					duration: 2000
				});
				this.tabType = ''
				this.page = 1
				this.getKeyWordList()
			},
			openQuestion () {
				this.$refs.question.open()
			},
			closeQuestion () {
				this.$refs.question.close()
			},
			// 获取关键词
			async getKeyWordList () {
				let that = this
				that.keywordNum = 0
				that.getListLoading = true
				const {data: res} = await that.axios.post("work-msg-keyword-attachment/custom-keyword-list", {
					corp_id        : localStorage.getItem('corpid'),
					external_userid: localStorage.getItem('externalId'),
					userid         : localStorage.getItem('user_id'),
				});
				if (res.error != 0) {
					that.getListLoading = false
					uni.showToast({
						title   : res.error_msg,
						image   : '/static/fail.png',
						duration: 2000
					});
				} else {
					that.isPermission = res.data.isPermission == 1 ? true : false
					if (!that.isPermission || that.tabKey == 2) {
						that.tabKey = 2
						that.tabType = 6
						that.getList()
					} else {
						that.keyWords = res.data.list
						that.keyWordIds = []
						for (let i = 0; i < that.keyWords.length; i++) {
							that.keyWordIds.push(that.keyWords[i].keyword_user_id)
						}
						that.keyLength = that.keyWordIds.length
						if (that.keyWordIds.length > 0) {
							that.tabType = ''
							that.getList()
						} else {
							if (that.firstOpen) {
								that.firstOpen = false
								that.tabKey = 2
								that.tabType = 6
								that.getList()
							}
							that.getListLoading = false
						}
					}
				}
			},
			//获取素材列表
			async getList () {
				let that = this
				let url = ''
				let params = {}
				if (that.tabKey == 1) {
					url = 'work-msg-keyword-attachment/keyword-attachment-list'
					params = {
						corp_id        : localStorage.getItem('corpid'),
						userid         : localStorage.getItem('user_id'),
						keyword_user_id: that.keyWordIds,
						tag_ids        : that.selectTagId,
						file_type      : that.tabType,
						page           : that.page,
						pageSize       : that.pageSize,
					}
				} else {
					url = "chat-message/list"
					params = {
						uid      : that.uid,
						file_type: that.tabType,
						name     : that.inputValue,
						tag_ids  : that.selectTagId,
						group_id : that.group_id,
						id       : that.resultId,
						page     : that.page,
						pageSize : that.pageSize,
						attach_id: that.attach_id,//查询所有数据中是否包含该条
						is_radar : that.isRadar,
					}
				}
				that.getListLoading = true
				const {data: res} = await that.axios.post(url, params, {cancelToken: source.token});
				that.getListLoading = false
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					uni.hideLoading()
					that.keys = []
					that.count = parseInt(res.data.count)
					that.is_show_copyright = localStorage.getItem('is_show_copyright')
					if (that.getListLoading) {
						that.textList = []
						that.picList = []
						that.videoList = []
						that.fileList = []
						that.hFiveList = []
					}
					that.tabType = parseInt(res.data.file_type)
					if (that.tabKey == 1) {
						that.attachmentTypes = res.data.attachment_type
					} else if (that.tabKey == 2) {
						that.$nextTick(function () {
							window.document.getElementsByClassName("van-tabs")[0].addEventListener('scroll', that.handleScroll);
						})
					}
					for (let i = 0; i < res.data.attachment.length; i++) {
						if (res.data.attachment[i].file_type != that.tabType) {
							res.data.attachment.splice(i, 1)
						}
					}
					if (that.tabType == 6) {
						//文本
						if (that.page == 1) {
							that.textList = res.data.attachment
						} else {
							that.textList = that.textList.concat(res.data.attachment)
						}
						that.isTextLoading = false
						// 加载状态结束
						that.textLoading = false
						for (let i = 0; i < that.textList.length; i++) {
							if (that.textList[i].content) {
								that.textList[i].content = that.textList[i].content.replace('\n', '<br>')
							}
						}
						if (that.textList.length >= that.count || that.textList.length == 0) {
							// 数据全部加载完成
							that.textFinished = true;
						}
						if (that.chooseMsgArray != "{}" && that.chooseMsgArray.file_type == 6 && res.data.is_have == 1) {
							for (let x = 0; x < that.textList.length; x++) {
								if (that.chooseMsgArr == that.textList[x].id) {
									that.textList.splice(x, 1)
								}
							}
							that.textList.unshift(that.chooseMsgArray)
						}
					} else if (that.tabType == 1) {
						//图片
						that.keys = res.data.keys
						if (that.page == 1) {
							that.picList = res.data.attachment
						} else {
							that.picList = that.picList.concat(res.data.attachment)
						}
						that.images = []
						that.picLoading = false
						that.isPicLoading = false
						if (that.picList.length == 0) {
							that.noMorePic = true
						} else {
							for (let i = 0; i < that.picList.length; i++) {
								that.images.push(that.commonUrl + that.picList[i].local_path)
							}
						}

						// for(let j=0;j<that.chooseMsgArr.length;j++){
						// 	for(let x=0;x<that.picList.length;x++){
						// 		if(that.chooseMsgArr[j] == that.picList[x].id){
						// 			that.picList.unshift(that.picList[x])
						// 			that.picList.splice(x+1,1)
						// 		}
						// 	}
						// }
						if (that.chooseMsgH5OrFileArray.length > 0 && that.chooseMsgArray.file_type == 1 && res.data.is_have == 1) {
							for (let x = 0; x < that.picList.length; x++) {
								for (let choose of that.chooseMsgH5OrFileArray) {
									if (choose == that.picList[x].id) {
										that.picList.splice(x, 1)
									}
								}
							}
							that.picList.unshift(that.chooseMsgArray)
						}
						//动态让图片高度等于宽度
						let width = (window.innerWidth - 46) / 3
						that.height.height = parseInt(width) + 'px'
					} else if (that.tabType == 3) {
						//视频
						that.keys = res.data.keys
						if (that.page == 1) {
							that.videoList = res.data.attachment
						} else {
							that.videoList = that.videoList.concat(res.data.attachment)
						}
						that.isVideoLoading = false
						// 加载状态结束
						that.videoLoading = false
						if (that.videoList.length >= that.count) {
							// 数据全部加载完成
							that.videoFinished = true;
						}
						if (that.chooseMsgArray != "{}" && that.chooseMsgArray.file_type == 3 && res.data.is_have == 1) {
							for (let x = 0; x < that.videoList.length; x++) {
								if (that.chooseMsgArr == that.videoList[x].id) {
									that.videoList.splice(x, 1)
								}
							}
							that.videoList.unshift(that.chooseMsgArray)
						}

					} else if (that.tabType == 5) {
						//文件
						// 加载状态结束
						that.keys = res.data.keys
						if (that.includeArray(that.chooseMsgH5OrFileArr, that.keys)) {
							that.allSelectValue = ['1']
						} else {
							that.allSelectValue = []
						}
						let chooseMsgH5OrFileArray = JSON.parse(JSON.stringify(that.chooseMsgH5OrFileArray)) || []
						for (let i = res.data.is_have.length - 1; i >= 0; i--) {
							if (res.data.is_have[i] == 0) {
								chooseMsgH5OrFileArray.splice(i, 1)
							}
						}
						if (chooseMsgH5OrFileArray.length != 0 && chooseMsgH5OrFileArray[0].file_type == 5) {
							for (let x = 0; x < res.data.attachment.length; x++) {
								for (let j = 0; j < chooseMsgH5OrFileArray.length; j++) {
									if (chooseMsgH5OrFileArray[j].id == res.data.attachment[x].id) {
										res.data.attachment.splice(x, 1)
									}
								}
							}
						}
						if (that.page == 1) {
							if (chooseMsgH5OrFileArray.length != 0 && chooseMsgH5OrFileArray[0].file_type == 5) {
								that.fileList = chooseMsgH5OrFileArray.concat(res.data.attachment)
							} else {
								that.fileList = res.data.attachment
							}
						} else {
							that.fileList = that.fileList.concat(res.data.attachment)
						}
						// 数据全部加载完成
						if (that.fileList.length >= that.count) {
							that.fileFinished = true
							that.fileLoading = false
							that.isFileLoading = false
							that.getListLoading = false
							that.tabListKey++
							that.$nextTick(function () {
								window.document.getElementsByClassName("van-tabs")[0].addEventListener('scroll', that.handleScroll);
							})
							return false
						}
						if (res.data.attachment.length == 0) {
							that.page++
							let a = that.count / that.pageSize
							let b = ''
							if (that.count % that.pageSize !== 0) {
								b = parseInt(a) + 1
							} else {
								b = a
							}
							if (that.page <= b) {
								that.getList()
							} else {
								that.page--
							}
						}
						that.isFileLoading = false
						that.fileLoading = false

					} else if (that.tabType == 4) {
						// 图文
						that.keys = res.data.keys
						if (that.includeArray(that.chooseMsgH5OrFileArr, that.keys)) {
							that.allSelectValue = ['1']
						} else {
							that.allSelectValue = []
						}
						let chooseMsgFileArray = JSON.parse(JSON.stringify(that.chooseMsgH5OrFileArray))
						for (let i = res.data.is_have.length - 1; i >= 0; i--) {
							if (res.data.is_have[i] == 0) {
								chooseMsgFileArray.splice(i, 1)
							}
						}
						if (chooseMsgFileArray.length != 0 && chooseMsgFileArray[0].file_type == 4) {
							for (let x = 0; x < res.data.attachment.length; x++) {
								for (let j = 0; j < chooseMsgFileArray.length; j++) {
									if (chooseMsgFileArray[j].id == res.data.attachment[x].id) {
										res.data.attachment.splice(x, 1)
									}
								}
							}
						}
						if (that.page == 1) {
							if (chooseMsgFileArray.length != 0 && chooseMsgFileArray[0].file_type == 4) {
								that.hFiveList = chooseMsgFileArray.concat(res.data.attachment)
							} else {
								that.hFiveList = res.data.attachment
							}
						} else {
							that.hFiveList = that.hFiveList.concat(res.data.attachment)
						}
						// 数据全部加载完成
						if (that.hFiveList.length >= that.count) {
							that.hFiveLoading = false
							that.ishFiveLoading = false
							that.noMorehFive = true
							that.getListLoading = false
							that.tabListKey++
							that.$nextTick(function () {
								window.document.getElementsByClassName("van-tabs")[0].addEventListener('scroll', that.handleScroll);
							})
							return false
						}
						if (res.data.attachment.length == 0) {
							that.page++
							let a = that.count / that.pageSize
							let b = ''
							if (that.count % that.pageSize !== 0) {
								b = parseInt(a) + 1
							} else {
								b = a
							}
							if (that.page <= b) {
								that.getList()
							} else {
								that.page--
							}
						} else {
							that.hFiveLoading = false
							that.ishFiveLoading = false
						}
					} else if (that.tabType == 7) {
						if (that.page == 1) {
							that.appletList = res.data.attachment
						} else {
							that.appletList = that.appletList.concat(res.data.attachment)
						}
						that.isAppletLoading = false
						// 加载状态结束
						that.appletLoading = false
						if (that.appletList.length >= that.count || that.appletList.length == 0) {
							// 数据全部加载完成
							that.appletFinished = true;
						}
						if (that.chooseMsgArray != "{}" && that.chooseMsgArray.file_type == 7 && res.data.is_have == 1) {
							for (let x = 0; x < that.appletList.length; x++) {
								if (that.chooseMsgArr == that.appletList[x].id) {
									that.appletList.splice(x, 1)
								}
							}
							that.appletList.unshift(that.chooseMsgArray)
						}
					}
					that.getListLoading = false
					that.tabListKey++
					that.$nextTick(function () {
						window.document.getElementsByClassName("van-tabs")[0].addEventListener('scroll', that.handleScroll);
					})
				}
			},

			//文本的下拉刷新
			onRefresh () {
				this.initData()
				this.getList()
			},
			//预览长文本
			showTextPicker (index, item) {
				this.textPicker = true
				this.textIndex = index

				if (this.chooseMsgArr != item.id) {
					this.chooseMsg(item)
				}
			},
			textPickerCancle () {
				this.textPicker = false
				this.previewId = ''
				this.previewItem = {}
			},
			touchMove (e) {
				let currentX = e.changedTouches[0].pageX
				let currentY = e.changedTouches[0].pageY

				// window.event.target.style.marginLeft = (currentX - this.touchStartX) + 'px'
				// window.event.target.style.marginTop = (currentY - this.touchStartY) + 'px'
			},
			touchStart (e) {
				this.touchStartX = e.changedTouches[0].pageX
				this.touchStartY = e.changedTouches[0].pageY
			},
			touchEnd (e) {
				let currentY = e.changedTouches[0].pageY

				if (Math.abs(currentY) - Math.abs(this.touchStartY) > 100) {
					this.show = false
				} else {
					// window.event.target.style.marginLeft = 0
					// window.event.target.style.marginTop = 0
				}
			},
			closePreview () {
				this.show = false
				this.previewId = ''
				this.previewItem = {}
			},
			//预览图片
			previewPic (index, item) {
				this.index = String(index)
				this.show = true

				// this.chooseMsgArr = item.id
				// this.chooseMsgArray = item
				this.attach_id = item.id
				// this.$store.commit("setChooseMsgArr", this.chooseMsgArr);
				// this.$store.commit("setChooseMsgArray", this.chooseMsgArray);

				this.previewId = item.id
				this.previewItem = item
			},
			//选择发送素材
			chooseMsg (item) {
				// window.console.log(this.chooseMsgArray,888)
				// if(this.chooseMsgArr.length < 5){
				// 	//indexOf未找到返回-1，找到返回序列号
				// 	if(this.chooseMsgArr.indexOf(item.id) == -1){
				// 		this.chooseMsgArr.push(item.id)
				// 		this.chooseMsgArray.push(item)
				// 	}else {
				// 		let index = this.chooseMsgArr.indexOf(item.id)
				// 		this.chooseMsgArr.splice(index,1)
				// 		this.chooseMsgArray.splice(index,1)
				// 	}
				// }else {
				// 	if(this.chooseMsgArr.indexOf(item.id) == -1){
				// 		Toast.fail('一次最多发送5条素材');
				// 	}else {
				// 		let index = this.chooseMsgArr.indexOf(item.id)
				// 		this.chooseMsgArr.splice(index,1)
				// 		this.chooseMsgArray.splice(index,1)
				// 	}
				// }
				// localStorage.setItem('chooseMsgArr',this.chooseMsgArr)
				// localStorage.setItem('chooseMsgArray',JSON.stringify(this.chooseMsgArray))
				//6文本，1图片，3视频，5文件，4图文h5
				if (this.tabType != 6 && this.tabType != 7) {
					if (this.chooseMsgH5OrFileArr.length > 0) {
						if (this.$store.state.chooseMsgType != this.tabType) {
							this.chooseMsgH5OrFileArr = []
							this.chooseMsgH5OrFileArray = []
						}
					}
					let index = this.includeId(this.chooseMsgH5OrFileArr, item.id)
					if (index == -1) {
						this.chooseMsgH5OrFileArr.push(item.id)
						if (!this.selectFlag) {
							this.chooseMsgH5OrFileArray.push(item)
						}
					} else {
						if (this.chooseMsgH5OrFileArr.length - 1 >= index) {
							this.chooseMsgH5OrFileArr.splice(index, 1)
							if (!this.selectFlag) {
								this.chooseMsgH5OrFileArray.splice(index, 1)
							}
						}
					}
					if (this.includeArray(this.chooseMsgH5OrFileArr, this.keys)) {
						this.allSelectValue = ['1']
					} else {
						this.allSelectValue = []
					}
					this.attach_id = this.chooseMsgH5OrFileArr
					this.chooseMsgArr = ''
					this.chooseMsgArray = {}
					this.$store.commit("setChooseMsgH5OrFileArr", this.chooseMsgH5OrFileArr);
					this.$store.commit("setChooseMsgH5OrFileArray", this.chooseMsgH5OrFileArray);
					this.$store.commit("setChooseMsgArr", '');
					this.$store.commit("setChooseMsgArray", {});
					this.$store.commit("setChooseMsgType", this.tabType)
				} else {
					if (this.chooseMsgArr == item.id) {
						this.chooseMsgArr = ''
						this.chooseMsgArray = {}
					} else {
						this.chooseMsgArr = item.id
						this.chooseMsgArray = item
					}
					this.chooseMsgH5OrFileArr = []
					this.chooseMsgH5OrFileArray = []
					this.attach_id = this.chooseMsgArr
					this.$store.commit("setChooseMsgH5OrFileArr", []);
					this.$store.commit("setChooseMsgH5OrFileArray", []);
					this.$store.commit("setChooseMsgArr", this.chooseMsgArr);
					this.$store.commit("setChooseMsgArray", this.chooseMsgArray);
				}
			},
			changeAllSelect (e) {
				if (this.chooseMsgH5OrFileArr.length > 0) {
					if (this.$store.state.chooseMsgType != this.tabType) {
						this.chooseMsgH5OrFileArr = []
						this.chooseMsgH5OrFileArray = []
					}
				}
				this.allSelectValue = e.detail.value
				if (e.detail.value.length > 0) {
					this.chooseMsgH5OrFileArray = []
					for (let key of this.keys) {
						if (this.includeId(this.chooseMsgH5OrFileArr, key) == -1) {
							this.chooseMsgH5OrFileArr.push(key)
						}
					}
					this.selectFlag = true
				} else {
					this.chooseMsgH5OrFileArray = []
					this.chooseMsgH5OrFileArr = []
					this.selectFlag = false
				}
				this.$store.commit("setChooseMsgType", this.tabType)
				this.$store.commit("setChooseMsgH5OrFileArr", this.chooseMsgH5OrFileArr);
				this.$store.commit("setChooseMsgH5OrFileArray", this.chooseMsgH5OrFileArray);
			},
			//发送
			async sendMsg (value) {
				if (this.tabType == 7) {
					let agent = ''
					navigator.userAgent.replace(/(wxwork\/)[\S]*/g, function ($1) {
						agent = $1.substring(7, 12)
					})
					if (agent < '3.1.0') {
						Toast.fail('企业微信版本过低，请更新版本！')
						return false
					}
				}
				this.show = false
				let chooseMsgArr = ''

				if (value && value == 1) {
					//预览中的发送,除文本
					chooseMsgArr = this.previewId
				} else {
					chooseMsgArr = this.chooseMsgArr
					if (this.tabType != 6 && this.tabType != 7) {
						chooseMsgArr = this.chooseMsgH5OrFileArr
					}
				}
				if (chooseMsgArr == '') {
					Toast.fail('请先选择素材');
				} else {
					Toast.loading({
						forbidClick: true,
						message    : '上传中...',
						duration   : 0
					});

					const {data: res} = await this.axios.post("chat-message/send-data", {
						uid        : this.uid,
						ids        : chooseMsgArr,
						corpid     : this.corpid,
						agent_id   : this.$route.query.agentId,
						user_id    : this.userId,
						external_id: this.$store.state.externalId,
						chat_id    : this.$store.state.chatId
					});
					if (res.error != 0) {
						Toast.fail(res.error_msg);
					} else {
						let that = this
						Toast.clear()
						// for(let x=0;x<res.data.length;x++){
						// 	that.$store.state.wx.invoke('sendChatMessage',res.data[x])
						// }
						that.$store.state.wx.invoke('sendChatMessage', res.data[0], function (res) {
							if (res.err_msg == 'sendChatMessage:ok') {
								//发送成功
								that.textPicker = false
								that.showH5Preview = false
								that.showVideoPreview = false
								that.showWebview = false
								that.show = false
								// that.chooseMsgArr = ''
								// that.chooseMsgArray = {}
								// that.$store.commit("setChooseMsgArr", that.chooseMsgArr);
								// that.$store.commit("setChooseMsgArray", that.chooseMsgArray);

								// that.inputValue = ''
								// that.active = 0
								// that.tabType = 6
								// that.groupName = ''
								// that.group_id = ''
								// that.page = 1
								// that.getList()
							} else {
								console.log(res.err_msg)
								if (res.err_msg.indexOf('not allow to cross corp') > -1) {
									Toast.fail('小程序发送失败，请将其关联到企业微信（企业微信管理后台-应用管理-小程序-关联小程序）。')
								}
							}
						})
					}
				}
			},


			//编辑文本
			async editMsg () {
				this.show = false
				let chooseMsgArr = ''
				chooseMsgArr = this.chooseMsgArr

				if (chooseMsgArr == '') {
					Toast.fail('请先选择素材');
				} else {
					Toast.loading({
						forbidClick: true,
						message    : '上传中...',
						duration   : 0
					});
					const {data: res} = await this.axios.post("chat-message/send-data", {
						uid        : this.uid,
						ids        : chooseMsgArr,
						corpid     : this.corpid,
						agent_id   : this.$route.query.agentId,
						user_id    : this.userId,
						external_id: this.$store.state.externalId,
						chat_id    : this.$store.state.chatId
					});
					if (res.error != 0) {
						Toast.fail(res.error_msg);
					} else {
						let that = this
						Toast.clear()
						this.selectedText = res.data[0]
						this.context = res.data[0].text.content
						this.contextLength = this.context.length
						this.$refs.editText.open()
					}
				}
			},

			cancelEdit () {
				this.$refs.editText.close()
			},
			confirmEdit () {
				if (this.context.trim() == "") {
					Toast.fail('发送内容不可为空');
					this.context = ''
					return
				}
				this.selectedText.text.content = this.context
				let that = this
				that.$store.state.wx.invoke('sendChatMessage', this.selectedText, function (res) {
					if (res.err_msg == 'sendChatMessage:ok') {
						//发送成功
						that.$refs.editText.close()
						that.textPicker = false
						that.showH5Preview = false
						that.showVideoPreview = false
						that.showWebview = false
						that.show = false
					} else {
						if (res.err_msg.indexOf('not allow to cross corp')) {
							Toast.fail('小程序发送失败，请将其关联到企业微信（企业微信管理后台-应用管理-小程序-关联小程序）。')
						}
					}
				})
			},
			//监听页面滑动，要不要加载
			handleScroll () {
				//变量scrollTop是滚动条滚动时，距离顶部的距离
				var scrollTop = document.getElementsByClassName("van-tabs")[0].scrollTop;
				//变量windowHeight是可视区的高度
				var windowHeight = document.getElementsByClassName("van-tabs")[0].clientHeight;
				//变量scrollHeight是滚动条的总高度
				var scrollHeight = document.getElementsByClassName("van-tabs")[0].scrollHeight;
				//滚动条到底部的条件
				if (scrollTop + windowHeight == scrollHeight) {
					// window.console.log('触发啦')
					if (this.tabType == 1) {
						this.picLoading = true
						if (this.picList.length < this.count) {
							this.page++
							let a = this.count / this.pageSize
							let b = ''
							if (this.count % this.pageSize !== 0) {
								b = parseInt(a) + 1
							} else {
								b = a
							}
							if (this.page <= b) {
								this.getList()
							}
						} else {
							this.picLoading = false
							this.noMorePic = true
						}
					}
				}
			},
			loadingItem () {
				if (!this.wxReady) {
					return false
				}
				let a = this.count / this.pageSize
				let b = ''
				if (this.tabType == 6) {
					if (this.textList.length == 0) {
						this.getList()
					} else if (this.textList.length < this.count) {
						this.page = this.page + 1
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						}
					}
				} else if (this.tabType == 3) {
					this.videoLoading = true
					if (this.videoList.length == 0) {
						this.getList()
					} else if (this.videoList.length < this.count) {
						this.page++
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						} else {
							this.videoLoading = false
						}
					}
				} else if (this.tabType == 5) {
					if (this.getListLoading) {
						return false
					}
					this.fileLoading = true
					if (this.fileList.length == 0) {
						this.getList()
					} else if (this.fileList.length < this.count) {
						this.page++
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						} else {
							this.fileLoading = false
						}
					}
				} else if (this.tabType == 4) {
					this.hFiveLoading = true
					this.ishFiveLoading = true
					if (this.hFiveList.length == 0) {
						this.getList()
					} else if (this.hFiveList.length < this.count) {
						this.page++
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						} else {
							this.hFiveLoading = false
							this.ishFiveLoading = false
						}
					}
				} else if (this.tabType == 7) {
					this.appletLoading = true
					this.isAppletLoading = true
					if (this.appletList.length == 0) {
						this.getList()
					} else if (this.appletList.length < this.count) {
						this.page++
						if (this.count % this.pageSize !== 0) {
							b = parseInt(a) + 1
						} else {
							b = a
						}
						if (this.page <= b) {
							this.getList()
						} else {
							this.appletLoading = false
							this.isAppletLoading = false
						}
					}
				}
			},

			//一进入页面请求该方法获取应用的权限
			async limit () {
				this.url = window.location.href
				this.userId = localStorage.getItem('user_id') != null ? localStorage.getItem('user_id') : ''
				let agent_id = this.$route.query.agentId
				localStorage.setItem('agent_id', agent_id)
				const {data: res} = await this.axios.post("chat-message/get-config", {
					url     : this.url,
					agent_id: agent_id
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					let that = this
					that.uid = res.data.uid
					that.corpid = res.data.corpid
					localStorage.setItem('uid', that.uid)
					that.$store.dispatch('setCorpId', that.corpid)
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
						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : res.errMsg
						})
					})

					that.$store.state.wx.ready(function () {
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
			},
			initAgentConfig (that) {
				that.$store.state.wx.agentConfig({
					corpid   : that.agentData.corpid,
					agentid  : that.agentData.agentid,
					timestamp: that.agentData.timestamp,
					nonceStr : that.agentData.nonceStr,
					signature: that.agentData.signature,
					jsApiList: that.agentData.jsApiList,
					success  : function () {
						that.wxReady = true
						// alert('success')
						this.is_show_copyright = localStorage.getItem('is_show_copyright')
						// that.getGroupList()
						// that.getList()
						// 回调
						that.getContext((entry = '') => {
							if (entry == '') {
								Toast.fail({
									forbidClick: true,
									duration   : 0,
									message    : '版本过低请升级'
								})
							}

							if (entry == 'group_chat_tools') {
								that.getChatId(null, () => {
									Toast.fail({
										forbidClick: true,
										duration   : 0,
										message    : '获取群组失败'
									})
								})
								that.tabKey = 2
								that.getGroupList()
								that.getList()
							} else {
								that.getExternalId(that.getPageData)
							}
						}, () => {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : '版本过低请升级'
							})
						})
					},
					fail     : function (res) {
						if (res.errMsg.indexOf('function not exist') > -1) {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : '版本过低请升级'
							})
						} else if (res.errMsg == 'agentConfig:not match any reliable domain.') {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : '可信域名未填写或未验证'
							})
						} else {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : res.errMsg
							})
						}
					}
				})
			},
			includeId (ids, id) {
				if (!ids || ids.length == 0) {
					return -1
				}
				for (let i = 0; i < ids.length; i++) {
					if (id == ids[i]) {
						return i
					}
				}
				return -1
			},
			includeArray (list1, list2) {
				let flag1 = false
				for (let i = 0; i < list2.length; i++) {
					let flag = false
					for (let j = 0; j < list1.length; j++) {
						if (list2[i] == list1[j]) {
							flag = true
						}
					}
					if (!flag) {
						flag1 = false
						return false
					} else {
						flag1 = true
					}
				}
				if (!flag1) {
					return false
				}
				return true
			},
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'keyword' && typeof data.has_keyword != 'undefined' && data.has_keyword && data.userid == localStorage.getItem('user_id') && data.external_userid == localStorage.getItem('externalId')) {
					this.keywordNum += data.keyword_num
					this.keyLength += data.keyword_num
				}
			}
		},
		onShow () {
			uni.showLoading({
				title   : '加载中...',
				duration: 2000
			});
			if (typeof this.$route.query.agentId === 'undefined') {
				location.href = "http://www.wemero.cn/"
			} else {
				this.showList = true
				this.firstOpen = true
				this.tabKey = 1
				if (localStorage.getItem('tabKey')) {
					this.firstOpen = false
					this.tabKey = localStorage.getItem('tabKey')
					localStorage.removeItem('tabKey')
				}
				let chooseMsgArr = this.$store.state.chooseMsgArr
				if (chooseMsgArr) {
					chooseMsgArr = chooseMsgArr.split(',')
					this.chooseMsgArr = chooseMsgArr.map(Number)
				} else {
					this.chooseMsgArr = ''
				}
				let chooseMsgArray = this.$store.state.chooseMsgArray
				if (chooseMsgArray) {
					this.chooseMsgArray = chooseMsgArray
				} else {
					this.chooseMsgArray = {}
				}
				let chooseMsgH5OrFileArr = this.$store.state.chooseMsgH5OrFileArr
				let chooseMsgH5OrFileArray = this.$store.state.chooseMsgH5OrFileArray
				if (chooseMsgH5OrFileArr) {
					this.chooseMsgH5OrFileArr = this.$store.state.chooseMsgH5OrFileArr
					this.chooseMsgH5OrFileArray = this.$store.state.chooseMsgH5OrFileArray
				} else {
					this.chooseMsgH5OrFileArr = []
					this.chooseMsgH5OrFileArray = []
				}
				if (this.tabType != 6) {
					this.attach_id = this.chooseMsgH5OrFileArr
				} else {
					this.attach_id = this.chooseMsgArr
				}
				if (this.$store.state.inputValue != '') {
					this.inputValue = this.$store.state.inputValue
				}
				if (this.$store.state.group_id != '') {
					this.group_id = this.$store.state.group_id
					this.groupName = this.$store.state.groupName
				}
				if (this.$store.state.isRadar != '') {
					this.isRadar = this.$store.state.isRadar
					this.radarName = this.$store.state.radarName
				}
				let _this = this

				_this.$store.dispatch('setWx', () => {
				    _this.initPage(_this.limit)
				})

				// http://localhost/h5/pages/slider/index?agentId=94
				// this.wxReady = true
				// this.uid = 2
				// localStorage.setItem('uid', 2)
				// localStorage.setItem('user_id', '93d12f2b83a0a6796c421d42795d3422')
				// localStorage.setItem('token', 'TWFpblVzZXItYmY0ODllYTdmYmQwNDdiZDM5YzQ1NDY2MWRkY2FmYTM=')
				// localStorage.setItem('corpid', 'ww93caebeee67d134b')
				// localStorage.setItem('externalId', 'wmiWVTDwAALjXswWLs1Q3eJJ18pBm2qA')
				// localStorage.setItem('openid', 'oojmqwKXdJlFMiaW-0vmuIef0cT4')
				// this.getGroupList()
				// this.userId = 'xuyumin'
				// this.corpid = 'ww93caebeee67d134b'
				// this.getKeyWordList()

				if (this.tabKey == 2) {
					this.$nextTick(function () {
						window.document.getElementsByClassName("van-tabs")[0].addEventListener('scroll', _this.handleScroll);
					})
				}
			}
		}
		,

		onLoad () {
			localStorage.setItem('needAgentConfig', 'true')
			// let websocketInterval
			// websocketInterval = setInterval(() => {
			// 	if (this.ws.websocket.readyState == 1) {
			// 		clearInterval(websocketInterval)
			// 		this.ws.websocketSend(
			// 			JSON.stringify({
			// 				channel: "bind",
			// 				info   : {
			// 					session_id: this.global.session_id,
			// 					uid       : localStorage.getItem("uid") != null ? localStorage.getItem("uid") : '',
			// 					subId     : (localStorage.getItem('user_type') == 2 && localStorage.getItem("sub_id") != null) ? localStorage.getItem("sub_id") : '',
			// 					openid    : localStorage.getItem("openid") != null ? localStorage.getItem("openid") : '',
			// 					bindType  : 3,
			// 				}
			// 			})
			// 		)
			// 	}
			// }, 300)
			this.ws.setCallback(this.websocketOnMessage)
		}
		,
		onHide () {
			if (localStorage.getItem('needAgentConfig')) {
				localStorage.removeItem('needAgentConfig')
			}
		}
	}
</script>

<style>
	@import 'vant/lib/index.css'
</style>

<style scoped>
	/*.hello {*/
	/*	background: #F7F8FA;*/
	/*}*/
	/deep/.ly-tree-node>.ly-tree-node__children {
		overflow: unset;
	}
	.tab-btn {
		display: inline-block;
		width: 120px;
		border: 2px solid #EBEDF0;
		background-color: #FFFFFF;
		font-size: 0.8rem /* 15/18.75 */;
		padding: 0.373rem /* 7/18.75 */ 0;
	}

	.active-btn-left {
		border: 2px solid #01B065;
		color: #01B065;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.active-btn-right {
		border: 2px solid #01B065;
		color: #01B065;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.active-btn1 {
		border-right: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.active-btn2 {
		border-left: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	/deep/ uni-button:after {
		border: 0;
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		width: 16px;
		height: 16px;
	}

	/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		color: #FFF;
	}

	.van-tab__pane, .van-tab__pane-wrapper {
		padding: 0 10px;
		border-bottom: 1px solid #F2F2F2;
	}

	.van-cell__title {
		width: 100%;
		text-align: left;
	}

	.van-cell__value {
		flex: 0;
	}

	/deep/ .van-cell {
		margin: 0px;
	}

	/deep/ .van-tabs__content {
		padding-top: 44px;
	}

	/deep/ .van-tabs--line .van-tabs__wrap {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
	}

	.list-text {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: calc(100% - 20px);
		text-align: left;
	}

	.list-text2 {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
		color: #969799;
		font-size: 12px;
		line-height: 18px;
	}

	/deep/ .van-grid-item__content {
		padding: 0;
	}

	.pic-text {
		position: absolute;
		bottom: -25px;
		left: 0;
		right: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		padding: 3px;
		background: #0F0F0F;
		color: #FFF;
		opacity: 0.3;
		line-height: 19px;
	}

	.file-text {
		font-size: 14px;
		width: 100%;
		margin: 5px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tab1-content {
		top: 7.2rem /* 135/18.75 */;
		right: 0;
		bottom: 44px;
		left: 0;
		position: fixed;
		overflow-y: auto;
	}

	.tab2-content {
		top: 8.267rem /* 155/18.75 */;
		right: 0;
		bottom: 44px;
		left: 0;
		position: fixed;
		overflow-y: auto;
	}

	.active {
		border: 2px solid #1989FA;
	}

	.active2 {
		color: #1989FA !important;
	}

	/deep/ .van-grid-item {
		padding-right: 0px !important;
		flex-basis: 30.5233% !important;
		margin-right: 4.21505% !important;
		padding-bottom: 25px;
	}

	/deep/ .van-grid-item:nth-child(3n+3) {
		padding-right: 0 !important;
		flex-basis: 30.5233% !important;
		margin-right: 0px !important;
	}

	.slider-text-label {
		text-align: left;
		word-break: break-word;
		overflow: hidden;
		text-overflow: ellipsis;
		/*text-overflow: -o-ellipsis-lastline;*/
		line-clamp: 2;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.img {
		max-width: 100%;
	}

	.img2 {
		width: 60px;
		height: 33px;
		margin-top: 3px;
	}

	.chooseGroupName {
		font-size: 14px;
		display: inline-block;
		max-width: calc(100% - 64px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-img {
		width: 24px;
		float: left;
	}

	.file-title {
		float: left;
		margin-left: 15px;
		font-size: 16px;
		max-width: calc(100% - 39px);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
	}

	.video-box {
		max-width: 100%;
		height: 0;
		padding-bottom: 100%;
		overflow: hidden;
		border: 1px solid #F2F2F2;
		line-height: 240px;
	}

	.video-img {
		max-width: 100%;
		max-height: 165.5px;
	}

	.video-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 14px;
		padding: 5px;
		background: #0F0F0F;
		color: #FFF;
		opacity: 0.3;
		line-height: 15px;
	}

	.play-video {
		font-size: 40px;
		position: absolute;
		left: 50%;
		margin-left: -20px;
		margin-top: -20px;
		color: #646566;
	}

	.icon-passed {
		position: absolute;
		top: 5px;
		right: 5px;
		font-size: 22px;
		color: #C8C9CC;
	}

	/deep/ .van-image-preview__cover {
		width: 100%;
	}

	.web-back {
		top: 0;
		right: 0;
		left: 0;
		height: 44px;
		z-index: 99;
		position: fixed;
	}

	.web-view {
		top: 44px;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
	}

	/deep/ .uni-navbar__header {
		background: rgba(0, 0, 0, .1) !important;
	}

	/deep/ .uni-navbar__header-container {
		width: calc(100% - 160px);
	}

	.blue-disabled {
		background-color: #8CC4FC;
	}

	.blue {
		background-color: #1989FA;
	}

	.student-lists /deep/ uni-checkbox .uni-checkbox-input {
		background-color: #1989FA;
	}

	.student-lists /deep/ uni-checkbox .uni-checkbox-input, .student-lists /deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border-color: #FFF;
	}

	.student-lists /deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		color: #FFF;
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

	.empty-img {
		width: 38%;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.img-info {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 25% 0;
	}

	.keyword {
		display: inline-block;
		background-color: #FFFFFF;
		border: 1px solid #C3C3C3;
		font-size: 0.64rem /* 12/18.75 */;
		margin: 0 0.267rem 0.267rem 0 /* 5/18.75 */;
		height: 1.28rem /* 24/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
	}

	.keywordActive {
		display: inline-block;
		background-color: #FFFFFF;
		border: 1px solid #01B065;
		color: #01B065;
		font-size: 0.64rem /* 12/18.75 */;
		margin: 0 0.267rem 0.267rem 0 /* 5/18.75 */;
		height: 1.28rem /* 24/18.75 */;
		line-height: 1.28rem /* 24/18.75 */;
	}

	.circle {
		display: inline-block;
		width: 0.373rem /* 7/18.75 */;
		height: 0.373rem /* 7/18.75 */;
		background-color: #FF562D;
		border-radius: 50%;
		float: right;
		margin-right: 0.373rem /* 7/18.75 */;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 0.8rem /* 15/18.75 */;
		width: 100%;
		background-color: #FFF;
		border-radius: 0.213rem /* 4/18.75 */;
		box-sizing: border-box;
	}

	.uni-tip-title {
		margin-bottom: 0.533rem /* 10/18.75 */;
		text-align: center;
		font-weight: bold;
		font-size: 0.853rem /* 16/18.75 */;
		color: #333;
	}

	.uni-tip-content {
		font-size: 0.747rem /* 14/18.75 */;
		color: #666;
	}

	.uni-tip-group-button {
		display: flex;
		flex-direction: row;
	}

	.add-tag-cancal {
		width: calc(50% - 0.267rem /* 5/18.75 */);
		line-height: 2.24rem /* 42/18.75 */;
		border: 0.053rem /* 1/18.75 */ solid #EEEEEE;
		border-radius: 0.267rem /* 5/18.75 */;
		text-align: center;
		margin-right: 0.48rem /* 9/18.75 */;
		font-size: 0.8rem /* 15/18.75 */;
		color: #333;
	}

	.add-tag-ok {
		width: calc(50% - 0.267rem /* 5/18.75 */);
		line-height: 2.24rem /* 42/18.75 */;
		border-radius: 0.267rem /* 5/18.75 */;
		text-align: center;
		background: #01B065;
		font-size: 0.8rem /* 15/18.75 */;
		color: #FFF;
		margin-left: 0.533rem /* 10/18.75 */;
	}

	/deep/ .uni-popup__wrapper-box {
		background: #FFFFFF;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 0.747rem /* 14/18.75 */;
		color: #3B4144;
		text-align: right;
		color: #01B065;
	}

	.applet-cell {
		display: inline-block !important;
		width: 50% !important;
	}

	.text-edit /deep/ .uni-popup__wrapper-box {
		width: 90%;
	}


	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #FFF;
		border-radius: 4px;
		width: 80%;
		margin: auto;
		box-sizing: border-box;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
		height: 2rem;
		line-height: 2rem;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 16px;
		color: #1989FA;
		border: 1px solid #E8E8E8;
		border-collapse: collapse;
		font-weight: 500;
		/*background-color: #1989FA;*/
	}

	.text_container {
		background-color: #FFF;
		width: 80%;
		margin: 10px auto;
		border: 1px solid #E8E8E8;
		padding: 10px;
	}

	.action-btn {
		border-radius: 0.747rem  /* 14/18.75 */;
		margin-left: 2%;
		width: 46%;
		border: none !important;
		position: fixed;
		bottom: 0;
		z-index: 1000;
		background: #FA6D59;
		cursor: pointer;
		color: #FFF !important;
		height: 1.7rem /* 44/18.75 */;
		margin-bottom: 0.2rem;
	}

	/deep/ .ly-tree-node__content.is-current {
		background-color: #FFFFFF;
		color: #01B065;
	}

	.radar-item {
		font-size: 0.747rem  /* 14/18.75 */;
		padding: 0.533rem  /* 10/18.75 */ 0.853rem  /* 16/18.75 */;
		line-height: 1.28rem  /* 24/18.75 */;
		border-top: 1px solid #F7F8F9;
	}

	/deep/ .van-field__control {
		text-align: center;
	}

	.question /deep/ .uni-popup__wrapper-box {
		width: 80%;
	}

	.question .question-content {
		text-align: left;
		font-size: 0.853rem  /* 16/18.75 */;
		text-indent: 2em;
		margin: 0.267rem  /* 5/18.75 */ 0;
	}
	.question .mb-15 {
		margin-bottom: 0.8rem  /* 15/18.75 */;
	}

	.question .uni-tip-group-button {
		width: 4rem  /* 75/18.75 */;
		margin: 0 auto;
		height: 1.6rem  /* 30/18.75 */;
		line-height: 1.6rem  /* 30/18.75 */;
		font-size: 0.8rem  /* 15/18.75 */ !important;
	}
	.question .uni-tip-button {
		font-size: 0.8rem  /* 15/18.75 */;
		border: 1px solid #01B065;
		color: #FFFFFF !important;
		background-color: #01B065;
		border-radius: 0.267rem /* 5/18.75 */;
	}
</style>
