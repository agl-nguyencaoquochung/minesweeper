FROM  centos:centos7.6.1810

RUN   yum -y update

RUN   yum -y install git && \
      yum -y install tar && \
      yum -y install tree && \
      yum -y install unzip && \
      yum -y install vim && \
      yum -y install wget && \
      yum -y install curl && \
      yum -y install zip && \
      # yum -y install zsh && \
      yum -y install gcc-c++ && \
      yum -y install make && \
      yum -y install glibc-headers && \
      yum -y install autoconf && \
      yum -y install openssl-devel && \
      yum -y install libyaml-devel && \
      yum -y install readline && \
      yum -y install readline-devel && \
      yum -y install zlib && \
      yum -y install zlib-devel

RUN   yum clean all

WORKDIR /root

# add repositories
RUN   yum -y install epel-release && \
      rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm

# install apache
RUN   yum -y install httpd && \
      yum -y install httpd-devel && \
      yum -y install mod_ssl

RUN   usermod -u 1000 apache

# install mysql
RUN   yum -y install mysql && \
      yum -y install mysql-devel

# install php7
RUN   yum -y install --skip-broken --enablerepo=remi,remi-php74 php && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-devel && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-mbstring && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-mysql && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-dba && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-bcmath && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-gd && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-mcrypt && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-soap && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-xml && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-xmlrpc && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-process && \
      yum -y install --skip-broken --enablerepo=remi,remi-php74 php-pear

# install composer
RUN   php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
      php composer-setup.php && \
      php -r "unlink('composer-setup.php');" && \
      mv composer.phar /usr/local/bin/composer

RUN   mkdir -p /home/apps/dev && \
      mkdir -p /var/log/https/default && \
      mkdir -p /var/log/httpd/vhosts && \
      mkdir -p /var/log/php/dev && \
      mkdir -p /var/lib/php/session/dev

COPY  etc/httpd/conf/httpd.conf /etc/httpd/conf/
COPY  etc/php.ini /etc/

RUN   localedef \
      -i en_US \
      -c -f UTF-8 \
      -A /usr/share/locale/locale.alias en_US.UTF-8

ENV   LANG="en_US.UTF-8" \
      LC_ALL="en_US.UTF-8"
