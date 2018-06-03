const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const ngPackagr = require('ng-packagr');
const getPackagesWithFile = require('./helpers/getPackagesWithFile');
const copyProjectDependencyVersions = require('./helpers/copyProjectDependencyVersions');

const PACKAGES = getPackagesWithFile('ng-package.json', path.resolve(__dirname, '../packages'));

let tasks = [];

for (let i = 0, len = PACKAGES.length; i < len; i++) {
    const package = PACKAGES[i];
    const project = path.join(package, 'ng-package.json');

    console.log("---- Building Package ----")
    console.log(`Path: ${path.relative(process.cwd(), package)}`);

    // delete previous dist
    rimraf.sync(path.join(package, 'dist'));

    tasks.push(ngPackagr
        .build({ project })
        .then(() => rimraf.sync(path.join(package, '.ng_build')))
        .then(() => copyProjectDependencyVersions(package))
        .catch((err) => {
            console.trace(`ERR: Failed to build package "${package}". Cause: `, err);
            throw (err);
        })
    );
}
return Promise.all(tasks)
    .then(() => console.log("INFO: Done."))
    .catch((err) => console.log("ERR: Done with errors."));
