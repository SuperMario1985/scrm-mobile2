<template>
	<view class="text-left pt-20">


		<view v-for="(t_item, t_index) in rules" :key='t_index'>

			<view class="ohidden">

				<!--所有文本-->
				<view  class="bg-blue-201 px-20 py-20  br5  mb-20"  v-if='t_item.context'>
					<view class="text-26 text-gray-900 break-all">{{t_item.context}}</view>
					<view class='flex justify-end mt-10'   v-if="isSend&&is_mobile">
						<view  class="bg-blue-501 br5 py-10 px-40 text-26 text-white flex-none ml-20 cursor-pointer" @click=" sendMsg(7, t_item.context)">发送</view>
					</view>
				</view>

				<!--图片-->
				<view  class="bg-blue-201 px-20 py-10 br5 mb-20"  v-if="t_item.file_type==1 && t_item.uploadImg.length>0">
					<view class="py-20 flex flex-wrap">
						<view class="mr-20 flex items-center" v-for="(f_item, f_index) in t_item.uploadImg" :key="f_index">
							<img class="w-80 h-80 object-cover flex-none" :src="commonUrl + f_item.local_path" alt="">
							<view class='text-gray-900 text-24 ellipsis-2 break-all pl-10'>{{f_item.name}}</view>
						</view>
					</view>

					<view class='flex justify-end mt-10' v-if="isSend&&is_mobile">
						<view  class="bg-blue-501 br5 py-10 px-40 text-26 text-white flex-none ml-20 cursor-pointer" @click="sendMsg(1, t_item.uploadImg)">发送</view>
					</view>

				</view>


				<!--视频-->
				<view class="bg-blue-201 px-20 py-20 mb-20 br10" v-if="t_item.add_type==0&&t_item.uploadVideo&&t_item.file_type==3">
					<view class="py-20 flex items-center">
						<img src="@/static/assets/video.png" class='w-80 h-80 flex-none'>
						<view class='text-gray-900 text-24 ellipsis-2 break-all pl-10'>{{t_item.uploadVideo.file_name}}</view>
					</view>

					<view class='flex justify-end mt-10' v-if="isSend&&is_mobile">
						<view  class="bg-blue-501 br5 py-10 px-40 text-26 text-white flex-none ml-20 cursor-pointer" @click=" sendMsg(3, t_item.uploadVideo)">发送</view>
					</view>

				</view>
				<view class="bg-blue-201 px-20 py-20 mb-20 br10" v-if="t_item.add_type==1&&t_item.materialVideo&&t_item.file_type==3">
					<view class="py-20  flex items-center">
						<img src="@/static/assets/video.png" class='w-80 h-80 flex-none'>
						<view class='text-gray-900 text-24 ellipsis-2 break-all pl-10'>{{t_item.materialVideo.file_name}}</view>
					</view>
					<view class='flex justify-end mt-10'   v-if="isSend&&is_mobile">
						<view  class="bg-blue-501 br5 py-10 px-40 text-26 text-white flex-none ml-20 cursor-pointer" @click="sendMsg(3, t_item.materialVideo)" >发送</view>
					</view>
				</view>

				<!--图文-->
				<view class="bg-blue-201 p-20 mb-20 br10" v-if="t_item.add_type==0&&t_item.uploadText&&t_item.file_type==4">
					<view class="flex" v-if='t_item.uploadText.url || t_item.uploadText.title || t_item.uploadText.description'>
						<view >
							<img  class="w-80 h-80 block object-cover" v-if='t_item.uploadText.url' :src=" commonUrl + t_item.uploadText.url " alt="">
							<img  class="w-80 h-80 block object-cover" v-else src="@/static/assets/lj.png" >
						</view>
						<view class="ml-10 " >
							<view class="text-26 text-gray-900   break-all ellipsis-1">{{t_item.uploadText.title}}</view>
							<view class="text-24 text-gray-501 break-all ellipsis-2">{{t_item.uploadText.description}}</view>
						</view>
					</view>

					<view class='flex justify-end mt-10'  v-if="isSend&&is_mobile">
						<view  class="bg-blue-501 br5 py-10 px-40 text-26 text-white flex-none ml-20 cursor-pointer" @click=" sendMsg(4, t_item.uploadText)">发送</view>
					</view>

				</view>

				<view class="bg-blue-201 p-20 mb-20 br10" v-if="t_item.add_type==1&&t_item.materialText&&t_item.file_type==4">
					<view class=" flex ">
						<view>
							<img class="w-80 h-80 block object-cover" v-if="t_item.materialText.url" :src="commonUrl + t_item.materialText.url" alt="">
							<img  class="w-80 h-80 block object-cover" v-else src="@/static/assets/lj.png" >
						</view>
						<view class="ml-10">
							<view class="text-26 text-gray-900   break-all ellipsis-1">{{t_item.materialText.title}}</view>
							<view class="text-24 text-gray-501 break-all ellipsis-2">{{t_item.materialText.description}}</view>
						</view>
					</view>
					<view class='flex justify-end mt-10'  v-if="isSend&&is_mobile">
						<view  class="bg-blue-501 br5 py-10 px-40 text-26 text-white flex-none ml-20 cursor-pointer" @click=" sendMsg(4, t_item.materialText)">发送</view>
					</view>
				</view>
			</view>
		</view>


	</view>

</template>

<script>
	import AppVideo from '../AppVideo'
    import {Toast} from "vant";
    export default {
        name: "sopRules",
	    data(){
            return {
                commonUrl   : this.$store.state.commonUrl,
                is_mobile: false, // 是否是移动端
            }
	    },
        inject: ['initPage'],
	    components: {AppVideo},
        props:{
            rules: {
                type: Array,
                default(){
                    return []
                }
            },

            user_id: { // 要发送的用户id
                type:  [Number, String],
                default(){
                    return ''
                }
            },

            agent_id: { // 要发送的用户id
                type:  [Number, String],
                default(){
                    return ''
                }
            },

            external_userid: {
                type: [Number, String],
                default(){
                    return 0
                }
            },

            isSend: { // 是否有发送按钮
                type: Boolean,
	            value: true,
            },
            isSendAll: { // 是否发送所有
                type: Boolean,
                default(){
                    return true
                }
            },
            is_chat : { // 是否是群聊
                type: [Number, String],
                default(){
                    return 0
                }
            }
        },


	    created() {

            this.is_mobile = this.is_mobile_fn()
            /*this.$store.dispatch('setWx', () => {
                this.initPage(this.limit)
            })*/


        },
        methods: {
            is_mobile_fn () {
                if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                    return true; // 移动端
                }else{
                    return false; // PC端
                }
            },
            allSendMeg(){
                this.rules.forEach((t_item, t_index) => {
                    if (t_item.context) {
                        this.sendMsg(7, t_item.context, true)
                    }

                    if (t_item.file_type==1 && t_item.uploadImg.length>0) {
                        this.sendMsg(1, t_item.uploadImg)
                    }

                    if (t_item.add_type==0&&t_item.uploadVideo&&t_item.file_type==3) {
                        this.sendMsg(3, t_item.uploadVideo)
                    }

                    if (t_item.add_type==1&&t_item.materialVideo&&t_item.file_type==3) {
                        this.sendMsg(3, t_item.materialVideo)
                    }

                    if (t_item.add_type==0&&t_item.uploadText&&t_item.file_type==4) {
                        this.sendMsg(4, t_item.uploadText)
                    }

                    if (t_item.add_type==1&&t_item.materialText&&t_item.file_type==4) {
                        this.sendMsg(4, t_item.materialText)
                    }
                })

            },

            async sendMsg (type, data, is_all = false) {
                Toast.loading({
                    forbidClick: true,
                    message    : '上传中...',
                    duration   : 0
                });
                switch (type * 1) {
                    case 1: //  图片
                        for (var i=0; i<data.length; i++) {
                            this.sendData(data[i].id)
                        }
                        break;
                    case 3: //  视频
                        this.sendData(data.id)
                        break;
                    case 4: //  图文
                        this.sendData(data.id)
                        break;
                    case 7: //  文本
                        var content = data
	                    if (is_all) {
                            content = data + '\n'
	                    } else {
                            content = data
	                    }
	                    this.sendChatMessage({
                            msgtype: 'text',
                            text: {
                                content
                            }
	                    })
                        break;

                }

            },
            async sendData(ids){ // 需要接口解析的
                const {data: res} = await this.axios.post("chat-message/send-data", {
                    ids,
                    uid : localStorage.getItem('uid'),
                    corpid : localStorage.getItem('corpid'),
                    agent_id : this.agent_id,
                    user_id : this.user_id,
                    external_id: this.external_userid,
                    chat_id : this.$store.state.chatId, // 群id
                });
                if (res.error !== 0) {
                    Toast.fail(res.error_msg);
                } else {
                    console.log(res.data[0], '接口返回的')
					this.sendChatMessage(res.data[0])
                }
            },
            sendChatMessage(o) {
                Toast.clear()
                this.$store.state.wx.invoke('sendChatMessage',  o,  (res) => {
                    if (res.err_msg == 'sendChatMessage:ok') {
                        console.log(res, '发送成功')
                    } else {
                        console.log(res, '发送失败')
                        if(res.err_msg&&res.err_msg.indexOf('without context of external contact')>-1) { // 手机
                            Toast.fail(`请到该${this.is_chat==1?'群':'客户'}的会话页面按原流程进行推送`)
                        }

                        if(res.err_msg&&res.err_msg.indexOf('invalid param')>-1) { // 手机
                            Toast.fail(`没找到对应的素材`)
                        }

                        if(res.err_msg&&res.err_msg.indexOf('fail_nosupport')>-1) { // 手机
                            Toast.fail(`请到该${this.is_chat==1?'群':'客户'}的会话页面按原流程进行推送`)
                        }

                        if(res.err_msg&&res.err_msg.indexOf('fail_nopermission')>-1) { // 手机
                            Toast.fail(`请到该${this.is_chat==1?'群':'客户'}的会话页面按原流程进行推送`)
                        }

                        if(res.errmsg&&res.errmsg.indexOf('fail_no permission')>-1) { // pc
                            Toast.fail(`请到该${this.is_chat==1?'群':'客户'}的会话页面按原流程进行推送`)
                        }



                        if(res.errmsg&&res.errmsg.indexOf('fail_nosupport')>-1) { // 手机
                            Toast.fail(`请到该${this.is_chat==1?'群':'客户'}的会话页面按原流程进行推送`)
                        }

                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
	.break-all{word-break:break-all}
</style>
