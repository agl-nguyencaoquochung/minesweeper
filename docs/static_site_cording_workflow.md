# Static site cording workflow

## Overview

AGL general template project support below.

- Building from html template engine pug, ejs to html.(Do not use multiple types at the same project.)
- Compiling scss to css.
- Compiling es5 and typescript to js.
- Auto delete assets file cache.
- Auto minify images.
- Html, css Validation.
- Record screenshot log. and check diff between different screenshot log.

## Getting Started

Start cording

```sh
npm run dev
```

> http:localhost:8080

Build finished data

```sh
npm run build
```

## Tips

Record screenshot log when finish task

```sh
npm run log:screenshot
```

Save screenshot below

> ./log/npm_version/xxxx-1200.jpg

Check diff between prev version and current version

```sh
./bin/screenshot-diff 1.0.3-0 1.0.3-1
```

Save diff screenshot below

> ./log/1.0.3-0_1.0.3-1_diff/xxxx-1200.jpg

Check quality by w3c-validator（!! You need java in your local !!）

```sh
npm run validate
```

:::note warn
You need java in your local
:::

Save validate log below

> ./log/html-validator.log
> ./log/css-validator.log

## Sample html

> ./sample/template
