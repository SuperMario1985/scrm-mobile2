<template>
	<app-layout :loading='!isReady'>
		<view>
			<uni-nav-bar left-icon="back" title="系统通知" @clickLeft="back" background-color="#5284ec" color="#fff" :fixed="true">
			</uni-nav-bar>


			<view v-show="!isReady">
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
				<skeleton title :row="2" animate :loading="!isReady"></skeleton>
			</view>


			<view v-show='isReady'>
				<view class="px-30 py-30 flex items-center">
					<view class="w-90 h-90 br100 ss-bell-box flex justify-center items-center">
						<text class="scrmIconfont icon_bell text-60 c-b5b5b5 mb-8"></text>
					</view>
					<view class="pl-20 text-left">
						<view class="text-38 text-gray-900 pb-10 font-bold">系统通知</view>
						<view class="text-26 text-gray-501">企业成员所收到的提醒通知</view>
					</view>
				</view>
				<view class="bg-white px-30 py-20 flex justify-between items-center mb-30">
					<view class="text-left">
						<view class="text-30 text-gray-900 pb-10">消息提醒免打扰</view>
						<view class="text-24 text-gray-501">开启后，则在聊天侧边栏页面不会弹出提醒通知</view>
					</view>
					<van-switch active-color='#5283ec' v-model="status" @input="onInputStatus" />
				</view>
			</view>

		</view>
	</app-layout>
</template>

<script>
    import sopRules from '../../components/sop/SopRules'
    import skeleton from "../../components/xinyi-skeleton/skeleton.vue";
    export default {
        name: "sopSet",
        inject: ['initPage', 'getExternalId', 'getChatId', 'getParameter', 'forbidden', 'getContext'],
        components: {sopRules, skeleton},
        data() {
            return {
                checked: true,
                external_userid: 0,  // 客户external_userid
                userid: 0,  // 员工userid
                sop_msg_status: 0, //  SOP消息免打扰是否开启:1开启0关闭
                chat_id: 0, //  是否是群聊
                is_chat: 0, // 是否是群聊
                agent_id: '',
                isReady: false, // 是否在加载中
            }
        },
        computed: {
            status: {
                get() {
                    return this.sop_msg_status == 1 ? true : false
                },
                set() {

                }
            }
        },
        onLoad() {
            this.external_userid = this.getParameter('external_userid') || localStorage.getItem('externalId') || ''
            this.userid = this.getParameter('user_id') || localStorage.getItem('user_id')
            this.is_chat = this.getParameter('is_chat') || localStorage.getItem('is_chat')
            this.agent_id = this.getParameter('agent_id') || localStorage.getItem('agent_id')

        },
        onShow() {
            this.$store.dispatch('setWx', () => {
                this.initPage(this.limit)
            })
        },
        methods: {
            async limit() {
                this.utils.setConfig.call(this, {agent_id: this.$route.query.agent_id || localStorage.getItem('agent_id')}).then((res)=>{
                    this.sopUserMsgStatus()
                })

            },
            async sopUserMsgStatus() {
                var params = {
                    corp_id: localStorage.getItem('corpid'), // 企业唯一标志
                    userid: this.userid, // 员工userid
                }
                if (this.is_chat == 0) {
                    params = {...params, external_userid: this.external_userid}
                } else {
                    params = {
                        ...params, chatid: this.chat_id
                    }
                }
                const {data: res} = await this.axios.post(`work-sop/sop-user${this.is_chat == 1 ? '-chat' : ''}-msg-status`, params);
                if (res.error == 0) {
                    this.sop_msg_status = res.data.sop_msg_status || res.data.sop_chat_msg_status
                } else {
                    this.$toast(res.error_msg)
                }
                this.isReady = true
            },

            async sopUserMsgStatusSet(e) { // SOP员工免打扰状态变更
                var params = {
                    userid: this.userid,
                    is_chat: this.is_chat,
                    status: e ? 1 : 0,
                    corp_id: localStorage.getItem('corpid'), // 企业唯一标志
                }
                const {data: res} = await this.axios.post("work-sop/sop-user-msg-status-set", params);
                if (res.error == 0) {
                    this.sopUserMsgStatus()
                } else {
                    this.$toast(res.error_msg)
                }
            },

            onInputStatus(e) {
                this.sopUserMsgStatusSet(e)
            },
            back() {
                history.back()
                // this.$linkUrl('', 'back')
            },
        }
    }
</script>

<style scoped>
	.ss-bell-box {border: 8px solid #eaeaea}
	page {background: #f6f6f6}
	.c-b5b5b5 {color: #b5b5b5}
</style>
