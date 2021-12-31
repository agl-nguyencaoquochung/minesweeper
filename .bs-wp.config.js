const pkg = require('./package.json')

module.exports = {
    files: [
        `wordpress/web/app/themes/${pkg.name}/assets/styles/**/*.css`,
        `wordpress/web/app/themes/${pkg.name}/assets/scripts/**/*.js`,
        `wordpress/web/app/themes/${pkg.name}/**/*.php`,
    ],
    proxy: {
        target: 'http://localhost:8888'
    },
    port: 8080,
    ghostMode: false,
    open: false,
    middleware: [],
    https: false,
    // reloadOnRestart: true,
};
