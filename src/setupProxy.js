const proxy = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        proxy("/fxgos/(websocket|progress)", {
            target: "wss://localhost:8080",
            ws: true,
            secure: false,
        })
    );
    app.use(
        proxy("/(fxgos|public|example)", {
            target: "https://localhost:8080",
            secure: false,
            proxyTimeout: 600000,
        })
    );
};
