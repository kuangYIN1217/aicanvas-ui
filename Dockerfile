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
#CMD sed -i "s/&REPLACE_HOST_DT&:&REPLACE_PORT_DT&/$HOST_IP_DT:$HOST_PORT_DT/g" ./main.bundle.js;
#CMD sed -i "s/&REPLACE_HOST_DS&:&REPLACE_PORT_DS&/$HOST_IP_DS:$HOST_PORT_DS/g" ./main.bundle.js; nginx -g "daemon off;"
COPY ./run.sh /run.sh
CMD /.run.sh


