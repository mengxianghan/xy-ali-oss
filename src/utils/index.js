import { isObject } from './is'

/**
 * guid
 * @return {string}
 */
export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

/**
 * 深度合并
 * @param {object} src
 * @param {object} target
 * @return {object}
 */
export function deepMerge(src = {}, target = {}) {
    let key
    for (key in target) {
        src[key] = isObject(src[key], 'Object') ? deepMerge(src[key], target[key]) : (src[key] = target[key])
    }
    return src
}
