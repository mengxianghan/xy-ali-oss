## 安装

### NPM

```shell
npm install --save xy-ali-oss
```

## 使用

```javascript
import Alioss from 'xy-ali-oss'

const options = {}
const store = new AliOSS(options)
```

## Options

| 名称                      | 必填 | 说明                                                                                                                                                        |
|:------------------------|:---|:----------------------------------------------------------------------------------------------------------------------------------------------------------|
| async                   | 否  | 是否异步获取配置信息，默认 false。如果为 true 时，getConfig 需要返回 Promise 对象                                                                                                  |
| config.rename           | 否  | 是否重命名上传文件，默认 true；仅适用于 Methods.upload、 Methods.multipartUpload，以上两个方法使用时也可单独在 config 中设置 rename 属性，设置后覆盖公共 rename 属性                                      |
| config.headers          | 否  | 上传公共配置信息，默认 {'Cache-Control': 'public'}                                                                                                                   |
| refreshSTSTokenInterval | 否  | STSToken 刷新间隔，默认 300000ms                                                                                                                                 |
| rootPath                | 否  | 根目录，默认为空                                                                                                                                                  |
| enableCdn               | 否  | 启用 cdn，默认：false，如果 enableCdn 为 true，cdnUrl 必须传入                                                                                                           |
| cdnUrl                  | 否  | cdn 域名，默认：空                                                                                                                                               |
| getOptions              | 否  | 动态获取配置信息，async为true时必填，返回一个 Promise 对象                                                                                                                    |
| getToken                | 否  | 获取token，动态刷新token使用，返回一个 Promise 对象                                                                                                                       |

## Methods

### .upload('name', 'file' [, 'config'])

文件上传，一般用于小于 200M 的文件

### .multipartUpload(name, file [, config])

分片上传

### .resumeMultipartUpload(name, file [, config = {}])

断点续传，仅对分片上传有效


## 依赖

[ali-oss](https://www.npmjs.com/package/ali-oss)

## 参考

[对象储存 OSS](https://help.aliyun.com/product/31815.html)
