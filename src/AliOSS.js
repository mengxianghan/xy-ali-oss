import OSS from 'ali-oss'
import { deepMerge, generateGUID, formatPath, getSuffix } from './utils'

export default class AliOSS {
    constructor(options) {
        this.opts = {
            // 是否异步获取配置信息，默认 false。如果为 true 时，getConfig 需要返回 Promise 对象
            async: false,
            // 通过阿里云控制台创建的access key
            accessKeyId: '',
            // 通过阿里云控制台创建的access secret
            accessKeySecret: '',
            // 使用临时授权方式，详情请参见使用STS访问 (https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-32077-zh)
            stsToken: '',
            // 通过控制台创建的bucket
            bucket: '',
            // OSS域名
            endpoint: '',
            // bucket 所在的区域，默认 oss-cn-hangzhou
            region: 'oss-cn-hangzhou',
            // 是否使用阿里云内网访问，默认false。比如通过ECS访问OSS，则设置为true，采用internal的endpoint可节约费用
            internal: false,
            // 是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定
            cname: false,
            // bucket是否开启请求者付费模式，默认false。具体可查看请求者付费模式 (https://help.aliyun.com/document_detail/91337.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-yls-jm2-2fb)
            isRequestPay: false,
            // 则使用 HTTPS， (secure: false) 则使用 HTTP，详情请查看常见问题 (https://help.aliyun.com/document_detail/63401.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-63401-zh)
            secure: true,
            // 超时时间，默认 60s
            timeout: '60s',
            config: {
                headers: { 'Cache-Control': 'public' },
                rename: true,
                // 单独启用 cdn
                enableCdn: false,
            },
            refreshSTSTokenInterval: 300 * 1000,
            rootPath: '',
            // 启用 cdn
            enableCdn: false,
            // cdn 域名，enableCdn 设为 true 是，cdnUrl 必填
            cdnUrl: '',
            // 获取配置信息
            getConfig: function () {},
            // 获取 stsToken
            getToken: function () {},
            ...options,
        }
        this.client = null
    }

    /**
     * 初始化
     * @param {function} callback
     * @return {Promise<void>}
     */
    async _init(callback) {
        try {
            if (!this.client) {
                const { async } = this.opts
                if (async) {
                    const asyncOptions = await this.opts.getConfig()
                    this.opts = {
                        ...this.opts,
                        ...(asyncOptions || {}),
                    }
                }
                const {
                    accessKeyId,
                    accessKeySecret,
                    stsToken,
                    bucket,
                    endpoint,
                    region,
                    internal,
                    cname,
                    isRequestPay,
                    secure,
                    timeout,
                    getToken,
                } = this.opts
                this.client = new OSS({
                    accessKeyId,
                    accessKeySecret,
                    stsToken,
                    bucket,
                    endpoint,
                    region,
                    internal,
                    cname,
                    isRequestPay,
                    secure,
                    timeout,
                    refreshSTSToken: getToken,
                })
            }
            if (['[object Function]', '[object AsyncFunction]'].includes(Object.prototype.toString.call(callback))) {
                callback.call(this, this.client)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    /**
     * 上传
     * @param {string} name
     * @param {file} file
     * @param {object} config
     * @return {Promise<unknown>}
     */
    upload(name, file, config = {}) {
        config = deepMerge(this.opts.config, config)
        return new Promise((resolve, reject) => {
            this._init(function (client) {
                client
                    .put(this._generateName({ name, rename: config?.rename }), file, config)
                    .then((result) => {
                        resolve(
                            this._formatResult({
                                result,
                                enableCdn: this.opts?.enableCdn || config?.enableCdn,
                            })
                        )
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
    }

    /**
     * 取消
     */
    async cancel() {
        await this._init(function (client) {
            client.cancel()
        })
    }

    /**
     * 分片上传
     * @param {string} name
     * @param {file} file
     * @param {object} config
     * @return {Promise<unknown>}
     */
    multipartUpload(name, file, config = {}) {
        config = deepMerge(this.opts.config, config)
        return new Promise(async (resolve, reject) => {
            await this._init(function (client) {
                client
                    .multipartUpload(this._generateName({ name, rename: config?.rename }), file, config)
                    .then((result) => {
                        resolve(
                            this._formatResult({
                                result,
                                enableCdn: this.opts?.enableCdn || config?.enableCdn,
                            })
                        )
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
    }

    /**
     * 断点续传
     * @param {string} name
     * @param {file} file
     * @param {object} config
     * @return {Promise<unknown>}
     */
    resumeMultipartUpload(name, file, config = {}) {
        return new Promise(async (resolve, reject) => {
            await this._init(function (client) {
                client
                    .multipartUpload(name, file, deepMerge(config, this.opts.config))
                    .then((result) => {
                        resolve(
                            this._formatResult({
                                result,
                                enableCdn: this.opts?.enableCdn || config?.enableCdn,
                            })
                        )
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
    }

    /**
     * 取消分片上传
     * @param {string} name
     * @param {*} uploadId
     * @returns
     */
    abortMultipartUpload(name, uploadId) {
        return new Promise(async (resolve, reject) => {
            await this._init(function (client) {
                client
                    .abortMultipartUpload(name, uploadId)
                    .then((result) => {
                        resolve(result)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
    }

    /**
     * 格式化结果
     * @param {object} result
     * @param {boolean} enableCdn
     * @private
     */
    _formatResult({ result, enableCdn }) {
        const {
            name = '',
            res: { status = 500, size = 0, requestUrls = [] },
        } = result
        return {
            code: String(status),
            data: {
                name,
                url: this._formatUrl({
                    url: requestUrls && requestUrls.length ? requestUrls[0].split('?')[0] : '',
                    enableCdn,
                }),
                suffix: getSuffix(name),
                size,
            },
        }
    }

    /**
     * 格式化 url
     * @param {string} url
     * @param {boolean} enableCdn 启用cdn
     * @param {string} cndUrl
     * @returns
     */
    _formatUrl({ url, enableCdn }) {
        const { cdnUrl } = this.opts
        return enableCdn
            ? url.replace(new RegExp('http(s)?://([^/]+)/', 'g'), cdnUrl.endsWith('/') ? cdnUrl : `${cdnUrl}/`)
            : url
    }

    /**
     * 生成名称
     * @param {string} name 文件原始名
     * @param {boolean} rename 重命名
     * @return {string}
     * @private
     */
    _generateName({ name, rename = true }) {
        if (!name) return ''
        const path = name.substring(0, name.lastIndexOf('/'))
        const newName = rename ? `${path}/${generateGUID()}${getSuffix(name)}` : name
        return formatPath(`${this.opts.rootPath}/${newName}`)
    }

    /**
     * 获取文件后缀
     * @param {string} name 文件名
     * @return {string}
     */
    _getSuffix(name) {
        return name.substring(name.lastIndexOf('.'), name.length)
    }
}
