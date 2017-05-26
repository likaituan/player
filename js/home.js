var ajax = require("ajax");

// 初始化
exports.init = function() {
    this.playIndex = -1;
    this.lastIndex = -1;
    this.current = {};
    this.list = {
        data: []
    };
};

// 初始化事件
exports.onInit = function(done){
    ajax.getMp3List(this.list, rs => {
        this.upInfo();
        done();
    });
};

// 刷新事件
exports.onRender = function(){
    this.audio = this.ui.querySelector("audio");
    this.setAudio();
    this.list.data.length>0 && this.play(0);

    this.usePlugin("seekjs-plugin-lyrics");
};

// 设置Audio
exports.setAudio = function(){
    this.audio.addEventListener("ended", this.goNext);
};

// 播放
exports.play = function(index){
    if(index>-1) {
        this.playIndex = index;
    }
    this.current = this.list.data[this.playIndex];
    this.audio.src = this.current.mp3;
    this.audio.play();
    this.listPart.render();
};

// 上一首
exports.goPrev = function(){
    this.playIndex--;
    if(this.playIndex<0){
        this.playIndex = this.lastIndex;
    }
    this.play();
};

// 下一首
exports.goNext = function(){
    this.playIndex++;
    if(this.playIndex>this.lastIndex){
        this.playIndex = 0;
    }
    this.play();
};

// 上下调换
exports.swap = function(index, index2){
    var temp = this.list.data[index];
    this.list.data[index] = this.list.data[index2];
    this.list.data[index2] = temp;
};

// 上升
exports.goRise = function(index){
    var preIndex = +index - 1;
    if(preIndex<0){
        preIndex = this.list.data.length - 1;
    }
    if(this.playIndex==index){
        this.playIndex = preIndex;
    }
    this.swap(index, preIndex);
    this.upList();
};

// 下调
exports.goDown = function(index){
    var nextIndex = +index + 1;
    if(nextIndex>this.list.data.length-1){
        nextIndex = 0;
    }
    if(this.playIndex==index){
        this.playIndex = this.lastIndex;
    }
    this.swap(index, nextIndex);
    this.upList();
};

// 检查最新
exports.chkNew = function(){
    ajax.getMp3List(this.list, ()=>{
        this.upInfo();
        this.upList();
    });
};

// 更新信息
exports.upInfo = function(){
    this.totalCount = this.list.data.length;
    if(this.totalCount>0) {
        this.lastIndex = this.totalCount - 1;
    }
};

//
exports.upList = function(){
    //this.lastIndex =
    this.listPart.render();
};

exports.init();