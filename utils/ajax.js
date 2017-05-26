/**
 * Created by likaituan on 16/11/29.
 */

var json = require("data.mp3-online.json");

exports.getMp3List = function (params, callback) {
    //var code = seekjs.getCode("/data/mp3-online.json");
    //var json = JSON.parse(code);
    params.data = json.data;
    callback(json);
};