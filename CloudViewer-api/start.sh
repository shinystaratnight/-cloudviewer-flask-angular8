#!/usr/bin/env bash

set -e

echo 'Welcome to docker startup!'

service ssh start

# If there's a prestart.sh script in the /app directory, run it before starting
PRE_START_PATH=/app/prestart.sh
echo "Checking for script in $PRE_START_PATH"
if [ -f $PRE_START_PATH ] ; then
    echo "Running script $PRE_START_PATH"
    . "$PRE_START_PATH"
else
    echo "There is no script $PRE_START_PATH"
fi

# Start Gunicorn
# exec gunicorn --bind 0.0.0.0:5000 wsgi

# exec gunicorn -k egg:meinheld#gunicorn_worker -c "$GUNICORN_CONF" "$APP_MODULE"

# for ((i = 0 ; i <= 100 ; i++)); do
#   echo "sleep for 30 sec: $i"
#   sleep 30
# done

gunicorn -c gunicorn_conf.py wsgi

# telnet elims.cph1ok3q9izr.us-east-2.rds.amazonaws.com 1433
# traceroute elims.cph1ok3q9izr.us-east-2.rds.amazonaws.com 