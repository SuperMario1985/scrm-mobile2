<template>
  <view>
    <view class="moment-flex" v-for="(item,index) in momentList" v-if="momentList!=[]" @click="toDetail(item)">
      <view class="moment-user">
        <image
            :src="item.user_info.avatar"
            class="moment-avatar"
            mode="aspectFit"
        ></image>
      </view>

      <view class="moment-inner-box"><!-- 评论-->
        <view class="moment-name" >{{item.user_info.name}}</view>
        <view v-if="item.reply.status==0&&item.type==2" class="del-content-text">该条评论已删除</view>
        <view v-if="item.reply.status==1&&item.type==2" class="moment-content">
          <text v-if="item.reply.reply_id">回复
            <text class="moment-name" style="margin:0 0.1rem;" v-if="item.reply_user" >{{item.reply_user.name}}</text>
            <text class="moment-name" style="margin:0 0.1rem;" v-else >{{nickname}}</text>
          </text>
          <text v-html="item.reply.content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi,emotion)" class="em"></text>
        </view>
        <svg v-if="item.type==1" t="1610523854710" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7763" width="16" height="16"><path d="M705.386667 177.536c56.682667 0 109.546667 22.122667 148.8 62.272 76.522667 78.272 72.490667 207.232-9.002667 287.424L509.738667 857.493333 174.250667 527.253333c-81.472-80.213333-85.525333-209.152-9.002667-287.424 39.274667-40.170667 92.117333-62.272 148.8-62.272 55.189333 0 107.029333 21.12 145.962667 59.413334l49.706666 48.938666 49.706667-48.938666a206.741333 206.741333 0 0 1 145.962667-59.434667M314.069333 106.688c-72.512 0-144.981333 27.861333-199.488 83.605333-105.024 107.456-97.109333 282.048 9.962667 387.456L476.586667 924.288a47.125333 47.125333 0 0 0 66.261333 0l352.021333-346.538667c107.093333-105.408 114.986667-280.021333 9.962667-387.456-54.485333-55.744-126.997333-83.605333-199.488-83.605333-70.826667 0-141.610667 26.602667-195.648 79.786667-53.973333-53.205333-124.821333-79.786667-195.626667-79.786667z" fill="#707070" p-id="7764"></path></svg>
        <view class="moment-time">{{item.create_time}}</view>
        <view class="moment-pic-view">
          <view  v-if="item.base_type==1">{{item.image}}</view><!-- 文本-->
          <image :src="commonUrl+item.image" v-if="item.base_type==2||item.base_type==4" style="width:100%;height:100%;"></image><!-- 图片-->
          <view v-if="item.base_type==3" class="cover"></view>
          <video v-if="item.base_type==3" width="2.667rem" show-center-play-btn="false">
            <source :src="item.image">
          </video><!-- 视频-->
          <view :src="item.image" v-if="item.base_type==4"></view><!-- 链接-->
        </view>
      </view>
    </view>
    <view class="look_more"  v-if="allLoad">已加载全部</view>
    <view class="look_more" @click="toLookMore" v-else>查看更早的消息...</view>

    <Footer v-if="is_show_copyright == 1" style="position: relative;bottom: 0px;left: 0px;right: 0px;margin-top: 10px;"></Footer>
  </view>
</template>

<script>
import moment from 'moment'
import Footer from "@/components/footer/footer";
export default {
  name      : "notice",
  inject    : ['initPage', 'getParameter', 'getExternalId','getCopyright'],
  components: {
    Footer
  },
  data () {
    return {
      commonUrl        : this.$store.state.commonUrl,
      is_new           : 1,
      momentList       : [],
      pageSize         : 0,
      total_count      : 0,
      page             : 0,
      page_count       : 1,
      allLoad          : false,
      islook           :false,
      corpid           :this.getParameter('corpid'),
      nickname         :localStorage.getItem('nickname'),
      count            :0,
      is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
      jsApiList        : [],
      ticketData       : [],
      agentData        : '',
      wx               : false,
      wxWork           : false,
    }
  },
  mounted () {
  },
  methods   : {
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
        that.$store.state.wx.error(function (res) {
          uni.showToast({
            title   : res.errMsg,
            image   : '/static/fail.png',
            duration: 2000
          });
        })

        if(this.wx) {
          that.$store.state.wx.ready(function () {
            that.$store.state.wx.hideOptionMenu();
          })
        }
        if(this.wxWork){
          that.$store.state.wx.ready(function () {
            that.$store.state.wx.hideMenuItems({
              menuList: ['menuItem:copyUrl'] // 要隐藏的菜单项
            });
          })
        }
        // that.getLocation()

      }
    },
    toDetail(item){
      if(item.moment_status==1){//表示删除了
        uni.showModal({
          title: '提示',
          showCancel: false,
          content: '该内容已不可见',
          success: function (res) {
          }
        });
      }else{
        uni.navigateTo({
          url: '/pages/moments/detail?id=' + item.moment_id + '&userid=' + this.getParameter('moment_user_id') + '&user_id=' + localStorage.getItem('user_id') + '&corpid=' + localStorage.getItem('corpid') + '&exd=' + localStorage.getItem('external_int_id') + '&agentId=' + this.getParameter('agentId')
        })
      }
    },
    refresh(){
      this.is_show_copyright = localStorage.getItem('is_show_copyright')
      this.$forceUpdate()
    },
    emotion(res) {//处理评论的表情
      let word = res.replace(/\#|\;/gi, '')
      const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手']
      let index = list.indexOf(word)
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`
    },
    async getNoticeList(is_new){
      const {data:res}=await this.axios.get('moments-web/moment-remind',{
        params:{
          user_id       : localStorage.getItem('user_id'),
          is_new        : is_new,
          pageSize      : 10,
          page          : this.page,
          external_id   : localStorage.getItem('external_int_id'),
          moment_user_id: this.getParameter('moment_user_id'),
          corp_id       : this.getParameter('corpid'),
        }
      })
      if(is_new==1){
        this.momentList=res.data.data
        this.page_count=res.data.page_count || 1
      }else if(is_new==0){
        this.count++
        if(this.count==1){
          this.momentList=[]
        }
        this.momentList=[...this.momentList,...res.data.data]
        this.momentList.forEach(item=>{
          var res=new Date(item.create_time).getTime()
        })
        this.page_count=res.data.page_count || 1
        this.total_count=res.data.total_count
      }
    },
    toLookNewMore(){

    },
    toLookMore(){
      if(this.page_count>this.page){
        this.page++;
        this.getNoticeList(0)
      }else{
        this.allLoad=true
        return
      }
    },
  },
  onShow () {
    this.timestamp = Date.parse(new Date())
    this.wx = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') != -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') == -1
    this.wxWork = navigator.userAgent.toLocaleLowerCase().indexOf('micromessenger') != -1 && navigator.userAgent.toLocaleLowerCase().indexOf('wxwork') !== -1
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

    let _this = this
    this.corpid = this.getParameter('corpid')
    if (this.wx) {
      // 微信打开的则走wx.config
      _this.$store.dispatch('setWx', () => {
        _this.initPage(_this.limit)
      })
    } else {
      // 企业微信打开的不走wx.config，不会受地理位置影响
      this.corpid = this.getParameter('corpid') ? this.getParameter('corpid') : this.$route.query.corpid
      let agentId = this.getParameter('agentId') ? this.getParameter('agentId') : this.$route.query.agentId
      localStorage.setItem('agent_id', agentId)
      localStorage.setItem('corpid', this.corpid)
      _this.$store.dispatch('setWx', () => {
        _this.initPage(_this.limit)
      })
    }
    // 本地
    // localStorage.setItem('corpid', '')
    // localStorage.setItem('user_id', '')
    // localStorage.setItem('external_int_id', '')
  },
  onPullDownRefresh () {
    this.loadingText = '加载中...'
  },
  onLoad(){
    this.getNoticeList(1)
    uni.setNavigationBarTitle({
      title: '消息详情'
    });
  }
}
</script>

<style scoped>
.del-content-text{
  width: 5.5rem;
  font-size: 0.747rem;
  background: #cdcdcd;
  text-align: center;
}

.moment-user {
  width: 2.133rem /* 40/18.75 */;
  margin:0.7rem;
  box-sizing: border-box;
}

.moment-avatar {
  width: 2.133rem /* 40/18.75 */;
  height: 2.133rem /* 40/18.75 */;
  border-radius: 0.267rem /* 5/18.75 */;
  overflow: hidden;
}

.moment-flex {
  display: flex;
}

.moment-name {
  font-size: 0.747rem /* 14/18.75 */;
  color: #546883;
  font-weight: bold;
  line-height: 0.8rem /* 15/18.75 */;
  margin-bottom: 0.2rem;
}

.moment-inner-box{
  text-align: left;
  width: calc(100% - 2.133rem);
  margin: 0px 8px 0px 0px;
  padding-bottom: 3px;
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
  position: relative;
}

.moment-name{
  margin-top:0.7rem
}

.moment-content{
  font-size: 0.747rem /* 14/18.75 */;
  margin-top:0.4rem;
  flex-wrap: wrap;
  word-break: break-all;
  width: calc(100% - 4rem);
}

.moment-time{
  color: #a2a2a2;
  margin-top:0.4rem;
  font-size: 0.64rem /* 12/18.75 */;
}
.look_more{
  margin-top: 1.067rem;
  font-size: 0.853rem;
}
.moment-pic-view{
  width: 3.1rem;
  height:3.1rem;
  position: absolute;
  right: 0.533rem;
  top: 0.533rem;
  font-size: 0.64rem;
  overflow: hidden;
  padding-left:0.1rem;
  background: rgba(237, 237, 237);
  color: rgba(113, 113, 113);
  align-items: center;
  display: flex;
  justify-content: center;
}

.cover{
  background: transparent;
  width: 3.11rem;
  height: 3.1rem;
  position: absolute;
  z-index: 100;
}

.moment-content .em img{
  width:1rem;
  height:1rem;
}
</style>
