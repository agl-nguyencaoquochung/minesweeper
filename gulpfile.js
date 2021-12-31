const { src, dest, series, } = require('gulp')
const through2 = require('through2');
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss') //autoprefixerとセット
const autoprefixer = require('autoprefixer') //ベンダープレフィックス付与
const cssdeclsort = require('css-declaration-sorter') //css並べ替え
const cssmqpacker = require('css-mqpacker')
const ImageMin = require('./tasks/ImageMin')
const HtmlBuilder = require('./tasks/HtmlBuilder')
const QualityValidator = require('./tasks/QualityValidator')
const ScreenshotLog = require('./tasks/ScreenshotLog')
const constants = require('./tasks/constants.js')

const env = process.env.NODE_ENV || 'development'
const isPrd = (env === 'production')

const html = (callback) => {
    (new HtmlBuilder(isPrd)).build()
    callback()
}

const css = () => {
    return src([
            `${constants.srcPath}assets/styles/**/*.scss`,
            `!${constants.srcPath}assets/styles/**/--*.scss`
        ])
        .pipe((!isPrd) ? sourcemaps.init() : through2.obj())

    .pipe(sass({
            outputStyle: 'expanded' //expanded, nested, campact, compressedから選択
        }))
        .pipe(postcss([
            cssmqpacker({ sort: true }),
            cssdeclsort({ order: 'smacss' }), //プロパティをソートし直す(アルファベット順)
            autoprefixer({
                grid: true,
                cascade: false
            }),
        ]))
        .pipe((!isPrd) ? sourcemaps.write('.') : through2.obj())
        .pipe(dest(`${constants.buildPath}assets/styles/`))
}

const img = (callback) => ImageMin.build().then(() => callback())

const validate = (callback) => {
    const validator = new QualityValidator(isPrd);
    validator.html()
    validator.css()
    callback()
}

const screenshotLog = (callback) => {
    (new ScreenshotLog(isPrd)).execute()
    callback()
}

module.exports = {
    html: series(html),
    css: series(css),
    img: series(img),
    validate: series(validate),
    screenshotLog: series(screenshotLog),
}