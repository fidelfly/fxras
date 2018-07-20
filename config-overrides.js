const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());
const path = require('path');
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
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
        var multiEntry = {
            "en-US" : resolveApp("src/i18n/en-US.js"),
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
            chunks : ['en-US', 'main'],
            chunksSortMode: function (chunk1, chunk2) {
                var order = ['en-US', 'main'];
                var order1 = order.indexOf(chunk1.names[0]);
                var order2 = order.indexOf(chunk2.names[0]);
                return order1 - order2;
            }
        })
    }
    return config;
};