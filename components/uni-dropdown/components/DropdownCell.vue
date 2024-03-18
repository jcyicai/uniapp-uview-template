<template>
	<view class="uni-dropdown-cell uni-border-bottom" @touchmove.stop.prevent="() => {}" @tap.stop.prevent="() => {}">
		<scroll-view scroll-y="true" style="{height: 'auto'}">
			<view class="uni-dropdown-cell-box">
				<view
					class="uni-dropdown-cell-item uni-border-bottom"
					v-for="(item, index) in cellItem.options"
					:key="index"
					@click="cellClick(item.id)"
				>
					<text :style="{ color: current === item.id ? activeColor : inactiveColor }">{{ item.name }}</text>
					<text v-if="current === item.id" class="iconfont icon-check icon-item"></text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { deepClone } from '@/utils/index.js'
export default {
	name: 'DropdownCell',
	props: {
		cellItem: {
			type: Object,
			default: () => {}
		},
		cellIndex: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			active: false,
			current: null,
			activeColor: '#2979ff', // 激活时左边文字和右边对勾图标的颜色
			inactiveColor: '#606266' // 未激活时左边文字和右边对勾图标的颜色
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			const options = this.cellItem?.options
			const cellValue = this.cellItem?.value
			if (Array.isArray(options) && options.length && cellValue) {
				for (let i = 0; i < options.length; i++) {
					const item = options[i]
					if (item.id === cellValue) {
						this.current = item.id
						break
					}
				}
			}
		},
		cellClick(val) {
			this.current = val
			const res = {
				prop: this.cellItem.prop,
				index: this.cellIndex,
				value: this.current
			}
			this.$emit('cellClick', res)
		}
	}
}
</script>

<style lang="scss" scoped>
.uni-dropdown-cell {
	overflow: hidden;
	.uni-dropdown-cell-box {
		overflow: hidden;
		.uni-dropdown-cell-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 26rpx 24px;
			font-size: 28rpx;
			color: #606266;
			background: #fff;
			.icon-item {
				color: #2979ff;
			}
		}
		.uni-dropdown-cell-hover {
			background: #f7f8f9 !important;
		}
	}
}

.uni-border-bottom {
	position: relative;
	&::after {
		content: ' ';
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 200%;
		border-bottom: 1px solid #e4e7ed;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		z-index: 1;
	}
}
</style>
