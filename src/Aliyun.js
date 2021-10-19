import OSS from 'ali-oss'
import Interface from './Interface'
import {deepMerge} from './utils'

export default class Aliyun extends Interface {
    constructor(options) {
        super(options)
        this.options = {
            ...this.options,
            ...options
        }
        this.client = null
        this._init()
    }

    /**
     * 初始化
     * @return {Promise<void>}
     */
    async _init() {
        try {
            const {async} = this.options
            if (async) {
                const asyncOptions = await this.options.getConfig()
                this.options = {
                    ...this.options,
                    ...asyncOptions || {}
                }
            }
            const {
                accessKeyId,
                accessKeySecret,
                stsToken,
                endpoint,
                bucket,
                cname,
                region,
                getToken
            } = this.options
            this.client = new OSS({
                accessKeyId,
                accessKeySecret,
                stsToken,
                endpoint,
                bucket,
                cname,
                region,
                refreshSTSToken: getToken
            })
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
        return new Promise(async (resolve, reject) => {
            const result = await this.client
                .put(
                    this._generateName(name),
                    file,
                    deepMerge(config, this.options.config)
                ).catch((err) => {
                    reject(err)
                })
            resolve(this._formatResult(result))
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
        return new Promise(async (resolve, reject) => {
            const result = await this.client
                .multipartUpload(
                    this._generateName(name),
                    file,
                    deepMerge(config, this.options.config)
                ).catch((err) => {
                    reject(err)
                })
            resolve(this._formatResult(result))
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
            const result = await this.client
                .multipartUpload(
                    name,
                    file,
                    deepMerge(config, this.options.config)
                ).catch((err) => {
                    reject(err)
                })
            resolve(this._formatResult(result))
        })
    }

    /**
     * 暂停
     */
    pause() {
        this.client.cancel()
    }

    /**
     * 取消分片上传
     * @param {string} name
     * @param {*} uploadId
     * @returns
     */
    abortMultipartUpload(name, uploadId) {
        return new Promise(async (resolve, reject) => {
            const result = await this.client
                .abortMultipartUpload(
                    name,
                    uploadId
                ).catch((err) => {
                    reject(err)
                })
            resolve(result)
        })
    }
}
