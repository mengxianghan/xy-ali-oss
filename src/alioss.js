import { generateFilename } from './utils/generate'
import { deepMerge, guid } from './utils'
import { formatResponse } from './utils/format'
import Event from './utils/event'
import OSS from 'ali-oss'

export default class AliOSS {
    #opts
    #instance = null
    #event
    #retryQueue

    constructor(options) {
        this.#event = new Event()
        this.#retryQueue = new Map()
        this.#opts = deepMerge(
            {
                async: false,
                rootPath: '',
                enableCdn: false,
                rename: true,
                cdnUrl: '',
                retryCount: 5,
                refreshSTSTokenInterval: 300000,
                config: {
                    headers: {
                        'Cache-Control': 'public',
                    },
                },
                refreshSTSToken: () => {},
                getOptions: () => {},
            },
            options
        )
    }

    /**
     * 获取储存
     * @returns {Promise}
     */
    getStore() {
        return new Promise((resolve) => {
            ;(async () => {
                if (this.#instance) {
                    resolve(this.#instance)
                    return
                }

                if (this.#event.length - 1) return

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

                resolve(this.#instance)
            })()
        })
    }

    /**
     * 上传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
    put(filename, data, config = {}) {
        return new Promise((resolve, reject) => {
            this.#event.on(guid(), async () => {
                try {
                    config = deepMerge(this.#opts?.config || {}, config)
                    const rename = config.hasOwnProperty('rename') ? config?.rename : this.#opts.rename
                    const result = await this.#instance
                        .put(
                            generateFilename({
                                filename,
                                rename,
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
                            enableCdn: this.#opts?.enableCdn,
                            cdnUrl: this.#opts?.cdnUrl,
                        })
                    )
                } catch (error) {
                    reject(error)
                }
            })
            this.#init()
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
            this.#event.on(guid(), async () => {
                try {
                    config = deepMerge(this.#opts?.config || {}, config)
                    const rename = config.hasOwnProperty('rename') ? config?.rename : this.#opts.rename
                    filename = config.checkpoint
                        ? filename
                        : generateFilename({
                              filename,
                              rename,
                              rootPath: this.#opts?.rootPath,
                          })
                    this.#retryQueue.delete(filename)
                    const result = await this.#instance.multipartUpload(filename, data, config).catch((err) => {
                        if (this.#instance && this.#instance.isCancel()) {
                            throw err
                        } else {
                            if (!this.#retryQueue.has(filename)) {
                                this.#retryQueue.set(filename, 0)
                            }
                            const count = this.#retryQueue.get(filename)
                            if (count <= this.#opts.retryCount) {
                                this.#retryQueue.set(filename, this.#retryQueue.get(filename) + 1)
                                this.multipartUpload(filename, data, config)
                            }
                            throw err
                        }
                    })
                    resolve(
                        formatResponse({
                            data: result,
                            enableCdn: this.#opts.enableCdn,
                            cdnUrl: this.#opts?.cdnUrl,
                        })
                    )
                } catch (error) {
                    reject(error)
                }
            })
            this.#init()
        })
    }

    /**
     * @returns {Promise<void>}
     */
    #init() {
        return new Promise((resolve) => {
            ;(async () => {
                if (this.#instance) {
                    this.#event.emit()
                    resolve(this.#instance)
                    return
                }

                await this.getStore()

                this.#event.emit()
                resolve(this.#instance)
            })()
        })
    }
}
