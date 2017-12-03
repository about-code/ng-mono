const process = require('process');
const fs = require('fs');
const path = require('path');
const PROJECT_MANIFEST_PATH = path.resolve(process.cwd(), 'package.json');

// Load project manifest
let projectManifest;
try {
    projectManifest = require(PROJECT_MANIFEST_PATH);
} catch (err) {
    console.log(`Failed to load project manifest ${PROJECT_MANIFEST_PATH}.`);
    process.exit(1);
}
/**
 * Replaces any asterisk ('*') version specifier of dependencies in a package's
 * ./dist/package.json file with the version declared for the same dependency
 * on the project level in the project's package.json manifest.
 *
 * @param {string} packagePath
 */
module.exports = function copyProjectDependencyVersions(packagePath) {
    const packageManifestPath = path.join(packagePath, './dist/package.json');
    let packageManifestString,
        packageManifestObj;

    try {
        packageManifestString = fs.readFileSync(packageManifestPath);
    } catch (err) {
        console.log(`ERR: No manifest ${packageManifestPath} found.`);
        console.trace(err);
        return;
    }

    try {
        packageManifestObj = JSON.parse(packageManifestString);
    } catch (err) {
        console.log(`ERR: Couldn't parse ${packageManifestPath}. Skipped.`);
        console.trace(err);
        return;
    }

    try {
        packageManifestObj = inheritVersions(projectManifest, packageManifestObj);
        fs.writeFileSync(packageManifestPath, JSON.stringify(packageManifestObj, null, "  "));
    } catch (err) {
        console.log(`ERR: Failed to write ${packageManifestPath}.`);
        console.trace(err);
        return;
    }
}


function inheritVersions(projectManifest, packageManifest) {
    const depSections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    let projectDeps = {};

    depSections.forEach((depSection) => {
        projectDeps = Object.assign(projectDeps, projectManifest[depSection]);
    });
    depSections.forEach((depSection) => {
        const packageDeps = packageManifest[depSection];
        for (const dep in packageDeps) {
            if (packageDeps.hasOwnProperty(dep)) {
                if (packageDeps[dep] === '*') {
                    if (projectDeps.hasOwnProperty(dep) && projectDeps[dep] !== '*') {
                        packageDeps[dep] = projectDeps[dep];
                    } else {
                        console.log(`WARN: Package manifest declares a dependency { "${dep}": "*" } with a wildcard version specifier. An attempt to replace it with a more specific version range from the project manifest failed.`);
                    }
                }
            }
        }
    });
    return packageManifest;
}
