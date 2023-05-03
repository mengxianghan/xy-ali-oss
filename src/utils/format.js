import { generateUrl } from './generate'
import { getSuffix } from './get'

/**
 * 格式化路径
 * @param {string} path 路径
 * @returns {string}
 */
export function formatPath(path) {
    return path.replace(new RegExp('\\/{2,}', 'g'), '/').replace(new RegExp('^/', 'g'), '')
}

/**
 * 格式化响应值
 * @param {object} data
 * @param {string} cdnUrl
 * @param {boolean} cname 是否支持自定义域名，优先级比 cdnUrl 高
 * @returns {object}
 */
export function formatResponse({ data, cdnUrl, cname }) {
    const { name, res } = data
    const { requestUrls } = res
    const requestUrl = requestUrls?.[0]?.replace(/\?.*/gi, '') || ''
    const url = cname ? requestUrl : generateUrl({ url: requestUrl, cdnUrl })
    const suffix = getSuffix(url)
    return {
        url,
        name,
        suffix,
        meta: res,
    }
}
