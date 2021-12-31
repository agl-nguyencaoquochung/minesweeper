#!/bin/sh

PROJECT_PATH=$(cd $(dirname $(dirname $0)) && pwd)

# https://roots.io/bedrock/
composer create-project roots/bedrock ${PROJECT_PATH}/wordpress

rm -f ${PROJECT_PATH}/wordpress/*.md

echo "DB_NAME='wordpress'
DB_USER='wordpress'
DB_PASSWORD='wordpress'

# Optionally, you can use a data source name (DSN)
# When using a DSN, you can remove the DB_NAME, DB_USER, DB_PASSWORD, and DB_HOST variables
# DATABASE_URL='mysql://database_user:database_password@database_host:database_port/database_name'

# Optional database variables
DB_HOST='192.168.216.10'
DB_PREFIX='wp_'

WP_ENV='development'
WP_HOME='http://localhost:8888'
WP_SITEURL="\${WP_HOME}/wp"

# Specify optional debug.log path
# WP_DEBUG_LOG='/path/to/debug.log'

# Generate your keys here: https://roots.io/salts.html
AUTH_KEY='generateme'
SECURE_AUTH_KEY='generateme'
LOGGED_IN_KEY='generateme'
NONCE_KEY='generateme'
AUTH_SALT='generateme'
SECURE_AUTH_SALT='generateme'
LOGGED_IN_SALT='generateme'
NONCE_SALT='generateme'
" > ${PROJECT_PATH}/wordpress/.env

echo "
# BEGIN WordPress
# The directives (lines) between \"BEGIN WordPress\" and \"END WordPress\" are
# dynamically generated, and should only be modified via WordPress filters.
# Any changes to the directives between these markers will be overwritten.
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>

# END WordPress
" > ${PROJECT_PATH}/wordpress/web/.htaccess
