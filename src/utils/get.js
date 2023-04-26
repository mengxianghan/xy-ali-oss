/**
 * 获取后缀
 * @param {string} filename 文件名
 * @returns {string}
 */
export function getSuffix(filename) {
    return filename.substring(filename.lastIndexOf('.'))
}
