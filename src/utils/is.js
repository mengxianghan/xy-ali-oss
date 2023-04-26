/**
 * @param {*} val
 * @param {string} type
 * @returns {boolean}
 */
export function is(val, type) {
    return Object.prototype.toString.call(val).slice(8, -1) === type
}

/**
 * 是否对象
 * @param {*} val
 * @returns {boolean}
 */
export function isObject(val) {
    return is(val, 'Object')
}
