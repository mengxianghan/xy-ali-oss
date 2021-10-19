import {generateGUID} from './utils'

export default class Interface {
    constructor(options = {}) {
        this.options = {
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
                headers: {'Cache-Control': 'public'}
            },
            refreshSTSTokenInterval: 10 * 1000,
            rootPath: '',
            getConfig: function () {
            },
            getToken: function () {
            }
        }
    }

    /**
     * 格式化结果
     * @param {object} result
     * @private
     */
    _formatResult(result = {}) {
        const {
            name = '',
            url = '',
            res: {status = 500, size = 0}
        } = result
        return {
            code: String(status),
            data: {
                name,
                url,
                suffix: name ? `.${name.split('.').pop()}` : '',
                size
            }
        }
    }

    /**
     * 生成名称
     * @param name
     * @return {string}
     * @private
     */
    _generateName(name) {
        if (!name) return ''
        const suffix = name.split('.').pop()
        const path = name.split('/')
        path.pop()
        return `${this.options.rootPath}/${generateGUID()}.${suffix}`.replace(new RegExp('^\\/'), '')
    }
}
