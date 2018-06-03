const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');

module.exports = {
    // webpack-serve options
    // see https://github.com/webpack-contrib/webpack-serve#add-on-features

    add: (app, middleware, options) => {
        // DEEP-LINKING-SUPPORT
        app.use(convert(history({
            // connect-history-api-fallback options
            // see https://github.com/bripkens/connect-history-api-fallback#options
        })));

        // PROXY-SETTINGS
        // app.use(convert(proxy({
        //     // HTTP proxy middleware options
        //     // see https://www.npmjs.com/package/http-proxy-middleware
        //     '/api': {
        //         target: 'http://localhost:8081'
        //         // , headers: {
        //         //     "Authorization": "Basic ..."
        //         // }
        //     }
        // })));
    }
}
