/**
 * Created by likaituan on 16/5/24.
 */

var httpx = require("./httpx");
var cheerio = require("cheerio");

exports.init = function(){
    this.search("有谁共鸣 张国荣", function(mp3){
        console.log(mp3);
    });
};

exports.search = function(key, callback){
    var keys = key.split(" ");
    httpx.getCode(`http://www.xiami.com/search/song?key=${key}`, function(code){
        //console.log(code);
        var $ = cheerio.load(code);
        var list = $(".track_list tbody tr");
        var len = list.length;
        var tr;
        var mp3 = "";
        for(var i=0; i<len; i++){
            tr = list.eq(i);
            console.log(i);
            //console.log(item.html());
            var songKey = tr.find("td.song_name b.key_red");
            var artKey = tr.find("td.song_artist b.key_red");
            if(songKey && artKey){
                var songName = exports.getText(songKey);
                var artName = exports.getText(artKey);
                if(songName==keys[0] && artName==keys[1]) {
                    var songId = tr.find("td.chkbox input").val();
                    console.log(songName, artName, songId, "=================");
                    mp3 = exports.getMp3(songId);
                    break;
                }
            }
        }
        callback(mp3);
    });
};

//获取文本
exports.getText = function(dom){
    var html = dom.html().slice(0,-1).replace(/\&#/g,0).split(";");
    var text = String.fromCharCode.apply(null, html);
    return text;
};

//获取MP3
exports.getMp3 = function(id){
    var crc =  "bdfb68f9b8597cfa0e291eaa24922c11";
    return `http://download.file.xiami.com/download/get?id=${id}&type=song&quality=2&crc=${crc}`;
};

exports.init();
