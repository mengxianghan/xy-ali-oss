/**
 * 生成 GUID
 * @return {string}
 */
export function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * 合并
 * @param src
 * @param target
 * @return {*}
 */
export function deepMerge(src = {}, target = {}) {
    let key;
    for (key in target) {
        src[key] = Object.prototype.toString.call(src[key]) === '[object Object]' ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}
