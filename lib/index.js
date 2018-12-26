parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"KxN/":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=function(){function e(){}return e.getSwaggerSchema=function(e,t,n,r){if(e){var o=e.paths[t];if(o){var a=o[n];if(a){var s=a.parameters,i=a.requestBody,c=void 0===i?{}:i,p=a.responses;return"response"===r?((((void 0===p?{}:p)[200]||{}).content||{})["application/json"]||{}).schema:"get"===n?s:((c.content||{})["application/json"]||{}).schema}}}},e}();exports.default=e;
},{}],"2shl":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=function(){function t(t){void 0===t&&(t={}),this._log=t}return t.prototype.log=function(t,o,i,s,l){this._log[o]||(this._log[o]={}),this._log[o][i]||(this._log[o][i]={}),this._log[o][i][s]||(this._log[o][i][s]={}),this._log[o][i][s][l]||(this._log[o][i][s][l]=[]),this._log[o][i][s][l].push(t)},t}();exports.default=t;
},{}],"W7N4":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var t,r=1,i=arguments.length;r<i;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e}).apply(this,arguments)},t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t};Object.defineProperty(exports,"__esModule",{value:!0});var i=t(require("./Schema")),n=t(require("./Logger")),a=t(require("consola")),o=r(require("typescript-json-schema")),s=function(){function t(e,t,r){this.target=e,this.config=t,this.baseDir=r,this.logger=new n.default}return t.prototype.check=function(){var e=this,t=this.getTSSchema(),r=t.definitions;Object.keys(r).forEach(function(n){var o=r[n],s=o.properties,c=o.description,u=e.parseMetaComment(c),p=u.path,f=u.method,h=u.type;if(p&&f&&h){a.default.info("Checking... "+f+": "+p+" - "+h);var l=i.default.getSwaggerSchema(e.config,p,f,h);e.validateSchema(s,t,l,e.config),a.default.success("Finish")}})},t.prototype.getTSSchema=function(e){void 0===e&&(e=this.target);var t={baseUrl:this.baseDir,paths:{"@/*":["src/*"]}},r=o.getProgramFromFiles([e],t),i=o.generateSchema(r,"*");return i||{}},t.prototype.parseMetaComment=function(e){void 0===e&&(e="");var t=e.replace(/ /g,"").split("\n").reduce(function(e,t){var r=t.split(":"),i=r[0],n=r[1];return i&&n&&(e[i]=n),e},{});return{path:t.path,method:t.method,type:t.type}},t.prototype.getSchemaRef=function(e,t){var r,i=Object.keys(e)[0];if("$ref"!==i)return e;var n=e[i].replace(/^#\//,"").split("/").reduce(function(e,t){return e[t]||{}},t);return n.name&&n.schema?((r={})[n.name]=n.schema,r):n},t.prototype.optimizeSchema=function(t,r){var i,n=this,a=(Array.isArray(t)?t:[t]).reduce(function(t,i){return e({},t,n.getSchemaRef(i,r))},{});return Object.keys(a).includes("properties")?a.properties:"query"===a.in?((i={})[a.name]=a.schema,i):a},t.prototype.validateSchema=function(e,t,r,i){var n=this;void 0===e&&(e={}),void 0===t&&(t={}),void 0===r&&(r={}),void 0===i&&(i={});var o=this.optimizeSchema(e,t),s=this.optimizeSchema(r,i),c=Object.keys(o),u=Object.keys(s);u.forEach(function(e){if(!c.includes(e))return a.default.warn('Missing property "'+e+'"')}),c.forEach(function(e){if(!u.includes(e))return a.default.warn('Unknown property "'+e+'"')}),c.filter(function(e){return u.includes(e)}).forEach(function(e){var r=o[e],c=s[e];if(r.type!==c.type)return a.default.warn('Different Types: "'+e+'" ('+r.type+" vs "+c.type+")");"array"===r.type&&n.validateSchema(r.items,t,c.items,i)})},t}();exports.default=s;
},{"./Schema":"KxN/","./Logger":"2shl"}],"02H6":[function(require,module,exports) {
"use strict";var e=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))(function(i,o){function a(e){try{s(n.next(e))}catch(t){o(t)}}function u(e){try{s(n.throw(e))}catch(t){o(t)}}function s(e){e.done?i(e.value):new r(function(t){t(e.value)}).then(a,u)}s((n=n.apply(e,t||[])).next())})},t=this&&this.__generator||function(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=(i=a.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(u){o=[6,u],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var n=r(require("fs")),i=r(require("consola")),o=r(require("glob")),a=r(require("path")),u=r(require("rmdir")),s=r(require("js-yaml")),l=r(require("./Checker")),c=function(){function r(e,t,r,n){this.baseDir=e,this.pattern=t,this.configFile=r,this.tempDir=n}return r.prototype.exec=function(){return e(this,void 0,Promise,function(){var e,r=this;return t(this,function(t){switch(t.label){case 0:return i.default.info("Type check started!"),this.config=this.loadSwaggerConfig(),this.config?[4,this.copyTargetFiles()]:[2,i.default.error(this.configFile+"の定義ファイルを読み込めませんでした。")];case 1:return t.sent(),0===(e=o.default.sync(a.default.resolve(this.tempDir,"*.ts"))).length?[2,i.default.warn("チェック対象のファイルがありません。")]:(e.forEach(function(e){new l.default(e,r.config,r.baseDir).check()}),u.default(this.tempDir),[2])}})})},r.prototype.loadSwaggerConfig=function(e){void 0===e&&(e=this.configFile);try{return s.default.safeLoad(n.default.readFileSync(e,"utf8"))}catch(t){return}},r.prototype.copyTargetFiles=function(){return e(this,void 0,Promise,function(){var e,r,i,u=this;return t(this,function(t){switch(t.label){case 0:return e=a.default.resolve(a.default.resolve(this.baseDir,this.pattern)),r=o.default.sync(e),i=[],n.default.existsSync(this.tempDir)||n.default.mkdirSync(this.tempDir),r.forEach(function(e){i.push(new Promise(function(t){var r=e.replace(/(.*)\/(.+)\.d\.ts$/,"$2.ts"),i=a.default.resolve(u.tempDir,r);n.default.copyFile(e,i,t)}))}),[4,Promise.all(i)];case 1:return t.sent(),[2]}})})},r}();exports.default=c;
},{"./Checker":"W7N4"}],"7QCb":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var r=e(require("commander")),t=e(require("path")),a=e(require("./App"));r.default.version("0.0.1").option("-b --base-dir [dir]","対象プロジェクトのベースURL（tsconfig.jsonのあるディレクトリ）","./").option("-p --pattern [pattern]","定義ファイルのパターン（--base-dirがベース）","**/*.d.ts").option("-c --config-file [configFile]","Swagger定義ファイルのパス","./swagger.yml").parse(process.argv);var i=r.default.baseDir,o=r.default.pattern,n=r.default.configFile,s=t.default.resolve(__dirname,"../.temp"),u=new a.default(i,o,n,s);u.exec();
},{"./App":"02H6"}]},{},["7QCb"], null)