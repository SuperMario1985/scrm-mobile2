<template>
	<view>
		<!--活动已删除的占位符-->
		<img src="../../static/raffle/delete.png" alt="" v-show="status == 0"
		     :style="{paddingTop: imgPaddingTop}"
		     class="delete">
		<view v-if="!isLoading && status == 1" class="content-msg" style="top: 0;">活动未发布，仅供预览</view>
		<view class="view" v-show="!isLoading && status != 0">
			<view style="position: relative;">
				<img src="../../static/redFission/background.png" alt="" style="width: 100%;margin-top: -1px;">
				<view class="hd">
					<view class="time">
						<text class="time-view">{{day || '00'}}</text>
						<text class="question">天</text>
						<text class="time-view">{{hour || '00'}}</text>
						<text class="question">时</text>
						<text class="time-view">{{minutes || '00'}}</text>
						<text class="question">分</text>
						<text class="time-view">{{seconds || '00'}}</text>
						<text class="question">秒</text>
					</view>
					<!--活动已结束-->
					<template v-if="packData.pack_type == -1">
						<img src="../../static/redFission/endBgc.png" alt="" class="redPacket">
						<img src="../../static/redFission/cry.png" alt="" class="cryIcon">
						<view class="end-title">{{packData.pack_tip}}</view>
						<view class="end-money"><span style="font-size: 2.56rem  /* 48/18.75 */;">{{packData.redpack_price}}</span>元
						</view>
					</template>
					<!--正常拆红包-->
					<template v-if="packData.pack_type == 0">
						<img src="../../static/redFission/redPacket.png" alt="" class="redPacket">
						<img src="../../static/redFission/redBtn.png" alt="" class="redBtn" @click="dismantle"
						     v-if="status != 1 && canClick">
						<img src="../../static/redFission/redBtn.png" alt="" class="redBtn" v-if="status == 1 || !canClick">
						<view class="redMoney">
							<text style="font-size: 2.133rem  /* 40/18.75 */;">{{redPacketMoney}}</text>
							<text style="font-size: 0.8rem  /* 15/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;">元
							</text>
						</view>
						<view class="redMoney-text">专享大礼包等你来领取</view>
					</template>
					<!--活动进行中，自己进-->
					<template v-if="packData.pack_type == 1">
						<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
						<view class="awardspop-money" style="top: 21.333rem  /* 400/18.75 */;"><span
								style="font-size: 0.747rem /* 14/18.75 */;">首拆获</span>￥<span
								style="font-size: 2.133rem  /* 40/18.75 */;margin-left: 0.16rem  /* 3/18.75 */;">{{packData.first_amount}}</span>
						</view>
						<view class="awardspop-txt" style="top: 24rem  /* 450/18.75 */;">
							还有{{packData.rest_amount}}元红包正在路上~
						</view>
						<view class="awardspop-txt2" style="top: 26.4rem  /* 495/18.75 */;">
							继续召唤{{packData.rest_num}}位好友拆红包
						</view>
						<view class="awardspop-txt3" style="color: #FE1835;top: 27.733rem  /* 520/18.75 */;">
							拆完后，即可收入囊中
						</view>
						<view class="ing-btn" @click="createPoster">呼唤朋友 拆红包</view>
						<p class="ing-text">在规定的时间内，凑足人数拆领，即裂变成功，余下的裂变红包金额自动入账至您的微信零钱里，若人数不足，则裂变失败，红包不再发放</p>
					</template>
					<!--活动成功，自己进-->
					<template v-if="packData.pack_type == 2">
						<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
						<view class="awardspop-money" style="top: 21.333rem  /* 400/18.75 */;">￥ <span
								style="font-size: 2.133rem  /* 40/18.75 */;margin-left: 0.16rem  /* 3/18.75 */;">{{packData.redpack_price}}</span>
						</view>
						<view class="awardspop-txt" style="top: 24rem  /* 450/18.75 */;">恭喜您！裂变成功</view>
						<view class="awardspop-txt3" style="top: 27.733rem  /* 520/18.75 */;">
							{{packData.redpack_price}}元红包收入囊中
						</view>
						<p class="ing-text"
						   style="line-height: 1.12rem  /* 21/18.75 */;top: 31.733rem  /* 595/18.75 */;">
							在{{packData.end_time}}，红包自动入账至您的微信零钱
							若没有及时到账，请致电联系商家{{contact_phone}}</p>
					</template>
					<!--活动失败，自己进-->
					<template v-if="packData.pack_type == 3">
						<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
						<img src="../../static/redFission/cry.png" alt="" class="cryIcon">
						<view class="awardspop-txt"
						      style="top: 24.907rem  /* 467/18.75 */;font-size: 0.853rem  /* 16/18.75 */;">抱歉！已超时，裂变失败
						</view>
						<view class="awardspop-txt3"
						      style="top: 26.667rem  /* 500/18.75 */;font-size: 0.747rem  /* 14/18.75 */;">
							剩余{{packData.rest_amount}}元红包与您擦肩而过~
						</view>
						<p class="ing-text"
						   style="line-height: 1.12rem  /* 21/18.75 */;top: 31.733rem  /* 595/18.75 */;">
							首拆获得红包{{packData.first_amount}}元，已自动入账至您的微信零钱，若没有及时到账，请致电联系商家{{contact_phone}}</p>
					</template>
					<!--好友进-->
					<template v-if="packData.pack_type == 4">
						<!--进行中,上级未成功未失败，好友未帮拆-->
						<template v-if="packData.friend_type == 0">
							<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
							<view class="awardspop-money" style="top: 21.333rem  /* 400/18.75 */;">￥ <span
									style="font-size: 2.133rem  /* 40/18.75 */;margin-left: 0.16rem  /* 3/18.75 */;">{{packData.redpack_price}}</span>
							</view>
							<view class="awardspop-txt" style="top: 24rem  /* 450/18.75 */;">
								其中{{packData.rest_amount}}元红包正在路上~
							</view>
							<template v-if="packData.is_help != 2">
								<view class="awardspop-txt2" style="top: 26.4rem  /* 495/18.75 */;">
									快帮【{{packData.parent_name}}】拆红包
								</view>
								<view class="awardspop-txt3" style="color: #FE1835;top: 27.733rem  /* 520/18.75 */;">
									你也有机会获得红包
								</view>
							</template>
							<template v-if="packData.is_help == 2">
								<view class="awardspop-txt2" style="top: 26.4rem  /* 495/18.75 */;">
									抱歉，您帮好友支持的次数已达上限
								</view>
								<view class="awardspop-txt3" style="color: #FE1835;top: 27.733rem  /* 520/18.75 */;">
									无法帮助【{{packData.parent_name}}】拆红包
								</view>
							</template>
							<template v-if="packData.is_play == 1 && packData.is_help == 1">
								<a :href="packData.play_url" class="join-btn">我也要参与</a>
								<view class="join-btn2" @click="dismantle">帮TA拆红包</view>
							</template>
							<template v-else-if="packData.is_play == 2 && packData.is_help == 1">
								<a :href="packData.play_url" class="join-btn">进入我的</a>
								<view class="join-btn2" @click="dismantle">帮TA拆红包</view>
							</template>
							<template v-else>
								<a :href="packData.play_url" class="friendPop-btn" style="top: 32rem /* 600/18.75 */;"
								   v-if="packData.is_play == 1">我也要参与</a>
								<a :href="packData.play_url" class="friendPop-btn" style="top: 32rem /* 600/18.75 */;"
								   v-if="packData.is_play == 2">进入我的</a>
								<view class="friendPop-btn" style="top: 32rem /* 600/18.75 */;" @click="dismantle"
								      v-if="packData.is_help == 1">帮TA拆红包
								</view>
							</template>
						</template>
						<!--进行中,上级未成功，好友帮拆成功-->
						<template v-if="packData.friend_type == 1">
							<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
							<view class="awardspop-txt2" style="top: 21.867rem  /* 410/18.75 */;">
								已帮【{{packData.parent_name}}】拆红包
							</view>
							<view class="friendPop-money" style="top: 23.733rem  /* 445/18.75 */;color: #FE1835;">
								你获得￥<span
									style="font-size: 1.6rem  /* 30/18.75 */;">{{packData.amount}}</span>红包奖励
							</view>
							<view class="awardspop-txt3"
							      style="color: #FE1835;top: 26.56rem  /* 498/18.75 */;left: calc(50% - 5.2rem  /* 97.5/18.75 */);width: 10.4rem  /* 195/18.75 */;">
								红包金额已到账您的微信零钱里，请注意查看。您也可以召唤好友拆红包，一起来赚红包哦~
							</view>
							<a :href="packData.play_url" class="awardspop-btn" style="top: 32rem  /* 600/18.75 */;"
							   v-if="packData.is_play == 1">我也要参与</a>
							<a :href="packData.play_url" class="awardspop-btn" style="top: 32rem  /* 600/18.75 */;"
							   v-if="packData.is_play == 2">进入我的</a>
						</template>
						<!--上级成功-->
						<template v-if="packData.friend_type == 2">
							<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
							<view class="awardspop-txt2"
							      style="top: 21.867rem  /* 410/18.75 */;left: calc(50% - 5.2rem  /* 97.5/18.75 */);width: 10.4rem  /* 195/18.75 */;">
								您的好友【{{packData.parent_name}}】，已裂变成功，获得<span style="font-size: 1.6rem  /* 30/18.75 */;">{{packData.redpack_price}}</span>元红包
							</view>
							<view class="awardspop-txt3"
							      style="color: #FE1835;top: 26.933rem  /* 505/18.75 */;left: calc(50% - 5.2rem  /* 97.5/18.75 */);width: 10.4rem  /* 195/18.75 */;"
							      v-if="packData.is_play == 1">点击下方“我也要参与”召唤好友拆红包，一起来赚红包哦~
							</view>
							<a :href="packData.play_url" class="awardspop-btn" style="top: 32rem  /* 600/18.75 */;"
							   v-if="packData.is_play == 1">我也要参与</a>
							<a :href="packData.play_url" class="awardspop-btn" style="top: 32rem  /* 600/18.75 */;"
							   v-if="packData.is_play == 2">进入我的</a>
						</template>
						<!--上级失败-->
						<template v-if="packData.friend_type == 3">
							<img src="../../static/redFission/ingBgc.png" alt="" class="redPacket">
							<view class="awardspop-txt2"
							      style="top: 21.867rem  /* 410/18.75 */;left: calc(50% - 5.2rem  /* 97.5/18.75 */);width: 10.4rem  /* 195/18.75 */;">
								遗憾，您的好友【{{packData.parent_name}}】，裂变失败，剩余<span
									style="font-size: 1.6rem  /* 30/18.75 */;">{{packData.rest_amount}}</span>元红包，与TA擦肩而过
							</view>
							<view class="awardspop-txt3"
							      style="color: #FE1835;top: 26.933rem  /* 505/18.75 */;left: calc(50% - 5.2rem  /* 97.5/18.75 */);width: 10.4rem  /* 195/18.75 */;"
							      v-if="packData.is_play == 1">点击下方“我也要参与”召唤好友拆红包，一起来赚红包哦~
							</view>
							<a :href="packData.play_url" class="awardspop-btn" style="top: 32rem  /* 600/18.75 */;"
							   v-if="packData.is_play == 1">我也要参与</a>
							<a :href="packData.play_url" class="awardspop-btn" style="top: 32rem  /* 600/18.75 */;"
							   v-if="packData.is_play == 2">进入我的</a>
						</template>
					</template>
				</view>
			</view>
			<view class="bd" :style="marginTop">
				<!--只有排行榜-->
				<view class="list" v-if="help_type == 1">
					<view style="font-size: 0.8rem  /* 15/18.75 */;padding: 1.333rem  /* 25/18.75 */ 0 0.267rem  /* 5/18.75 */;">
						<img src="../../static/redFission/list-money.png" alt=""
						     style="width: 0.8rem  /* 15/18.75 */;vertical-align: middle;margin-right: 0.373rem  /* 7/18.75 */;">
						已有<span style="color: #F4D43C;">{{helpData.count}}人</span>获得裂变红包
						<img src="../../static/redFission/list-money.png" alt=""
						     style="width: 0.8rem  /* 15/18.75 */;vertical-align: middle;margin-left: 0.373rem  /* 7/18.75 */;">
					</view>
					<ul>
						<li class="list-li" style="border-bottom: 1px dashed #FF9D82;" v-if="helpData.info.length != 0">
							<img src="../../static/redFission/list1.png" alt=""
							     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
							     v-if="helpData.info.ranking == 1">
							<img src="../../static/redFission/list2.png" alt=""
							     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
							     v-else-if="helpData.info.ranking == 2">
							<img src="../../static/redFission/list3.png" alt=""
							     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
							     v-else-if="helpData.info.ranking == 3">
							<text style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;line-height: 1.867rem  /* 35/18.75 */;text-align: center;"
							      v-else>{{helpData.info.ranking}}
							</text>
							<img :src="helpData.info.avatar" alt="" class="list-li-avatar">
							<view style="float: left;">
								<p>{{helpData.info.name}} <span style="color: #F4D43C;margin-left: 5px;">获得</span></p>
								<p style="color: #F4D43C;font-size: 0.587rem  /* 11/18.75 */;margin-top: 0.107rem  /* 2/18.75 */;">
									{{helpData.info.amount}}元裂变红包</p>
							</view>
							<view style="float: right;line-height: 1.867rem  /* 35/18.75 */;">
								用时{{helpData.info.complete_second}}
							</view>
						</li>
						<li v-for="(item,index) in helpData.join" class="list-li">
							<img src="../../static/redFission/list1.png" alt=""
							     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
							     v-if="index == 0">
							<img src="../../static/redFission/list2.png" alt=""
							     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
							     v-else-if="index == 1">
							<img src="../../static/redFission/list3.png" alt=""
							     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
							     v-else-if="index == 2">
							<text style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;line-height: 1.867rem  /* 35/18.75 */;text-align: center;"
							      v-else>{{index+1}}
							</text>
							<img :src="item.avatar" alt="" class="list-li-avatar">
							<view style="float: left;">
								<p>{{item.name}} <span style="color: #F4D43C;">获得</span></p>
								<p style="color: #F4D43C;font-size: 0.587rem  /* 11/18.75 */;margin-top: 0.107rem  /* 2/18.75 */;">
									{{item.amount}}元裂变红包</p>
							</view>
							<view style="float: right;line-height: 1.867rem  /* 35/18.75 */;">用时{{item.complete_second}}
							</view>
						</li>
					</ul>
				</view>
				<!--排行榜与好友-->
				<view class="list" v-if="help_type == 0">
					<view style="font-size: 0.8rem  /* 15/18.75 */;overflow: hidden;">
						<view class="tab" @click="changeTab(0)">
							<span :class="tabIndex == 0 ? 'tab-line' : ''">好友帮拆</span>
						</view>
						<view class="tab" @click="changeTab(1)">
							<span :class="tabIndex == 1 ? 'tab-line' : ''">排行榜TOP100</span>
						</view>
					</view>
					<template v-if="tabIndex == 0">
						<view class="tip">
							<view class="tip-line" :style="width"></view>
							<view class="tip-title">{{helpData.tips}}</view>
							<view class="tip-line" :style="width"></view>
						</view>
						<ul>
							<li v-for="(item,index) in helpData.join" class="list-li">
								<text style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;line-height: 1.867rem  /* 35/18.75 */;text-align: center;">
									{{index+1}}
								</text>
								<img :src="item.avatar" alt="" class="list-li-avatar">
								<view style="float: left;width: calc(100% - 10.24rem  /* 192/18.75 */);">
									<p style="overflow: hidden;"><span
											style="max-width: calc(100% - 2.24rem  /* 42/18.75 */);display: inline-block;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;float: left;">{{item.name}}</span><span
											style="color: #F4D43C;margin-left: 0.267rem  /* 5/18.75 */;">帮拆</span></p>
									<p style="color: #F4D43C;font-size: 0.587rem  /* 11/18.75 */;margin-top: 0.107rem  /* 2/18.75 */;">
										奖励{{item.amount}}元</p>
								</view>
								<view style="float: right;line-height: 1.867rem  /* 35/18.75 */;">{{item.help_time}}
								</view>
							</li>
						</ul>
					</template>
					<template v-if="tabIndex == 1">
						<template v-if="helpData.join.length > 0">
							<view style="font-size: 0.8rem  /* 15/18.75 */;padding: 1.333rem  /* 25/18.75 */ 0 0.267rem  /* 5/18.75 */;">
								<img src="../../static/redFission/list-money.png" alt=""
								     style="width: 0.8rem  /* 15/18.75 */;vertical-align: middle;margin-right: 0.373rem  /* 7/18.75 */;">
								已有<span style="color: #F4D43C;">{{helpData.count}}人</span>获得裂变红包
								<img src="../../static/redFission/list-money.png" alt=""
								     style="width: 0.8rem  /* 15/18.75 */;vertical-align: middle;margin-left: 0.373rem  /* 7/18.75 */;">
							</view>
							<ul>
								<li class="list-li" style="border-bottom: 1px dashed #FF9D82;"
								    v-if="helpData.info.length != 0">
									<img src="../../static/redFission/list1.png" alt=""
									     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
									     v-if="helpData.info.ranking == 1">
									<img src="../../static/redFission/list2.png" alt=""
									     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
									     v-else-if="helpData.info.ranking == 2">
									<img src="../../static/redFission/list3.png" alt=""
									     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
									     v-else-if="helpData.info.ranking == 3">
									<text style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;line-height: 1.867rem  /* 35/18.75 */;text-align: center;"
									      v-else>{{helpData.info.ranking}}
									</text>
									<img :src="helpData.info.avatar" alt="" class="list-li-avatar">
									<view style="float: left;">
										<p>{{helpData.info.name}} <span
												style="color: #F4D43C;margin-left: 5px;">获得</span>
										</p>
										<p style="color: #F4D43C;font-size: 0.587rem  /* 11/18.75 */;margin-top: 0.107rem  /* 2/18.75 */;">
											{{helpData.info.amount}}元裂变红包</p>
									</view>
									<view style="float: right;line-height: 1.867rem  /* 35/18.75 */;">
										用时{{helpData.info.complete_second}}
									</view>
								</li>
								<li v-for="(item,index) in helpData.join" class="list-li">
									<img src="../../static/redFission/list1.png" alt=""
									     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
									     v-if="index == 0">
									<img src="../../static/redFission/list2.png" alt=""
									     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
									     v-else-if="index == 1">
									<img src="../../static/redFission/list3.png" alt=""
									     style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;"
									     v-else-if="index == 2">
									<text style="width: 1.227rem  /* 23/18.75 */;vertical-align: middle;float: left;line-height: 1.867rem  /* 35/18.75 */;text-align: center;"
									      v-else>{{index+1}}
									</text>
									<img :src="item.avatar" alt="" class="list-li-avatar">
									<view style="float: left;">
										<p>{{item.name}} <span style="color: #F4D43C;">获得</span></p>
										<p style="color: #F4D43C;font-size: 0.587rem  /* 11/18.75 */;margin-top: 0.107rem  /* 2/18.75 */;">
											{{item.amount}}元裂变红包</p>
									</view>
									<view style="float: right;line-height: 1.867rem  /* 35/18.75 */;">
										用时{{item.complete_second}}
									</view>
								</li>
							</ul>
						</template>
						<template v-if="helpData.join.length == 0">
							<img src="../../static/redFission/empty.png" alt=""
							     style="width: 25%;margin: 2.667rem  /* 50/18.75 */ 0;">
						</template>
					</template>
				</view>
				<!--活动规则-->
				<view class="list"
				      style="padding: 0.907rem  /* 17/18.75 */ 0.8rem  /* 15/18.75 */;margin: 0.533rem  /* 10/18.75 */ 0.8rem  /* 15/18.75 */ 0.8rem  /* 15/18.75 */;position: relative;box-sizing: border-box;">
					<view class="rule-title-line"></view>
					<view class="rule-title">活动规则</view>
					<view class="rule-content">
						<text class="rule-content-txt">{{activity_rule}}</text>
					</view>
				</view>
			</view>
			<Footer v-if="is_show_copyright == 1" style="background: #E92E28;"></Footer>
			<!--首拆获奖弹窗-->
			<uni-popup ref="awardsPop" type="center" @change="openAwardsPop">
				<img src="../../static/redFission/awardPop.png" alt="" style="width: 90%;">
				<img src="../../static/redFission/close.png" alt="" class="colse-btn" @click="closeAwardsPop">
				<view class="awardspop-title">恭喜首拆获得</view>
				<view class="awardspop-money">￥ <span
						style="font-size: 2.133rem  /* 40/18.75 */;margin-left: 0.16rem  /* 3/18.75 */;">{{awardsPopMoney}}</span>
				</view>
				<view class="awardspop-txt">还有{{rest_amount}}元红包正在路上~</view>
				<view class="awardspop-txt2">召唤{{invite_amount}}位好友一起拆红包</view>
				<view class="awardspop-txt3">拆完后，即可收入囊中</view>
				<view class="awardspop-btn" @click="createPoster">呼唤朋友 拆红包</view>
				<p class="awardspop-txt4">在规定的时间内，凑足人数拆领，即裂变成功，余下的裂变红包金额自动入账至您的微信零钱里，若人数不足，则裂变失败，红包不再发放</p>
			</uni-popup>
			<!--提示弹窗-->
			<uni-popup ref="errorPop" type="center">
				<view class="errorPop">
					<img src="../../static/redFission/errorPop.png" alt=""
					     style="width: 4.16rem  /* 78/18.75 */;margin: 1.973rem  /* 37/18.75 */ auto;">
					<p style="font-size: 0.96rem  /* 18/18.75 */;color: #333;margin-bottom: 0.427rem  /* 8/18.75 */;">
						抱歉</p>
					<p style="font-size: 0.96rem  /* 18/18.75 */;color: #333;width: 90%;margin-left: 5%;">
						{{err_msg}}</p>
					<button class="errorPop-btn" @click="closeErrorPop">知道了</button>
				</view>
			</uni-popup>
			<!--二维码弹窗-->
			<uni-popup ref="codePop" type="center">
				<uni-icons type="close" size="36" style="position: absolute;right: 1.45rem;top: -11.2rem  /* -210/18.75 */;"
				           color="#bfbabd" @click="closeCodePop"></uni-icons>
				<img :src="codeUrl" alt="" style="width: 9.973rem  /* 187/18.75 */;margin-top: -6.933rem  /* -130/18.75 */;">
				<p style="position: absolute;left: 2.987rem  /* 56/18.75 */;top: 4.373rem  /* 82/18.75 */;width: 13.973rem  /* 262/18.75 */;color: #FFF;word-wrap:break-word;">
					为了避免拆完红包后，无法及时到账，请先添加售后为好友，以便快速解决</p>
				<p style="position: absolute;left: 2.987rem  /* 56/18.75 */;top: 8.8rem  /* 165/18.75 */;width: 13.973rem  /* 262/18.75 */;word-wrap:break-word;color: yellow;font-size: 0.693rem  /* 13/18.75 */;line-height: 1.173rem  /* 22/18.75 */;">*若您已添加员工企微后，依然弹出二维码情况时，可以尝试点击刷新，即可正常参与。<uni-icons type="reload" size="15" color="yellow" @click="reloadPage"></uni-icons></p>
			</uni-popup>
			<!--好友拆弹窗-->
			<uni-popup ref="friendPop" type="center" @change="openFriendPop">
				<img src="../../static/redFission/friendPop.png" alt="" style="width: 90%;">
				<img src="../../static/redFission/close.png" alt="" class="colse-btn" @click="closeFriendPop">
				<img :src="friendAvatar" alt="" class="friendPop-avater">
				<view class="friendPop-name">{{friendName}}</view>
				<view class="friendPop-help-name">已帮【{{parent_name}}】拆红包</view>
				<view class="friendPop-money">你获得￥<span
						style="font-size: 1.6rem  /* 30/18.75 */;">{{friendMoney}}</span>红包奖励
				</view>
				<view class="friendPop-content">红包金额已到账您的微信零钱里，请注意查看。您也可以召唤好友拆红包，一起来赚红包哦~</view>
				<a :href="friendUrl" class="friendPop-btn" v-if="friendUrl != '' && is_play == 1">我也要参与</a>
				<a :href="friendUrl" class="friendPop-btn" v-if="friendUrl != '' && is_play == 2">进入我的</a>
			</uni-popup>
			<!-- 页面 100%  0.77海报 77%   海报区域 -->
			<uni-popup ref="popup5" type="center" v-show="!isLoading && status != 4" @change="openPopup5">
				<image :src="posterUrl" :style="{height: imgHeight,width:imgWidth}"
				       style="background-color: transparent;position: absolute;z-index:9999999999999999999; transform: translate(-50%, -50%);"
				/>
				<view>
					<div ref="qrcode" id="qrcode"></div>
				</view>
				<view class="content-msg" :style="{bottom:bottom}">
					长按保存图片
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {Toast} from 'vant';
	import QRCode from "qrcodejs2";
	import Footer from "../../components/footer/footer.vue";

	export default {
		name      : "redFission",
		inject    : ['initPage', 'getCopyright'],
		components: {Footer},
		data () {
			return {
				url              : '',
				isLoading        : true,
				wx               : false,
				wxWork           : false,
				commonUrl        : this.$store.state.commonUrl,
				windowWidth      : 1200,
				windowHeight     : 1200,
				imgPaddingTop    : '100px',//活动已删除占位符paddingTop
				day              : '00', // 天数
				hour             : '00', // 小时
				minutes          : '00', // 分
				seconds          : '00', // 秒
				redPacketMoney   : '',//红包金额
				helpData         : [],//排行榜数据
				activity_rule    : '',//活动规则
				help_type        : '',//好友帮拆或排行榜:-1、无，0、我的好友，1、排行榜
				tabIndex         : 0,//0好友帮拆，1排行榜
				width            : {
					width: '30px'
				},
				rid              : '',//裂变任务id
				jid              : '',//参与者id
				external_id      : '',//外部联系人id
				lat              : '',//纬度
				lng              : '',//经度
				is_remind        : '',//是否需要提醒：0否、1是
				remindData       : '',//需要提醒数据
				status           : {},//活动状态，0已删除，1未开始
				err_msg          : '',//不是正常状态下的提示语
				packData         : [],//红包数据
				//首拆获奖弹窗
				awardsPopMoney   : '',//金额
				rest_amount      : '',//剩余金额
				invite_amount    : '',//邀请人数
				end_time         : '',//结束时间
				//二维码弹窗
				codeUrl          : '',
				//好友拆弹窗
				friendAvatar     : '',//头像
				parent_name      : '',//帮助的人
				friendName       : '',//名称
				friend_end_time  : '',//结束时间
				friendMoney      : '',//金额
				friendUrl        : '',//分享链接
				is_play          : '',//0不显示，1我要参与，2进入我的
				//海报
				back_pic_url     : '',//海报背景图
				creatingPoster   : false,
				fontSize         : '14', // 昵称文字大小
				align            : 'left',
				nickNameStyle    : {},  // 昵称样式
				shape            : "", // 头像圆形  正方形
				avatarStyle      : {}, // 头像样式
				is_avatar        : 0, // 头像是否展示
				head_url         : '', // 头像
				qrcode_url       : '', // 二维码链接
				qrcodeStyle      : {}, // 二维码样式
				color            : '#F5F5F5',
				imgHeight        : '',
				imgWidth         : '',
				is_nickname      : 0,  // 昵称是否展示
				nick_name        : '', // 昵称
				nickNameLeft     : '',
				posterUrl        : '',
				base64Data       : '',
				bottom           : '',
				showPoster       : false,//海报弹窗的有没有显示
				area_type        : '',//区域类型：1、不限制，2、部分地区
				jsApiList        : [],
				contact_phone    : '',//手机号
				marginTop        : {
					marginTop: '-1px'
				},
				is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
				canClick         : true,//拆红包
			}
		},
		methods   : {
			//监听海报弹窗的显示与隐藏
			openPopup5 (e) {
				this.showPoster = e.show
			},
			// 生成海报
			createPoster () {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				this.isLoading = true
				this.$refs.popup5.open()
				if (!this.creatingPoster) {
					this.creatingPoster = true
					let canvas = document.createElement('canvas')
					let ctx = canvas.getContext('2d')
					let that = this
					let devicePixelRatio = window.devicePixelRatio
					let image = new Image()
					image.setAttribute('crossOrigin', 'anonymous')
					image.src = this.commonUrl + this.back_pic_url
					image.onload = () => {
						canvas.width = that.windowWidth * 0.77 * devicePixelRatio
						canvas.height = that.windowWidth * 0.77 * image.height / image.width * devicePixelRatio
						ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
						if (that.is_nickname == 1) {
							ctx.globalCompositeOperation = "source-over";
							let x = (that.nickNameStyle.x / 250 * that.windowWidth * 0.77) * devicePixelRatio
							let y = (that.nickNameStyle.y / 250 * that.windowWidth * 0.77 + that.nickNameStyle.h / 250 * that.windowWidth * 0.77 / 1.5) * devicePixelRatio
							let w = that.nickNameStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
							ctx.fillStyle = that.color
							ctx.font = that.fontSize * devicePixelRatio + "px 'Avenir',Helvetica,Arial,sans-serif";
							if (x < 0) {
								x = 0
								ctx.textAlign = 'left'
								ctx.fillText(that.nick_name, x, y);
							} else {
								if (this.align == 'left') {
									ctx.textAlign = this.align
									ctx.fillText(that.nick_name, x, y);
								} else if (this.align == 'center') {
									ctx.textAlign = this.align
									ctx.fillText(that.nick_name, x + w / 2, y);
								} else if (this.align == 'right') {
									ctx.textAlign = this.align
									ctx.fillText(that.nick_name, x + w, y);
								}
							}
						}

						let img = new Image()
						img.src = this.commonUrl + this.back_pic_url
						img.onload = function () {
							that.imgHeight = that.windowWidth * 0.77 / img.width * img.height + 'px'
							that.imgWidth = that.windowWidth * 0.77 + 'px'
							// let left = that.nickNameStyle.x / 250 * that.windowWidth * 0.77
							// that.$nextTick(() => {
							// let minWidth = document.getElementById('nickName').style.width
							// let width = parseInt(minWidth.substring(0, minWidth.length - 2)) / 250.0 * that.windowWidth * 0.94 * 0.77
							// let maxWidth = that.windowWidth * 0.94 * 0.77
							// if (width + left > maxWidth) {
							// 	that.nickNameLeft = that.windowWidth * 0.94 * 0.77 - width + that.windowWidth * 0.1081
							// } else {
							// 	that.nickNameLeft = that.nickNameStyle.x / 250 * that.windowWidth * 0.94 * 0.77 + that.windowWidth * 0.1081
							// }
							// })

							if (that.windowHeight - that.windowWidth * 0.77 / img.width * img.height > 0) {
								that.bottom = 0
							} else {
								that.bottom = ((that.windowHeight - that.windowWidth * 0.77 / img.width * img.height) / 18.75 - 1.97) + 'rem'
							}
						}

						if (that.is_avatar == 1) {
							let avatar = new Image()
							avatar.setAttribute('crossOrigin', 'anonymous')
							avatar.src = that.base64Data
							avatar.onload = () => {
								if (that.shape == "circle") {
									avatar.src = that.circle_image_v2(avatar, 1)
									avatar.onload = () => {
										ctx.globalCompositeOperation = "source-over";
										let left = that.avatarStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
										let top = that.avatarStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
										let minWidth = that.avatarStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
										ctx.drawImage(avatar, left, top, minWidth, minWidth)
										that.addQrcode(ctx, canvas, devicePixelRatio)
									}
								} else {
									ctx.globalCompositeOperation = "source-over";
									let left = that.avatarStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
									let top = that.avatarStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
									let width = that.avatarStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
									ctx.drawImage(avatar, left, top, width, width)
									that.addQrcode(ctx, canvas, devicePixelRatio)
								}
							}
						} else {
							that.addQrcode(ctx, canvas, devicePixelRatio)
						}
					}
				}
			},
			// 添加二维码
			addQrcode (ctx, canvas, devicePixelRatio) {
				let that = this
				new QRCode(that.$refs.qrcode, {
					text        : that.qrcode_url,
					width       : parseInt((that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio).toString()),
					height      : parseInt((that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio).toString()),
					colorDark   : "#000000",
					colorLight  : "#FFFFFF",
					correctLevel: QRCode.CorrectLevel.H
				})
				let qrCode = new Image()
				let flag = setInterval(function () {
					if (document.getElementById('qrcode').getElementsByTagName('img').length > 0) {
						qrCode.src = document.getElementById('qrcode').getElementsByTagName('img')[0].getAttribute("src")
						if (qrCode.src && qrCode !== null) {
							clearInterval(flag)
							qrCode.setAttribute('crossOrigin', 'anonymous')
							qrCode.onload = () => {
								ctx.globalCompositeOperation = "source-over";
								let left = that.qrcodeStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let top = that.qrcodeStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let width = that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
								ctx.drawImage(qrCode, left, top, width, width)
								ctx.scale(devicePixelRatio, devicePixelRatio)
								that.createUrl(canvas)
							}

						}
						if (document.getElementById('qrcode').getElementsByTagName('canvas').length > 0) {
							clearInterval(flag)
							qrCode.src = document.getElementById('qrcode').getElementsByTagName('canvas')[0].toDataURL("image/png")
							qrCode.onload = () => {
								ctx.globalCompositeOperation = "source-over";
								let left = that.qrcodeStyle.x / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let top = that.qrcodeStyle.y / 250 * that.windowWidth * 0.77 * devicePixelRatio
								let width = that.qrcodeStyle.w / 250 * that.windowWidth * 0.77 * devicePixelRatio
								ctx.drawImage(qrCode, left, top, width, width)
								ctx.scale(devicePixelRatio, devicePixelRatio)
								that.createUrl(canvas)
							}
						}
					}
				}, 100)
			},
			// 头像形状
			circle_image_v2 (img, imgType) {
				var type = imgType || 0;
				var radius, diameter, canvas, ctx, natural;
				if (type) {
					if (img.naturalWidth > img.naturalHeight) {
						radius = img.naturalHeight / 2;
					} else {
						radius = img.naturalWidth / 2;
					}
				} else {
					if (img.width > img.height) {
						radius = img.height / 2;
					} else {
						radius = img.width / 2;
					}
					if (img.naturalWidth > img.naturalHeight) {
						natural = img.naturalHeight;
					} else {
						natural = img.naturalWidth;
					}
				}
				diameter = radius * 2;
				canvas = document.createElement('canvas');
				if (!canvas.getContext) { // 判断浏览器是否支持canvas，如果不支持在此处做相应的提示
					console.log('您的浏览器版本过低，暂不支持。');
					return false;
				}
				canvas.width = diameter;
				canvas.height = diameter;
				let contex = canvas.getContext("2d");
				contex.clearRect(0, 0, diameter, diameter);
				contex.save();
				contex.beginPath();
				contex.arc(radius, radius, radius, 0, Math.PI * 2, false);
				contex.clip();
				if (type) {
					contex.drawImage(img, 0, 0, diameter, diameter, 0, 0, diameter, diameter);
				} else {
					contex.drawImage(img, 0, 0, natural, natural, 0, 0, diameter, diameter);
				}
				contex.restore();
				return canvas.toDataURL('image/png');
			},
			// 海报生成图片
			createUrl (canvas) {
				this.$refs.qrcode.innerHTML = ''
				this.posterUrl = canvas.toDataURL("image/png");
				this.creatingPoster = false
				setTimeout(() => {
					Toast.clear();
					this.isLoading = false
				}, 1000)
			},


			initPageNew () {
				let that = this
				uni.getSystemInfo({
					success: function (res) { // res - 各种参数
						that.windowWidth = res.windowWidth > 1200 ? 1200 : res.windowWidth // 屏幕的宽度
						that.windowHeight = res.windowHeight > 1200 ? 1200 : res.windowHeight // 屏幕的宽度
					}
				});
				this.getData()
				// this.getData()
			},
			// 跳转微信
			// goWx () {
			// 	let CORPID = this.getParameter('suite_id') !== null ? this.getParameter('suite_id') : this.getParameter('corpid')
			// 	let code = this.getParameter('code')
			// 	let state = this.getParameter('state')
			// 	this.url = this.url.replace('&code=' + code, '')
			// 	this.url = this.url.replace('?code=' + code + "&", '?')
			// 	this.url = this.url.replace('?code=' + code, '?')
			// 	this.url = this.url.replace('&state=' + state, '')
			// 	this.url = this.url.replace('?state=' + state + "&", '?')
			// 	this.url = this.url.replace('?state=' + state, '?')
			// 	let REDIRECT_URI = encodeURIComponent(this.url)
			// 	let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + CORPID + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
			// 	window.location.href = url
			// },
			async limit (is_forbid) {
				this.url = window.location.href
				let agent_id = this.getParameter("agent_id")
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

					if (localStorage.getItem('uid')) {
						//获取底部技术支持
						that.getCopyright(that.refresh)
					}

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
						jsApiList: that.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
					})

					that.$store.state.wx.error(function (res) {
						if (typeof res.errCode !== "undefined" && res.errCode == 2) {
							if (typeof res.err_Info !== "undefined" && res.err_Info == 'invalid corpid' && that.wxWork) {
								Toast.fail({
									forbidClick: true,
									duration   : 0,
									message    : "请在微信中打开"
								})

								return false
							}
						} else if (typeof res.errMsg !== "undefined" && res.errMsg.indexOf("invalid corpid") != -1) {
							Toast.fail({
								forbidClick: true,
								duration   : 0,
								message    : "请在微信中打开"
							})
							return false
						}

						Toast.fail({
							forbidClick: true,
							duration   : 0,
							message    : '初始化失败，请刷新重试'
						})
					})

					if (is_forbid == 1 || that.wx) {
						that.$store.state.wx.hideOptionMenu();
					}

				}
			},
			//重新渲染頁面
			refresh () {
				this.is_show_copyright = localStorage.getItem('is_show_copyright')
				this.$forceUpdate()
			},
			getParameter (name) {
				let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构建一个含有目标参数的正则表达式对象
				let r = window.location.search.substr(1).match(reg);//匹配目标参数
				if (r != null) {
					return unescape(r[2]); //返回参数值
				}
				return null;
			},
			async getData (external_id = (this.getParameter('external_userid') != null ? this.getParameter('external_userid') : localStorage.getItem('external_int_id'))) {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				this.isLoading = true
				// let corp_id = 1
				// let agent_id = 5
				// let assist = 'red_8_3469'
				// let code = ''
				let corp_id = this.getParameter('corp_id')
				let agent_id = this.getParameter('agent_id')
				let assist = this.getParameter('assist')
				let deviceCode = this.$cookies.get(this.$store.state.authKey)
				const {data: res} = await this.axios.post("wap-red-pack/index", {
					corp_id    : corp_id,
					agent_id   : agent_id,
					code       : deviceCode,
					assist     : assist,
					external_id: external_id
					// external_id: 3469
				});
				if (res.error != 0) {
					this.limit(1)
					Toast.fail(res.error_msg);
				} else {
					this.status = res.data.status
					Toast.clear();
					this.isLoading = false
					this.limit(1)
					if (this.status != 0) {
						document.title = res.data.title
						this.external_id = res.data.external_id
						this.day = res.data.timeData.day
						this.hour = res.data.timeData.hour
						this.minutes = res.data.timeData.minutes
						this.seconds = res.data.timeData.seconds
						if (typeof external_id == 'undefined' || external_id == '') {
							this.timing()
						}
						this.redPacketMoney = res.data.red_pack_price
						this.helpData = res.data.helpData
						this.activity_rule = res.data.activity_rule
						this.help_type = res.data.help_type
						this.rid = res.data.rid
						this.jid = res.data.jid
						this.is_remind = res.data.is_remind
						this.remindData = res.data.remindData
						this.packData = res.data.packData
						this.contact_phone = res.data.contact_phone
						this.area_type = res.data.area_type

						this.qrcode_url = res.data.share_url
						this.nick_name = res.data.nick_name
						this.head_url = res.data.head_url
						this.base64Data = res.data.base64Data
						this.qrcodeStyle = res.data.picRule.qrCode
						this.nickNameStyle = res.data.picRule.nickName
						this.is_nickname = res.data.picRule.is_nickname
						this.color = res.data.picRule.color
						this.align = res.data.picRule.align
						this.fontSize = res.data.picRule.font_size
						this.shape = res.data.picRule.shape
						this.avatarStyle = res.data.picRule.avatar
						this.is_avatar = res.data.picRule.is_avatar
						this.back_pic_url = res.data.picRule.back_pic_url

						if (this.is_remind == 1) {
							//提醒
							if (this.remindData.is_first == 0) {
								//类型：1首拆，0好友拆
								this.friendAvatar = this.remindData.avatar
								this.friendName = this.remindData.name
								this.parent_name = this.remindData.parent_name
								this.friendMoney = this.remindData.amount
								this.friend_end_time = this.remindData.end_time
								this.friendUrl = this.remindData.play_url
								let that = this
								let img = new Image()
								img.src = this.friendAvatar
								img.onload = function () {
									that.$refs['friendPop'].open()
								}
							} else if (this.remindData.is_first == 1) {
								this.awardsPopMoney = this.remindData.first_amount
								this.rest_amount = this.remindData.rest_amount
								this.invite_amount = this.remindData.rest_num
								this.end_time = this.remindData.end_time
								this.$refs['awardsPop'].open()
							}
						} else if (this.is_remind == 0) {
							//不提醒
						}

						if (this.help_type != -1) {
							this.$nextTick(() => {
								this.width.width = (document.getElementsByClassName('tip')[0].scrollWidth - document.getElementsByClassName('tip-title')[0].scrollWidth - 45) / 2 + 'px'
							})
						}

						localStorage.setItem('openid', res.data.openid)
						let websocketInterval
						websocketInterval = setInterval(() => {
							if (this.ws.websocket.readyState == 1) {
								clearInterval(websocketInterval)
								this.ws.websocketSend(
									JSON.stringify({
										channel: "bind",
										info   : {
											session_id: this.global.session_id,
											uid       : localStorage.getItem("uid") != null ? localStorage.getItem("uid") : '',
											subId     : (localStorage.getItem('user_type') == 2 && localStorage.getItem("sub_id") != null) ? localStorage.getItem("sub_id") : '',
											openid    : localStorage.getItem("openid") != null ? localStorage.getItem("openid") : '',
											bindType  : 3,
										}
									})
								)
							}
						}, 300)
					}
				}
				this.$refs.codePop.close()
				if (this.packData.pack_type == 0) {
					this.marginTop.marginTop = '-30px'
				} else if (this.packData.pack_type == -1) {
					this.marginTop.marginTop = '-65px'
				} else {
					this.marginTop.marginTop = '-1px'
				}
			},
			timing () {
				let that = this
				that.time = setInterval(function () {
					let day = parseInt(that.day)
					let hour = parseInt(that.hour)
					let minutes = parseInt(that.minutes)
					let seconds = parseInt(that.seconds)
					if (seconds == 0) {
						if (minutes == 0) {
							if (hour == 0) {
								if (day == 0) {
									// that.status = 3
									clearInterval(that.time)
								} else {
									day = day - 1
									hour = 23
									minutes = 59
									seconds = 59
								}
							} else {
								hour = hour - 1
								minutes = 59
								seconds = 59
							}
						} else {
							minutes = minutes - 1
							seconds = 59
						}
					} else {
						seconds = seconds - 1
					}
					that.day = that.formatter(day)
					that.seconds = that.formatter(seconds)
					that.minutes = that.formatter(minutes)
					that.hour = that.formatter(hour)
				}, 1000)
			},
			formatter (value) {
				if (value < 10) {
					return "0" + value
				}
				return value
			},
			//切换tab
			async changeTab (val) {
				const {data: res} = await this.axios.post("wap-red-pack/help-list", {
					rid        : this.rid,
					jid        : this.jid,
					external_id: this.external_id,
					help_type  : val
				});
				if (res.error != 0) {
					Toast.fail(res.error_msg);
				} else {
					this.tabIndex = val
					this.helpData = res.data
				}
			},
			//拆红包
			dismantle () {
				this.canClick = false
				//有区域限制，需要获取地址
				if (this.area_type == 2) {
					this.getLocation()
				} else if (this.area_type == 1) {
					this.dismantle2()
				}
			},
			async dismantle2 () {
				Toast.loading({
					message    : '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				});
				const {data: res} = await this.axios.post("wap-red-pack/open-pack", {
					uid        : localStorage.getItem('uid'),
					rid        : this.rid,
					jid        : this.jid,
					external_id: this.external_id,
					lat        : this.lat,//经度
					lng        : this.lng,//纬度
				});
				if (res.error != 0) {
					this.canClick = true
					Toast.clear();
					Toast.fail(res.error_msg);
				} else {
					// let res = {}
					// res.data = {
					// 	amount       : 0.31,
					// 	assist       : "red_3_2375",
					// 	end_time     : "2020-06-13",
					// 	err_msg      : "",
					// 	invite_amount: 3,
					// 	open_type    : 1,
					// 	rest_amount  : "0.69",
					// 	share_url    : "http://tm-scrm.wemero.cn/h5/pages/fission/index?corp_id=1&corpid=ww93caebeee67d134b&agent_id=5&assist=red_3_2375"
					// }
					// res.data = {
					// 	amount     : 0.37,
					// 	assist     : "red_3_0",
					// 	avatar     : "http://wx.qlogo.cn/mmhead/Q3auHgzwzM4ia3DzPLLxXsBoQkCthrjaicwCn0x3b3SyUCYhicQHwzaVg/0",
					// 	end_time   : "2020-06-13",
					// 	err_msg    : "",
					// 	name       : "李云莉",
					// 	open_type  : 2,
					// 	parent_name: "一切随缘",
					// 	share_url  : "http://tm-scrm.wemero.cn/h5/pages/fission/index?corp_id=1&corpid=ww93caebeee67d134b&agent_id=5&assist=red_3_0"
					// }
					this.canClick = true
					Toast.clear();
					if (res.data.err_msg == '') {
						if (res.data.open_type == 0) {
							//二维码
							this.codeUrl = res.data.qr_code
							let that = this
							let img = new Image()
							img.src = this.codeUrl
							img.onload = function () {
								that.$refs['codePop'].open()
							}
						} else if (res.data.open_type == 1) {
							//首拆
							this.awardsPopMoney = res.data.amount
							this.rest_amount = res.data.rest_amount
							this.invite_amount = res.data.invite_amount
							this.end_time = res.data.end_time
							this.qrcode_url = res.data.share_url
							this.nick_name = res.data.nick_name
							this.base64Data = res.data.base64Data
							this.$refs['awardsPop'].open()
						} else if (res.data.open_type == 2) {
							//好友拆
							this.friendAvatar = res.data.avatar
							this.parent_name = res.data.parent_name
							this.friendName = res.data.name
							this.friend_end_time = res.data.end_time
							this.friendMoney = res.data.amount
							this.friendUrl = res.data.share_url
							this.is_play = res.data.is_play
							let that = this
							let img = new Image()
							img.src = this.friendAvatar
							img.onload = function () {
								that.$refs['friendPop'].open()
							}
						}
					} else {
						this.err_msg = res.data.err_msg
						this.$refs['errorPop'].open()
					}
				}
			},
			//获取位置
			getLocation () {
				let that = this
				that.$store.state.wx.getLocation({
					type   : 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
					success: function (res) {
						that.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
						that.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
						that.dismantle2()
					},
					fail   : function (res) {
						that.err_msg = '因领取红包仅限部分地区参与，需先知道您当前地址。'
						that.$refs.errorPop.open()
					}
				});
			},
			//关闭提示弹窗
			closeErrorPop () {
				this.$refs['errorPop'].close()
			},
			//关闭首拆获奖弹窗
			closeAwardsPop () {
				this.$refs['awardsPop'].close()
			},
			//关闭好友拆弹窗
			closeFriendPop () {
				this.$refs['friendPop'].close()
			},
			//监听首拆获奖弹窗的显示与隐藏
			openAwardsPop (e) {
				if (!e.show) {
					this.getData(this.external_id)
				}
			},
			//监听好友拆弹窗的显示与隐藏
			openFriendPop (e) {
				if (!e.show) {
					this.friendUrl = ''
					this.getData(this.external_id)
				}
			},
			//关闭二维码弹窗
			closeCodePop () {
				this.$refs['codePop'].close()
			},
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'red' && typeof data.has_chat != 'undefined' && data.has_chat) {
					this.ws.setCallback()
					if (localStorage.getItem('openid')) {
						localStorage.removeItem('openid')
					}
					if (this.showPoster) {
						this.$refs.popup5.close()
					}
					this.$refs.codePop.close()
					this.initPage(this.getData)

				}
			},
			fun () {
				this.$router.go(-4)
			},
			reloadPage(){
				this.$refs.codePop.close()
				this.initPage(this.getData)
			}
		},
		mounted () {
			if (window.history && window.history.pushState) {

				history.pushState(null, null, document.URL);

				window.addEventListener('popstate', this.fun, false);//false阻止默认事件
			}
		},
		destroyed () {
			//页面销毁时，取消监听。否则其他vue路由页面也会被监听
			window.removeEventListener('popstate', this.fun, false);//false阻止默认事件

		},
		onShow () {
			//活动已删除占位符的paddingTop的距离
		},
		onLoad () {
			this.wx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') === -1

			this.wxWork = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') !== -1

			if (this.wx) {
				this.jsApiList = [
					'hideOptionMenu',
					'onMenuShareAppMessage',
					'onMenuShareTimeline',
					'getLocation'
				]
			}

			if (this.wxWork) {
				this.jsApiList = [
					'hideOptionMenu',
					'onMenuShareAppMessage',
					'onMenuShareWechat',
					'onMenuShareTimeline',
					'shareAppMessage',
					'shareWechatMessage',
					'shareToExternalContact',
					'getLocation'
				]
			}

			this.ws.setCallback(this.websocketOnMessage)
			let height = window.innerHeight
			let paddingTop2 = (height - 314.27) / 2
			this.imgPaddingTop = parseInt(paddingTop2) + 'px'

			let that = this
			this.$store.dispatch('setWx', () => {
				that.initPage(that.initPageNew)
			})
		},
	}
</script>

<style scoped>
	.hd {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.view {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow-y: auto;
	}

	.time {
		margin-top: 10.933rem /* 205/18.75 */;
	}

	.time-view {
		background-color: #D81C1A;
		border-radius: 0.053rem /* 1/18.75 */;
		font-size: 0.96rem /* 18/18.75 */;
		color: #FFF;
		padding: 0.32rem /* 6/18.75 */ 0.427rem /* 8/18.75 */;
	}

	.question {
		font-size: 0.693rem /* 13/18.75 */;
		color: #FFF4C1;
		margin: 0 0.32rem /* 6/18.75 */;
	}

	.redPacket {
		width: 17.387rem /* 326/18.75 */;
		display: block;
		margin: 6.4rem /* 120/18.75 */ auto 0;
	}

	.redBtn {
		width: 3.84rem /* 72/18.75 */;
		position: absolute;
		top: 23.093rem /* 433/18.75 */;
		left: 50%;
		margin-left: -1.92rem /* -36/18.75 */;
		/*animation: breathe 3s infinite;*/
		z-index: 888888;
	}

	.redMoney {
		position: absolute;
		top: 28.267rem /* 530/18.75 */;
		color: #FFF;
		width: 100%;
	}

	.redMoney-text {
		font-size: 0.64rem /* 12/18.75 */;
		color: #FFF;
		opacity: 0.5;
		position: absolute;
		top: 31.893rem /* 598/18.75 */;
		width: 100%;
	}

	.bd {
		background: linear-gradient(to bottom, #E92E28 0%, #EA2C2A 100%);
		margin-top: -1px;
		color: #FFF;
		font-size: 0.693rem /* 13/18.75 */;
		overflow: hidden;
		position: relative;
	}

	.list {
		width: 18.667rem /* 350/18.75 */;
		max-height: 20.64rem /* 387/18.75 */;
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 0.267rem /* 5/18.75 */;
		margin: 0 auto;
		overflow-y: auto;
	}

	.list-li {
		box-sizing: border-box;
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		padding: 1.067rem /* 20/18.75 */ 0 0.8rem /* 15/18.75 */;
		margin: 0 0.693rem /* 13/18.75 */;
		text-align: left;
		overflow: hidden;
	}

	.list-li-avatar {
		width: 1.867rem /* 35/18.75 */;
		height: 1.867rem /* 35/18.75 */;
		border-radius: 50%;
		margin: 0 0.48rem /* 9/18.75 */ 0 0.8rem /* 15/18.75 */;
		float: left;
	}

	.rule-title {
		width: 6.827rem /* 128/18.75 */;
		height: 1.653rem /* 31/18.75 */;
		background: #FFF;
		font-size: 0.8rem /* 15/18.75 */;
		color: #EA2C2A;
		line-height: 1.653rem /* 31/18.75 */;
		border-radius: 0.853rem /* 16/18.75 */;
		margin: auto;
		position: relative;
	}

	.rule-title-line {
		position: absolute;
		left: 0.8rem /* 15/18.75 */;
		top: 1.733rem /* 32.5/18.75 */;
		height: 0.053rem /* 1/18.75 */;
		background: #FFF;
		width: calc(100% - 1.6rem /* 30/18.75 */);
	}

	.rule-content {
		margin-top: 1.28rem /* 24/18.75 */;
		text-align: left;
		line-height: 1.28rem /* 24/18.75 */;
	}

	.rule-content-txt {
		word-wrap: break-word
	}

	.tab {
		width: 50%;
		float: left;
		height: 1.44rem /* 27/18.75 */;
		margin-top: 1.333rem;
	}

	.tab-line {
		color: #FFE82A;
		border-bottom: 0.16rem /* 3/18.75 */ solid #FFE82A;
		padding-bottom: 0.267rem /* 5/18.75 */;
	}

	.tip {
		margin: 1.387rem /* 26/18.75 */ 0 1.067rem /* 20/18.75 */;
		position: relative;
		padding: 0 15px;
		overflow: hidden;
	}

	.tip-line {
		border-bottom: 0.053rem /* 1/18.75 */ dashed #FF9D82;
		float: left;
		margin-top: 0.427rem /* 8/18.75 */;
	}

	.tip .tip-line:nth-child(1) {
		margin-right: 5px;
	}

	.tip .tip-line:last-child {
		margin-left: 5px;
	}

	.tip-title {
		color: #FFD5CA;
		font-size: 0.64rem /* 12/18.75 */;
		position: relative;
		background-color: rgba(233, 46, 40, 0.15);
		float: left;
	}

	.awardspop-title {
		color: #FFE71F;
		font-size: 0.8rem /* 15/18.75 */;
		position: absolute;
		top: 7.733rem /* 145/18.75 */;
		width: 100%;
	}

	.awardspop-money {
		font-size: 1.333rem /* 25/18.75 */;
		color: #FE1835;
		position: absolute;
		top: 10.4rem /* 195/18.75 */;
		width: 100%;
		font-weight: 700;
	}

	.awardspop-txt {
		font-size: 0.747rem /* 14/18.75 */;
		color: #FE1835;
		font-weight: 700;
		position: absolute;
		top: 13.067rem /* 245/18.75 */;
		width: 100%;
	}

	.awardspop-txt2 {
		font-size: 0.747rem /* 14/18.75 */;
		color: #FE1835;
		position: absolute;
		top: 16rem /* 300/18.75 */;
		width: 100%;
	}

	.awardspop-txt3 {
		font-size: 0.64rem /* 12/18.75 */;
		color: #DC919A;
		position: absolute;
		top: 17.6rem /* 330/18.75 */;
		width: 100%;
	}

	.awardspop-btn {
		width: 12.267rem /* 230/18.75 */;
		height: 2.667rem /* 50/18.75 */;
		position: absolute;
		top: 20.8rem /* 390/18.75 */;
		left: calc(50% - 6.133rem /* 115/18.75 */);
		background: url("../../static/redFission/btn.png");
		background-size: 12.267rem /* 230/18.75 */ auto;
		background-repeat: no-repeat;
		color: #DD1A23;
		font-size: 0.96rem /* 18/18.75 */;
		line-height: 2.667rem /* 50/18.75 */;
	}

	.awardspop-txt4 {
		font-size: 0.533rem /* 10/18.75 */;
		position: absolute;
		top: 24rem /* 450/18.75 */;
		width: 13.867rem /* 260/18.75 */;
		color: #FFFFFF;
		opacity: 0.5;
		left: calc(50% - 6.933rem /* 130/18.75 */);
	}

	.delete {
		width: 6.667rem /* 125/18.75 */;
	}

	.content-msg {
		border: 1px solid #FFDDA6;
		background: #FFF2DB;
		padding: 10px;
		height: 1.2rem;
		font-size: 0.8rem;
		z-index: 999;
		position: fixed;
		left: 0;
		right: 0;
	}

	.errorPop {
		width: 16rem /* 300/18.75 */;
		height: 17.067rem /* 320/18.75 */;
		background: #FFF;
		box-shadow: 0px 9px 25px 8px rgba(208, 6, 40, 0.61);
		border-radius: 5px;
		margin: auto;
	}

	.errorPop-btn {
		width: 240px;
		height: 45px;
		background-color: #E73424;
		border-radius: 8px;
		color: #FFF;
		margin-top: 1.44rem /* 27/18.75 */;
	}

	.friendPop-avater {
		width: 3.627rem /* 68/18.75 */;
		position: absolute;
		left: calc(50% - 1.813rem /* 34/18.75 */);
		top: 3.733rem /* 70/18.75 */;
		border-radius: 50%;
	}

	.friendPop-name {
		width: 100%;
		position: absolute;
		top: 8rem /* 150/18.75 */;
		color: #FFFFFF;
		font-size: 0.96rem /* 18/18.75 */;
	}

	.friendPop-help-name {
		width: 100%;
		position: absolute;
		top: 9.867rem /* 185/18.75 */;
		color: #FFFFFF;
		font-size: 0.693rem /* 13/18.75 */;
		opacity: 0.8;
	}

	.friendPop-money {
		width: 100%;
		position: absolute;
		top: 12.8rem /* 240/18.75 */;
		color: #FFFFFF;
		font-size: 0.8rem /* 15/18.75 */;
		opacity: 0.8;
	}

	.friendPop-content {
		color: #FFFFFF;
		opacity: 0.7;
		font-size: 0.587rem /* 11/18.75 */;
		position: absolute;
		top: 15.733rem /* 295/18.75 */;
		width: 13.867rem /* 260/18.75 */;
		left: calc(50% - 6.933rem /* 130/18.75 */);
	}

	.friendPop-btn {
		width: 12.267rem /* 230/18.75 */;
		height: 2.667rem /* 50/18.75 */;
		position: absolute;
		top: 20.267rem /* 380/18.75 */;
		left: calc(50% - 6.133rem /* 115/18.75 */);
		background: url("../../static/redFission/btn.png");
		background-size: 12.267rem /* 230/18.75 */ auto;
		background-repeat: no-repeat;
		color: #DD1A23;
		font-size: 0.96rem /* 18/18.75 */;
		line-height: 2.667rem /* 50/18.75 */;
	}

	.cryIcon {
		width: 2.453rem /* 46/18.75 */;
		position: absolute;
		top: 21.067rem /* 395/18.75 */;
		left: calc(50% - 1.227rem /* 23/18.75 */);
	}

	.end-title {
		color: #CE8F32;
		font-size: 0.853rem /* 16/18.75 */;
		position: absolute;
		top: 24.587rem /* 461/18.75 */;
		width: 60%;
		left: 20%;
		word-wrap: break-word;
	}

	.end-money {
		color: #FFF;
		position: absolute;
		top: 29.067rem /* 545/18.75 */;
		width: 100%;
	}

	.ing-btn {
		width: 10.987rem /* 206/18.75 */;
		height: 2.453rem /* 46/18.75 */;
		position: absolute;
		top: 30.933rem /* 580/18.75 */;
		left: calc(50% - 5.493rem /* 103/18.75 */);
		background: url(../../static/redFission/btn.png);
		background-size: 10.987rem /* 206/18.75 */ auto;
		background-repeat: no-repeat;
		color: #DD1A23;
		font-size: 0.96rem /* 18/18.75 */;
		line-height: 2.453rem /* 46/18.75 */;
	}

	.ing-text {
		font-size: 0.533rem /* 10/18.75 */;
		position: absolute;
		top: 33.6rem /* 630/18.75 */;
		width: 10.987rem /* 206/18.75 */;
		color: #FFFFFF;
		opacity: 0.5;
		left: calc(50% - 5.493rem /* 103/18.75 */);
	}

	@keyframes breathe {
		0% {
			-webkit-transform: rotate3d(0, 0, 0, 5deg) translate3d(0, 0, 0);
			transform: rotate3d(0, 0, 0, 5deg) translate3d(0, 0, 0);
		}
		50% {
			-webkit-transform: rotate3d(-30, 0, -10, 2deg) translate3d(2px, -2px, 30px);
			transform: rotate3d(-30, 0, -10, 2deg) translate3d(2px, -2px, 30px);
		}
		100% {
			-webkit-transform: rotate3d(0, 0, 0, 5deg) translate3d(0, 0, 0);
			transform: rotate3d(0, 0, 0, 5deg) translate3d(0, 0, 0);
		}
	}

	.join-btn {
		width: 5.867rem /* 110/18.75 */;
		height: 2.453rem /* 46/18.75 */;
		position: absolute;
		top: 32rem /* 600/18.75 */;
		left: 3.733rem /* 70/18.75 */;
		border: 1px solid #FFCD2A;
		color: #FFCD2A;
		font-size: 0.853rem /* 16/18.75 */;
		line-height: 2.56rem /* 48/18.75 */;
		border-radius: 30px;
	}

	.join-btn2 {
		width: 5.867rem /* 110/18.75 */;
		height: 2.56rem /* 48/18.75 */;
		position: absolute;
		top: 32rem /* 600/18.75 */;
		right: 3.733rem /* 70/18.75 */;
		background: url(../../static/redFission/joinBtn.png);
		background-size: 5.867rem /* 110/18.75 */ auto;
		background-repeat: no-repeat;
		color: #DD1A23;
		font-size: 0.853rem /* 16/18.75 */;
		line-height: 2.56rem /* 48/18.75 */;
	}

	/deep/ .uni-load-more__text {
		display: none;
	}

	.colse-btn {
		width: 1.493rem /* 28/18.75 */;
		position: absolute;
		top: 6.667rem /* 125/18.75 */;
		right: 3.253rem /* 61/18.75 */;
	}

	/deep/ .uni-popup__wrapper-box {
		width: 100%;
	}
</style>