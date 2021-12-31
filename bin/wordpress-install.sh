#!/bin/sh

composer require wp-cli/wp-cli-bundle

vendor/bin/wp core install \
  --url="http://localhost:8888" \
  --title="Test Theme" \
  --admin_user="admin" \
  --admin_password="password" \
  --admin_email="test@allgrow-lab.jp" \
  --allow-root

vendor/bin/wp rewrite structure "/%post_id%" --allow-root
vendor/bin/wp option update rich_editing false --allow-root
vendor/bin/wp option update show_admin_bar_front false --allow-root
vendor/bin/wp option update timezone_string $(vendor/bin/wp eval "echo _x('0', 'default GMT offset or timezone string');" --allow-root) --allow-root
vendor/bin/wp option update posts_per_page 5 --allow-root
vendor/bin/wp option update page_comments 1 --allow-root
vendor/bin/wp option update comments_per_page 5 --allow-root

vendor/bin/wp plugin deactivate --all --allow-root
