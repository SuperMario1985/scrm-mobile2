<script src="../../store/index.js"></script>
<template>
  <view class="box" v-if="isRead">
    <view>
      <image-cropper v-if="isImg==2" :src="tempFilePath" :crop-fixed="true" :crop-width="cropWidth"
                     :crop-height="cropHeight"
                     @confirm="confirm"
                     @cancel="cancel"></image-cropper>
      <view class="back-pic-box" v-if="!showSwiper" @click.stop.prevent="openPop">
        <image v-if="momentBackground[0]==commonUrl" src="../../static/assets/banaurl.png"></image>
        <image v-else :src="momentBackground[0]"></image>
      </view>

      <swiper v-if="showSwiper" indicator-dots="true">
        <swiper-item v-for="(img,key) in momentBackground" :key="key">
          <image :src="img"/>
        </swiper-item>
      </swiper>
    </view>

    <view class="moment-info">
      <view class="user-info-box">
        <image-cropper v-if="isImg==1" :src="tempFilePath" :crop-fixed="true" :crop-width="cropWidth"
                       :crop-height="cropHeight"
                       @confirm="confirm"
                       @cancel="cancel"></image-cropper>
        <view class="user-name" >
          <text class="userName">{{userName}}</text>
          <text v-if="corpName" class="corpName">@{{corpName}}</text>
        </view>
        <image @click="editImg" class="user-avatar" :src="userAvatar"></image>
        <text @click="editText" class="user-des"><span style="color: #FFF">2</span>{{customDes}}</text>
        <text class="user-tips" v-if="is_self==1&&is_synchro==1">每隔12小时自动同步官方朋友圈，不包含点赞与评论</text>
      </view>
      <view class="msg-info" v-if="showNotice">
        <view class="prompt-msg" @click="toNotice" >
          <image @click="editImg" class="prompt-msg-avatar" :src="msgAvatar"></image>
          <text class="prompt-msg-text">{{total_count}}条新消息</text>
        </view>
      </view>
      <view class="uni-flex uni-column list-box" :style="showNotice?'marginTop:0.5rem;':''">
        <view v-if="is_self==1&&wxWork&&isContext==1" class="flex-item flex-item-V">
          <view class="list-info">
            <view class="uni-flex uni-row">
              <view class="text moment-date">今天</view>
              <view class="moment-flex">
                <view class="moment-add">
                  <uni-icons type="plusempty" class="add-icon" @tap="actionSheetTap"></uni-icons>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="momentData.length>0" class="flex-item flex-item-V" v-for="(value, index) in momentData"
              :key="index">
          <view v-if="value && value.type!='ad'" class="list-info" style="position: relative">
            <view class="uni-flex uni-row">
              <view v-if="getMomentDateType(value.id) == 1"
                    class="text moment-date">
                {{getMomentDateStr(value.id)}}
                <view class="text flex-item logo" v-if="value.status==2">
                  <button class="success" @click="closeEditText" type="default">未审核
                  </button>
                </view>
                <view class="text flex-item logo" v-if="value.status==3">
                  <button class="failed" @click="closeEditText" type="default">审核失败
                  </button>
                </view>
              </view>
              <view v-else>
                <view class="uni-flex uni-row moment-date">
                  <view class="text moment-flex moment-day">{{getMomentDateDay(value.id)}}</view>
                  <view class="text moment-flex moment-month">{{getMomentDateMonth(value.id)}}</view>
                </view>
                <view class="text flex-item logo" v-if="value.status==2">
                  <button class="success" @click="closeEditText" type="default">未审核
                  </button>
                </view>
                <view class="text flex-item logo" v-if="value.status==3">
                  <button class="failed" @click="closeEditText" type="default">审核失败
                  </button>
                </view>
              </view>
              <view @tap="goDetail(value.id)" v-if="value.type == 1" class="moment-flex moment-list-text"
                    style="text-align: left">
                <!--								<view class="text moment-content">{{value.text}}</view>-->
                <pre class="text moment-content"
                     style="display:block;white-space: pre-wrap;word-wrap: break-word;">
											{{value.text}}
								</pre>
              </view>
              <view @tap="goDetail(value.id)" v-if="value.type == 2"
                    class="uni-flex uni-column moment-flex moment-flex-content">

                <view class="uni-flex uni-row">
                  <view class="text uni-flex"
                        style="width: 5.333rem  /* 100/18.75 */;height: 5.333rem  /* 100/18.75 */;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
                    <template v-if="value.info.length <= 2"
                              v-for="(image, k) in value.info">
                      <image
                          class="moment-list-image"
                          mode="aspectFill"
                          v-if="value.info.length == 1"
                          :src="$store.state.commonUrl + (image.s_local_path ? image.s_local_path : image.local_path)"
                          style="width: 5.333rem  /* 100/18.75 */;height: 5.333rem  /* 100/18.75 */;"></image>

                      <image
                          class="moment-list-image"
                          mode="aspectFill"
                          v-if="value.info.length == 2"
                          :src="$store.state.commonUrl +  (image.s_local_path ? image.s_local_path : image.local_path)"
                          style="width: 2.667rem  /* 50/18.75 */;height: 5.333rem  /* 100/18.75 */;"></image>
                    </template>

                    <template v-if="value.info.length == 3">
                      <image
                          class="moment-list-image"
                          mode="aspectFill"
                          :src="$store.state.commonUrl + (value.info[0].s_local_path ? value.info[0].s_local_path : value.info[0].local_path)"
                          style="width: 2.667rem  /* 50/18.75 */;height: 5.333rem  /* 100/18.75 */;"></image>
                      <view class="uni-flex uni-column">
                        <template v-for="(image, k) in value.info">
                          <image
                              class="moment-list-image"
                              v-if="k != 0"
                              mode="aspectFill"
                              :src="$store.state.commonUrl + (image.s_local_path ? image.s_local_path : image.local_path)"
                              style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;"></image>
                        </template>
                      </view>
                    </template>

                    <template v-if="value.info.length >= 4">
                      <view class="uni-flex uni-column">
                        <view class="uni-flex uni-row">
                          <template v-for="(image, k) in value.info">
                            <image
                                class="moment-list-image"
                                v-if="k < 2"
                                mode="aspectFill"
                                :src="$store.state.commonUrl + (image.s_local_path ? image.s_local_path : image.local_path)"
                                style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;"></image>
                          </template>
                        </view>
                        <view class="uni-flex uni-row">
                          <template v-for="(image, k) in value.info">
                            <image
                                class="moment-list-image"
                                v-if="k >= 2 && k <=3"
                                mode="aspectFill"
                                :src="$store.state.commonUrl + (image.s_local_path ? image.s_local_path : image.local_path)"
                                style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;"></image>
                          </template>
                        </view>
                      </view>
                    </template>
                  </view>
                  <view class="uni-flex uni-column moment-flex moment-flex-content">
                    <view class="text moment-content"
                          style="height: 4rem  /* 80/18.75 */;text-align: left;padding-left: 0.533rem  /* 10/18.75 */;">
                      {{value.text}}
                    </view>
                    <view v-if="value.type == 2 && value.info.length > 1" class="text"
                          style="font-size: 0.64rem  /* 12/18.75 */; color: #999999;height: 1.067rem  /* 20/18.75 */;text-align: left;padding-left: 0.533rem  /* 10/18.75 */;">
                      共 {{value.info.length}} 张
                    </view>
                  </view>
                </view>
              </view>

              <view @tap="goDetail(value.id)"
                    v-if="value.type == 3 && value.info !=[] && value.info !=null"
                    class="uni-flex uni-column moment-flex moment-flex-content">
                <view class="uni-flex uni-row">
                  <view
                      class="text uni-flex"
                      style="width: 5.333rem  /* 100/18.75 */;height: 5.333rem  /* 100/18.75 */;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
                    <videoplayer :url="value.info[0]?commonUrl + value.info[0].local_path:''"
                                 style="width: 5rem;height:5rem;margin: 0">
                    </videoplayer>
                  </view>
                  <view class="uni-flex uni-column moment-flex moment-flex-content">
                    <view class="text moment-content"
                          style="height: 4rem  /* 80/18.75 */;text-align: left;padding-left: 0.533rem  /* 10/18.75 */;">
                      {{value.text}}
                    </view>
                  </view>
                </view>
              </view>

              <view @tap="goDetail(value.id)"
                    v-if="value.type == 4"
                    class="moment-flex"
                    style="text-align: left">
                <view v-if="value.text !=''" class="text moment-text-news">
                  {{value.text}}
                </view>
                <view class="uni-flex uni-column moment-list-news">
                  <view v-if="value && value.info !={} && value.info !=null"
                        class="uni-flex uni-row moment-info-news">
                    <image v-if="value.info.pic_path && value.info.pic_path !=''"
                           mode="aspectFill"
                           :src="value.info.pic_path.substr(0, 1)=='/'?commonUrl+value.info.pic_path:value.info.pic_path"
                           style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;">
                    </image>

                    <image v-if="value.info.pic_path =='' || value.info.pic_path ==null"
                           mode="aspectFill"
                           src="../../static/assets/lj.png"
                           style="width: 2.667rem  /* 50/18.75 */;height: 2.667rem  /* 50/18.75 */;"></image>
                    <view
                        class="uni-flex uni-column moment-flex"
                        style="text-align: left; margin-left: 0.267rem  /* 5/18.75 */;">
                      <view class="text news-title">
                        {{value.info.title}}
                      </view>
                      <view class="text news-des">
                        {{value.info.description}}
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <!--					  信息流广告 -->
          <view v-if="value && value.type == 'ad'">
            <ad unit-id="adunit-01b7a010bf53d74e"></ad>
          </view>
        </view>

        <view v-if="momentData.length<1 && isShow==true">
          <img src="../../static/assets/empty.png"
               style="width: 50%; max-width: 17.92rem  /* 336/18.75 */;margin-top: 5.333rem  /* 100/18.75 */;"
               alt="">
        </view>
        <view v-if="momentData.length>0" class="loading">{{loadingText}}</view>
      </view>
      <uni-popup ref="popup" type="bottom">
        <view class="popupBottom">
          <view class="editBannel" @click="chooseImage">
            {{popupTitle}}
          </view>
          <view @click="close" class="clear">
            取消
          </view>

        </view>
      </uni-popup>
      <uni-popup ref="popup2" type="center">
        <view style="width: 16rem;height: 10rem;background: #FFF;padding:  0 1rem">
          <view style="font-size: 16px; padding-top: 10px;">修改个性签名</view>
          <view style="width: 100%;height: 4rem;padding-top: 1.5rem">
            <input placeholder='请输入个性签名，25字以内'
                   style="border: 0.053rem  /* 1/18.75 */ solid #F1F3F5;text-align: left; padding: 0.107rem  /* 2/18.75 */ 0.373rem  /* 7/18.75 */; border-radius: 0.107rem  /* 2/18.75 */;"
                   maxlength="25" class="uni-input" focus
                   v-model="text"/>
            <view style="text-align: right;font-size: 0.64rem;color: #CCC">
              <text>{{text.length}}/25</text>
            </view>
          </view>

          <view style="display: flex">
            <button style="width: 4rem;height:1.5rem;font-size: 0.747rem;line-height: 1.5rem"
                    @click="closeEditText" type="default">取消
            </button>
            <button style="width: 4rem;height:1.5rem;font-size: 0.747rem;line-height: 1.5rem"
                    @click="showEdit" type="primary">确认
            </button>
          </view>
        </view>
      </uni-popup>
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

      <uni-load-more :status="status" :icon-size="16" :content-text="contentText"/>
    </view>

    <Footer v-if="is_show_copyright == 1"></Footer>
  </view>
</template>

<script>
import moment from "moment"
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import MD5 from "js-md5";
import ImageCropper from "../../components/invinbg-image-cropper";
import videoplayer from "../../components/videoplayer/bw-videoPlayer";
import Footer from "../../components/footer/footer.vue";

export default {
  name      : "List",
  inject    : ['initPage', 'getParameter', 'getExternalId','getCopyright'],
  components: {
    uniPopup, ImageCropper, videoplayer,Footer
  },

  data () {
    return {
      h5Url            : this.$store.state.h5Url,
      cropWidth        : 370,
      cropHeight       : 120,
      titleText        : '朋友圈内容已粘贴至剪切板，图片已全部保存至本地，你可前往企业微信App--工作台--客户朋友圈进行发布',
      isShow           : false,
      exd              : '',
      userId2          : '',
      externalId       : '',
      openid           : '',
      corpid           : '',
      jsApiList        : '',
      ticketData       : [],
      agentData        : '',
      is_self          : '',
      loadingText      : '加载中...',
      count            : 0,
      pageSize         : 10,
      page             : 1,
      user_id          : '',
      setId            : '',
      luj              : '',
      timeLineId       : 0,
      is_heard         : '',
      is_description   : '',
      is_banner        : '',
      img1             : '',
      img2             : '',
      simg2            : '',
      text             : '',
      type             : '',
      isImg            : '',
      md               : '',
      timestamp        : '',
      timestamp2       : '',
      external_id      : '',
      err_msg          : '',
      lat              : '',//纬度
      lng              : '',//经度
      windowUrl        : '', //授权url
      commonUrl        : this.$store.state.commonUrl,
      wx               : false,
      wxWork           : false,
      isContext        : 1,
      reload           : false,
      lastId           : '',
      showSwiper       : false,
      momentBackground : [],
      userAvatar       : '',
      userName         : '',
      customDes        : '',
      momentData       : [],
      status           : 'more',
      contentText      : {
        contentdown   : '上拉加载更多',
        contentrefresh: '加载中',
        contentnomore : '没有更多'
      },
      timeData         : {},
      timeStr          : [],
      popupTitle       : '',
      corpName         : '',
      isRead           : false,
      tempFilePath     : '',
      file             : null,
      isHeade          : false,
      isHide           : true,
      isAuth           : true,
      is_new           : 0,
      momentId         : 0,
      total_count      : 0,
      showNotice       : false,
      users_id         : localStorage.getItem('user_id'),
      msgAvatar        : '',
      is_show_copyright: localStorage.getItem('is_show_copyright'),//是否展示底部版權
    }
  },
  methods: {
    async getNoticeList(){
      const {data:res}=await this.axios.get('moments-web/moment-remind', {
        params: {
          user_id: localStorage.getItem('user_id'),
          is_new: 3,
          pageSize: 10,
          page: 1,
          external_id: localStorage.getItem('external_int_id'),
          moment_user_id: this.getParameter('user_id'),
          corp_id: this.getParameter('corpid'),
        }
      })
      this.total_count=res.data.total_count
      if(res.data.data.length>0){
        this.msgAvatar=res.data.data[0].user_info.avatar
      }
      if(this.total_count>0){
        this.showNotice=true
      }
    },
    toNotice(){
      this.showNotice=false
      uni.navigateTo({
        url: '/pages/moments/notice?moment_user_id='+this.getParameter('user_id')+ '&user_id=' + localStorage.getItem('user_id') + '&corpid=' + localStorage.getItem('corpid') + '&exd=' + this.exd + '&agentId=' + this.getParameter('agentId') + '&is_self=' + this.is_self
      })
    },

    closeTitle () {
      this.$refs.popup3.close()
    },
    getFileContent (file, callback) {
      if (file && file.size > 0) {
        //下面这一句相当于JQuery的：var file =$("#upload").prop('files')[0];
        if (window.FileReader) {
          let reader = new FileReader();
          reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
              callback(evt.target.result);
            }
          };
          // 包含中文内容用gbk编码
          reader.readAsText(file, 'utf-8');
        }
      }
    },

    confirm (e) {
      let that = this
      this.tempFilePath = ''
      this.cropFilePath = e.detail.tempFilePath
      var arr = this.cropFilePath.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let file2 = new File([u8arr], this.file.name, {type: mime});
      that.getFileContent(file2, async function (str) {
        that.md = (MD5(str))
        uni.showLoading({
          message    : '正在上传...',
          forbidClick: true,
          loadingType: 'spinner',
        });
        const {data: res2} = await that.axios.post('moments-web/moments-upload', {
          type: file2.type,
          md5 : that.isImg == 1 ? MD5(that.md) : that.md,
        })
        if (res2.error != 0) {
          that.$refs.popup.close()
          uni.hideLoading()
          uni.showToast({
            title   : res2.error_msg,
            image   : '/static/fail.png',
            duration: 2000
          });
        } else {
          if (res2.data.local_path != '') {
            that.$refs.popup.close()
            uni.hideLoading()
            uni.showToast({
              icon    : 'success',
              title   : '上传成功',
              duration: 2000
            });
            if (that.isImg == 1) {
              that.userAvatar = that.commonUrl + (res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path)
              that.img1 = res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path
              if (that.is_heard == 1) {
                that.set()
              } else if (this.is_heard == 0) {
                uni.showToast({
                  title   : '暂无权限修改头像',
                  image   : '/static/fail.png',
                  duration: 2000
                });
              }
            } else if (that.isImg == 2) {
              that.momentBackground = []
              that.momentBackground.push(that.commonUrl + (res2.data.s_local_path ? res2.data.s_local_path : res2.data.local_path))
              that.img2 = res2.data.local_path
              that.simg2 = res2.data.s_local_path
              if (that.is_banner == 1) {
                that.set()
              } else if (this.is_banner == 0) {
                uni.showToast({
                  title   : '暂无权限修改背景图片',
                  image   : '/static/fail.png',
                  duration: 2000
                });
              }
            }
          } else if (res2.data.local_path == '') {
            let params = new FormData();
            params.append("type", file2.type);
            params.append("md5", that.isImg == 1 ? MD5(that.md) : that.md);
            params.append("is_heard", that.isImg == 1 ? 1 : 0);
            params.append("fileInfo", file2);
            const {data: res} = await that.axios.post("moments-web/moments-upload", params)
            if (res.error != 0) {
              that.$refs.popup.close()
              uni.hideLoading()
              uni.showModal({
                content   : res.error,
                showCancel: false
              });
            } else {
              that.$refs.popup.close()
              uni.showToast({
                title   : '上传成功',
                icon    : 'success',
                duration: 2000
              });
              if (that.isImg == 1) {
                that.userAvatar = that.commonUrl + (res.data.s_local_path ? res.data.s_local_path : res.data.local_path)
                that.img1 = res.data.s_local_path ? res.data.s_local_path : res.data.local_path

                if (that.is_heard == 1) {
                  that.set()
                } else if (that.is_heard == 0) {
                  uni.showToast({
                    title   : '暂无权限修改头像',
                    image   : '/static/fail.png',
                    duration: 2000
                  });
                }
              } else if (that.isImg == 2) {
                that.momentBackground = []
                let r1 = res.data
                that.momentBackground.push(that.commonUrl + res.data.local_path)
                that.img2 = res.data.local_path
                that.simg2 = res.data.s_local_path
                if (that.is_banner == 1) {
                  that.set()
                } else if (that.is_banner == 0) {
                  uni.showToast({
                    title   : '暂无权限修改背景图片',
                    image   : '/static/fail.png',
                    duration: 2000
                  });
                }
              }
            }
          }
        }

      })
      this.$refs.popup.close()
    },
    cancel () {
      this.$refs.popup.close()
    },
    //上传图片
    chooseImage () {
      uni.chooseImage({
        count     : 1,
        sizeType  : ['compressed'],
        sourceType: ['album'],
        success   : (res) => {
          this.tempFilePath = res.tempFilePaths.shift()
          let file2 = res.tempFiles[0]
          this.file = file2
          this.$refs.popup.close()
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
    },
    closeEditText () {
      this.$refs.popup2.close()
    },
    editText () {
      if (this.is_self != 1 || this.is_description != 1) {
        // return Toast.fail("暂无权限");
        return false
      } else {
        this.type = 2
        this.text = this.customDes
        this.$refs.popup2.open()
      }
    },
    showEdit () {
      this.set()
    },
    close () {
      this.$refs.popup.close()
    },
    editImg () {
      if (this.is_self != 1 || this.is_heard != 1) {
        return false
      } else {
        this.isImg = 1
        this.type = 1
        this.cropWidth = 250
        this.cropHeight = 250
        this.popupTitle = '更换头像'
        this.$refs.popup.open()
      }
    },
    openPop () {
      if (this.is_self != 1 || this.is_banner != 1) {
        return false
      } else {
        this.type = 3
        this.isImg = 2
        this.cropWidth = 320
        this.cropHeight = 240
        this.popupTitle = '更换背景图'
        this.$refs.popup.open()
      }
    },
    async set () {
      const {data: res} = await this.axios.post('moments-web/user-setting', {
        user_id      : this.getParameter('user_id'),
        corp_id      : localStorage.getItem('corpid'),
        type         : this.type,
        heard        : this.img1,
        description  : this.text,
        banner_info  : this.img2,
        s_banner_info: this.simg2
      })
      if (res.error != 0) {
        uni.hideLoading()
        uni.showToast({
          title   : res.error_msg,
          image   : '/static/fail.png',
          duration: 2000
        });
      } else {
        uni.hideLoading()
        // localStorage.setItem('corp_id',this.getParameter('corp_id'))
        this.getBanner()
        this.$refs.popup.close()
        this.$refs.popup2.close()
      }
    },
    async getBanner () {
      this.refresh()
      let that = this
      const {data: res} = await that.axios.post('moments-web/moment-setting', {
        userid : that.getParameter('user_id') != null ? that.getParameter('user_id') : '',
        corp_id: that.getParameter('corpid'),
        user_id: localStorage.getItem('user_id')
      })
      if (res.error != 0) {
        that.reload = false
        uni.showToast({
          title   : res.error_msg,
          image   : '/static/fail.png',
          duration: 2000
        });
      } else {
        if (res.data) {
          this.moment_user_id=res.data.user_id
          this.isContext = res.data.is_context
          that.reload = false
          that.corpName = res.data.corp_name
          if (res.data.banner_url != null && res.data.banner_url != '') {
            if (that.momentBackground.length < 1) {
              that.momentBackground.push(that.commonUrl + (res.data.s_banner_url ? res.data.s_banner_url : res.data.banner_url))
            } else {
              let pic = that.commonUrl + (res.data.s_banner_url ? res.data.s_banner_url : res.data.banner_url)
              that.momentBackground.splice(0, 1, pic)
            }
          } else {
            if (that.momentBackground.length < 1) {
              that.momentBackground.push(that.commonUrl)
            } else {
              let pic = that.commonUrl
              that.momentBackground.splice(0, 1, pic)
            }
          }
          that.is_synchro=res.data.is_synchro
          that.is_self = res.data.is_self
          localStorage.setItem('is_self', res.data.is_self)
          if (res.data.heard) {
            if (res.data.default_heard == 0) {
              that.userAvatar = that.commonUrl + res.data.heard
            } else {
              that.userAvatar = res.data.heard
            }
          } else {
            that.userAvatar = require('../../static/assets/userHeader.png')
          }
          that.userName = res.data.name
          that.customDes = res.data.description
          that.is_heard = res.data.is_heard
          that.is_description = res.data.is_description
          that.is_banner = res.data.banner_type
          that.setId = res.data.id
          that.user_id = res.data.user_id
          uni.stopPullDownRefresh();
        } else {
          if (that.momentBackground.length < 1) {
            that.momentBackground.push(that.commonUrl)
          } else {
            let pic = that.commonUrl
            that.momentBackground.splice(0, 1, pic)
          }
          that.userAvatar = require('../../static/assets/userHeader.png')
        }
        that.getList()
        that.getNoticeList()
      }
    },
    async getList () {
      this.users_id=localStorage.getItem('user_id')
      let that = this
      const {data: res} = await that.axios.post('moments-web/get-lists', {
        userid  : that.getParameter('user_id') != null ? that.getParameter('user_id') : '',
        corp_id : localStorage.getItem('corpid') ? localStorage.getItem('corpid') : this.corpid,
        openid  : localStorage.getItem('openid'),
        lat     : that.lat,//经度
        lng     : that.lng,//纬度
        page    : that.page,
        pageSize: that.pageSize,
        user_id : localStorage.getItem('user_id'),
        is_self : that.is_self,
      })
      if (res.error != 0) {
        uni.hideLoading()
        that.reload = false
        that.isShow = true
        uni.showToast({
          title   : res.error_msg,
          image   : '/static/fail.png',
          duration: 2000
        });
      } else {
        if (res.msg) {
          uni.hideLoading()
          uni.showToast({
            title   : res.msg,
            icon    : 'none',
            duration: 2000
          });
        } else {
          that.reload = false
          that.exd = res.data.extId
          // localStorage.setItem('externalId', )
          if (that.page == 1) {
            that.momentData = res.data.data
          } else {
            that.momentData = that.momentData.concat(res.data.data)
          }
          that.isShow = true
          that.count = res.data.count
          if (that.momentData.length == that.count) {
            that.loadingText = '已加载全部内容'
          }
          that.momentData.map((momentInfo) => {
            that.getDate(momentInfo.id, momentInfo.create_time)
          })
          that.timeLineId = res.data.timeLine
          if (res.data.timeLine != 0) {
            setInterval(() => {
              this.leave()
            }, 300)
          }
          uni.stopPullDownRefresh();
        }
        let img = new Image()
        if (that.momentBackground[0] != that.commonUrl) {
          img.src = that.momentBackground[0]
          img.onload = () => {
            that.isRead = true
            uni.hideLoading()
          }
        } else {
          that.isRead = true
          uni.hideLoading()
        }

      }

    },
    async leave () {
      let that = this
      that.ws.websocketSend(
          JSON.stringify({
            channel: "pull",
            info   : {
              type      : 2,
              timeLine  : this.timeLineId,
              momentType: 1,
              settingId : this.setId
            }
          })
      )
    },
    goPublish: function () {
      localStorage.setItem('momentId', '')
      localStorage.setItem('attachmentId', '')
      const agentId = this.getParameter('agentId') || this.getParameter('agent_id') || localStorage.getItem('agent_id') || sessionStorage.getItem('agent_id') || ''
      uni.navigateTo({
        url: '/pages/moments/publish?user_id=' + this.getParameter('user_id') + '&corp_id=' + localStorage.getItem('corpid') + '&agentId=' + agentId
      })
    },
    goDetail : function (momentId) {
      let userid = this.getParameter('user_id') != null ? this.getParameter('user_id') : ''
      // let url = this.h5Url + '/h5/pages/moments/detail?id=' + momentId + '&userid=' + userid + '&user_id=' + localStorage.getItem('user_id') + '&corp_id=' + localStorage.getItem('corpid') + '&exd=' + this.exd + '&agentId=' + this.getParameter('agentId')
      // window.location.href=url
      uni.navigateTo({
        url: '/pages/moments/detail?id=' + momentId + '&userid=' + userid + '&user_id=' + localStorage.getItem('user_id') + '&corpid=' + this.getParameter('corpid') + '&exd=' + this.exd + '&agentId=' + this.getParameter('agentId')
      })
    },
    getDate (momentId, momentDate) {
      if (momentId == '') {
        return
      }
      if (momentDate != '') {
        let momentStr = ''
        let momentType = 1
        let momentDay = ''
        let momentMonth = ''
        let momentYear = ''

        if (this.utils.isToday(momentDate)) {
          momentStr = '今天'
        } else {
          momentType = 2
          momentDay = moment(momentDate).format('D')
          momentMonth = moment(momentDate).format('M')
          momentYear = moment(momentDate).format('YYYY')
          momentStr = momentDay + momentMonth + momentYear
        }

        if (typeof this.timeData['moment-' + momentId] == "undefined") {
          this.timeData['moment-' + momentId] = {
            type : momentType,
            str  : '',
            day  : '',
            month: '',
          }
        }
        this.timeData['moment-' + momentId] = {
          type : momentType,
          str  : momentStr,
          day  : momentDay,
          month: momentMonth + "月",
        }
        if (this.timeStr.indexOf(momentStr) == 0) {
          this.timeStr.push(momentStr)

          this.timeData['moment-' + momentId] = {
            type : momentType,
            str  : momentStr,
            day  : momentDay,
            month: momentMonth + "月",
          }
        }
      }
    },
    async limit () {
      this.url = window.location.href
      let agent_id = sessionStorage.getItem('agent_id') || localStorage.getItem('agent_id') || this.getParameter('agentId') || this.getParameter('agent_id') || ''
      let user_id = this.getParameter('user_id') != null ? this.getParameter('user_id') : this.$route.query.user_id
      if (agent_id) localStorage.setItem('agent_id', agent_id)
      const {data: res} = await this.axios.post("chat-message/get-config", {
        url     : this.url,
        agent_id: agent_id ? agent_id : this.getParameter('agentid')
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
        if(this.wx) {
          that.$store.state.wx.ready(function () {
            that.$store.state.wx.hideOptionMenu();
          })
        } else if(this.wxWork){
          that.$store.state.wx.ready(function () {
            that.$store.state.wx.hideMenuItems({
              menuList: ['menuItem:copyUrl'] // 要隐藏的菜单项
            });
          })
          that.$store.state.wx.error(function () {
            that.$store.state.wx.hideMenuItems({
              menuList: ['menuItem:copyUrl'] // 要隐藏的菜单项
            });
          })
        }
        that.getBanner()
      }
    },
    //重新渲染頁面
    refresh(){
      this.is_show_copyright = localStorage.getItem('is_show_copyright')
      this.$forceUpdate()
    },
    getMomentDateType (momentId) {
      return this.timeData['moment-' + momentId].type
    },
    getMomentDateStr (momentId) {
      return this.timeData['moment-' + momentId].str
    },
    getMomentDateDay (momentId) {
      return this.timeData['moment-' + momentId].day
    },
    getMomentDateMonth (momentId) {
      return this.timeData['moment-' + momentId].month
    },
    //获取位置
    getLocation () {
      let that = this
      that.$store.state.wx.getLocation({
        type   : 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          that.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          that.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          that.getBanner()
          // that.getList()
        },
        fail   : function (res) {
          uni.showToast({
            title   : '获取地理位置失败！',
            image   : '/static/fail.png',
            duration: 2000
          });
          // that.getList()
        },
      });
      // that.getList()
    },
    websocketOnMessage (data) {
      if (typeof data.type != 'undefined' && data.type == 'fission' && typeof data.has_chat != 'undefined' && data.has_chat) {
        this.ws.setCallback()
        if (localStorage.getItem('openid')) {
          localStorage.removeItem('openid')
        }
        // this.$refs.codePop.close()
        this.getList(this.external_id)
      }
    },
    actionSheetTap () {
      this.goPublish()
    },
  },

  onShow () {
    uni.setNavigationBarTitle({
      title: '朋友圈'
    })
    uni.showLoading({
      title   : '加载中...',
      duration: 10000
    });
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
    // 本地
    // localStorage.setItem('uid', 2)
    // localStorage.setItem('corpid', 'ww93caebeee67d134b')
    // localStorage.setItem('agent_id', '5')
    // localStorage.setItem('user_id', 'hutianwen')
    // localStorage.setItem('external_int_id', '4653')
    // this.getBanner()
    // this.getList()
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
        _this.initPage(this.limit)
      })
      this.getNoticeList()
    }
    if (this.timeStr.indexOf('今天') == -1) {
      this.timeStr.push('今天')
    }
    this.ws.setCallback(this.websocketOnMessage)

    const momentDetail = localStorage.getItem('moment-detail') ? localStorage.getItem('moment-detail') : ''
    if (momentDetail !== '') {
      clearInterval(momentDetail)
    }
  },

  onPullDownRefresh () {
    this.page = 1
    this.reload = true
    this.loadingText = '加载中...'
    this.lastId = ''
    this.getBanner()
    // this.getList()
  },
  onReachBottom () {
    this.status = 'more'
    if (this.momentData.length < this.count) {
      this.page += 1
      this.getList()
    } else {
      this.loadingText = '已加载全部内容'
    }
  },
}
</script>


<style scoped>
@import "~@/static/css/uni.css";
</style>

<style scoped lang="less">
/*.uni-page-head, .uni-page-head-transparent {*/
/*	z-index: 999999999 !important;*/
/*}*/
.logo {
  margin-top: 1.2rem;

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

/deep/ .uni-video-video {
  z-index: 0 !important;
}

/deep/ .uni-video-cover, .uni-video-container, uni-video {
  z-index: 0 !important;
}


.loading {
  text-align: center;
  line-height: 1.6rem;
  font-size: 0.75rem;
}

.copy {
  position: absolute;
  bottom: 0;
  right: 0.533rem;
  transform: translate(0, 120%);
  font-size: 0.64rem;
  color: #4B9EFC
}

.popupBottom {
  width: 100%;
  height: 5.3rem;
  background: #F1F3F5;
  border-radius: 0.267rem 0.267rem 0 0
}

.editBannel {
  width: 100%;
  height: 2.5rem;
  background: #FFF;
  margin-bottom: 0.3rem;
  text-align: center;
  line-height: 2.5rem;
  font-size: 0.853rem;
  border-radius: 0.3rem 0.3rem 0 0;
}

.clear {
  width: 100%;
  height: 2.5rem;
  background: #FFF;
  text-align: center;
  line-height: 2.5rem;
  font-size: 0.853rem
}

image,
swiper,
.back-pic-box {
  width: 100%;
  height: 10.667rem /* 200/18.75 */;
}

.moment-info {
  .moment-flex {
    -webkit-flex: 1;
    flex: 1;

    &-content {
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }
  }

  .user-info-box {
    height: 4.5rem /* 75/18.75 */;
    position: relative;

    .user-avatar {
      width: 3.413rem /* 64/18.75 */;
      height: 3.413rem /* 64/18.75 */;
      float: right;
      margin-top: -2.24rem /* -42/18.75 */;
      margin-right: 0.533rem /* 10/18.75 */;
      border-radius: 0.267rem /* 5/18.75 */;
      overflow: hidden;
    }

    .user-name {
      color: white;
      float: right;
      font-size: 0.8rem /* 15/18.75 */;
      line-height: 2.24rem /* 42/18.75 */;
      margin-top: -2.24rem /* -42/18.75 */;
      //margin-right: 0.533rem /* 10/18.75 */;
      position: relative;
      font-weight: 700;
      //padding: 0px 15px;
      //width: calc(100%- 3.413rem);
      width: 100%;
      padding-right:4.2rem;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      display: flex;
      justify-content: flex-end;
      text-shadow:rgba(0, 0, 0, 0.5) calc(4rem/37.5) calc(4rem/37.5) calc(16rem/37.5);
      .userName{
        white-space: nowrap;
        overflow:hidden;
        margin-right:calc(10rem/37.5);
        max-width:calc(120rem/37.5);
      }
      .corpName{
        text-align:left;
        white-space: nowrap;
        overflow:hidden;
        color:#FFD591;
        text-overflow: ellipsis;
        max-width:65%;
      }
      //margin-right: -4.467rem /* 10/18.75; */;
    }

    .user-des {
      top: 1.44rem /* 27/18.75 */;
      right: 0.533rem /* 10/18.75 */;
      left: 0.8rem /* 90/18.75 */;
      position: absolute;
      color: #999999;
      font-size: 0.747rem /* 14/18.75 */;
      text-align: right;
      line-height: 1.173rem /* 22/18.75 */;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

    }
  }

  .list-box {
    .list-info {
      margin-bottom: 1.6rem /* 10/18.75 */;
      padding-right: 0.533rem;

      .moment-date {
        width: 5.267rem /* 80/18.75 */;

        .moment-day {
          text-align: right;
          font-size: 1.493rem /* 28/18.75 */;
          line-height: 1.493rem /* 28/18.75 */;
          padding-right: 0.053rem /* 1/18.75 */;
        }

        .moment-month {
          text-align: left;
          font-size: 0.747rem /* 14/18.75 */;
          line-height: 0.747rem /* 14/18.75 */;
          padding-top: 0.64rem /* 12/18.75 */;
          padding-left: 0.053rem /* 1/18.75 */;
        }
      }

      .moment-add {
        background-color: #F7F7F7;
        height: 5.333rem /* 50/18.75 */;
        width: 5.2rem /* 50/18.75 */;

        .add-icon {
          height: 5.333rem /* 50/18.75 */;
          width: 5.2rem /* 50/18.75 */;
          display: block;
          vertical-align: top;
          font-size: 1.6rem /* 30/18.75 */ !important;
          line-height: 5.2rem /* 50/18.75 */;
        }
      }

      .moment-right {
        width: 0.533rem /* 10/18.75 */;
      }

      .moment-list-text {
        background-color: #F7F7F7;
        padding: 0.533rem /* 10/18.75 */;
      }

      .moment-list-image {
        border: 1px solid white;
      }

      .moment-content {
        font-size: 0.747rem /* 14/18.75 */;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-height: 1rem;
      }

      .moment-text-news {
        height: 1.12rem /* 21/18.75 */;
        font-size: 0.747rem /* 14/18.75 */;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        margin-bottom: 0.48rem /* 9/18.75 */;
      }

      .moment-list-news {
        background-color: #F7F7F7;
        padding: 0.267rem /* 5/18.75 */;

        .moment-info-news {
          margin: 0.267rem /* 5/18.75 */ 0;

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
    }
  }
}

.box{
  position: relative;
  height: 100%;
}
.msg-info{
  width: 100%;
  height: 2.13rem;
  margin: auto;
  text-align: center;
  position: relative;
  margin-bottom: 1.067rem;
  //margin-top: -0.8rem;
}

.prompt-msg{
  z-index: 12;
  background: #575757;
  border-radius: 0.213rem;
  padding: 0.213rem 0.6rem;
  position: absolute;
  height: 1.6rem;
  left: 50%;
  font-size: 0.746rem;
  color: #fff;
  line-height: 1.6rem;
  transform: translate(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.prompt-msg-avatar{
  width: 1.5rem;
  height: 1.55rem;
}

.prompt-msg-text{
  margin-left:0.3rem;
}

.user-tips{
  font-size: 0.64rem;
  position: absolute;
  bottom: 12px;
  left: 1.0rem;
  width: 100%;
  text-align: left;
  color: red;
}
</style>