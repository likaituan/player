/**
 * Created by likaituan on 16/11/29.
 */

var localsJson = require("data.mp3.json");
var onlineJson = require("data.mp3-online.json");

exports.getMp3List = function (params, callback) {
    //var code = seekjs.getCode("/data/mp3-online.json");
    //var json = JSON.parse(code);
    var json = location.href.includes('local') ? localsJson : onlineJson;
    params.data = json.data;
    callback(json);
};