// Siehe https://www.youtube.com/watch?v=unICbsPGFIA
var fs = require("fs-extra");
var ngc = require(".bin/ngc");
var rollup = require("rollup");

const isJsFile = /^.*\.js$/;
const timestamp = Date.now();

fs.removeSync("dist/");
fs.removeSync("build/");
fs.mkdirSync("dist/");
fs.mkdirSync("build/");

function onwarn( warning, next ) {
    if ( warning.code === 'UNRESOLVED_IMPORT' ) return;
    return warning;
}
function log(msg) {
    let now = new Date();
    console.log(`[${now.toLocaleTimeString()}] ${msg}`);
}

return new Promise((resolve, reject) => resolve())
     // Create FESM bundle
    .then(() => log("Bundling ES2015"))
    .then(() => ngc.main({ p: "tsconfig-build-es2015.json"}))
    .then(() => rollup.rollup({ entry: "build/<%= pkg_name %>.js", onwarn: onwarn}))
    .then((bundle) =>  bundle.write({ dest: "dist/<%= pkg_fullname %>.js", format: "es" }))

     // Create flat ES5 + ESM bundle
    .then(() => log("Bundling ES5"))
    .then(() => ngc.main({ p: "tsconfig-build-es5.json"}))
    .then(() => rollup.rollup({ entry: "build/<%= pkg_name %>.js", onwarn: onwarn }))
    .then((bundle) =>  {
        log("Writing ES5 + ESM");
        bundle.write({ dest: "dist/<%= pkg_fullname %>.es5.js", format: "es"});
        return bundle;
    })
    .then((bundle) => {
         log("Writing ES5 + UMD");
         bundle.write({ dest: "dist/<%= pkg_fullname %>.es5.umd.js", format: "umd", sourcemap: true, moduleName: "<%= pkg_fullname %>"})
         return bundle;
    })
     // copy files from build to dist
    .then(() => log("Writing to ./dist"))
    .then(() => fs.copy("./build", "dist", { filter: (file) => !isJsFile.test(file) }))

     // copy package.json to dist
    .then(() => fs.copy("package.json", "dist/package.json"))
    .then(() => fs.remove("build"))
    .then(() => log(`Done in ${(Date.now() - timestamp) / 1000}s`))
    .catch((err) => console.log(err));
