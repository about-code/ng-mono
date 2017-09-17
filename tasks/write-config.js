let process = require('process')
    ,path_ = require('path')
    ,fs = require('fs')
    ,config = require('../config');

module.exports = function (context) {
    let {writeConfig} = context;
    let {key, path} = writeConfig;
    path = path_.join(path || process.cwd(), config.defaults.settingsFile);
    return new Promise((resolve, reject) => {
        let data;
        let readPromise = new Promise((success) => {
            fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    success({});
                } else {
                    success(JSON.parse(data));
                }
            });
        });
        readPromise.then((data) => {
            data[key] = context.answers;
            fs.writeFile(path, JSON.stringify(data, null, 4), { encoding: 'utf-8' }, (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(context);
                }
            });
        });
    });
};
