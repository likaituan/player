/**
 * Created by likaituan on 16/11/29.
 */

var fs = require("fs");

exports.getMp3List = function(){
    var dir = "/data/audio/mp3";
    return fs.readdirSync(dir).filter(x=>x.endsWith(".mp3")).map(x=>{
        /^(.+?)\s*\-\s*(.+?)\./.test(x);
        var item = fs.statSync(`${dir}/${x}`);
        return {
            singer: RegExp.$1,
            song: RegExp.$2,
            mp3: `/mp3/${x}`,
            addTime: item.birthtime,
            size: item.size
        }
    }).sort((a,b)=>a.addTime-b.addTime);
};