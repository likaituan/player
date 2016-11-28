module.exports = function(args){
    return {
        static: {
            items: [{
                path: "/mp3/",
                dir: "/data/audio/mp3"
            },{
                path: "/",
                dir: args.dist ? `${__diraname}/dist` : __dirname
            }]
        },
        remote: {
            path: "/service/",
            file: require("./node/service"),
            type: "json"
        },
        port: args.port || 5001
    };
};