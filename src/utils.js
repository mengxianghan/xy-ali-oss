/**
 * 生成 GUID
 * @return {string}
 */
export function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

/**
 * 深度合并
 * @param src
 * @param target
 * @return {*}
 */
export function deepMerge(src = {}, target = {}) {
    let key
    for (key in target) {
        src[key] =
            Object.prototype.toString.call(src[key]) === '[object Object]'
                ? deepMerge(src[key], target[key])
                : (src[key] = target[key])
    }
    return src
}

/**
 * 格式化路径
 * @param {string} path 路径
 * @returns {string}
 */
export function formatPath(path) {
    return path.replace(new RegExp('\\/{2,}', 'g'), '/').replace(new RegExp('^/', 'g'), '')
}

/**
 * 获取后缀
 * @param {string} name 名称
 */
export function getSuffix(name) {
    return name.substring(name.lastIndexOf('.'), name.length)
}
