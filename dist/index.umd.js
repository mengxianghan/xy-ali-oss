(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ali-oss')) :
  typeof define === 'function' && define.amd ? define(['ali-oss'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AliOSS = factory(global.OSS));
})(this, (function (OSS) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var OSS__default = /*#__PURE__*/_interopDefaultLegacy(OSS);

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * ?????? GUID
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
   * ????????????
   * @param src
   * @param target
   * @return {*}
   */

  function deepMerge() {
    var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key;

    for (key in target) {
      src[key] = Object.prototype.toString.call(src[key]) === '[object Object]' ? deepMerge(src[key], target[key]) : src[key] = target[key];
    }

    return src;
  }
  /**
   * ???????????????
   * @param {string} path ??????
   * @returns {string}
   */

  function formatPath(path) {
    return path.replace(new RegExp('\\/{2,}', 'g'), '/').replace(new RegExp('^/', 'g'), '');
  }
  /**
   * ????????????
   * @param {string} name ??????
   */

  function getSuffix(name) {
    return name.substring(name.lastIndexOf('.'), name.length);
  }

  var AliOSS = /*#__PURE__*/function () {
    function AliOSS(options) {
      _classCallCheck(this, AliOSS);

      this.opts = _objectSpread2({
        // ??????????????????????????????????????? false???????????? true ??????getConfig ???????????? Promise ??????
        async: false,
        // ?????????????????????????????????access key
        accessKeyId: '',
        // ?????????????????????????????????access secret
        accessKeySecret: '',
        // ????????????????????????????????????????????????STS?????? (https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-32077-zh)
        stsToken: '',
        // ????????????????????????bucket
        bucket: '',
        // OSS??????
        endpoint: '',
        // bucket ???????????????????????? oss-cn-hangzhou
        region: 'oss-cn-hangzhou',
        // ??????????????????????????????????????????false???????????????ECS??????OSS???????????????true?????????internal???endpoint???????????????
        internal: false,
        // ??????????????????????????????????????????false?????????cname???true???endpoint??????????????????????????????????????????????????????bucket????????????
        cname: false,
        // bucket??????????????????????????????????????????false??????????????????????????????????????? (https://help.aliyun.com/document_detail/91337.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-yls-jm2-2fb)
        isRequestPay: false,
        // ????????? HTTPS??? (secure: false) ????????? HTTP?????????????????????????????? (https://help.aliyun.com/document_detail/63401.htm?spm=a2c4g.11186623.0.0.63ab1cd5c2XL21#concept-63401-zh)
        secure: true,
        // ????????????????????? 60s
        timeout: '60s',
        config: {
          headers: {
            'Cache-Control': 'public'
          },
          rename: true,
          // ???????????? cdn
          enableCdn: false
        },
        refreshSTSTokenInterval: 300 * 1000,
        rootPath: '',
        // ?????? cdn
        enableCdn: false,
        // cdn ?????????enableCdn ?????? true ??????cdnUrl ??????
        cdnUrl: '',
        // ??????????????????
        getConfig: function getConfig() {},
        // ?????? stsToken
        getToken: function getToken() {}
      }, options);
      this.client = null;
    }
    /**
     * ?????????
     * @param {function} callback
     * @return {Promise<void>}
     */


    _createClass(AliOSS, [{
      key: "_init",
      value: function () {
        var _init2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callback) {
          var async, asyncOptions, _this$opts, accessKeyId, accessKeySecret, stsToken, bucket, endpoint, region, internal, cname, isRequestPay, secure, timeout, getToken;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (this.client) {
                    _context.next = 10;
                    break;
                  }

                  async = this.opts.async;

                  if (!async) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 6;
                  return this.opts.getConfig();

                case 6:
                  asyncOptions = _context.sent;
                  this.opts = _objectSpread2(_objectSpread2({}, this.opts), asyncOptions || {});

                case 8:
                  _this$opts = this.opts, accessKeyId = _this$opts.accessKeyId, accessKeySecret = _this$opts.accessKeySecret, stsToken = _this$opts.stsToken, bucket = _this$opts.bucket, endpoint = _this$opts.endpoint, region = _this$opts.region, internal = _this$opts.internal, cname = _this$opts.cname, isRequestPay = _this$opts.isRequestPay, secure = _this$opts.secure, timeout = _this$opts.timeout, getToken = _this$opts.getToken;
                  this.client = new OSS__default["default"]({
                    accessKeyId: accessKeyId,
                    accessKeySecret: accessKeySecret,
                    stsToken: stsToken,
                    bucket: bucket,
                    endpoint: endpoint,
                    region: region,
                    internal: internal,
                    cname: cname,
                    isRequestPay: isRequestPay,
                    secure: secure,
                    timeout: timeout,
                    refreshSTSToken: getToken
                  });

                case 10:
                  if (['[object Function]', '[object AsyncFunction]'].includes(Object.prototype.toString.call(callback))) {
                    callback.call(this, this.client);
                  }

                  _context.next = 16;
                  break;

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](0);
                  console.error(_context.t0.message);

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 13]]);
        }));

        function _init(_x) {
          return _init2.apply(this, arguments);
        }

        return _init;
      }()
      /**
       * ??????
       * @param {string} name
       * @param {file} file
       * @param {object} config
       * @return {Promise<unknown>}
       */

    }, {
      key: "upload",
      value: function upload(name, file) {
        var _this = this;

        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        config = deepMerge(this.opts.config, config);
        return new Promise(function (resolve, reject) {
          _this._init(function (client) {
            var _config,
                _this2 = this;

            client.put(this._generateName({
              name: name,
              rename: (_config = config) === null || _config === void 0 ? void 0 : _config.rename
            }), file, config).then(function (result) {
              var _this2$opts, _config2;

              resolve(_this2._formatResult({
                result: result,
                enableCdn: ((_this2$opts = _this2.opts) === null || _this2$opts === void 0 ? void 0 : _this2$opts.enableCdn) || ((_config2 = config) === null || _config2 === void 0 ? void 0 : _config2.enableCdn)
              }));
            })["catch"](function (err) {
              reject(err);
            });
          });
        });
      }
      /**
       * ??????
       */

    }, {
      key: "cancel",
      value: function () {
        var _cancel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return this._init(function (client) {
                    client.cancel();
                  });

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function cancel() {
          return _cancel.apply(this, arguments);
        }

        return cancel;
      }()
      /**
       * ????????????
       * @param {string} name
       * @param {file} file
       * @param {object} config
       * @return {Promise<unknown>}
       */

    }, {
      key: "multipartUpload",
      value: function multipartUpload(name, file) {
        var _this3 = this;

        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        config = deepMerge(this.opts.config, config);
        return new Promise( /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return _this3._init(function (client) {
                      var _config3,
                          _this4 = this;

                      client.multipartUpload(this._generateName({
                        name: name,
                        rename: (_config3 = config) === null || _config3 === void 0 ? void 0 : _config3.rename
                      }), file, config).then(function (result) {
                        var _this4$opts, _config4;

                        resolve(_this4._formatResult({
                          result: result,
                          enableCdn: ((_this4$opts = _this4.opts) === null || _this4$opts === void 0 ? void 0 : _this4$opts.enableCdn) || ((_config4 = config) === null || _config4 === void 0 ? void 0 : _config4.enableCdn)
                        }));
                      })["catch"](function (err) {
                        reject(err);
                      });
                    });

                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x2, _x3) {
            return _ref.apply(this, arguments);
          };
        }());
      }
      /**
       * ????????????
       * @param {string} name
       * @param {file} file
       * @param {object} config
       * @return {Promise<unknown>}
       */

    }, {
      key: "resumeMultipartUpload",
      value: function resumeMultipartUpload(name, file) {
        var _this5 = this;

        var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return new Promise( /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(resolve, reject) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return _this5._init(function (client) {
                      var _this6 = this;

                      client.multipartUpload(name, file, deepMerge(config, this.opts.config)).then(function (result) {
                        var _this6$opts;

                        resolve(_this6._formatResult({
                          result: result,
                          enableCdn: ((_this6$opts = _this6.opts) === null || _this6$opts === void 0 ? void 0 : _this6$opts.enableCdn) || (config === null || config === void 0 ? void 0 : config.enableCdn)
                        }));
                      })["catch"](function (err) {
                        reject(err);
                      });
                    });

                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          return function (_x4, _x5) {
            return _ref2.apply(this, arguments);
          };
        }());
      }
      /**
       * ??????????????????
       * @param {string} name
       * @param {*} uploadId
       * @returns
       */

    }, {
      key: "abortMultipartUpload",
      value: function abortMultipartUpload(name, uploadId) {
        var _this7 = this;

        return new Promise( /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve, reject) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return _this7._init(function (client) {
                      client.abortMultipartUpload(name, uploadId).then(function (result) {
                        resolve(result);
                      })["catch"](function (err) {
                        reject(err);
                      });
                    });

                  case 2:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          return function (_x6, _x7) {
            return _ref3.apply(this, arguments);
          };
        }());
      }
      /**
       * ???????????????
       * @param {object} result
       * @param {boolean} enableCdn
       * @private
       */

    }, {
      key: "_formatResult",
      value: function _formatResult(_ref4) {
        var result = _ref4.result,
            enableCdn = _ref4.enableCdn;
        var _result$name = result.name,
            name = _result$name === void 0 ? '' : _result$name,
            _result$res = result.res,
            _result$res$status = _result$res.status,
            status = _result$res$status === void 0 ? 500 : _result$res$status,
            _result$res$size = _result$res.size,
            size = _result$res$size === void 0 ? 0 : _result$res$size,
            _result$res$requestUr = _result$res.requestUrls,
            requestUrls = _result$res$requestUr === void 0 ? [] : _result$res$requestUr;
        return {
          code: String(status),
          data: {
            name: name,
            url: this._formatUrl({
              url: requestUrls && requestUrls.length ? requestUrls[0].split('?')[0] : '',
              enableCdn: enableCdn
            }),
            suffix: getSuffix(name),
            size: size
          }
        };
      }
      /**
       * ????????? url
       * @param {string} url
       * @param {boolean} enableCdn ??????cdn
       * @param {string} cndUrl
       * @returns
       */

    }, {
      key: "_formatUrl",
      value: function _formatUrl(_ref5) {
        var url = _ref5.url,
            enableCdn = _ref5.enableCdn;
        var cdnUrl = this.opts.cdnUrl;
        return enableCdn ? url.replace(new RegExp('http(s)?://([^/]+)/', 'g'), cdnUrl.endsWith('/') ? cdnUrl : "".concat(cdnUrl, "/")) : url;
      }
      /**
       * ????????????
       * @param {string} name ???????????????
       * @param {boolean} rename ?????????
       * @return {string}
       * @private
       */

    }, {
      key: "_generateName",
      value: function _generateName(_ref6) {
        var name = _ref6.name,
            _ref6$rename = _ref6.rename,
            rename = _ref6$rename === void 0 ? true : _ref6$rename;
        if (!name) return '';
        var path = name.substring(0, name.lastIndexOf('/'));
        var newName = rename ? "".concat(path, "/").concat(generateGUID()).concat(getSuffix(name)) : name;
        return formatPath("".concat(this.opts.rootPath, "/").concat(newName));
      }
      /**
       * ??????????????????
       * @param {string} name ?????????
       * @return {string}
       */

    }, {
      key: "_getSuffix",
      value: function _getSuffix(name) {
        return name.substring(name.lastIndexOf('.'), name.length);
      }
    }]);

    return AliOSS;
  }();

  return AliOSS;

}));
