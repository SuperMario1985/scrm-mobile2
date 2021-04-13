<template>
	<material
			style="height: 100%"
			:type="parseInt(this.$route.query.type)"
			:close="filingCabinetClose"
			:call-back="replyMsg">
	</material>
</template>

<script>
	import material from "../../components/material";

	export default {
		name      : "filing",
		components: {
			material,
		},
		inject    : ['initPage', 'getParameter', 'getExternalId'],
		data () {
			return {
				type     : parseInt(this.$route.query.type),
				content  : null,
				wx       : false,
				wxWork   : false,
				jsApiList: '',
				timestamp: ''

			}
		},
		mounted () {
		},
		methods   : {
			onNavigationBarButtonTap (val) {
				this.$store.commit('setAttachmentId', this.content)
				uni.navigateTo({
					url: '/pages/moments/publish?user_id=' + localStorage.getItem('user_id') + '&corp_id=' + localStorage.getItem('corpid')
				})
			},
			filingCabinetClose () {
				this.showFilingCabinet = false
			},
			replyMsg (type, content, item) {
				this.content = {local_path: content, attachment: item.id}
			},
		},
		onload () {

		}
	}
</script>

<style scoped>

</style>