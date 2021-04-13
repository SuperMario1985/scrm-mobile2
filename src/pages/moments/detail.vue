<template>
  <view class="moment-info-box"  @tap.stop="endFn">
    <view class="uni-flex uni-row" style="margin-bottom: 0.4rem;color:#FFF">
      <view class="text uni-column flex-item logo" v-if="momentInfo.status==2">
        <button class="success"
                type="default">待审核
        </button>
      </view>
      <view class="text uni-column flex-item logo" v-if="momentInfo.status==3">
        <button class="failed"
                type="default">审核失败
        </button>
      </view>
    </view>
    <view class="uni-flex uni-row" style="margin: 0.5rem 0;font-size: 0.8rem" v-if="momentInfo.status==3">
      <span style="font-weight: 900;width:80px;">原因：</span>
      <span style="text-align: left;display:block;white-space: pre-wrap;word-wrap: break-word;">
              {{momentInfo.replys}}
      </span>
    </view>
    <view class="uni-flex uni-row">
      <view class="moment-user">
        <image
            :src="userAvatar"
            class="moment-avatar"
            mode="aspectFit"
            @tap="goToMoment"></image>
      </view>
      <view class="moment-info moment-flex">
        <view class="uni-flex uni-column">
          <view class="moment-name">
            <text @tap="goToMoment">{{userName}}</text>
          </view>
          <TextShow v-if="momentInfo.text" class='text_show' :content="momentInfo.text"></TextShow>
          <!--					<pre class="text moment-content"-->
          <!--					     style="display:block;white-space: pre-wrap;word-wrap: break-word;">{{momentInfo.text}}</pre>-->
          <!-- 媒体信息 -->
          <view class="moment-media-box">
            <template v-if="momentInfo.type == 2">
              <view v-if="momentInfo.info.length == 1">
                <image v-if="momentInfo.info[0].local_path"
                       mode="widthFix"
                       :src="$store.state.commonUrl + (momentInfo.info[0].s_local_path ? momentInfo.info[0].s_local_path : momentInfo.info[0].local_path)"
                       style="width: 5.333rem  /* 100/18.75 */; height: auto"
                       @tap="previewImage(0)"></image>
              </view>
              <uni-grid
                  v-else
                  :column="momentInfo.info.length == 2 || momentInfo.info.length == 4 ? 2 : 3"
                  borderColor="#FFFFFF"
                  :style="momentInfo.info.length == 2 || momentInfo.info.length == 4 ? 'width: 8.533rem  /* 160/18.75 */;' : 'width: 12.8rem  /* 240/18.75 */;'">
                <template v-for="(info, key) in momentInfo.info">
                  <uni-grid-item :key="key">
                    <image v-if="info.local_path"
                           mode="aspectFill"
                           :src="$store.state.commonUrl + ( info.s_local_path ? info.s_local_path : info.local_path)"
                           @tap="previewImage(key)"
                           style="width: 100%;"></image>
                  </uni-grid-item>
                </template>
              </uni-grid>
            </template>

            <template v-if="momentInfo.type == 3">
              <videoplayer :url="commonUrl+momentInfo.info[0].local_path"
                           style="width: 10rem;height:14.187rem;margin: 0">
              </videoplayer>
            </template>

            <template v-if="momentInfo.type == 4">
              <view v-if="momentInfo && momentInfo.info !={} && momentInfo.info !=null"
                    class="uni-row uni-flex moment-news" @tap="viewNews">
                <image v-if="momentInfo.info.pic_path && momentInfo.info.pic_path !=''"
                       mode="aspectFill"
                       :src="momentInfo.info.pic_path.substr(0, 1)=='/'?commonUrl+momentInfo.info.pic_path:momentInfo.info.pic_path"
                       style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;"></image>
                <image v-if="momentInfo.info.pic_path =='' || momentInfo.info.pic_path ==null"
                       mode="aspectFill"
                       src="../../static/assets/lj.png"
                       style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;"></image>
                <view
                    class="uni-flex uni-column moment-flex"
                    style="text-align: left; margin-left: 0.267rem  /* 5/18.75 */;">
                  <view class="text news-title">
                    {{momentInfo.info.title}}
                  </view>
                  <view class="text news-des">
                    {{momentInfo.info.description}}
                  </view>
                </view>
              </view>
            </template>
          </view>
          <!-- end -->
          <view class="moment-footer">
            <view class="moment-date">{{momentInfo.create_time}}</view>
            <view class="moment-action-box" v-if="showMoreBox" >
              <view class="moment-action-box-inner" @click="addGood" style="margin-left:0.2rem;">
                <svg t="1610341728006" class="icon moment-zan" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14364"><path d="M310.388364 99.165091 310.388364 99.165091c20.619636 0 41.378909 2.699636 61.579636 7.982545 39.354182 10.402909 76.520727 29.975273 110.475636 58.112l29.602909 24.552727 29.672727-24.459636c34.420364-28.346182 71.447273-47.941818 109.800727-58.135273 20.270545-5.236364 41.029818-7.866182 61.696-7.866182 25.297455 0 50.827636 3.956364 75.333818 11.613091 40.471273 13.149091 78.661818 36.212364 109.847273 66.117818 30.254545 30.021818 53.341091 67.118545 66.769455 107.240727l2.722909 7.959273c12.125091 41.565091 12.753455 82.920727 1.722182 123.392-11.008 41.704727-34.746182 82.408727-68.770909 117.922909l-2.234182 1.559273-2.839273 2.839273L512.139636 921.157818 126.464 536.203636c-35.770182-35.746909-60.672-77.428364-72.145455-120.925091-11.659636-42.728727-10.193455-86.900364 4.212364-130.932364 13.381818-39.819636 36.933818-77.032727 67.933091-107.403636 31.511273-30.580364 69.236364-53.341091 109.381818-65.954909C260.235636 103.144727 285.323636 99.165091 310.388364 99.165091M310.365091 52.619636c-29.090909 0-58.903273 4.445091-88.762182 14.056727-48.128 15.104-92.229818 42.589091-127.534545 76.869818-35.746909 35.025455-63.720727 78.615273-79.639273 125.998545-17.850182 54.434909-18.618182 108.125091-5.003636 157.998545C23.272727 480.186182 52.736 528.337455 93.579636 569.134545l390.609455 389.864727c7.912727 8.285091 18.059636 12.381091 28.136727 12.381091 9.821091 0 19.572364-3.909818 27.042909-11.636364l389.329455-388.840727 2.513455-1.768727c40.075636-40.797091 69.538909-88.948364 83.432727-141.614545 13.591273-49.896727 12.823273-103.563636-5.050182-157.998545l-0.279273 0c-15.872-47.383273-43.101091-90.717091-78.103273-125.486545-36.258909-34.792727-80.128-61.719273-128.256-77.358545-30.161455-9.402182-60.253091-13.870545-89.716364-13.870545-24.971636 0-49.501091 3.211636-73.309091 9.332364-46.382545 12.334545-89.227636 35.514182-127.767273 67.281455C473.832727 97.652364 430.498909 74.472727 383.860364 62.138182 360.168727 55.924364 335.522909 52.619636 310.365091 52.619636L310.365091 52.619636z" p-id="14365" fill="#ffffff"></path></svg>
                <text>{{momentInfo.is_good==1?'取消':'赞'}}</text>
              </view>
              <view class="moment-action-box-inner" style="margin-right: 0" @click="showMoment">
                <svg t="1610335655634" class="icon moment-recomd" viewBox="0 0 1058 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1912" ><path d="M330.744242 885.372121l194.779798-129.861818 16.665859-11.106263h383.844848c36.486465 0 66.19798-29.659798 66.19798-66.146262v-529.19596c0-36.434747-29.711515-66.107475-66.19798-66.107475H132.305455c-36.486465 0-66.146263 29.659798-66.146263 66.107475v529.19596c0 36.486465 29.659798 66.146263 66.146263 66.146262h198.438787v140.968081m-66.146262 123.578182V810.550303H132.305455c-73.024646 0-132.305455-59.216162-132.305455-132.292525v-529.19596C0 76.024242 59.267879 16.808081 132.305455 16.808081h793.742222c73.076364 0 132.357172 59.216162 132.357171 132.240808v529.195959c0 73.076364-59.267879 132.292525-132.357171 132.292526h-363.830303L264.59798 1008.950303z m0 0" p-id="1913" fill="#ffffff"></path></svg>
                <text>评论</text>
              </view>
            </view>
            <view class="moment-action" :class="momentInfo.has_good ? 'has-goods' : ''" @tap="momentGood">
              <van-popover
                  v-model="showPopover"
                  theme="dark"
                  trigger="click"
                  :close-on-click-action="false"
                  v-if="momentInfo.can_goods==1&&momentInfo.status==1&&!notUser==1"
              >
                <template #reference>
                  <text class="moment-more" @tap.stop="showMore">• •</text>
                </template>
              </van-popover>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="uni-column flex-item" style="height: 2rem"
          v-if="is_context==1&&is_self==1&&(momentInfo.status==3||momentInfo.status==2)">
      <button style="width: 6rem;height:1.8rem;margin-top:2rem;font-size: 0.747rem;line-height: 2rem"
              type="default" @click="goPublish">重新编辑
      </button>
    </view>
    <view>
      <view class="moment-good-list" v-if="goods!=undefined&&goods.count>0">
        <svg t="1611465849341" class="icon moment_detail_zan_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7082"><path d="M511 944.3c-7 0-13.7-2-19.5-5.9-85.4-57.2-145.4-100-194.5-138.8-56.7-44.8-98.4-83.9-131-123.1-34.7-41.6-59.3-83.7-75.2-128.8-15.5-44-23.2-92.6-23.7-148.5v-0.3c0-47 13.6-92.5 39.4-131.8 26-39.6 62.3-69.8 105.2-87.4 27.5-11.3 56.9-17 87.3-17 22.4 0 45.1 3.1 67.7 9.3 48.3 13.2 95.7 40 141.1 79.6l3.3 2.9 3.3-2.8c45.9-39.7 93.7-66.5 142-79.7 22.5-6.1 45.3-9.2 67.5-9.2 30.6 0 60 5.8 87.5 17.2 42.6 17.7 78.7 47.9 104.4 87.5 25.4 39.1 38.9 84.6 38.9 131.4v0.2c0.5 55.9-6.6 104.4-21.6 148.5-15.4 45.3-39.8 87.6-74.6 129.2-32.7 39.3-74.6 78.4-131.8 123.2-49.7 38.9-110.3 81.7-196.6 138.6-5.6 3.7-12.2 5.7-19.1 5.7zM299.1 232.6c-21.3 0-41.8 4-60.8 11.8-60.5 24.9-101.1 86.9-101.2 154.4 0.8 96.1 24.7 163.6 82.6 232.9 65.1 78 177.2 158.4 288.6 233.7l2.8 1.9 2.8-1.9c190.4-126.9 252.3-187.2 291-233.5 57.6-69.1 80.8-136.5 79.9-232.6v-0.3c0-67.5-40.3-129.6-100.2-154.5-18.9-7.8-39.3-11.8-60.7-11.8-16.1 0-32.6 2.3-49.1 6.8-46.6 12.7-93.4 42.2-139.1 87.9-6.6 6.6-15.4 10.2-24.7 10.2h-0.1c-9.2 0-18.3-3.8-24.8-10.4-45.1-45.5-91.4-75-137.8-87.7-16.5-4.6-33-6.9-49.2-6.9z" p-id="7083" fill="#62697b"></path></svg>
        <view class="img_box">
          <!-- 点赞的头像列表-->
          <image v-for="item in goods.heard_img" :src="item" ></image>
        </view>
      </view>
      <view style="position: relative;margin-bottom: 2.67rem" v-show="momentInfo.reply&&momentInfo.reply.length>0">
        <svg t="1611383159423" class="icon moment-reply-icon" viewBox="0 0 1058 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2177" width="12" height="12"><path d="M330.744242 885.372121l194.779798-129.861818 16.665859-11.106263h383.844848c36.486465 0 66.19798-29.659798 66.19798-66.146262v-529.19596c0-36.434747-29.711515-66.107475-66.19798-66.107475H132.305455c-36.486465 0-66.146263 29.659798-66.146263 66.107475v529.19596c0 36.486465 29.659798 66.146263 66.146263 66.146262h198.438787v140.968081m-66.146262 123.578182V810.550303H132.305455c-73.024646 0-132.305455-59.216162-132.305455-132.292525v-529.19596C0 76.024242 59.267879 16.808081 132.305455 16.808081h793.742222c73.076364 0 132.357172 59.216162 132.357171 132.240808v529.195959c0 73.076364-59.267879 132.292525-132.357171 132.292526h-363.830303L264.59798 1008.950303z m0 0" p-id="2178" fill="#62697b"></path></svg>
        <view>
          <view class="moment-content-list" v-for="(r,i) in momentInfo.reply" :key="i">
            <view class="moment-content-list-detail" :class="i==activeIndex?'moment-content-list-detail-active':''" v-if="r.reply_name==''" @click="replyCurrent(r)" :style="i==momentInfo.reply.length-1?'marginBottom:0.3rem;':''" @longtap.stop="showList(r,i)" >
              <view style="width:100%; font-size: 0.6rem;" :style="i==momentInfo.reply.length-1?'marginBottom:0.4rem':''">
                <image :src="r.reply_avatar" ></image>
                <view class="moment-content-one-box">
                  <view class="moment-content-list-name"  >
                    <text @click.stop="toUserList(r)" >{{r.one_name}}</text>
                    <text class="moment-content-list-date">{{r.create_time}}</text>
                  </view>
                  <view v-html="r.content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi,emotion)" class="reply-content" :class="i==activeIndex?'reply-content-active':''"></view>
                </view>
                <view v-show="r.is_dels==1&&i==activeIndex" class="del-box">
                  <view class="del-content" @click.stop="delCommond(r.id)">删除</view>
                </view>
              </view>
            </view>
            <view class="moment-content-list-detail" v-else @click="sendReplyCurrent(r)" :style="i==momentInfo.reply.length-1?'marginBottom:0.3rem;':''" @longtap.stop="showList(r,i)">
              <view style="width:100%;font-size: 0.6rem;" :style="i==momentInfo.reply.length-1?'marginBottom:0.4rem':''">
                <image :src="r.reply_avatar" ></image>
                <view class="moment-content-reply-box">
                  <view class="moment-content-list-name">
                    <text @click.stop="toUserList(r)">{{r.one_name}}</text>
                    <text class="moment-content-list-date">{{r.create_time}}</text>
                  </view>
                  <view style="line-height:0.8rem;">
                    <text class="reply-text">回复</text>
                    <text class="reply-text-name"  @click.stop="toReplyUserList(r)">{{r.reply_name}}</text>
                    <text v-html="r.content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi,emotion)" class="reply-content"></text>
                  </view>
                </view>
              </view>
              <view v-show="r.is_dels==1&&i==activeIndex" class="del-box">
                <view class="del-content" @click.stop="delCommond(r.id)">删除</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <uni-popup ref="popup3" type="center">
        <view style="width: 15rem;height: 7rem;padding: 1.3rem 0.8rem 0;background: #FFF;border-radius: 0.267rem">
          <view style="width: 100%;height: 5rem;border-bottom: 1px solid #CCC;font-size: 0.747rem">
            {{titleText}}
          </view>
          <view
              style="width: 100%;height:2rem;font-size: 0.747rem;line-height: 2rem;border-radius: 0 0 0.267rem 0.267rem"
              @click="closeTitle" type="default">我知道了
          </view>
        </view>
      </uni-popup>
    </view>
    <van-popup v-model="momentBox" v-if="momentInfo.status==1&&!notUser==1&&momentInfo.can_goods==1" overlay-class="moment-box-pbg" :lock-scroll="false" :overlay="false" round position="bottom" class="moment-Box" close-icon="close" :close-on-click-overlay="false">
      <view class="send-moment-box">
        <image src="../../static/assets/icon_smile.png" class="moment-face" @click="isEmotionChildShow=true" v-if="!isEmotionChildShow"></image>
        <image src="../../static/assets/icon_keyboard.png" class="moment-face" @click="isEmotionChildShow=false" v-if="isEmotionChildShow"></image>
        <textarea
            v-model.trim="momentText"
            class="moment-textarea"
            auto-height="true"
            style="height:1.6rem !important;"
            ref="can-input"
            :placeholder="textPlaceholder"
        >
        </textarea>
        <view class="send-moment" @click="sendComment">发送</view>
      </view>
      <emoji-input-method @onFaceChoose="handleFaceChoose" v-if="isEmotionChildShow"></emoji-input-method>
    </van-popup>

    <Footer v-if="is_show_copyright == 1" :class="momentInfo.status==1&&momentInfo.reply!=[]?'footClass':'footAClass'"></Footer>
  </view>

</template>

<script>
import UniGridItem from "../../components/uni-grid-item/uni-grid-item";
import videoplayer from "../../components/videoplayer/bw-videoPlayer";
import TextShow from "../../components/sunui-grand";
import EmojiInputMethod from '@/components/Emotion/emoji';
import WEmoji from "@/static/js/wechatEmoji.js"
import { Popover,Toast,Popup,Dialog } from 'vant';
import faceJSON from "@/components/Emotion/face.json";
import websocket from '@/static/js/websocket';
import moment from 'moment';
import Footer from "@/components/footer/footer";

export default {
  name      : "detail",
  inject    : ['initPage', 'getExternalId', 'getParameter', 'getChatId', 'forbidden', 'getContext','getCopyright'],
  components: {UniGridItem, TextShow, videoplayer,EmojiInputMethod,Footer},
  data () {
    return {
      titleText          : '朋友圈内容已粘贴至剪切板，图片已全部保存至本地，你可前往企业微信App--工作台--客户朋友圈进行发布',
      h5Url              : this.$store.state.h5Url,
      timeId             : '',
      corpId             : '',
      exd                : '',
      uid                : '',
      momentId           : '',
      settingId          : '',
      is_self            : '',
      timestamp          : '',
      timestamp2         : '',
      timeLineId         : '',
      setId              : '',
      videoContext       : {},
      userAvatar         : '',
      userName           : '',
      momentInfo         : {},
      imageList          : [],
      commonUrl          : this.$store.state.commonUrl,
      wx                 : false,
      wxWork             : false,
      jsApiList          : '',
      is_context         : 1,
      showPopover        : true,
      momentBox          : true,
      momentText         : '',
      isEmotionChildShow : false,
      showMoreBox        : false,
      active             : 0,
      faceData           : faceJSON,
      faceIndex          : 0,
      chooseFace         : [],
      reply_id           : '',
      user_id            : localStorage.getItem('user_id'),
      goods              : {},
      chatExternalUserIds: '',
      userPlatform       : localStorage.getItem('userPlatform'),//客户端平台，pc端other，安卓手机android，苹果手机ios
      replayContentId    : '',
      external_userid    : '',
      showDel            :false,
      activeIndex        :-1,
      textPlaceholder    :'评论',
      ext_id             :localStorage.getItem('external_int_id'),
      notUser            :0,
      lock               :false,
      is_show_copyright  :'',//是否展示底部版權
    }
  },
  computed: {
    faces: function () {
      const { faceData, faceIndex } = this
      const list = faceData[faceIndex].faceList
      let n = 0
      let listGrouped = []
      while (n * 21 < list.length) {
        listGrouped.push(list.slice(n * 21, (n + 1) * 21))
        n += 1
      }
      return listGrouped
    }
  },
  methods   : {
    endFn(){
      this.showMoreBox=false
      this.activeIndex=-1
      this.showDel=false
    },
    showList(r,i){
      if(r.is_dels==1){
        this.activeIndex=i
        this.showDel=true
      }
    },
    refresh(){
      this.is_show_copyright = localStorage.getItem('is_show_copyright')
      this.$forceUpdate()
    },
    async limit () {
      this.url = window.location.href
      let agent_id = sessionStorage.getItem('agent_id') || localStorage.getItem('agent_id') || this.getParameter('agentId') || this.getParameter('agent_id') || ''
      let user_id = this.getParameter('user_id') != null ? this.getParameter('user_id') : this.$route.query.user_id
      if (agent_id) localStorage.setItem('agent_id', agent_id)
      const {data: res} = await this.axios.post("chat-message/get-config", {
        url     : this.url,
        agent_id: agent_id ? agent_id : this.$route.query.agent_id
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
        if(this.wx){
          that.$store.state.wx.ready(function () {
            that.$store.state.wx.hideOptionMenu();
            // that.getLocation()
          })
        } else if (this.wxWork){
          that.$store.state.wx.hideMenuItems({
            menuList: ['menuItem:copyUrl'] // 要隐藏复制按钮
          })
        }
        this.ext_id=localStorage.getItem('external_int_id')
        this.user_id=localStorage.getItem('user_id')
        if((!this.ext_id)&&(!this.user_id)){
          this.notUser=1
        }
        that.getBanner()
        that.getDetail()
      }
    },
    toReplyUserList(r){
      const user=localStorage.getItem('user_id')
      if(user){
        if(r.reply_type==2||r.reply_type==0){
          uni.navigateTo({
            url: '/pages/customDetail/index?user_id=' +localStorage.getItem('user_id')+'&external_userid='+r.reply_userid+'&agent_id=' + (this.getParameter('agent_id') ? this.getParameter('agent_id') : this.getParameter('agentId')) + "&page=1"
          });
        }else if(r.reply_type==1){
          Toast('您与该客户已不存在好友关系，您无法再进入其客户详情页');
        }else if(r.reply_type==-1){
          Toast('互为内部员工，无法进入客户详情页');
        }
      }else{
        return
      }
    },
    toUserList(r){
      const user=localStorage.getItem('user_id')
      if(user){
        if(r.is_info==1&&(r.type==2||r.type==0)){
          uni.navigateTo({
            url: '/pages/customDetail/index?user_id=' +localStorage.getItem('user_id')+'&external_userid='+r.external_userid+'&agent_id=' + (this.getParameter('agent_id') ? this.getParameter('agent_id') : this.getParameter('agentId')) + "&page=1"
          });
        }else if(r.type==1){
          Toast('您与该客户已不存在好友关系，您无法再进入其客户详情页');
        }else if(r.type==-1){
          Toast('互为内部员工，无法进入客户详情页');
        }
      }else{
        return
      }

    },
    //再次回复
    sendReplyCurrent(i){
      if(i.is_delete==0&&this.momentInfo.can_goods==1&&this.notUser!==1){//可以删
        this.reply_id=i.id
        this.momentBox=true
        this.textPlaceholder=`回复${i.one_name}`
        this.$nextTick(() => {//调键盘弹起
          this.$refs['can-input'].$refs.textarea.focus()
        })
      }
    },
    //微信对话
    toChat () {
      this.chatExternalUserIds = localStorage.getItem('external_int_id')
      this.openEnterpriseChat()
    },

    //打开会话
    openEnterpriseChat () {
      let _this = this
      _this.$store.state.wx.openEnterpriseChat({
        // 注意：userIds和externalUserIds至少选填一个。内部群最多2000人；外部群最多500人；如果有微信联系人，最多40人
        userIds        : '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
        externalUserIds: _this.chatExternalUserIds, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
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
      })
    },
    delCommond(id){
      var that=this
      this.activeIndex=-1
      uni.showModal({
        title: '删除该评论？',
        success: async function (res) {
          if (res.cancel) {
          }else{
            const res= await that.axios.post('moments-web/moment-reply',{
              momentId   : that.momentId,
              corp_id    : that.getParameter('corpid'),
              user_id    : localStorage.getItem('user_id'),
              external_id: localStorage.getItem('external_int_id'),
              context    : that.momentText,
              replay_id   :id-0,
              is_del     :1,
            })
            if(res.error==0){
              Toast('删除成功');
            }else if(res.error==1){
              Toast('删除失败');
            }
            that.getDetail()
          }
        }
      })
    },
    replyCurrent(i){
      if(i.is_delete==1){
        //不能回复
      }else if(i.is_delete!=1&&this.momentInfo.can_goods==1&&this.notUser!==1){
        this.reply_id=i.id
        this.momentBox=true
        this.textPlaceholder=`回复${i.one_name}`
        this.$nextTick(() => {//调键盘弹起
          this.$refs['can-input'].$refs.textarea.focus()
        })
      }
    },

    async sendComment(){
      if(!this.momentText) return
      if(this.lock){
        return
      }
      this.lock=true

      const {data: res} = await this.axios.post('moments-web/moment-reply', {
        momentId: this.momentId,
        corp_id: this.getParameter('corpid'),
        user_id: localStorage.getItem('user_id'),
        external_id: localStorage.getItem('external_int_id'),
        context: this.momentText,
        replay_id: this.reply_id
      })
      this.lock = false
      this.reply_id = ''
      this.momentText = ''
      this.getDetail()
      this.textPlaceholder = '评论'
      this.showMoreBox = false
    },
    emotion(res) {//处理评论的表情
      let word = res.replace(/\#|\;/gi, '')
      const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手']
      let index = list.indexOf(word)
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
    },
    handleFaceChoose (face) {
      this.faceData[0].faceList.forEach(item=>{
        if(item.title==face){
          this.chooseFace=`#${item.title};`
        }
      })
      this.momentText=this.momentText+this.chooseFace
    },
    showMoment(){
      this.momentBox=true
      this.textPlaceholder='评论'
      this.showMoreBox=false
      this.reply_id=''
      this.$nextTick(() => {//调键盘弹起
        this.$refs['can-input'].$refs.textarea.focus()
      })
    },
    async addGood(){//点赞
      const {data:res}=await this.axios.post('moments-web/moment-good',{
        momentId:this.momentId,
        corp_id: this.getParameter('corpid'),
        user_id:localStorage.getItem('user_id'),
        external_id: localStorage.getItem('external_int_id'),
      })
      this.showMoreBox=false
      this.getDetail()
    },
    showMore(action) {
      this.showMoreBox=!this.showMoreBox
    },
    async getBanner () {
      const {data: res} = await this.axios.post('moments-web/moment-setting', {
        userid : this.getParameter('userid') != null ? this.getParameter('userid') : '',
        corp_id: this.getParameter('corpid'),
        user_id: localStorage.getItem('user_id'),
      })
      if (res.data) {
        if (res.data.heard) {
          if (res.data.default_heard != 1) {
            this.userAvatar = this.commonUrl + res.data.heard
          } else {
            this.userAvatar = res.data.heard
          }
        } else {
          this.userAvatar = require('../../static/assets/userHeader.png')
        }
        this.userName = res.data.name
        this.setId = res.data.id
        this.settingId = res.data.id
        this.is_self = res.data.is_self
        this.is_context = res.data.is_context
        // this.getDetail()
      }
    },
    hideBack () {
      let back = document.getElementsByClassName('uni-page-head-btn')[0]
      back.style.display = 'none';
    },
    async getDetail () {
      const {data: res} = await this.axios.post('moments-web/moment-detail', {
        momentId: this.getParameter('id'),
        corp_id : this.getParameter('corpid'),
        extId   : localStorage.getItem('external_int_id'),
        is_self : this.is_self,
        userId  : localStorage.getItem('user_id')
      })
      this.momentInfo = res.data
      this.goods=res.data.goods
      this.external_userid=localStorage.getItem('external_int_id')
      let time = this.momentInfo.create_time
      time = time.split(' ')
      time[1] = time[1].split(':').slice(0, 2).join(',').replace(',', ':')
      time = time.join(',').replace(',', ' ')
      this.momentInfo.create_time = time
      this.timeLineId = res.data.timeLine
      if (res.data.timeLine != 0) {
        this.timeId = setInterval(() => {
          this.leave()
        }, 300)
        localStorage.setItem('moment-detail', this.timeId);
      }
      if (this.momentInfo.type == 2) {
        this.imageList = []
        this.momentInfo.info.map((info) => {
          this.imageList.push(this.commonUrl + info.local_path)
        })
      }
      uni.hideLoading()
    },
    leave () {
      this.ws.websocketSend(
          JSON.stringify({
            channel: "pull",
            info   : {
              type      : 2,
              timeLine  : this.timeLineId,
              momentType: 2,
              settingId : this.setId
            }
          })
      )
    },
    goToMoment () {
      let url = this.h5Url + '/h5/pages/moments/list?user_id=' + this.getParameter('userid') + '&corpid=' + this.getParameter('corpid') + '&agentId=' + this.getParameter('agentId')
      window.location.href = url
    },
    previewImage (index) {
      uni.previewImage({
        current: index,
        urls   : this.imageList
      })
    },
    playVideo () {
      this.videoContext.requestFullScreen()
    },
    endVideo () {
      this.videoContext.pause()
      this.videoContext.seek(0)
    },
    fullscreenchange (e) {
      if (!e.detail.fullScreen) {
        this.endVideo()
      }
    },
    viewNews () {
      window.location.href = this.momentInfo.info.url
    },
    momentGood () {
      let hasGood = this.momentInfo.has_good
      if (hasGood) {
        this.momentInfo.goods_sum--
      } else {
        this.momentInfo.goods_sum++
      }

      this.momentInfo.has_good = !this.momentInfo.has_good
    },
    goPublish () {
      localStorage.setItem('momentId', this.momentInfo.id)
      localStorage.setItem('attachmentId', '')
      uni.navigateTo({
        url: '/pages/moments/publish?user_id=' + localStorage.getItem('user_id') + '&corpid=' + localStorage.getItem('corpid') + '&momentId=' + this.momentInfo.id + '&type=' + this.momentInfo.type + '&agentId=' + this.getParameter('agentId')
      })
    }
  },
  onLoad () {
    uni.showLoading({
      title   : '加载中...',
      duration: 2000
    });
    this.corpId = this.getParameter('corpid')
    this.momentId = this.getParameter('id')
    this.uid = this.getParameter('userid')
    this.exd = this.getParameter('exd')
    this.timestamp = Date.parse(new Date())

    // localStorage.setItem('corpid', '')
    // localStorage.setItem('user_id', 'Jiangpeng')
    // localStorage.setItem('external_int_id','2374387')
    // localStorage.setItem('external_int_id', '4652')
    // localStorage.getItem('time')
    // this.getUserInfo()

    // let _this = this
    // this.corpid = this.getParameter('corpid')
    // _this.$store.dispatch('setWx', () => {
    //   _this.initPage(_this.limit)
    // })
    // if (!this.wxWork) {
    //   // this.$store.state.wx.hideOptionMenu();
    // }
  },
  onReady () {
    this.videoContext = uni.createVideoContext('momentVideo');
  },
  onShow () {
    setTimeout(()=>{
      this.getBanner()
    },300)

    this.wx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') === -1
    this.wxWork = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') !== -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') !== -1

    let _this = this
    this.corpid = this.getParameter('corpid')
    _this.$store.dispatch('setWx', () => {
      _this.initPage(_this.limit)
    })

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
        'hideMenuItems',
        'onMenuShareAppMessage',
        'onMenuShareWechat',
        'onMenuShareTimeline',
        'shareAppMessage',
        'shareWechatMessage',
        'shareToExternalContact',
        'getLocation'
      ]
    }

  },
  onUnload() {
    clearInterval(this.timeId)
    this.ws.websocketClose(JSON.stringify({
      channel: "pull",
      info   : {
        type      : 2,
        timeLine  : this.timeLineId,
        momentType: 2,
        settingId : this.setId
      }
    }))
  },
  mounted () {
    let currentPages = getCurrentPages()
    if (currentPages.length > 1) {
      let lastPage = currentPages[currentPages.length - 2].route
      if (lastPage != 'pages/moments/list') {
        this.hideBack()
      }
    } else {
      this.hideBack()
    }
  },
}
</script>

<style scoped>
@import "~@/static/css/uni.css";
</style>

<style scoped lang="less">
/deep/ .uni-page-head {
  z-index: 999999999;
}

.logo {
  .success {
    width: 4rem;
    height: 1.3rem;
    padding: 0px;
    font-size: 0.647rem;
    line-height: 1.3rem;
    background-color: #359FEC;
    color: #FFF;
  }

  .failed {
    width: 4rem;
    height: 1.3rem;
    padding: 0px;
    font-size: 0.647rem;
    line-height: 1.3rem;
    background-color: #FF5500;
    color: #FFF;
  }
}

.text_show {
}

.copy {
  font-size: 0.64rem;
  color: #4B9EFC
}

.moment-info-box {
  padding: 0.533rem /* 10/18.75 */;

  .moment-user {
    width: 2.133rem /* 40/18.75 */;

    .moment-avatar {
      width: 2.133rem /* 40/18.75 */;
      height: 2.133rem /* 40/18.75 */;
      border-radius: 0.267rem /* 5/18.75 */;
      overflow: hidden;
    }
  }

  .moment-flex {
    -webkit-flex: 1;
    flex: 1;

    &-content {
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }
  }

  .reply-text{
    font-weight: bold;
    font-size: 0.7rem;
    color: #2A3349 !important;
  }

  .reply-text-name{
    color: #687696;
    margin: 0 0.213rem;
    font-weight: bold;
    font-size: 0.7rem;
  }

  .moment-more{
    padding: 0.107rem 0.373rem;/*2/18.75  7/18.75*/
    background: #f8f8f8;
    border-radius: 0.16rem;/*3/18.75*/
    color: #576b95;
    line-height: 1.8rem;
  }

  .moment_detail_zan_icon{
    position: absolute;
    top: 0.68rem;
    left: 0.4rem;
    z-index: 1;
    width: 0.9rem;
    height: 0.9rem;
    padding: 0.15rem;
  }

  .moment-good-list{
    line-height:1rem;
    font-size: 0.6rem;
    position: relative;
    background: #f7f7f7;
    //border-bottom: 1px solid #eeeeee;
    padding:0.3rem  0.5rem;
    margin-bottom: 0.06rem;
  }

  .moment_detail_zan_name{
    font-style: normal;
    padding: 0.3rem;/* 5/18.75*/
    padding-left: 0.1rem;/* 25/18.75 */
    display: inline;
    color: #4c5e87;
    background: #f7f7f7;
    padding-right:0px;
    font-weight: bold;
    font-size: 0.7rem;
  }

  .moment-content-list-detail{
    display: flex;
    font-size: 0.6rem;
    padding: 0.3rem 0.5rem;
    background: #f7f7f7;
    word-break: break-all;
    padding-bottom: 0rem;
    position: relative;
    padding-left:1.8rem;
  }

  .moment-content-list-detail:focus{
    background: #e4e4e3;
  }

  .moment-content-list-name{
    color: #687696;
    font-weight: bold;
    font-size: 0.65rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .moment-content-list-date{
    font-size:0.48rem;
  }

  .moment-action-box{
    display: flex;
    background:#595959 ;
    border-radius: 0.2rem;
  }

  .moment-action-box-inner{
    color: #fff;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
    padding: 0.2rem 0.75rem;
  }

  .moment-action-box-inner1{
    //padding-left: 0.4rem;
    //padding-right: 0.4rem;
    padding: 0.2rem 0.4rem;
    display: flex;
    align-items: center;
  }

  .moment-zan,.moment-recomd{
    width:0.747rem;
    height:0.747rem;
    margin-right: 0.2rem;
  }


  /deep/.moment-input .van-field__control{
    margin-top: -0.16rem;/*3/18.75*/
  }

  .moment-face{
    //margin: 0 0.267rem;/*5/18.75*/
    width:1.1rem;
    height:1.1rem;/*25/18.75*/
    margin-bottom: 0.3rem;
  }

  .moment-textarea{
    box-sizing: border-box;
    //height:4.907rem;/*92/18.75*/
    width: calc(100% - 5rem);
    //margin: 0.17rem;/*8/18.75*/
    resize: none;
    font-size: 0.747rem;
    background: #fff;
    //border: 1px solid #d9d9d9;
    border-radius: 0.213rem;/*4/18.75*/
    text-align: left;
    //padding:0.267rem;/*5/18.75*/
    min-height:1.8rem !important;
    line-height: 1.3rem !important;
    max-height:3.2rem;
    padding: 0.3rem;
  }

  /deep/ .uni-textarea-textarea{
    overflow-y: scroll !important;
  }

  .send-moment{
    color: #fff;
    background-color: #108ee9;
    border-color: #108ee9;
    border: 1px solid transparent;
    width:2.5rem;/*70/18.75*/
    height: 1.5rem;
    line-height: 1.5rem;
    //margin-right: 0.4267rem;
    font-size: 0.64rem;
    border-radius: 0.15rem;
    margin-bottom: 0.09rem;
  }
  .moment-Box{
    box-shadow: 0px -2px 1px 0px rgba(0,0,0,.02);
    border-top: 1px solid rgba(0,0,0,.05);
    border-radius: 0px;
    align-items: center;
    z-index: 2006;
    background: #f9f9f9;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .send-moment-box{
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding:0.4rem 0.3rem;/*5/18.75*/ /*10/18.75*/
  }

  .reply-content{
    word-break: break-all;
    font-size: 0.75rem;
    max-width: 92%;
    color: #000;
  }

  .reply-content:focus{
    background: #cecece;
  }

  /deep/.reply-content img{
    width: 1.07rem;
    height:1.07rem;
  }

  /deep/.moment-box-pbg{
    background: transparent !important;
  }

  .qwdh{
    font-size: 0.533rem;
    color: rgb(53, 130, 251);
    float: right;
    position: absolute;
    right: 0.693rem;
    top: 0px;
    display: flex;
    align-items: center;
  }

  .noUser{
    color: #8f8f94;
  }
  /deep/.van-dialog__footer{
    display: flex !important;
  }

  .moment-info {
    position: relative;
    text-align: left;
    font-size: 0.853rem /* 16/18.75 */;
    padding: 0 0.533rem /* 10/18.75 */;

    .moment-name {
      font-size: 0.747rem /* 14/18.75 */;
      color: #5077B7;
      font-weight: bold;
      line-height: 0.8rem /* 15/18.75 */;
    }

    .moment-content {
      font-size: 0.747rem /* 14/18.75 */;
      margin-top: 0.48rem /* 9/18.75 */;
      word-break: break-word;
    }

    .moment-media-box {
      margin-top: 0.533rem /* 10/18.75 */;

      .moment-news {
        background-color: #F7F7F7;
        padding: 0.534rem /* 5/18.75 */;

        .news-title {
          font-size: 0.747rem /* 14/18.75 */;
          height: 1.387rem /* 26/18.75 */;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 1;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .news-des {
          color: #999999;
          font-size: 0.64rem /* 12/18.75 */;
          height: 1.067rem /* 20/18.75 */;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 1;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }

    .moment-footer {
      display: flex;
      justify-content: space-between;
      .moment-date {
        font-size: 0.64rem /* 12/18.75 */;
        color: #B3B3B3;
        margin-top: 0.5rem;
      }

      .moment-action {
        font-size: 0.64rem /* 12/18.75 */;
        text-align: center;
        display: flex;

        &.has-goods {
          color: red;
        }

        .good-icon,
        .good-sum {
          font-size: 0.64rem /* 12/18.75 */ !important;
          vertical-align: middle;
          display: inline-block;
        }

        .good-icon {
          line-height: 0.64rem /* 12/18.75 */;
          margin-right: 0.107rem /* 2/18.75 */;
        }
      }
    }
  }
}
.img_box{
  text-align: left;
  padding-left: 1.2rem;
  line-height:0.8rem;
}

/deep/.img_box uni-image{
  width: 1.5rem;
  height: 1.5rem;
  padding:0.16rem ;
}

/deep/.img_box uni-image div,.moment-content-list-detail uni-image{
  border-radius: 0.15rem;
}

.moment-content-list-detail uni-image{
  width: 1.5rem;
  height: 1.5rem;
  float: left;
  top: 0.2rem;
  margin-right: 0.4rem;
}

.moment-content-reply-box {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.moment-content-one-box{
  text-align: left;
  display: flex;
  flex-direction: column;
}

.del-box{
  position: absolute;
  width: 5.33rem;
  right: 20%;
  bottom: -1.3465rem;
  height: 2.5rem;
  background: #ffffff;
  color: #000;
  border-radius: 0.107rem;
  box-shadow: 0px 0px 0.53rem rgba(0, 0, 0, 0.1);
  z-index: 10000;
}

.del-content{
  height: 2.67rem;
  line-height: 2.5rem;
  text-align: center;
  font-size: 0.8rem;
}

.moment-reply-icon{
  position: absolute;
  top: 0.7rem;
  left: 0.5rem;
  z-index: 100;
  width: 0.75rem;
  height: 0.8rem;
  padding: 0.15rem;
}
.moment-content-list-detail-active{
  background:#e5e5e5 !important;
}
.reply-content-active{
  background:#cecece;
}
.footClass{
  position: relative;
  margin-top:40px;
  bottom: 40px;
  left: 0;
  right: 0;
}

.footAClass{
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>

