import { generateFilename } from './utils/generate'
import { deepMerge, guid } from './utils'
import { formatResponse } from './utils/format'
import { cloneDeep } from 'lodash-es'
import Event from './utils/event'
import OSS from 'ali-oss'

export default class AliOSS {
    #opts
    #client = null
    #event
    #retryQueue

    constructor(options) {
        this.#event = new Event()
        this.#retryQueue = new Map()
        this.#opts = cloneDeep(
            deepMerge(
                {
                    async: false,
                    rootPath: '',
                    rename: true,
                    enableCdn: false,
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
        )
    }

    /**
     * 获取储存
     * @returns {Promise}
     */
    getStore() {
        return new Promise((resolve) => {
            ;(async () => {
                if (this.#client) {
                    resolve(this.#client)
                    return
                }

                // if (this.#event.length - 1) return

                if (this.#opts.async) {
                    const options = await this.#opts
                        .getOptions()
                        .catch(() => {})
                    this.#opts = {
                        ...this.#opts,
                        ...(options || {}),
                    }
                }

                const { async, getOptions, ...options } = this.#opts

                this.#client = new OSS({
                    ...options,
                })

                resolve(this.#client)
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
                    config = cloneDeep(
                        deepMerge(this.#opts?.config || {}, config)
                    )
                    const rename = config.hasOwnProperty('rename')
                        ? config?.rename
                        : this.#opts.rename
                    const result = await this.#client
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
     * @param {File|Blob|Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
    multipartUpload(filename, data, config = {}) {
        return new Promise((resolve, reject) => {
            this.#event.on(guid(), async () => {
                try {
                    config = cloneDeep(
                        deepMerge(this.#opts?.config || {}, config)
                    )
                    const rename = config.hasOwnProperty('rename')
                        ? config?.rename
                        : this.#opts.rename
                    filename = config.checkpoint
                        ? filename
                        : generateFilename({
                              filename,
                              rename,
                              rootPath: this.#opts?.rootPath,
                          })
                    let checkpoint = null
                    const result = await this.#client
                        .multipartUpload(filename, data, {
                            ...config,
                            progress: (p, cpt, res) => {
                                if (config?.progress) {
                                    config.progress(p, cpt, res)
                                }
                                checkpoint = cpt
                            },
                        })
                        .catch(async (error) => {
                            // 未设置重试
                            if (this.#opts.retryCount === 0) {
                                throw error
                            }
                            // 如果是手动取消，则不执行重试
                            if (this.#client && this.#client.isCancel()) {
                                throw error
                            }
                            // 开始重试
                            this.#retryQueue.set(filename, {
                                count: 1,
                                checkpoint,
                            })
                            const result = await this.#retryMultipartUpload(
                                filename,
                                data,
                                config
                            )
                            resolve(result)
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
     * 重试分片上传
     * @param {string} filename
     * @param {File|Blob|Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
    #retryMultipartUpload(filename, data, config = {}) {
        return new Promise((resolve, reject) => {
            this.#event.on(guid(), async () => {
                try {
                    const queue = this.#retryQueue.get(filename)
                    let checkpoint = queue?.checkpoint || null
                    const result = await this.#client
                        .multipartUpload(filename, data, {
                            ...config,
                            checkpoint,
                            progress: (p, cpt, res) => {
                                if (config?.progress) {
                                    config.progress(p, cpt, res)
                                }
                                checkpoint = cpt
                            },
                        })
                        .catch(async (error) => {
                            if (this.#client && this.#client.isCancel()) {
                                throw error
                            } else {
                                // 判断是否超过设置的重试次数
                                const count = queue?.count || 1
                                if (count < this.#opts.retryCount) {
                                    // 未超过重试次数，继续重试
                                    this.#retryQueue.set(filename, {
                                        ...queue,
                                        count: count + 1,
                                        checkpoint,
                                    })
                                    const result =
                                        await this.#retryMultipartUpload(
                                            filename,
                                            data,
                                            config
                                        )
                                    resolve(result)
                                } else {
                                    // 已超过重试次数，停止重试，并从重试队列删除
                                    this.#retryQueue.delete(filename)
                                    throw error
                                }
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
                if (this.#client) {
                    this.#event.emit()
                    resolve(this.#client)
                    return
                }

                await this.getStore()

                this.#event.emit()
                resolve(this.#client)
            })()
        })
    }
}
