// 判断arr是否为一个数组，返回一个bool值
export function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}

// 深度克隆
export function deepClone(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj;
	if (typeof obj !== "object" && typeof obj !== 'function') {
		//原始类型直接返回
		return obj;
	}
	var o = isArray(obj) ? [] : {};
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
		}
	}
	return o;
}

// 数值验证
export function number(value) {
	return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
}

export function addUnit(value = 'auto', unit = 'rpx') {
	value = String(value)
	// 用uView内置验证规则中的number判断是否为数值
	return number(value) ? `${value}${unit}` : value
}

// 获取系统信息
export function getSystemInfo() {
	return uni.getSystemInfoSync()
}

// 获取元素 由于使用 in this 这里要重新修改 挂载到 mixin 上
/* export function getRect(selector, all) {
	return new Promise(resolve => {
		uni.createSelectorQuery()
			.in(this)[all ? 'selectAll' : 'select'](selector)
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
} */