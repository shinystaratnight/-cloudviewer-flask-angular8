#!/usr/bin/env bash

# gunicorn --bind 0.0.0.0:5000 wsgi

exec gunicorn -b :5000 wsgi