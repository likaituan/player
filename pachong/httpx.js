/**
 * Created by likaituan on 16/5/24.
 */

var http = require("http");

//获取代码
exports.getCode = function (ops, callback) {
    var url;
    var data = "";
    if(typeof ops=="string"){
        url = ops;
    }else{
        url = {
            host: item.host,
            port: item.port,
            path: PATH,
            method: ops.type,
            headers: {
                //"Cookie": Req.headers.cookie || "",
                "Content-Type": "application/"+contentType+"; charset=UTF-8"
                //,"Content-Length": data.replace(/[^\x00-\xff]/g,"aa").length
                //,"Content-Length": data.length
            }
        };
        console.log("\n=============== Service Info ================");
        console.log("TIME: "+date.now());
        console.log("TYPE: " + ops.type);
        console.log("URL: " + url.host+":"+url.port);
        console.log("PATH: " + PATH);
        console.log("DATA: " + data.replace(/(password\w*=)\w+/ig,"$1******"));
    }
    var req = http.request(url, function (res) {
        console.log('STATUS: ' + res.statusCode);
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        }).on("end", function () {
            callback(body);
        }).on('error', function (e) {
            callback(JSON.stringify({code: res.statusCode, msg: e.message}));
        });
    });
    req.on('error', function (err) {
        if(err.code=="ECONNREFUSED"){
            console.log("连接JAVA被拒绝.........");
        }else{
            console.log("远程服务器出错, 错误代码是: "+err.code+".................");
        }
        Res.end('{"code":500}');
    });
    //req.write(data);
    req.write(data + "\n");
    req.end();
};
