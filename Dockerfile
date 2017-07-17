# FROM centos:centos7
FROM ubuntu:16.04
USER hinesboy
MAINTAINER hinesboy hines.zhu@gmail.com

# 安装node环境
RUN apt-get -y update
RUN apt-get -y install apt-utils
RUN apt-get -y install g++ curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get -y install nodejs
RUN apt-get -y install npm

# 升级node环境
RUN npm cache clean
RUN npm install -g n
RUN n v6.11.0
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

# build 项目
ADD . /src
RUN cd /src; cnpm install --force

# build
RUN cd /src; npm run build

# 安装nginx
RUN apt-get -y update
RUN apt-get -y install nginx

# 修改nginx配置
ADD ./nginx.conf /etc/nginx/nginx.conf

RUN nginx -t

# 开放http
EXPOSE 80

# start开启nginx
ENTRYPOINT nginx -g "daemon off;"




