seekjs.config({
	ns: {
		data: "/data/",
		util: "/utils/",
		css: {
			path: "/css/",
			type: ".css"
		}
	},
	alias:{
		ajax: "/utils/ajax.js"
	}
});

require("css.tag");
require("css.class");

var app = require("sys.app");

app.config({
	js: "/js/",
	css: "/css/",
	tp: "/templates/"
});

app.init("home");
