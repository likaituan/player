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
	tp: "/templates/"
});

app.init("home");
