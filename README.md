# agl-general-template

## Overview

AGL general template project. update sequentially.
Supports static coding and Wordpress theme development.
Wordpress theme development feature is still in beta

## Initialize

Get this project and remove this project's git history

```sh
git clone git@github.com:allgrow-labo/agl_general_template.git your_project_name
cd your_project_name
rm -rf .git
```

Remove template documents, using doc folder for your new project.
Also remove this README.md to tmp folder, then edit new README.md for your new project.

```sh
mv ./docs ./tmp/docs && mkdir docs
```

Check this rule

- You should rewrite project.json with project information
- Keep a record of any information in README.md or `./docs/example.md`

Initialize git

```sh
git init
git add -A
git commit -m 'build(html): first commit'
git branch -M master
git remote add origin your-new-private-repository
git push -u origin master
```

## Setup

Install vscode extensions from recommended

> .vscode/extensions.json

Match local node.js version with project version

```sh
nvm use
```

Install node_modules

```sh
npm i
```

or pnpm is faster than npm.

```sh
pnpm i
```

Install husky

```sh
npx husky install
```

## Cording workflow

When making static site, See below.

> ./docs/static_site_cording_workflow.md

When making wordpress site, See below.

> ./docs/wordpress_site_cording_workflow.md

## Version management

### npm

> https://semver.org/

Big level update

```sh
npm version major
```

Middle level update

```sh
npm version minor
```

Small fix

```sh
npm version patch
```

```sh
npm version prerelease
```

## Trouble shooting

When making wordpress site, See below.

> ./docs/trouble_shooting.md

## Client require share AGL's template

When making wordpress site, See below.

> ./docs/share_client.md
