import { formatPath } from './format'
import { guid } from '.'
import { getSuffix } from './get'

/**
 * 生成 url
 * @param {string} url
 * @param {string} cdnUrl
 * @returns {string}
 */
export function generateUrl({ url, cdnUrl }) {
    if (!cdnUrl) return url
    const { pathname } = new URL(url)
    const { protocol, host } = new URL(cdnUrl)
    return `${protocol}//${formatPath(host + pathname)}`
}

/**
 * 生成文件名
 * @param {string} filename 文件名
 * @param {boolean} rename 重命名
 * @param {string} rootPath 根目录
 * @returns {string}
 */
export function generateFilename({ filename, rename, rootPath }) {
    if (!filename) return ''
    const path = filename.substring(0, filename.lastIndexOf('/'))
    const newFilename = rename ? `${path}/${guid()}${getSuffix(filename)}` : filename
    return formatPath(`${rootPath}/${newFilename}`)
}
