<template>
    <view class="app-layout"  :class="{ 'app-layout-background' : haveBackground ,  'is-footer' : isFooter}" >

        <!--主体 s-->
        <view>
           <slot></slot>
        </view>
        <!--主体 e-->

	    <view v-if='!loading'>
		    <Footer v-if="is_show_copyright == 1"></Footer>
	    </view>

    </view>
</template>

<script>
   import {mapState, mapGetters} from 'vuex';
   import Footer from "./footer/footer.vue";
   export default {
       name: "app-layout",
       data() {
           return {
               navigationBarTitle: '',
           };
       },
       components: {
           Footer
       },
       computed: {
           ...mapState({
               is_show_copyright:  state => state.is_show_copyright,
           })
       },
       props: {
           isFooter: { // 是否有底部导航
               type: Boolean,
               default () {
                   return false
               },
           },
           loading: { // 是否在加载中
               type: Boolean,
               default() {
                   return false;
               }
           },
           isPage: { // 页面分页
               type: Boolean,
               default() {
                   return false;
               }
           },
           haveBackground: { // 是否需要背景颜色
               type: Boolean,
               default() {
                   return false;
               }
           },
       },
       watch: {

       },
       created() {
       },
       mounted() {

       },
       beforeDestroy() {
       },
       methods: {

       },
   }
</script>

<style scoped lang="scss">

   .app-layout {
       max-width: 100%;
       min-height: 100vh;
   }

   .is-footer {
       min-height: calc(100vh - 0px - env(safe-area-inset-bottom));
   }

</style>
