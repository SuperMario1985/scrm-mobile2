<template>
  <view class="face-container">
    <van-swipe class="my-swipe face-page"  indicator-color="#5077b7" :loop="false">
       <van-swipe-item  v-for="(page, index) in faces">
            <view v-for="item in page" class="swiper-content">
              <image @click="onFaceClick(`${item.title}`)" :src=item.src style="width:1.33rem;height:1.33rem;" />
            </view>
       </van-swipe-item>
    </van-swipe>
  </view>
</template>

<script>
import faceJSON from './face.json';
import { Swipe, SwipeItem } from 'vant';
export default {
  name:'',
  data: () => ({
    active   : 0,
    faceData : faceJSON,
    faceIndex: 0
  }),
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
  methods: {
    onFaceClick (face) {
      this.$emit('onFaceChoose', face)
    }
  }
}
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 1.06rem;/*20/18.75*/
  line-height: 8rem;/*150/18.75*/
  text-align: center;
  background-color: #fff;
}

.swiper-content{
  width: 14.28%;
  height: 29%;
  display: flex;
  justify-content: center;
}

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 1.06rem;/*20/18.75*/
  height: 9.2rem;
  padding-top: 1.06rem;/*20/18.75*/
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.van-swipe__indicator{
  background: #8f8f94 !important;
}

.van-swipe__indicator--active{
  background:#5077b7 !important;
}
</style>