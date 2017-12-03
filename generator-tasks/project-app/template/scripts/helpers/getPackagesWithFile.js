const fs = require('fs');
const path = require('path');

/**
 * @return List of sub-directories of `base` directory
 */
function subDirectories(base) {
    return fs
        .readdirSync(base)
        .map(file => path.resolve(base, file))
        .filter(file => fs.lstatSync(file).isDirectory());
}

/**
 * Returns an array with paths of packages which contain
 * a given file.
 */
module.exports = function getPackagesWithFile(filename, packageDir) {
    let paths = [];
    const PACKAGES_OR_SCOPES = subDirectories(packageDir).forEach((dir) => {
        paths = [...paths, dir, ...subDirectories(dir)];
    });
    const PACKAGES = paths.filter(dir => {
        return fs.existsSync(path.resolve(dir, filename));
    });
    return PACKAGES;
};
