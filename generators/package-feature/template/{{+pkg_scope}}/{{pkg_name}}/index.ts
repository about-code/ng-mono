// We export some package info here to satisfy initial builds with ngc/rollup
// which require something to be exported. Feel free to remove `packageInfo`
// once you have got something else to export.
export const packageInfo = {
    name: "<%= pkg_fullname %>",
    description: "<%= pkg_description %>",
    author: "<%= pkg_author %>",
    copyright: "<%= pkg_author %>"
};

// Export the package's __public__ api, here.
// :: export {{{exported_name}}} from "{{internal_path}}";
