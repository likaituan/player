module.exports = function(args){
    var config = {
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
        port: args.port || 2006
    };
    
    if(args.f){
        config.static.items.unshift({
            path: "/node_modules/seekjs-plugin-lyrics/",
            dir: "/github/likaituan/seekjs-plugin-lyrics"
        },{
            path: "/node_modules/seekjs/",
            dir: "/github/seekjs-framework/seekjs"
        });
    }
    
    return config;
};