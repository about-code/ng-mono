const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ngPackagr = require('../node_modules/ng-packagr/lib/ng-packagr');

process.env.DEBUG = true;

function dirs(base) {
    return fs
        .readdirSync(base)
        .map(file => path.resolve(base, file))
        .filter(file => fs.lstatSync(file).isDirectory());
}

var PATHS = [];
const PACKAGE_SRC_DIR = path.resolve(__dirname, '../packages');
const PACKAGES_OR_SCOPES = dirs(PACKAGE_SRC_DIR).forEach((dir) => {
    PATHS = [...PATHS, dir, ...dirs(dir)];
});

var PACKAGES = PATHS
    .filter(file => fs.existsSync(path.resolve(file, 'ng-package.json')));

let promise = Promise.resolve();
let tasks = [];
while (PACKAGES.length > 0) {
    const package = PACKAGES.pop();
    const project = path.join(package, 'ng-package.json');
    rimraf.sync(path.join(package, 'dist'));

    tasks.push(
        ngPackagr.ngPackage({ project })
        .then(() => rimraf.sync(path.join(package, '.ng_build')))
        .catch((err) => {
            console.error(`Failed to package "${package}". Cause: `, err);
            process.exit(1);
        })
    );
}
return Promise.all(tasks).then(() => console.log("Done."));
