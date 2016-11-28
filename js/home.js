var ajax = require("ajax");

exports.list = {
	data:[]
};

exports.current = {};

exports.onInit = function(done){
	ajax.getMp3List(this.list, done);
};

exports.onRender = function () {
    this.el = {
        audio: document.querySelector("audio")
    };
};

exports.listen = function(index){
	this.current = this.list.data[index];
    this.el.audio.src = this.current.mp3;
	this.playerPart.render();
};