<template>
	<view>
		<uni-popup  ref="sopPop" type="bottom">
			<view class="bg-white p-30">
				<view class="flex items-center justify-between py-20 relative b-line">
					<view class="text-28 text-gray-501">{{is_chat==1?'群':'个人'}}SOP推送提醒</view>
					<view class="text-28 text-blue-501 cursor-pointer" @click="toSopList">查看全部（未完成{{sop_msg_count<0?0:sop_msg_count}}条）</view>
				</view>
				<view class=" text-gray-900 text-left text-26 py-20">
					<text>管理员提醒你在 {{sop_one_data&&sop_one_data.send_day}} {{sop_one_data&&sop_one_data.send_time}} </text>
					<text v-if='!is_chat'>给客户【{{sop_msg_nickname}}】</text>
					<text v-else>给客户群【{{chat_name}}】</text>
					<text>发送以下内容</text>
				</view>
				<scroll-view :scroll-y="true" class="ss-sop-pop">
					<sop-rules ref='sopRulesRef' :is_chat='is_chat' :isSend='true' :user_id='$route.query.user_id' :external_userid='$route.query.external_userid' :agent_id="$route.query.agent_id" :rules="sop_one_data&&sop_one_data.content"></sop-rules>
				</scroll-view>
				<view class="px-60 pt-30 flex items-center">
					<view class="br5 py-20  ss-sed-k-btn text-26 text-blue-501 text-white cursor-pointer mx-10 my-25 flex-1" v-if="!is_over_sop_one" @click="sopMsgSetOver(sop_one_data.msg_id)">完成</view>
					<view class=" bg-bq br5  py-20 text-26 text-blue-501 cursor-pointer mx-10 my-25 flex-1" v-else>我已完成</view>
					<view class=" bg-blue-501 br5 py-20 text-26 text-white cursor-pointer mx-10 my-25 flex-1" @click='sedAllHandle(index)' v-if="!is_mobile&&!is_over_sop_one" >一键发送</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import SopRules from '../../components/sop/SopRules'
    export default {
        name: "SopPop",
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
	    components: {SopRules},
	    data(){
            return {
                is_over_sop_one: false, // 是否完成了当前sop
                sop_one_data: null, // sop消息详情
                sop_msg_count: 0, // sop消息数量
                sop_msg_nickname: '',// 给谁发送
                has_sop_msg: 0,
                sop_msg_status : 0,
                chat_name: '', // 群名称
                is_mobile: false, // 是否是手机号
            }
	    },

	    created() {
            this.initData()
            this.is_mobile = this.is_mobile_fn()
        },
        computed: {
            is_open_sop_pop(){ // 是否打开sop弹框
                return  this.has_sop_msg > 0 && this.sop_msg_status ==0 ? true : false
            },
        },

        watch: {
            is_open_sop_pop: {
                handler(v) {
                    if (v) {
                        this.$nextTick(()=>{
                            this.$refs['sopPop'].open()
                        })
                    }
                },
	            immediate: true
            }
	    },
	    methods: {
            async initData (){
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

                const {data: res} = await this.axios.post(`work-sop/sop${is_chat==1? '-chat' : '' }-msg-content-one`,  params);
                if (res.error == 0) {
                    this.sop_one_data = res.data.list[0]
                    this.sop_msg_count = res.data.count
                    this.sop_msg_nickname = res.data.nickname
                    is_chat == 1 && (  this.chat_name = res.data.chatName)

                    this.sopUserMsgStatus()
                } else {

                }
            },
            is_mobile_fn () {
                if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                    return true; // 移动端
                }else{
                    return false; // PC端
                }
            },

            sedAllHandle() {
                this.$refs.sopRulesRef.allSendMeg()
            },

            async sopMsgSetOver(msg_id){ // 设置消息完成
                const {data: res} = await this.axios.post("work-sop/sop-msg-set-over", {
                        corp_id: localStorage.getItem('corpid'),
                        msg_id
                    }
                );
                if (res.error == 0) {
                    this.$toast('操作成功')
                    this.is_over_sop_one = true
	                this.sop_msg_count --


                    // 监听事件 通知；铃铛数据跟新
                    uni.$emit('trggerOverSop',{id: this.is_chat == 1? this.chat_id : this.external_userid})
                }
            },
            toSopList(){
                this.$linkUrl(`/pages/scrm/sopList?user_id=${this.user_id}&external_userid=${this.external_userid}&agent_id=${this.agent_id || localStorage.getItem('agent_id')}&is_chat=${this.is_chat}&chat_id=${this.chat_id}`)
            },

            async sopUserMsgStatus(){ // 初始化是否开启还是关闭的状态
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

                const {data: res} = await this.axios.post(`work-sop/sop-user${this.is_chat? '-chat' : '' }-msg-status`, params);
                if (res.error == 0) {
                    this.sop_msg_status = res.data[`sop_msg_status`]
                    this.has_sop_msg = res.data[`has_sop${is_chat? '_chat' : '' }_msg`]
                }
            },
	    },
        destroyed() {
            uni.$off('trggerOverSop')
        }

    }
</script>

<style lang="scss" scoped>
	.bg-bq{background: #e7effc}
	.ss-sed-k-btn{border: 1px solid #5283ec; box-sizing: border-box}
	.ss-sop-pop{height: calc(600rem/37.5); overflow: auto;}
</style>
