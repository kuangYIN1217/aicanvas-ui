FROM node:alpine
MAINTAINER Jermine.hu@qq.com
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . $APP_HOME
RUN  npm install -g cnpm --registry=https://registry.npm.taobao.org ;\
     cnpm install -g yarn ;\
     yarn install -g @angular/cli ;\
     yarn install ;\
     cnpm run build
FROM jermine/nginx
ENV APP_HOME /app
#ENV HOST_IP = '127.0.0.1'
#MAINTAINER Jermine.hu@qq.com
WORKDIR $APP_HOME
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 $APP_HOME/dist .
#CMD sed -i "s/&REPLACEHOST&/$HOST_IP/g" ./main.bundle.js; nginx -g "daemon off;"
#CMD sed -i "s/&REPLACE_HOST&:&REPLACE_PORT&/$HOST_IP:$HOST_PORT/g" ./main.bundle.js; nginx -g "daemon off;"
COPY ./run.sh /run.sh
CMD /.run.sh


