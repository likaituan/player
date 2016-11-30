seekjs.config({
	ns: {
		"util.": "/utils/"
	},
	alias:{
		ajax: "/utils/ajax.js"
	}
});


var app = require("sys.app");

app.config({
	js: "/js/",
	css: "/css/",
	tp: "/templates/"
});

app.init("home");
