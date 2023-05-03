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
 * @param {boolean} enableCdn 启用 cdn 域名
 * @param {string} cdnUrl cdn 域名
 * @returns {object}
 */
export function formatResponse({ data, enableCdn, cdnUrl }) {
    const { name, res } = data
    const { requestUrls } = res
    const requestUrl = requestUrls?.[0]?.replace(/\?.*/gi, '') || ''
    const url = enableCdn ? requestUrl : generateUrl({ url: requestUrl, cdnUrl })
    const suffix = getSuffix(url)
    return {
        url,
        name,
        suffix,
        meta: res,
    }
}
