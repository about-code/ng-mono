const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ngPackagr = require('../node_modules/ng-packagr/lib/ng-packagr');

/**
 * @return List of sub-directories of `base` directory
 */
function subDirectories(base) {
    return fs
        .readdirSync(base)
        .map(file => path.resolve(base, file))
        .filter(file => fs.lstatSync(file).isDirectory());
}

let paths = [];
let tasks = [];

const PACKAGE_DIR = path.resolve(__dirname, '../packages');
const PACKAGES_OR_SCOPES = subDirectories(PACKAGE_DIR).forEach((dir) => {
    paths = [...paths, dir, ...subDirectories(dir)];
});
const PACKAGES = paths.filter(dir => {
    return fs.existsSync(path.resolve(dir, 'ng-package.json'))
});

for (let i = 0, len = PACKAGES.length; i < len; i++) {
    const package = PACKAGES[i];
    const project = path.join(package, 'ng-package.json');

    // delete previous dist
    rimraf.sync(path.join(package, 'dist'));

    tasks.push(ngPackagr
        .createNgPackage({ project })
        .then(() => rimraf.sync(path.join(package, '.ng_build')))
        .catch((err) => {
            console.error(`Failed to package "${package}". Cause: `, err);
            process.exit(1);
        })
    );
}
return Promise.all(tasks).then(() => console.log("Done."));
