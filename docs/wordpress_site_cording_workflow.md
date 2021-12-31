# Wordpress site cording workflow

## Overview

Wordpress theme development feature is still in beta.


## Setup xammp environment

### Getting Started

If Docker cannot be installed in your PC, using the xampp for instead.

Put `agl_general_template` at `/xampp/htdocs`

Change folder name `agl_general_template` to project name.

### Setup environment variable
Open `/bin/wordpress-create.sh`, and edit the following information according to your environment

```sh
DB_NAME='wordpress'
DB_USER='wordpress'
DB_PASSWORD='wordpress'
```

```sh
DB_HOST='192.168.216.10'
```

```sh
WP_HOME='http://localhost:8080'
```

Open `/bin/wordpress-install.sh`, and edit the following information according to your environment

```sh
--url="http://localhost:8080"
```

Open `.bs-wp.config.js`, and edit the following information according to your environment

```sh
proxy: {
  target: 'http://localhost:8888'
},
```
### Setup Wordpress
Create a new wordpress folder using by composer

```sh
sh bin/wordpress-create.sh
```

Install starter theme (optional)

```sh
npm run wp:init
```

Go to `http://localhost:8080/wordpress/web` to setup your Wordpress


## Setup docker environment

### Getting Started

Create a new wordpress folder using by composer

```sh
sh bin/wordpress-create.sh
```

Install starter theme (optional)

```sh
npm run wp:init
```

### Start virtual machine

```sh
docker-compose -f ./docker/docker-compose.yml up -d
```

> http://localhost:8888

Shut down virtual machine

```sh
docker-compose -f ./docker/docker-compose.yml down
```

Login virtual machine

```sh
docker-compose -f ./docker/docker-compose.yml exec agl-app bash
```

Rebuild docker image

```sh
docker-compose -f ./docker/docker-compose.yml build
```
### Setup Wordpress

You can operate Wordpress from the management screen, but it will be faster if you operate it from the command line.
There is a way to use wp-cli on a virtual machine. The installation process is described in the shell below.

Composer install wp-cli $ Wordpress core install

```sh
docker-compose -f ./docker/docker-compose.yml exec agl-app sh ./bin/wordpress-install.sh
```

**Other usage**

Activate theme

```sh
docker-compose -f ./docker/docker-compose.yml exec agl-app \
  vendor/bin/wp theme activate agl-general-template --allow-root
```

### Start Cording

Start cording
Browser-sync read to docker machine port `http://localhost:8888` using proxy.
So make sure starting docker container.

```sh
docker-compose -f ./docker/docker-compose.yml up -d
npm run wp:dev
```

> http://localhost:8080

```sh
npm run wp:build
```

## PHP Code test

```
cd wordpress
composer test
```

## Install Wordpress plugins

Don't install from Wordpress admin page. Should install by composer.

```sh
cd wordpress
composer require "wpackagist-plugin/all-in-one-wp-migration":"7.47"
composer require "wpackagist-plugin/contact-form-7":"5.4.2"
composer require "wpackagist-plugin/mw-wp-form":"4.4.0"
```

> https://wpackagist.org

## How to share database

use all-in-one-wp-migration.
Include only sql, Do not include any others like theme, plugin and uploads files.

## Screenshot log

TODO: 未実装

**仕様について**
`axois`などXHRを利用して、localサーバーのlocalhost:8888/wp-json/wp/v2/のwp-rest-apiから全ページ情報を取得し、
その取得したURLをスクリーンショットして保存する。

1. wp-json/wp/v2/typesでカスタムポストタイプも含めた全てのポストタイプを取得する
2. wp-json/wp/v2/page/*から固定ページをすべて取得する。
3. wp-json/wp/v2/post/*から固定ページをすべて取得する。
4. wp-json/wp/v2/postからブログ一覧ページを取得する。
5. wp-json/wp/v2/post/*からブログ詳細ページを取得する。
6. wp-json/wp/v2/post-type-nameから一覧ページを取得する。
7. wp-json/wp/v2/post-type-name/*からカスタムポストタイプの詳細ページを取得する。

