import OSS from 'ali-oss';

/**
 * 生成 GUID
 * @return {string}
 */
function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
/**
 * 合并
 * @param src
 * @param target
 * @return {*}
 */

function deepMerge(src = {}, target = {}) {
  let key;

  for (key in target) {
    src[key] = Object.prototype.toString.call(src[key]) === '[object Object]' ? deepMerge(src[key], target[key]) : src[key] = target[key];
  }

  return src;
}

class Alioss {
  constructor(options) {
    this.options = {
      async: false,
      // 是否异步获取配置信息，默认 false。如果为 true 时，getConfig 需要返回 Promise 对象
      accessKeyId: '',
      // 通过阿里云控制台创建的access key
      accessKeySecret: '',
      // 通过阿里云控制台创建的access secret
      stsToken: '',
      // 使用临时授权方式，详情请参见使用STS访问 (https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-32077-zh)
      bucket: '',
      // 通过控制台创建的bucket
      endpoint: '',
      // OSS域名
      region: 'oss-cn-hangzhou',
      // bucket 所在的区域，默认 oss-cn-hangzhou
      internal: false,
      // 是否使用阿里云内网访问，默认false。比如通过ECS访问OSS，则设置为true，采用internal的endpoint可节约费用
      cname: false,
      // 是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定
      isRequestPay: false,
      // bucket是否开启请求者付费模式，默认false。具体可查看请求者付费模式 (https://help.aliyun.com/document_detail/91337.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-yls-jm2-2fb)
      secure: true,
      //  则使用 HTTPS， (secure: false) 则使用 HTTP，详情请查看常见问题 (https://help.aliyun.com/document_detail/63401.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-63401-zh)
      timeout: '60s',
      // 超时时间，默认 60s
      config: {
        headers: {
          'Cache-Control': 'public'
        }
      },
      refreshSTSTokenInterval: 300 * 1000,
      rootPath: '',
      getConfig: function () {},
      getToken: function () {},
      ...options
    };
    this.client = null;

    this._init();
  }
  /**
   * 初始化
   * @return {Promise<void>}
   */


  async _init() {
    try {
      const {
        async
      } = this.options;

      if (async) {
        const asyncOptions = await this.options.getConfig();
        this.options = { ...this.options,
          ...(asyncOptions || {})
        };
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
      } = this.options;
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
      });
    } catch (err) {
      console.error(err.message);
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
      const result = await this.client.put(this._generateName(name), file, deepMerge(config, this.options.config)).catch(err => {
        reject(err);
      });
      resolve(this._formatResult(result));
    });
  }
  /**
   * 暂停
   */


  pause() {
    this.client.cancel();
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
      const result = await this.client.multipartUpload(this._generateName(name), file, deepMerge(config, this.options.config)).catch(err => {
        reject(err);
      });
      resolve(this._formatResult(result));
    });
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
      const result = await this.client.multipartUpload(name, file, deepMerge(config, this.options.config)).catch(err => {
        reject(err);
      });
      resolve(this._formatResult(result));
    });
  }
  /**
   * 取消分片上传
   * @param {string} name
   * @param {*} uploadId
   * @returns
   */


  abortMultipartUpload(name, uploadId) {
    return new Promise(async (resolve, reject) => {
      const result = await this.client.abortMultipartUpload(name, uploadId).catch(err => {
        reject(err);
      });
      resolve(result);
    });
  }
  /**
   * oss 实例
   * @return {*}
   */


  get client() {
    return this.client;
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
      res: {
        status = 500,
        size = 0
      }
    } = result;
    return {
      code: String(status),
      data: {
        name,
        url,
        suffix: name ? `.${name.split('.').pop()}` : '',
        size
      }
    };
  }
  /**
   * 生成名称
   * @param name
   * @return {string}
   * @private
   */


  _generateName(name) {
    if (!name) return '';
    const suffix = name.split('.').pop();
    const path = name.split('/');
    path.pop();
    return `${this.options.rootPath}/${generateGUID()}.${suffix}`.replace(new RegExp('^\\/'), '');
  }

}

export default Alioss;
