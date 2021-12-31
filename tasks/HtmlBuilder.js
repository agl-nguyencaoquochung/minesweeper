const fs = require('fs');
const glob = require('glob');
const path = require('path');
const mkdirp = require('mkdirp');
const pug = require('pug');
const ejs = require('ejs');
const beautify = require('js-beautify')
const cachebust = require('cachebust')
const constants = require('./constants.js')

module.exports = class HtmlBuilder {
    constructor(isPrd) {
        this.isPrd = isPrd
        this.srcPath = `${constants.srcPath}template/`
        this.srcFilePatt = `${this.srcPath}**/*.{html,pug,ejs}`
        this.srcFiles = glob.sync(this.srcFilePatt)

        this.buildPath = constants.buildPath
        this.buildFilePatt = `${constants.buildPath}**/*.html`
        this.buildFiles = glob.sync(this.buildFilePatt)

        try {
            this.dataPath = require(`${constants.srcPath}data/index.json`)
        } catch (e) {
            this.dataPath = null
        }
    }

    build() {
        this.srcFiles.forEach(file => {
            if (path.basename(file).match(/^_/g)) {
                return
            }

            this._readFile(file).then((ctx) =>{
                let html = ''

                if (path.extname(file) === '.pug') {
                    this.compilePug(ctx).then((html) => {
                        if (this.isPrd) {
                            html = this.beautify(html)
                        }
                        html = cachebust.busted(html, {type: 'timestamp'})
                        this._render(file, html)
                    })
                } else if (path.extname(file) === '.ejs') {
                    this.compileEjs(ctx).then((html) => {
                        if (this.isPrd) {
                            html = this.beautify(html)
                        }
                        html = cachebust.busted(html, {type: 'timestamp'})
                        this._render(file, html)
                    })
                } else {
                    html = ctx
                    if (this.isPrd) {
                        html = this.beautify(html)
                    }
                    html = cachebust.busted(html, {type: 'timestamp'})
                    this._render(file, html)
                }
            })
        })
    }

    async compilePug(ctx) {
        const options = {
            filename: 'pug',
            basedir: this.srcPath,
            compileDebug: false,
            debug: false,
        }
        return pug.render(ctx, options)
    }

    async compileEjs(ctx) {
        const options = {
            root: this.srcPath,
        }
        const data = this.dataPath || {}

        return ejs.render(ctx, data, options)
    }

    async _readFile(file) {
        return fs.readFileSync(file, 'utf8', (err, ctx) => {
            if (err) {
                console.log(err)
                return
            }

            return ctx;
        })
    }

    async _render(file, html) {
        const buildFile = file.replace(this.srcPath, '').replace(/\.(pug|ejs)$/, '.html')

        await mkdirp(path.join(this.buildPath, path.dirname(buildFile)));
        fs.writeFileSync(
            path.join(this.buildPath, buildFile),
            html,
            'utf8',
            (e) => {
                if (e) {
                    console.log(e)
                }
            }
        )
    }

    beautify(ctx) {
        const options = {
            indent_size: 2,
            end_with_newline: true,
            preserve_newlines: false,
            max_preserve_newlines: 0,
            wrap_line_length: 0,
            wrap_attributes_indent_size: 0,
            unformatted: ['b', 'em'],
        }

        return beautify.html(ctx, options)
    }
}
