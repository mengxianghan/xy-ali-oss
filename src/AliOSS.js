import OSS from 'ali-oss'
import { deepMerge, generateGUID } from './utils'

export default class AliOSS {
    constructor(options) {
        this.opts = {
            async: false, // 是否异步获取配置信息，默认 false。如果为 true 时，getConfig 需要返回 Promise 对象
            accessKeyId: '', // 通过阿里云控制台创建的access key
            accessKeySecret: '', // 通过阿里云控制台创建的access secret
            stsToken: '', // 使用临时授权方式，详情请参见使用STS访问 (https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-32077-zh)
            bucket: '', // 通过控制台创建的bucket
            endpoint: '', // OSS域名
            region: 'oss-cn-hangzhou', // bucket 所在的区域，默认 oss-cn-hangzhou
            internal: false, // 是否使用阿里云内网访问，默认false。比如通过ECS访问OSS，则设置为true，采用internal的endpoint可节约费用
            cname: false, // 是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定
            isRequestPay: false, // bucket是否开启请求者付费模式，默认false。具体可查看请求者付费模式 (https://help.aliyun.com/document_detail/91337.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-yls-jm2-2fb)
            secure: true, //  则使用 HTTPS， (secure: false) 则使用 HTTP，详情请查看常见问题 (https://help.aliyun.com/document_detail/63401.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-63401-zh)
            timeout: '60s', // 超时时间，默认 60s
            config: {
                headers: { 'Cache-Control': 'public' },
                rename: true
            },
            refreshSTSTokenInterval: 300 * 1000,
            rootPath: '',
            getConfig: function () {
            },
            getToken: function () {
            },
            ...options
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
                        ...asyncOptions || {}
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
                    getToken
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
                    refreshSTSToken: getToken
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
                client.put(
                    this._generateName(name, config?.rename),
                    file,
                    config
                ).then((result) => {
                    resolve(this._formatResult(result))
                }).catch((err) => {
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
                client.multipartUpload(
                    this._generateName(name, config?.rename),
                    file,
                    config
                ).then((result) => {
                    resolve(this._formatResult(result))
                }).catch((err) => {
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
                client.multipartUpload(
                    name,
                    file,
                    deepMerge(config, this.opts.config)
                ).then((result) => {
                    resolve(this._formatResult(result))
                }).catch((err) => {
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
                client.abortMultipartUpload(
                    name,
                    uploadId
                ).then((result) => {
                    resolve(result)
                }).catch((err) => {
                    reject(err)
                })
            })
        })
    }

    /**
     * 格式化结果
     * @param {object} result
     * @private
     */
    _formatResult(result = {}) {
        const {
            name = '',
            res: { status = 500, size = 0, requestUrls = [] }
        } = result
        return {
            code: String(status),
            data: {
                name,
                url: requestUrls && requestUrls.length ? requestUrls[0].split('?')[0] : '',
                suffix: this._getSuffix(name),
                size
            }
        }
    }

    /**
     * 生成名称
     * @param {string} name 文件原始名
     * @param {boolean} rename 重命名
     * @return {string}
     * @private
     */
    _generateName(name, rename = true) {
        if (!name) return ''
        const path = name.substring(0, name.lastIndexOf('/'))
        const newName = rename ? `${path}/${generateGUID()}${this._getSuffix(name)}` : name
        return `${this.opts.rootPath}/${newName}`
            .replace(new RegExp('\\/{2,}', 'g'), '/')
            .replace(new RegExp('^\/', 'g'), '')
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
