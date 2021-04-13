<template>
	<app-layout :loading='!isReady'  :class="{'pb-120': msgInfo&&msgInfo.listInfo.length>1}">
		<view class="">
		<view v-show="!isReady">
			<view class="chat-name" style="padding: 0">
				<skeleton :row="0" animate :loading="!isReady"></skeleton>
			</view>
			<view class="custom-list">
				<skeleton :row="0" animate :loading="!isReady"></skeleton>
			</view>
			<view class="custom-tabs">
				<skeleton :row="2" animate :loading="!isReady"></skeleton>
			</view>
			<view class="custom-tabs-content">
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
			</view>
		</view>

		<view class="p-30" v-show="isReady">
			<view class="px-30 py-30 shadow  br8 mb-30 bg-white">
				<view class="text-36 text-left font-bold  pb-10">推送详情</view>
				<view class="text-28 text-left text-gray-501">管理员提醒你在{{msgInfo&&msgInfo.send_day}}
					<span class="text-blue-501 font-bold px-5">{{msgInfo&&msgInfo.send_time}}</span> 给客户推送以下消息内容
				</view>
				<view class="">
					<sopRules :rules="msgInfo&&msgInfo.content" :isSend='false' :isSendAll='false'></sopRules>
				</view>
			</view>

			<view class="px-30 py-30 shadow  br8 bg-white">
				<view v-if="!is_chat">
					<view class="flex justify-between items-center py-15">
						<view class="text-36 text-left font-bold pb-10">需推送的客户</view>
						<view class=''>
							<van-checkbox checked-color='#5284ec' icon-size='15px' v-model="is_show_no_over"> <view class='text-24 text-gray-501'>仅显示未完成任务</view></van-checkbox>
						</view>
					</view>
					<view class="text-28 text-left text-gray-501">
						<view>
							<view v-if='is_mobile'>
								<view class='text-24'>1、点击【去发送】进入到该客户的会话页面；</view>
								<view class='text-24'>2、通过聊天侧边栏打开客户资料页面，将需要发送的消息依次点击【发送】即可；</view>
								<view class='text-24'>3、发送完毕后，员工回到该页面，手动点击【完成】按钮，标记本次消息内容已发送。</view>
							</view>
							<view v-else>
								<view class='text-24'>1、点击【复制】复制客户名称，在企业微信中粘贴搜索客户昵称进入该客户对话话框；</view>
								<view class='text-24'>2、通过聊天侧边栏打开客户资料页面，点击【一键发送】可快速发送消息内容。</view>
								<view class='text-24'>3、发送完毕后，员工回到该页面，手动点击【完成】按钮，标记本次消息内容已发送。</view>
							</view>
						</view>
					</view>
					<view class="mt-30">
						<view class=""  v-for='(o_item, o_index) in megs' :key='o_index' class="py-30 relative b-line" v-if='megs.length>0'>
							<view class=" ">
								<view class="flex items-center">
									<image class="block w-60 h-60 flex-none" :src="o_item.avatar"></image>
									<view class="text-gray-900 text-24 pl-15 ellipsis break-all">{{o_item.nickname}}</view>

									<text class='ellipsis break-all' v-if="o_item.corp_name != null" style="font-size: 0.587rem;color: #FA9635;line-height: 1.067rem  /* 20/18.75 */;">
										@{{o_item.corp_name}}
									</text>
									<text class='ellipsis break-all' v-else style="color: #30AB55;font-size: 0.587rem;line-height: 1.067rem  /* 20/18.75 */;">
										@微信
									</text>
									<image style="vertical-align: text-bottom; width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/man.png"
									       v-if="o_item.gender == '男性'"></image>
									<image style="vertical-align: text-bottom;width: 0.853rem  /* 16/18.75 */;height: 0.853rem  /* 13/18.75 */;margin-left: 0.267rem  /* 5/18.75 */;"
									       src="../../static/scrm/woman.png"
									       v-if="o_item.gender == '女性'"></image>

									<view
											class="ss-wk-btn text-24 text-blue-501 br100 px-30 py-0 ml-20 flex-none cursor-pointer" v-if='!is_mobile'
											v-clipboard:copy="o_item.nickname"
											v-clipboard:success="(type) => copyHandle('success')"
											v-clipboard:error="(type) => copyHandle('error')"
									>复制</view>
								</view>
								<view class="flex items-center flex-none justify-end mt-20">
									<view>
										<view class="ss-wc-btn active  text-24 bg-blue-501 text-white br100 px-20 py-5" v-if='o_item.is_over>0'>我已完成</view>
										<view class="ss-wc-btn text-24 bg-blue-501 text-white br100 px-30 py-5 cursor-pointer" v-else  @click="sopMsgSetOver(false, o_item.msg_id)">完成</view>
									</view>
									<view class="ss-wk-btn text-24 text-blue-501 br100 px-20 py-5 ml-20" @click="toChat(o_item.external_userid)"  v-if='is_mobile&&o_item.is_over==0'>去发送</view>
								</view>
							</view>
						</view>

						<view v-if='megs.length == 0' class='text-gray-900 my-40'>
							<text class='text-28 text-gray-501 '>暂无数据</text>
						</view>
					</view>

				</view>

				<view v-else>
					<view class="flex justify-between items-center py-15">
						<view class="text-36 text-left font-bold pb-10">需推送的客户群</view>
						<view class=''>
							<van-checkbox checked-color='#5284ec' icon-size='15px' v-model="is_show_no_over"> <view class='text-24 text-gray-501'>仅显示未完成任务</view></van-checkbox>
						</view>
					</view>
					<view class="text-24 text-left text-gray-501">

						<view>
							<view v-if='is_mobile'>
								<view class='text-24'>1、点击【去发送】进入到该客户的会话页面；</view>
								<view class='text-24'>2、通过聊天侧边栏打开群聊资料页面，将需要发送的消息依次点击【发送】即可；</view>
								<view class='text-24'>3、发送完毕后，员工回到该页面，手动点击【完成】按钮，标记本次消息内容已发送。</view>
							</view>
							<view v-else>
								<view  class='text-24'>1、点击【复制】复制群名称，在企业微信中粘贴搜索群进入该群聊对话框；</view>
								<view  class='text-24'>2、通过聊天侧边栏打开群聊资料页面，点击【一键发送】可快速发送消息内容；</view>
								<view  class='text-24'>3、发送完毕后，员工回到该页面，手动点击【完成】按钮，标记本次消息内容已发送。</view>
							</view>
						</view>
					</view>

					<view  class="mt-30">
						<view  v-for='(o_item, o_index) in megs' :key='o_index' class="py-30 relative b-line "  v-if='megs.length>0'>
							<view class="">
								<view class="flex items-center">
									<div class="flex-none w-80 h-80 flex items-center justify-center flex-wrap ss-imgs-box box-border br2 pl-1 pt-1">
										<div :class="'flex-w' +  o_item.avatarData.length" class='pr-1 pb-1 box-border' v-for="(t_item, t_index ) in o_item.avatarData" :key="t_index">
											<img :src="t_item" class="w-full block" />
										</div>
									</div>
									<view class="text-gray-900 text-24 pl-15 flex items-center">
										<view class="mw-320 ellipsis break-all text-26">{{o_item.name}}</view>
										<view class="pl-5 text-24">({{o_item.member_num}})</view>
									</view>
									<view
											class="ss-wk-btn text-24 text-blue-501 br100 px-30 py-0 ml-20 cursor-pointer" v-if='!is_mobile'
											v-clipboard:copy="o_item.name"
											v-clipboard:success="(type) => copyHandle('success')"
											v-clipboard:error="(type) => copyHandle('error')"
									>复制</view>
								</view>
								<view class="flex items-center flex-none justify-end mt-20">
									<view>
										<view class="ss-wc-btn active text-24 bg-blue-501 text-white br100 px-20 py-5" v-if='o_item.is_over>0' >我已完成</view>
										<view class="ss-wc-btn  text-24 bg-blue-501 text-white br100 px-30 py-5 cursor-pointer" v-else  @click="sopMsgSetOver(false, o_item.msg_id)">完成</view>
									</view>
									<view class="ss-wk-btn text-24 text-blue-501 br100 px-20 py-5 ml-20" @click="toChat(o_item.chatid)" v-if='is_mobile&&o_item.is_over==0'>去发送</view>
								</view>
							</view>
						</view>
						<view v-if='megs.length == 0' class='text-gray-900 my-40'>
							<text class='text-28 text-gray-501 '>暂无数据</text>
						</view>
					</view>


				</view>
			</view>


		</view>

		<view class='fixed bottom-0  bg-white py-20 t-line uni-navbar__content z-2' v-if='msgInfo&&msgInfo.listInfo.length>1'>
			<view class=" bg-blue-200 br10 py-20 px-120 text-26 text-blue-501 mx-20"   v-if="msgInfo&&msgInfo.is_over>0">我已完成</view>
			<view class=" bg-blue-501 br10 py-20 px-120 text-26 text-white cursor-pointer mx-20" @click="sopMsgSetOver(true)" v-else>
				完成
			</view>
		</view>

	</view>
	</app-layout>
</template>

<script>
    import sopRules from '../../components/sop/SopRules'
    import skeleton from "@/components/xinyi-skeleton/skeleton.vue";
    import {Toast} from "vant";

    export default {
        name: "sop",
        inject: ['initPage', 'getExternalId', 'getChatId', 'forbidden', 'getContext'],
        components: {sopRules, skeleton},
	    watch: {
            is_show_no_over : {
                handler(v) {
                    console.log(v)
	                try {
                        if (v) {
                            this.megs = this.msgInfo.listInfo.filter((item, index) => {
                                console.log(item)
                                return item.is_over == 0
                            })
                        } else {
                            this.megs = this.msgInfo.listInfo
                        }
                    }catch (e) {

                    }

                },
	            immediate: true
            }
	    },
        data() {
            return {
                sop_send_id: 0,
                msgInfo: null, // 详细数据
                agent_id: 0, //
                isReady: false, // 是否加载完
                is_chat: 0, // 是否是群聊
                is_mobile: false, // 是否是手机
                is_show_no_over:false, // 是否显示未完成的
	            megs: []
            }
        },
        onLoad() {
            this.sop_send_id = this.$route.query.sop_send_id || 0
            this.agent_id = this.$route.query.agent_id || 0
            this.is_chat = this.$route.query.is_chat || 0

            this.is_mobile = this.is_mobile_fn()

            // this.sop_send_id = '2018|2019|2020'
            // this.agent_id = 98
            // this.is_chat = 1
            // localStorage.setItem('user_id', 'ludawei')
            // localStorage.setItem('corpid', 'ww93caebeee67d134b')
            // localStorage.setItem('token', 'U3ViVXNlci0zNDM1ZWE1ZmZhYjQ4OGNiZGVlMWE5ZDIzNzMyNjgyMA==')
            // this._initData()

        },

	    onShow(){
            this.$store.dispatch('setWx', () => {
                this.initPage(this.limit)
            })

	    },

        methods: {

            is_mobile_fn () {
                if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                    return true; // 移动端
                }else{
                    return false; // PC端
                }
            },

            async _initData() {
                const {data: res} = await this.axios.post("work-sop/sop-msg-index", {
                        corp_id: localStorage.getItem('corpid'),
                        sop_send_id: this.sop_send_id,
                        userid: localStorage.getItem('user_id'),
                    }
                );
                if (res.error != 0) {
                    this.$toast(res.error_msg)
                } else {
                    this.isReady = true
                    this.msgInfo = res.data.msgInfo
                    this.megs = res.data.msgInfo.listInfo

                }
            },

	        isCanSend(){
                if (this.msgInfo.can_send == 0) {
                    uni.showToast({
                        title: this.is_chat ==0 ? '非该执行人不能进行操作': '非该群群主不能进行操作',
                        image: '/static/fail.png',
                        duration: 2000
                    });
                    return true
                }
	        },

            async sopMsgSetOver(is_all, msg_id) { // 设置消息完成
                if (this.isCanSend()) return
                const {data: res} = await this.axios.post("work-sop/sop-msg-set-over", {
                        corp_id: localStorage.getItem('corpid'),
                        msg_id: is_all? this.sop_send_id.split('|') :msg_id
                    }
                );
                if (res.error == 0) {
                    this._initData()
                    this.$toast('操作成功')
                }
            },

            //微信对话
            toChat(id) {
                if (this.isCanSend()) return
                console.log('开始微信对话', this.is_chat, id)
                this.$store.state.wx.openEnterpriseChat({
                    userIds: '',    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
                    externalUserIds: this.is_chat == 1 ?  '' : id, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
                    groupName: '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
                    chatId: this.is_chat == 1 ?  id :'', // 若要打开已有会话，需指定此参数。如果是新建会话，chatId必须为空串
                    success: function (res) {
                        console.log(res, '开始会话成功了')
                        // 回调
                    },
                    fail: (res) => {
                        console.log(res, '调取失败')

                        if (res.errMsg.indexOf('function not exist') > -1) {
                            uni.showToast({
                                title: '版本过低请升级',
                                image: '/static/fail.png',
                                duration: 2000
                            });
                        } else if (res.errMsg.indexOf('invalid chatid') > -1) {
                            uni.showToast({
                                title: '您不在该聊天室',
                                image: '/static/fail.png',
                                duration: 2000
                            });
                        } else if (res.errMsg.indexOf('chatid not found') > -1) {
                            uni.showToast({
                                title: '该群聊还未进行会话聊天',
                                image: '/static/fail.png',
                                duration: 2000
                            });
                        } else if (res.errMsg.indexOf('invalid ids') > -1) {
                            uni.showToast({
                                title: '该用户不是您好友',
                                image: '/static/fail.png',
                                duration: 2000
                            });
                        } else if (res.errMsg.indexOf('empty chatid or userids')>-1) {

                            uni.showToast({
                                title: '没有找到对应的群或者用户',
                                image: '/static/fail.png',
                                duration: 2000
                            });
                        }

                    }
                });
            },

            copyHandle(type) {
                if (type==='success') {
                    Toast.success('复制成功')
                } else {
                    Toast.fail('复制失败')
                }
            },

            async limit() {
                this.utils.setConfig.call(this, {agent_id: this.agent_id}).then((res)=>{
                    this.utils.setAgentConfig.call(this, res)
                    this._initData()
                })
            }

        }
    }
</script>

<style lang="scss" scoped>
	.mw-320 {max-width: calc(320rem/37.5)}
	.ss-imgs-box {background: #efefef;align-content: center;box-sizing: content-box}
	.flex-w1 {flex: 0 0 100%;}
	.flex-w2, .flex-w3, .flex-w4 {flex: 0 0 50%;}
	.flex-w5, .flex-w6, .flex-w7, .flex-w8, .flex-w9 {flex: 0 0 33.3%;}
	.ss-wk-btn {border: 1px solid #5283ec; box-sizing: border-box}
	.ss-wc-btn {border: 1px solid #5283ec; box-sizing: border-box}
	.ss-wc-btn.active {border: 1px solid #bee3f8; background: #bee3f8!important;}
	.uni-navbar__content{width: 750rpx}
</style>
