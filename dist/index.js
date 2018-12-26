// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"Schema.ts":[function(require,module,exports) {
"use strict";
/**
 * @file Json Schemaを扱うためのモジュール
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Schema =
/** @class */
function () {
  function Schema() {}
  /**
   * Swagger定義ファイルからスキーマを取得
   */


  Schema.getSwaggerSchema = function (config, path, method, type) {
    // * ヌルポに気をつけながら値を参照
    if (!config) return;
    var pathConfig = config.paths[path];
    if (!pathConfig) return;
    var methodConfig = pathConfig[method];
    if (!methodConfig) return;
    var parameters = methodConfig.parameters,
        _a = methodConfig.requestBody,
        requestBody = _a === void 0 ? {} : _a,
        _b = methodConfig.responses,
        responses = _b === void 0 ? {} : _b; // * レスポンスのスキーマを取得

    if (type === 'response') {
      var res = responses['200'] || {};
      var content_1 = res.content || {};
      var data = content_1['application/json'] || {};
      return data.schema;
    } // * Getリクエストのクエリを取得


    if (method === 'get') {
      return parameters;
    } // * Get以外のBodyを取得


    var content = requestBody.content || {};
    var body = content['application/json'] || {};
    return body.schema;
  };

  return Schema;
}();

exports.default = Schema;
},{}],"Logger.ts":[function(require,module,exports) {
"use strict";
/**
 * @file ロガー
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Logger =
/** @class */
function () {
  function Logger(_log) {
    if (_log === void 0) {
      _log = {};
    }

    this._log = _log;
  }
  /**
   * ログを残す
   */


  Logger.prototype.log = function (obj, path, method, type, code) {
    if (!this._log[path]) this._log[path] = {};
    if (!this._log[path][method]) this._log[path][method] = {};
    if (!this._log[path][method][type]) this._log[path][method][type] = {};
    if (!this._log[path][method][type][code]) this._log[path][method][type][code] = [];

    this._log[path][method][type][code].push(obj);
  };

  return Logger;
}();

exports.default = Logger;
},{}],"Checker.ts":[function(require,module,exports) {
"use strict";
/**
 * @file スキーマ同士のチェックを行うモジュール
 */

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Schema_1 = __importDefault(require("./Schema"));

var Logger_1 = __importDefault(require("./Logger"));

var consola_1 = __importDefault(require("consola"));

var TJS = __importStar(require("typescript-json-schema"));

var Checker =
/** @class */
function () {
  function Checker(target, config, baseDir) {
    this.target = target;
    this.config = config;
    this.baseDir = baseDir;
    this.logger = new Logger_1.default();
  }

  Checker.prototype.check = function () {
    var _this = this;

    var tsSchema = this.getTSSchema();
    var definitions = tsSchema.definitions;
    Object.keys(definitions).forEach(function (key) {
      var definition = definitions[key];
      var properties = definition.properties,
          description = definition.description;

      var _a = _this.parseMetaComment(description),
          path = _a.path,
          method = _a.method,
          type = _a.type; // メタ情報のどれかが掛けていたら処理を終了


      if (!path || !method || !type) return;
      consola_1.default.info("Checking... " + method + ": " + path + " - " + type);
      var schema = Schema_1.default.getSwaggerSchema(_this.config, path, method, type);

      _this.validateSchema(properties, tsSchema, schema, _this.config);

      consola_1.default.success("Finish");
    });
  };
  /**
   * TypeScriptの型定義を取得する
   */


  Checker.prototype.getTSSchema = function (target) {
    if (target === void 0) {
      target = this.target;
    }

    var tsConfig = {
      baseUrl: this.baseDir,
      paths: {
        '@/*': ['src/*']
      }
    };
    var program = TJS.getProgramFromFiles([target], tsConfig);
    var schema = TJS.generateSchema(program, '*');
    if (!schema) return {};
    return schema;
  };
  /**
   * メタコメントをパースする
   */


  Checker.prototype.parseMetaComment = function (comment) {
    if (comment === void 0) {
      comment = '';
    }

    var _a = comment.replace(/ /g, '').split('\n').reduce(function (obj, item) {
      var _a = item.split(':'),
          key = _a[0],
          value = _a[1];

      if (key && value) {
        obj[key] = value;
      }

      return obj;
    }, {}),
        path = _a.path,
        method = _a.method,
        type = _a.type;

    return {
      path: path,
      method: method,
      type: type
    };
  };
  /**
   * $refのコンポーネントを取得する
   */


  Checker.prototype.getSchemaRef = function (obj, config) {
    var _a;

    var $ref = Object.keys(obj)[0];
    if ($ref !== '$ref') return obj;
    var key = obj[$ref];
    var def = key.replace(/^#\//, '').split('/').reduce(function (obj, name) {
      return obj[name] || {};
    }, config);

    if (def.name && def.schema) {
      return _a = {}, _a[def.name] = def.schema, _a;
    }

    return def;
  };
  /**
   * スキーマを正規化する
   */


  Checker.prototype.optimizeSchema = function (schema, config) {
    var _this = this;

    var _a;

    var _schema = Array.isArray(schema) ? schema : [schema];

    var parsedSchema = _schema.reduce(function (obj, self) {
      return __assign({}, obj, _this.getSchemaRef(self, config));
    }, {});

    var keys = Object.keys(parsedSchema); // レスポンスの場合

    if (keys.includes('properties')) {
      return parsedSchema['properties'];
    } // Queryパラメータの場合


    if (parsedSchema.in === 'query') {
      return _a = {}, _a[parsedSchema['name']] = parsedSchema['schema'], _a;
    }

    return parsedSchema;
  };
  /**
   * スキーマ同士を検証する
   */


  Checker.prototype.validateSchema = function (schema1, def1, schema2, def2) {
    var _this = this;

    if (schema1 === void 0) {
      schema1 = {};
    }

    if (def1 === void 0) {
      def1 = {};
    }

    if (schema2 === void 0) {
      schema2 = {};
    }

    if (def2 === void 0) {
      def2 = {};
    }

    var optimizedSchema1 = this.optimizeSchema(schema1, def1);
    var optimizedSchema2 = this.optimizeSchema(schema2, def2);
    var keys1 = Object.keys(optimizedSchema1);
    var keys2 = Object.keys(optimizedSchema2); // 不足しているプロパティのチェック

    keys2.forEach(function (key) {
      if (!keys1.includes(key)) {
        return consola_1.default.warn("Missing property \"" + key + "\"");
      }
    }); // 定義されていないプロパティのチェック

    keys1.forEach(function (key) {
      if (!keys2.includes(key)) {
        return consola_1.default.warn("Unknown property \"" + key + "\"");
      }
    });
    var keys = keys1.filter(function (key) {
      return keys2.includes(key);
    });
    keys.forEach(function (key) {
      var s1 = optimizedSchema1[key];
      var s2 = optimizedSchema2[key]; // * 型が一致するかをチェック

      if (s1.type !== s2.type) {
        return consola_1.default.warn("Different Types: \"" + key + "\" (" + s1.type + " vs " + s2.type + ")");
      } // * 配列の場合


      if (s1.type === 'array') {
        _this.validateSchema(s1.items, def1, s2.items, def2);
      }
    });
  };

  return Checker;
}();

exports.default = Checker;
},{"./Schema":"Schema.ts","./Logger":"Logger.ts"}],"App.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @file アプリケーションのベースモジュール
 */

var fs_1 = __importDefault(require("fs"));

var consola_1 = __importDefault(require("consola"));

var glob_1 = __importDefault(require("glob"));

var path_1 = __importDefault(require("path"));

var rmdir_1 = __importDefault(require("rmdir"));

var js_yaml_1 = __importDefault(require("js-yaml"));

var Checker_1 = __importDefault(require("./Checker"));

var App =
/** @class */
function () {
  function App(baseDir, pattern, configFile, tempDir) {
    this.baseDir = baseDir;
    this.pattern = pattern;
    this.configFile = configFile;
    this.tempDir = tempDir;
  }
  /**
   * チェックを実行する
   */


  App.prototype.exec = function () {
    return __awaiter(this, void 0, Promise, function () {
      var targetFiles;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.config = this.loadSwaggerConfig();
            if (!this.config) return [2
            /*return*/
            , consola_1.default.error(this.configFile + "\u306E\u5B9A\u7FA9\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002")];
            return [4
            /*yield*/
            , this.copyTargetFiles()];

          case 1:
            _a.sent();

            targetFiles = glob_1.default.sync(path_1.default.resolve(this.tempDir, '*.ts'));

            if (targetFiles.length === 0) {
              return [2
              /*return*/
              , consola_1.default.warn('チェック対象のファイルがありません。')];
            }

            targetFiles.forEach(function (target) {
              var checker = new Checker_1.default(target, _this.config, _this.baseDir);
              checker.check();
            }); // * 完了時に一時フォルダを削除

            rmdir_1.default(this.tempDir);
            return [2
            /*return*/
            ];
        }
      });
    });
  };
  /**
   * Swaggerの定義ファイルを取得する
   */


  App.prototype.loadSwaggerConfig = function (configFile) {
    if (configFile === void 0) {
      configFile = this.configFile;
    }

    try {
      return js_yaml_1.default.safeLoad(fs_1.default.readFileSync(configFile, 'utf8'));
    } catch (e) {
      return;
    }
  };
  /**
   * チェック対象のTypeScriptファイルを手元にコピー
   */


  App.prototype.copyTargetFiles = function () {
    return __awaiter(this, void 0, Promise, function () {
      var filePattern, files, promises;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            filePattern = path_1.default.resolve(path_1.default.resolve(this.baseDir, this.pattern));
            files = glob_1.default.sync(filePattern);
            promises = []; // * 仮ファイル格納のディレクトリが存在しない場合は作成

            if (!fs_1.default.existsSync(this.tempDir)) {
              fs_1.default.mkdirSync(this.tempDir);
            }

            files.forEach(function (file) {
              promises.push(new Promise(function (resolve) {
                // コピー後のファイル名の拡張子を.tsにする
                var copyedFileName = file.replace(/(.*)\/(.+)\.d\.ts$/, '$2.ts');
                var copyedPath = path_1.default.resolve(_this.tempDir, copyedFileName);
                fs_1.default.copyFile(file, copyedPath, resolve);
              }));
            });
            return [4
            /*yield*/
            , Promise.all(promises)];

          case 1:
            _a.sent();

            return [2
            /*return*/
            ];
        }
      });
    });
  };

  return App;
}();

exports.default = App;
},{"./Checker":"Checker.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var commander_1 = __importDefault(require("commander"));

var path_1 = __importDefault(require("path"));

var uniqid_1 = __importDefault(require("uniqid"));

var App_1 = __importDefault(require("./App")); // * コマンドライン引数を設定する


commander_1.default.version('0.0.1').option('-b --base-dir [dir]', '対象プロジェクトのベースURL（tsconfig.jsonのあるディレクトリ）', './').option('-p --pattern [pattern]', '定義ファイルのパターン（--base-dirがベース）', '**/*.d.ts').option('-c --config-file [configFile]', 'Swagger定義ファイルのパス', './swagger.yml').parse(process.argv);
var baseDir = commander_1.default.baseDir,
    pattern = commander_1.default.pattern,
    configFile = commander_1.default.configFile;
var tempDir = path_1.default.resolve(__dirname, "../.temp__" + uniqid_1.default());
var app = new App_1.default(baseDir, pattern, configFile, tempDir);
app.exec();
},{"./App":"App.ts"}]},{},["index.ts"], null)
//# sourceMappingURL=/index.map