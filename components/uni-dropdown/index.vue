<template>
	<!-- :style="showDropdown ? '' : 'overflow:hidden'" -->
	<!-- 防止透传 -->
	<view class="uni-dropdown" @touchmove.stop.prevent="() => {}" @tap.stop.prevent="() => {}">
		<view
			class="uni-dropdown__menu "
			:class="{ 'uni-border-bottom': borderBottom }"
			:style="{
				height: addUnit(height)
			}"
		>
			<view
				class="uni-dropdown__menu__item"
				v-for="(item, index) in menuList"
				:key="index"
				@tap.stop="menuClick(index, item)"
			>
				<text
					class="uni-dropdown__menu__item__title"
					:style="{
						color: index === current || (item.value && item.value !== 'sort') ? activeColor : inactiveColor,
						fontSize: addUnit(titleSize)
					}"
				>
					{{ item.title }}
				</text>
				<view v-if="item.type === 'sort'" class="uni-dropdown__menu__item__arrow">
					<text
						class="iconfont"
						:class="`icon-${SORT_ICON[item.value]}`"
						:style="{
							color: item.value === 'asc' || item.value === 'desc' ? activeColor : '#c0c4cc',
							fontSize: addUnit(menuIconSize)
						}"
					></text>
				</view>
				<view
					v-else
					class="uni-dropdown__menu__item__arrow"
					:class="[index === current ? 'uni-dropdown__menu__item__arrow--rotate' : '']"
				>
					<text
						:class="['iconfont', `icon-${menuIcon}`]"
						:style="{
							color: index === current ? activeColor : '#c0c4cc',
							fontSize: addUnit(menuIconSize)
						}"
					></text>
				</view>
			</view>
		</view>
		<view
			class="uni-dropdown__content"
			:style="[
				contentStyle,
				{
					transition: `opacity ${duration / 1000}s linear`,
					top: `calc(${addUnit(height)} + ${borderBottom ? '2rpx' : 0})`,
					height: contentHeight + 'px'
				}
			]"
			@tap="maskClick"
			@touchmove.stop.prevent
		>
			<view class="uni-dropdown__content__popup" :style="[popupStyle]" @tap.stop.prevent>
				<template v-for="(item, index) in menuList">
					<view class="dropdown-popup-box" :key="index" v-if="index === current">
						<template v-if="item.type === 'cell'">
							<DropdownCell :cellItem="item" :cellIndex="index" @cellClick="cellClick"></DropdownCell>
						</template>
						<template v-if="item.type === 'slot'">
							<slot :name="item.prop"></slot>
						</template>
					</view>
				</template>
			</view>
			<view class="uni-dropdown__content__mask"></view>
		</view>
	</view>
</template>

<script>
import { deepClone, addUnit, getSystemInfo, getRect } from '@/utils/index.js'
import DropdownCell from './components/DropdownCell.vue'

// 排序
const SWITCH_SORT_MAP = {
	asc: 'desc', // 升 降
	desc: 'sort', // 降 空
	sort: 'asc'
}

const SORT_ICON = {
	asc: 'arrow-up',
	desc: 'arrow-down',
	sort: 'sort'
}

export default {
	name: 'uni-dropdown',
	components: { DropdownCell },
	props: {
		options: {
			type: Array,
			default: () => []
		},
		// 菜单标题和选项的激活态颜色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 菜单标题和选项的未激活态颜色
		inactiveColor: {
			type: String,
			default: '#606266'
		},
		// 点击遮罩是否关闭菜单
		closeOnClickMask: {
			type: Boolean,
			default: true
		},
		// 点击当前激活项标题是否关闭菜单
		closeOnClickSelf: {
			type: Boolean,
			default: true
		},
		// 过渡时间
		duration: {
			type: [Number, String],
			default: 300
		},
		// 标题菜单的高度，单位任意，数值默认为rpx单位
		height: {
			type: [Number, String],
			default: 80
		},
		// 是否显示下划线
		borderBottom: {
			type: Boolean,
			default: true
		},
		// 标题的字体大小
		titleSize: {
			type: [Number, String],
			default: 28
		},
		// 菜单右侧的icon图标
		menuIcon: {
			type: String,
			default: 'arrow-down'
		},
		// 菜单右侧图标的大小
		menuIconSize: {
			type: [Number, String],
			default: 36
		},
		// 下拉出来的内容部分的圆角值
		borderRadius: {
			type: [Number, String],
			default: 0
		}
	},
	data() {
		return {
			SORT_ICON,
			//showDropdown: false, // 是否打开下来菜单,
			menuList: [], // 显示的菜单
			active: false, // 下拉菜单的状态
			// 当前是第几个菜单处于激活状态，小程序中此处不能写成false或者""，否则后续将current赋值为0，
			// 无能的TX没有使用===而是使用==判断，导致程序认为前后二者没有变化，从而不会触发视图更新
			current: 99999,
			// 外层内容的样式，初始时处于底层，且透明
			contentStyle: {
				zIndex: -1,
				opacity: 0
			},
			// 让某个菜单保持高亮的状态
			highlightIndex: 99999,
			contentHeight: 0
		}
	},
	computed: {
		// 下拉出来部分的样式
		popupStyle() {
			let style = {}
			// 进行Y轴位移，展开状态时，恢复原位。收齐状态时，往上位移100%，进行隐藏
			style.transform = `translateY(${this.active ? 0 : '-100%'})`
			style['transition-duration'] = this.duration / 1000 + 's'
			style.borderRadius = `0 0 ${addUnit(this.borderRadius)} ${addUnit(this.borderRadius)}`
			return style
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		addUnit,
		init() {
			this.getContentHeight()
			this.menuList = deepClone(this.options)

			this.menuList = this.menuList.map(item => {
				if (item.type === 'cell' && Array.isArray(item.options) && item.options.length) {
					item.options.unshift({ id: 0, name: '不限' })
				}
				return item
			})
		},
		getContentHeight() {
			const windowHeight = getSystemInfo().windowHeight
			this.getRect('.uni-dropdown__menu').then(res => {
				this.contentHeight = windowHeight - res.bottom
			})
		},
		// 获取元素
		getRect(selector, all) {
			return new Promise(resolve => {
				uni.createSelectorQuery()
					.in(this)
					[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect)
						}
						if (!all && rect) {
							resolve(rect)
						}
					})
					.exec()
			})
		},
		// 菜单点击
		menuClick(index, item) {
			if (item.type === 'sort') {
				this.close()
				// 默认倒序
				this.menuList[index].value = this.menuList[index].value
					? SWITCH_SORT_MAP[this.menuList[index].value]
					: 'asc'

				const res = {
					prop: item.prop,
					index,
					value: this.menuList[index].value
				}

				this.$emit('sort', res)
			} else {
				this.resizeSort()
				if (this.current === index && this.closeOnClickSelf) {
					this.close()
					return
				}
				this.open(index)
			}
		},
		resizeSort() {
			const sortItemIndex = this.menuList.findIndex(item => item.type === 'sort')
			if (sortItemIndex > -1) {
				this.menuList[sortItemIndex].value = 'sort'
			}
		},
		// 点击遮罩
		maskClick() {
			// 如果不允许点击遮罩，直接返回
			if (!this.closeOnClickMask) return
			this.close()
		},
		// 打开下拉菜单
		open(index) {
			//this.showDropdown = true
			// 展开时，设置下拉内容的样式
			this.contentStyle = {
				zIndex: 11
			}
			// 标记展开状态以及当前展开项的索引
			this.active = true
			this.current = index
			this.$emit('open', this.current)
		},
		// 设置下拉菜单处于收起状态
		close(val) {
			if (val !== undefined) {
				this.menuList[this.current].value = val
			}

			//this.showDropdown = false

			// 设置为收起状态，同时current归位，设置为空字符串
			this.active = false
			this.current = 99999
			// 下拉内容的样式进行调整，不透明度设置为0
			this.contentStyle = {
				zIndex: -1,
				opacity: 0
			}

			this.$emit('close', this.current)
		},
		// 列表点击
		cellClick(res) {
			this.menuList[res.index].value = res.value
			this.close()
			this.$emit('cellClick', res)
		}
	}
}
</script>

<style lang="scss" scoped>
.uni-dropdown {
	--dropdown-menu-height: 80rpx;

	width: 100%;
	position: relative;
	&__menu {
		display: flex;
		position: relative;
		z-index: 11;
		height: var(--dropdown-menu-height);
		&__item {
			display: flex;
			flex: 1;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			padding: 0 28rpx;
			&__arrow {
				margin-left: 6rpx;
				transition: transform 0.3s;
				&--rotate {
					transform: rotate(180deg);
				}

				.iconfont {
					vertical-align: -4rpx;
					color: #c0c4cc;
				}
			}
		}
	}
	&__content {
		position: absolute;
		z-index: 8;
		width: 100%;
		top: var(--dropdown-menu-height);
		left: 0px;
		bottom: 0;
		overflow: hidden;
		&__popup {
			position: relative;
			z-index: 10;
			transition: all 0.3s;
			transform: translate3D(0, -100%, 0);
			overflow: hidden;
		}
		&__mask {
			position: absolute;
			z-index: 9;
			background: rgba(0, 0, 0, 0.3);
			width: 100%;
			left: 0;
			top: 0;
			bottom: 0;
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
		z-index: -1;
	}
}
</style>
