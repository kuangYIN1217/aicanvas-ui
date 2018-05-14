#!/bin/sh
sed -i "s/&REPLACE_HOST_DT&:&REPLACE_PORT_DT&/$HOST_IP_DT:$HOST_PORT_DT/g" ./main.bundle.js;
sed -i "s/&REPLACE_HOST_DS&:&REPLACE_PORT_DS&/$HOST_IP_DS:$HOST_PORT_DS/g" ./main.bundle.js;
nginx -g "daemon off;"
