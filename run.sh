#!/bin/sh
sed -i "s/&REPLACE_HOST&:&REPLACE_PORT_DT&/$HOST_IP:$HOST_PORT_DT/g" ./main.bundle.js
sed -i "s/&REPLACE_HOST&:&REPLACE_PORT_DATASET&/$HOST_IP:$HOST_PORT_DATASET/g" ./main.bundle.js
nginx -g "daemon off;"
