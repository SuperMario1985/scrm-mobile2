<template>
	<view class="hello">
		<template v-for="item in data">
			<van-collapse v-model="activeNames" accordion @change="chooseGroup(item.key,item.title)" :key="item.key">
				<template v-if="item.children.length == 0">
					<van-cell :key="item.key" :title="item.title" @click="chooseGroup(item.key,item.title)" />
				</template>

				<template v-if="item.children.length > 0">
					<van-collapse-item :title="item.title" :name="item.key" :key="item.key" @click="chooseGroup(item.key,item.title)">
						<group :data="item.children"></group>
					</van-collapse-item>
				</template>
			</van-collapse>
		</template>
	</view>
</template>

<script>
	export default {
		name: "group",
		props: {
			data: Array
		},
		components: {},
		data() {
			return {
				activeNames: '',
				group_id: ''
			};
		},
		methods: {
			chooseGroup(val, title) {
				this.$store.commit("setGroupId", val);
				this.$store.commit("setGroupName", title);
			},
		},
		onLoad() {},
		onShow() {}
	}
</script>

<style scoped>
	/deep/ .van-collapse-item__content {
		padding: 0;
	}

	.active {
		border: 2px solid #1989FA;
	}
</style>
