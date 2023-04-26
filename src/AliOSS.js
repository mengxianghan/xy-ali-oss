import { generateFilename } from './utils/generate'
import { deepMerge } from './utils'
import { formatResponse } from './utils/format'

class AliOSS {
    #opts
    #instance = null

    constructor(options) {
        this.#opts = {
            async: false,
            rootPath: '',
            cdnUrl: '',
            refreshSTSTokenInterval: 300000,
            config: {
                headers: { 'Cache-Control': 'public' },
                rename: true,
            },
            refreshSTSToken: () => {},
            getOptions: () => {},
            ...options,
        }

        this.#init()
    }

    get store() {
        return this.#instance
    }

    /**
     * 初始化
     * @returns {Promise<void>}
     */
    async #init() {
        if (this.#instance) return

        if (this.#opts.async) {
            const options = await this.#opts.getOptions().catch(() => {})
            this.#opts = {
                ...this.#opts,
                ...(options || {}),
            }
        }

        const { async, getOptions, ...options } = this.#opts

        this.#instance = new OSS({
            ...options,
        })
    }

    /**
     * 上传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise<unknown>}
     */
    upload(filename, data, config = {}) {
        return new Promise((resolve, reject) => {
            try {
                ;(async () => {
                    config = deepMerge(this.#opts?.config || {}, config)
                    const result = await this.#instance
                        .put(
                            generateFilename({
                                filename,
                                rename: config?.rename,
                                rootPath: this.#opts?.rootPath,
                            }),
                            data,
                            config
                        )
                        .catch((err) => {
                            throw err
                        })
                    resolve(
                        formatResponse({
                            data: result,
                            cdnUrl: this.#opts?.cdnUrl,
                            cname: this.#opts.cname,
                        })
                    )
                })()
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 分片上传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
    multipartUpload(filename, data, config = {}) {
        return new Promise((resolve, reject) => {
            try {
                ;(async () => {
                    config = deepMerge(this.#opts?.config || {}, config)
                    const result = await this.#instance
                        .multipartUpload(
                            generateFilename({
                                filename,
                                rename: config?.rename,
                                rootPath: this.#opts?.rootPath,
                            }),
                            data,
                            config
                        )
                        .catch((err) => {
                            throw err
                        })
                    resolve(
                        formatResponse({
                            data: result,
                            cdnUrl: this.#opts?.cdnUrl,
                            cname: this.#opts.cname,
                        })
                    )
                })()
            } catch (error) {
                reject(error.message)
            }
        })
    }

    /**
     * 断点续传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
    resumeMultipartUpload(filename, data, config) {
        return this.multipartUpload(filename, data, config)
    }
}

export default AliOSS
