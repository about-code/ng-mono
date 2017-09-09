var npmi = require("npmi");

module.exports = function(taskConf) {
    return new Promise((resolve, reject) => {
        let { answers, installDeps } = taskConf;
        let { auto_install, targetDir } = installDeps;
        let { confirm } = answers;

        if (! confirm) {
            reject();
        }
        if (auto_install) {
            npmi({ path: targetDir }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(taskConf);
            });
        } else {
            return taskConf;
        }
    });
}
