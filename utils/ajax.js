/**
 * Created by likaituan on 16/11/29.
 */

exports.getMp3List = function (params, callback) {
    var code = seekjs.getCode("/service/getMp3List");
    var json = JSON.parse(code);
    params.data = json.data;
    callback(json);
};