<template>
	<app-layout :loading='!isReady'>
		<view class="">
			<uni-nav-bar   left-icon="back" title="系统通知" @clickLeft="back" background-color="#5284ec" color="#fff" :fixed="true">
				<div class="icon_set scrmIconfont text-40 mr-10" slot="right" @click='toSopSet'></div>
			</uni-nav-bar>
			<view class="uni-navbar__content z-2">
				<view class='mx-35 ss-sticky-top-li py-20'>
					<van-checkbox checked-color='#5284ec'  icon-size='15px' v-model="is_show_no_over"> <view class='text-24 text-gray-501'>仅显示未完成任务</view></van-checkbox>
				</view>
			</view>
			<view class="px-30 py-30 pt-100">
				<view class="mb-30" v-for="(item, index) in pageList">
					<view class='ml-60 text-gray-501 text-24 pb-20 pt-10'>{{item.send_day}} {{item.send_time}}</view>
					<view class="clearfix ohidden">
						<view class="float-left">
							<view class="w-60 h-60 br100 bg-blue-501 flex items-center justify-center mb-5">
								<text class="scrmIconfont icon_bell text-white"></text>
							</view>
						</view>
						<view class="bg-white ml-80 px-20 py-20 br6 ss-send-box relative flex-none">
							<view class='flex justify-between items-center'>
								<view class="text-left text-30 text-gray-900 font-bold py-10">{{is_chat==1?'群':'个人'}}SOP推送提醒</view>
								<view v-if="item.is_over>0" class="bg-bq text-blue-501 br5 py-6 px-15 text-20  mx-10 br5">我已完成</view>
							</view>

							<view class="text-left text-26 text-gray-501">
								<text>管理员提醒你在</text>
								<text class="text-blue-501 px-5">{{item.send_day}} {{item.send_time}}</text>
								<text v-if="is_chat==0">给客户【{{nickname}}】发送以下内容</text>
								<text v-else>给客户群【{{chatName}}】发送以下内容</text>
							</view>
							<view>
								<sopRules :is_chat='is_chat' :ref ="'sopRulesRef'+index" :user_id='user_id' :external_userid='external_userid' :agent_id="$route.query.agent_id"  :rules="item.content" :isSend='item.is_over == 0'></sopRules>
								<view class="flex justify-center items-center">
									<view v-if="item.is_over==0" class="br5 py-10 px-55 text-26  mx-10 cursor-pointer ss-sed-k-btn text-blue-501 my-25" @click="sopMsgSetOver(item, index)">完成</view>
									<view class=" bg-blue-501 br5 py-10 px-40 text-26 text-white cursor-pointer mx-10 my-25" v-if="!is_mobile && item.is_over == 0" @click='sedAllHandle(index)'>一键发送</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<uni-load-more :iconSize = '18' color='#777'  :status="hasMore?'loading':''" />

			</view>
		</view>
	</app-layout>
</template>

<script>
	import sopRules from '../../components/sop/SopRules'
    export default {
        name: "sop",
        inject: ['initPage', 'getExternalId', 'getParameter', 'getContext'],
	    components: {sopRules},
	    watch: {
            is_show_no_over : {
                handler(v) {
                    this.pageList = []
	                this.pageNo = 1
                    this.getPagServer(1, true)
                },
            },
        },
	    data(){
            return {
                external_userid: 0, // 客户external_userid
                user_id: 0, // 员工userid

                pageList: [],
                hasMore: true, // 判断 数据是否全部加载完
                isLodingLock: true, //锁 防止数据加载不出来多次请求
                pageNo: 1, //当前第一组分页当前页码
                nickname: '', // 要发送的人
                chatName: '', // 要发送群
                is_chat: 0, // 是否是群
                chat_id: 0, // 群id
                isReady: false, // 是否加载完成
                is_mobile: false, // 是否是移动端
                is_show_no_over: false, // 是否显示未完成的
            }
	    },
	    onLoad() {
            this.external_userid = this.getParameter('external_userid') || localStorage.getItem('externalId')
            this.user_id = this.getParameter('user_id') || localStorage.getItem('user_id')
            this.is_chat = this.getParameter('is_chat')  || 0
            this.chat_id = this.getParameter('chat_id')  || 0
            this.is_mobile = this.is_mobile_fn()
            this.$store.dispatch('setWx', () => {
                this.initPage(this.limit)
            })
	    },


        onReachBottom() { //滑动到底部触发
            this.loadingMore()
        },

        methods: {
            sedAllHandle(index) {
				var r = 'sopRulesRef'+index
                this.$refs[r][0].allSendMeg()
            },

            toSopSet(){
                this.$linkUrl(`/pages/scrm/sopSet?user_id=${this.user_id}&external_userid=${this.external_userid}&is_chat=${this.is_chat}&chat_id=${this.chat_id}&agent_id=${ this.$route.query.agent_id || localStorage.getItem('agent_id')}`)
            },

            is_mobile_fn () {
                if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                    return true; // 移动端
                }else{
                    return false; // PC端
                }
            },

            back(){
                history.back()
                // this.$linkUrl('', 'back')
            },

            // 加载更多
            loadingMore: function () {
                if (this.isLodingLock) {
                    this.isLodingLock = false;
                    this.getPagServer(this.page)
                }
            },
            getPagServer (page, isClickTab = false) { //分页
                const is_chat = this.is_chat
                return new Promise((resolve)=>{
                    var params = {
                        corp_id: localStorage.getItem('corpid'), // 企业唯一标志
                        userid: this.user_id, // 员工userid
                        page: this.pageNo, // 页码
                        page_size: 10, // 页数
                        not_over: this.is_show_no_over ? 1 : 0
                    };

                    if (is_chat==1) {
                        params = {...params, chatid: this.chat_id}
                    } else {
                        params = {...params,  external_userid: this.external_userid,}
                    }

                    this.$pageSize.call(this,  `work-sop/sop${is_chat==1?'-chat':''}-msg-content-list` , params, isClickTab, 'data.data.list').then((res)=>{
                        this.nickname = res.data.data.nickname || ''
                        this.chatName = res.data.data.chatName || ''
	                    this.isReady = true
                    })
                })
            },

            async sopMsgSetOver(item, index){ // 设置消息完成
                const {data: res} = await this.axios.post("work-sop/sop-msg-set-over", {
                        corp_id: localStorage.getItem('corpid'),
                        msg_id: item.msg_id
                    }
                );
                if (res.error == 0) {
                    this.$toast('操作成功')
					this.$set(this.pageList[index], 'is_over', 1)
                }
            },
            async limit() {
                this.utils.setConfig.call(this, {agent_id: this.$route.query.agent_id || localStorage.getItem('agent_id')}).then((res)=>{
                    this.utils.setAgentConfig.call(this, res)
                    this.getPagServer(1, true); // 获取当前分页的数据
                })
            },
	    }
    }
</script>

<style scoped>
	.bg-bq{background: #e7effc}
	page{background: #f6f6f6}
	.ss-sed-k-btn{border: 1px solid #5283ec; box-sizing: border-box}
	.ss-send-box:after{content: ""; position: absolute; left: -10px; top: 10px;  border: 5px solid rgba(0,0,0,0);border-right-color: #fff;width: 0;height: 0;}
	.ss-sticky-top{background-color: blue; position: fixed;   }
	.uni-navbar__content {position: fixed;background-color: #fff; width: 750rpx;}
</style>
