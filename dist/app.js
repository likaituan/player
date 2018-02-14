/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by likaituan on 26/12/2017.
 */

let ajax = __webpack_require__(28);

module.exports = {
	getList: params => ajax.get('/service/getList', params),
	search: params => ajax.get('/service/search', params),
	delSong: params => ajax.get('/service/delSong', params),
	addSong: params => ajax.post('/service/addSong', params),
	addClick: params => ajax.post('/service/addClick', params),
	setMood: params => ajax.post('/service/setMood', params),
	getCode: params => ajax.getText('/service/getCode', params)
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

﻿/**
 * seekDataBind - 前端轻量级数据绑定模块
 * Created by likaituan on 14/8/18.
 */



    var oo = {
        val: {
            get: function(ele){
                if(ele.tagName=="SELECT" && ele.multiple){
                    var options = Array.from(ele.querySelectorAll('option'));
                    var arr = [];
                    for(var i in options) {
                        var op = options[i];
                        op.selected && arr.push(op.value);
                    }
                    return arr.join(',');
                }
                return ele.value;
            },
            set: function(ele, v){
                ele.value = v;
            }
        },
        txt: {
            get: function(ele){
                if(ele.tagName=="SELECT"){
                    return ele.options[ele.selectedIndex].innerHTML;
                }
                return ele.innerHTML;
            },
            set: function(ele, v){
                if(ele.tagName!="SELECT") {
                    ele.innerHTML = v;
                }
            }
        },
        data: {
            get: function(ele, k){
                if(ele.tagName=="SELECT"){
                    return ele.options[ele.selectedIndex].dataset[k];
                }else {
                    return ele.innerHTML;
                }
            },
            set: function(ele, k, v){
                if(ele.tagName!="SELECT") {
                    ele.dataset[k] = v;
                }
            }
        }
    };

    //查找bind
    exports.findBind = function(box) {
        [].forEach.call(box.children, function (ele) {
            if(!ele.dataset.view) {
                //ele.dataset.bind && exports.elements.push(ele);
	            ele.getAttribute("data-bind") && exports.elements.push(ele); //为了兼容safiri新版本9.0.3
	            exports.findBind(ele);
            }
        });
    };

    //解析绑定 add by Li at 2014-12-9
    exports.parse = function (box, view) {
        //[].forEach.call(box.querySelectorAll("[data-bind]"), function (ele) {
        exports.elements = [];
        exports.findBind(box);
        exports.elements.forEach(function (ele) {
            if (ele.dataset.bind == "") {
                return console.warn(ele,"未绑定事件");
            }
            ele.dataset.bind.split(";").forEach(function(item) {
                var pm = item.split(":");
                if (pm.length == 1) {
                    pm = ["val"].concat(pm);
                }
                var p = oo[pm[0]];
                var s = pm[1].split(".");
                var v = view.model || view;
                var k;
                var t = [];
                while (k = s.shift()) {
                    t.push(k);
                    if (s.length > 0 && !v[k]) {
                        throw "the data-bind scope [" + t.join(".") + "] is not defined in the view [" + view.path + "]";
                    }
                    v = v[k];
                }
                p ? p.set(ele, v) : oo.data.set(ele,pm[0],v);
            });
        });
    };

    //更新到模板 add by Li at 2014-12-9
    exports.up2model_bak = function (box, view) {
        exports.elements = [];
        exports.findBind(box);
        exports.elements.forEach(function (ele) {
            ele.dataset.bind.split(";").forEach(function(item) {
                var pm = item.split(":");
                if (pm.length == 1) {
                    pm = ["val"].concat(pm);
                }
                var p = oo[pm[0]];
                var s = pm[1].split(".");
                var scope = view.model || view;
                while (s.length > 1) {
                    scope = scope[s.shift()];
                }
                var key = s[0];
                scope[key] = p ? p.get(ele) : oo.data.get(ele,pm[0]);
            });
        });
    };

    exports.up2model = function (box, view) {
        [...box.querySelectorAll('[data-bind]')].forEach(obj => {
            let key = obj.dataset.bind;
            view[key] = obj.value;
        });
    };


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by likaituan on 23/12/2017.
 */

__webpack_require__(26);

exports.s2ms = function (s) {
	let m = Math.floor(s/60);
	s = s % 60;
	return m.toString().padStart(2,0)  + ':' + s.toString().padStart(2,0);
};

exports.ms2s = function (ms) {
	let [m, s] = ms.split(':');
	return Math.floor(m) * 60 + Math.floor(s);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(5);
//require("../css/class.css");

let app = __webpack_require__(6);
let xplayer = __webpack_require__(21);

/*
xplayer.$config({

});
*/

app.start(xplayer);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = ``;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * app主模块
 * Created by likaituan on 16/10/19.
 */

var route = __webpack_require__(7);
var dataEvent = __webpack_require__(8);
var dataBind = __webpack_require__(1);
var dataView = __webpack_require__(10);
let View = __webpack_require__(11);

let app = {};
app.format = __webpack_require__(20);

// 配置信息
app.config = function (options) {
	let allowKeys = ['lang', 'viewEx', 'formatEx', 'plugins', '$hooks', 'useAnimate'];
	Object.keys(options).forEach(key => {
		if (!allowKeys.includes(key)) {
			throw `the key [${key}] is no allow!`;
		}
		if (key === 'formatEx') {
			app.addFormat(options[key]);
		}
		else if (key === 'viewEx') {
			app.addView(options[key]);
		}
		else {
			app[key] = options[key];
		}
	});
};

// 解析$data
let parseData = function (view, $data) {
	Object.keys($data).forEach(key => {
		Object.defineProperty(view, key, {
			configurable: true,
			get () {
				return $data[key];
			},
			set (val) {
				let oldVal = $data[key];
				$data[key] = val;
				if (typeof(val) === 'object' || oldVal !== val) {
					let timer = setTimeout(x => {
						clearTimeout(timer);
						app.render(view);
					}, 300);
				}
			}
		});
	});
};

// 解析$computed
let parseComputed = function (view, $computed) {
	Object.keys($computed).forEach(key => {
		Object.defineProperty(view, key, {
			configurable: true,
			get () {
				return $computed[key].call(view);
			}
		});
	});
};

// 检查view字段是否合法
let viewList = {};
app.chkView = function (view) {
	if (viewList[view.id]) {
		return;
	}
	viewList[view.id] = 1;

	let allowFields = ['path', 'id', '$data', '$computed', '$hooks', '$methods', '$children', '$imgs', '$format', '$links', '$config', '$params'];
	Object.keys(view).forEach(field => {
		if (!allowFields.includes(field)) {
			throw `the [${view.id}] view field [${field}] is no allow!`;
		}
	});
};

// 启动
app.start = function (router) {
	app.lang = app.lang || navigator.language.split('-')[0];
	let view = router;
	if (router.type === 'router') {
		view = router.initView(app);
		app.router = router;
	}
	view.path = view.path || 'home';
	view.id = view.id || view.path;
	app.chkView(view);
	app.isMounted = false;
	app.views = new Set();

	window.onload = function () {
		app.header = document.documentElement.querySelector('head');
		document.body.insertAdjacentHTML("afterBegin", '<div class="sk-app"></div>');
		app.box = document.body.firstElementChild;
		app.setMainView(view);
	};
};

// 设置主view
app.setMainView = function(view){
	app.rootView = view;
	view.$type = 'main';
	view.isShow = true;
	view.box = app.box;
	app.parseView(view);
};

// 解析Vie
app.parseView = function(view){
	app.views.add(view.id, 1);
	View.setProperty(view, app);
	Object.assign(view, View.staticMethods);
	view.app = app;
	app.goView(view);
};

app.goView = async function (view) {
	view.$format = Object.assign(view.$format || {}, app.format);

	if (view.$data) {
		Object.assign(view, view.$data);
		parseData(view, view.$data);
	}
	view.$computed && parseComputed(view, view.$computed, view.$data);
	Object.assign(view, view.$hooks);
	Object.assign(view, view.$methods);

	view.$lang = {};
	view.$links && view.$links.lang && Object.entries(view.$links.lang).forEach(([key, item]) => {
		view.$lang[key] = item[app.lang];
	});

	view.onInit && await view.onInit.call(view);
	app.render(view);
};

app.addFormat = function (format) {
	Object.assign(app.format, format);
};

app.addView = function (viewEx) {
	Object.assign(View.staticMethods, viewEx);
};

// 检查是否装载完成
app.chkMounted = function (viewId) {
	if (app.isMounted) {
		return;
	}
	app.views.delete(viewId);

	if (app.views.size === 0) {
		app.isMounted = true;
		app.exeMounted(app.rootView);
	}
};

app.exeMounted = function (view) {
	view.onMounted && view.onMounted.call(view);
	let views = view.$children || {};
	Object.values(views).forEach(app.exeMounted);
};

app.render = async function (view) {
	let actionBind;
	if (view.ui) {
		let ele = document.activeElement;
		if (ele.dataset && ele.dataset.bind) {
			actionBind = ele.dataset.bind;
		}
		dataBind.up2model(view.box, view);
	}
	view.onRenderBefore && await view.onRenderBefore.call(view);

	let $links = view.$links || {};

	if ($links.template) {
		view.box.innerHTML = $links.template.call(view, view.$format || {}, view.$lang, view.$imgs || {});
		if (view.box.children.length !== 1) {
			throw `[${view.page}] Err: top level must has and only has one element!`;
		}
		view.ui = view.box.firstElementChild;

		if (actionBind) {
			let ele = view.ui.querySelector(`[data-bind=${actionBind}]`);
			ele && ele.focus();
		}
		dataBind.parse(view.box, view);
		dataEvent.parse(view.box, view);
		dataView.parse(view, app);
		if (!view.isShow) {
			view.$hide();
		}
		view.onRender && await view.onRender.call(view);
	}
	else {
		// console.warn(`the view [${view.id}] is not template!`);
		console.error(`the view [${view.id}] is not template!`);
	}
	view.isMounted = true;
	app.chkMounted(view.id);
};

module.exports = app;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * 路由模块
 * Created by likaituan on 15/12/2017.
 */

// 解析Hash
exports.parseHash = function(app) {
	var uri = location.hash && location.hash.slice(1) || app.iniPage;
	this.parseURI({
		type: "main",
		box: app.box,
		uri
	}, app);
};

// 解析URI
exports.parseURI = function(options, app){
	options.page = options.uri.split(/[\/\?]/)[0];
	let view = app.pages[options.page];
	this.parseView(options, app, view);
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

﻿/**
 * 通用事件解析模块
 * create by Li at 2014-8-18
 * edit by Li at 2014-12-28
 */

	var env = __webpack_require__(9);
	
	//两段分隔符
	var split2 = function (str, flag) {
		var a = str.split(flag);
		var ret = [a.shift().trim()];
		a.length > 0 && ret.push(a.join(flag).trim());
		return ret;
	};

	/**
		@title 解析事件
		@param box 容器 element
		@parem Scope 作用域 object
	*/
	exports.parse = function (box, Scope) {
        let elements = [...box.querySelectorAll("[data-event],[data-enter]")];
        box.dataset && (box.dataset.event || box.dataset.enter) && elements.push(box);
		var enter;
		elements.forEach(ele => {
            let dataSet = ele.dataset;
			enter = enter || dataSet.enter && ele;
			var dataEventStr = (dataSet.event || dataSet.enter).trim();
			if (dataEventStr === '') {
				return;
			}
			dataEventStr.split(";").map(ema => {
				ema = ema.trim();
				if (ema === '') {
					throw `data-event [${dataEventStr}] format is wrong!`;
				}
				ema = split2(ema, ">");
				ema.length < 2 && ema.unshift('click');
				let [eventName, ma] = ema;
				if(!env.isMobile && eventName === 'tap'){
					eventName = 'click';
				}

				var [methodStr, argsStr] = split2(ma, ':');
				let methodParts = methodStr.split('.');
				let scope = Scope;
				while (methodParts.length > 1) {
					scope = scope[methodParts.shift()];
				}
				let method = methodParts.shift();
				if (!scope[method]){
					var pos = scope.type && scope.path ? `${scope.type} View [${scope.path}]` : 'targetView';
					throw `method [${method}] is no define on the ${pos}`;
				}
				let args = (argsStr || '').split(',');
				let fun = `fun_${eventName}`;
				ele[fun] && ele.removeEventListener(e, ele[fun]);
				ele[fun] = function (event) {
					Scope.$element = ele;
					Scope.$event = event;
					Scope.$up2model && Scope.$up2model();
					scope[method].apply(scope, args);
				};
				ele.addEventListener(eventName, ele[fun]);
			});
		});

		//临时加上的,写的比较死,需要重构
		document.onkeyup = enter ? function(e){
			e.keyCode==13 && enter.click();
		} : Scope.type=="main" ? null : document.onkeyup;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

﻿if(typeof navigator=="object") {
	var ua = exports.ua = navigator.userAgent;

	exports.os = "window";
	exports.browser = {
		name: "ie"
	};

	if (/ios/i.test(ua)) {
		exports.os = "ios";
		exports.ios = {
			version: 0
		}
	}
	if (/android/i.test(ua)) {
		exports.os = "android";
		exports.android = {
			version: 0
		}
	}
	if (/Mac OS X/i.test(ua)) {
		exports.os = "mac";
		exports.browser = {
			name: /chrome/i.test(ua) ? "chrome" : "safari",
			version: 0
		}
	}

	exports.mediaMode = screen.width > screen.height ? "pad" : "phone";
	exports.isMobile = /android|ios/.test(exports.os);
	exports.isPc = !exports.isMobile;
}

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Created by likaituan on 22/12/2017.
 */

// 解析子view
exports.parse = function ($parent, app) {
	[...$parent.ui.querySelectorAll('[data-view]')].forEach(box => {
		if (!$parent.$children) {
			throw `parent view [${$parent.id}] no setting children!`;
		}
		let data = box.dataset;
		let viewPath = data.view;
		let viewId = box.id || viewPath;
		let view = $parent.$children[viewId];
		if (!view) {
			throw `the view [${viewId}] no import!`;
		}
		view.id = viewId;
		app.chkView(view);
		view.path = viewPath;
		view.$type = 'subview';
		view.isShow = data.show !== 0 && data.show !== '0' && data.show !== false && data.show !== 'false';
		view.$root = $parent.$root;
		view.$parent = $parent;
		view.box = box;
		app.parseView(view);
	});

};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

﻿/**
 * View模块
 * Created by likaituan on 14/8/18.
 */

var dataBind = __webpack_require__(1);
let url = __webpack_require__(12);

// 设置属性
exports.setProperty = function (view, app) {
	if(view.$type === 'main'){
		app.mainView = view;
		view.query = url.parse(view.path, true).query || null;
		var params = view.path.split('?')[0].split('/');
		view.page = params.shift();
		view.params = {};
		view.params.source = params.join('/') ;

		if(view.$type=='sub'){
			view.parent[view.id || view.page] = view;
		}

		if(params.length % 2){
			view.params.id = params.shift();
		}
		while(params.length){
			view.params[params.shift()] = params.shift();
		}
	}
};

// 静态方法
exports.staticMethods = {
    //使用插件
    $usePlugin (pluginName, ops = {}) {
        this.app.usePlugin(pluginName, ops, this);
    },

    //切换
    $toggle (){
        this.ui.style.display = this.ui.style.display == 'none' ? 'block' : 'none';
    },

    //显示
    $show () {
        this.ui.style.display = 'block';
    },

    //隐藏
    $hide () {
        this.ui.style.display = 'none';
    },

	// 获取兄弟view
	$sibling (viewId) {
		return this.$parent.$children[viewId];
	},

    // 替换view
    $review (page) {
        this.app.review(this.box, page);
    },

    // 更新模型
    $up2model () {
        dataBind.up2model(this.ui, this);
    },

	// 跳转
	$go (...args) {
		this.app.router && this.app.router.go(...args);
	}
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(13);
var util = __webpack_require__(16);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(17);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)(module), __webpack_require__(15)))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(18);
exports.encode = exports.stringify = __webpack_require__(19);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

﻿/**
    @title 模板格式化
*/


    /*=====================处理字符串======================*/

    //字符串格式化
    exports.stringFormat = exports.SF = function (str, _obj) {
        if(arguments.length==1){
            return str;
        }else if(arguments.length==2 && obj.isPlain(_obj)){
            return str.replace(/\{(\w+)\}/g, function (_, key) {
                return _obj[key];
            });
        }else{
            var arr = [].slice.call(arguments, 1);
            return str.replace(/\{(\d+)\}/g, function (_, n) {
                return arr[n];
            });
        }
    };

    //字符格式化
    exports.strFormat = function () {
        var args = [].slice.call(arguments);
        var str = args.shift();
        args.forEach(function (arg,i) {
            str = str.replace("{"+i+"}", arg);
        });
        return str;
    };

    //取头几位
    exports.begin = function(str, n){
        return str.slice(0,n);
    };

    //取末几位
    exports.end = function(str, n){
        return str.slice(-n);
    };

    //转大写字母
    exports.upper = function(str){
        return str.toUpperCase();
    };

    //转小写字母
    exports.lower = function(str){
        return str.toLowerCase();
    };

    //根据指定的分隔符截成两半
    exports.split2 = function (str, flag) {
        var a = str.split(flag);
        var ret = [a.shift()];
        a.length > 0 && ret.push(a.join(flag));
        return ret;
    };


    /*=====================处理数字======================*/


    //分隔符
    exports.separator = exports.sep = function(num, n){
        n = n || 3;
        num = (+num).toString().split(".");
        var re = new RegExp("\\d(?=(\\d{"+n+"})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
    };


    //数字转中文(0-99之间)
    exports.num2cn = function (num) {
        var baseCnNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        var a = num.toString().split("");
        if (num < 11) {
            return baseCnNums[num];
        } else if (num < 20) {
            return "十" + baseCnNums[a[1]];
        } else if (num % 10 == 0) {
            return baseCnNums[a[0]] + "十";
        } else {
            return a.map(function (n) { return baseCnNums[n] }).join("十");
        }
    };

    /**
     @title 千分位格式化
     @param num 数字 number
     @param bit 保留小数点位数 number 2
     @return [string]
     */
    exports.number_format = function (num, bit) {
        //非正常值
        if (num==="" || num===null || num===NaN || num===undefined) {
            return "";
        }
        //非数字
        if (!/^\-?\d+(\.\d+)?$/.test(num)) {
            return num;
        }
        //不传bit参数
        if (bit === undefined) {
            bit = 2;
        }
        num = (+num).toFixed(bit).split(".");
        var re = new RegExp("\\d(?=(\\d{3})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
    };

    //万分位格式化
    exports.formatNum = function (num, bit) {
        //非正常值
        if (num === "" || num === null || num === NaN || num === undefined) {
            return "";
        }
        //非数字
        if (!/^\-?\d+(\.\d+)?$/.test(num)) {
            return num;
        }
        //不传bit参数
        if (bit === undefined) {
            bit = 0;
        }
        num = (+num).toFixed(bit).split(".");
        var re = new RegExp("\\d(?=(\\d{4})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
    };

    //分隔符
    exports.separator = exports.sep = function(num, n){
        n = n || 3;
        num = (+num).toString().split(".");
        var re = new RegExp("\\d(?=(\\d{"+n+"})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
    };

    //货币格式化
    exports.currency = function(num, n){
        if(n!==undefined && n>0){
            return exports.separator(num.toFixed(2),n);
        }
        return (+num).toFixed(2);
    };

    //人民币格式化
    exports.rmb = function(num){
        if(typeof(num)!="number" && !num){
            throw "rmb格式化数字为空";
        }else if(/^\d+(\.\d+)?$/.test(num)==false){
            throw "rmb格式化数字无效";
        }
        return parseInt(num).toString().replace(/\d(?=(\d{3})+$)/g, "$&,") + "." + (+num).toFixed(2).split(".")[1];
    };

    exports.bit = function(num, n){
        return (+num).toFixed(n);
    };

    //求百分比
    exports.percent = function (num1, num2, bit) {
        num1 = +num1;
        num2 = +num2;
        return ( num2===0 ? 0 : num1 / (num2||1) *100 ).toFixed(bit || 0) + "%";
    };

    /*=====================处理日期======================*/

    //解析日期
    exports.parseDate = function (date) {
        if (arguments.length == 3) {
            date = new Date(date, arguments[1], arguments[2]);
        } else if (typeof (date) == "string") {
            date = new Date(date.replace(/\-/g, "/"));
        } else if (typeof (date) == "number") {
            date = new Date(date);
        }
        return date;
    };

    //日期解析
    exports.parseDate_bak = function (date) {
        if (typeof date == "string") {
            date = date.split('.')[0].replace(/\-/g,"/").replace('T', ' ');
        }
        if (typeof date != "object") {
            date = new Date(date);
        }
        return date;
    };

    //时间格式化（YYYY-MM-DD hh:mm:ss形式）
    exports.timeFormat = function(date) {
        return date.toISOString().replace("T"," ").replace(/\..+$/,"");
    };

    //比较两个日期的大小
    exports.diffDate = function(d1, d2){
        d1 = new Date(d1);
        d2 = d2 ? new Date(d2) : new Date();
        var t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
        var t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
        return t1>t2 ? "gt" : t1<t2 ? "lt" : "eq";
    };

    //日期格式化
    exports.dateFormat = function (date, fmtString, flag) {
        date = exports.parseDate(date);
        if (!date) {
            return "";
        }
        if (flag) {
            var s = new Date().getTime() / 1000 - date.getTime() / 1000;
            if (s > 0 && s < 3600) {
                return Math.ceil(s / 60) + "分钟前";
            } else if (s > 0 && s < 86400) {
                return Math.round(s / 3600) + "小时前";
            }
        }
        var e = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmtString)) {
            fmtString = fmtString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var d in e) {
            if (new RegExp("(" + d + ")").test(fmtString)) {
                fmtString = fmtString.replace(RegExp.$1, RegExp.$1.length == 1 ? e[d] : ("00" + e[d]).substr(("" + e[d]).length));
            }
        }
        return fmtString;
    };

    //日期格式化
    exports.date_format = exports.df = function (date, fmtString, flag) {
        date = this.parseDate(date);
        if (!date) {
            return "";
        }
        if (flag) {
            var s = new Date().getTime() / 1000 - date.getTime() / 1000;
            if (s > 0 && s < 3600) {
                return Math.ceil(s / 60) + "分钟前";
            } else if (s > 0 && s < 86400) {
                return Math.round(s / 3600) + "小时前";
            }
        }
        var e = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmtString)) {
            fmtString = fmtString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var d in e) {
            if (new RegExp("(" + d + ")").test(fmtString)) {
                fmtString = fmtString.replace(RegExp.$1, RegExp.$1.length == 1 ? e[d] : ("00" + e[d]).substr(("" + e[d]).length));
            }
        }
        return fmtString;
    };

    //获取相差天数
    exports.getDiffDay = function(startDate, endDate){
        if(arguments.length==1){
            endDate = startDate;
            startDate = new Date();
        }
        var d1 = exports.parseDate(startDate);
        var d2 = exports.parseDate(endDate);
        d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
        d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
        return (d2-d1)/86400000;
    };

    //获取某年某月的天数
    exports.getDayCount = function (y,m) {
        return new Date(y, m + 1, 0).getDate();
    };

    //获取周岁(严谨模式)
    exports.getRealFullYear = function (date) {
        if (/string|number/.test(typeof date)) {
            date = new Date(date);
        }
        var curDate = new Date();
        var y1 = date.getFullYear();
        var m1 = date.getMonth();
        var d1 = date.getDate();
        var n1 = this.getDayCount(y1,m1);
        var y2 = curDate.getFullYear();
        var m2 = curDate.getMonth();
        var d2 = curDate.getDate();
        var n2 = this.getDayCount(y2, m2);
        if (m1==1 && d1 == n1 && m2==1 && d2 == n2) {
            d1 = d2;
        }
        var year = y2 - y1;
        if(m2-m1<0 || m2-m1==0&&d2-d1<0){
            year--;
        }
        return year;
    };

    //获取周岁
    exports.getFullYear = function (date) {
        date = this.parseDate.apply(null,arguments);
        var curDate = new Date();
        var y1 = date.getFullYear();
        var m1 = date.getMonth();
        var d1 = date.getDate();
        var y2 = curDate.getFullYear();
        var m2 = curDate.getMonth();
        var d2 = curDate.getDate();
        var year = y2 - y1;
        if(m2-m1<0 || m2-m1==0&&d2-d1<0){
            year--;
        }
        return year;
    };

    //获取当前时间
    exports.now = function(date) {
        return formatTime(new Date());
    };


    /*=====================处理数组======================*/

    //获取某一项
    exports.item = function(arr, index){
        if(index<0) {
            index += arr.length;
        }
        return arr[index];
    };

    //数组求和
    exports.sum = function (arr) {
        return arr.length>0 ? arr.reduce(function (a, b) {
            return a + b;
        }) : 0;
    };

    //数组去重
    exports.unique = function(arr){
        var uniqueArr = [];
        for(var i=0; i<arr.length; i++){
            arr.indexOf(arr[i])==i && uniqueArr.push(arr[i]);
        }
        return uniqueArr;
    };

    //数组求和并格式化
    exports.SF = function (arr, bit) {
        return this.F(this.sum(arr).toFixed(2),bit);
    };

    //数组下多个key求和
    exports.sumList = function (arr) {
        var o = {};
        [].slice.call(argments,1).forEach(function (key) {
            o[key] = 0;
            arr.forEach(function (item) {
                o[key] += +item[key];
            });
        });
        return o;
    };


    /*=====================处理对象======================*/

    //清空对象
    exports.clear = function (obj) {
        for (var k in obj) {
            var v = obj[k];
            if (typeof v == "string") {
                obj[k] = "";
            }
            else if (typeof v == "number") {
                obj[k] = 0;
            }
            else if (typeof v == "object") {
                if (Array.isArray(v)) {
                    obj[k] = [];
                }
                else {
                    obj[k] = {};
                }
            }
            else if (typeof v == "boolean") {
                obj[k] = false;
            }
        }
    };

    //清空对象
    exports.clearObj = function(obj){
        for(var k in obj){
            obj[k] = "";
        }
    };

    //过滤
    exports.filter = function (obj, fun) {
        if (typeof fun == "string") {
            fun = new Function("$key", "$item", "return " + fun);
        }
        var newObj = {};
        for (var k in obj) {
            fun(k, obj[k]) && (newObj[k] = obj[k]);
        }
        return newObj;
    };

    //合并对象(简单复制)
    exports.mergeObj = function(obj, sourceObj, noRepeat){
        for(var k in sourceObj){
            if(sourceObj.hasOwnProperty(k)) {
                if (noRepeat && obj.hasOwnProperty(k)) {
                    throw `the key "${k}" is already exist!`;
                } else {
                    obj[k] = sourceObj[k];
                }
            }
        }
        return obj;
    };

    //克隆对象(深度克隆)
    exports.cloneObj = function (This, ops) {
        var defaults = This.ops || {};
        ops = ops || {};
        This.el = This.el || {};
        [defaults, ops].forEach(function (obj) {
            obj.el = obj.el || {};
            for (var k in obj) {
                if (k == "el") {
                    for (var name in obj.el) {
                        This.el[name] = $(obj.el[name]);
                    }
                }else if(/^el_(\w+)$/.test(k)){
                    This.el[Regexports.$1] = $(obj[k]);
                } else {
                    This[k] = obj[k];
                }
            }
        });
        return This;
    };

    //只保留某些key
    exports.only = function(obj){
        var arr = [].slice.call(arguments,1);
        var o = {};
        arr.forEach(function(kk){
            kk = kk.split("->");
            var k1 = kk[0];
            var k2 = kk[1] || kk[0];
            o[k1] = obj[k2];
        });
        return o;
    };

    //排除某些key
    exports.except = function(obj){
        var arr = [].slice.call(arguments,1);
        var o = {};
        for (var k in obj) {
            if(arr.indexOf(k)==-1) {
                o[k] = obj[k];
            }
        }
        return o;
    };

    //系列化
    exports.serialize = function (jsonObj) {
        var a = [];
        for(var key in jsonObj){
            a.push(key);
            a.push(jsonObj[key]);
        }
        return a.join("/");
    };

    //反系列化
    exports.deserialize = function (jsonStr){
        var jsonArr = typeof(jsonStr)=="string" ? jsonStr.split("/") : jsonStr;
        var o = {};
        for(var i=0; i< jsonArr.length; i+=2){
            o[jsonArr[i]] = jsonArr[i+1];
        }
        return o;
    };

    //是否纯对象
    exports.isPlainObject = function(v){
        return typeof(v)=="object" && !Array.isArray(v);
    };

    //返回json字符串
    exports.json = function(jsonObj){
        return JSON.stringify(jsonObj,null,4);
    };


    /*=====================处理其他======================*/

    //条件判断语句
    exports.iif = function(v1, exp, v2){
        return exp ? v1 : (v2 || '');
    };

    //获取表单的值
    exports.getForm = function (form) {
        var o = {};
        form.find("select,input").each(function(i, obj){
            o[obj.name] = +obj.value;
        });
        return o;
    };

    //对象转成类的实例化
    exports.instantiation = function (o) {
        o.Class.prototype = o;
        return function (ops) {
            return new o.Class(ops);
        };
    };

    exports.log = function(...args){
        console.log.apply(console, args);
    };


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const boxList = ['', 'lyric', 'playlist', 'searchList', ''];

    // 初始化
    module.exports = {
        $data: {
            boxIndex: 2,
            showBg: 0,
            current: {}
        },
        $computed: {
            barTitle () {
                let item = this.$children.playlist.current;
                return item && `${item.singer} - ${item.song}`;
            },
            leftImg () {
                let name = boxList[this.boxIndex - 1];
                return name && `<img src="${this.$imgs[name]}" />` || '';
            },
            rightImg () {
                let name = boxList[this.boxIndex + 1];
                return name && `<img src="${this.$imgs[name]}" />` || '';
            }
        },
        $config (options) {
            console.log({options});
        },
        $hooks: {
            onMounted () {
                this.$children.playlist.startPlay();
            }
        },
        $methods: {
            // 切换窗口
            changeBoxIndex (num) {
                num = this.boxIndex + num * 1;
                num = Math.max(num, 1);
                num = Math.min(num, 3);
                this.boxIndex = num;
            }
        },
        $imgs:{
            lyric: __webpack_require__(22),
            playlist: __webpack_require__(23),
            searchList: __webpack_require__(24)
        },
        $children: {
            player: __webpack_require__(25),
            lyric: __webpack_require__(27),
            playlist: __webpack_require__(29),
            search: __webpack_require__(30)
        }
    };
let $links = module.exports.$links = {};

$links.template = function ($) {
	let buf = [];
	buf.push(`<div class="x-player">`);
	buf.push(`<header>`);
	buf.push(`<div data-view="player">`);
	buf.push(`</div>`);
	buf.push(`</header>`);
	buf.push(`<div class="middle-bar">`);
	buf.push(`<span data-event="changeBoxIndex:-1">`);
	buf.push(this.leftImg);
	buf.push(`</span>`);
	buf.push(`<span>`);
	buf.push(this.barTitle);
	buf.push(`</span>`);
	buf.push(`<span data-event="changeBoxIndex:1">`);
	buf.push(this.rightImg);
	buf.push(`</span>`);
	buf.push(`</div>`);
	buf.push(`<div class="fun-box" style="background-image: url(`);
	buf.push($.iif.apply(this, [this.current.bg,this.showBg]));
	buf.push(`);">`);
	buf.push(`<div>`);
	buf.push(`<div data-show="`);
	buf.push(this.boxIndex === 1);
	buf.push(`" data-view="lyric">`);
	buf.push(`</div>`);
	buf.push(`<div data-show="`);
	buf.push(this.boxIndex === 2);
	buf.push(`" data-view="playlist">`);
	buf.push(`</div>`);
	buf.push(`<div data-show="`);
	buf.push(this.boxIndex === 3);
	buf.push(`" data-view="search">`);
	buf.push(`</div>`);
	buf.push(`</div>`);
	buf.push(`</div>`);
	buf.push(`<footer>`);
	buf.push(`<div>`);
	buf.push(`设置`);
	buf.push(`</div>`);
	buf.push(`<div>`);
	buf.push(`copyright by Li 2018`);
	buf.push(`</div>`);
	buf.push(`<div>`);
	buf.push(`管理`);
	buf.push(`</div>`);
	buf.push(`</footer>`);
	buf.push(`</div>`);
	return buf.join('');
};

$links.style = ``;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = './1.png';

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = './2.png';

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = './3.png';

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

let time = __webpack_require__(2);
const ModeList = ['order', 'random', 'one'];
const ModeTitleMaps = {
    order: '顺序播放',
    random: '随机播放',
    one: '单曲循环'
};

module.exports = {
    $data: {
        currentTime: 0,
        totalTime: 0,
        isPlay: true,
        mode: 'order',
        current: {}
    },
    $computed: {
        playPercent () {
            if (this.totalTime > 0) {
                return Math.floor(this.playTime / this.totalTime * 100);
            }
            return 0;
        },
        showGo () {
            let view = this.$sibling('playlist');
            return view.isMounted && view.songList.length > 1;
        },
        modeTitle () {
            return ModeTitleMaps[this.mode]
        }
    },
    $hooks: {
        // 刷新事件
        onRender () {
            if (!this.audio) {
                this.audio = document.createElement('audio');
                this.audio.autoplay = true;
                this.setAudio();
                this.setKeyboard();
            }
        }
    },
    $methods: {
        // 设置Audio
        setAudio () {
            this.audio.addEventListener("timeupdate", x => this.showStatus(x));
            this.audio.addEventListener("ended", x => this.goMode());
            this.audio.addEventListener("error", e => this.showErr(e));
        },

        // 设置按键
        setKeyboard () {
            document.body.addEventListener('keydown', x => {
                x.altKey && x.key === 'ArrowLeft' && this.goPrev();
                x.altKey && x.key === 'ArrowRight' && this.goNext();
                x.altKey && x.key === 'ArrowUp' && this.changeVolume(0.05);
                x.altKey && x.key === 'ArrowDown' && this.changeVolume(-0.05);
            });
        },

        // 展示状态
        showStatus () {
            if (!this.timing) {
                this.currentTime = Math.floor(this.audio.currentTime);
                this.$sibling('lyric').updateTime(this.currentTime);
            }
        },

        // 播放出错处理
        showErr (err) {
            // console.log({err});
            let isUpdate = window.confirm('歌曲已过期, 是否更新?');
            if (isUpdate) {
                /*
                let view = this.$sibling('playlist');
                view.resetSong(view.playIndex);
                */
                let view = this.$sibling('search');
                view.addSong(this.current.songId);
            }
        },

        // 切歌
        changeSong (item) {
            this.current = item;
            this.currentTime = 0;
            this.totalTime = item.length || 0;
            this.audio.src = item.mp3;
            //this.audio.play();
        },

        // 切换播放模式
        changeMode () {
            let index = ModeList.findIndex(x => x === this.mode) + 1;
            if (index > 2) {
                index = 0;
            }
            this.mode = ModeList[index];
        },

        // 切换静音
        changeMute () {
            this.audio.muted = !this.audio.muted;
        },

        // 调整音量
        changeVolume (num) {
            num += this.audio.volume;
            num = Math.max(num, 0);
            num = Math.min(num, 1);
            this.audio.volume = num;
        },

        // 设置音量
        setVolume () {
            this.audio.volume = this.element.value;
        },

        // 调整时间开始
        setTimeStart () {
            this.timing = true;
        },

        // 调整时间
        setTime () {
            this.timing = false;
            this.audio.currentTime = this.element.value;
        },

        // 播放
        doPlay () {
            this.isPlay = true;
            this.audio.play();
        },

        // 暂停
        doPause (){
            this.isPlay = false;
            this.audio.pause();
        },

        // 上一首
        goPrev () {
            this.$sibling('playlist').goPrev();
        },

        // 下一首
        goNext () {
            this.$sibling('playlist').goNext();
        },

        // 根据模式自动跳转
        goMode () {
            this.$sibling('playlist').goMode(this.mode);
        }
    },
    $format: {
        s2ms: time.s2ms,
        ms2s: time.ms2s
    }
};
let $links = module.exports.$links = {};

$links.template = function ($) {
	let buf = [];
	buf.push(`<div class="player">`);
	buf.push(`<ul class="player-left">`);
	buf.push(`<li class="player-time">`);
	buf.push(`<input type="range" max="`);
	buf.push(this.totalTime);
	buf.push(`" value="`);
	buf.push(this.currentTime);
	buf.push(`" data-event="mousedown > setTimeStart ; mouseup > setTime" />`);
	buf.push(`<div>`);
	buf.push($.s2ms.apply(this, [this.currentTime,]));
	buf.push(`/`);
	buf.push($.s2ms.apply(this, [this.totalTime,]));
	buf.push(`</div>`);
	buf.push(`</li>`);
	buf.push(`<li class="player-button">`);
	if (this.showGo) {
	buf.push(`<div>`);
	buf.push(`<span class="btn-prev" data-event="goPrev" title="上一曲">`);
	buf.push(`</span>`);
	buf.push(`</div>`);
	}
	buf.push(`<div>`);
	if (this.isPlay) {
	buf.push(`<span class="btn-pause" data-event="doPause" title="暂停">`);
	buf.push(`</span>`);
	}
	else {
	buf.push(`<span class="btn-play" data-event="doPlay" title="播放">`);
	buf.push(`</span>`);
	}
	buf.push(`</div>`);
	if (this.showGo) {
	buf.push(`<div>`);
	buf.push(`<span class="btn-next" data-event="goNext" title="下一曲">`);
	buf.push(`</span>`);
	buf.push(`</div>`);
	}
	buf.push(`<div>`);
	buf.push(`<span class="btn-mode-`);
	buf.push(this.mode);
	buf.push(`" data-event="changeMode" title="`);
	buf.push(this.modeTitle);
	buf.push(`">`);
	buf.push(`</span>`);
	buf.push(`</div>`);
	buf.push(`</li>`);
	buf.push(`</ul>`);
	buf.push(`<div class="player-right1">`);
	buf.push(`<div>`);
	buf.push(`<input type="range" step="0.01" max="1" value="`);
	buf.push(this.audio ? this.audio.volume : 1);
	buf.push(`" data-event="mouseup > setVolume" />`);
	buf.push(`</div>`);
	buf.push(`<div data-event="changeMute" title="静音开关">`);
	if (this.audio && this.audio.muted) {
	buf.push(`<span class="btn-mute">`);
	buf.push(`</span>`);
	}
	else {
	buf.push(`<span class="btn-volume">`);
	buf.push(`</span>`);
	}
	buf.push(`</div>`);
	buf.push(`</div>`);
	buf.push(`<div class="player-right2">`);
	buf.push(`<img class="player-album-pic" src="`);
	buf.push(this.current.pic);
	buf.push(`" />`);
	buf.push(`<div class="player-album-title">`);
	buf.push(`专辑:`);
	buf.push(this.current.album);
	buf.push(`</div>`);
	buf.push(`</div>`);
	buf.push(`<div class="clear">`);
	buf.push(`</div>`);
	buf.push(`</div>`);
	return buf.join('');
};

$links.style = ``;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

String.prototype.padStart = String.prototype.padStart ? String.prototype.padStart : function(targetLength, padString) {
    targetLength = Math.floor(targetLength) || 0;
    if(targetLength < this.length) return String(this);

    padString = padString ? String(padString) : " ";

    var pad = "";
    var len = targetLength - this.length;
    var i = 0;
    while(pad.length < len) {
        if(!padString[i]) {
            i = 0;
        }
        pad += padString[i];
        i++;
    }

    return pad + String(this).slice(0);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = String.prototype.padStart;
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

let { ms2s } = __webpack_require__(2);
    let service = __webpack_require__(0);

    let parseLyric = function (text, finishTime) {
        let arr = [];
        text.replace(/\[(\d+\:\d+\.\d+)\]([^\n]+)/g, (_, startTime, word) => {
            startTime = ms2s(startTime);
            word =  word.replace(/<\d+>/g, '');
            arr.push({startTime, word});
        });
        arr.forEach((item, index) => {
            let item2 = arr[index+1];
            item.endTime = item2 ? item2.startTime : finishTime;
            item.len = item.endTime - item.startTime;
        });
        return arr;
    };

    module.exports = {
        $data: {
            index: -1,
            Top: 0,
            lineHeight: 40,
            midPos: 0,
            list: [],
            current: {}
        },
        $hooks: {
            onRender () {
                let boxHeight = this.ui.offsetHeight;
                let rows = Math.floor(boxHeight / this.lineHeight);
                if (rows % 2 === 0) {
                    --rows;
                }
                let midRow = Math.ceil(rows / 2);
                this.midPos = midRow * this.lineHeight;
            }
        },
        $methods: {
            // 更新歌词
            async updateSource (item) {
                this.current = item;
                let params  = {
                    file: item.lrc
                };
                let code = await service.getCode(params);
                this.list = parseLyric(code, item.length || 0);
                this.Top = this.midPos;
            },

            // 更新时间
            updateTime (time) {
                this.index = this.list.findIndex(item => item.startTime <= time && time < item.endTime);
                if (this.index > 0) {
                    let item = this.list[this.index];
                    let linePercent = Math.floor((time - item.startTime) / item.len * this.lineHeight);
                    this.Top = this.midPos - this.index * this.lineHeight - linePercent;
                }
            }
        }
    };
let $links = module.exports.$links = {};

$links.template = function ($) {
	let buf = [];
	buf.push(`<div class="lyric">`);
	buf.push(`<ul style="top: `);
	buf.push(this.Top);
	buf.push(`px;">`);
	for (let index in this.list) {
	let item = this.list[index];
	buf.push(`<li class="`);
	buf.push(this.index == index && 'green');
	buf.push(`">`);
	buf.push(item.word);
	buf.push(`</li>`);
	}
	buf.push(`</ul>`);
	buf.push(`</div>`);
	return buf.join('');
};

$links.style = ``;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * seekjs 内置 ajax 插件
 * @param ops
 */

const OPTIONS = {
	type: 'get',
	dataType: 'json',
	timeout: 30000,
	contentType: 'form'
};

const contentTypeMaps = {
	json: 'application/json',
	form: 'application/x-www-form-urlencoded'
};

let Ajax = function (options) {
	return new Promise((resolve, reject) => {
		let url = options.url;
		let data = options.data || {};
		let type = (options.type || OPTIONS.type).toLowerCase();

		let contentTypeKey = options.headers && options.headers.contentType || options.contentType || OPTIONS.contentType;
		let contentType = contentTypeMaps[contentTypeKey] || contentTypeKey;

		let query;
		if (contentTypeKey === 'json') {
			query = JSON.stringify(data);
		} else {
			query = Object.entries(data).map(([key,val]) => {
				return `${key}=${encodeURIComponent(val)}`;
			}).join('&');
			if (query && type === 'get') {
				url += '?' + query;
				query = '';
			}
		}

		let xhr = new XMLHttpRequest();
		xhr.open(type, url, true);
		xhr.responseType = options.dataType || OPTIONS.dataType;
		options.onBefore && options.onBefore(xhr);
		xhr.onload = () => {
			options.onComplete && options.onComplete(xhr);
			resolve(xhr.status === 200 ? xhr.response : {code: xhr.status});
		};
		xhr.timeout = options.timeout || OPTIONS.timeout;
		xhr.ontimeout = event => {
			console.log(`xhr event: ${event}`);
			alert('请求超时！');
			reject({code:504, message:'system timeout'});
		};
		xhr.setRequestHeader('Content-Type', contentType);
		let headers = Object.assign({}, options.headers || {});
		Object.keys(headers).forEach(key => {
			xhr.setRequestHeader(key, headers[key]);
		});
		xhr.send(query);
	});
};

// get请求
Ajax.get = async function (url, data, options) {
	options = options || {};
	options.url = url;
	options.data = data;
	options.type = 'get';
	return await Ajax(options);
};

// 获取文本
Ajax.getText = async function (url, data, options) {
	options = options || {};
	options.url = url;
	options.data = data;
	options.type = 'get';
	options.dataType = 'text';
	return await Ajax(options);
};

// post Form请求
Ajax.post = async function (url, data, options) {
	options = options || {};
	options.url = url;
	options.data = data;
	options.type = 'post';
    return await Ajax(options);
};

// post Json请求
Ajax.postJson = async function (url, data, options) {
	options = options || {};
	options.contentType = 'json';
	return await Ajax.post(url, data, options);
};

module.exports = Ajax;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

let service = __webpack_require__(0);

module.exports = {
    $data: {
        type: 'all',
        cate: '',
        cateList: [],
        songList: [],
        totalCount: 0,
        editMode: false,
        cateIndex: -1,
        playIndex: -1
    },
    $computed: {
        cateCount () {
            return this.cateList.length;
        },
        current () {
            return this.songList[this.playIndex];
        },
        songCount () {
            return this.songList.length;
        },
        lastIndex () {
            return this.songCount - 1;
        }
    },
    $hooks: {

    },
    $methods: {
        async getList () {
            let params = {
                type: this.type,
                cate: this.cate
            };
            let rs = await service.getList(params);
            this.parseList(rs);
        },
        parseList (rs) {
            Object.keys(rs.data).forEach(key => {
                this[key] = rs.data[key];
            });
            this.songCount > 0 && this.play(0);
        },

        // 开始播放
        startPlay () {
            this.getList();
        },

        // 播放
        async play (index) {
            if (index > -1) {
                this.playIndex = index;
            }else if (this.playIndex < 0){
                throw 'index wrong';
            }

            let item = this.songList[this.playIndex];
            let params = {
                id: item.id,
                type: this.type,
                cate: this.cate
            };
            await service.addClick(params);

            this.$parent.current = this.current;
            this.$sibling('player').changeSong(this.current);
            this.$sibling('lyric').updateSource(this.current);
        },

        // 上一首
        goPrev () {
            this.playIndex--;
            if (this.playIndex < 0) {
                this.playIndex = this.lastIndex;
            }
            this.play();
        },

        // 下一首
        goNext () {
            this.playIndex++;
            if (this.playIndex > this.lastIndex) {
                this.playIndex = 0;
            }
            this.play();
        },

        // 下一首
        goMode (mode) {
            if (mode === 'order') {
                return this.goNext();
            }
            if (mode === 'one') {
                return this.play(this.playIndex);
            }
            if (mode === 'random') {
                let index =  Math.floor(Math.random() * this.lastIndex);
                return this.play(index);
            }
        },

        // 上升
        goRise (index) {
            var prevIndex = +index - 1;
            if(prevIndex < 0){
                prevIndex = this.lastIndex;
            }
            if(this.playIndex == index){
                this.playIndex = prevIndex;
            }
            this.swap(index, prevIndex);
        },

        // 下调
        goDown (index) {
            var nextIndex = +index + 1;
            if(nextIndex > this.lastIndex){
                nextIndex = 0;
            }
            if(this.playIndex == index){
                this.playIndex = nextIndex;
            }
            this.swap(index, nextIndex);
        },

        // 上下调换
        swap (index, index2) {
            var temp = this.songList[index];
            this.songList[index] = this.songList[index2];
            this.songList[index2] = temp;
        },

        // 重新爬取歌曲信息
        resetSong (index) {
            let item = this.songList[index];
            this.$sibling('search').searchSong(`${item.singer} ${item.song}`);
        },

        // 删除歌曲
        async removeSong (index) {
            let item = this.songList[index];
            let params = {
                id: item.id,
                type: this.type,
                cate: this.cate
            };
            let rs = await service.delSong(params);
            this.cateList = rs.data.cateList;
            this.songList = rs.data.songList;
            index == this.playIndex && this.songCount > 0 && this.play(0);
        },

        // 播放选中的歌曲
        playSearchSong (data, songId) {
            this.songList = data.songList;
            let index = this.songList.findIndex(x => x.songId === songId);
            this.play(index);
        },

        // 选择分类方式
        chooseType () {
            this.cate = '';
            this.getList();
        },

        // 选择类别
        chooseCate (cateIndex) {
            this.cateIndex = cateIndex
            this.cate = this.cateList[cateIndex].name;
            this.getList();
        },

        // 修改心情
        async changeMood (songId) {
            let mood = this.element.value;
            let rs = await service.setMood({songId, mood});
            if (rs.success) {
                this.parseList(rs.data);
                this.chooseCate(mood);
            }
        }
    }
};
let $links = module.exports.$links = {};

$links.template = function ($) {
	let buf = [];
	buf.push(`<div class="playlist">`);
	buf.push(`<div class="playlist-cate">`);
	buf.push(`<select data-bind="type" data-event="change > chooseType">`);
	buf.push(`<option value="all">`);
	buf.push(`全部歌曲`);
	buf.push(`</option>`);
	buf.push(`<option value="singer">`);
	buf.push(`按歌手分类`);
	buf.push(`</option>`);
	buf.push(`<option value="lang">`);
	buf.push(`按语言分类`);
	buf.push(`</option>`);
	buf.push(`<option value="mood">`);
	buf.push(`按心情分类`);
	buf.push(`</option>`);
	buf.push(`</select>`);
	buf.push(`<span>`);
	buf.push(`(`);
	buf.push(this.totalCount);
	buf.push(`)`);
	buf.push(`</span>`);
	buf.push(`<ul>`);
	for (let index in this.cateList) {
	let item = this.cateList[index];
	buf.push(`<li data-event="chooseCate:`);
	buf.push(index);
	buf.push(`">`);
	buf.push(`<span style="`);
	if (this.cateIndex == index) {
	buf.push(` color:red; `);
	}
	buf.push(`">`);
	buf.push(item.text);
	buf.push(`(`);
	buf.push(item.count);
	buf.push(`)`);
	buf.push(`</span>`);
	buf.push(`</li>`);
	}
	buf.push(`</ul>`);
	buf.push(`</div>`);
	buf.push(`<ul class="playlist-list">`);
	for (let index in this.songList) {
	let item = this.songList[index];
	buf.push(`<li style="`);
	if (this.playIndex == index) {
	buf.push(` color:red; `);
	}
	buf.push(`">`);
	buf.push(`<span data-event="play:`);
	buf.push(index);
	buf.push(`">`);
	buf.push(+index+1);
	buf.push(`、`);
	buf.push(item.singer);
	buf.push(`-`);
	buf.push(item.song);
	buf.push(`(`);
	buf.push(item.click);
	buf.push(`)`);
	buf.push(`</span>`);
	buf.push(`<div class="playlist-operation">`);
	if (this.editMode) {
	buf.push(`<img class="playlist-img" src="./13.png" data-event="removeSong:`);
	buf.push(index);
	buf.push(`" title="删除" />`);
	if (this.songCount > 1) {
	buf.push(`<img class="playlist-img" src="./13.png" data-event="goRise:`);
	buf.push(index);
	buf.push(`" title="上调" />`);
	buf.push(`<img class="playlist-img" src="./14.png" data-event="goDown:`);
	buf.push(index);
	buf.push(`" title="下调" />`);
	}
	}
	if (this.editMode && this.cateType === 'mood') {
	buf.push(`<select data-event="change > changeMood: `);
	buf.push(item.songId);
	buf.push(`">`);
	 let currentMood = item.mood || '其它'; 
	for (let __key__ in this.moodList) {
	let mood = this.moodList[__key__];
	buf.push(`<option value="`);
	buf.push(mood.text);
	buf.push(`"`);
	if (currentMood === mood.text) {
	buf.push(`selected="selected"`);
	}
	buf.push(`>`);
	buf.push(mood.text);
	buf.push(`</option>`);
	}
	buf.push(`</select>`);
	}
	if (this.editMode) {
	buf.push(`<img class="playlist-img" src="./15.png" data-event="resetSong:`);
	buf.push(index);
	buf.push(`" title="更新" />`);
	}
	buf.push(`</div>`);
	buf.push(`</li>`);
	}
	buf.push(`</ul>`);
	buf.push(`<div class="clear">`);
	buf.push(`</div>`);
	buf.push(`</div>`);
	return buf.join('');
};

$links.style = ``;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

let service = __webpack_require__(0);

module.exports = {
    $data: {
        keyword: '',
        searchList: []
    },
    $methods: {
        // 查找歌曲
        async searchSong (keyword) {
            keyword = keyword || this.keyword;
            console.log({keyword});
            this.$parent.boxIndex = 3;
            let rs = await service.search({keyword});
            if (rs.success) {
                this.searchList = rs.data;
            }
        },

        // 选中歌曲
        async addSong (songId) {
            let view = this.$sibling('playlist');
            let params = {
                songId,
                type: view.type,
                cate: view.cate
            };
            let rs = await service.addSong(params);
            if (rs.success) {
                this.$parent.boxIndex = 2;
                this.$sibling('playlist').playSearchSong(rs.data, songId);
            }
            else {
                alert(rs.message);
            }
        }
    }
};
let $links = module.exports.$links = {};

$links.template = function ($) {
	let buf = [];
	buf.push(`<div class="search">`);
	buf.push(`<div class="search-bar">`);
	buf.push(`<input type="text" name="keyword" data-bind="keyword" data-enter="searchSong" placeholder="歌曲/歌手/专辑" />`);
	buf.push(`<button class="search-btn" data-event="searchSong">`);
	buf.push(`</button>`);
	buf.push(`</div>`);
	if (this.searchList.length > 0) {
	buf.push(`<table>`);
	buf.push(`<tr>`);
	buf.push(`<th>`);
	buf.push(`序号`);
	buf.push(`</th>`);
	buf.push(`<th>`);
	buf.push(`歌手`);
	buf.push(`</th>`);
	buf.push(`<th>`);
	buf.push(`专辑`);
	buf.push(`</th>`);
	buf.push(`<th>`);
	buf.push(`歌曲`);
	buf.push(`</th>`);
	buf.push(`<th>`);
	buf.push(`添加`);
	buf.push(`</th>`);
	buf.push(`</tr>`);
	for (let index in this.searchList) {
	let item = this.searchList[index];
	buf.push(`<tr>`);
	buf.push(`<td>`);
	buf.push(+index+1);
	buf.push(`</td>`);
	buf.push(`<td>`);
	buf.push(item.singer);
	buf.push(`</td>`);
	buf.push(`<td>`);
	buf.push(item.album);
	buf.push(`</td>`);
	buf.push(`<td>`);
	buf.push(item.song);
	buf.push(`</td>`);
	buf.push(`<td data-event="addSong:`);
	buf.push(item.songId);
	buf.push(`">`);
	buf.push(`<img src="./16.png" />`);
	buf.push(`</td>`);
	buf.push(`</tr>`);
	}
	buf.push(`</table>`);
	}
	buf.push(`</div>`);
	return buf.join('');
};

$links.style = ``;

/***/ })
/******/ ]);