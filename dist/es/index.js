function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
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
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
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
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return fn;
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}

/**
 * 获取后缀
 * @param {string} filename 文件名
 * @returns {string}
 */
function getSuffix(filename) {
  return filename.substring(filename.lastIndexOf('.'));
}

/**
 * 格式化路径
 * @param {string} path 路径
 * @returns {string}
 */
function formatPath(path) {
  return path.replace(new RegExp('\\/{2,}', 'g'), '/').replace(new RegExp('^/', 'g'), '');
}

/**
 * 格式化响应值
 * @param {object} data
 * @param {string} cdnUrl
 * @param {boolean} cname 是否支持自定义域名，优先级比 cdnUrl 高
 * @returns {object}
 */
function formatResponse(_ref) {
  var _requestUrls$;
  var data = _ref.data,
    cdnUrl = _ref.cdnUrl,
    cname = _ref.cname;
  var name = data.name,
    res = data.res;
  var requestUrls = res.requestUrls;
  var requestUrl = (requestUrls === null || requestUrls === void 0 ? void 0 : (_requestUrls$ = requestUrls[0]) === null || _requestUrls$ === void 0 ? void 0 : _requestUrls$.replace(/\?.*/gi, '')) || '';
  var url = cname ? requestUrl : generateUrl({
    url: requestUrl,
    cdnUrl: cdnUrl
  });
  var suffix = getSuffix(url);
  return {
    url: url,
    name: name,
    suffix: suffix,
    res: res
  };
}

/**
 * @param {*} val
 * @param {string} type
 * @returns {boolean}
 */
function is(val, type) {
  return Object.prototype.toString.call(val).slice(8, -1) === type;
}

/**
 * 是否对象
 * @param {*} val
 * @returns {boolean}
 */
function isObject(val) {
  return is(val, 'Object');
}

/**
 * guid
 * @return {string}
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/**
 * 深度合并
 * @param {object} src
 * @param {object} target
 * @return {object}
 */
function deepMerge() {
  var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var key;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : src[key] = target[key];
  }
  return src;
}

/**
 * 生成 url
 * @param {string} url
 * @param {string} cdnUrl
 * @returns {string}
 */
function generateUrl(_ref) {
  var url = _ref.url,
    cdnUrl = _ref.cdnUrl;
  if (!cdnUrl) return url;
  var _URL = new URL(url),
    pathname = _URL.pathname;
  var _URL2 = new URL(cdnUrl),
    protocol = _URL2.protocol,
    host = _URL2.host;
  return "".concat(protocol, "//").concat(formatPath(host + pathname));
}

/**
 * 生成文件名
 * @param {string} filename 文件名
 * @param {boolean} rename 重命名
 * @param {string} rootPath 根目录
 * @returns {string}
 */
function generateFilename(_ref2) {
  var filename = _ref2.filename,
    rename = _ref2.rename,
    rootPath = _ref2.rootPath;
  if (!filename) return '';
  var path = filename.substring(0, filename.lastIndexOf('/'));
  var newFilename = rename ? "".concat(path, "/").concat(guid()).concat(getSuffix(filename)) : filename;
  return formatPath("".concat(rootPath, "/").concat(newFilename));
}

var _excluded = ["async", "getOptions"];
var _opts = /*#__PURE__*/new WeakMap();
var _instance = /*#__PURE__*/new WeakMap();
var _init = /*#__PURE__*/new WeakSet();
var AliOSS = /*#__PURE__*/function () {
  function AliOSS(_options) {
    _classCallCheck(this, AliOSS);
    /**
     * 初始化
     * @returns {Promise<void>}
     */
    _classPrivateMethodInitSpec(this, _init);
    _classPrivateFieldInitSpec(this, _opts, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _instance, {
      writable: true,
      value: null
    });
    _classPrivateFieldSet(this, _opts, _objectSpread2({
      async: false,
      rootPath: '',
      cdnUrl: '',
      refreshSTSTokenInterval: 300000,
      config: {
        headers: {
          'Cache-Control': 'public'
        },
        rename: true
      },
      refreshSTSToken: function refreshSTSToken() {},
      getOptions: function getOptions() {}
    }, _options));
    _classPrivateMethodGet(this, _init, _init2).call(this);
  }
  _createClass(AliOSS, [{
    key: "store",
    get: function get() {
      return _classPrivateFieldGet(this, _instance);
    }
  }, {
    key: "upload",
    value:
    /**
     * 上传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise<unknown>}
     */
    function upload(filename, data) {
      var _this = this;
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (resolve, reject) {
        try {
          ;
          _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var _classPrivateFieldGet2, _config, _classPrivateFieldGet3, _classPrivateFieldGet4;
            var result;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  config = deepMerge(((_classPrivateFieldGet2 = _classPrivateFieldGet(_this, _opts)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.config) || {}, config);
                  _context.next = 3;
                  return _classPrivateFieldGet(_this, _instance).put(generateFilename({
                    filename: filename,
                    rename: (_config = config) === null || _config === void 0 ? void 0 : _config.rename,
                    rootPath: (_classPrivateFieldGet3 = _classPrivateFieldGet(_this, _opts)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.rootPath
                  }), data, config)["catch"](function (err) {
                    throw err;
                  });
                case 3:
                  result = _context.sent;
                  resolve(formatResponse({
                    data: result,
                    cdnUrl: (_classPrivateFieldGet4 = _classPrivateFieldGet(_this, _opts)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.cdnUrl,
                    cname: _classPrivateFieldGet(_this, _opts).cname
                  }));
                case 5:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }))();
        } catch (error) {
          reject(error);
        }
      });
    }

    /**
     * 分片上传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
  }, {
    key: "multipartUpload",
    value: function multipartUpload(filename, data) {
      var _this2 = this;
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return new Promise(function (resolve, reject) {
        try {
          ;
          _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
            var _classPrivateFieldGet5, _config2, _classPrivateFieldGet6, _classPrivateFieldGet7;
            var result;
            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  config = deepMerge(((_classPrivateFieldGet5 = _classPrivateFieldGet(_this2, _opts)) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.config) || {}, config);
                  _context2.next = 3;
                  return _classPrivateFieldGet(_this2, _instance).multipartUpload(generateFilename({
                    filename: filename,
                    rename: (_config2 = config) === null || _config2 === void 0 ? void 0 : _config2.rename,
                    rootPath: (_classPrivateFieldGet6 = _classPrivateFieldGet(_this2, _opts)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.rootPath
                  }), data, config)["catch"](function (err) {
                    throw err;
                  });
                case 3:
                  result = _context2.sent;
                  resolve(formatResponse({
                    data: result,
                    cdnUrl: (_classPrivateFieldGet7 = _classPrivateFieldGet(_this2, _opts)) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.cdnUrl,
                    cname: _classPrivateFieldGet(_this2, _opts).cname
                  }));
                case 5:
                case "end":
                  return _context2.stop();
              }
            }, _callee2);
          }))();
        } catch (error) {
          reject(error.message);
        }
      });
    }

    /**
     * 断点续传
     * @param {string} filename
     * @param {File | Blob | Buffer} data
     * @param {object} config
     * @returns {Promise}
     */
  }, {
    key: "resumeMultipartUpload",
    value: function resumeMultipartUpload(filename, data, config) {
      return this.multipartUpload(filename, data, config);
    }
  }]);
  return AliOSS;
}();
function _init2() {
  return _init3.apply(this, arguments);
}
function _init3() {
  _init3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var _options2, _classPrivateFieldGet8, options;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!_classPrivateFieldGet(this, _instance)) {
            _context3.next = 2;
            break;
          }
          return _context3.abrupt("return");
        case 2:
          if (!_classPrivateFieldGet(this, _opts).async) {
            _context3.next = 7;
            break;
          }
          _context3.next = 5;
          return _classPrivateFieldGet(this, _opts).getOptions()["catch"](function () {});
        case 5:
          _options2 = _context3.sent;
          _classPrivateFieldSet(this, _opts, _objectSpread2(_objectSpread2({}, _classPrivateFieldGet(this, _opts)), _options2 || {}));
        case 7:
          _classPrivateFieldGet8 = _classPrivateFieldGet(this, _opts), options = _objectWithoutProperties(_classPrivateFieldGet8, _excluded);
          _classPrivateFieldSet(this, _instance, new OSS(_objectSpread2({}, options)));
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3, this);
  }));
  return _init3.apply(this, arguments);
}

export { AliOSS as default };