var ajax = require("ajax");

exports.playIndex = -1;
exports.lastIndex = -1;
exports.current = {};

exports.list = {
    data: []
};

exports.onInit = function(done){
    ajax.getMp3List(exports.list, rs => {
        this.upInfo();
        done();
    });
};

exports.onRender = function(){
    exports.audio = exports.ui.querySelector("audio");
    exports.setAudio();
    exports.list.data.length>0 && exports.play(0);
};

exports.setAudio = function(){
    exports.audio.addEventListener("ended", exports.goNext);
};

exports.play = function(index){
    if(index>-1) {
        exports.playIndex = index;
    }
    exports.current = exports.list.data[exports.playIndex];
    exports.audio.src = exports.current.mp3;
    exports.audio.play();
    exports.listPart.render();
};

exports.goPrev = function(){
    exports.playIndex--;
    if(exports.playIndex<0){
        exports.playIndex = exports.lastIndex;
    }
    exports.play();
};

exports.goNext = function(){
    exports.playIndex++;
    if(exports.playIndex>exports.lastIndex){
        exports.playIndex = 0;
    }
    exports.play();
};

exports.swap = function(index, index2){
    var temp = this.list.data[index];
    this.list.data[index] = this.list.data[index2];
    this.list.data[index2] = temp;
};

exports.goRise = function(index){
    var preIndex = +index - 1;
    if(preIndex<0){
        preIndex = exports.list.data.length - 1;
    }
    if(exports.playIndex==index){
        exports.playIndex = preIndex;
    }
    exports.swap(index, preIndex);
    exports.upList();
};

exports.goDown = function(index){
    var nextIndex = +index + 1;
    if(nextIndex>exports.list.data.length-1){
        nextIndex = 0;
    }
    if(exports.playIndex==index){
        exports.playIndex = this.lastIndex;
    }
    exports.swap(index, nextIndex);
    exports.upList();
};

exports.chkNew = function(){
    ajax.getMp3List(exports.list, function(){
        exports.upInfo();
        exports.upList();
    });
};

exports.upInfo = function(){
    exports.totalCount = exports.list.data.length;
    if(exports.totalCount>0) {
        exports.lastIndex = exports.totalCount - 1;
    }
};

exports.upList = function(){
    //exports.lastIndex =
    exports.listPart.render();
};