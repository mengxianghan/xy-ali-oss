## 安装

### NPM

```shell
npm install --save xy-alioss
```

## 使用

```javascript
import Alioss from 'xy-alioss'

const options = {}
const store = new Alioss(options)
```

## Options

| 名称 | 必填 | 说明 |
|:----|:----|:----|
| async | 否 | 是否异步获取配置信息，默认 false。如果为 true 时，getConfig 需要返回 Promise 对象 |
| accessKeyId | 否 | 通过阿里云控制台创建的access key |
| accessKeySecret | 否 | 通过阿里云控制台创建的access secret |
| stsToken | 否 | 使用临时授权方式，详情请参见[使用STS访问](https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-32077-zh) |
| bucket | 否 | 通过控制台创建的bucket |
| endpoint | 否 | OSS域名 |
| region | 否 | bucket 所在的区域，默认 oss-cn-hangzhou |
| internal | 否 | 是否使用阿里云内网访问，默认false。比如通过ECS访问OSS，则设置为true，采用internal的endpoint可节约费用 |
| cname | 否 | 是否支持上传自定义域名，默认false。如果cname为true，endpoint传入自定义域名时，自定义域名需要先同bucket进行绑定 |
| isRequestPay | 否 | bucket是否开启请求者付费模式，默认false。具体可查看[请求者付费模式](https://help.aliyun.com/document_detail/91337.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-yls-jm2-2fb) |
| secure | 否 | 则使用 HTTPS， (secure: false) 则使用 HTTP，详情请查看[常见问题](https://help.aliyun.com/document_detail/63401.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-63401-zh) |
| timeout | 否 | 超时时间，默认 60s |
| config | 否 | 上传公共配置信息，默认 headers: {'Cache-Control': 'public'} |
| refreshSTSTokenInterval | 否 | STSToken 刷新间隔，默认 300000ms|
| rootPath | 否 | 根目录，默认为空 |
| getConfig | 否 | 动态获取配置信息，async为true时必填，返回一个 Promise 对象 |
| getToken | 否 | 获取token，动态刷新token使用，返回一个 Promise 对象 |

## Methods

### .upload('name', 'file' [, 'config'])

文件上传，一般用于小于 200M 的文件

### .cancel()

取消上传

### .multipartUpload(name, file [, config])

分片上传

### .resumeMultipartUpload(name, file [, config = {}])

断点续传，仅对分片上传有效

### .abortMultipartUpload(name, uploadId)

取消分片上传

## 依赖

[ali-oss](https://www.npmjs.com/package/ali-oss)
