<template>
	<view class="container">
		<uni-dropdown
			ref="dropdown"
			:options="options"
			height="80"
			:borderBottom="true"
			@close="handleClose"
			@open="handleOpen"
			@cellClick="handleCellClick"
			@sort="handleSort"
		>
			<template #custom>
				<view class="dropdown-content">
					测试
					<button @click="handleResize">重置</button>
					<button @click="handleConfirm">确定</button>
				</view>
			</template>
		</uni-dropdown>
	</view>
</template>

<script>
import uniDropdown from '../../components/uni-dropdown/index.vue'

export default {
	components: { uniDropdown },
	data() {
		return {
			value2: 2,
			options: [
				{
					title: '自定义',
					prop: 'custom',
					type: 'slot'
				},
				{
					title: '品种',
					prop: 'asset',
					type: 'cell',
					value: null,
					options: [
						{
							id: 1201,
							name: '香蕉'
						},
						{
							id: 1202,
							name: '苹果'
						}
					]
				},
				{
					title: '品牌',
					prop: 'brand',
					type: 'cell',
					value: null,
					options: [
						{
							id: 1108,
							name: '耐克'
						},
						{
							id: 1109,
							name: '阿迪'
						},
						{
							id: 1110,
							name: '李宁'
						}
					]
				},
				{
					title: '排序',
					prop: 'sort',
					type: 'sort',
					value: 'sort'
				}
			]
		}
	},
	mounted() {},
	methods: {
		handleResize() {
			this.$refs['dropdown'].close()
		},
		handleConfirm() {
			this.$refs['dropdown'].close()
		},
		handleOpen(index) {
			//console.log(index)
		},
		handleClose(index, val) {
			//console.log(index, val)
		},
		handleCellClick(obj) {
			console.log(obj)
			//this.options[obj.index].value = obj.value
		},
		handleSort(obj) {
			console.log(obj)
		}
	}
}
</script>

<style lang="scss">
.dropdown-content {
	background: #fff;
	height: 200rpx;
}
</style>
