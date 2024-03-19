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
					<input class="uni-input" placeholder="请输入" v-model="iptValue" />
					<view class="btn-box">
						<button @click="handleResize">重置</button>
						<button @click="handleConfirm">确定</button>
					</view>
				</view>
			</template>
		</uni-dropdown>
		<view v-for="(item, index) in 100" :key="index">{{ item }}</view>
	</view>
</template>

<script>
import uniDropdown from '../../components/uni-dropdown/index.vue'

export default {
	components: { uniDropdown },
	data() {
		return {
			iptValue: '',
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
			this.iptValue = ''
			this.$refs['dropdown'].close(this.iptValue)
		},
		handleConfirm() {
			this.$refs['dropdown'].close(this.iptValue)
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

<style lang="scss" scoped>
.dropdown-content {
	background: #fff;
	padding: 28rpx;
	.uni-input {
		margin-bottom: 28rpx;
		border: 1px solid #ccc;
		font-size: 28rpx;
	}
	.btn-box {
		display: flex;
		::v-deep uni-button {
			width: 100% !important;
			padding: 14rpx 14rpx !important;
			line-height: normal;

			overflow: auto !important;
		}
	}
}
</style>
