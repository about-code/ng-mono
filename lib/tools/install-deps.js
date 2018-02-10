var npmi = require("npmi");

module.exports = function(context) {
    return new Promise((resolve, reject) => {
        let { answers, installDeps } = context;
        let { auto_install, targetDir } = installDeps;
        let { confirm } = answers;

        if (! confirm) {
            resolve(context);
        }
        if (auto_install) {
            npmi({ path: targetDir }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(context);
            });
        } else {
            resolve(context);
        }
    });
}
