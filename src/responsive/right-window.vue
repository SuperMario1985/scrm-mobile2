<template>
	<pages-scrm-customer ref="detailPage"></pages-scrm-customer>
</template>

<script>
	export default {
		name: "right-window",
		created(e) {
			//监听自定义事件，该事件由详情页列表的点击触发
			uni.$on('updateDetail', (e) => {
				// 执行 /pages/detail/detail.nvue页面的load方法
				this.$refs.detailPage.load(e.detail);
			})
		},
	}
</script>

<style scoped>

</style>