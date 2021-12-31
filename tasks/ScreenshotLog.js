const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const puppeteer = require('puppeteer');
const browserSync = require('browser-sync').create();
const resemble = require('resemblejs');

const constants = require('./constants.js');
const pkg = require('./../package.json');

const bsConfig = {
    'server': true,
    'port': 8880,
    'serveStatic': ['dist'],
    'ghostMode': true,
    'open': false,
    'middleware': [],
    'https': false,
    'notify': false,
};

module.exports = class ScreenshotLog {
    constructor(isPrd) {
        this.isPrd = isPrd
        this.baseUrl = `http://localhost:${bsConfig.port}/`
        this.outDir = path.join(constants.logPath, pkg.version)
        this.displays = [1200, 768, 375,];

        this.buildPath = constants.buildPath
        this.buildFilePatt = `${constants.buildPath}**/*.html`
        this.buildFiles = glob.sync(this.buildFilePatt)
    }

    execute(path = null) {
        if (path !== null) {
            this.outDir = path.join(constants.logPath, path)
        }

        browserSync.init(bsConfig, async (_callback) => {
            this.browser = await puppeteer.launch();

            for (let file of this.buildFiles) {
                for (let width of this.displays) {
                    await this.screenshot(file, width)
                }
            }

            await this.browser.close();
            browserSync.exit();
        })
    }

    async screenshot(file, width) {
        const filePath = file.replace(this.buildPath, '');
        const outFileName = filePath.replace(/\//, '-')

        const page = await this.browser.newPage();
        page.setViewport({width: width, height: 480})
        await page.goto(this.baseUrl+filePath);
        await new Promise(resolve => setTimeout(resolve, 500))

        await mkdirp(this.outDir);
        await page.screenshot({
            type: 'jpeg',
            path: path.join(
                this.outDir,
                `${outFileName}-${width}.jpg`
            ),
            fullPage: true,
            quality: 50,
        });

        console.log(`save screenshot: ${filePath}, width:${width}`);
    }

    async diff(pathBefore, pathAfter) {
        console.log(`Start screenshot-diff: ${pathBefore}, ${pathAfter}`)

        const logPath = constants.logPath;

        const absPathBefore = path.join(logPath, pathBefore)
        const beforeImagePatt = `${absPathBefore}**/*.{png,jpg}`
        const beforeImages = glob.sync(beforeImagePatt)

        const absPathAfter = path.join(logPath, pathAfter)
        const afterImagePatt = `${absPathAfter}**/*.{png,jpg}`
        const afterImages = glob.sync(afterImagePatt)

        const distPath = path.join(logPath, `${pathAfter}_${pathBefore}_diff`);
        await mkdirp(distPath);

        for (let after of afterImages) {
            const imageAfter  = fs.readFileSync(after);
            const before = beforeImages.find(item => path.basename(item) === path.basename(after))

            if (typeof before === 'undefined') {
                console.log(`not mathc file before: ${after}`)
                return
            }
            const imageBefore = fs.readFileSync(before);

            resemble(imageAfter).compareTo(imageBefore)
                .ignoreColors()
                .onComplete( async (data) => {
                    console.log(`Check screenshot diff ${path.basename(before)}`)

                    if (data.misMatchPercentage <= 0.01) {
                        console.log('There is no difference.');
                        return
                    }

                    fs.writeFileSync(path.join(distPath, path.basename(before)), data.getBuffer());
                    console.log('A difference has occurred.');
                    console.log(data);
                });
        }

        console.log(`screenshot-diff done.`)
    }
}
