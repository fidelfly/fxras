const { override, fixBabelImports, addLessLoader, useEslintRc } = require("customize-cra");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDirectory = fs.realpathSync(process.cwd());
const path = require("path");
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
// const packageJSON = require("./package.json");
const rewireDefinePlugin = require("@yeutech-lab/react-app-rewire-define-plugin");

function myOverride(config, env) {
    // do stuff with the webpack i18n...
    /*    config = injectBabelPlugin(["import", { libraryName: "antd", libraryDirectory: "es", style: true }], config)

    config = injectBabelPlugin(["react-intl", { messagesDir: "./i18n-messages" }], config)*/
    config = override(
        fixBabelImports("import", { libraryName: "antd", libraryDirectory: "es", style: true }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: { "@primary-color": "#1DA57A" },
        }),
        useEslintRc() //eslint-disable-line
        //useEslintRc(".eslintrc.json") is also ok
    )(config, env);

    config.module.rules.push({
        loader: "webpack-ant-icon-loader",
        enforce: "pre",
        include: [path.resolve("node_modules/@ant-design/icons/lib/dist")],
    });

    config = rewireDefinePlugin(config, env, {
        "process.env.REACT_APP_OAUTH_KEY": JSON.stringify(
            makeBasicAuth(process.env.REACT_APP_OAUTH_CLENT, process.env.REACT_APP_OAUTH_PWD)
        ),
    });

    // console.log(config); //eslint-disable-line no-console
    config.entry = {
        "en-US": resolveApp("src/i18n/en-US.js"),
        "zh-CN": resolveApp("src/i18n/zh-CN.js"),
        main: config.entry,
    };
    config.output.filename = "static/js/[name].js";

    config.plugins[1] = new HtmlWebpackPlugin({
        inject: true,
        template: resolveApp("public/index.html"),
        chunks: ["en-US", "zh-CN", "main"],
        chunksSortMode: function(chunk1, chunk2) {
            var order = ["en-US", "zh-CN", "main"];
            var order1 = order.indexOf(chunk1);
            var order2 = order.indexOf(chunk2);
            return order1 - order2;
        },
    });
    return config;
}

function makeBasicAuth(user, password) {
    var authKey = user + ":" + password;
    // return "Basic " + btoa(authKey);
    return "Basic " + Buffer.from(authKey).toString("base64");
}
//module.exports = override;

// If you want use https, you should use the following code and replace the cert & ca setting
module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: myOverride,
    devServer: function(configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);
            if (config.proxy && config.proxy.length > 0) {
                for (let i = 0; i < config.proxy.length; i++) {
                    let p = config.proxy[i];
                    p.onProxyReq = (proxyReq, req) => req.setTimeout(600000);
                    config.proxy[i] = p;
                }
            }
            // Change the https certificate options to match your certificate, using the .env file to
            // set the file paths & passphrase.
            config.https = {
                key: fs.readFileSync("./tls/server.key", "utf8"), //server cert key
                cert: fs.readFileSync("./tls/server.crt", "utf8"), //server cert
                ca: fs.readFileSync("./tls/ca.crt", "utf8"), //ca cert
            };

            // Return your customised Webpack Development Server config.
            return config;
        };
    },
};
