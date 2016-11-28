/**
 * Created by likaituan on 16/11/29.
 */

exports.getMp3List = function (params) {
    var dir = "/data/audio/mp3";
    return require("fs").readdirSync(dir).map(x=>{
        var xx = x.split(".");
        var ti = xx[0].split(" - ");
        return {
            singer: ti[0],
            song: ti[1],
            mp3: `/mp3/${x}`
        }
    });
};