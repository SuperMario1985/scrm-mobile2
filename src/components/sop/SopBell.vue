<template>
	<view>
		<drag-button :isDock="true" :existTabBar="true" :marginTop="220">
			<view class="text-red-501 bg-white w-90 h-90 br100 ss-bell-box flex justify-center items-center" @click='toSopList'>
				<view class="w-50 h50 relative">
					<view class="bg-red-501 right-0 top-0 w-8 h-8 absolute br100" v-if="has_sop_msg>0"></view>
					<image class="w-50 h-50 block" src='../../static/scrm/bell_n.png' v-if="sop_msg_status == 1"></image>
					<image class="w-50 h-50 block" src='../../static/scrm/bell_s.png' v-else></image>
				</view>
			</view>
		</drag-button>
	</view>
</template>

<script>
    import dragButton from "../../components/drag-button/drag-button.vue";
    export default {
        name: "SopBell",
	    props: {
            external_userid : { // 外部联系人id
                type: String,
                default(){
                    return ''
                }
            },
            user_id : {
                type: String,
                default(){
                    return ''
                }
            },
            agent_id : {
                type: String,
                default(){
                    return ''
                }
            },
            chat_id: { // 客户群id
                type: [Number, String],
                default(){
                    return 0
                }
            },
            is_chat : { // 是否是群聊
                type: [Number, String],
                default(){
                    return 0
                }
            }
	    },
	    data(){
            return {
                has_sop_msg: 0, // 是否还有 has_sop_msg 消息
                sop_msg_status: 0, // 铃铛是否开启还是关闭
            }
	    },
	    components: {
            dragButton
	    },
	    created() {
            this.initData()
            uni.$on('trggerOverSop', ({id}) =>{
                if ((this.is_chat == 0 && id== this.external_userid) || (this.is_chat == 1 && id== this.chat_id)) {
                    this.initData();
                    console.log('初始化一下铃铛数据')
                }
            })
        },
	    methods: {
            async initData(){ // 初始化是否开启还是关闭的状态
                var is_chat = this.is_chat
                var params = {
                    corp_id: localStorage.getItem('corpid'),
                    userid: this.user_id,
                }

                if (is_chat==1) {
                    params = {...params, chatid: this.chat_id }
                } else {
                    params = {...params, external_userid:  this.external_userid}
                }

                const {data: res} = await this.axios.post(`work-sop/sop-user${is_chat==1? '-chat' : '' }-msg-status`, params);
                if (res.error == 0) {
                    this.sop_msg_status = res.data.sop_msg_status ||  res.data.sop_chat_msg_status
                    this.has_sop_msg = res.data.has_sop_msg ||  res.data.has_sop_chat_msg
                }
            },
            toSopList(){
                this.$linkUrl(`/pages/scrm/sopList?user_id=${this.user_id}&external_userid=${this.external_userid}&agent_id=${this.agent_id || localStorage.getItem('agent_id')}&is_chat=${this.is_chat}&chat_id=${this.chat_id}`)
            },
	    },
        destroyed() {
            uni.$off('trggerOverSop')
        }
    }
</script>

<style scoped>
	.ss-bell-box{ box-shadow: 0px 10px 12px 0px rgba(82, 131, 236, 0.23);}
</style>
