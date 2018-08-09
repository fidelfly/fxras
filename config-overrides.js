const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());
const path = require('path');
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJSON = require('./package.json')

function override(config, env) {
    // do stuff with the webpack i18n...
    config = injectBabelPlugin(['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}], config)

    config = injectBabelPlugin(['react-intl', {'messagesDir': "./i18n-messages"}], config)

    config = rewireLess.withLoaderOptions({
        javascriptEnabled : true,
        modifyVars: { "@primary-color": "#1DA57A"},
    })(config, env)

/*   var multiEntry = {
        "en-US" : resolveApp("src/i18n/en-US.js"),
        main : config.entry,
    }
    config.entry = multiEntry*/
    if (env == 'development') {
        var multiEntry = packageJSON.language === 'en' ? {
            "en-US" : resolveApp("src/i18n/en-US.js"),
            main : config.entry,
        }: {
            "zh-CN" : resolveApp("src/i18n/zh-CN.js"),
            main : config.entry,
        }
        config.entry = multiEntry
        config.output.filename = "static/js/[name].js"
 /*       config.output.filename = function(bundle) {
            console.log('filename function: ' + bundle.chunk)
            return 'static/js/' + bundle.name + '.js';
            //'static/js/[name].js'
        }*/
        config.plugins[1] = new HtmlWebpackPlugin({
            inject: true,
            template: resolveApp("public/index.html"),
            chunks : ['en-US', 'zh-CN', 'main'],
            chunksSortMode: function (chunk1, chunk2) {
                var order = ['en-US', 'zh-CN', 'main'];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2;
            }
        })
    }
    return config;
};


//module.exports = override;


// If you want use https, you should use the following code and replace the cert & ca setting
module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: override,
    devServer: function(configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);

            // Change the https certificate options to match your certificate, using the .env file to
            // set the file paths & passphrase.
            config.https = {
                key: fs.readFileSync('./tls/server.key', 'utf8'),  //server cert key
                cert: fs.readFileSync('./tls/server.crt', 'utf8'), //server cert
                ca: fs.readFileSync('./tls/ca.crt', 'utf8'),  //ca cert
            };

            // Return your customised Webpack Development Server config.
            return config;
        }
    }
};
